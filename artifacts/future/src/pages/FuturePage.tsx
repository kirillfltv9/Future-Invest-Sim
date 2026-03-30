import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { TrendingUp, AlertTriangle, ArrowLeft, ArrowRight, Cpu, DollarSign, Globe, Swords, Flame, HeartHandshake } from "lucide-react";

type YearData = {
  year: number;
  tag?: { label: string; color: string };
  themes: { category: string; icon: React.ReactNode; color: string; events: string[] }[];
};

const YEAR_DATA: YearData[] = [
  {
    year: 2026,
    tag: { label: "⚡ Turbulence Begins", color: "bg-red-900/60 text-red-300 border border-red-700/60" },
    themes: [
      { category: "Conflict", icon: <Swords className="w-4 h-4" />, color: "text-red-400", events: ["Major powers mobilise — international institutions under strain", "Nuclear standoff triggers global circuit breakers", "Cyberattacks cripple banking systems across major nations", "Energy infrastructure attacked — oil spikes 80%"] },
      { category: "Economy", icon: <DollarSign className="w-4 h-4" />, color: "text-emerald-400", events: ["Capital controls across 12 major markets", "Emergency G20 crisis summit called", "Trading halted across multiple exchanges"] },
      { category: "AI & Tech", icon: <Cpu className="w-4 h-4" />, color: "text-blue-400", events: ["AI begins replacing entry-level jobs globally", "Tech sector dwarfed by geopolitical chaos"] },
    ],
  },
  {
    year: 2027,
    tag: { label: "🔥 Turbulence Escalates", color: "bg-red-900/60 text-red-300 border border-red-700/60" },
    themes: [
      { category: "Conflict", icon: <Swords className="w-4 h-4" />, color: "text-red-400", events: ["Conflict spreads to Asia-Pacific", "Shipping lanes closed — global trade collapses", "Drone strikes devastate industrial zones", "Global cyberwar — ATMs emptied worldwide"] },
      { category: "Economy", icon: <DollarSign className="w-4 h-4" />, color: "text-emerald-400", events: ["Manufacturing output falls 35%", "Food supply chains severed — rationing begins in 40+ countries", "Payment networks down for days"] },
    ],
  },
  {
    year: 2028,
    tag: { label: "💀 Peak Turbulence", color: "bg-red-950/80 text-red-200 border border-red-800/60" },
    themes: [
      { category: "Conflict", icon: <Flame className="w-4 h-4" />, color: "text-red-400", events: ["Most destructive year of the crisis", "Economies fully in emergency footing", "Civilian infrastructure collapses in multiple regions", "Refugee crisis reaches 200 million"] },
      { category: "Economy", icon: <DollarSign className="w-4 h-4" />, color: "text-emerald-400", events: ["Emergency currencies issued — hyperinflation hits 8 nations", "Secret peace backchannel confirmed", "Brief market rally on hope"] },
    ],
  },
  {
    year: 2029,
    tag: { label: "🕊️ Turbulence Winding Down", color: "bg-amber-900/50 text-amber-300 border border-amber-700/60" },
    themes: [
      { category: "Conflict", icon: <Swords className="w-4 h-4" />, color: "text-amber-400", events: ["Final major escalation — heaviest disruption of the crisis", "Armistice framework proposed", "Three-month ceasefire begins", "Ceasefire holds — observers deployed"] },
      { category: "Economy", icon: <DollarSign className="w-4 h-4" />, color: "text-emerald-400", events: ["First concrete steps toward stability", "Markets rally strongly on ceasefire news", "Preliminary peace terms agreed"] },
    ],
  },
  {
    year: 2030,
    tag: { label: "✅ Stability Restored", color: "bg-emerald-900/50 text-emerald-300 border border-emerald-700/60" },
    themes: [
      { category: "Peace", icon: <HeartHandshake className="w-4 h-4" />, color: "text-emerald-400", events: ["Peace treaty signed in Geneva — decade's greatest relief rally", "$20 trillion global reconstruction fund announced", "Crisis formally declared over"] },
      { category: "Economy", icon: <DollarSign className="w-4 h-4" />, color: "text-emerald-400", events: ["Crisis-era digital currencies become permanent standard", "40+ nations adopt unified digital finance framework", "Reconstruction spending begins globally"] },
    ],
  },
  {
    year: 2031,
    tag: { label: "🔨 Rebuilding", color: "bg-blue-900/40 text-blue-300 border border-blue-700/50" },
    themes: [
      { category: "Recovery", icon: <Globe className="w-4 h-4" />, color: "text-blue-400", events: ["Post-crisis infrastructure boom begins", "Record peacetime reconstruction spending", "AI-assisted rebuilding accelerates recovery"] },
      { category: "Economy", icon: <DollarSign className="w-4 h-4" />, color: "text-emerald-400", events: ["AI unemployment peaks — $5 trillion retraining programme launched", "Productivity surges across recovering regions"] },
    ],
  },
  {
    year: 2032,
    tag: { label: "📈 Recovery", color: "bg-blue-900/40 text-blue-300 border border-blue-700/50" },
    themes: [
      { category: "Economy", icon: <DollarSign className="w-4 h-4" />, color: "text-emerald-400", events: ["Pre-crisis output fully restored — fastest recovery in modern history", "New global trade agreements signed", "Markets surge on stability"] },
      { category: "AI & Tech", icon: <Cpu className="w-4 h-4" />, color: "text-blue-400", events: ["AI takes centre stage as peacetime tool", "Creativity and human skills gain value again"] },
    ],
  },
  {
    year: 2033,
    tag: { label: "🌱 Growth", color: "bg-violet-900/40 text-violet-300 border border-violet-700/50" },
    themes: [
      { category: "Economy", icon: <DollarSign className="w-4 h-4" />, color: "text-emerald-400", events: ["Post-crisis growth era begins", "Corporate earnings at decade highs across all sectors"] },
      { category: "AI & Tech", icon: <Cpu className="w-4 h-4" />, color: "text-blue-400", events: ["AI stabilises global productivity", "Record earnings across all sectors"] },
    ],
  },
  {
    year: 2034,
    tag: { label: "🌱 Growth", color: "bg-violet-900/40 text-violet-300 border border-violet-700/50" },
    themes: [
      { category: "Economy", icon: <DollarSign className="w-4 h-4" />, color: "text-emerald-400", events: ["Infrastructure boom drives decade-high growth", "Construction and tech sectors surge", "Financial systems reach new stability peak"] },
      { category: "World", icon: <Globe className="w-4 h-4" />, color: "text-blue-400", events: ["Long-term confidence fully restored", "People avoid extreme risks", "Life feels deliberately more stable"] },
    ],
  },
  {
    year: 2035,
    tag: { label: "✨ Stability", color: "bg-white/10 text-white/80 border border-white/20" },
    themes: [
      { category: "Economy", icon: <DollarSign className="w-4 h-4" />, color: "text-emerald-400", events: ["Markets at all-time highs — those who stayed in won", "Investing is just a normal life habit", "It was never about predicting — just staying in it"] },
      { category: "AI & Tech", icon: <Cpu className="w-4 h-4" />, color: "text-blue-400", events: ["AI-human collaboration reaches full maturity", "New era of human productivity begins"] },
    ],
  },
];

export function FuturePage() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-red-950/20 via-background to-background pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-10">

        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => setLocation("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-white text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-red-500/20 text-red-400 mb-4">
            <TrendingUp className="w-7 h-7" />
          </div>
          <h1 className="text-4xl font-display font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-red-300 via-white to-violet-300">
            Future Mode
          </h1>
          <p className="text-muted-foreground">Invest through 2025–2035 · Global turbulence 2026–2030 · Recovery from 2030</p>
        </div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl px-5 py-4 mb-8"
        >
          <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-300 mb-1">This is not 100% true</p>
            <p className="text-sm text-amber-300/80 leading-relaxed">
              These are predictions and possibilities — not facts. The future is uncertain. The market shocks in this mode are inspired by these scenarios but the real world may unfold very differently. Play it as a thought experiment, not a forecast.
            </p>
          </div>
        </motion.div>

        {/* Timeline */}
        <div className="space-y-5 mb-10">
          {YEAR_DATA.map((yearData, i) => (
            <motion.div
              key={yearData.year}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-panel rounded-2xl p-5"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl font-display font-bold text-white">{yearData.year}</span>
                {yearData.tag && (
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${yearData.tag.color}`}>
                    {yearData.tag.label}
                  </span>
                )}
                <div className="h-px flex-1 bg-white/5" />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {yearData.themes.map((theme) => (
                  <div key={theme.category} className="space-y-1.5">
                    <div className={`flex items-center gap-1.5 text-xs font-semibold ${theme.color}`}>
                      {theme.icon}
                      {theme.category}
                    </div>
                    <ul className="space-y-1">
                      {theme.events.map((event, j) => (
                        <li key={j} className="text-xs text-white/55 leading-snug pl-2 border-l border-white/10">
                          {event}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={() => setLocation("/setup?era=future")}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-red-700 hover:bg-red-600 text-white font-bold text-lg transition-all hover:shadow-[0_0_30px_rgba(220,38,38,0.4)] hover:-translate-y-1 active:translate-y-0"
          >
            Start Future Mode <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-xs text-muted-foreground/60 mt-3">Starts March 2025 · Turbulence 2026–2030 · Stability from 2030</p>
        </div>
      </div>
    </div>
  );
}
