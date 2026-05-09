import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Scissors, Smile, Crown, Shirt, Footprints, ArrowRight, Check, Shuffle,
} from "lucide-react";
import {
  type AvatarConfig,
  SKIN_OPTIONS, HAIR_OPTIONS, EXPRESSION_OPTIONS, HAT_OPTIONS, TOP_OPTIONS, BOTTOMS_OPTIONS,
  TOP_LABEL_MAX_LEN,
} from "@/lib/avatar";
import { PlayerAvatar } from "./PlayerAvatar";
import { cn } from "@/lib/utils";

type CategoryId = "skin" | "hair" | "expression" | "hat" | "top" | "bottoms";

const CATEGORIES: { id: CategoryId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "skin",       label: "Skin",       icon: User },
  { id: "hair",       label: "Hair",       icon: Scissors },
  { id: "expression", label: "Expression", icon: Smile },
  { id: "hat",        label: "Hat",        icon: Crown },
  { id: "top",        label: "Top",        icon: Shirt },
  { id: "bottoms",    label: "Bottoms",    icon: Footprints },
];

interface Props {
  initialAvatar: AvatarConfig;
  playerName: string;
  onConfirm: (avatar: AvatarConfig) => void;
  confirmLabel?: string;
}

export function AvatarBuilder({ initialAvatar, playerName, onConfirm, confirmLabel = "Start Investing" }: Props) {
  const [avatar, setAvatar] = useState<AvatarConfig>(initialAvatar);
  const [active, setActive] = useState<CategoryId>("skin");

  const items = useMemo(() => getItemsFor(active), [active]);
  const currentValue = avatar[active === "bottoms" ? "bottoms" : active];

  const update = <K extends keyof AvatarConfig>(key: K, value: AvatarConfig[K]) => {
    setAvatar((prev) => ({ ...prev, [key]: value }));
  };

  const randomize = () => {
    const pickOne = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
    setAvatar({
      skin: pickOne(SKIN_OPTIONS).id,
      hair: pickOne(HAIR_OPTIONS).id,
      expression: pickOne(EXPRESSION_OPTIONS).id,
      hat: pickOne(HAT_OPTIONS).id,
      top: pickOne(TOP_OPTIONS).id,
      topLabel: avatar.topLabel,
      bottoms: pickOne(BOTTOMS_OPTIONS).id,
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden text-foreground flex flex-col">
      {/* Vibrant deep navy + gold backdrop */}
      <div className="absolute inset-0 -z-10 bg-[#0a0e25]" />
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full bg-amber-400/15 blur-[160px]" />
        <div className="absolute -bottom-40 -right-40 w-[700px] h-[700px] rounded-full bg-violet-500/20 blur-[160px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-yellow-400/5 blur-[120px]" />
      </div>

      <header className="px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2 font-display font-bold">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          Future. <span className="text-muted-foreground font-normal">/ Customize</span>
        </div>
        <button
          type="button"
          onClick={randomize}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-white/15 text-muted-foreground hover:text-white hover:border-white/30 transition-all"
        >
          <Shuffle className="w-3.5 h-3.5" />
          Surprise me
        </button>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 pb-8">
        <div className="w-full max-w-3xl">
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight">
              Build your trader
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Make <span className="text-white font-semibold">{playerName || "your trader"}</span> look the part.
            </p>
          </div>

          {/* Avatar preview + side toolbar */}
          <div className="flex gap-4 items-stretch justify-center">
            {/* Phone-frame preview card */}
            <div className="flex-1 max-w-md">
              <div className="relative rounded-[2.5rem] border-[6px] border-zinc-800 bg-gradient-to-b from-[#152042] to-[#0a0e25] shadow-[0_30px_80px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.06)] overflow-hidden aspect-[3/4]">
                {/* Notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-5 rounded-full bg-black/80 z-10" />

                {/* Spot light gradient */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-amber-400/15 blur-[80px] rounded-full" />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 h-32 bg-black/50 blur-[40px] rounded-full" />
                </div>

                {/* Pedestal */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-56 h-3 rounded-full bg-gradient-to-r from-transparent via-amber-400/40 to-transparent blur-sm" />

                <div className="absolute inset-0 flex items-center justify-center pt-6">
                  <AnimatePresence mode="popLayout">
                    <motion.div
                      key={JSON.stringify(avatar)}
                      initial={{ scale: 0.92, opacity: 0, y: 10 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 1.02, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 280, damping: 22 }}
                    >
                      <PlayerAvatar avatar={avatar} size={260} />
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Player name plate */}
                {playerName && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/50 border border-white/10 text-xs font-semibold tracking-wide text-amber-200">
                    {playerName}
                  </div>
                )}
              </div>
            </div>

            {/* Vertical category toolbar */}
            <div className="flex flex-col gap-2 py-2">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive = active === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActive(cat.id)}
                    aria-label={cat.label}
                    aria-pressed={isActive}
                    className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center border transition-all relative group",
                      isActive
                        ? "bg-[#0b0e1f] border-amber-400/60 text-amber-300 shadow-[0_0_24px_rgba(251,191,36,0.35)]"
                        : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10 hover:text-white",
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="absolute right-full mr-2 px-2 py-1 rounded-md bg-black/80 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                      {cat.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Item tray */}
          <div className="mt-5 rounded-3xl border border-white/10 bg-black/30 backdrop-blur-md">
            <div className="px-5 py-3 flex items-center justify-between border-b border-white/5">
              <div className="text-xs uppercase tracking-widest text-amber-300/80 font-bold">
                {CATEGORIES.find((c) => c.id === active)?.label}
              </div>
              {active === "top" && (
                <div className="flex items-center gap-2">
                  <label className="text-[11px] text-muted-foreground uppercase tracking-wider">
                    Jersey label
                  </label>
                  <input
                    type="text"
                    maxLength={TOP_LABEL_MAX_LEN}
                    value={avatar.topLabel}
                    onChange={(e) =>
                      update(
                        "topLabel",
                        e.target.value.replace(/[^\x20-\x7E]/g, "").slice(0, TOP_LABEL_MAX_LEN),
                      )
                    }
                    placeholder="GOAT"
                    className="w-28 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm font-display font-bold uppercase tracking-wider text-amber-200 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                  />
                </div>
              )}
            </div>

            <div className="p-3 overflow-x-auto">
              <div className="flex gap-2 min-w-max">
                {items.map((item) => {
                  const isSelected = currentValue === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => updateCategory(active, item.id, setAvatar)}
                      className={cn(
                        "relative w-20 shrink-0 rounded-2xl border-2 p-2 flex flex-col items-center gap-1 transition-all",
                        isSelected
                          ? "border-amber-400 bg-amber-400/10 shadow-[0_0_18px_rgba(251,191,36,0.3)]"
                          : "border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20",
                      )}
                    >
                      <div className="w-14 h-14 rounded-xl bg-[#0b0e1f] flex items-center justify-center overflow-hidden">
                        <ItemThumbnail category={active} itemId={item.id} avatar={avatar} />
                      </div>
                      <span className="text-[10px] font-semibold text-muted-foreground truncate w-full text-center">
                        {item.label}
                      </span>
                      {isSelected && (
                        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center shadow-md">
                          <Check className="w-3 h-3" strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Confirm */}
          <button
            type="button"
            onClick={() => onConfirm(avatar)}
            className="mt-5 w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-950 font-display font-bold text-lg flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(251,191,36,0.45)] hover:shadow-[0_0_50px_rgba(251,191,36,0.6)] hover:-translate-y-0.5 transition-all"
          >
            {confirmLabel}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </main>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getItemsFor(category: CategoryId): { id: string; label: string }[] {
  switch (category) {
    case "skin":       return SKIN_OPTIONS;
    case "hair":       return HAIR_OPTIONS;
    case "expression": return EXPRESSION_OPTIONS;
    case "hat":        return HAT_OPTIONS;
    case "top":        return TOP_OPTIONS;
    case "bottoms":    return BOTTOMS_OPTIONS;
  }
}

function updateCategory(
  category: CategoryId,
  itemId: string,
  setAvatar: React.Dispatch<React.SetStateAction<AvatarConfig>>,
) {
  setAvatar((prev) => {
    switch (category) {
      case "skin":       return { ...prev, skin:       itemId as AvatarConfig["skin"] };
      case "hair":       return { ...prev, hair:       itemId as AvatarConfig["hair"] };
      case "expression": return { ...prev, expression: itemId as AvatarConfig["expression"] };
      case "hat":        return { ...prev, hat:        itemId as AvatarConfig["hat"] };
      case "top":        return { ...prev, top:        itemId as AvatarConfig["top"] };
      case "bottoms":    return { ...prev, bottoms:    itemId as AvatarConfig["bottoms"] };
    }
  });
}

// ItemThumbnail: builds a temporary avatar variant showing just the item being previewed.
function ItemThumbnail({
  category,
  itemId,
  avatar,
}: {
  category: CategoryId;
  itemId: string;
  avatar: AvatarConfig;
}) {
  const previewAvatar: AvatarConfig = useMemo(() => {
    const next = { ...avatar };
    switch (category) {
      case "skin":       next.skin       = itemId as AvatarConfig["skin"]; break;
      case "hair":       next.hair       = itemId as AvatarConfig["hair"]; break;
      case "expression": next.expression = itemId as AvatarConfig["expression"]; break;
      case "hat":        next.hat        = itemId as AvatarConfig["hat"]; break;
      case "top":        next.top        = itemId as AvatarConfig["top"]; break;
      case "bottoms":    next.bottoms    = itemId as AvatarConfig["bottoms"]; break;
    }
    return next;
  }, [category, itemId, avatar]);

  // Compact thumbnails for face-related items, full body for clothing.
  const compact = category === "skin" || category === "hair" || category === "expression" || category === "hat";
  return <PlayerAvatar avatar={previewAvatar} size={compact ? 56 : 72} compact={compact} />;
}
