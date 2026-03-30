import { pgTable, text, real, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const gameSessions = pgTable("game_sessions", {
  sessionId: text("session_id").primaryKey(),
  playerName: text("player_name").notNull(),
  currentDay: integer("current_day").notNull().default(0),
  currentDate: text("current_date").notNull(),
  startingCash: real("starting_cash").notNull(),
  cashBalance: real("cash_balance").notNull(),
  holdings: jsonb("holdings").notNull().$type<Holding[]>().default([]),
  stockPrices: jsonb("stock_prices").notNull().$type<StockPrice[]>().default([]),
  portfolioHistory: jsonb("portfolio_history").notNull().$type<PortfolioSnapshot[]>().default([]),
  tradeHistory: jsonb("trade_history").notNull().$type<TradeRecord[]>().default([]),
  marketSentiment: text("market_sentiment").notNull().default("neutral"),
  newsEvents: jsonb("news_events").notNull().$type<string[]>().default([]),
  marketMode: text("market_mode").notNull().default("stocks"),
  gameEra: text("game_era").notNull().default("classic"),
  level: integer("level").notNull().default(1),
  levelStartValue: real("level_start_value").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Holding = {
  ticker: string;
  shares: number;
  avgCostBasis: number;
};

export type StockPrice = {
  ticker: string;
  price: number;
  open: number;
  high: number;
  low: number;
  change: number;
  changePercent: number;
  volume: number;
  priceHistory: number[];
};

export type PortfolioSnapshot = {
  day: number;
  date: string;
  totalValue: number;
  cashBalance: number;
  investedValue: number;
};

export type TradeRecord = {
  day: number;
  date: string;
  ticker: string;
  action: "buy" | "sell";
  shares: number;
  price: number;
  total: number;
};

export const insertGameSessionSchema = createInsertSchema(gameSessions).omit({
  createdAt: true,
  updatedAt: true,
});

export type InsertGameSession = z.infer<typeof insertGameSessionSchema>;
export type GameSession = typeof gameSessions.$inferSelect;
