export type LevelConfig = {
  level: number;
  name: string;
  description: string;
  volatilityMultiplier: number;
  trendBoost: number;
  targetGainPercent: number;
  badge: string;
};

export const MAX_LEVEL = 1000;

type Tier = { from: number; to: number; badge: string; prefix: string; descriptions: string[] };
const TIERS: Tier[] = [
  { from: 1,   to: 10,  badge: "",    prefix: "",             descriptions: [] },
  { from: 11,  to: 50,  badge: "📊",  prefix: "Strategist",   descriptions: ["Read the trends or lose.", "Sector rotation is key.", "Volatility spikes on earnings days.", "The easy money is gone.", "Bull and bear cycles clash.", "Macro events override fundamentals.", "Breakouts are fake. Trust nothing.", "Manage risk tightly.", "Your best trade can be wiped in two bad days.", "Markets punish complacency."] },
  { from: 51,  to: 100, badge: "🦈",  prefix: "Hedge Fund",   descriptions: ["Institutional volatility reigns.", "Momentum strategies fail as often as they succeed.", "News-driven whipsaws hit both sides.", "Correlation breaks down.", "You need 30%+ just to stay ahead.", "Black Friday events lurk.", "Sentiment flips overnight.", "Think institutional or go home.", "Market makers eat retail.", "Full hedge fund pressure."] },
  { from: 101, to: 200, badge: "🧮",  prefix: "Quant",        descriptions: ["Statistical edge required.", "Factor exposures matter.", "20% drawdowns are normal here.", "Mean reversion wars with momentum.", "P&L swings like a rollercoaster.", "Volatility of volatility is real.", "Options-like price behaviour.", "Liquidity events crash prices.", "Data beats emotion.", "Only 1 in 10 quants beat the market."] },
  { from: 201, to: 300, badge: "🐺",  prefix: "Wolf",         descriptions: ["Double-digit daily swings are the norm.", "The market wants your money.", "Bear raids hit without warning.", "50% of positions will be wrong.", "Flash crash conditions apply.", "Only asymmetric bets survive.", "The market rewards the ruthless.", "Every rally is a trap.", "Wall Street Wolf level.", "Don't become prey."] },
  { from: 301, to: 400, badge: "🦢",  prefix: "Black Swan",   descriptions: ["Tail risk is your daily reality.", "Six-sigma events happen weekly.", "Markets gap down 10% overnight.", "Correlation goes to 1 in a crash.", "Circuit breakers would fire.", "Fat tails and chaos.", "Volatility is the asset now.", "The longest streak ends catastrophically.", "You've entered Black Swan territory.", "Almost no one makes it."] },
  { from: 401, to: 500, badge: "⚔️",  prefix: "Titan",        descriptions: ["You move markets with your trades.", "Liquidity is thin.", "Regime changes every few days.", "Geopolitical shocks priced before you react.", "Build a new edge fast.", "Macro dominates micro.", "Even Titans fall.", "Risk-adjusted returns only.", "Drawdown management is life or death.", "Only Titan-class discipline survives."] },
  { from: 501, to: 600, badge: "👻",  prefix: "Phantom",      descriptions: ["Ghost liquidity vanishes when needed.", "Phantom moves with no catalyst.", "Your edge is invisible to others.", "Information asymmetry is gone.", "The phantom zone: where strategies die.", "You see beautiful chaos.", "Phantom-level instinct replaces analysis.", "Survival IS the strategy.", "Unseen, unstoppable.", "You trade in the shadows."] },
  { from: 601, to: 700, badge: "🏆",  prefix: "Legend",       descriptions: ["Your name will be spoken in trading rooms.", "Three-sigma moves are Tuesday mornings.", "The market never sleeps.", "Legends don't follow rules.", "Portfolio can double or halve in a week.", "Volatility defies conventional models.", "You're trading against legends.", "One bad day erases a month.", "Legend-tier endurance.", "Only 1 in a million reaches here."] },
  { from: 701, to: 800, badge: "🌌",  prefix: "God Mode",     descriptions: ["Normal rules do not apply.", "Prices move in dimensions barely perceivable.", "Find order in chaos.", "A 50% drawdown before breakfast.", "Conviction must be unshakeable.", "Fortunes made and destroyed in minutes.", "You've transcended the market.", "The final frontier.", "One step from immortality.", "God Mode activated."] },
  { from: 801, to: 900, badge: "🌠",  prefix: "Mythical",     descriptions: ["Myth-level volatility. Legends speak of it.", "The market is a living entity fighting you.", "No model, no system, no edge survives long.", "You exist beyond conventional finance.", "100x swings in single sessions.", "The few who reach here never speak of it.", "Mythical conditions defy description.", "Your portfolio is a weapon and a liability.", "Only chaos theory applies now.", "You are the anomaly."] },
  { from: 901, to: 999, badge: "☄️",  prefix: "Cosmic",       descriptions: ["The market has collapsed into singularity.", "Price discovery no longer exists.", "You trade across dimensions of probability.", "Every trade risks total ruin.", "Cosmic-level exposure to infinite loss.", "The universe itself is your counterparty.", "Cosmic drift makes any gain miraculous.", "You exist at the edge of financial physics.", "Almost no one reading this has reached here.", "One level from the end of everything."] },
];

const LEVEL_1000: LevelConfig = {
  level: 1000,
  name: "Omniscient",
  badge: "🔮",
  volatilityMultiplier: 25.0,
  trendBoost: -0.012,
  targetGainPercent: 50000,
  description: "The final level. 50,000% gains required against infinite-volatility chaos. Mathematically near-impossible. Are you the one?",
};

const TIER1_CONFIGS: LevelConfig[] = [
  { level: 1,  name: "Tutorial",     badge: "🌱", volatilityMultiplier: 0.12, trendBoost:  0.005,  targetGainPercent: 10,  description: "Near-guaranteed gains. Learn how to buy, sell and watch your portfolio grow." },
  { level: 2,  name: "Beginner",     badge: "📈", volatilityMultiplier: 0.22, trendBoost:  0.0035, targetGainPercent: 15,  description: "Prices still trend up most days — but you'll see your first dips." },
  { level: 3,  name: "Apprentice",   badge: "🔍", volatilityMultiplier: 0.35, trendBoost:  0.002,  targetGainPercent: 20,  description: "Market mood shifts start to matter. Pick sectors wisely." },
  { level: 4,  name: "Novice",       badge: "⚖️", volatilityMultiplier: 0.50, trendBoost:  0.001,  targetGainPercent: 25,  description: "Half the real volatility. Bad days hurt — diversification helps." },
  { level: 5,  name: "Intermediate", badge: "🎯", volatilityMultiplier: 0.65, trendBoost:  0.0004, targetGainPercent: 30,  description: "More realistic swings. News events can make or break your week." },
  { level: 6,  name: "Advanced",     badge: "🏛️", volatilityMultiplier: 0.75, trendBoost:  0,      targetGainPercent: 35,  description: "No artificial upward push — only skill and timing will carry you." },
  { level: 7,  name: "Expert",       badge: "🔥", volatilityMultiplier: 0.85, trendBoost: -0.0002, targetGainPercent: 40,  description: "Markets lean slightly bearish. Real strategy required." },
  { level: 8,  name: "Pro Trader",   badge: "💎", volatilityMultiplier: 0.92, trendBoost: -0.0003, targetGainPercent: 50,  description: "High volatility, slight bear bias. Only the disciplined survive." },
  { level: 9,  name: "Veteran",      badge: "⚡", volatilityMultiplier: 0.97, trendBoost: -0.0004, targetGainPercent: 65,  description: "Near-real conditions. Timing the market is nearly impossible now." },
  { level: 10, name: "Real Life",    badge: "🌍", volatilityMultiplier: 1.0,  trendBoost:  0,      targetGainPercent: 80,  description: "Full real-world volatility and mechanics. Welcome to the actual market." },
];

function getTier(level: number): Tier | null {
  return TIERS.find(t => level >= t.from && level <= t.to) ?? null;
}

function computeVolatility(level: number): number {
  const t = (level - 1) / 999;
  return parseFloat((0.12 * Math.pow(25.0 / 0.12, t)).toFixed(4));
}

function computeTrendBoost(level: number): number {
  const t = (level - 1) / 999;
  return parseFloat((0.005 - t * 0.017).toFixed(6));
}

function computeTarget(level: number): number {
  const t = (level - 1) / 999;
  return Math.round(10 * Math.pow(5000, t));
}

function generateLevel(level: number): LevelConfig {
  if (level <= 10) return TIER1_CONFIGS[level - 1]!;
  if (level === 1000) return LEVEL_1000;

  const tier = getTier(level)!;
  const descIndex = (level - tier.from) % tier.descriptions.length;

  return {
    level,
    name: `${tier.prefix} ${level}`,
    badge: tier.badge,
    volatilityMultiplier: computeVolatility(level),
    trendBoost: computeTrendBoost(level),
    targetGainPercent: computeTarget(level),
    description: tier.descriptions[descIndex]!,
  };
}

const _cache = new Map<number, LevelConfig>();

export function getLevelConfig(level: number): LevelConfig {
  const clamped = Math.max(1, Math.min(MAX_LEVEL, level));
  if (_cache.has(clamped)) return _cache.get(clamped)!;
  const config = generateLevel(clamped);
  _cache.set(clamped, config);
  return config;
}

export function getLevelInfoForUI(level: number) {
  const c = getLevelConfig(level);
  return { badge: c.badge, name: c.name, targetGainPercent: c.targetGainPercent };
}
