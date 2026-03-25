import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, gameSessions, type Holding, type StockPrice } from "@workspace/db";
import { CreateGameBody, ExecuteTradeBody } from "@workspace/api-zod";
import { randomUUID } from "crypto";
import {
  generateInitialPrices,
  advancePrices,
  getNewsDayEvents,
  computePortfolioSnapshot,
  computeHoldingsWithCurrentPrices,
  getGameSeed,
  formatGameDate,
  getNextSentiment,
  type MarketSentiment,
} from "../lib/gameEngine.js";
import { STOCKS } from "../lib/stocks.js";

const router: IRouter = Router();

function buildGameResponse(session: typeof gameSessions.$inferSelect) {
  const prices = session.stockPrices as StockPrice[];
  const holdings = session.holdings as Holding[];
  const priceMap = new Map(prices.map((p) => [p.ticker, p.price]));

  const investedValue = holdings.reduce((sum, h) => {
    return sum + h.shares * (priceMap.get(h.ticker) ?? 0);
  }, 0);

  const totalPortfolioValue = session.cashBalance + investedValue;
  const totalGainLoss = totalPortfolioValue - session.startingCash;
  const totalGainLossPercent = (totalGainLoss / session.startingCash) * 100;

  const enrichedHoldings = computeHoldingsWithCurrentPrices(holdings, prices);

  return {
    sessionId: session.sessionId,
    playerName: session.playerName,
    currentDay: session.currentDay,
    currentDate: session.currentDate,
    startingCash: session.startingCash,
    cashBalance: session.cashBalance,
    holdings: enrichedHoldings,
    stockPrices: prices.map((p) => ({
      ticker: p.ticker,
      price: p.price,
      open: p.open,
      high: p.high,
      low: p.low,
      change: p.change,
      changePercent: p.changePercent,
      volume: p.volume,
    })),
    portfolioHistory: session.portfolioHistory,
    tradeHistory: session.tradeHistory,
    totalPortfolioValue: parseFloat(totalPortfolioValue.toFixed(2)),
    totalGainLoss: parseFloat(totalGainLoss.toFixed(2)),
    totalGainLossPercent: parseFloat(totalGainLossPercent.toFixed(2)),
    marketSentiment: session.marketSentiment as MarketSentiment,
    newsEvents: session.newsEvents as string[],
  };
}

router.get("/stocks", (_req, res) => {
  const stocks = STOCKS.map(({ ticker, name, sector, description, volatility, dividendYield }) => ({
    ticker,
    name,
    sector,
    description,
    volatility,
    dividendYield,
  }));
  res.json(stocks);
});

router.post("/game/new", async (req, res) => {
  const parseResult = CreateGameBody.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const { startingCash, playerName } = parseResult.data;

  if (startingCash < 100 || startingCash > 10_000_000) {
    res.status(400).json({ error: "Starting cash must be between $100 and $10,000,000" });
    return;
  }

  const sessionId = randomUUID();
  const gameSeed = getGameSeed(sessionId);
  const initialDate = formatGameDate(0);
  const initialPrices = generateInitialPrices(gameSeed);
  const initialSentiment: MarketSentiment = "neutral";
  const initialNews = ["Markets open — your investment journey begins today. Choose wisely!"];

  const initialSnapshot = computePortfolioSnapshot(0, initialDate, startingCash, [], initialPrices);

  await db.insert(gameSessions).values({
    sessionId,
    playerName,
    currentDay: 0,
    currentDate: initialDate,
    startingCash,
    cashBalance: startingCash,
    holdings: [],
    stockPrices: initialPrices,
    portfolioHistory: [initialSnapshot],
    tradeHistory: [],
    marketSentiment: initialSentiment,
    newsEvents: initialNews,
  });

  const session = await db.query.gameSessions.findFirst({
    where: eq(gameSessions.sessionId, sessionId),
  });

  if (!session) {
    res.status(500).json({ error: "Failed to create game session" });
    return;
  }

  res.status(201).json(buildGameResponse(session));
});

router.get("/game/:sessionId", async (req, res) => {
  const { sessionId } = req.params;
  const session = await db.query.gameSessions.findFirst({
    where: eq(gameSessions.sessionId, sessionId!),
  });

  if (!session) {
    res.status(404).json({ error: "Game session not found" });
    return;
  }

  res.json(buildGameResponse(session));
});

router.post("/game/:sessionId/advance", async (req, res) => {
  const { sessionId } = req.params;
  const session = await db.query.gameSessions.findFirst({
    where: eq(gameSessions.sessionId, sessionId!),
  });

  if (!session) {
    res.status(404).json({ error: "Game session not found" });
    return;
  }

  const gameSeed = getGameSeed(session.sessionId);
  const newDay = session.currentDay + 1;
  const newDate = formatGameDate(newDay);
  const sentiment = getNextSentiment(newDay, gameSeed);
  const currentPrices = session.stockPrices as StockPrice[];
  const newPrices = advancePrices(currentPrices, newDay, gameSeed, sentiment);
  const newsEvents = getNewsDayEvents(newDay, sentiment, gameSeed);
  const holdings = session.holdings as Holding[];

  let cashBalance = session.cashBalance;
  const dividendEvents: string[] = [];

  for (const holding of holdings) {
    const stockDef = STOCKS.find((s) => s.ticker === holding.ticker);
    if (stockDef && stockDef.dividendYield > 0) {
      const priceObj = newPrices.find((p) => p.ticker === holding.ticker);
      const currentPrice = priceObj?.price ?? 0;
      const dailyDividend = (stockDef.dividendYield / 252) * holding.shares * currentPrice;
      if (dailyDividend > 0.01) {
        cashBalance += dailyDividend;
        dividendEvents.push(
          `${holding.ticker} dividend paid: $${dailyDividend.toFixed(2)}`
        );
      }
    }
  }

  const snapshot = computePortfolioSnapshot(newDay, newDate, cashBalance, holdings, newPrices);
  const history = [...(session.portfolioHistory as []), snapshot];

  const allNews = [...dividendEvents, ...newsEvents];

  await db
    .update(gameSessions)
    .set({
      currentDay: newDay,
      currentDate: newDate,
      stockPrices: newPrices,
      cashBalance,
      portfolioHistory: history,
      marketSentiment: sentiment,
      newsEvents: allNews,
      updatedAt: new Date(),
    })
    .where(eq(gameSessions.sessionId, sessionId!));

  const updatedSession = await db.query.gameSessions.findFirst({
    where: eq(gameSessions.sessionId, sessionId!),
  });

  res.json(buildGameResponse(updatedSession!));
});

router.post("/game/:sessionId/trade", async (req, res) => {
  const { sessionId } = req.params;
  const parseResult = ExecuteTradeBody.safeParse(req.body);

  if (!parseResult.success) {
    res.status(400).json({ error: "Invalid trade request" });
    return;
  }

  const { ticker, action, shares } = parseResult.data;

  if (shares <= 0 || !Number.isFinite(shares)) {
    res.status(400).json({ error: "Shares must be a positive number" });
    return;
  }

  const session = await db.query.gameSessions.findFirst({
    where: eq(gameSessions.sessionId, sessionId!),
  });

  if (!session) {
    res.status(404).json({ error: "Game session not found" });
    return;
  }

  const prices = session.stockPrices as StockPrice[];
  const priceObj = prices.find((p) => p.ticker === ticker);

  if (!priceObj) {
    res.status(400).json({ error: `Stock ${ticker} not found` });
    return;
  }

  const currentPrice = priceObj.price;
  const totalCost = shares * currentPrice;

  let holdings = [...(session.holdings as Holding[])];
  let cashBalance = session.cashBalance;

  if (action === "buy") {
    if (totalCost > cashBalance) {
      res.status(400).json({ error: `Insufficient funds. Need $${totalCost.toFixed(2)}, have $${cashBalance.toFixed(2)}` });
      return;
    }

    cashBalance -= totalCost;
    const existingHolding = holdings.find((h) => h.ticker === ticker);
    if (existingHolding) {
      const existingCost = existingHolding.shares * existingHolding.avgCostBasis;
      const newTotalCost = existingCost + totalCost;
      const newTotalShares = existingHolding.shares + shares;
      existingHolding.avgCostBasis = newTotalCost / newTotalShares;
      existingHolding.shares = newTotalShares;
    } else {
      holdings.push({ ticker, shares, avgCostBasis: currentPrice });
    }
  } else if (action === "sell") {
    const existingHolding = holdings.find((h) => h.ticker === ticker);
    if (!existingHolding || existingHolding.shares < shares) {
      res.status(400).json({ error: `Insufficient shares. Have ${existingHolding?.shares ?? 0}, trying to sell ${shares}` });
      return;
    }

    cashBalance += totalCost;
    existingHolding.shares -= shares;
    if (existingHolding.shares < 0.0001) {
      holdings = holdings.filter((h) => h.ticker !== ticker);
    }
  } else {
    res.status(400).json({ error: "Action must be buy or sell" });
    return;
  }

  const tradeRecord = {
    day: session.currentDay,
    date: session.currentDate,
    ticker,
    action,
    shares,
    price: parseFloat(currentPrice.toFixed(2)),
    total: parseFloat(totalCost.toFixed(2)),
  };

  const tradeHistory = [...(session.tradeHistory as []), tradeRecord];

  await db
    .update(gameSessions)
    .set({
      cashBalance,
      holdings,
      tradeHistory,
      updatedAt: new Date(),
    })
    .where(eq(gameSessions.sessionId, sessionId!));

  const updatedSession = await db.query.gameSessions.findFirst({
    where: eq(gameSessions.sessionId, sessionId!),
  });

  res.json(buildGameResponse(updatedSession!));
});

export default router;
