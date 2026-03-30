import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { TrendingUp, AlertTriangle, ArrowLeft, ArrowRight, Cpu, DollarSign, Globe, Landmark, Dumbbell, Swords } from "lucide-react";

type YearData = {
  year: number;
  themes: { category: string; icon: React.ReactNode; color: string; events: string[] }[];
};

const YEAR_DATA: YearData[] = [
  {
    year: 2026,
    themes: [
      { category: "AI & Tech", icon: <Cpu className="w-4 h-4" />, color: "text-blue-400", events: ["AI tools quietly replace entry-level jobs", "Big tech feels even bigger", "Privacy concerns grow"] },
      { category: "Economy", icon: <DollarSign className="w-4 h-4" />, color: "text-emerald-400", events: ["Inflation slows but nothing feels cheap", "Housing still out of reach for many", "Investing becomes more normalised"] },
      { category: "Geopolitics", icon: <Swords className="w-4 h-4" />, color: "text-red-400", events: ["Military tensions rise faster than expected", "Cyberattacks disrupt banking apps", "Markets react sharply to headlines"] },
    ],
  },
  {
    year: 2027,
    themes: [
      { category: "AI & Tech", icon: <Cpu className="w-4 h-4" />, color: "text-blue-400", events: ["AI built into almost every platform", "Job competition intensifies", "Many 'safe' careers start feeling unstable"] },
      { category: "Economy", icon: <DollarSign className="w-4 h-4" />, color: "text-emerald-400", events: ["Wages rise slightly — but not dramatically", "Debt becomes a bigger concern", "More people work multiple income streams"] },
      { category: "Conflict", icon: <Swords className="w-4 h-4" />, color: "text-red-400", events: ["Sudden escalation dominates global news", "Cyberattacks hit infrastructure — not just websites", "Supply chains start breaking noticeably"] },
    ],
  },
  {
    year: 2028,
    themes: [
      { category: "AI & Tech", icon: <Cpu className="w-4 h-4" />, color: "text-blue-400", events: ["AI-generated content indistinguishable from real", "Governments regulate AI more strictly", "Jobs shift heavily toward tech-assisted roles"] },
      { category: "Economy", icon: <DollarSign className="w-4 h-4" />, color: "text-emerald-400", events: ["Economic gaps widen significantly", "Passive income becomes a common goal", "Ownership (homes, cars) declines"] },
      { category: "Conflict", icon: <Swords className="w-4 h-4" />, color: "text-red-400", events: ["Large-scale conflict breaks out rapidly", "Financial systems feel less stable", "Prices jump quickly — not gradually"] },
    ],
  },
  {
    year: 2029,
    themes: [
      { category: "AI & Tech", icon: <Cpu className="w-4 h-4" />, color: "text-blue-400", events: ["AI assistants feel like personal companions", "Many companies operate with smaller teams", "Layoffs feel more frequent but less shocking"] },
      { category: "Economy", icon: <DollarSign className="w-4 h-4" />, color: "text-emerald-400", events: ["Investing is highly accessible but emotionally challenging", "Side income becomes almost expected", "More services go subscription-based"] },
      { category: "Conflict", icon: <Swords className="w-4 h-4" />, color: "text-red-400", events: ["War spreads across multiple regions", "Cyberwar disrupts daily life regularly", "Energy becomes unreliable in some areas"] },
    ],
  },
  {
    year: 2030,
    themes: [
      { category: "AI & Tech", icon: <Cpu className="w-4 h-4" />, color: "text-blue-400", events: ["AI fully integrated into work and daily life", "Traditional jobs largely replaced by new roles", "Investing becomes almost invisible — automated"] },
      { category: "Economy", icon: <DollarSign className="w-4 h-4" />, color: "text-emerald-400", events: ["Digital currencies adopted by dozens of nations", "Economic uncertainty still exists — but people adapt", "You feel more responsible for your own future"] },
      { category: "Conflict", icon: <Swords className="w-4 h-4" />, color: "text-red-400", events: ["Conflict becomes entrenched — a constant background", "Economies shift to wartime footing", "First major ceasefire hopes emerge"] },
    ],
  },
  {
    year: 2031,
    themes: [
      { category: "AI & Tech", icon: <Cpu className="w-4 h-4" />, color: "text-blue-400", events: ["AI decision-making becomes more influential", "Work becomes more results-based than time-based", "Digital overload peaks — people seek offline experiences"] },
      { category: "Economy", icon: <DollarSign className="w-4 h-4" />, color: "text-emerald-400", events: ["War fatigue everywhere — markets stabilise slightly", "Economies stabilise in a reduced state", "Innovation driven by necessity"] },
      { category: "Recovery", icon: <Globe className="w-4 h-4" />, color: "text-amber-400", events: ["Diplomatic efforts quietly increase", "Rumours of negotiations circulate", "Small de-escalations begin"] },
    ],
  },
  {
    year: 2032,
    themes: [
      { category: "AI & Tech", icon: <Cpu className="w-4 h-4" />, color: "text-blue-400", events: ["AI reaches new capability — creativity becomes valued", "Human skills gain importance again", "Balance between digital and real life begins"] },
      { category: "Economy", icon: <DollarSign className="w-4 h-4" />, color: "text-emerald-400", events: ["Significant ceasefire negotiations begin", "Markets respond cautiously but positively", "Reconstruction investment kicks off"] },
      { category: "Recovery", icon: <Globe className="w-4 h-4" />, color: "text-amber-400", events: ["Peace treaty framework agreed", "Guarded optimism returns to markets", "Global cooperation improves in key areas"] },
    ],
  },
  {
    year: 2033,
    themes: [
      { category: "AI & Tech", icon: <Cpu className="w-4 h-4" />, color: "text-blue-400", events: ["Technology stabilises after rapid growth", "Work becomes more personalised", "Investing feels routine, not exciting"] },
      { category: "Economy", icon: <DollarSign className="w-4 h-4" />, color: "text-emerald-400", events: ["Economic recovery accelerates broadly", "Pre-war growth levels largely restored", "Financial literacy becomes widespread"] },
      { category: "Recovery", icon: <Globe className="w-4 h-4" />, color: "text-amber-400", events: ["Formal peace processes take shape", "Reconstruction becomes a national priority", "Travel begins reopening globally"] },
    ],
  },
  {
    year: 2034,
    themes: [
      { category: "AI & Tech", icon: <Cpu className="w-4 h-4" />, color: "text-blue-400", events: ["AI becomes background infrastructure", "Work-life balance improves slightly", "Technology supports rather than overwhelms"] },
      { category: "Economy", icon: <DollarSign className="w-4 h-4" />, color: "text-emerald-400", events: ["Infrastructure boom drives decade-high growth", "Spending becomes more flexible again", "Long-term economic stability established"] },
      { category: "World", icon: <Globe className="w-4 h-4" />, color: "text-amber-400", events: ["Reconstruction accelerates globally", "People prioritise stability over risk", "Economic trust at decade high"] },
    ],
  },
  {
    year: 2035,
    themes: [
      { category: "AI & Tech", icon: <Cpu className="w-4 h-4" />, color: "text-blue-400", events: ["Pace of change finally feels slower", "AI everywhere — but mostly invisible", "Markets at historic highs"] },
      { category: "Economy", icon: <DollarSign className="w-4 h-4" />, color: "text-emerald-400", events: ["Decade-end stability reached", "Investing just a normal life habit", "It was never about predicting — just staying in it"] },
      { category: "World", icon: <Globe className="w-4 h-4" />, color: "text-amber-400", events: ["War widely considered over", "Lasting global changes in power and policy", "Surviving it changed how we see everything"] },
    ],
  },
];

export function FuturePage() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-violet-950/20 via-background to-background pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => setLocation("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-white text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-violet-500/20 text-violet-400 mb-4">
            <TrendingUp className="w-7 h-7" />
          </div>
          <h1 className="text-4xl font-display font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-white">
            Future Mode
          </h1>
          <p className="text-muted-foreground">Invest through 2025–2035 based on predicted world events</p>
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
        <div className="space-y-6 mb-10">
          {YEAR_DATA.map((yearData, i) => (
            <motion.div
              key={yearData.year}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-panel rounded-2xl p-5"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl font-display font-bold text-violet-300">{yearData.year}</span>
                <div className="h-px flex-1 bg-white/5" />
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
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
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-lg transition-all hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] hover:-translate-y-1 active:translate-y-0"
          >
            Start Future Mode <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-xs text-muted-foreground/60 mt-3">Starts March 2025 · Ends March 2035</p>
        </div>
      </div>
    </div>
  );
}
