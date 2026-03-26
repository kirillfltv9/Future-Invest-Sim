import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { setSessionId, getSessionId } from "@/lib/session";
import { ArrowRight, Wallet, User, TrendingUp, Loader2, Bitcoin, BarChart2, Layers, ChevronUp, ChevronDown } from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";

const STARTING_AMOUNTS = [1000, 5000, 10000, 25000, 50000, 100000];

type MarketMode = "stocks" | "crypto" | "mixed";

const MODES: { id: MarketMode; label: string; sub: string; icon: React.ReactNode; color: string }[] = [
  { id: "stocks", label: "Stocks",  sub: "60+ companies",      icon: <BarChart2 className="w-5 h-5" />, color: "blue" },
  { id: "crypto", label: "Crypto",  sub: "BTC, ETH, SOL & more", icon: <Bitcoin className="w-5 h-5" />,  color: "orange" },
  { id: "mixed",  label: "Both",    sub: "Stocks + Crypto",    icon: <Layers className="w-5 h-5" />,   color: "purple" },
];

const MODE_COLORS: Record<MarketMode, string> = {
  stocks: "border-blue-500 bg-blue-500/15 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.25)]",
  crypto: "border-orange-500 bg-orange-500/15 text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.25)]",
  mixed:  "border-purple-500 bg-purple-500/15 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.25)]",
};

type LevelInfo = { badge: string; name: string; difficulty: string; diffColor: string };

function getLevelInfo(level: number): LevelInfo {
  if (level === 100) return { badge: "☄️", name: "Immortal",    difficulty: "Impossible",  diffColor: "text-purple-300" };
  if (level >= 91)   return { badge: "🌌", name: `God Mode ${level}`,  difficulty: "Extreme+",    diffColor: "text-purple-400" };
  if (level >= 81)   return { badge: "🏆", name: `Legend ${level}`,    difficulty: "Legendary",   diffColor: "text-yellow-400" };
  if (level >= 71)   return { badge: "👻", name: `Phantom ${level}`,   difficulty: "Very Hard",   diffColor: "text-slate-300" };
  if (level >= 61)   return { badge: "⚔️", name: `Titan ${level}`,     difficulty: "Brutal",      diffColor: "text-red-400" };
  if (level >= 51)   return { badge: "🦢", name: `Black Swan ${level}`,difficulty: "Brutal",      diffColor: "text-red-500" };
  if (level >= 41)   return { badge: "🐺", name: `Wolf ${level}`,      difficulty: "Hard+",       diffColor: "text-orange-400" };
  if (level >= 31)   return { badge: "🧮", name: `Quant ${level}`,     difficulty: "Hard",        diffColor: "text-orange-300" };
  if (level >= 21)   return { badge: "📊", name: `Strategist ${level}`,difficulty: "Medium+",     diffColor: "text-blue-300" };
  if (level >= 11)   return { badge: "📊", name: `Strategist ${level}`,difficulty: "Medium",      diffColor: "text-blue-400" };
  const tier1: LevelInfo[] = [
    { badge: "🌱", name: "Tutorial",     difficulty: "Super Easy",  diffColor: "text-emerald-400" },
    { badge: "📈", name: "Beginner",     difficulty: "Easy",        diffColor: "text-emerald-400" },
    { badge: "🔍", name: "Apprentice",   difficulty: "Easy+",       diffColor: "text-green-400" },
    { badge: "⚖️", name: "Novice",       difficulty: "Normal",      diffColor: "text-green-300" },
    { badge: "🎯", name: "Intermediate", difficulty: "Normal+",     diffColor: "text-blue-400" },
    { badge: "🏛️", name: "Advanced",     difficulty: "Challenging", diffColor: "text-blue-300" },
    { badge: "🔥", name: "Expert",       difficulty: "Hard",        diffColor: "text-orange-400" },
    { badge: "💎", name: "Pro Trader",   difficulty: "Hard+",       diffColor: "text-orange-300" },
    { badge: "⚡", name: "Veteran",      difficulty: "Very Hard",   diffColor: "text-red-400" },
    { badge: "🌍", name: "Real Life",    difficulty: "Real",        diffColor: "text-red-500" },
  ];
  return tier1[level - 1]!;
}

const MAX_LEVEL = 100;

export function Landing() {
  const [, setLocation] = useLocation();
  const [name, setName] = useState("");
  const [cash, setCash] = useState<number>(10000);
  const [mode, setMode] = useState<MarketMode>("stocks");
  const [startLevel, setStartLevel] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (getSessionId()) {
      setLocation("/dashboard");
    }
  }, [setLocation]);

  function changeLevel(delta: number) {
    setStartLevel(prev => Math.max(1, Math.min(MAX_LEVEL, prev + delta)));
  }

  const levelInfo = getLevelInfo(startLevel);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isLoading) return;
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch("/api/game/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerName: name.trim(), startingCash: cash, marketMode: mode, level: startLevel }),
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

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      <div className="absolute inset-0 z-0">
        <img
          src={`${import.meta.env.BASE_URL}images/landing-bg.png`}
          alt="Abstract financial background"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background to-background" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-xl p-8"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 text-primary mb-6 shadow-[0_0_30px_rgba(var(--primary),0.3)]">
            <TrendingUp className="w-8 h-8" />
          </div>
          <h1 className="text-5xl font-display font-bold mb-4 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
            Future.
          </h1>
          <p className="text-lg text-muted-foreground">
            Master the market. Practice investing with real mechanics, zero risk.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-3xl space-y-7">

          {/* Market Mode */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Market Type
            </label>
            <div className="grid grid-cols-3 gap-3">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMode(m.id)}
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

          {/* Starting Level */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <span>{levelInfo.badge}</span>
              Starting Level
            </label>

            <div className="bg-black/30 border border-white/10 rounded-2xl p-4 space-y-4">
              {/* Level display + controls */}
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center gap-1">
                  <button type="button" onClick={() => changeLevel(1)}  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"><ChevronUp className="w-4 h-4" /></button>
                  <div className="w-16 h-14 rounded-xl bg-white/5 flex items-center justify-center">
                    <span className="text-2xl font-display font-bold">{startLevel}</span>
                  </div>
                  <button type="button" onClick={() => changeLevel(-1)} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"><ChevronDown className="w-4 h-4" /></button>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{levelInfo.badge}</span>
                    <span className="font-bold text-lg">{levelInfo.name}</span>
                  </div>
                  <span className={cn("text-sm font-semibold", levelInfo.diffColor)}>{levelInfo.difficulty}</span>
                  <p className="text-xs text-muted-foreground mt-1">
                    Each level resets to your starting capital when you move on.
                  </p>
                </div>
              </div>

              {/* Slider */}
              <input
                type="range"
                min={1}
                max={MAX_LEVEL}
                value={startLevel}
                onChange={(e) => setStartLevel(Number(e.target.value))}
                className="w-full accent-primary h-1.5 rounded-full"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>🌱 Lvl 1</span>
                <span>🌍 Lvl 10</span>
                <span>🦈 Lvl 30</span>
                <span>🏆 Lvl 80</span>
                <span>☄️ 100</span>
              </div>
            </div>
          </div>

          {/* Trader Name */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <User className="w-4 h-4" />
              Trader Alias
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. WallStreetWhale"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-white/20"
              required
              maxLength={20}
            />
          </div>

          {/* Starting Capital */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              Starting Capital
            </label>
            <div className="grid grid-cols-3 gap-3">
              {STARTING_AMOUNTS.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => setCash(amount)}
                  className={`py-3 rounded-xl border font-financial transition-all ${
                    cash === amount
                      ? "bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(var(--primary),0.2)]"
                      : "bg-white/5 border-white/5 text-muted-foreground hover:bg-white/10"
                  }`}
                >
                  {formatCurrency(amount).replace(".00", "")}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!name.trim() || isLoading}
            className="w-full py-4 rounded-xl bg-white text-black font-bold text-lg hover:bg-white/90 transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                Start at Level {startLevel} <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          {error && (
            <p className="mt-3 text-sm text-red-400 text-center">{error}</p>
          )}
        </form>
      </motion.div>
    </div>
  );
}
