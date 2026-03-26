export type LevelConfig = {
  level: number;
  name: string;
  description: string;
  volatilityMultiplier: number;
  trendBoost: number;
  targetGainPercent: number;
  badge: string;
};

// Tier definitions
const TIER_1: LevelConfig[] = [
  { level: 1,  name: "Tutorial",       badge: "🌱", volatilityMultiplier: 0.12, trendBoost:  0.005,  targetGainPercent: 10,  description: "Near-guaranteed gains. Learn how to buy, sell and watch your portfolio grow." },
  { level: 2,  name: "Beginner",       badge: "📈", volatilityMultiplier: 0.22, trendBoost:  0.0035, targetGainPercent: 15,  description: "Prices still trend up most days — but you'll see your first dips." },
  { level: 3,  name: "Apprentice",     badge: "🔍", volatilityMultiplier: 0.35, trendBoost:  0.002,  targetGainPercent: 20,  description: "Market mood shifts start to matter. Pick sectors wisely." },
  { level: 4,  name: "Novice",         badge: "⚖️", volatilityMultiplier: 0.50, trendBoost:  0.001,  targetGainPercent: 25,  description: "Half the real volatility. Bad days hurt — diversification helps." },
  { level: 5,  name: "Intermediate",   badge: "🎯", volatilityMultiplier: 0.65, trendBoost:  0.0004, targetGainPercent: 30,  description: "More realistic swings. News events can make or break your week." },
  { level: 6,  name: "Advanced",       badge: "🏛️", volatilityMultiplier: 0.75, trendBoost:  0,      targetGainPercent: 35,  description: "No artificial upward push — only skill and timing will carry you." },
  { level: 7,  name: "Expert",         badge: "🔥", volatilityMultiplier: 0.85, trendBoost: -0.0002, targetGainPercent: 40,  description: "Markets lean slightly bearish. Real strategy required." },
  { level: 8,  name: "Pro Trader",     badge: "💎", volatilityMultiplier: 0.92, trendBoost: -0.0003, targetGainPercent: 50,  description: "High volatility, slight bear bias. Only the disciplined survive." },
  { level: 9,  name: "Veteran",        badge: "⚡", volatilityMultiplier: 0.97, trendBoost: -0.0004, targetGainPercent: 65,  description: "Near-real conditions. Timing the market is nearly impossible now." },
  { level: 10, name: "Real Life",      badge: "🌍", volatilityMultiplier: 1.0,  trendBoost:  0,      targetGainPercent: 80,  description: "Full real-world volatility and mechanics. Welcome to the actual market." },
];

type TierSpec = { levelStart: number; levelEnd: number; namePrefix: string; badge: string; descriptions: string[]; volStart: number; volEnd: number; trendStart: number; trendEnd: number; targetStart: number; targetEnd: number };

const TIER_SPECS: TierSpec[] = [
  {
    levelStart: 11, levelEnd: 20, namePrefix: "Strategist", badge: "📊",
    descriptions: [
      "Markets shift without warning — read the trends or lose.",
      "Sector rotation is key. Wrong bets wipe gains fast.",
      "Volatility spikes on earnings days. Prepare for surprises.",
      "The easy money is gone. Discipline is your only edge.",
      "Bull and bear cycles clash. Stay nimble.",
      "Macro events override fundamentals. Watch the news closely.",
      "Breakouts are fake. Pullbacks are real. Trust nothing.",
      "Leverage-like exposure from volatility. Manage risk tightly.",
      "Your best trade can be wiped in two bad days.",
      "Every gain must be defended. Markets punish complacency.",
    ],
    volStart: 1.05, volEnd: 1.30, trendStart: -0.0003, trendEnd: -0.0006, targetStart: 90, targetEnd: 120,
  },
  {
    levelStart: 21, levelEnd: 30, namePrefix: "Hedge Fund", badge: "🦈",
    descriptions: [
      "Institutional volatility. Your portfolio swings by thousands a day.",
      "Momentum strategies fail as often as they succeed.",
      "News-driven whipsaws hit you from both sides.",
      "Correlation breaks down. Diversification loses its shield.",
      "You need 30%+ just to stay ahead of drawdowns.",
      "Black Friday events lurk. Hedge or pay the price.",
      "Sentiment flips overnight. Yesterday's winner is today's loser.",
      "You're playing against algos now. Speed and patience win.",
      "Market makers eat retail. Think institutional or go home.",
      "Welcome to the real hedge fund pressure cooker.",
    ],
    volStart: 1.32, volEnd: 1.60, trendStart: -0.0006, trendEnd: -0.001, targetStart: 130, targetEnd: 160,
  },
  {
    levelStart: 31, levelEnd: 40, namePrefix: "Quant", badge: "🧮",
    descriptions: [
      "Statistical edge required. Gut feel gets you wrecked.",
      "Factor exposures matter. Understand what you own.",
      "Drawdowns of 20% are normal here. Hold or fold?",
      "Mean reversion wars with momentum daily.",
      "Your P&L swings like a rollercoaster. Can you handle it?",
      "Volatility of volatility is real. Double uncertainty.",
      "Options-like price behaviour. Gaps and spikes everywhere.",
      "Liquidity events crash prices instantly. Exits are expensive.",
      "You're in quant territory — data beats emotion every time.",
      "Survive the storm. Only 1 in 10 quants beat the market.",
    ],
    volStart: 1.62, volEnd: 1.90, trendStart: -0.001, trendEnd: -0.0015, targetStart: 175, targetEnd: 210,
  },
  {
    levelStart: 41, levelEnd: 50, namePrefix: "Wolf", badge: "🐺",
    descriptions: [
      "Double-digit daily swings are the norm now.",
      "The market wants to take your money. Fight back.",
      "Bear raids hit without warning. Conviction required.",
      "50% of your positions will be wrong. Pick the right half.",
      "Flash crash conditions. Prices vanish in seconds.",
      "Only asymmetric bets survive here. Think big or go home.",
      "The market rewards the ruthless. No mercy for weak hands.",
      "Every rally is a trap. Every dip is a test.",
      "Wall Street Wolf level — you belong on the floor.",
      "You're running with the wolves now. Don't become prey.",
    ],
    volStart: 1.92, volEnd: 2.20, trendStart: -0.0015, trendEnd: -0.002, targetStart: 225, targetEnd: 275,
  },
  {
    levelStart: 51, levelEnd: 60, namePrefix: "Black Swan", badge: "🦢",
    descriptions: [
      "Tail risk is your daily reality. Expect the unexpected.",
      "Six-sigma events happen weekly here. Brace yourself.",
      "Markets gap down 10% overnight. Your stops don't save you.",
      "Correlation goes to 1 in a crash. Everything falls together.",
      "Circuit breakers would fire in real life. You have none.",
      "Fat tails, kurtosis, chaos. Welcome to the extremes.",
      "Black swan conditions — survive and you're elite.",
      "Volatility is the asset now. Price is just noise.",
      "The longest winning streak ends in one catastrophic day.",
      "You've entered Black Swan territory. Almost no one makes it.",
    ],
    volStart: 2.22, volEnd: 2.50, trendStart: -0.002, trendEnd: -0.0025, targetStart: 290, targetEnd: 340,
  },
  {
    levelStart: 61, levelEnd: 70, namePrefix: "Titan", badge: "⚔️",
    descriptions: [
      "Market Titan conditions. You move markets with your trades.",
      "Liquidity is thin. Your orders create slippage.",
      "Regime changes every few days. Adapt or collapse.",
      "Geopolitical shocks are priced in before you react.",
      "The edge you had is gone. Build a new one fast.",
      "Macro dominates micro. Company fundamentals are irrelevant.",
      "You're a Titan — but even Titans fall.",
      "Risk-adjusted returns are the only metric that matters.",
      "Drawdown management is life or death at this level.",
      "Only Titan-class discipline survives these conditions.",
    ],
    volStart: 2.52, volEnd: 2.75, trendStart: -0.0025, trendEnd: -0.003, targetStart: 360, targetEnd: 420,
  },
  {
    levelStart: 71, levelEnd: 80, namePrefix: "Phantom", badge: "👻",
    descriptions: [
      "You trade in the shadows. The market doesn't know you're there.",
      "Ghost liquidity vanishes when you need it most.",
      "Phantom moves — prices jump with no apparent catalyst.",
      "Your edge is invisible to others. Guard it with your life.",
      "Information asymmetry is gone. Everyone knows everything.",
      "The phantom zone: where strategies go to die.",
      "You see the market for what it is — beautiful chaos.",
      "Phantom-level instinct replaces all analysis.",
      "At this level, survival IS the strategy.",
      "Only phantoms reach level 80. You are unseen, unstoppable.",
    ],
    volStart: 2.77, volEnd: 3.00, trendStart: -0.003, trendEnd: -0.0035, targetStart: 440, targetEnd: 500,
  },
  {
    levelStart: 81, levelEnd: 90, namePrefix: "Legend", badge: "🏆",
    descriptions: [
      "Legend status. Your name will be spoken in trading rooms.",
      "Three-sigma daily moves are Tuesday mornings now.",
      "The market is your opponent and it never sleeps.",
      "Legends don't follow rules. They make them.",
      "Your portfolio can double or halve in a week. Stay sharp.",
      "Volatility at this level defies conventional models.",
      "You're trading against legends. They're as good as you.",
      "A single bad day erases a month of gains. Control losses.",
      "Legend-tier endurance: mental and financial.",
      "Only 1 in a million reaches Level 90. You're nearly there.",
    ],
    volStart: 3.02, volEnd: 3.35, trendStart: -0.0035, trendEnd: -0.004, targetStart: 525, targetEnd: 600,
  },
  {
    levelStart: 91, levelEnd: 99, namePrefix: "God Mode", badge: "🌌",
    descriptions: [
      "God Mode unlocked. Normal rules do not apply.",
      "Prices move in dimensions you can barely perceive.",
      "The market is pure entropy here. Find order in chaos.",
      "A 50% drawdown before breakfast. Still standing?",
      "Your conviction must be unshakeable. Or you're done.",
      "God Mode: where fortunes are made and destroyed in minutes.",
      "You've transcended the market. Now master it.",
      "The final frontier before the ultimate challenge.",
      "Level 99 — one step from immortality.",
    ],
    volStart: 3.38, volEnd: 3.75, trendStart: -0.004, trendEnd: -0.005, targetStart: 625, targetEnd: 750,
  },
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function generateTierLevels(spec: TierSpec): LevelConfig[] {
  const count = spec.levelEnd - spec.levelStart + 1;
  return Array.from({ length: count }, (_, i) => {
    const t = count === 1 ? 0 : i / (count - 1);
    return {
      level: spec.levelStart + i,
      name: `${spec.namePrefix} ${spec.levelStart + i}`,
      badge: spec.badge,
      volatilityMultiplier: parseFloat(lerp(spec.volStart, spec.volEnd, t).toFixed(3)),
      trendBoost: parseFloat(lerp(spec.trendStart, spec.trendEnd, t).toFixed(5)),
      targetGainPercent: Math.round(lerp(spec.targetStart, spec.targetEnd, t)),
      description: spec.descriptions[i % spec.descriptions.length]!,
    };
  });
}

const LEVEL_100: LevelConfig = {
  level: 100,
  name: "Immortal",
  badge: "☄️",
  volatilityMultiplier: 4.0,
  trendBoost: -0.005,
  targetGainPercent: 800,
  description: "The final level. 800% gains required against apocalyptic volatility. No one has done this. Will you?",
};

export const LEVELS: LevelConfig[] = [
  ...TIER_1,
  ...TIER_SPECS.flatMap(generateTierLevels),
  LEVEL_100,
];

export const MAX_LEVEL = 100;

export function getLevelConfig(level: number): LevelConfig {
  const clamped = Math.max(1, Math.min(MAX_LEVEL, level));
  return LEVELS[clamped - 1]!;
}
