import { useEffect, useRef, useState, useCallback } from "react";
import { loadStoredAvatar, type AvatarConfig } from "./avatar";

export interface ChatMessageWire {
  id: string;
  from: string;
  name: string;
  text: string;
  ts: number;
}

export interface ReactionWire {
  id: string;
  from: string;
  name: string;
  kind: string;
  ts: number;
}

export type RoomStatus = "lobby" | "playing" | "finished";
export type MarketMode = "stocks" | "crypto" | "mixed";

export interface RoomPlayerSummary {
  id: string;
  name: string;
  isHost: boolean;
  connected: boolean;
  avatar?: AvatarConfig | null;
}

export interface PendingJoinSummary {
  requestId: string;
  playerName: string;
}

export interface PriceTick {
  ticker: string;
  price: number;
  open: number;
  high: number;
  low: number;
  change: number;
  changePercent: number;
  volume: number;
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
  rankDelta: number;
  avatar?: AvatarConfig | null;
}

export type Continent =
  | "Africa" | "Asia" | "Europe"
  | "North America" | "South America" | "Oceania";

export interface RoomState {
  code: string;
  hostId: string;
  status: RoomStatus;
  marketMode: MarketMode;
  continent: Continent | null;
  startingCash: number;
  currentRound: number;
  totalRounds: number;
  currentDay: number;
  currentDate: string;
  startDate: string;
  sentiment: "bullish" | "bearish" | "neutral";
  news: string[];
  prices: PriceTick[];
  players: RoomPlayerSummary[];
  pendingJoins: PendingJoinSummary[];
  leaderboard: LeaderboardEntry[];
}

export interface PlayerHolding {
  ticker: string;
  shares: number;
  avgCostBasis: number;
  currentPrice: number;
  totalValue: number;
  gainLoss: number;
  gainLossPercent: number;
}

export interface PlayerView {
  playerId: string;
  cash: number;
  holdings: PlayerHolding[];
}

export type MultiplayerStatus =
  | "idle"
  | "connecting"
  | "registering"
  | "pending_join"
  | "in_room"
  | "denied"
  | "disconnected"
  | "error";

export interface MultiplayerIntent {
  mode: "host" | "join" | "resume";
  playerName: string;
  marketMode?: MarketMode;
  continent?: Continent | null;
  startingCash?: number;
  totalRounds?: number;
  joinCode?: string;
  resumeToken?: string;
  avatar?: AvatarConfig;
}

const INTENT_KEY = "future_mp_intent";

export function setMultiplayerIntent(intent: MultiplayerIntent): void {
  sessionStorage.setItem(INTENT_KEY, JSON.stringify(intent));
}

export function getMultiplayerIntent(): MultiplayerIntent | null {
  const raw = sessionStorage.getItem(INTENT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as MultiplayerIntent;
  } catch {
    return null;
  }
}

export function clearMultiplayerIntent(): void {
  sessionStorage.removeItem(INTENT_KEY);
}

function buildSocketUrl(): string {
  const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${proto}//${window.location.host}/api/multiplayer/ws`;
}

interface UseMultiplayerRoomReturn {
  status: MultiplayerStatus;
  errorMessage: string | null;
  room: RoomState | null;
  you: PlayerView | null;
  myPlayerId: string | null;
  isHost: boolean;
  chatMessages: ChatMessageWire[];
  liveReactions: ReactionWire[];
  consumeReaction: (id: string) => void;
  acceptJoin: (requestId: string) => void;
  denyJoin: (requestId: string) => void;
  startGame: () => void;
  nextRound: () => void;
  trade: (ticker: string, action: "buy" | "sell", shares: number) => void;
  sendChat: (text: string) => void;
  sendReaction: (kind: string) => void;
  saveSession: () => Promise<string>;
  leave: () => void;
  reset: () => void;
}

/**
 * Connects on mount based on the stored intent. Caller is responsible for
 * setting the intent (via setMultiplayerIntent) BEFORE navigating to the
 * multiplayer page that uses this hook.
 */
export function useMultiplayerRoom(): UseMultiplayerRoomReturn {
  const [status, setStatus] = useState<MultiplayerStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [room, setRoom] = useState<RoomState | null>(null);
  const [you, setYou] = useState<PlayerView | null>(null);
  const [myPlayerId, setMyPlayerId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessageWire[]>([]);
  const [liveReactions, setLiveReactions] = useState<ReactionWire[]>([]);
  const socketRef = useRef<WebSocket | null>(null);
  const intentRef = useRef<MultiplayerIntent | null>(null);
  const closedManuallyRef = useRef(false);
  const saveResolversRef = useRef<Array<(code: string) => void>>([]);
  const saveRejectersRef = useRef<Array<(err: Error) => void>>([]);

  const sendMessage = useCallback((type: string, payload: Record<string, unknown> = {}) => {
    const sock = socketRef.current;
    if (!sock || sock.readyState !== WebSocket.OPEN) return;
    sock.send(JSON.stringify({ type, ...payload }));
  }, []);

  useEffect(() => {
    const intent = getMultiplayerIntent();
    if (!intent) {
      setStatus("error");
      setErrorMessage("No multiplayer session in progress");
      return;
    }
    intentRef.current = intent;
    setStatus("connecting");

    // Defensive fallback: if the intent has no avatar (older session, refresh,
    // or skipped customization), hydrate from the most recently saved look so
    // the player never enters a game with the default skin unintentionally.
    const avatarPayload = intent.avatar ?? loadStoredAvatar();

    const socket = new WebSocket(buildSocketUrl());
    socketRef.current = socket;

    socket.addEventListener("open", () => {
      setStatus("registering");
      if (intent.mode === "host") {
        socket.send(JSON.stringify({
          type: "host_room",
          playerName: intent.playerName,
          marketMode: intent.marketMode ?? "stocks",
          continent: intent.continent ?? null,
          startingCash: intent.startingCash ?? 10000,
          totalRounds: intent.totalRounds ?? 10,
          avatar: avatarPayload,
        }));
      } else if (intent.mode === "resume") {
        socket.send(JSON.stringify({
          type: "resume_session",
          resumeToken: intent.resumeToken ?? "",
        }));
      } else {
        socket.send(JSON.stringify({
          type: "join_request",
          playerName: intent.playerName,
          roomCode: (intent.joinCode ?? "").toUpperCase(),
          avatar: avatarPayload,
        }));
      }
    });

    socket.addEventListener("message", (event) => {
      let msg: { type?: string; [key: string]: unknown };
      try {
        msg = JSON.parse(event.data);
      } catch {
        return;
      }
      switch (msg.type) {
        case "room_created": {
          setMyPlayerId((msg["playerId"] as string) ?? null);
          setStatus("in_room");
          break;
        }
        case "join_pending": {
          setStatus("pending_join");
          break;
        }
        case "joined": {
          setMyPlayerId((msg["playerId"] as string) ?? null);
          setStatus("in_room");
          break;
        }
        case "resumed": {
          setMyPlayerId((msg["playerId"] as string) ?? null);
          setStatus("in_room");
          break;
        }
        case "save_created": {
          const code = (msg["code"] as string) ?? "";
          const resolvers = saveResolversRef.current;
          saveResolversRef.current = [];
          saveRejectersRef.current = [];
          resolvers.forEach((r) => r(code));
          break;
        }
        case "join_denied": {
          setErrorMessage((msg["reason"] as string) ?? "Host declined your request");
          setStatus("denied");
          // Server will close us; clear intent so we don't try again
          clearMultiplayerIntent();
          break;
        }
        case "room_state": {
          setRoom((msg["room"] as RoomState) ?? null);
          const you = msg["you"] as PlayerView | null | undefined;
          if (you) setYou(you);
          break;
        }
        case "chat_message": {
          const m = msg as unknown as ChatMessageWire;
          if (m.id && m.text) {
            setChatMessages((prev) => [...prev.slice(-99), m]);
          }
          break;
        }
        case "reaction": {
          const r = msg as unknown as ReactionWire;
          if (r.id && r.kind) {
            setLiveReactions((prev) => [...prev.slice(-19), r]);
          }
          break;
        }
        case "error": {
          setErrorMessage((msg["message"] as string) ?? "Unknown error");
          break;
        }
        default:
          break;
      }
    });

    socket.addEventListener("close", () => {
      if (closedManuallyRef.current) return;
      setStatus((prev) => (prev === "denied" ? "denied" : "disconnected"));
    });

    socket.addEventListener("error", () => {
      setStatus((prev) => (prev === "denied" ? "denied" : "error"));
      setErrorMessage("Connection error");
    });

    return () => {
      closedManuallyRef.current = true;
      try {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ type: "leave" }));
        }
        socket.close();
      } catch {
        /* ignore */
      }
      socketRef.current = null;
    };
  }, []);

  const isHost = !!(room && myPlayerId && room.hostId === myPlayerId);

  return {
    status,
    errorMessage,
    room,
    you,
    myPlayerId,
    isHost,
    chatMessages,
    liveReactions,
    consumeReaction: (id: string) =>
      setLiveReactions((prev) => prev.filter((r) => r.id !== id)),
    acceptJoin: (requestId) => sendMessage("accept_join", { requestId }),
    denyJoin: (requestId) => sendMessage("deny_join", { requestId }),
    startGame: () => sendMessage("start_game"),
    nextRound: () => sendMessage("next_round"),
    trade: (ticker, action, shares) => sendMessage("trade", { ticker, action, shares }),
    sendChat: (text: string) => sendMessage("chat_message", { text }),
    sendReaction: (kind: string) => sendMessage("reaction", { kind }),
    saveSession: () =>
      new Promise<string>((resolve, reject) => {
        const sock = socketRef.current;
        if (!sock || sock.readyState !== WebSocket.OPEN) {
          reject(new Error("Not connected"));
          return;
        }
        saveResolversRef.current.push(resolve);
        saveRejectersRef.current.push(reject);
        sock.send(JSON.stringify({ type: "save_session" }));
        // Safety timeout
        setTimeout(() => {
          const idx = saveResolversRef.current.indexOf(resolve);
          if (idx >= 0) {
            saveResolversRef.current.splice(idx, 1);
            saveRejectersRef.current.splice(idx, 1);
            reject(new Error("Save timed out"));
          }
        }, 8000);
      }),
    leave: () => {
      closedManuallyRef.current = true;
      sendMessage("leave");
      try {
        socketRef.current?.close();
      } catch {
        /* ignore */
      }
      clearMultiplayerIntent();
    },
    reset: () => {
      closedManuallyRef.current = true;
      try {
        socketRef.current?.close();
      } catch {
        /* ignore */
      }
      clearMultiplayerIntent();
    },
  };
}
