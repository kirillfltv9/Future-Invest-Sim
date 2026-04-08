import { useState } from "react";
import { useLocation, useSearch } from "wouter";
import { motion } from "framer-motion";
import { setSessionId } from "@/lib/session";
import { ArrowRight, Wallet, User, TrendingUp, Loader2, Bitcoin, BarChart2, Layers, ArrowLeft, Sparkles, BookOpen } from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";

type MarketMode = "stocks" | "crypto" | "mixed";
type GameEra = "classic" | "future" | "present";

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

  const [name, setName] = useState("");
  const [cashInput, setCashInput] = useState("10000");
  const [mode, setMode] = useState<MarketMode>("stocks");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parsedCash = (() => {
    const n = parseFloat(cashInput.replace(/,/g, ""));
    if (isNaN(n) || n < 100 || n > 10_000_000) return null;
    return n;
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isLoading || !parsedCash) return;
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

  const backTo = era === "future" ? "/future" : era === "present" ? "/present" : "/";

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
              <p className="text-lg text-muted-foreground">Invest through 10 years of real market history — 2015 to 2025.</p>
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

          {/* Starting Capital */}
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

          <button
            type="submit"
            disabled={!name.trim() || isLoading || !parsedCash}
            className={cn(
              "w-full py-4 rounded-xl font-bold text-lg transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2",
              era === "future"
                ? "bg-violet-600 hover:bg-violet-500 text-white hover:shadow-[0_0_30px_rgba(139,92,246,0.4)]"
                : era === "present"
                ? "bg-emerald-600 hover:bg-emerald-500 text-white hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]"
                : "bg-white text-black hover:bg-white/90 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            )}
          >
            {isLoading
              ? <Loader2 className="w-6 h-6 animate-spin" />
              : <>{era === "future" ? "Start Future Mode" : era === "present" ? "Start Present Mode" : "Start Journey"} <ArrowRight className="w-5 h-5" /></>
            }
          </button>

          {error && <p className="text-sm text-red-400 text-center">{error}</p>}
        </form>
      </motion.div>
    </div>
  );
}
