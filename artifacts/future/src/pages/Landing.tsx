import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { setSessionId, getSessionId } from "@/lib/session";
import { ArrowRight, Wallet, User, TrendingUp, Loader2, Bitcoin, BarChart2, Layers, Monitor, ChevronRight } from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";

const QUICK_AMOUNTS = [1000, 5000, 10000, 25000, 100000];

type MarketMode = "stocks" | "crypto" | "mixed";

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

function IntroScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <motion.div
      key="intro"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
      className="relative z-10 w-full max-w-2xl px-6 py-10"
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 text-primary mb-5 shadow-[0_0_30px_rgba(var(--primary),0.3)]">
          <TrendingUp className="w-8 h-8" />
        </div>
        <h1 className="text-5xl font-display font-bold mb-3 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
          Future.
        </h1>
        <p className="text-muted-foreground text-sm">An investment simulator · Rated PG</p>
      </div>

      {/* Device notice */}
      <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl px-5 py-4 mb-6">
        <Monitor className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
        <p className="text-sm text-amber-300/90 leading-relaxed">
          <span className="font-semibold text-amber-300">Best on laptop with a mouse.</span> We're sorry — if you're on an iPad or phone this won't feel great. A mobile version is on the way.
        </p>
      </div>

      {/* Investing explainer */}
      <div className="glass-panel rounded-3xl p-7 space-y-4 text-sm text-white/75 leading-relaxed">
        <h2 className="text-base font-semibold text-white">How investing actually works</h2>

        <p>You hear the word <span className="text-white font-medium">"investing"</span> all the time, but what it really comes down to is simple — you're putting your money somewhere today so it can grow into more money later.</p>

        <p>Think of it like this: instead of letting your money just sit there doing nothing, you give it a job.</p>

        <p>When you invest, you're usually buying a small piece of something — like a company. When that company grows, makes money, and becomes more valuable, your piece becomes more valuable too. That's how your money grows.</p>

        <p>But here's the part people don't always tell you: <span className="text-white font-medium">it doesn't grow in a straight line.</span></p>

        <p>Some days your money goes up. Other days it drops. And sometimes it feels like nothing is happening at all. That's normal. Investing isn't about quick wins — it's about time.</p>

        <div className="border-l-2 border-primary/50 pl-4 text-white/90 italic">
          The real power comes from staying in the game.
        </div>

        <p>Because over time, your returns start earning their own returns. That's how small amounts turn into something meaningful — not overnight, but slowly, almost quietly. You won't notice it day to day, but years later, it adds up.</p>

        <p>You also need to understand this: <span className="text-white font-medium">risk is part of the deal.</span></p>

        <p>If you want your money to grow, you have to accept that it will sometimes go backwards. The mistake most people make is reacting emotionally — pulling out when things drop, and jumping in when things are already high.</p>

        <div className="border-l-2 border-emerald-500/50 pl-4 text-white/90 italic">
          Investing rewards patience, not panic.
        </div>

        <p>In real life, it often feels boring. You invest, you wait, you doubt it, you keep going. There's no constant excitement. Most of the time, it's just consistency.</p>

        <p>You're not trying to get rich in a moment — you're building something over time. Something steady. Something that works for you in the background while you live your life.</p>

        <p className="text-white/90">So think of investing as a <span className="text-white font-medium">long-term relationship with your money</span> — one where discipline matters more than timing, and staying consistent matters more than being perfect.</p>

        <p className="text-white font-medium">That's how it really works.</p>
      </div>

      <button
        onClick={onContinue}
        className="mt-6 w-full py-4 rounded-xl bg-white text-black font-bold text-lg hover:bg-white/90 transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-2"
      >
        I understand — let's invest <ChevronRight className="w-5 h-5" />
      </button>
    </motion.div>
  );
}

function SetupScreen() {
  const [, setLocation] = useLocation();
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
        body: JSON.stringify({ playerName: name.trim(), startingCash: parsedCash, marketMode: mode }),
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
    <motion.div
      key="setup"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
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
          Invest through 10 years of real market history — 2015 to 2025.
        </p>
        <p className="text-sm text-muted-foreground/60 mt-1">
          Brexit. COVID. Ukraine. ChatGPT. Your portfolio will feel all of it.
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
          className="w-full py-4 rounded-xl bg-white text-black font-bold text-lg hover:bg-white/90 transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
        >
          {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Start Journey <ArrowRight className="w-5 h-5" /></>}
        </button>

        {error && <p className="text-sm text-red-400 text-center">{error}</p>}
      </form>
    </motion.div>
  );
}

export function Landing() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<"intro" | "setup">("intro");

  useEffect(() => {
    if (getSessionId()) setLocation("/dashboard");
  }, [setLocation]);

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

      <AnimatePresence mode="wait">
        {step === "intro"
          ? <IntroScreen key="intro" onContinue={() => setStep("setup")} />
          : <SetupScreen key="setup" />
        }
      </AnimatePresence>
    </div>
  );
}
