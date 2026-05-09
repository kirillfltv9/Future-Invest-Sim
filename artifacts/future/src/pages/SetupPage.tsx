import { useState } from "react";
import { useLocation, useSearch } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { setSessionId, clearSessionId } from "@/lib/session";
import { setMultiplayerIntent } from "@/lib/multiplayerSocket";
import { loadNickname } from "@/lib/nickname";
import {
  ArrowRight, Wallet, User, TrendingUp, Loader2, Bitcoin,
  BarChart2, Layers, ArrowLeft, Sparkles, BookOpen,
  Users, UserCircle, Crown, KeyRound, AlertTriangle,
} from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";

type MarketMode = "stocks" | "crypto" | "mixed";
type GameEra = "classic" | "future" | "present";
type PlayMode = "solo" | "multiplayer";

const QUICK_AMOUNTS = [1000, 5000, 10000, 25000, 100000];

const MODES: { id: MarketMode; label: string; sub: string; icon: React.ReactNode; color: string }[] = [
  { id: "stocks", label: "Stocks",  sub: "60+ companies",        icon: <BarChart2 className="w-5 h-5" />, color: "blue" },
  { id: "crypto", label: "Crypto",  sub: "BTC, ETH, SOL & more", icon: <Bitcoin className="w-5 h-5" />,  color: "orange" },
  { id: "mixed",  label: "Both",    sub: "Stocks + Crypto",      icon: <Layers className="w-5 h-5" />,   color: "purple" },
];

const MODE_COLORS: Record<MarketMode, string> = {
  stocks: "border-blue-500 bg-blue-500/15 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.25)]",
  crypto: "border-orange-500 bg-orange-500/15 text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.25)]",
  mixed:  "border-purple-500 bg-purple-500/15 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.25)]",
};

export function SetupPage() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const rawEra = params.get("era");
  const era: GameEra = rawEra === "future" ? "future" : rawEra === "present" ? "present" : "classic";

  const [name, setName] = useState(() => loadNickname());
  const [cashInput, setCashInput] = useState("10000");
  const [mode, setMode] = useState<MarketMode>("stocks");
  const [playMode, setPlayMode] = useState<PlayMode>("solo");
  const [joinAction, setJoinAction] = useState<"choose" | "join">("choose");
  const [joinCode, setJoinCode] = useState("");
  const [showJoinWarning, setShowJoinWarning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parsedCash = (() => {
    const n = parseFloat(cashInput.replace(/,/g, ""));
    if (isNaN(n) || n < 100 || n > 10_000_000) return null;
    return n;
  })();

  const startSolo = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch("/api/game/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerName: name.trim(), startingCash: parsedCash, marketMode: mode, gameEra: era }),
      });
      if (!res.ok) throw new Error("Server error");
      const data = await res.json();
      if (data.sessionId) {
        setSessionId(data.sessionId);
        setLocation("/dashboard");
      }
    } catch {
      setError("Could not start the game. Please try again.");
      setIsLoading(false);
    }
  };

  const startHost = () => {
    if (!name.trim() || !parsedCash) return;
    setMultiplayerIntent({
      mode: "host",
      playerName: name.trim(),
      marketMode: mode,
      startingCash: parsedCash,
    });
    setLocation("/multiplayer/avatar");
  };

  const confirmJoin = () => {
    if (!name.trim() || joinCode.trim().length < 4) return;
    // Wipe solo session per spec
    clearSessionId();
    setMultiplayerIntent({
      mode: "join",
      playerName: name.trim(),
      joinCode: joinCode.trim().toUpperCase(),
    });
    setLocation("/multiplayer/avatar");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isLoading || !parsedCash) return;
    if (playMode === "solo") {
      await startSolo();
    } else if (joinAction === "choose") {
      // In multiplayer mode the main submit hosts a room
      startHost();
    } else {
      setShowJoinWarning(true);
    }
  };

  const backTo = era === "future" ? "/future" : era === "present" ? "/present" : "/";

  const submitDisabled =
    !name.trim() ||
    isLoading ||
    !parsedCash ||
    (playMode === "multiplayer" && joinAction === "join" && joinCode.trim().length < 4);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      <div className="absolute inset-0 z-0">
        <img
          src={`${import.meta.env.BASE_URL}images/landing-bg.png`}
          alt=""
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background to-background" />
      </div>

      {/* Join warning modal */}
      <AnimatePresence>
        {showJoinWarning && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-md w-full bg-[#0d1117] border border-yellow-400/30 rounded-3xl p-8 text-center space-y-5"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-yellow-400/10 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-yellow-400" />
              </div>
              <h3 className="text-2xl font-display font-bold">Heads up!</h3>
              <p className="text-sm text-muted-foreground">
                Joining multiplayer will not save your current solo progress.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowJoinWarning(false)}
                  className="flex-1 py-3 rounded-xl border border-white/10 text-sm font-semibold text-muted-foreground hover:text-foreground hover:border-white/20"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmJoin}
                  className="flex-1 py-3 rounded-xl bg-yellow-400 text-black font-semibold hover:bg-yellow-300"
                >
                  Join anyway
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-xl px-6 py-10"
      >
        <button
          onClick={() => setLocation(backTo)}
          className="flex items-center gap-2 text-muted-foreground hover:text-white text-sm transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="text-center mb-8">
          <div className={cn(
            "inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5",
            era === "future"
              ? "bg-violet-500/20 text-violet-400 shadow-[0_0_30px_rgba(139,92,246,0.3)]"
              : era === "present"
              ? "bg-emerald-500/20 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)]"
              : "bg-primary/20 text-primary shadow-[0_0_30px_rgba(var(--primary),0.3)]"
          )}>
            {era === "future" ? <Sparkles className="w-8 h-8" /> : era === "present" ? <BookOpen className="w-8 h-8" /> : <TrendingUp className="w-8 h-8" />}
          </div>
          <h1 className="text-5xl font-display font-bold mb-3 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
            {era === "future" ? "Future Mode" : era === "present" ? "Present Mode" : "Future."}
          </h1>
          {era === "future" ? (
            <>
              <p className="text-lg text-muted-foreground">Invest through your predicted 2025–2035.</p>
              <p className="text-sm text-muted-foreground/60 mt-1">AI boom. Global conflict. Recovery. Can your portfolio survive it?</p>
            </>
          ) : era === "present" ? (
            <>
              <p className="text-lg text-muted-foreground">Invest through 2025–2026 — the near future.</p>
              <p className="text-sm text-muted-foreground/60 mt-1">AI bubble. Oil shocks. Stagflation. Can your portfolio survive?</p>
            </>
          ) : (
            <>
              <p className="text-lg text-muted-foreground">Invest through 10 years of real market history.</p>
              <p className="text-sm text-muted-foreground/60 mt-1">Brexit. COVID. Ukraine. ChatGPT. Your portfolio will feel all of it.</p>
            </>
          )}
        </div>

        <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-3xl space-y-7">
          {/* Market Mode */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Layers className="w-4 h-4" /> Market Type
            </label>
            <div className="grid grid-cols-3 gap-3">
              {MODES.map((m) => (
                <button key={m.id} type="button" onClick={() => setMode(m.id)}
                  className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border font-medium transition-all ${
                    mode === m.id ? MODE_COLORS[m.id] : "bg-white/5 border-white/5 text-muted-foreground hover:bg-white/10"
                  }`}
                >
                  {m.icon}
                  <span className="text-sm font-semibold">{m.label}</span>
                  <span className="text-[10px] opacity-70 font-normal">{m.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Trader Name + Solo/Multiplayer toggle */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <User className="w-4 h-4" /> Trader Alias
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="e.g. WallStreetWhale"
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-5 py-3.5 text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-white/20"
                required maxLength={20}
              />
              <div className="flex bg-black/30 border border-white/10 rounded-xl p-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setPlayMode("solo")}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all",
                    playMode === "solo"
                      ? "bg-white text-black"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                  title="Play alone"
                >
                  <UserCircle className="w-4 h-4" />
                  Solo
                </button>
                <button
                  type="button"
                  onClick={() => setPlayMode("multiplayer")}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all",
                    playMode === "multiplayer"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                  title="Play with friends"
                >
                  <Users className="w-4 h-4" />
                  Multiplayer
                </button>
              </div>
            </div>
          </div>

          {/* Multiplayer-specific options */}
          <AnimatePresence initial={false}>
            {playMode === "multiplayer" && (
              <motion.div
                key="mp-config"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 overflow-hidden"
              >
                <div className="grid grid-cols-2 gap-2 bg-black/30 border border-white/10 rounded-xl p-1">
                  <button
                    type="button"
                    onClick={() => setJoinAction("choose")}
                    className={cn(
                      "flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-semibold transition-all",
                      joinAction === "choose"
                        ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <Crown className="w-4 h-4" />
                    Host Game
                  </button>
                  <button
                    type="button"
                    onClick={() => setJoinAction("join")}
                    className={cn(
                      "flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-semibold transition-all",
                      joinAction === "join"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <KeyRound className="w-4 h-4" />
                    Join Game
                  </button>
                </div>

                {joinAction === "join" && (
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-2 block">
                      Room code
                    </label>
                    <input
                      type="text"
                      value={joinCode}
                      maxLength={6}
                      onChange={(e) =>
                        setJoinCode(e.target.value.replace(/[^A-Za-z0-9]/g, "").toUpperCase())
                      }
                      placeholder="ABC123"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3.5 text-2xl font-mono tracking-[0.3em] text-center focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Starting Capital — solo & host show it; joiners use host's value */}
          {!(playMode === "multiplayer" && joinAction === "join") && (
            <div className="space-y-3">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Wallet className="w-4 h-4" /> Starting Capital
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-lg">$</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={cashInput}
                  onChange={(e) => setCashInput(e.target.value.replace(/[^0-9.]/g, ""))}
                  placeholder="Enter any amount"
                  className={cn(
                    "w-full bg-black/40 border rounded-xl pl-8 pr-4 py-3.5 text-base font-financial focus:outline-none focus:ring-2 transition-all placeholder:text-white/20",
                    parsedCash ? "border-primary/50 focus:border-primary focus:ring-primary/20" : cashInput.length > 0 ? "border-red-500/40 focus:border-red-500 focus:ring-red-500/20" : "border-white/10"
                  )}
                />
                {parsedCash && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-emerald-400 font-medium">
                    {formatCurrency(parsedCash)}
                  </span>
                )}
              </div>
              {!parsedCash && cashInput.length > 0 && (
                <p className="text-xs text-red-400">Enter an amount between $100 and $10,000,000</p>
              )}
              <div className="flex gap-2 flex-wrap">
                {QUICK_AMOUNTS.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setCashInput(String(amount))}
                    className={cn(
                      "px-3 py-1.5 rounded-lg border text-xs font-financial transition-all",
                      parsedCash === amount
                        ? "bg-primary/20 border-primary text-primary"
                        : "bg-white/5 border-white/5 text-muted-foreground hover:bg-white/10"
                    )}
                  >
                    {formatCurrency(amount).replace(".00", "")}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={submitDisabled}
            className={cn(
              "w-full py-4 rounded-xl font-bold text-lg transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2",
              playMode === "multiplayer"
                ? joinAction === "join"
                  ? "bg-emerald-500 hover:bg-emerald-400 text-black hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]"
                  : "bg-yellow-500 hover:bg-yellow-400 text-black hover:shadow-[0_0_30px_rgba(234,179,8,0.4)]"
                : era === "future"
                ? "bg-violet-600 hover:bg-violet-500 text-white hover:shadow-[0_0_30px_rgba(139,92,246,0.4)]"
                : era === "present"
                ? "bg-emerald-600 hover:bg-emerald-500 text-white hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]"
                : "bg-white text-black hover:bg-white/90 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            )}
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : playMode === "multiplayer" ? (
              joinAction === "join" ? (
                <>Join Room <ArrowRight className="w-5 h-5" /></>
              ) : (
                <>Create Room <ArrowRight className="w-5 h-5" /></>
              )
            ) : (
              <>{era === "future" ? "Start Future Mode" : era === "present" ? "Start Present Mode" : "Start Journey"} <ArrowRight className="w-5 h-5" /></>
            )}
          </button>

          {error && <p className="text-sm text-red-400 text-center">{error}</p>}
        </form>
      </motion.div>
    </div>
  );
}
