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
import { isContinent } from "./stocks.js";
import { createMultiplayerSave, consumeResumeToken, loadSave } from "./saves.js";

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
const TOP_IDS        = new Set([
  "tee", "hoodie", "suit", "jersey", "racing",
  "real_madrid", "man_united", "liverpool", "photo_tee",
]);
const BOTTOMS_IDS    = new Set(["jeans", "shorts", "slacks", "sweats"]);
const SHOES_IDS      = new Set(["barefoot", "sneakers", "boots", "heels", "sandals"]);

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
  const numberRaw = typeof r["topNumber"] === "string" ? r["topNumber"]
                  : typeof r["topNumber"] === "number" ? String(r["topNumber"])
                  : "";
  const topNumber = numberRaw.replace(/\D+/g, "").slice(0, 2);
  return {
    skin:       pickEnum(r["skin"],       SKIN_IDS,       "tan"),
    hair:       pickEnum(r["hair"],       HAIR_IDS,       "short"),
    expression: pickEnum(r["expression"], EXPRESSION_IDS, "smile"),
    hat:        pickEnum(r["hat"],        HAT_IDS,        "none"),
    top:        pickEnum(r["top"],        TOP_IDS,        "tee"),
    topLabel,
    topNumber,
    bottoms:    pickEnum(r["bottoms"],    BOTTOMS_IDS,    "jeans"),
    shoes:      pickEnum(r["shoes"],      SHOES_IDS,      "sneakers"),
  };
}

function handleHostRoom(socket: WebSocket, msg: ClientMessage): void {
  const playerName = sanitizeName(msg["playerName"]);
  if (!playerName) {
    send(socket, "error", { message: "Invalid nickname" });
    return;
  }
  const marketMode = sanitizeMarketMode(msg["marketMode"]);
  const rawContinent = msg["continent"];
  const continent = isContinent(rawContinent) ? rawContinent : null;
  const rawBaseCurrency = msg["baseCurrency"];
  const baseCurrency = typeof rawBaseCurrency === "string" && /^[A-Z]{3,5}$/.test(rawBaseCurrency)
    ? rawBaseCurrency
    : "USD";
  const startingCash = sanitizeStartingCash(msg["startingCash"]);
  const totalRounds = sanitizeRounds(msg["totalRounds"]);

  const { room, player } = createRoom({
    hostName: playerName,
    hostSocket: socket,
    marketMode,
    continent,
    baseCurrency,
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

/**
 * Mint a fresh single-use resume token for the player on this socket and push
 * it down. The client stores it and, if the WebSocket drops unexpectedly,
 * reconnects with `resume_session` to seamlessly rejoin the game — instead of
 * being kicked back to the "Disconnected" screen. Called on demand via the
 * `request_resume_token` message (the client polls periodically).
 */
function handleRequestResumeToken(socket: WebSocket): void {
  const ref = getRoomBySocket(socket);
  if (!ref) return; // silently no-op if not in a room
  // Throttle to defang an in-room client trying to spam token mints.
  if (!checkRate(socket, "resume_token")) return;
  const code = createMultiplayerSave(ref.room, ref.playerId);
  const res = loadSave(code);
  if (res?.resumeToken) {
    send(socket, "resume_token", { resumeToken: res.resumeToken });
  }
}

function handleLeave(socket: WebSocket): void {
  const room = handleSocketDisconnect(socket);
  if (room) broadcastRoom(room.code);
  try { socket.close(); } catch { /* ignore */ }
}

const REACTION_KINDS = new Set(["rocket", "moneybag", "chart", "skull", "fire", "diamond"]);

// Per-socket simple token-bucket-style minimum-interval rate limit.
interface RateState { lastChatMs: number; lastReactionMs: number; lastTokenMs: number; }
const rateBySocket = new WeakMap<WebSocket, RateState>();
const MIN_CHAT_MS = 600;            // ≈ 100/min ceiling per player
const MIN_CHAT_ATTACHMENT_MS = 4000; // attachments are ~300 KB → 15/min
const MIN_REACTION_MS = 250;         // ≈ 240/min per player
// Resume tokens are cheap but not free (snapshot + token-map insert). Cap to
// one mint per 5 s per socket — well above what an honest client needs (it
// polls every 20s plus one immediate request on join) and tight enough to
// neutralise an in-room client trying to flood us.
const MIN_TOKEN_MS = 5000;

function checkRate(
  sock: WebSocket,
  kind: "chat" | "chat_attachment" | "reaction" | "resume_token",
): boolean {
  const now = Date.now();
  const state = rateBySocket.get(sock) ?? { lastChatMs: 0, lastReactionMs: 0, lastTokenMs: 0 };
  if (kind === "chat" || kind === "chat_attachment") {
    const min = kind === "chat_attachment" ? MIN_CHAT_ATTACHMENT_MS : MIN_CHAT_MS;
    if (now - state.lastChatMs < min) return false;
    state.lastChatMs = now;
  } else if (kind === "resume_token") {
    if (now - state.lastTokenMs < MIN_TOKEN_MS) return false;
    state.lastTokenMs = now;
  } else {
    if (now - state.lastReactionMs < MIN_REACTION_MS) return false;
    state.lastReactionMs = now;
  }
  rateBySocket.set(sock, state);
  return true;
}

// Max base64 length for an attachment payload (~5000 KB binary). Base64 is
// ~4/3 the size of the underlying bytes, so 5000 KB → ~6.83M chars.
const MAX_ATTACHMENT_B64 = 6_900_000;
const ALLOWED_ATTACHMENT_MIME = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/gif",
  "application/pdf",
  "text/plain",
  "text/markdown",
  "text/csv",
  "application/json",
]);

interface SanitizedAttachment {
  kind: "image" | "file";
  name: string;
  mime: string;
  size: number;
  dataUrl: string;
}

function sanitizeAttachment(raw: unknown): SanitizedAttachment | null {
  if (!raw || typeof raw !== "object") return null;
  const obj = raw as Record<string, unknown>;
  const mime = typeof obj["mime"] === "string" ? obj["mime"] : "";
  const dataUrl = typeof obj["dataUrl"] === "string" ? obj["dataUrl"] : "";
  const name = typeof obj["name"] === "string" ? obj["name"].slice(0, 80) : "file";
  const size = typeof obj["size"] === "number" ? obj["size"] : 0;
  if (!ALLOWED_ATTACHMENT_MIME.has(mime)) return null;
  if (!dataUrl.startsWith(`data:${mime};base64,`)) return null;
  if (dataUrl.length > MAX_ATTACHMENT_B64) return null;
  const kind = mime.startsWith("image/") ? "image" : "file";
  return { kind, name: name || "file", mime, size, dataUrl };
}

function handleChatMessage(socket: WebSocket, msg: ClientMessage): void {
  const ref = getRoomBySocket(socket);
  if (!ref) return;
  const raw = typeof msg["text"] === "string" ? msg["text"] : "";
  const text = raw.trim().slice(0, 200);
  const attachment = sanitizeAttachment(msg["attachment"]);
  if (!text && !attachment) return;
  // Throttle attachment-bearing messages more aggressively (large payloads
  // multiply by room size on fanout). When throttled, notify the client with
  // a soft `chat_rate_limited` event so the UI can show feedback / cooldown
  // instead of leaving the user wondering why their messages vanished.
  const kind = attachment ? "chat_attachment" : "chat";
  if (!checkRate(socket, kind)) {
    const min = kind === "chat_attachment" ? MIN_CHAT_ATTACHMENT_MS : MIN_CHAT_MS;
    const state = rateBySocket.get(socket);
    const retryAfterMs = state ? Math.max(0, min - (Date.now() - state.lastChatMs)) : min;
    send(socket, "chat_rate_limited", { retryAfterMs, kind });
    return;
  }
  const player = ref.room.players.get(ref.playerId);
  if (!player) return;

  const payload = {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    from: player.id,
    name: player.name,
    text,
    ts: Date.now(),
    ...(attachment ? { attachment } : {}),
  };

  for (const p of ref.room.players.values()) {
    if (!p.socket || p.socket.readyState !== WebSocket.OPEN) continue;
    send(p.socket, "chat_message", payload);
  }
}

function handleReaction(socket: WebSocket, msg: ClientMessage): void {
  const ref = getRoomBySocket(socket);
  if (!ref) return;
  if (!checkRate(socket, "reaction")) return;
  const kind = typeof msg["kind"] === "string" ? msg["kind"] : "";
  if (!REACTION_KINDS.has(kind)) return;
  const player = ref.room.players.get(ref.playerId);
  if (!player) return;

  const payload = {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    from: player.id,
    name: player.name,
    kind,
    ts: Date.now(),
  };

  for (const p of ref.room.players.values()) {
    if (!p.socket || p.socket.readyState !== WebSocket.OPEN) continue;
    send(p.socket, "reaction", payload);
  }
}

export function attachMultiplayerSocket(server: HttpServer): WebSocketServer {
  // Cap incoming WS frames so oversized payloads are rejected at the transport
  // layer (before JSON.parse), bounding worst-case memory/CPU per message. The
  // largest legitimate frame is a chat attachment (≈5000 KB binary → ~6.83M
  // chars base64 + JSON envelope).
  const wss = new WebSocketServer({
    server,
    path: "/api/multiplayer/ws",
    maxPayload: 8 * 1024 * 1024, // 8 MB
  });

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
          case "chat_message":
            handleChatMessage(socket, msg);
            break;
          case "reaction":
            handleReaction(socket, msg);
            break;
          case "ping":
            send(socket, "pong");
            break;
          case "request_resume_token":
            handleRequestResumeToken(socket);
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
