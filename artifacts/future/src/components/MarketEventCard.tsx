import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Newspaper, TrendingUp, TrendingDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { playEventSting } from "@/lib/sounds";

interface Props {
  open: boolean;
  headline: string;
  body?: string;
  sentiment?: "bullish" | "bearish" | "neutral";
  affectedTickers?: string[];
  onClose: () => void;
  autoCloseMs?: number;
}

/** Dramatic breaking-news popup that pops up before each round of trading. */
export function MarketEventCard({
  open, headline, body, sentiment = "neutral", affectedTickers = [], onClose, autoCloseMs = 6000,
}: Props) {
  // Auto-close — keyed on the headline so re-renders don't re-trigger the
  // sting or reset the timer. We deliberately omit onClose from deps and use
  // a ref to always invoke the latest version.
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);

  useEffect(() => {
    if (!open || !headline) return;
    playEventSting();
    const id = setTimeout(() => onCloseRef.current(), autoCloseMs);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, headline, autoCloseMs]);

  const accentClass =
    sentiment === "bullish" ? "from-emerald-500/30 via-emerald-400/10 to-transparent border-emerald-400/40 text-emerald-300" :
    sentiment === "bearish" ? "from-red-500/30 via-red-400/10 to-transparent border-red-400/40 text-red-300" :
    "from-amber-500/30 via-amber-400/10 to-transparent border-amber-400/40 text-amber-200";

  const SentimentIcon = sentiment === "bearish" ? TrendingDown : sentiment === "bullish" ? TrendingUp : Newspaper;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="market-event-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-start justify-center p-6 pt-24 bg-black/60 backdrop-blur-sm pointer-events-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -120, opacity: 0, rotateX: -20, scale: 0.94 }}
            animate={{
              y: 0,
              opacity: 1,
              rotateX: 0,
              scale: 1,
              transition: { type: "spring", stiffness: 220, damping: 22 },
            }}
            exit={{ y: -60, opacity: 0, scale: 0.96 }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "relative max-w-2xl w-full rounded-3xl border-2 bg-gradient-to-b shadow-[0_30px_120px_rgba(0,0,0,0.65)] overflow-hidden",
              accentClass,
            )}
            style={{ transformStyle: "preserve-3d", perspective: 1000 }}
          >
            {/* Pulsing edge glow */}
            <motion.div
              className={cn(
                "absolute -inset-1 rounded-3xl blur-xl opacity-40 -z-10",
                sentiment === "bullish" ? "bg-emerald-400" :
                sentiment === "bearish" ? "bg-red-500" : "bg-amber-400"
              )}
              animate={{ opacity: [0.3, 0.55, 0.3] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Top "BREAKING" bar */}
            <div className="px-6 py-3 border-b border-white/10 bg-black/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ scale: [1, 1.18, 1] }}
                  transition={{ duration: 0.9, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-current"
                />
                <span className="text-[10px] font-display font-extrabold tracking-[0.4em] uppercase">
                  Breaking · Market Wire
                </span>
              </div>
              <button
                onClick={onClose}
                className="text-white/40 hover:text-white/90 transition-colors"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Headline */}
            <div className="p-7 space-y-4 bg-gradient-to-b from-transparent to-black/30">
              <div className="flex items-start gap-4">
                <motion.div
                  initial={{ rotate: -20, scale: 0.6, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  transition={{ delay: 0.15, type: "spring", stiffness: 250, damping: 16 }}
                  className={cn(
                    "shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center border",
                    "bg-black/50 border-current/40"
                  )}
                >
                  <SentimentIcon className="w-6 h-6" strokeWidth={2.5} />
                </motion.div>
                <h2 className="font-display font-extrabold text-2xl md:text-3xl leading-tight text-white">
                  {headline}
                </h2>
              </div>

              {body && (
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-white/75 text-sm leading-relaxed pl-16"
                >
                  {body}
                </motion.p>
              )}

              {affectedTickers.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.45 }}
                  className="flex items-center flex-wrap gap-2 pl-16 pt-2"
                >
                  <span className="text-[10px] uppercase tracking-widest text-white/40 mr-1">Affected:</span>
                  {affectedTickers.map((t) => (
                    <motion.span
                      key={t}
                      animate={{ x: [0, -2, 2, -1, 1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1.5 }}
                      className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 font-mono text-xs font-bold text-white"
                    >
                      {t}
                    </motion.span>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Bottom progress bar */}
            <motion.div
              key={headline}
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: autoCloseMs / 1000, ease: "linear" }}
              style={{ transformOrigin: "left" }}
              className="h-1 bg-current"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
