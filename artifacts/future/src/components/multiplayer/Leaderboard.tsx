import { motion, AnimatePresence } from "framer-motion";
import { Crown, ArrowUp, ArrowDown, Minus, Users, ChevronRight, ChevronLeft, Wifi, WifiOff } from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import type { LeaderboardEntry } from "@/lib/multiplayerSocket";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import { DEFAULT_AVATAR } from "@/lib/avatar";

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  myPlayerId: string | null;
  collapsed: boolean;
  onToggle: () => void;
  currentRound: number;
  totalRounds: number;
}

function RankDelta({ delta }: { delta: number }) {
  if (delta > 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-emerald-400 text-[10px] font-bold">
        <ArrowUp className="w-3 h-3" />
        {delta}
      </span>
    );
  }
  if (delta < 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-red-400 text-[10px] font-bold">
        <ArrowDown className="w-3 h-3" />
        {Math.abs(delta)}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-0.5 text-muted-foreground/60 text-[10px]">
      <Minus className="w-3 h-3" />
    </span>
  );
}

export function Leaderboard({
  entries,
  myPlayerId,
  collapsed,
  onToggle,
  currentRound,
  totalRounds,
}: LeaderboardProps) {
  return (
    <>
      {/* Collapse / Expand button (always visible) */}
      <button
        onClick={onToggle}
        className={cn(
          "fixed top-20 z-50 flex items-center gap-2 px-3 py-2 rounded-l-xl bg-black/70 backdrop-blur-md border border-r-0 border-white/10 text-sm font-semibold text-white/80 hover:bg-black/90 hover:text-white transition-all",
          collapsed ? "right-0" : "right-80",
        )}
      >
        {collapsed ? (
          <>
            <ChevronLeft className="w-4 h-4" />
            <Users className="w-4 h-4" />
            <span className="font-mono">{entries.length}</span>
          </>
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </button>

      <AnimatePresence>
        {!collapsed && (
          <motion.aside
            initial={{ x: 320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 320, opacity: 0 }}
            transition={{ type: "spring", damping: 26, stiffness: 220 }}
            className="fixed top-16 right-0 bottom-0 w-80 bg-[#0a0d12]/95 backdrop-blur-xl border-l border-white/10 z-40 flex flex-col"
          >
            <div className="p-4 border-b border-white/5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-display font-semibold flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  Leaderboard
                </h3>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">
                  Round {currentRound}/{totalRounds}
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {entries.length === 0 && (
                <div className="text-center text-muted-foreground text-sm py-8">
                  Waiting for players…
                </div>
              )}
              {entries.map((entry) => {
                const isMe = entry.playerId === myPlayerId;
                const isLeader = entry.rank === 1 && entries.length > 1;
                const isPositive = entry.returnPercent >= 0;

                return (
                  <motion.div
                    layout
                    key={entry.playerId}
                    transition={{ type: "spring", damping: 24, stiffness: 240 }}
                    className={cn(
                      "rounded-xl border p-3 relative overflow-hidden",
                      isMe
                        ? "bg-primary/10 border-primary/40 shadow-[0_0_20px_rgba(var(--primary),0.15)]"
                        : isLeader
                        ? "bg-yellow-500/5 border-yellow-500/30"
                        : "bg-white/5 border-white/5",
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "w-7 h-7 rounded-lg flex items-center justify-center font-display font-bold text-sm shrink-0",
                          isLeader
                            ? "bg-yellow-500/20 text-yellow-300"
                            : entry.rank === 2
                            ? "bg-zinc-300/15 text-zinc-200"
                            : entry.rank === 3
                            ? "bg-amber-700/20 text-amber-500"
                            : "bg-white/5 text-muted-foreground",
                        )}
                      >
                        {isLeader ? <Crown className="w-4 h-4" /> : entry.rank}
                      </div>

                      <div className="w-9 h-9 rounded-lg bg-[#0a0e25] border border-white/5 overflow-hidden flex items-end justify-center shrink-0">
                        <PlayerAvatar avatar={entry.avatar ?? DEFAULT_AVATAR} size={36} compact />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={cn(
                              "font-semibold text-sm truncate",
                              isMe ? "text-primary" : "text-foreground",
                            )}
                          >
                            {entry.name}
                          </span>
                          {isMe && (
                            <span className="text-[9px] uppercase font-bold tracking-widest text-primary/80">
                              YOU
                            </span>
                          )}
                          {entry.isHost && (
                            <span className="text-[9px] uppercase font-bold tracking-widest text-yellow-400/80">
                              HOST
                            </span>
                          )}
                          {!entry.connected && (
                            <WifiOff className="w-3 h-3 text-red-400/60" />
                          )}
                        </div>

                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-financial text-sm font-medium">
                            {formatCurrency(entry.totalValue)}
                          </span>
                          <span
                            className={cn(
                              "text-[11px] font-medium font-mono",
                              isPositive ? "text-emerald-400" : "text-red-400",
                            )}
                          >
                            {isPositive ? "+" : ""}
                            {entry.returnPercent.toFixed(1)}%
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0">
                        <RankDelta delta={entry.rankDelta} />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="p-3 border-t border-white/5 text-[10px] text-muted-foreground/60 text-center">
              <Wifi className="w-3 h-3 inline mr-1" />
              Live · updates every round
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
