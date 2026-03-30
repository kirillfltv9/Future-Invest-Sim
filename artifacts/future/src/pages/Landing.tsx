import { useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { getSessionId } from "@/lib/session";
import { TrendingUp, Monitor, Sparkles, ArrowRight } from "lucide-react";

export function Landing() {
  const [, setLocation] = useLocation();

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

      <motion.div
        key="intro"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
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
        <div className="glass-panel rounded-3xl p-7 space-y-4 text-sm text-white/75 leading-relaxed mb-6">
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

        {/* Two CTA Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setLocation("/setup")}
            className="flex flex-col items-center gap-2 py-5 px-4 rounded-2xl bg-white text-black font-bold transition-all hover:bg-white/90 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:-translate-y-1 active:translate-y-0"
          >
            <div className="flex items-center gap-2 text-lg">
              <TrendingUp className="w-5 h-5" />
              Start
            </div>
            <span className="text-xs font-normal text-black/60">Real history · 2015–2025</span>
          </button>

          <button
            onClick={() => setLocation("/future")}
            className="flex flex-col items-center gap-2 py-5 px-4 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-bold transition-all hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] hover:-translate-y-1 active:translate-y-0"
          >
            <div className="flex items-center gap-2 text-lg">
              <Sparkles className="w-5 h-5" />
              Future
            </div>
            <span className="text-xs font-normal text-white/60">Predictions · 2025–2035</span>
          </button>
        </div>

        <p className="text-center text-xs text-muted-foreground/40 mt-4">
          Already started? <button onClick={() => setLocation("/dashboard")} className="underline underline-offset-2 hover:text-white/60 transition-colors">Continue &rarr;</button>
        </p>
      </motion.div>
    </div>
  );
}
