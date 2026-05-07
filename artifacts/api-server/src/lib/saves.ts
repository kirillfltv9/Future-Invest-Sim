import {
  exportRoomSnapshot,
  importRoomSnapshot,
  getRoom,
  type MultiplayerRoom,
  type RoomSnapshot,
} from "./multiplayer.js";

const SAVES = new Map<string, SaveRecord>();
const RESUME_TOKENS = new Map<string, ResumeTokenRecord>();
const SAVE_CODE_LENGTH = 6;
const SAVE_CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const SAVE_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days
const RESUME_TOKEN_TTL_MS = 1000 * 60 * 10; // 10 minutes

export type SaveRecord =
  | { kind: "solo"; sessionId: string; createdAt: number }
  | {
      kind: "multiplayer";
      roomCode: string;
      playerId: string;
      playerName: string;
      snapshot: RoomSnapshot;
      createdAt: number;
    };

interface ResumeTokenRecord {
  roomCode: string;
  playerId: string;
  createdAt: number;
}

function generateResumeToken(): string {
  // 24-char URL-safe random token
  const bytes = new Uint8Array(18);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function pruneExpired(): void {
  const now = Date.now();
  for (const [k, v] of SAVES) {
    if (now - v.createdAt > SAVE_TTL_MS) SAVES.delete(k);
  }
  for (const [k, v] of RESUME_TOKENS) {
    if (now - v.createdAt > RESUME_TOKEN_TTL_MS) RESUME_TOKENS.delete(k);
  }
}

function generateSaveCode(): string {
  for (let attempt = 0; attempt < 50; attempt++) {
    let code = "";
    for (let i = 0; i < SAVE_CODE_LENGTH; i++) {
      code += SAVE_CODE_CHARS[Math.floor(Math.random() * SAVE_CODE_CHARS.length)];
    }
    if (!SAVES.has(code)) return code;
  }
  throw new Error("Failed to generate unique save code");
}

export function createSoloSave(sessionId: string): string {
  const code = generateSaveCode();
  SAVES.set(code, { kind: "solo", sessionId, createdAt: Date.now() });
  return code;
}

export function createMultiplayerSave(
  room: MultiplayerRoom,
  playerId: string,
): string {
  const player = room.players.get(playerId);
  const code = generateSaveCode();
  SAVES.set(code, {
    kind: "multiplayer",
    roomCode: room.code,
    playerId,
    playerName: player?.name ?? "",
    snapshot: exportRoomSnapshot(room),
    createdAt: Date.now(),
  });
  return code;
}

export interface LoadResult {
  kind: "solo" | "multiplayer";
  sessionId?: string;
  roomCode?: string;
  playerName?: string;
  /** Single-use, short-lived token to authorize the actual WS reattach. */
  resumeToken?: string;
}

export function loadSave(code: string): LoadResult | null {
  pruneExpired();
  const key = code.toUpperCase().trim();
  const rec = SAVES.get(key);
  if (!rec) return null;
  // One-time consume — the user can save again in-game to get a new code.
  SAVES.delete(key);

  if (rec.kind === "solo") {
    return { kind: "solo", sessionId: rec.sessionId };
  }
  // Multiplayer: ensure the room exists in memory; if not, restore from snapshot.
  let room = getRoom(rec.roomCode);
  if (!room) {
    room = importRoomSnapshot(rec.snapshot);
  }
  // Mint a single-use resume token; the playerId itself is never sent to the client.
  const token = generateResumeToken();
  RESUME_TOKENS.set(token, {
    roomCode: room.code,
    playerId: rec.playerId,
    createdAt: Date.now(),
  });
  return {
    kind: "multiplayer",
    roomCode: room.code,
    playerName: rec.playerName,
    resumeToken: token,
  };
}

/** Consume a single-use resume token. Returns the bound (roomCode, playerId) or null. */
export function consumeResumeToken(token: string): {
  roomCode: string;
  playerId: string;
} | null {
  pruneExpired();
  const rec = RESUME_TOKENS.get(token);
  if (!rec) return null;
  RESUME_TOKENS.delete(token);
  return { roomCode: rec.roomCode, playerId: rec.playerId };
}
