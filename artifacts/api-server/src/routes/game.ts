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
import { STOCKS, getStocksByMode, isContinent } from "../lib/stocks.js";
import { getHistoricalEvent, FUTURE_BRUTAL_DATES, PRESENT_BRUTAL_DATES } from "../lib/historicalEvents.js";

type GameEra = "classic" | "future" | "present";
const ERA_START: Record<GameEra, string> = { classic: "2015-03-27", future: "2025-03-27", present: "2025-03-27" };
const ERA_END:   Record<GameEra, string> = { classic: "2025-03-27", future: "2035-03-27", present: "2026-12-31" };
const ERA_TOTAL_DAYS: Record<GameEra, number> = { classic: 3653, future: 3653, present: 644 };
const ERA_LABEL: Record<GameEra, string> = {
  classic: "Markets open — March 2015. Survive 10 years of real market history to win.",
  future:  "Future Mode — March 2025. Your predicted decade begins. Survive until 2035.",
  present: "Present Mode — March 2025. AI boom, oil shocks, stagflation. Survive through 2026.",
};
const CLASSIC_BRUTAL_DATES = new Set([
  "2020-02-24", "2020-02-27", "2020-03-09", "2020-03-11",
  "2020-03-12", "2020-03-16", "2020-03-18", "2020-03-20",
  "2022-02-24",
]);
function getEra(session: { gameEra: string }): GameEra {
  if (session.gameEra === "future") return "future";
  if (session.gameEra === "present") return "present";
  return "classic";
}
function isGameWon(date: string, era: GameEra): boolean { return date >= ERA_END[era]; }

const router: IRouter = Router();

function computeTotalPortfolioValue(session: typeof gameSessions.$inferSelect) {
  const prices = session.stockPrices as StockPrice[];
  const holdings = session.holdings as Holding[];
  const priceMap = new Map(prices.map((p) => [p.ticker, p.price]));
  const investedValue = holdings.reduce((sum, h) => sum + h.shares * (priceMap.get(h.ticker) ?? 0), 0);
  return session.cashBalance + investedValue;
}

function buildGameResponse(session: typeof gameSessions.$inferSelect) {
  const prices = session.stockPrices as StockPrice[];
  const holdings = session.holdings as Holding[];
  const era = getEra(session);
  const totalGameDays = ERA_TOTAL_DAYS[era];

  const totalPortfolioValue = computeTotalPortfolioValue(session);
  const totalGainLoss = totalPortfolioValue - session.startingCash;
  const totalGainLossPercent = (totalGainLoss / session.startingCash) * 100;

  const enrichedHoldings = computeHoldingsWithCurrentPrices(holdings, prices);
  const currentDate = session.currentDate ?? ERA_START[era];
  const gameWon = isGameWon(currentDate, era);
  const progressDays = Math.min(session.currentDay, totalGameDays);
  const progressPercent = Math.min(100, (progressDays / totalGameDays) * 100);
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
    gameEra: era,
    gameWon,
    progressDays,
    progressPercent: parseFloat(progressPercent.toFixed(1)),
    yearsElapsed,
    totalDays: totalGameDays,
    daysRemaining: Math.max(0, totalGameDays - progressDays),
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
  const rawContinent = req.body?.continent;
  const continent = isContinent(rawContinent) ? rawContinent : null;
  const rawEra = req.body?.gameEra;
  const gameEra: GameEra = rawEra === "future" ? "future" : rawEra === "present" ? "present" : "classic";
  if (startingCash < 100 || startingCash > 10_000_000) {
    res.status(400).json({ error: "Starting cash must be between $100 and $10,000,000" });
    return;
  }

  const sessionId = randomUUID();
  const gameSeed = getGameSeed(sessionId);
  const initialDate = formatGameDate(0, ERA_START[gameEra]);
  const filteredStocks = getStocksByMode(marketMode, continent);
  const initialPrices = generateInitialPrices(gameSeed, filteredStocks);
  const initialSentiment: MarketSentiment = "neutral";
  const baseLabel = gameEra === "future"
    ? ERA_LABEL.future
    : gameEra === "present"
    ? ERA_LABEL.present
    : marketMode === "crypto" ? "Crypto markets live 24/7 — your digital asset journey begins!"
    : marketMode === "mixed" ? "Stocks & crypto loaded — diversify wisely!"
    : ERA_LABEL.classic;
  const initialNews = [baseLabel];

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
    gameEra,
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

  const sessionEra = getEra(session);
  const eraStart = ERA_START[sessionEra];
  const brutalDates = sessionEra === "future" ? FUTURE_BRUTAL_DATES
    : sessionEra === "present" ? PRESENT_BRUTAL_DATES
    : CLASSIC_BRUTAL_DATES;

  for (let i = 0; i < daysToAdvance; i++) {
    currentDay += 1;
    const newDate = formatGameDate(currentDay, eraStart);

    // Check for a historical event on this date (era-aware)
    const histEvent = getHistoricalEvent(newDate, sessionEra);
    const effectiveSentiment = histEvent ? histEvent.sentiment : getNextSentiment(currentDay, gameSeed);
    lastSentiment = effectiveSentiment;

    // Volatility gradually increases over the game duration (1.0x → 1.8x at end)
    const yearProgress = Math.min(1, currentDay / ERA_TOTAL_DAYS[sessionEra]);
    const timeVolatilityMultiplier = 1.0 + yearProgress * 0.8;
    const EVENT_DAMPENER = histEvent && brutalDates.has(histEvent.date) ? 1.0 : 0.75;
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
