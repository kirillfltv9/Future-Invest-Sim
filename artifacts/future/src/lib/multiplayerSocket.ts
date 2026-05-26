import { useEffect, useRef, useState, useCallback } from "react";
import { loadStoredAvatar, type AvatarConfig } from "./avatar";

export interface ChatAttachmentWire {
  kind: "image" | "file";
  name: string;
  mime: string;
  size: number;
  dataUrl: string;
}

export interface ChatMessageWire {
  id: string;
  from: string;
  name: string;
  text: string;
  ts: number;
  attachment?: ChatAttachmentWire;
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
  baseCurrency: string;
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
  baseCurrency?: string;
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
  /** Epoch ms until which the chat send button should be cooled down. 0 = ready. */
  chatCooldownUntil: number;
  consumeReaction: (id: string) => void;
  acceptJoin: (requestId: string) => void;
  denyJoin: (requestId: string) => void;
  startGame: () => void;
  nextRound: () => void;
  trade: (ticker: string, action: "buy" | "sell", shares: number) => void;
  sendChat: (text: string, attachment?: ChatAttachmentWire) => void;
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
  const [chatCooldownUntil, setChatCooldownUntil] = useState(0);
  const socketRef = useRef<WebSocket | null>(null);
  const intentRef = useRef<MultiplayerIntent | null>(null);
  const closedManuallyRef = useRef(false);
  const saveResolversRef = useRef<Array<(code: string) => void>>([]);
  const saveRejectersRef = useRef<Array<(err: Error) => void>>([]);
  // Most recent server-issued resume token. Refreshed in the background while
  // we're in a room so we can transparently reconnect after an unexpected WS
  // drop (network blip, server hiccup, browser backgrounding the tab, etc.)
  // without bouncing the user back to the "Disconnected" screen.
  const resumeTokenRef = useRef<string | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tokenPollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // True once we've successfully reached the in_room state at least once on
  // this hook instance — gating auto-reconnect prevents loops on bad intents.
  const hasJoinedRef = useRef(false);

  const sendMessage = useCallback((type: string, payload: Record<string, unknown> = {}) => {
    const sock = socketRef.current;
    if (!sock || sock.readyState !== WebSocket.OPEN) return;
    sock.send(JSON.stringify({ type, ...payload }));
  }, []);

  // Connect (and re-connect) using either the original intent or a fresh
  // resume token. Extracted so the close handler can call it to transparently
  // reattach the player after a network drop.
  const connect = useCallback((opts: { useResumeToken?: string | null } = {}) => {
    const intent = intentRef.current ?? getMultiplayerIntent();
    if (!intent) {
      setStatus("error");
      setErrorMessage("No multiplayer session in progress");
      return;
    }
    intentRef.current = intent;
    setStatus(opts.useResumeToken ? "registering" : "connecting");
    const avatarPayload = intent.avatar ?? loadStoredAvatar();

    const socket = new WebSocket(buildSocketUrl());
    socketRef.current = socket;
    const resumeToken = opts.useResumeToken ?? null;

    socket.addEventListener("open", () => {
      setStatus("registering");
      if (resumeToken) {
        socket.send(JSON.stringify({ type: "resume_session", resumeToken }));
        return;
      }
      if (intent.mode === "host") {
        socket.send(JSON.stringify({
          type: "host_room",
          playerName: intent.playerName,
          marketMode: intent.marketMode ?? "stocks",
          continent: intent.continent ?? null,
          baseCurrency: intent.baseCurrency ?? "USD",
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
          hasJoinedRef.current = true;
          reconnectAttemptsRef.current = 0;
          // Mint a resume token immediately so even a disconnect within the
          // first poll interval can transparently reattach.
          socket.send(JSON.stringify({ type: "request_resume_token" }));
          break;
        }
        case "join_pending": {
          setStatus("pending_join");
          break;
        }
        case "joined": {
          setMyPlayerId((msg["playerId"] as string) ?? null);
          setStatus("in_room");
          hasJoinedRef.current = true;
          reconnectAttemptsRef.current = 0;
          socket.send(JSON.stringify({ type: "request_resume_token" }));
          break;
        }
        case "resumed": {
          setMyPlayerId((msg["playerId"] as string) ?? null);
          setStatus("in_room");
          hasJoinedRef.current = true;
          reconnectAttemptsRef.current = 0;
          // Mint a fresh token right away — the one we just used was single-use.
          // 5s-rate-limited on the server, but we're well within that.
          socket.send(JSON.stringify({ type: "request_resume_token" }));
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
        case "resume_token": {
          const token = (msg["resumeToken"] as string) ?? "";
          if (token) resumeTokenRef.current = token;
          break;
        }
        case "chat_rate_limited": {
          const retryMs = Math.max(0, Number(msg["retryAfterMs"]) || 0);
          setChatCooldownUntil(Date.now() + retryMs);
          break;
        }
        case "join_denied": {
          setErrorMessage((msg["reason"] as string) ?? "Host declined your request");
          setStatus("denied");
          // Server will close us; clear intent so we don't try again.
          clearMultiplayerIntent();
          // The resume token (if any) was consumed/invalidated server-side.
          // Wipe it so the close handler doesn't try to reuse a dead credential.
          resumeTokenRef.current = null;
          reconnectAttemptsRef.current = 99;
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
          if (m.id && (m.text || m.attachment)) {
            setChatMessages((prev) => {
              const next = [...prev.slice(-99), m];
              // Bound attachment memory: keep heavy `dataUrl` only on the most
              // recent N attachment messages. Older ones are kept as headers
              // (name/size/mime) so the chat history still shows the upload.
              const KEEP_FULL = 6;
              let attachmentsLeft = KEEP_FULL;
              for (let i = next.length - 1; i >= 0; i--) {
                const item = next[i];
                if (!item.attachment) continue;
                if (attachmentsLeft > 0) {
                  attachmentsLeft--;
                  continue;
                }
                if (item.attachment.dataUrl) {
                  next[i] = {
                    ...item,
                    attachment: { ...item.attachment, dataUrl: "" },
                  };
                }
              }
              return next;
            });
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
      // Auto-reconnect: if we made it into the room at least once and the
      // server gave us a fresh resume token, transparently reattach. Cap
      // attempts so a hard server outage eventually surfaces as "disconnected"
      // instead of looping forever. We deliberately do NOT clear the token
      // here — a single-use token is only consumed on the server when the
      // reconnect socket successfully sends `resume_session`. If the dial
      // itself fails before the server sees it, the same token is still good
      // for the next attempt. On a successful `resumed`, we'll mint and store
      // a fresh one; if the server rejects the token (`join_denied`), we'll
      // surface the error and stop retrying.
      const token = resumeTokenRef.current;
      if (hasJoinedRef.current && token && reconnectAttemptsRef.current < 5) {
        reconnectAttemptsRef.current += 1;
        setStatus("connecting");
        const delay = Math.min(4000, 300 * reconnectAttemptsRef.current ** 2);
        if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = setTimeout(() => {
          connect({ useResumeToken: token });
        }, delay);
        return;
      }
      setStatus((prev) => (prev === "denied" ? "denied" : "disconnected"));
    });

    socket.addEventListener("error", () => {
      // Let the close handler decide whether to reconnect or surface the error.
      // We only flip to "error" if we never managed to join in the first place.
      if (!hasJoinedRef.current) {
        setStatus((prev) => (prev === "denied" ? "denied" : "error"));
        setErrorMessage("Connection error");
      }
    });
  }, []);

  useEffect(() => {
    connect();
    // Background-refresh the resume token every 20s so reconnects always have
    // a fresh single-use credential ready to go.
    tokenPollTimerRef.current = setInterval(() => {
      const sock = socketRef.current;
      if (sock && sock.readyState === WebSocket.OPEN && hasJoinedRef.current) {
        sock.send(JSON.stringify({ type: "request_resume_token" }));
      }
    }, 20000);

    return () => {
      closedManuallyRef.current = true;
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      if (tokenPollTimerRef.current) clearInterval(tokenPollTimerRef.current);
      const sock = socketRef.current;
      try {
        if (sock && sock.readyState === WebSocket.OPEN) {
          sock.send(JSON.stringify({ type: "leave" }));
        }
        sock?.close();
      } catch {
        /* ignore */
      }
      socketRef.current = null;
    };
  }, [connect]);

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
    chatCooldownUntil,
    consumeReaction: (id: string) =>
      setLiveReactions((prev) => prev.filter((r) => r.id !== id)),
    acceptJoin: (requestId) => sendMessage("accept_join", { requestId }),
    denyJoin: (requestId) => sendMessage("deny_join", { requestId }),
    startGame: () => sendMessage("start_game"),
    nextRound: () => sendMessage("next_round"),
    trade: (ticker, action, shares) => sendMessage("trade", { ticker, action, shares }),
    sendChat: (text: string, attachment?: ChatAttachmentWire) =>
      sendMessage("chat_message", attachment ? { text, attachment } : { text }),
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
