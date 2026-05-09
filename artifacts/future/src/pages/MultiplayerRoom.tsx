import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Copy,
  Check,
  Loader2,
  AlertCircle,
  LogOut,
  Play,
  Clock,
  Calendar,
  Newspaper,
  Trophy,
  Wifi,
  Sparkles,
  Save,
} from "lucide-react";
import { useListStocks } from "@workspace/api-client-react";
import { useMultiplayerRoom, clearMultiplayerIntent } from "@/lib/multiplayerSocket";
import { Leaderboard } from "@/components/multiplayer/Leaderboard";
import { MultiplayerMarketPanel } from "@/components/multiplayer/MultiplayerMarketPanel";
import { HoldingsList } from "@/components/dashboard/HoldingsList";
import { SaveCodeModal } from "@/components/SaveCodeModal";
import { FinalStandings } from "@/components/FinalStandings";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import { DEFAULT_AVATAR } from "@/lib/avatar";
import { formatCurrency, cn } from "@/lib/utils";

export function MultiplayerRoom() {
  const [, setLocation] = useLocation();
  const mp = useMultiplayerRoom();
  const { data: stocks = [] } = useListStocks();
  const [copied, setCopied] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [showSave, setShowSave] = useState(false);

  const goHome = () => {
    mp.leave();
    clearMultiplayerIntent();
    setLocation("/");
  };

  const saveModal = (
    <SaveCodeModal
      isOpen={showSave}
      onClose={() => setShowSave(false)}
      onSave={() => mp.saveSession()}
      onLeave={goHome}
      leaveLabel="Save & exit"
    />
  );

  // Connecting / registering
  if (mp.status === "connecting" || mp.status === "registering" || mp.status === "idle") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground animate-pulse">Connecting to the game…</p>
      </div>
    );
  }

  if (mp.status === "pending_join") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-[#0d1117] border border-white/10 rounded-3xl p-8 text-center space-y-5"
        >
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
          <h2 className="text-2xl font-display font-bold">Waiting for host…</h2>
          <p className="text-sm text-muted-foreground">
            We've sent your join request. The host will accept or decline shortly.
          </p>
          <button
            onClick={goHome}
            className="w-full py-3 rounded-xl border border-white/10 text-sm font-semibold text-muted-foreground hover:text-foreground hover:border-white/20 transition-all"
          >
            Cancel
          </button>
        </motion.div>
      </div>
    );
  }

  if (mp.status === "denied" || mp.status === "error" || mp.status === "disconnected") {
    const headline =
      mp.status === "denied" ? "Join request declined"
      : mp.status === "disconnected" ? "Disconnected from the game"
      : "Connection error";
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-[#0d1117] border border-white/10 rounded-3xl p-8 text-center space-y-5"
        >
          <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-display font-bold">{headline}</h2>
          {mp.errorMessage && (
            <p className="text-sm text-muted-foreground">{mp.errorMessage}</p>
          )}
          <button
            onClick={goHome}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all"
          >
            Back to start
          </button>
        </motion.div>
      </div>
    );
  }

  if (!mp.room) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground animate-pulse">Loading room…</p>
      </div>
    );
  }

  // Lobby
  if (mp.room.status === "lobby") {
    return (
      <>
        <Lobby
          room={mp.room}
          isHost={mp.isHost}
          onCopyCode={() => {
            navigator.clipboard.writeText(mp.room!.code).catch(() => {});
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          copied={copied}
          onAccept={mp.acceptJoin}
          onDeny={mp.denyJoin}
          onStart={mp.startGame}
          onSave={() => setShowSave(true)}
          onLeave={goHome}
        />
        {saveModal}
      </>
    );
  }

  // Finished
  if (mp.room.status === "finished") {
    return (
      <FinalStandings
        leaderboard={mp.room.leaderboard}
        roomCode={mp.room.code}
        myPlayerId={mp.myPlayerId}
        onPlayAgain={() => {
          mp.leave();
          clearMultiplayerIntent();
          setLocation("/setup");
        }}
        onLeave={goHome}
      />
    );
  }

  // Playing
  return (
    <>
      <PlayingView
        room={mp.room}
        you={mp.you}
        stocks={stocks}
        isHost={mp.isHost}
        myPlayerId={mp.myPlayerId}
        onTrade={mp.trade}
        onNextRound={mp.nextRound}
        onSave={() => setShowSave(true)}
        onLeave={goHome}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
      {saveModal}
    </>
  );
}

// LOBBY

function Lobby({
  room,
  isHost,
  onCopyCode,
  copied,
  onAccept,
  onDeny,
  onStart,
  onSave,
  onLeave,
}: {
  room: NonNullable<ReturnType<typeof useMultiplayerRoom>["room"]>;
  isHost: boolean;
  onCopyCode: () => void;
  copied: boolean;
  onAccept: (id: string) => void;
  onDeny: (id: string) => void;
  onStart: () => void;
  onSave: () => void;
  onLeave: () => void;
}) {
  const canStart = isHost && room.players.length >= 1;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="h-16 border-b border-white/5 bg-black/20 backdrop-blur-md flex items-center justify-between px-6 shrink-0">
        <div className="font-display font-bold text-xl flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          Future. <span className="text-muted-foreground font-normal">/ Multiplayer Lobby</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onSave}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-lg border border-primary/30 text-primary hover:bg-primary/10"
            title="Save and get a resume code"
          >
            <Save className="w-3.5 h-3.5" />
            Save
          </button>
          <button
            onClick={onLeave}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-lg border border-white/10 text-muted-foreground hover:text-destructive hover:border-destructive/40 hover:bg-destructive/10"
          >
            <LogOut className="w-3.5 h-3.5" />
            Leave
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Room code card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-3xl p-8 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-primary/10 blur-3xl rounded-full" />
            </div>
            <div className="relative">
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                Room Code
              </div>
              <div className="text-6xl md:text-7xl font-display font-bold tracking-[0.2em] font-mono mb-4">
                {room.code}
              </div>
              <button
                onClick={onCopyCode}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-sm font-semibold transition-all"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy code
                  </>
                )}
              </button>
              <p className="text-sm text-muted-foreground mt-4 max-w-md mx-auto">
                Share this code with friends. They can join by selecting Multiplayer →
                Join Game on the start screen.
              </p>
            </div>
          </motion.div>

          {/* Settings */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Starting Cash
              </div>
              <div className="text-xl font-display font-bold mt-1">
                {formatCurrency(room.startingCash)}
              </div>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Rounds
              </div>
              <div className="text-xl font-display font-bold mt-1">{room.totalRounds}</div>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Market
              </div>
              <div className="text-xl font-display font-bold mt-1 capitalize">
                {room.marketMode}
              </div>
            </div>
          </div>

          {/* Players */}
          <div className="bg-black/30 rounded-3xl border border-white/5 overflow-hidden">
            <div className="p-5 border-b border-white/5 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <h3 className="font-display font-semibold text-lg">
                Players · {room.players.length}/8
              </h3>
            </div>
            <div className="p-3 grid grid-cols-1 md:grid-cols-2 gap-2">
              {room.players.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#152042] to-[#0a0e25] flex items-end justify-center overflow-hidden shrink-0 border border-white/5">
                    <PlayerAvatar avatar={p.avatar ?? DEFAULT_AVATAR} size={56} compact />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{p.name}</div>
                    {p.isHost && (
                      <div className="text-[10px] uppercase tracking-widest text-yellow-400/80 font-bold">
                        Host
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending joins (host only) */}
          {isHost && room.pendingJoins.length > 0 && (
            <div className="bg-yellow-400/5 rounded-3xl border border-yellow-400/20 overflow-hidden">
              <div className="p-5 border-b border-yellow-400/10 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                <h3 className="font-display font-semibold text-lg text-yellow-300">
                  Join Requests
                </h3>
              </div>
              <div className="p-3 space-y-2">
                {room.pendingJoins.map((req) => (
                  <div
                    key={req.requestId}
                    className="flex items-center gap-3 p-3 rounded-xl bg-black/30 border border-white/5"
                  >
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-display font-bold">
                      {req.playerName.slice(0, 1).toUpperCase()}
                    </div>
                    <div className="flex-1 font-semibold">{req.playerName}</div>
                    <button
                      onClick={() => onDeny(req.requestId)}
                      className="px-3 py-1.5 rounded-lg text-sm font-semibold border border-white/10 text-muted-foreground hover:text-destructive hover:border-destructive/40 hover:bg-destructive/10"
                    >
                      Deny
                    </button>
                    <button
                      onClick={() => onAccept(req.requestId)}
                      className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-emerald-500 text-black hover:bg-emerald-400"
                    >
                      Accept
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Start button (host) */}
          {isHost ? (
            <button
              onClick={onStart}
              disabled={!canStart}
              className={cn(
                "w-full py-4 rounded-2xl font-display font-bold text-lg transition-all flex items-center justify-center gap-2",
                canStart
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_30px_rgba(var(--primary),0.3)]"
                  : "bg-white/5 text-muted-foreground cursor-not-allowed",
              )}
            >
              <Play className="w-5 h-5" />
              Start Game
            </button>
          ) : (
            <div className="text-center text-muted-foreground py-4">
              <Loader2 className="w-5 h-5 animate-spin inline mr-2" />
              Waiting for host to start the game…
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// PLAYING VIEW

function PlayingView({
  room,
  you,
  stocks,
  isHost,
  myPlayerId,
  onTrade,
  onNextRound,
  onSave,
  onLeave,
  collapsed,
  setCollapsed,
}: {
  room: NonNullable<ReturnType<typeof useMultiplayerRoom>["room"]>;
  you: ReturnType<typeof useMultiplayerRoom>["you"];
  stocks: ReturnType<typeof useListStocks>["data"];
  isHost: boolean;
  myPlayerId: string | null;
  onTrade: (ticker: string, action: "buy" | "sell", shares: number) => void;
  onNextRound: () => void;
  onSave: () => void;
  onLeave: () => void;
  collapsed: boolean;
  setCollapsed: (c: boolean) => void;
}) {
  const stocksList = stocks ?? [];

  // Map server prices into the StockPrice shape HoldingsList expects
  const pricesForHoldings = useMemo(
    () =>
      room.prices.map((p) => ({
        ticker: p.ticker,
        price: p.price,
        open: p.open,
        high: p.high,
        low: p.low,
        change: p.change,
        changePercent: p.changePercent,
        volume: p.volume,
        priceHistory: [p.price],
      })),
    [room.prices],
  );

  const myEntry = room.leaderboard.find((e) => e.playerId === myPlayerId);
  const totalValue = myEntry?.totalValue ?? you?.cash ?? room.startingCash;
  const startingCash = myEntry?.startingCash ?? room.startingCash;
  const gain = totalValue - startingCash;
  const gainPct = (gain / startingCash) * 100;
  const isPositive = gain >= 0;

  // For HoldingsList we need to convert PlayerHolding -> StockHolding shape
  const holdingsForList = (you?.holdings ?? []).map((h) => ({
    ticker: h.ticker,
    shares: h.shares,
    avgCostBasis: h.avgCostBasis,
    currentPrice: h.currentPrice,
    totalValue: h.totalValue,
    gainLoss: h.gainLoss,
    gainLossPercent: h.gainLossPercent,
  }));

  const lastRound = room.currentRound >= room.totalRounds - 1;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col overflow-hidden">
      {/* Header */}
      <header className="h-16 border-b border-white/5 bg-black/20 backdrop-blur-md flex items-center justify-between px-6 shrink-0 sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <div className="font-display font-bold text-xl flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Future.
          </div>
          <div className="h-6 w-px bg-white/10" />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span className="font-medium text-foreground">{room.currentDate}</span>
          </div>
          <div className="h-6 w-px bg-white/10" />
          <div className="text-xs text-muted-foreground flex items-center gap-1.5">
            <span className="text-white/40">Round</span>
            <span className="font-bold text-foreground">
              {room.currentRound}
            </span>
            <span className="text-white/40">/ {room.totalRounds}</span>
          </div>
          <div className="h-6 w-px bg-white/10" />
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-mono text-muted-foreground">{room.code}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isHost && (
            <button
              onClick={onNextRound}
              className={cn(
                "flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold rounded-xl transition-all",
                lastRound
                  ? "bg-yellow-500 text-black hover:bg-yellow-400"
                  : "bg-primary text-primary-foreground hover:bg-primary/90",
              )}
            >
              <Clock className="w-3.5 h-3.5" />
              {lastRound ? "Final Round" : "Next Round"}
            </button>
          )}
          {!isHost && (
            <div className="text-xs text-muted-foreground italic">
              Host controls round
            </div>
          )}
          <button
            onClick={onSave}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-lg border border-primary/30 text-primary hover:bg-primary/10"
            title="Save and get a resume code"
          >
            <Save className="w-3.5 h-3.5" />
            Save
          </button>
          <button
            onClick={onLeave}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-lg border border-white/10 text-muted-foreground hover:text-destructive hover:border-destructive/40 hover:bg-destructive/10"
          >
            <LogOut className="w-3.5 h-3.5" />
            Leave
          </button>
        </div>
      </header>

      <main
        className={cn(
          "flex-1 overflow-y-auto transition-all",
          collapsed ? "pr-12" : "pr-80",
        )}
      >
        <div className="max-w-[1400px] mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-5">
            {/* Portfolio card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel rounded-3xl p-6 relative overflow-hidden"
            >
              <div className="absolute inset-0 pointer-events-none">
                <div
                  className={cn(
                    "absolute top-0 right-0 w-64 h-64 blur-3xl rounded-full opacity-10",
                    isPositive ? "bg-emerald-400" : "bg-red-500",
                  )}
                />
              </div>
              <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <div className="text-muted-foreground font-medium text-sm mb-1">
                    Your Portfolio
                  </div>
                  <div className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-2">
                    {formatCurrency(totalValue)}
                  </div>
                  <div
                    className={cn(
                      "inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold",
                      isPositive
                        ? "bg-success/10 text-success"
                        : "bg-destructive/10 text-destructive",
                    )}
                  >
                    {isPositive ? "+" : ""}
                    {formatCurrency(gain)} ({isPositive ? "+" : ""}
                    {gainPct.toFixed(2)}%)
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    Started with {formatCurrency(startingCash)} ·{" "}
                    {myEntry ? `Rank #${myEntry.rank}` : ""}
                  </div>
                </div>
                <div className="space-y-1 md:border-l border-white/10 md:pl-6">
                  <div className="text-muted-foreground font-medium text-sm">Cash</div>
                  <div className="text-2xl md:text-3xl font-display font-bold text-financial">
                    {formatCurrency(you?.cash ?? room.startingCash)}
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    Across {(you?.holdings ?? []).length} assets
                  </div>
                </div>
              </div>
            </motion.div>

            {/* News */}
            {room.news.length > 0 && (
              <div className="bg-black/30 border border-white/5 rounded-2xl p-4 flex items-start gap-4">
                <div className="shrink-0 p-2 bg-white/5 rounded-lg text-muted-foreground">
                  <Newspaper className="w-5 h-5" />
                </div>
                <div className="flex-1 space-y-2">
                  <h4 className="text-sm font-semibold uppercase tracking-wider">
                    Market News
                  </h4>
                  <ul className="space-y-1">
                    {room.news.map((n, i) => (
                      <li
                        key={i}
                        className="text-sm flex items-center gap-2 text-muted-foreground"
                      >
                        <div className="w-1 h-1 rounded-full bg-primary/50" />
                        {n}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Holdings */}
            <div className="glass-panel rounded-3xl overflow-hidden">
              <div className="p-5 border-b border-white/5">
                <h3 className="text-xl font-display font-semibold">Your Holdings</h3>
              </div>
              <HoldingsList
                holdings={holdingsForList as Parameters<typeof HoldingsList>[0]["holdings"]}
                prices={pricesForHoldings as Parameters<typeof HoldingsList>[0]["prices"]}
              />
            </div>
          </div>

          {/* Market Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-4 hidden lg:block"
          >
            <MultiplayerMarketPanel
              stocks={stocksList}
              prices={room.prices}
              holdings={you?.holdings ?? []}
              cashBalance={you?.cash ?? 0}
              canTrade={room.status === "playing"}
              onTrade={onTrade}
            />
          </motion.div>
        </div>
      </main>

      {/* Mobile market */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-white/10 p-4 z-20 h-[45vh] overflow-y-auto">
        <MultiplayerMarketPanel
          stocks={stocksList}
          prices={room.prices}
          holdings={you?.holdings ?? []}
          cashBalance={you?.cash ?? 0}
          canTrade={room.status === "playing"}
          onTrade={onTrade}
        />
      </div>

      <Leaderboard
        entries={room.leaderboard}
        myPlayerId={myPlayerId}
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        currentRound={room.currentRound}
        totalRounds={room.totalRounds}
      />
    </div>
  );
}

