import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { setSessionId, getSessionId } from "@/lib/session";
import { ArrowRight, Wallet, User, TrendingUp, Loader2, Bitcoin, BarChart2, Layers, ChevronUp, ChevronDown } from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";

const QUICK_AMOUNTS = [1000, 5000, 10000, 25000, 100000];
const MAX_LEVEL = 1000;

type MarketMode = "stocks" | "crypto" | "mixed";

const MODES: { id: MarketMode; label: string; sub: string; icon: React.ReactNode; color: string }[] = [
  { id: "stocks", label: "Stocks",  sub: "60+ companies",       icon: <BarChart2 className="w-5 h-5" />, color: "blue" },
  { id: "crypto", label: "Crypto",  sub: "BTC, ETH, SOL & more",icon: <Bitcoin className="w-5 h-5" />,  color: "orange" },
  { id: "mixed",  label: "Both",    sub: "Stocks + Crypto",     icon: <Layers className="w-5 h-5" />,   color: "purple" },
];

const MODE_COLORS: Record<MarketMode, string> = {
  stocks: "border-blue-500 bg-blue-500/15 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.25)]",
  crypto: "border-orange-500 bg-orange-500/15 text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.25)]",
  mixed:  "border-purple-500 bg-purple-500/15 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.25)]",
};

type LevelInfo = { badge: string; name: string; difficulty: string; diffColor: string; downside: string };

function getLevelInfo(level: number): LevelInfo {
  // Approximate downside risk based on volatility scaling
  const t = (level - 1) / 999;
  const vol = 0.12 * Math.pow(25.0 / 0.12, t);
  const maxDailyDown = Math.min(99, (vol * 1.96 * 100));
  const downside = maxDailyDown < 5 ? `~${maxDailyDown.toFixed(1)}%` : `~${Math.round(maxDailyDown)}%`;

  if (level === 1000) return { badge: "🔮", name: "Omniscient",       difficulty: "∞ Impossible", diffColor: "text-fuchsia-300", downside };
  if (level >= 901)   return { badge: "☄️", name: `Cosmic ${level}`,   difficulty: "Cosmic",       diffColor: "text-purple-200",  downside };
  if (level >= 801)   return { badge: "🌠", name: `Mythical ${level}`, difficulty: "Mythical",     diffColor: "text-purple-300",  downside };
  if (level >= 701)   return { badge: "🌌", name: `God Mode ${level}`, difficulty: "God Mode",     diffColor: "text-violet-400",  downside };
  if (level >= 601)   return { badge: "🏆", name: `Legend ${level}`,   difficulty: "Legendary",    diffColor: "text-yellow-400",  downside };
  if (level >= 501)   return { badge: "👻", name: `Phantom ${level}`,  difficulty: "Extreme",      diffColor: "text-slate-300",   downside };
  if (level >= 401)   return { badge: "⚔️", name: `Titan ${level}`,    difficulty: "Brutal+",      diffColor: "text-red-300",     downside };
  if (level >= 301)   return { badge: "🦢", name: `Black Swan ${level}`,difficulty:"Brutal",       diffColor: "text-red-400",     downside };
  if (level >= 201)   return { badge: "🐺", name: `Wolf ${level}`,     difficulty: "Hard+",        diffColor: "text-orange-400",  downside };
  if (level >= 101)   return { badge: "🧮", name: `Quant ${level}`,    difficulty: "Hard",         diffColor: "text-orange-300",  downside };
  if (level >= 51)    return { badge: "🦈", name: `Hedge Fund ${level}`,difficulty:"Medium+",      diffColor: "text-blue-300",    downside };
  if (level >= 11)    return { badge: "📊", name: `Strategist ${level}`,difficulty:"Medium",       diffColor: "text-blue-400",    downside };
  const tier1: LevelInfo[] = [
    { badge: "🌱", name: "Tutorial",     difficulty: "Super Easy",  diffColor: "text-emerald-400", downside },
    { badge: "📈", name: "Beginner",     difficulty: "Easy",        diffColor: "text-emerald-400", downside },
    { badge: "🔍", name: "Apprentice",   difficulty: "Easy+",       diffColor: "text-green-400",   downside },
    { badge: "⚖️", name: "Novice",       difficulty: "Normal",      diffColor: "text-green-300",   downside },
    { badge: "🎯", name: "Intermediate", difficulty: "Normal+",     diffColor: "text-blue-400",    downside },
    { badge: "🏛️", name: "Advanced",     difficulty: "Challenging", diffColor: "text-blue-300",    downside },
    { badge: "🔥", name: "Expert",       difficulty: "Hard",        diffColor: "text-orange-400",  downside },
    { badge: "💎", name: "Pro Trader",   difficulty: "Hard+",       diffColor: "text-orange-300",  downside },
    { badge: "⚡", name: "Veteran",      difficulty: "Very Hard",   diffColor: "text-red-400",     downside },
    { badge: "🌍", name: "Real Life",    difficulty: "Real",        diffColor: "text-red-500",     downside },
  ];
  return tier1[level - 1]!;
}

export function Landing() {
  const [, setLocation] = useLocation();
  const [name, setName] = useState("");
  const [cashInput, setCashInput] = useState("10000");
  const [mode, setMode] = useState<MarketMode>("stocks");
  const [startLevel, setStartLevel] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (getSessionId()) setLocation("/dashboard");
  }, [setLocation]);

  const parsedCash = (() => {
    const n = parseFloat(cashInput.replace(/,/g, ""));
    if (isNaN(n) || n < 100) return null;
    if (n > 10_000_000) return null;
    return n;
  })();

  function changeLevel(delta: number) {
    setStartLevel(prev => Math.max(1, Math.min(MAX_LEVEL, prev + delta)));
  }

  const levelInfo = getLevelInfo(startLevel);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isLoading || !parsedCash) return;
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch("/api/game/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerName: name.trim(), startingCash: parsedCash, marketMode: mode, level: startLevel }),
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

          {/* Starting Level */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <span>{levelInfo.badge}</span> Starting Level
            </label>
            <div className="bg-black/30 border border-white/10 rounded-2xl p-4 space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center gap-1">
                  <button type="button" onClick={() => changeLevel(10)} className="w-8 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors text-[10px] font-bold text-muted-foreground">+10</button>
                  <button type="button" onClick={() => changeLevel(1)}  className="w-8 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"><ChevronUp className="w-4 h-4" /></button>
                  <div className="w-16 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                    <span className="text-xl font-display font-bold">{startLevel}</span>
                  </div>
                  <button type="button" onClick={() => changeLevel(-1)} className="w-8 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"><ChevronDown className="w-4 h-4" /></button>
                  <button type="button" onClick={() => changeLevel(-10)} className="w-8 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors text-[10px] font-bold text-muted-foreground">-10</button>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-lg">{levelInfo.badge}</span>
                    <span className="font-bold truncate">{levelInfo.name}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={cn("text-xs font-semibold", levelInfo.diffColor)}>{levelInfo.difficulty}</span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-red-400 font-medium">Max daily loss {levelInfo.downside}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed">
                    Each level resets to your starting capital. 1000 levels total.
                  </p>
                </div>
              </div>
              <input
                type="range" min={1} max={MAX_LEVEL} value={startLevel}
                onChange={(e) => setStartLevel(Number(e.target.value))}
                className="w-full accent-primary h-1.5 rounded-full"
              />
              <div className="flex justify-between text-[9px] text-muted-foreground px-0.5">
                <span>🌱 1</span><span>🌍 10</span><span>🦈 50</span><span>🐺 200</span><span>🏆 600</span><span>🔮 1000</span>
              </div>
            </div>
          </div>

          {/* Trader Name */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <User className="w-4 h-4" /> Trader Alias
            </label>
            <input
              type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="e.g. WallStreetWhale"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3.5 text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-white/20"
              required maxLength={20}
            />
          </div>

          {/* Starting Capital — free text + quick picks */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Wallet className="w-4 h-4" /> Starting Capital
            </label>

            {/* Free-form input */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-lg">$</span>
              <input
                type="text"
                inputMode="numeric"
                value={cashInput}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^0-9.]/g, "");
                  setCashInput(raw);
                }}
                placeholder="Enter any amount"
                className={cn(
                  "w-full bg-black/40 border rounded-xl pl-8 pr-4 py-3.5 text-base font-financial focus:outline-none focus:ring-2 transition-all placeholder:text-white/20",
                  parsedCash ? "border-primary/50 focus:border-primary focus:ring-primary/20" : "border-red-500/40 focus:border-red-500 focus:ring-red-500/20"
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

            {/* Quick picks */}
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

          <button
            type="submit"
            disabled={!name.trim() || isLoading || !parsedCash}
            className="w-full py-4 rounded-xl bg-white text-black font-bold text-lg hover:bg-white/90 transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Start at Level {startLevel} <ArrowRight className="w-5 h-5" /></>}
          </button>

          {error && <p className="text-sm text-red-400 text-center">{error}</p>}
        </form>
      </motion.div>
    </div>
  );
}
