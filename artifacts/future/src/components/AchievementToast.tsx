import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award } from "lucide-react";
import type { Achievement } from "@/lib/achievements";
import { playAchievementChime } from "@/lib/sounds";

interface Props {
  queue: Achievement[];
  onDismiss: (id: string) => void;
}

/** Slide-in achievement badge stack in the corner. */
export function AchievementToast({ queue, onDismiss }: Props) {
  return (
    <div className="fixed top-20 right-6 z-[90] flex flex-col gap-2 pointer-events-none max-w-xs">
      <AnimatePresence>
        {queue.map((a) => (
          <ToastCard key={a.id} achievement={a} onDismiss={() => onDismiss(a.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastCard({ achievement, onDismiss }: { achievement: Achievement; onDismiss: () => void }) {
  const dismissRef = useRef(onDismiss);
  useEffect(() => { dismissRef.current = onDismiss; }, [onDismiss]);

  useEffect(() => {
    playAchievementChime();
    const t = setTimeout(() => dismissRef.current(), 5500);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      layout
      initial={{ x: 360, opacity: 0, rotate: 6 }}
      animate={{ x: 0, opacity: 1, rotate: 0, transition: { type: "spring", stiffness: 230, damping: 20 } }}
      exit={{ x: 360, opacity: 0, scale: 0.9 }}
      className="relative pointer-events-auto"
    >
      {/* Glow */}
      <motion.div
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 1.6, repeat: Infinity }}
        className="absolute -inset-2 rounded-3xl bg-yellow-400/30 blur-xl -z-10"
      />
      <div className="relative rounded-2xl border-2 border-yellow-400/50 bg-gradient-to-br from-yellow-500/15 via-amber-600/10 to-amber-900/20 p-4 backdrop-blur-md shadow-[0_15px_50px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ rotate: -180, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 220, damping: 14 }}
            className="shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-300 to-amber-600 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(250,204,21,0.6)]"
          >
            <span>{achievement.emoji}</span>
          </motion.div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.25em] text-yellow-300/80 font-bold mb-0.5">
              <Award className="w-2.5 h-2.5" strokeWidth={3} />
              Achievement Unlocked
            </div>
            <div className="font-display font-extrabold text-base text-yellow-50 truncate">
              {achievement.title}
            </div>
            <div className="text-xs text-yellow-100/70 leading-snug mt-0.5">
              {achievement.description}
            </div>
          </div>
        </div>
        {/* Auto-dismiss progress */}
        <motion.div
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{ duration: 5.5, ease: "linear" }}
          style={{ transformOrigin: "left" }}
          className="mt-3 h-0.5 bg-yellow-300/70 rounded-full"
        />
      </div>
    </motion.div>
  );
}
