import type { Server as HttpServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { logger } from "./logger.js";
import {
  acceptJoin,
  addPendingJoin,
  advanceRound,
  buildPlayerView,
  buildRoomPublicState,
  createRoom,
  denyJoin,
  executeTrade,
  getRoom,
  getRoomBySocket,
  handleSocketDisconnect,
  reattachSocketToPlayer,
  startGame,
  type MarketMode,
  type AvatarConfig,
} from "./multiplayer.js";
import { createMultiplayerSave, consumeResumeToken } from "./saves.js";

interface ClientMessage {
  type: string;
  [key: string]: unknown;
}

function send(socket: WebSocket, type: string, payload: Record<string, unknown> = {}): void {
  if (socket.readyState !== WebSocket.OPEN) return;
  socket.send(JSON.stringify({ type, ...payload }));
}

function broadcastRoom(roomCode: string): void {
  const room = getRoom(roomCode);
  if (!room) return;
  const publicState = buildRoomPublicState(room);
  for (const player of room.players.values()) {
    if (!player.socket || player.socket.readyState !== WebSocket.OPEN) continue;
    const playerView = buildPlayerView(room, player.id);
    send(player.socket, "room_state", { room: publicState, you: playerView });
  }
}

function sanitizeName(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const trimmed = input.trim().slice(0, 20);
  return trimmed.length > 0 ? trimmed : null;
}

function sanitizeMarketMode(input: unknown): MarketMode {
  if (input === "crypto" || input === "mixed") return input;
  return "stocks";
}

function sanitizeStartingCash(input: unknown): number {
  const n = typeof input === "number" ? input : parseFloat(String(input ?? ""));
  if (!Number.isFinite(n) || n < 100 || n > 10_000_000) return 10000;
  return Math.round(n);
}

function sanitizeRounds(input: unknown): number {
  const n = typeof input === "number" ? input : parseInt(String(input ?? ""), 10);
  if (!Number.isFinite(n) || n < 3 || n > 30) return 10;
  return Math.floor(n);
}

const SKIN_IDS       = new Set(["light", "tan", "brown", "deep", "gold"]);
const HAIR_IDS       = new Set(["bald", "short", "long", "curly", "mohawk", "ponytail"]);
const EXPRESSION_IDS = new Set(["smile", "smirk", "shades", "monocle", "wink"]);
const HAT_IDS        = new Set(["none", "cap", "beanie", "tophat", "crown"]);
const TOP_IDS        = new Set(["tee", "hoodie", "suit", "jersey", "racing"]);
const BOTTOMS_IDS    = new Set(["jeans", "shorts", "slacks", "sweats"]);

function pickEnum(value: unknown, allowed: Set<string>, fallback: string): string {
  return typeof value === "string" && allowed.has(value) ? value : fallback;
}

function sanitizeAvatar(input: unknown): AvatarConfig | null {
  if (!input || typeof input !== "object") return null;
  const r = input as Record<string, unknown>;
  const labelRaw = typeof r["topLabel"] === "string" ? r["topLabel"] : "";
  const topLabel = labelRaw
    // printable ASCII only
    .replace(/[^\x20-\x7E]/g, "")
    .slice(0, 8)
    .trimEnd();
  return {
    skin:       pickEnum(r["skin"],       SKIN_IDS,       "tan"),
    hair:       pickEnum(r["hair"],       HAIR_IDS,       "short"),
    expression: pickEnum(r["expression"], EXPRESSION_IDS, "smile"),
    hat:        pickEnum(r["hat"],        HAT_IDS,        "none"),
    top:        pickEnum(r["top"],        TOP_IDS,        "tee"),
    topLabel,
    bottoms:    pickEnum(r["bottoms"],    BOTTOMS_IDS,    "jeans"),
  };
}

function handleHostRoom(socket: WebSocket, msg: ClientMessage): void {
  const playerName = sanitizeName(msg["playerName"]);
  if (!playerName) {
    send(socket, "error", { message: "Invalid nickname" });
    return;
  }
  const marketMode = sanitizeMarketMode(msg["marketMode"]);
  const startingCash = sanitizeStartingCash(msg["startingCash"]);
  const totalRounds = sanitizeRounds(msg["totalRounds"]);

  const { room, player } = createRoom({
    hostName: playerName,
    hostSocket: socket,
    marketMode,
    startingCash,
    totalRounds,
    avatar: sanitizeAvatar(msg["avatar"]),
  });

  send(socket, "room_created", {
    roomCode: room.code,
    playerId: player.id,
  });
  broadcastRoom(room.code);
  logger.info({ code: room.code, host: playerName }, "Multiplayer room created");
}

function handleJoinRequest(socket: WebSocket, msg: ClientMessage): void {
  const playerName = sanitizeName(msg["playerName"]);
  const roomCode = typeof msg["roomCode"] === "string" ? msg["roomCode"].toUpperCase().trim() : "";
  if (!playerName) {
    send(socket, "error", { message: "Invalid nickname" });
    return;
  }
  if (!roomCode) {
    send(socket, "join_denied", { reason: "Enter a room code" });
    return;
  }

  const result = addPendingJoin({
    roomCode,
    playerName,
    socket,
    avatar: sanitizeAvatar(msg["avatar"]),
  });
  if (!result.ok) {
    send(socket, "join_denied", { reason: result.reason });
    return;
  }

  send(socket, "join_pending", { requestId: result.requestId, roomCode });

  const room = getRoom(roomCode);
  if (!room) return;
  const host = room.players.get(room.hostId);
  if (host?.socket && host.socket.readyState === WebSocket.OPEN) {
    send(host.socket, "join_request_received", {
      requestId: result.requestId,
      playerName,
    });
  }
  broadcastRoom(roomCode);
}

function handleAcceptJoin(socket: WebSocket, msg: ClientMessage): void {
  const ref = getRoomBySocket(socket);
  if (!ref) return;
  const requestId = typeof msg["requestId"] === "string" ? msg["requestId"] : "";
  const result = acceptJoin({
    roomCode: ref.room.code,
    hostId: ref.playerId,
    requestId,
  });
  if (!result.ok) {
    send(socket, "error", { message: result.reason });
    return;
  }
  send(result.socket, "joined", {
    playerId: result.player.id,
    roomCode: result.room.code,
  });
  broadcastRoom(result.room.code);
}

function handleDenyJoin(socket: WebSocket, msg: ClientMessage): void {
  const ref = getRoomBySocket(socket);
  if (!ref) return;
  const requestId = typeof msg["requestId"] === "string" ? msg["requestId"] : "";
  const result = denyJoin({
    roomCode: ref.room.code,
    hostId: ref.playerId,
    requestId,
  });
  if (!result.ok) {
    send(socket, "error", { message: result.reason });
    return;
  }
  send(result.socket, "join_denied", { reason: "Host declined your request" });
  broadcastRoom(ref.room.code);
}

function handleStartGame(socket: WebSocket): void {
  const ref = getRoomBySocket(socket);
  if (!ref) return;
  const result = startGame({ roomCode: ref.room.code, hostId: ref.playerId });
  if (!result.ok) {
    send(socket, "error", { message: result.reason });
    return;
  }
  // Reject any remaining pending joins now that the game has started
  for (const [, pending] of ref.room.pendingJoins) {
    if (pending.socket.readyState === WebSocket.OPEN) {
      send(pending.socket, "join_denied", { reason: "Game started before host could respond" });
    }
  }
  ref.room.pendingJoins.clear();
  broadcastRoom(ref.room.code);
}

function handleNextRound(socket: WebSocket): void {
  const ref = getRoomBySocket(socket);
  if (!ref) return;
  const result = advanceRound({ roomCode: ref.room.code, hostId: ref.playerId });
  if (!result.ok) {
    send(socket, "error", { message: result.reason });
    return;
  }
  broadcastRoom(ref.room.code);
}

function handleTrade(socket: WebSocket, msg: ClientMessage): void {
  const ref = getRoomBySocket(socket);
  if (!ref) return;
  const ticker = typeof msg["ticker"] === "string" ? msg["ticker"] : "";
  const action = msg["action"] === "sell" ? "sell" : "buy";
  const sharesRaw = msg["shares"];
  const shares = typeof sharesRaw === "number" ? sharesRaw : parseFloat(String(sharesRaw ?? ""));

  const result = executeTrade({
    roomCode: ref.room.code,
    playerId: ref.playerId,
    ticker,
    action,
    shares,
  });
  if (!result.ok) {
    send(socket, "error", { message: result.reason });
    return;
  }
  broadcastRoom(ref.room.code);
}

function handleSave(socket: WebSocket): void {
  const ref = getRoomBySocket(socket);
  if (!ref) {
    send(socket, "error", { message: "Not in a room" });
    return;
  }
  const code = createMultiplayerSave(ref.room, ref.playerId);
  send(socket, "save_created", { code });
}

function handleResume(socket: WebSocket, msg: ClientMessage): void {
  const token = typeof msg["resumeToken"] === "string" ? msg["resumeToken"].trim() : "";
  if (!token) {
    send(socket, "join_denied", { reason: "Resume token required" });
    return;
  }
  const consumed = consumeResumeToken(token);
  if (!consumed) {
    send(socket, "join_denied", { reason: "Resume token expired or already used. Save again to get a new code." });
    return;
  }
  const result = reattachSocketToPlayer({
    roomCode: consumed.roomCode,
    playerId: consumed.playerId,
    socket,
  });
  if (!result.ok) {
    send(socket, "join_denied", { reason: result.reason });
    return;
  }
  send(socket, "resumed", { playerId: consumed.playerId, roomCode: result.room.code });
  broadcastRoom(result.room.code);
  logger.info({ code: result.room.code, playerId: consumed.playerId }, "Player resumed multiplayer session");
}

function handleLeave(socket: WebSocket): void {
  const room = handleSocketDisconnect(socket);
  if (room) broadcastRoom(room.code);
  try { socket.close(); } catch { /* ignore */ }
}

export function attachMultiplayerSocket(server: HttpServer): WebSocketServer {
  const wss = new WebSocketServer({ server, path: "/api/multiplayer/ws" });

  wss.on("connection", (socket) => {
    socket.on("message", (raw) => {
      let msg: ClientMessage;
      try {
        msg = JSON.parse(raw.toString());
      } catch {
        send(socket, "error", { message: "Invalid JSON" });
        return;
      }
      const type = typeof msg.type === "string" ? msg.type : "";
      try {
        switch (type) {
          case "host_room":
            handleHostRoom(socket, msg);
            break;
          case "join_request":
            handleJoinRequest(socket, msg);
            break;
          case "accept_join":
            handleAcceptJoin(socket, msg);
            break;
          case "deny_join":
            handleDenyJoin(socket, msg);
            break;
          case "start_game":
            handleStartGame(socket);
            break;
          case "next_round":
            handleNextRound(socket);
            break;
          case "trade":
            handleTrade(socket, msg);
            break;
          case "save_session":
            handleSave(socket);
            break;
          case "resume_session":
            handleResume(socket, msg);
            break;
          case "leave":
            handleLeave(socket);
            break;
          case "ping":
            send(socket, "pong");
            break;
          default:
            send(socket, "error", { message: `Unknown message type: ${type}` });
        }
      } catch (err) {
        logger.error({ err, type }, "Error handling multiplayer message");
        send(socket, "error", { message: "Internal server error" });
      }
    });

    socket.on("close", () => {
      const room = handleSocketDisconnect(socket);
      if (room) broadcastRoom(room.code);
    });

    socket.on("error", (err) => {
      logger.warn({ err: err.message }, "Multiplayer socket error");
    });
  });

  logger.info("Multiplayer WebSocket server attached at /api/multiplayer/ws");
  return wss;
}
