import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Cpu, DollarSign, Globe, Landmark, Dumbbell, Swords, ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

type Phase = { label: string; vibe: string; points: string[]; result: string[] };
type Category = { id: string; title: string; icon: React.ReactNode; color: string; bg: string; phases: Phase[] };

const CATEGORIES: Category[] = [
  {
    id: "ai",
    title: "AI & Technology",
    icon: <Cpu className="w-6 h-6" />,
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/30",
    phases: [
      {
        label: "2025",
        vibe: "Explosive AI boom",
        points: ["Massive investment into AI startups", "AI integrated into productivity, coding, content creation", "GPU demand explodes — infrastructure boom", "OpenAI, Google, Microsoft, NVIDIA lead the charge"],
        result: ["📈 AI stocks surge", "🚀 \"AI will change everything\" sentiment", "⚠️ Early signs of overvaluation"],
      },
      {
        label: "Late 2025",
        vibe: "AI hype reaches peak",
        points: ["Every company claims to be \"AI-powered\"", "Venture capital floods into AI", "Talent wars for engineers intensify", "Model hallucinations and data privacy concerns grow"],
        result: ["🫧 AI bubble risk increases", "📊 Expectations become unrealistic"],
      },
      {
        label: "Early 2026",
        vibe: "Reality check",
        points: ["Some AI companies fail to deliver real profits", "Overhyped startups collapse", "Businesses realise AI is powerful — but not magic", "Microsoft slows expansion; Google focuses on efficiency"],
        result: ["📉 AI stock correction", "💡 Shift from hype to real use cases"],
      },
      {
        label: "Mid 2026",
        vibe: "Regulation era begins",
        points: ["AI safety concerns increase", "Deepfakes and misinformation issues mount", "Job displacement fears rise", "Governments introduce new AI regulations globally"],
        result: ["⚖️ Slower innovation — but more stable", "🏢 Big companies benefit; startups struggle"],
      },
      {
        label: "Late 2026",
        vibe: "Mature AI phase",
        points: ["AI becomes a normal part of business infrastructure", "Less hype, more utility", "Market dominated by Microsoft and Google", "NVIDIA remains critical for hardware"],
        result: ["📊 Stable long-term growth", "🧊 Lower hype, higher reliability"],
      },
    ],
  },
  {
    id: "economy",
    title: "Economy",
    icon: <DollarSign className="w-6 h-6" />,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/30",
    phases: [
      {
        label: "2025",
        vibe: "Strong but overheated",
        points: ["High consumer spending", "AI-driven investment boom", "Strong job markets in major economies", "Inflation not fully under control — interest rates still high"],
        result: ["📈 Growth continues", "⚠️ Economy becomes fragile underneath"],
      },
      {
        label: "Late 2025",
        vibe: "Cracks start showing",
        points: ["Consumers start spending less", "Borrowing becomes expensive", "Companies slow hiring", "Stock volatility increases; housing markets cool"],
        result: ["🐢 Growth slows", "📊 Confidence weakens"],
      },
      {
        label: "Early 2026",
        vibe: "Shock phase",
        points: ["Energy price spike — oil shock hits", "Supply chain disruptions return", "IMF warns about slowing growth", "Inflation rises again — central banks pause rate cuts"],
        result: ["⚠️ Risk of stagflation (low growth + high inflation)"],
      },
      {
        label: "Mid 2026",
        vibe: "Stagflation pressure",
        points: ["Slow or near-zero growth", "Persistent inflation", "High interest rates remain", "Consumers struggle; businesses cut costs"],
        result: ["😬 Economic discomfort phase", "Markets become unstable"],
      },
      {
        label: "Late 2026",
        vibe: "Stabilisation attempt",
        points: ["Inflation starts easing slowly", "Supply chains stabilise", "Governments introduce support measures", "Fed considers rate cuts; ECB shifts toward growth support"],
        result: ["📊 Slow recovery begins", "🧊 Economy stabilises but remains weak"],
      },
    ],
  },
  {
    id: "markets",
    title: "Global Markets",
    icon: <Globe className="w-6 h-6" />,
    color: "text-violet-400",
    bg: "bg-violet-500/10 border-violet-500/30",
    phases: [
      {
        label: "2025",
        vibe: "Late-cycle boom — cracks forming",
        points: ["Massive AI stock boom / bubble forming", "Rising trade tensions and tariffs", "Interest rates still high from inflation fight", "Supply chains still fragile"],
        result: ["⚠️ Market becomes fragile and overvalued", "Perfect setup for volatility"],
      },
      {
        label: "Late 2025",
        vibe: "Crisis signals",
        points: ["Stock market starts falling", "Inflation still hurting consumers", "Political and economic instability rising", "Emerging market currency crises"],
        result: ["Investors lose confidence", "Volatility increases", "Global risk level rises"],
      },
      {
        label: "Early 2026",
        vibe: "Shock phase",
        points: ["Major conflict in Middle East", "Oil prices spike above $110/barrel", "Inflation rises again globally", "Central banks pause or consider raising rates again"],
        result: ["Markets become uncertain and reactive", "Fear of stagflation"],
      },
      {
        label: "Mid 2026",
        vibe: "Stagflation risk era",
        points: ["Growth slowing globally", "Inflation higher than expected", "Interest rates stay high or rise again", "High geopolitical risk"],
        result: ["Markets stuck — rates too high AND growth too weak"],
      },
      {
        label: "Late 2026",
        vibe: "Uncertain outlook",
        points: ["G20 inflation around 4% — higher than expected", "Central banks cautious — not cutting rates", "Growth downgraded across forecasts"],
        result: ["📊 Volatile and reactive market environment", "No clear recovery signal yet"],
      },
    ],
  },
  {
    id: "politics",
    title: "Politics",
    icon: <Landmark className="w-6 h-6" />,
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/30",
    phases: [
      {
        label: "2025",
        vibe: "Election pressure + rivalry rising",
        points: ["US policy shaped by Trump-era influence", "Xi Jinping pushing long-term global influence", "Putin continuing assertive foreign policy", "EU facing internal divisions"],
        result: ["🌐 Global cooperation weakens", "⚠️ Tensions quietly increase"],
      },
      {
        label: "Late 2025",
        vibe: "Political fragmentation",
        points: ["Rise of nationalist policies in multiple countries", "Increased protests and political unrest globally", "Harder negotiations between major powers", "Diplomatic trust declines"],
        result: ["🤝 Global decisions slow down", "Alliances become less stable"],
      },
      {
        label: "Early 2026",
        vibe: "Conflict-driven politics",
        points: ["Escalation involving Iran and global powers", "Major powers take sides strategically", "Military tensions increase", "Energy becomes a political weapon"],
        result: ["🚨 Crisis-style global politics", "Governments shift from economic → security focus"],
      },
      {
        label: "Mid 2026",
        vibe: "Power blocs form",
        points: ["Western alliance consolidates (US + EU)", "Eastern/alternative bloc strengthens (China, Russia)", "India and others balance between sides", "Countries forced to choose camps"],
        result: ["🌍 Multipolar world — no single dominant power", "⚖️ Strategic competition intensifies"],
      },
      {
        label: "Late 2026",
        vibe: "Controlled tension",
        points: ["No full global war — but constant risk", "Diplomacy resumes in limited form", "Leaders avoid escalation but prepare for it", "Strategic competition replaces open conflict"],
        result: ["🧊 'Cold conflict' environment", "📊 Long-term uncertainty remains"],
      },
    ],
  },
  {
    id: "sports",
    title: "Sports",
    icon: <Dumbbell className="w-6 h-6" />,
    color: "text-pink-400",
    bg: "bg-pink-500/10 border-pink-500/30",
    phases: [
      {
        label: "2025",
        vibe: "Peak global sports hype",
        points: ["NFL, Premier League, NBA all booming", "Messi, LeBron, Ronaldo at peak influence", "Streaming deals explode", "Global fanbases expand rapidly"],
        result: ["📈 Sports industry revenue hits highs", "🔥 Fan engagement peaks"],
      },
      {
        label: "Late 2025",
        vibe: "Saturation and pressure",
        points: ["Oversaturation of sports media content", "Ticket prices rise sharply", "Player wages hit extreme levels", "Smaller clubs struggle financially"],
        result: ["⚖️ Growth slows", "💸 Financial imbalance increases"],
      },
      {
        label: "Early 2026",
        vibe: "Disruptions and controversy",
        points: ["Injuries to major stars", "Controversies around refereeing and governance", "Financial disputes in major leagues", "Viewership dips slightly"],
        result: ["📉 Public trust shaken"],
      },
      {
        label: "Mid 2026",
        vibe: "Transformation phase",
        points: ["Direct-to-fan streaming platforms grow", "AI analytics in performance and coaching", "Expansion into Asia and Middle East markets", "FIFA expanding tournaments; IOC modernising"],
        result: ["🔄 Industry evolves", "📊 New revenue models emerge"],
      },
      {
        label: "Late 2026",
        vibe: "Stabilised but different",
        points: ["More sustainable financial models", "Slightly reduced hype — but stronger structure", "Continued global expansion"],
        result: ["📊 Stable long-term growth", "🌍 Sports remain a major global industry"],
      },
    ],
  },
  {
    id: "conflict",
    title: "Conflict & War",
    icon: <Swords className="w-6 h-6" />,
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/30",
    phases: [
      {
        label: "2025",
        vibe: "Ongoing conflicts — contained",
        points: ["Ukraine–Russia war continues", "Middle East tensions remain unstable", "China–Taiwan tensions increase", "Military spending increases worldwide"],
        result: ["🌍 Global tension slowly rises", "⚠️ Risk of escalation builds"],
      },
      {
        label: "Late 2025",
        vibe: "Proxy conflicts expand",
        points: ["Countries avoid direct war — but fund allies", "Cyberattacks between major powers escalate", "Smaller regional conflicts intensify", "Military drills become more aggressive"],
        result: ["🕸️ 'Proxy war network' forms", "🔥 More regions become unstable"],
      },
      {
        label: "Early 2026",
        vibe: "Major escalation risk",
        points: ["Middle East escalation involving Iran", "Attacks threaten oil supply routes", "Global powers get involved indirectly", "Military presence increases rapidly"],
        result: ["🛢️ Energy crisis risk", "⚠️ Global conflict fears spike"],
      },
      {
        label: "Mid 2026",
        vibe: "World on edge",
        points: ["Multiple active conflict zones: Europe, Middle East, Asia-Pacific", "Military alliances strengthen", "Defense spending surges globally", "Constant threat of escalation"],
        result: ["🚨 'Pre-global conflict' atmosphere", "🌍 Markets and politics heavily affected"],
      },
      {
        label: "Late 2026",
        vibe: "Cold War 2.0",
        points: ["No full-scale war — major powers avoid direct conflict", "Diplomacy resumes partially", "Constant military readiness becomes the norm", "Long-term instability settles in"],
        result: ["❄️ Frozen conflicts and ongoing risks", "📊 War becomes a permanent factor in global systems"],
      },
    ],
  },
];

const PHASE_LABELS = ["2025", "Late 2025", "Early 2026", "Mid 2026", "Late 2026"];

export function PresentPage() {
  const [, setLocation] = useLocation();
  const [activePhase, setActivePhase] = useState(0);

  const prev = () => setActivePhase((p) => Math.max(0, p - 1));
  const next = () => setActivePhase((p) => Math.min(PHASE_LABELS.length - 1, p + 1));

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-white/5 via-background to-background pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => setLocation("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-white text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="text-center">
            <h1 className="text-2xl font-display font-bold text-white">2025 → 2026 Outlook</h1>
            <p className="text-xs text-muted-foreground mt-0.5">What the world looks like right now and where it's heading</p>
          </div>
          <button
            onClick={() => setLocation("/setup?era=present")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:-translate-y-0.5"
          >
            <TrendingUp className="w-4 h-4" />
            Invest Now
          </button>
        </div>

        {/* Phase selector */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <button onClick={prev} disabled={activePhase === 0} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 transition-all">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex gap-2">
            {PHASE_LABELS.map((label, i) => (
              <button
                key={label}
                onClick={() => setActivePhase(i)}
                className={cn(
                  "px-4 py-2 rounded-lg text-xs font-semibold transition-all",
                  i === activePhase
                    ? "bg-white text-black"
                    : "bg-white/5 text-muted-foreground hover:bg-white/10"
                )}
              >
                {label}
              </button>
            ))}
          </div>
          <button onClick={next} disabled={activePhase === PHASE_LABELS.length - 1} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 transition-all">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Phase title */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activePhase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <div className="text-center mb-6">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">Current window</span>
              <h2 className="text-3xl font-display font-bold text-white mt-1">{PHASE_LABELS[activePhase]}</h2>
            </div>

            {/* Cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {CATEGORIES.map((cat) => {
                const phase = cat.phases[activePhase]!;
                return (
                  <div key={cat.id} className={cn("glass-panel rounded-2xl p-5 border", cat.bg)}>
                    <div className={cn("flex items-center gap-2 mb-3", cat.color)}>
                      {cat.icon}
                      <span className="text-sm font-bold">{cat.title}</span>
                    </div>
                    <p className="text-xs font-semibold text-white/80 mb-3 italic">"{phase.vibe}"</p>
                    <ul className="space-y-1.5 mb-4">
                      {phase.points.map((pt, i) => (
                        <li key={i} className="text-xs text-white/55 leading-snug pl-2 border-l border-white/10">
                          {pt}
                        </li>
                      ))}
                    </ul>
                    <div className="border-t border-white/5 pt-3 space-y-1">
                      {phase.result.map((r, i) => (
                        <p key={i} className="text-xs text-white/70 font-medium">{r}</p>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mt-8">
          {PHASE_LABELS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActivePhase(i)}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                i === activePhase ? "bg-white w-6" : "bg-white/20 hover:bg-white/40"
              )}
            />
          ))}
        </div>

        {/* Nav arrows at bottom */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={prev}
            disabled={activePhase === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 transition-all text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Previous
          </button>
          <span className="text-xs text-muted-foreground">{activePhase + 1} / {PHASE_LABELS.length}</span>
          <button
            onClick={next}
            disabled={activePhase === PHASE_LABELS.length - 1}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 transition-all text-sm"
          >
            Next <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Start Investing CTA */}
        <div className="mt-10 glass-panel rounded-3xl p-8 text-center border border-emerald-500/20 bg-emerald-500/5">
          <h3 className="text-xl font-bold text-white mb-2">Ready to invest through it?</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
            Now that you know what's coming — AI bubbles, oil shocks, stagflation — can your portfolio survive 2 years of the near future?
          </p>
          <button
            onClick={() => setLocation("/setup?era=present")}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-lg transition-all hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:-translate-y-1 active:translate-y-0"
          >
            <TrendingUp className="w-5 h-5" />
            Start Present Mode
            <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-xs text-muted-foreground/50 mt-4">2025 → 2026 · 644 days · Based on real predictions</p>
        </div>
      </div>
    </div>
  );
}
