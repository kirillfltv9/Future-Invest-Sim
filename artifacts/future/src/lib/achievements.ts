/** Hidden achievement definitions + localStorage tracking + detection logic. */

export type AchievementId =
  | "first_million"
  | "diamond_hands"
  | "buy_the_dip"
  | "diversified"
  | "comeback_kid"
  | "top_trader"
  | "first_trade"
  | "rags_to_riches";

export interface Achievement {
  id: AchievementId;
  title: string;
  description: string;
  emoji: string;
}

export const ACHIEVEMENTS: Record<AchievementId, Achievement> = {
  first_trade: {
    id: "first_trade",
    title: "Initiated",
    description: "Executed your first trade",
    emoji: "📈",
  },
  first_million: {
    id: "first_million",
    title: "First Million",
    description: "Reached a portfolio value of $1,000,000",
    emoji: "💰",
  },
  diamond_hands: {
    id: "diamond_hands",
    title: "Diamond Hands",
    description: "Held the same stock for 3+ rounds without selling",
    emoji: "💎",
  },
  buy_the_dip: {
    id: "buy_the_dip",
    title: "Buy the Dip",
    description: "Bought a stock immediately after it dropped 20%+",
    emoji: "🩸",
  },
  diversified: {
    id: "diversified",
    title: "Diversified",
    description: "Owned 5 or more different stocks at the same time",
    emoji: "🌈",
  },
  comeback_kid: {
    id: "comeback_kid",
    title: "Comeback Kid",
    description: "Jumped 3+ ranks in a single round",
    emoji: "🚀",
  },
  top_trader: {
    id: "top_trader",
    title: "Top Trader",
    description: "Finished a multiplayer game in 1st place",
    emoji: "🏆",
  },
  rags_to_riches: {
    id: "rags_to_riches",
    title: "Rags to Riches",
    description: "Doubled your starting capital",
    emoji: "✨",
  },
};

const STORE_KEY = "future_achievements_v1";

interface StoredState {
  unlocked: AchievementId[];
}

function read(): StoredState {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return { unlocked: [] };
    const parsed = JSON.parse(raw) as Partial<StoredState>;
    return { unlocked: Array.isArray(parsed.unlocked) ? parsed.unlocked : [] };
  } catch {
    return { unlocked: [] };
  }
}

function write(state: StoredState): void {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  } catch { /* ignore */ }
}

export function getUnlockedAchievements(): Set<AchievementId> {
  return new Set(read().unlocked);
}

/** Returns true if this is a fresh unlock (was not previously achieved). */
export function unlockAchievement(id: AchievementId): boolean {
  const state = read();
  if (state.unlocked.includes(id)) return false;
  state.unlocked.push(id);
  write(state);
  return true;
}

export function clearAchievements(): void {
  write({ unlocked: [] });
}
