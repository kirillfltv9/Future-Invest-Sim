import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, gameSessions, type Holding, type StockPrice, type PortfolioSnapshot } from "@workspace/db";
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
import { STOCKS, getStocksByMode } from "../lib/stocks.js";
import { getHistoricalEvent } from "../lib/historicalEvents.js";

const GAME_START_DATE = "2015-03-27";
const GAME_END_DATE   = "2025-03-27";
function isGameWon(date: string): boolean { return date >= GAME_END_DATE; }

const router: IRouter = Router();

function computeTotalPortfolioValue(session: typeof gameSessions.$inferSelect) {
  const prices = session.stockPrices as StockPrice[];
  const holdings = session.holdings as Holding[];
  const priceMap = new Map(prices.map((p) => [p.ticker, p.price]));
  const investedValue = holdings.reduce((sum, h) => sum + h.shares * (priceMap.get(h.ticker) ?? 0), 0);
  return session.cashBalance + investedValue;
}

const TOTAL_GAME_DAYS = 3653; // 2015-03-27 → 2025-03-27 (10 years incl. 3 leap years)

function buildGameResponse(session: typeof gameSessions.$inferSelect) {
  const prices = session.stockPrices as StockPrice[];
  const holdings = session.holdings as Holding[];

  const totalPortfolioValue = computeTotalPortfolioValue(session);
  const totalGainLoss = totalPortfolioValue - session.startingCash;
  const totalGainLossPercent = (totalGainLoss / session.startingCash) * 100;

  const enrichedHoldings = computeHoldingsWithCurrentPrices(holdings, prices);
  const currentDate = session.currentDate ?? GAME_START_DATE;
  const gameWon = isGameWon(currentDate);
  const progressDays = Math.min(session.currentDay, TOTAL_GAME_DAYS);
  const progressPercent = Math.min(100, (progressDays / TOTAL_GAME_DAYS) * 100);
  const yearsElapsed = parseFloat((progressDays / 365.25).toFixed(1));

  return {
    sessionId: session.sessionId,
    playerName: session.playerName,
    currentDay: session.currentDay,
    currentDate,
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
    marketMode: (session.marketMode ?? "stocks") as "stocks" | "crypto" | "mixed",
    gameWon,
    progressDays,
    progressPercent: parseFloat(progressPercent.toFixed(1)),
    yearsElapsed,
    totalDays: TOTAL_GAME_DAYS,
    daysRemaining: Math.max(0, TOTAL_GAME_DAYS - progressDays),
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
  const rawMode = req.body?.marketMode;
  const marketMode: "stocks" | "crypto" | "mixed" =
    rawMode === "crypto" || rawMode === "mixed" ? rawMode : "stocks";
  if (startingCash < 100 || startingCash > 10_000_000) {
    res.status(400).json({ error: "Starting cash must be between $100 and $10,000,000" });
    return;
  }

  const sessionId = randomUUID();
  const gameSeed = getGameSeed(sessionId);
  const initialDate = formatGameDate(0); // 2015-03-27
  const filteredStocks = getStocksByMode(marketMode);
  const initialPrices = generateInitialPrices(gameSeed, filteredStocks);
  const initialSentiment: MarketSentiment = "neutral";
  const modeLabel = marketMode === "crypto" ? "Crypto markets live 24/7 — your digital asset journey begins!" :
                    marketMode === "mixed" ? "Stocks & crypto loaded — diversify wisely!" :
                    "Markets open — March 2015. Survive 10 years of real market history to win.";
  const initialNews = [modeLabel];

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
    marketMode,
    level: 1,
    levelStartValue: startingCash,
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
  const rawDays = req.body?.days;
  const daysToAdvance = Number.isInteger(rawDays) && rawDays >= 1 && rawDays <= 30 ? rawDays : 1;

  const session = await db.query.gameSessions.findFirst({
    where: eq(gameSessions.sessionId, sessionId!),
  });

  if (!session) {
    res.status(404).json({ error: "Game session not found" });
    return;
  }

  const gameSeed = getGameSeed(session.sessionId);
  let currentDay = session.currentDay;
  let currentPrices = session.stockPrices as StockPrice[];
  let cashBalance = session.cashBalance;
  const holdings = session.holdings as Holding[];
  const history = [...(session.portfolioHistory as PortfolioSnapshot[])];

  let lastSentiment: MarketSentiment = session.marketSentiment as MarketSentiment;
  let lastNews: string[] = [];

  for (let i = 0; i < daysToAdvance; i++) {
    currentDay += 1;
    const newDate = formatGameDate(currentDay);

    // Check for a real historical event on this date
    const histEvent = getHistoricalEvent(newDate);
    const effectiveSentiment = histEvent ? histEvent.sentiment : getNextSentiment(currentDay, gameSeed);
    lastSentiment = effectiveSentiment;

    // Volatility gradually increases over the 10 years (1.0x → 1.8x at year 10)
    const yearProgress = Math.min(1, currentDay / TOTAL_GAME_DAYS);
    const timeVolatilityMultiplier = 1.0 + yearProgress * 0.8;
    const BRUTAL_EVENTS = new Set(["2020-03-11", "2022-02-24"]);
    const EVENT_DAMPENER = histEvent && BRUTAL_EVENTS.has(histEvent.date) ? 1.0 : 0.82;
    const eventVolatilityBoost = histEvent ? histEvent.volatilityBoost * EVENT_DAMPENER : 0;
    const finalVolatilityMultiplier = timeVolatilityMultiplier + eventVolatilityBoost;

    currentPrices = advancePrices(
      currentPrices,
      currentDay,
      gameSeed,
      effectiveSentiment,
      finalVolatilityMultiplier,
      0,
      histEvent ? histEvent.marketShock * EVENT_DAMPENER : 0
    );

    const dayDividendEvents: string[] = [];
    for (const holding of holdings) {
      const stockDef = STOCKS.find((s) => s.ticker === holding.ticker);
      if (stockDef && stockDef.dividendYield > 0) {
        const priceObj = currentPrices.find((p) => p.ticker === holding.ticker);
        const price = priceObj?.price ?? 0;
        const dailyDividend = (stockDef.dividendYield / 252) * holding.shares * price;
        if (dailyDividend > 0.01) {
          cashBalance += dailyDividend;
          dayDividendEvents.push(`${holding.ticker} dividend: $${dailyDividend.toFixed(2)}`);
        }
      }
    }

    const snapshot = computePortfolioSnapshot(currentDay, newDate, cashBalance, holdings, currentPrices);
    history.push(snapshot);

    if (i === daysToAdvance - 1) {
      const baseNews = getNewsDayEvents(currentDay, effectiveSentiment, gameSeed);
      // Historical event headline goes first if present
      lastNews = histEvent
        ? [histEvent.headline, ...dayDividendEvents, ...baseNews]
        : [...dayDividendEvents, ...baseNews];
    }
  }

  const currentDate = formatGameDate(currentDay);

  await db
    .update(gameSessions)
    .set({
      currentDay,
      currentDate,
      stockPrices: currentPrices,
      cashBalance,
      portfolioHistory: history,
      marketSentiment: lastSentiment,
      newsEvents: lastNews,
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
