// Shared avatar types, item catalogs, defaults, and storage helpers.

export type SkinId       = "light" | "tan" | "brown" | "deep" | "gold";
export type HairId       = "bald"  | "short" | "long" | "curly" | "mohawk" | "ponytail";
export type ExpressionId = "smile" | "smirk" | "shades" | "monocle" | "wink";
export type HatId        = "none"  | "cap"  | "beanie" | "tophat" | "crown";
export type TopId        = "tee"   | "hoodie" | "suit"  | "jersey" | "racing";
export type BottomsId    = "jeans" | "shorts" | "slacks" | "sweats";
export type ShoesId      = "barefoot" | "sneakers" | "boots" | "heels" | "sandals";

export interface AvatarConfig {
  skin: SkinId;
  hair: HairId;
  expression: ExpressionId;
  hat: HatId;
  top: TopId;
  topLabel: string; // short jersey label, 0-8 chars
  bottoms: BottomsId;
  shoes: ShoesId;
}

export const SKIN_OPTIONS: { id: SkinId; color: string; label: string }[] = [
  { id: "light", color: "#f5d7b8", label: "Light" },
  { id: "tan",   color: "#d8a878", label: "Tan" },
  { id: "brown", color: "#a16d4a", label: "Brown" },
  { id: "deep",  color: "#5d3a25", label: "Deep" },
  { id: "gold",  color: "#e6b85e", label: "Gold" },
];

export const HAIR_OPTIONS: { id: HairId; color: string | null; label: string }[] = [
  { id: "bald",     color: null,      label: "Bald" },
  { id: "short",    color: "#3a2418", label: "Short" },
  { id: "long",     color: "#c08a3e", label: "Long" },
  { id: "curly",    color: "#1a1a1a", label: "Curly" },
  { id: "mohawk",   color: "#e85d75", label: "Mohawk" },
  { id: "ponytail", color: "#d4a857", label: "Ponytail" },
];

export const EXPRESSION_OPTIONS: { id: ExpressionId; label: string }[] = [
  { id: "smile",   label: "Smile" },
  { id: "smirk",   label: "Smirk" },
  { id: "shades",  label: "Shades" },
  { id: "monocle", label: "Monocle" },
  { id: "wink",    label: "Wink" },
];

export const HAT_OPTIONS: { id: HatId; color: string | null; label: string }[] = [
  { id: "none",   color: null,      label: "None" },
  { id: "cap",    color: "#3b82f6", label: "Cap" },
  { id: "beanie", color: "#f59e0b", label: "Beanie" },
  { id: "tophat", color: "#0b0b14", label: "Top hat" },
  { id: "crown",  color: "#fbbf24", label: "Crown" },
];

export const TOP_OPTIONS: { id: TopId; color: string; label: string }[] = [
  { id: "tee",    color: "#4a90e2", label: "Tee" },
  { id: "hoodie", color: "#7c3aed", label: "Hoodie" },
  { id: "suit",   color: "#1f2937", label: "Suit" },
  { id: "jersey", color: "#dc2626", label: "Jersey" },
  { id: "racing", color: "#f59e0b", label: "Racing" },
];

export const BOTTOMS_OPTIONS: { id: BottomsId; color: string; label: string }[] = [
  { id: "jeans",  color: "#1e3a8a", label: "Jeans" },
  { id: "shorts", color: "#2d3748", label: "Shorts" },
  { id: "slacks", color: "#3f3f46", label: "Slacks" },
  { id: "sweats", color: "#525b6b", label: "Sweats" },
];

export const SHOES_OPTIONS: { id: ShoesId; color: string; label: string }[] = [
  { id: "barefoot", color: "#a16d4a", label: "None" },
  { id: "sneakers", color: "#f5f5f5", label: "Sneakers" },
  { id: "boots",    color: "#3d2817", label: "Boots" },
  { id: "heels",    color: "#dc2626", label: "Heels" },
  { id: "sandals",  color: "#8b5a2b", label: "Sandals" },
];

export const TOP_LABEL_MAX_LEN = 8;

export const DEFAULT_AVATAR: AvatarConfig = {
  skin: "tan",
  hair: "short",
  expression: "smile",
  hat: "none",
  top: "tee",
  topLabel: "",
  bottoms: "jeans",
  shoes: "sneakers",
};

const ID_SETS = {
  skin: new Set(SKIN_OPTIONS.map((o) => o.id)),
  hair: new Set(HAIR_OPTIONS.map((o) => o.id)),
  expression: new Set(EXPRESSION_OPTIONS.map((o) => o.id)),
  hat: new Set(HAT_OPTIONS.map((o) => o.id)),
  top: new Set(TOP_OPTIONS.map((o) => o.id)),
  bottoms: new Set(BOTTOMS_OPTIONS.map((o) => o.id)),
  shoes: new Set(SHOES_OPTIONS.map((o) => o.id)),
};

function pick<T extends string>(value: unknown, allowed: Set<string>, fallback: T): T {
  return typeof value === "string" && allowed.has(value) ? (value as T) : fallback;
}

export function sanitizeAvatar(raw: unknown): AvatarConfig {
  if (!raw || typeof raw !== "object") return { ...DEFAULT_AVATAR };
  const r = raw as Record<string, unknown>;
  const labelRaw = typeof r["topLabel"] === "string" ? r["topLabel"] : "";
  const topLabel = labelRaw
    .replace(/[^\x20-\x7E]/g, "") // printable ASCII only
    .slice(0, TOP_LABEL_MAX_LEN)
    .trimEnd();
  return {
    skin:       pick<SkinId>(r["skin"],       ID_SETS.skin,       DEFAULT_AVATAR.skin),
    hair:       pick<HairId>(r["hair"],       ID_SETS.hair,       DEFAULT_AVATAR.hair),
    expression: pick<ExpressionId>(r["expression"], ID_SETS.expression, DEFAULT_AVATAR.expression),
    hat:        pick<HatId>(r["hat"],         ID_SETS.hat,        DEFAULT_AVATAR.hat),
    top:        pick<TopId>(r["top"],         ID_SETS.top,        DEFAULT_AVATAR.top),
    topLabel,
    bottoms:    pick<BottomsId>(r["bottoms"], ID_SETS.bottoms,    DEFAULT_AVATAR.bottoms),
    shoes:      pick<ShoesId>(r["shoes"],     ID_SETS.shoes,      DEFAULT_AVATAR.shoes),
  };
}

// ─── Local persistence (so user keeps their look across sessions) ──────────

const AVATAR_STORAGE_KEY = "future_avatar";

export function loadStoredAvatar(): AvatarConfig {
  try {
    const raw = localStorage.getItem(AVATAR_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_AVATAR };
    return sanitizeAvatar(JSON.parse(raw));
  } catch {
    return { ...DEFAULT_AVATAR };
  }
}

export function saveStoredAvatar(avatar: AvatarConfig): void {
  try {
    localStorage.setItem(AVATAR_STORAGE_KEY, JSON.stringify(avatar));
  } catch {
    /* ignore */
  }
}

// Hash-based deterministic color used as the avatar background ring.
export function avatarRingHue(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return h % 360;
}
