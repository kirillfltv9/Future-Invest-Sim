export type LevelConfig = {
  level: number;
  name: string;
  description: string;
  volatilityMultiplier: number;
  trendBoost: number;
  targetGainPercent: number;
  badge: string;
};

export const LEVELS: LevelConfig[] = [
  {
    level: 1,
    name: "Tutorial",
    description: "Nearly guaranteed gains. Learn how to buy, sell and watch your portfolio grow.",
    volatilityMultiplier: 0.12,
    trendBoost: 0.005,
    targetGainPercent: 10,
    badge: "🌱",
  },
  {
    level: 2,
    name: "Beginner",
    description: "Prices still trend up most days — but you'll see your first dips.",
    volatilityMultiplier: 0.22,
    trendBoost: 0.0035,
    targetGainPercent: 15,
    badge: "📈",
  },
  {
    level: 3,
    name: "Apprentice",
    description: "Market mood shifts start to matter. Pick sectors wisely.",
    volatilityMultiplier: 0.35,
    trendBoost: 0.002,
    targetGainPercent: 20,
    badge: "🔍",
  },
  {
    level: 4,
    name: "Novice",
    description: "Half the real volatility. Bad days hurt — diversification helps.",
    volatilityMultiplier: 0.50,
    trendBoost: 0.001,
    targetGainPercent: 25,
    badge: "⚖️",
  },
  {
    level: 5,
    name: "Intermediate",
    description: "More realistic swings. News events can make or break your week.",
    volatilityMultiplier: 0.65,
    trendBoost: 0.0004,
    targetGainPercent: 30,
    badge: "🎯",
  },
  {
    level: 6,
    name: "Advanced",
    description: "No artificial upward push — only skill and timing will carry you.",
    volatilityMultiplier: 0.75,
    trendBoost: 0,
    targetGainPercent: 35,
    badge: "🏛️",
  },
  {
    level: 7,
    name: "Expert",
    description: "Markets lean slightly bearish. Shorting losses requires real strategy.",
    volatilityMultiplier: 0.85,
    trendBoost: -0.0002,
    targetGainPercent: 40,
    badge: "🔥",
  },
  {
    level: 8,
    name: "Pro Trader",
    description: "High volatility, slight bear bias. Only the disciplined survive.",
    volatilityMultiplier: 0.92,
    trendBoost: -0.0003,
    targetGainPercent: 50,
    badge: "💎",
  },
  {
    level: 9,
    name: "Veteran",
    description: "Near-real conditions. Timing the market is nearly impossible now.",
    volatilityMultiplier: 0.97,
    trendBoost: -0.0004,
    targetGainPercent: 65,
    badge: "⚡",
  },
  {
    level: 10,
    name: "Real Life",
    description: "Full real-world volatility and mechanics. Welcome to the actual market.",
    volatilityMultiplier: 1.0,
    trendBoost: 0,
    targetGainPercent: 80,
    badge: "🌍",
  },
];

export function getLevelConfig(level: number): LevelConfig {
  const clamped = Math.max(1, Math.min(10, level));
  return LEVELS[clamped - 1]!;
}
