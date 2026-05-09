import { randomUUID } from "crypto";
import type { WebSocket } from "ws";
import type { StockPrice, Holding } from "@workspace/db";
import {
  generateInitialPrices,
  advancePrices,
  getNewsDayEvents,
  getNextSentiment,
  formatGameDate,
  type MarketSentiment,
} from "./gameEngine.js";
import { getStocksByMode } from "./stocks.js";

export type MarketMode = "stocks" | "crypto" | "mixed";
export type RoomStatus = "lobby" | "playing" | "finished";

export interface AvatarConfig {
  skin: string;
  hair: string;
  expression: string;
  hat: string;
  top: string;
  topLabel: string;
  bottoms: string;
}

export interface MultiplayerPlayer {
  id: string;
  name: string;
  socket: WebSocket | null;
  isHost: boolean;
  cash: number;
  holdings: Holding[];
  startingCash: number;
  joinedAtRound: number;
  connected: boolean;
  avatar: AvatarConfig | null;
}

export interface PendingJoin {
  requestId: string;
  playerName: string;
  socket: WebSocket;
  createdAt: number;
  avatar: AvatarConfig | null;
}

export interface RankSnapshot {
  round: number;
  ranks: Record<string, number>;
}

export interface MultiplayerRoom {
  code: string;
  hostId: string;
  players: Map<string, MultiplayerPlayer>;
  pendingJoins: Map<string, PendingJoin>;
  status: RoomStatus;
  marketMode: MarketMode;
  startingCash: number;
  totalRounds: number;
  currentRound: number;
  currentDay: number;
  startDate: string;
  currentDate: string;
  prices: StockPrice[];
  sentiment: MarketSentiment;
  news: string[];
  gameSeed: number;
  rankHistory: RankSnapshot[];
  createdAt: number;
}

const ROOMS = new Map<string, MultiplayerRoom>();
const SOCKET_TO_ROOM = new WeakMap<WebSocket, { roomCode: string; playerId: string }>();
const MULTIPLAYER_START_DATE = "2025-03-27";
const DAYS_PER_ROUND = 5;
const ROOM_CODE_LENGTH = 6;
const ROOM_CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no I, O, 0, 1

function generateRoomCode(): string {
  for (let attempt = 0; attempt < 50; attempt++) {
    let code = "";
    for (let i = 0; i < ROOM_CODE_LENGTH; i++) {
      code += ROOM_CODE_CHARS[Math.floor(Math.random() * ROOM_CODE_CHARS.length)];
    }
    if (!ROOMS.has(code)) return code;
  }
  throw new Error("Failed to generate unique room code");
}

function seedFromCode(code: string): number {
  let hash = 0;
  for (let i = 0; i < code.length; i++) {
    hash = (hash << 5) - hash + code.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) || 1;
}

export function getRoom(code: string): MultiplayerRoom | undefined {
  return ROOMS.get(code.toUpperCase());
}

export function getRoomBySocket(socket: WebSocket):
  | { room: MultiplayerRoom; playerId: string }
  | undefined {
  const ref = SOCKET_TO_ROOM.get(socket);
  if (!ref) return undefined;
  const room = ROOMS.get(ref.roomCode);
  if (!room) return undefined;
  return { room, playerId: ref.playerId };
}

export function createRoom(opts: {
  hostName: string;
  hostSocket: WebSocket;
  marketMode: MarketMode;
  startingCash: number;
  totalRounds: number;
  avatar: AvatarConfig | null;
}): { room: MultiplayerRoom; player: MultiplayerPlayer } {
  const code = generateRoomCode();
  const gameSeed = seedFromCode(code);
  const stockList = getStocksByMode(opts.marketMode);
  const prices = generateInitialPrices(gameSeed, stockList);
  const hostId = randomUUID();

  const host: MultiplayerPlayer = {
    id: hostId,
    name: opts.hostName,
    socket: opts.hostSocket,
    isHost: true,
    cash: opts.startingCash,
    holdings: [],
    startingCash: opts.startingCash,
    joinedAtRound: 0,
    connected: true,
    avatar: opts.avatar,
  };

  const room: MultiplayerRoom = {
    code,
    hostId,
    players: new Map([[hostId, host]]),
    pendingJoins: new Map(),
    status: "lobby",
    marketMode: opts.marketMode,
    startingCash: opts.startingCash,
    totalRounds: opts.totalRounds,
    currentRound: 0,
    currentDay: 0,
    startDate: MULTIPLAYER_START_DATE,
    currentDate: MULTIPLAYER_START_DATE,
    prices,
    sentiment: "neutral",
    news: ["Multiplayer market opens — may the best portfolio win."],
    gameSeed,
    rankHistory: [],
    createdAt: Date.now(),
  };

  ROOMS.set(code, room);
  SOCKET_TO_ROOM.set(opts.hostSocket, { roomCode: code, playerId: hostId });

  return { room, player: host };
}

export function addPendingJoin(opts: {
  roomCode: string;
  playerName: string;
  socket: WebSocket;
  avatar: AvatarConfig | null;
}): { ok: true; requestId: string } | { ok: false; reason: string } {
  const room = getRoom(opts.roomCode);
  if (!room) return { ok: false, reason: "Room not found" };
  if (room.status !== "lobby")
    return { ok: false, reason: "Game has already started" };
  if (room.players.size >= 8) return { ok: false, reason: "Room is full" };

  // Disallow duplicate pending join from the same socket
  for (const [, pending] of room.pendingJoins) {
    if (pending.socket === opts.socket)
      return { ok: false, reason: "Join request already pending" };
  }

  const requestId = randomUUID();
  room.pendingJoins.set(requestId, {
    requestId,
    playerName: opts.playerName,
    socket: opts.socket,
    createdAt: Date.now(),
    avatar: opts.avatar,
  });
  return { ok: true, requestId };
}

export function acceptJoin(opts: {
  roomCode: string;
  hostId: string;
  requestId: string;
}):
  | { ok: true; room: MultiplayerRoom; player: MultiplayerPlayer; socket: WebSocket }
  | { ok: false; reason: string } {
  const room = getRoom(opts.roomCode);
  if (!room) return { ok: false, reason: "Room not found" };
  if (room.hostId !== opts.hostId)
    return { ok: false, reason: "Only the host can accept" };
  if (room.status !== "lobby")
    return { ok: false, reason: "Game has already started" };

  const pending = room.pendingJoins.get(opts.requestId);
  if (!pending) return { ok: false, reason: "Request not found" };
  room.pendingJoins.delete(opts.requestId);

  const playerId = randomUUID();
  const player: MultiplayerPlayer = {
    id: playerId,
    name: pending.playerName,
    socket: pending.socket,
    isHost: false,
    cash: room.startingCash,
    holdings: [],
    startingCash: room.startingCash,
    joinedAtRound: room.currentRound,
    connected: true,
    avatar: pending.avatar,
  };

  room.players.set(playerId, player);
  SOCKET_TO_ROOM.set(pending.socket, { roomCode: room.code, playerId });

  return { ok: true, room, player, socket: pending.socket };
}

export function denyJoin(opts: {
  roomCode: string;
  hostId: string;
  requestId: string;
}): { ok: true; socket: WebSocket } | { ok: false; reason: string } {
  const room = getRoom(opts.roomCode);
  if (!room) return { ok: false, reason: "Room not found" };
  if (room.hostId !== opts.hostId)
    return { ok: false, reason: "Only the host can deny" };
  const pending = room.pendingJoins.get(opts.requestId);
  if (!pending) return { ok: false, reason: "Request not found" };
  room.pendingJoins.delete(opts.requestId);
  return { ok: true, socket: pending.socket };
}

export function startGame(opts: {
  roomCode: string;
  hostId: string;
}): { ok: true; room: MultiplayerRoom } | { ok: false; reason: string } {
  const room = getRoom(opts.roomCode);
  if (!room) return { ok: false, reason: "Room not found" };
  if (room.hostId !== opts.hostId)
    return { ok: false, reason: "Only the host can start" };
  if (room.status !== "lobby")
    return { ok: false, reason: "Game already started" };

  room.status = "playing";
  // Snapshot rank 0 (everyone tied at starting value)
  const ranks: Record<string, number> = {};
  for (const id of room.players.keys()) ranks[id] = 1;
  room.rankHistory = [{ round: 0, ranks }];
  return { ok: true, room };
}

export function advanceRound(opts: {
  roomCode: string;
  hostId: string;
}): { ok: true; room: MultiplayerRoom; finished: boolean } | { ok: false; reason: string } {
  const room = getRoom(opts.roomCode);
  if (!room) return { ok: false, reason: "Room not found" };
  if (room.hostId !== opts.hostId)
    return { ok: false, reason: "Only the host can advance the round" };
  if (room.status !== "playing")
    return { ok: false, reason: "Game is not in progress" };
  if (room.currentRound >= room.totalRounds)
    return { ok: false, reason: "Game is already finished" };

  let prices = room.prices;
  let sentiment: MarketSentiment = room.sentiment;
  let lastNews: string[] = [];

  for (let i = 0; i < DAYS_PER_ROUND; i++) {
    room.currentDay += 1;
    sentiment = getNextSentiment(room.currentDay, room.gameSeed);
    // Slight time-based volatility ramp
    const yearProgress = Math.min(1, room.currentRound / room.totalRounds);
    const volatilityMultiplier = 1.0 + yearProgress * 0.5;
    prices = advancePrices(prices, room.currentDay, room.gameSeed, sentiment, volatilityMultiplier, 0, 0);

    if (i === DAYS_PER_ROUND - 1) {
      lastNews = getNewsDayEvents(room.currentDay, sentiment, room.gameSeed);
    }
  }

  room.prices = prices;
  room.sentiment = sentiment;
  room.news = lastNews;
  room.currentDate = formatGameDate(room.currentDay, room.startDate);
  room.currentRound += 1;

  // Snapshot ranks based on portfolio value
  const standings = computeLeaderboard(room);
  const ranks: Record<string, number> = {};
  for (const entry of standings) ranks[entry.playerId] = entry.rank;
  room.rankHistory.push({ round: room.currentRound, ranks });

  const finished = room.currentRound >= room.totalRounds;
  if (finished) room.status = "finished";

  return { ok: true, room, finished };
}

export function executeTrade(opts: {
  roomCode: string;
  playerId: string;
  ticker: string;
  action: "buy" | "sell";
  shares: number;
}): { ok: true; room: MultiplayerRoom } | { ok: false; reason: string } {
  const room = getRoom(opts.roomCode);
  if (!room) return { ok: false, reason: "Room not found" };
  if (room.status !== "playing") return { ok: false, reason: "Game not active" };
  const player = room.players.get(opts.playerId);
  if (!player) return { ok: false, reason: "Player not in room" };
  if (!Number.isFinite(opts.shares) || opts.shares <= 0)
    return { ok: false, reason: "Shares must be a positive number" };

  const priceObj = room.prices.find((p) => p.ticker === opts.ticker);
  if (!priceObj) return { ok: false, reason: `Stock ${opts.ticker} not found` };

  const total = priceObj.price * opts.shares;

  if (opts.action === "buy") {
    if (total > player.cash) return { ok: false, reason: "Insufficient funds" };
    player.cash -= total;
    const existing = player.holdings.find((h) => h.ticker === opts.ticker);
    if (existing) {
      const existingCost = existing.shares * existing.avgCostBasis;
      const newShares = existing.shares + opts.shares;
      existing.avgCostBasis = (existingCost + total) / newShares;
      existing.shares = newShares;
    } else {
      player.holdings.push({ ticker: opts.ticker, shares: opts.shares, avgCostBasis: priceObj.price });
    }
  } else {
    const existing = player.holdings.find((h) => h.ticker === opts.ticker);
    if (!existing || existing.shares < opts.shares)
      return { ok: false, reason: "Insufficient shares" };
    player.cash += total;
    existing.shares -= opts.shares;
    if (existing.shares < 0.0001) {
      player.holdings = player.holdings.filter((h) => h.ticker !== opts.ticker);
    }
  }

  return { ok: true, room };
}

export interface LeaderboardEntry {
  playerId: string;
  name: string;
  isHost: boolean;
  connected: boolean;
  cash: number;
  investedValue: number;
  totalValue: number;
  startingCash: number;
  returnPercent: number;
  rank: number;
  previousRank: number | null;
  rankDelta: number; // positive = moved up
  avatar: AvatarConfig | null;
}

function portfolioValue(player: MultiplayerPlayer, prices: StockPrice[]): number {
  const priceMap = new Map(prices.map((p) => [p.ticker, p.price]));
  const invested = player.holdings.reduce(
    (sum, h) => sum + h.shares * (priceMap.get(h.ticker) ?? 0),
    0,
  );
  return player.cash + invested;
}

export function computeLeaderboard(room: MultiplayerRoom): LeaderboardEntry[] {
  const previousSnapshot = room.rankHistory.length >= 2
    ? room.rankHistory[room.rankHistory.length - 2]
    : null;
  const entries = Array.from(room.players.values()).map((p) => {
    const total = portfolioValue(p, room.prices);
    const invested = total - p.cash;
    const returnPercent = ((total - p.startingCash) / p.startingCash) * 100;
    return {
      playerId: p.id,
      name: p.name,
      isHost: p.isHost,
      connected: p.connected,
      cash: parseFloat(p.cash.toFixed(2)),
      investedValue: parseFloat(invested.toFixed(2)),
      totalValue: parseFloat(total.toFixed(2)),
      startingCash: p.startingCash,
      returnPercent: parseFloat(returnPercent.toFixed(2)),
      avatar: p.avatar,
    };
  });
  entries.sort((a, b) => b.totalValue - a.totalValue);
  return entries.map((e, idx) => {
    const rank = idx + 1;
    const previousRank = previousSnapshot?.ranks[e.playerId] ?? null;
    const rankDelta = previousRank !== null ? previousRank - rank : 0;
    return { ...e, rank, previousRank, rankDelta };
  });
}

export interface RoomPublicState {
  code: string;
  hostId: string;
  status: RoomStatus;
  marketMode: MarketMode;
  startingCash: number;
  currentRound: number;
  totalRounds: number;
  currentDay: number;
  currentDate: string;
  startDate: string;
  sentiment: MarketSentiment;
  news: string[];
  prices: Array<{
    ticker: string;
    price: number;
    open: number;
    high: number;
    low: number;
    change: number;
    changePercent: number;
    volume: number;
  }>;
  players: Array<{
    id: string;
    name: string;
    isHost: boolean;
    connected: boolean;
    avatar: AvatarConfig | null;
  }>;
  pendingJoins: Array<{ requestId: string; playerName: string }>;
  leaderboard: LeaderboardEntry[];
}

export function buildRoomPublicState(room: MultiplayerRoom): RoomPublicState {
  const leaderboard = computeLeaderboard(room);
  return {
    code: room.code,
    hostId: room.hostId,
    status: room.status,
    marketMode: room.marketMode,
    startingCash: room.startingCash,
    currentRound: room.currentRound,
    totalRounds: room.totalRounds,
    currentDay: room.currentDay,
    currentDate: room.currentDate,
    startDate: room.startDate,
    sentiment: room.sentiment,
    news: room.news,
    prices: room.prices.map((p) => ({
      ticker: p.ticker,
      price: p.price,
      open: p.open,
      high: p.high,
      low: p.low,
      change: p.change,
      changePercent: p.changePercent,
      volume: p.volume,
    })),
    players: Array.from(room.players.values()).map((p) => ({
      id: p.id,
      name: p.name,
      isHost: p.isHost,
      connected: p.connected,
      avatar: p.avatar,
    })),
    pendingJoins: Array.from(room.pendingJoins.values()).map((p) => ({
      requestId: p.requestId,
      playerName: p.playerName,
    })),
    leaderboard,
  };
}

export interface PlayerView {
  playerId: string;
  cash: number;
  holdings: Array<{
    ticker: string;
    shares: number;
    avgCostBasis: number;
    currentPrice: number;
    totalValue: number;
    gainLoss: number;
    gainLossPercent: number;
  }>;
}

export function buildPlayerView(room: MultiplayerRoom, playerId: string): PlayerView | null {
  const player = room.players.get(playerId);
  if (!player) return null;
  const priceMap = new Map(room.prices.map((p) => [p.ticker, p.price]));
  return {
    playerId,
    cash: parseFloat(player.cash.toFixed(2)),
    holdings: player.holdings.map((h) => {
      const currentPrice = priceMap.get(h.ticker) ?? h.avgCostBasis;
      const totalValue = h.shares * currentPrice;
      const cost = h.shares * h.avgCostBasis;
      const gainLoss = totalValue - cost;
      const gainLossPercent = cost > 0 ? (gainLoss / cost) * 100 : 0;
      return {
        ticker: h.ticker,
        shares: h.shares,
        avgCostBasis: parseFloat(h.avgCostBasis.toFixed(2)),
        currentPrice: parseFloat(currentPrice.toFixed(2)),
        totalValue: parseFloat(totalValue.toFixed(2)),
        gainLoss: parseFloat(gainLoss.toFixed(2)),
        gainLossPercent: parseFloat(gainLossPercent.toFixed(2)),
      };
    }),
  };
}

export function handleSocketDisconnect(socket: WebSocket): MultiplayerRoom | null {
  const ref = SOCKET_TO_ROOM.get(socket);
  if (!ref) return null;
  const room = ROOMS.get(ref.roomCode);
  if (!room) return null;

  // Remove any pending join from this socket
  for (const [reqId, pending] of room.pendingJoins) {
    if (pending.socket === socket) room.pendingJoins.delete(reqId);
  }

  const player = room.players.get(ref.playerId);
  if (player) {
    if (room.status === "lobby") {
      // In lobby, drop the player entirely
      room.players.delete(ref.playerId);
      // If host left in lobby, kill the room
      if (player.isHost) {
        ROOMS.delete(room.code);
        return null;
      }
    } else {
      player.connected = false;
      player.socket = null;
    }
  }

  // If room ended up empty, remove it
  if (room.players.size === 0) {
    ROOMS.delete(room.code);
    return null;
  }

  return room;
}

// ─── Save/Resume support ─────────────────────────────────────────────────────

export interface RoomSnapshot {
  code: string;
  hostId: string;
  status: RoomStatus;
  marketMode: MarketMode;
  startingCash: number;
  totalRounds: number;
  currentRound: number;
  currentDay: number;
  startDate: string;
  currentDate: string;
  prices: StockPrice[];
  sentiment: MarketSentiment;
  news: string[];
  gameSeed: number;
  rankHistory: RankSnapshot[];
  players: Array<{
    id: string;
    name: string;
    isHost: boolean;
    cash: number;
    holdings: Holding[];
    startingCash: number;
    joinedAtRound: number;
    avatar: AvatarConfig | null;
  }>;
}

export function exportRoomSnapshot(room: MultiplayerRoom): RoomSnapshot {
  return JSON.parse(
    JSON.stringify({
      code: room.code,
      hostId: room.hostId,
      status: room.status,
      marketMode: room.marketMode,
      startingCash: room.startingCash,
      totalRounds: room.totalRounds,
      currentRound: room.currentRound,
      currentDay: room.currentDay,
      startDate: room.startDate,
      currentDate: room.currentDate,
      prices: room.prices,
      sentiment: room.sentiment,
      news: room.news,
      gameSeed: room.gameSeed,
      rankHistory: room.rankHistory,
      players: Array.from(room.players.values()).map((p) => ({
        id: p.id,
        name: p.name,
        isHost: p.isHost,
        cash: p.cash,
        holdings: p.holdings,
        startingCash: p.startingCash,
        joinedAtRound: p.joinedAtRound,
        avatar: p.avatar,
      })),
    }),
  );
}

export function importRoomSnapshot(snapshot: RoomSnapshot): MultiplayerRoom {
  const players = new Map<string, MultiplayerPlayer>();
  for (const p of snapshot.players) {
    players.set(p.id, {
      id: p.id,
      name: p.name,
      socket: null,
      isHost: p.isHost,
      cash: p.cash,
      holdings: JSON.parse(JSON.stringify(p.holdings)),
      startingCash: p.startingCash,
      joinedAtRound: p.joinedAtRound,
      connected: false,
      avatar: p.avatar ?? null,
    });
  }
  const room: MultiplayerRoom = {
    code: snapshot.code,
    hostId: snapshot.hostId,
    players,
    pendingJoins: new Map(),
    status: snapshot.status,
    marketMode: snapshot.marketMode,
    startingCash: snapshot.startingCash,
    totalRounds: snapshot.totalRounds,
    currentRound: snapshot.currentRound,
    currentDay: snapshot.currentDay,
    startDate: snapshot.startDate,
    currentDate: snapshot.currentDate,
    prices: JSON.parse(JSON.stringify(snapshot.prices)),
    sentiment: snapshot.sentiment,
    news: [...snapshot.news],
    gameSeed: snapshot.gameSeed,
    rankHistory: JSON.parse(JSON.stringify(snapshot.rankHistory)),
    createdAt: Date.now(),
  };
  ROOMS.set(room.code, room);
  return room;
}

/** Reattach an active websocket to an existing player slot (for resume). */
export function reattachSocketToPlayer(opts: {
  roomCode: string;
  playerId: string;
  socket: WebSocket;
}): { ok: true; room: MultiplayerRoom } | { ok: false; reason: string } {
  const room = getRoom(opts.roomCode);
  if (!room) return { ok: false, reason: "Room not found" };
  const player = room.players.get(opts.playerId);
  if (!player) return { ok: false, reason: "Player no longer in room" };

  // Drop any old socket reference
  if (player.socket && player.socket !== opts.socket) {
    try {
      player.socket.close();
    } catch {
      /* ignore */
    }
  }
  player.socket = opts.socket;
  player.connected = true;
  SOCKET_TO_ROOM.set(opts.socket, { roomCode: room.code, playerId: opts.playerId });
  return { ok: true, room };
}

export function getStartingCashOptions(): number[] {
  return [1000, 5000, 10000, 25000, 100000];
}

export function getDaysPerRound(): number {
  return DAYS_PER_ROUND;
}
