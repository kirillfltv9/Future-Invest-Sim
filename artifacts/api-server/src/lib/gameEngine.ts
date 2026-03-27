import { type StockPrice, type PortfolioSnapshot, type Holding, type TradeRecord } from "@workspace/db";
import { STOCKS, getStockByTicker } from "./stocks.js";

type MarketSentiment = "bullish" | "bearish" | "neutral";

const NEWS_EVENTS = {
  bullish: [
    "Fed signals rate cuts ahead — markets surge",
    "Strong jobs report boosts investor confidence",
    "Tech earnings beat expectations across the board",
    "Consumer spending hits record highs",
    "Trade deal reached — global markets rally",
    "Inflation cools, boosting growth optimism",
    "Corporate buybacks hit all-time high",
    "Housing market data shows strong recovery",
  ],
  bearish: [
    "Fed raises rates again — recession fears grow",
    "Jobs report disappoints, unemployment rises",
    "Major bank reports unexpected losses",
    "Oil prices spike amid geopolitical tensions",
    "Inflation data hotter than expected",
    "Consumer confidence falls to multi-year low",
    "Supply chain disruptions worsen globally",
    "Credit market stress signals caution",
  ],
  neutral: [
    "Mixed earnings season — winners and losers emerge",
    "Markets trade sideways on low volume",
    "Investors await key economic data this week",
    "Sector rotation underway as growth slows",
    "Analysts debate whether rally can continue",
    "Trading volumes light ahead of holiday",
    "Treasury yields unchanged — stocks mixed",
    "Commodities stable as demand outlook holds",
  ],
  sector: [
    "AI chip demand drives tech sector higher",
    "Healthcare stocks surge on drug approval news",
    "Energy sector falls as oil inventories rise",
    "Financial stocks drop on yield curve concerns",
    "Consumer staples hold firm amid volatility",
    "Auto stocks slip on slower EV adoption data",
    "Streaming wars intensify — media stocks volatile",
    "Dividend stocks in demand as bonds rally",
  ],
};

function seededRandom(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function gaussianRandom(seed: number): number {
  const u1 = seededRandom(seed);
  const u2 = seededRandom(seed + 100);
  return Math.sqrt(-2 * Math.log(u1 + 0.0001)) * Math.cos(2 * Math.PI * u2);
}

export function generateInitialPrices(gameSeed: number, stockList = STOCKS): StockPrice[] {
  return stockList.map((stock, i) => {
    const variance = 1 + gaussianRandom(gameSeed + i * 7) * 0.05;
    const initialPrice = Math.max(1, stock.basePrice * variance);
    return {
      ticker: stock.ticker,
      price: parseFloat(initialPrice.toFixed(2)),
      open: parseFloat(initialPrice.toFixed(2)),
      high: parseFloat(initialPrice.toFixed(2)),
      low: parseFloat(initialPrice.toFixed(2)),
      change: 0,
      changePercent: 0,
      volume: Math.floor(1_000_000 + seededRandom(gameSeed + i * 13) * 50_000_000),
      priceHistory: [parseFloat(initialPrice.toFixed(2))],
    };
  });
}

function getSentiment(day: number, gameSeed: number): MarketSentiment {
  const r = seededRandom(gameSeed + day * 31);
  if (r < 0.35) return "bullish";
  if (r < 0.65) return "neutral";
  return "bearish";
}

function getSentimentMultiplier(sentiment: MarketSentiment): number {
  if (sentiment === "bullish") return 0.0008;
  if (sentiment === "bearish") return -0.0008;
  return 0;
}

export function advancePrices(
  prices: StockPrice[],
  day: number,
  gameSeed: number,
  sentiment: MarketSentiment,
  volatilityMultiplier = 1.0,
  trendBoost = 0,
  eventShock = 0
): StockPrice[] {
  const sentimentBoost = getSentimentMultiplier(sentiment);

  return prices.map((sp, i) => {
    const stock = getStockByTicker(sp.ticker);
    if (!stock) return sp;

    // Guard against corrupted / null prices from DB
    const currentPrice = typeof sp.price === "number" && isFinite(sp.price) && sp.price > 0
      ? sp.price
      : stock.basePrice;

    const seed = gameSeed + day * 1000 + i * 17;
    const effectiveVolatility = stock.volatility * volatilityMultiplier;
    const noise = gaussianRandom(seed) * effectiveVolatility;
    const trendReturn = stock.trend + sentimentBoost + trendBoost;

    // Each stock is affected slightly differently by the event shock (+/- 30% variation)
    const stockEventShock = eventShock * (0.7 + seededRandom(seed + 777) * 0.6);
    const dailyReturn = trendReturn + noise + stockEventShock;
    // Use a relative floor (0.1% of base price) rather than hard $0.50 — keeps crypto prices realistic
    const minPrice = Math.max(0.000001, stock.basePrice * 0.001);
    const rawPrice = currentPrice * (1 + dailyReturn);
    const newPrice = isFinite(rawPrice) && rawPrice > 0 ? Math.max(minPrice, rawPrice) : currentPrice;
    const open = currentPrice;
    const intraVolatility = stock.volatility * 0.5;
    const high = Math.max(open, newPrice) * (1 + Math.abs(gaussianRandom(seed + 500)) * intraVolatility);
    const low = Math.min(open, newPrice) * (1 - Math.abs(gaussianRandom(seed + 501)) * intraVolatility);
    const change = newPrice - open;
    const changePercent = (change / open) * 100;
    const volume = Math.floor(
      1_000_000 + seededRandom(seed + 999) * 50_000_000 * (1 + Math.abs(changePercent) * 0.1)
    );

    const priceHistory = [...(sp.priceHistory || [sp.price]), parseFloat(newPrice.toFixed(2))];

    return {
      ticker: sp.ticker,
      price: parseFloat(newPrice.toFixed(2)),
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2)),
      volume,
      priceHistory,
    };
  });
}

export function getNewsDayEvents(day: number, sentiment: MarketSentiment, gameSeed: number): string[] {
  const events: string[] = [];

  const mainNews = NEWS_EVENTS[sentiment];
  const idx = Math.floor(seededRandom(gameSeed + day * 7) * mainNews.length);
  events.push(mainNews[idx]);

  if (seededRandom(gameSeed + day * 41) > 0.5) {
    const sectorIdx = Math.floor(seededRandom(gameSeed + day * 53) * NEWS_EVENTS.sector.length);
    events.push(NEWS_EVENTS.sector[sectorIdx]);
  }

  return events;
}

export function computePortfolioSnapshot(
  day: number,
  date: string,
  cashBalance: number,
  holdings: Holding[],
  prices: StockPrice[]
): PortfolioSnapshot {
  const priceMap = new Map(prices.map((p) => [p.ticker, p.price]));
  const investedValue = holdings.reduce((sum, h) => {
    const price = priceMap.get(h.ticker) ?? 0;
    return sum + h.shares * price;
  }, 0);

  return {
    day,
    date,
    totalValue: parseFloat((cashBalance + investedValue).toFixed(2)),
    cashBalance: parseFloat(cashBalance.toFixed(2)),
    investedValue: parseFloat(investedValue.toFixed(2)),
  };
}

export function computeHoldingsWithCurrentPrices(holdings: Holding[], prices: StockPrice[]) {
  const priceMap = new Map(prices.map((p) => [p.ticker, p.price]));

  return holdings.map((h) => {
    const currentPrice = priceMap.get(h.ticker) ?? h.avgCostBasis;
    const totalValue = h.shares * currentPrice;
    const gainLoss = totalValue - h.shares * h.avgCostBasis;
    const gainLossPercent = (gainLoss / (h.shares * h.avgCostBasis)) * 100;
    return {
      ticker: h.ticker,
      shares: h.shares,
      avgCostBasis: parseFloat(h.avgCostBasis.toFixed(2)),
      currentPrice: parseFloat(currentPrice.toFixed(2)),
      totalValue: parseFloat(totalValue.toFixed(2)),
      gainLoss: parseFloat(gainLoss.toFixed(2)),
      gainLossPercent: parseFloat(gainLossPercent.toFixed(2)),
    };
  });
}

export function getGameSeed(sessionId: string): number {
  let hash = 0;
  for (let i = 0; i < sessionId.length; i++) {
    hash = (hash << 5) - hash + sessionId.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function formatGameDate(day: number): string {
  const startDate = new Date("2015-03-27");
  startDate.setDate(startDate.getDate() + day);
  return startDate.toISOString().split("T")[0]!;
}

export function getNextSentiment(day: number, gameSeed: number): MarketSentiment {
  return getSentiment(day, gameSeed);
}

export type { MarketSentiment };
