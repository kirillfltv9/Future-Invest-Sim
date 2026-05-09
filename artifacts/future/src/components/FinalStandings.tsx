import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Medal, Trophy, ChevronDown, RotateCcw, Home } from "lucide-react";
import type { LeaderboardEntry } from "@/lib/multiplayerSocket";
import { cn } from "@/lib/utils";

interface Props {
  leaderboard: LeaderboardEntry[];
  roomCode: string;
  myPlayerId: string | null;
  onPlayAgain: () => void;
  onLeave: () => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "?";
}

function formatPodiumValue(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (abs >= 1e9)  return `$${(value / 1e9).toFixed(2)}B`;
  if (abs >= 1e6)  return `$${(value / 1e6).toFixed(2)}M`;
  if (abs >= 1e4)  return `$${Math.round(value).toLocaleString("en-US")}`;
  return `$${value.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
}

const AVATAR_COLORS = [
  "from-emerald-400 to-teal-500",
  "from-violet-400 to-fuchsia-500",
  "from-sky-400 to-indigo-500",
  "from-orange-400 to-rose-500",
  "from-amber-400 to-yellow-500",
  "from-pink-400 to-red-500",
];

function avatarGradient(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

// ─── Confetti ────────────────────────────────────────────────────────────────

const CONFETTI_SYMBOLS = ["$", "📈", "💰", "🪙", "$"];
const CONFETTI_COUNT = 36;

function Confetti() {
  const pieces = useMemo(() => {
    return Array.from({ length: CONFETTI_COUNT }).map((_, i) => ({
      id: i,
      symbol: CONFETTI_SYMBOLS[Math.floor(Math.random() * CONFETTI_SYMBOLS.length)],
      left: Math.random() * 100,
      delay: Math.random() * 1.5,
      duration: 4 + Math.random() * 3,
      repeatDelay: 2 + Math.random() * 2,
      rotateStart: Math.random() * 360,
      rotateEnd: Math.random() * 720 - 360,
      size: 14 + Math.floor(Math.random() * 18),
      isText: Math.random() > 0.45,
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -50, x: 0, opacity: 0, rotate: p.rotateStart }}
          animate={{ y: "110vh", opacity: [0, 1, 1, 0.8, 0], rotate: p.rotateEnd }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            repeatDelay: p.repeatDelay,
            ease: "linear",
          }}
          style={{ left: `${p.left}%`, fontSize: p.size }}
          className={cn(
            "absolute top-0 select-none",
            p.isText
              ? "font-display font-extrabold text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.7)]"
              : "",
          )}
        >
          {p.symbol}
        </motion.div>
      ))}
    </div>
  );
}

// ─── Podium Block ────────────────────────────────────────────────────────────

interface BlockProps {
  entry: (LeaderboardEntry & { displayRank: number }) | null;
  rank: 1 | 2 | 3;
  delay: number;
  isMe: boolean;
}

const RANK_LABEL: Record<number, string> = { 1: "1st", 2: "2nd", 3: "3rd" };
function ordinalLabel(n: number): string {
  if (RANK_LABEL[n]) return RANK_LABEL[n];
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`;
  switch (n % 10) {
    case 1: return `${n}st`;
    case 2: return `${n}nd`;
    case 3: return `${n}rd`;
    default: return `${n}th`;
  }
}

const RANK_STYLE = {
  1: {
    height: "h-72",
    border: "border-yellow-400/60",
    glow: "shadow-[0_0_50px_rgba(250,204,21,0.4)]",
    bg: "bg-gradient-to-b from-yellow-500/15 via-yellow-500/5 to-transparent",
    medalBg: "bg-gradient-to-br from-yellow-300 to-amber-500 text-amber-950",
    avatarRing: "ring-yellow-400/80 shadow-[0_0_30px_rgba(250,204,21,0.6)]",
    label: "1st",
    icon: Crown,
  },
  2: {
    height: "h-60",
    border: "border-zinc-300/50",
    glow: "shadow-[0_0_30px_rgba(212,212,216,0.2)]",
    bg: "bg-gradient-to-b from-zinc-300/15 via-zinc-300/5 to-transparent",
    medalBg: "bg-gradient-to-br from-zinc-200 to-zinc-400 text-zinc-900",
    avatarRing: "ring-zinc-300/60 shadow-[0_0_20px_rgba(212,212,216,0.4)]",
    label: "2nd",
    icon: Medal,
  },
  3: {
    height: "h-52",
    border: "border-amber-700/50",
    glow: "shadow-[0_0_30px_rgba(180,83,9,0.25)]",
    bg: "bg-gradient-to-b from-amber-700/15 via-amber-700/5 to-transparent",
    medalBg: "bg-gradient-to-br from-amber-500 to-amber-800 text-amber-50",
    avatarRing: "ring-amber-700/60 shadow-[0_0_20px_rgba(180,83,9,0.5)]",
    label: "3rd",
    icon: Medal,
  },
} as const;

function PodiumBlock({ entry, rank, delay, isMe }: BlockProps) {
  const style = RANK_STYLE[rank];

  // Medal/label honor the player's actual rank (handles ties), not the slot.
  const actualRank = entry?.displayRank ?? rank;
  const medalStyle = RANK_STYLE[(Math.min(actualRank, 3) as 1 | 2 | 3)];
  const MedalIcon = medalStyle.icon;
  const medalLabel = ordinalLabel(actualRank);

  if (!entry) {
    return (
      <div
        className={cn(
          "relative w-full rounded-3xl border border-dashed border-white/10 bg-white/[0.02] flex items-end justify-center pb-6",
          style.height,
        )}
      >
        <div className="text-xs text-muted-foreground/50 uppercase tracking-widest">
          {style.label} · Empty
        </div>
      </div>
    );
  }

  const avatarBg = avatarGradient(entry.name);

  return (
    <motion.div
      initial={{ opacity: 0, y: 80 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 150, damping: 18, delay }}
      className="relative w-full pt-12"
    >
      {/* Avatar overlapping the top edge */}
      <motion.div
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 14, delay: delay + 0.15 }}
        className={cn(
          "absolute left-1/2 -translate-x-1/2 top-0 z-10 w-20 h-20 rounded-full ring-4 flex items-center justify-center font-display font-bold text-2xl text-white bg-gradient-to-br",
          avatarBg,
          style.avatarRing,
        )}
      >
        {initialsOf(entry.name)}
      </motion.div>

      {/* The block itself */}
      <motion.div
        animate={
          rank === 1
            ? {
                boxShadow: [
                  "0 0 30px rgba(250,204,21,0.35)",
                  "0 0 70px rgba(250,204,21,0.6)",
                  "0 0 30px rgba(250,204,21,0.35)",
                ],
              }
            : undefined
        }
        transition={rank === 1 ? { duration: 2.2, repeat: Infinity, ease: "easeInOut" } : undefined}
        className={cn(
          "relative w-full rounded-3xl border-2 px-4 pt-14 pb-6 backdrop-blur-md flex flex-col items-center justify-end gap-2 bg-[#0d1117]/70",
          style.height,
          style.border,
          style.bg,
          rank !== 1 && style.glow,
          isMe && "ring-2 ring-primary/60",
        )}
      >
        {/* Medal badge — uses actual displayRank so ties stay correct */}
        <div
          className={cn(
            "absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider",
            medalStyle.medalBg,
          )}
        >
          <MedalIcon className="w-3 h-3" strokeWidth={2.5} />
          {medalLabel}
        </div>

        {isMe && (
          <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-primary text-primary-foreground text-[10px] font-bold tracking-widest uppercase">
            You
          </div>
        )}

        <div className="text-center space-y-1 w-full">
          <div className="font-display font-bold text-lg truncate px-2" title={entry.name}>
            {entry.name}
          </div>
          <div
            className={cn(
              "font-financial font-extrabold tracking-tight",
              rank === 1 ? "text-3xl text-yellow-300" : rank === 2 ? "text-2xl text-zinc-100" : "text-2xl text-amber-300",
            )}
          >
            {formatPodiumValue(entry.totalValue)}
          </div>
          <div
            className={cn(
              "text-xs font-mono font-semibold",
              entry.returnPercent >= 0 ? "text-emerald-400" : "text-red-400",
            )}
          >
            {entry.returnPercent >= 0 ? "+" : ""}
            {entry.returnPercent.toFixed(2)}%
          </div>
        </div>

        {/* Pedestal numeral */}
        <div
          className={cn(
            "absolute -bottom-3 left-1/2 -translate-x-1/2 w-10 h-10 rounded-xl flex items-center justify-center font-display font-extrabold text-xl border-2",
            medalStyle.medalBg,
            medalStyle.border,
          )}
        >
          {actualRank}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────

export function FinalStandings({
  leaderboard,
  roomCode,
  myPlayerId,
  onPlayAgain,
  onLeave,
}: Props) {
  const [showAll, setShowAll] = useState(false);

  // Sort defensively (server already sends sorted, but be safe).
  const sorted = useMemo(
    () => [...leaderboard].sort((a, b) => b.totalValue - a.totalValue),
    [leaderboard],
  );

  // Recompute ranks honoring ties (same value → same rank).
  const ranked = useMemo(() => {
    let lastValue: number | null = null;
    let lastRank = 0;
    return sorted.map((e, i) => {
      const rank = lastValue !== null && e.totalValue === lastValue ? lastRank : i + 1;
      lastValue = e.totalValue;
      lastRank = rank;
      return { ...e, displayRank: rank };
    });
  }, [sorted]);

  const first = ranked[0] ?? null;
  const second = ranked[1] ?? null;
  const third = ranked[2] ?? null;
  const rest = ranked.slice(3);

  const me = ranked.find((e) => e.playerId === myPlayerId);

  return (
    <div className="min-h-screen bg-[#050813] text-foreground relative overflow-hidden flex flex-col">
      {/* Backdrop glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-yellow-400/10 blur-[160px] rounded-full" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-emerald-400/10 blur-[140px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-violet-500/10 blur-[140px] rounded-full" />
      </div>

      <Confetti />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-10">
        <div className="max-w-5xl w-full space-y-10">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-2"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-300 text-[11px] font-bold tracking-widest uppercase">
              <Trophy className="w-3 h-3" />
              Game Over · Room {roomCode}
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-yellow-100 to-yellow-400 drop-shadow-[0_0_30px_rgba(250,204,21,0.4)]">
              Final Standings
            </h1>
            {me && (
              <p className="text-sm text-muted-foreground pt-2">
                You finished{" "}
                <span className="text-white font-semibold">#{me.displayRank}</span> of{" "}
                {ranked.length} ·{" "}
                <span className={me.returnPercent >= 0 ? "text-emerald-400" : "text-red-400"}>
                  {me.returnPercent >= 0 ? "+" : ""}
                  {me.returnPercent.toFixed(2)}%
                </span>{" "}
                return
              </p>
            )}
          </motion.div>

          {/* Podium */}
          <div className="grid grid-cols-3 gap-4 md:gap-6 items-end max-w-3xl mx-auto">
            <PodiumBlock entry={second} rank={2} delay={0.5} isMe={second?.playerId === myPlayerId} />
            <PodiumBlock entry={first}  rank={1} delay={1.0} isMe={first?.playerId  === myPlayerId} />
            <PodiumBlock entry={third}  rank={3} delay={0.2} isMe={third?.playerId  === myPlayerId} />
          </div>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4"
          >
            <button
              onClick={onPlayAgain}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 text-amber-950 font-bold shadow-[0_0_30px_rgba(250,204,21,0.4)] hover:shadow-[0_0_45px_rgba(250,204,21,0.6)] hover:-translate-y-0.5 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Play Again
            </button>
            {rest.length > 0 && (
              <button
                onClick={() => setShowAll((v) => !v)}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-white/15 bg-white/5 text-foreground font-semibold hover:bg-white/10 transition-all"
              >
                <ChevronDown
                  className={cn("w-4 h-4 transition-transform", showAll && "rotate-180")}
                />
                {showAll ? "Hide leaderboard" : `View Leaderboard (${ranked.length})`}
              </button>
            )}
            <button
              onClick={onLeave}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl border border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/5 font-semibold transition-all"
            >
              <Home className="w-4 h-4" />
              Back to start
            </button>
          </motion.div>

          {/* Full leaderboard list */}
          <AnimatePresence>
            {showAll && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden max-w-2xl mx-auto"
              >
                <div className="space-y-2 pt-2 max-h-[40vh] overflow-y-auto pr-2">
                  {ranked.map((entry, idx) => {
                    const isMe = entry.playerId === myPlayerId;
                    const positive = entry.returnPercent >= 0;
                    return (
                      <motion.div
                        key={entry.playerId}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        className={cn(
                          "flex items-center gap-4 p-3 rounded-xl border bg-white/[0.03]",
                          isMe ? "border-primary/40 bg-primary/5" : "border-white/5",
                        )}
                      >
                        <div className="w-9 h-9 shrink-0 rounded-lg flex items-center justify-center font-display font-bold bg-white/5 text-muted-foreground">
                          #{entry.displayRank}
                        </div>
                        <div
                          className={cn(
                            "w-9 h-9 shrink-0 rounded-full bg-gradient-to-br flex items-center justify-center text-sm font-display font-bold text-white",
                            avatarGradient(entry.name),
                          )}
                        >
                          {initialsOf(entry.name)}
                        </div>
                        <div className="flex-1 min-w-0 truncate">
                          <span className="font-semibold">{entry.name}</span>
                          {isMe && (
                            <span className="ml-2 text-[10px] uppercase font-bold tracking-widest text-primary">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <div className="font-financial font-bold text-sm">
                            {formatPodiumValue(entry.totalValue)}
                          </div>
                          <div
                            className={cn(
                              "text-[11px] font-mono",
                              positive ? "text-emerald-400" : "text-red-400",
                            )}
                          >
                            {positive ? "+" : ""}
                            {entry.returnPercent.toFixed(2)}%
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
