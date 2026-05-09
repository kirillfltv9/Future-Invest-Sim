import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import {
  loadNickname,
  saveNickname,
  markNicknamePrompted,
  NICKNAME_MAX_LEN,
} from "@/lib/nickname";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function NicknameModal({ isOpen, onClose }: Props) {
  const [value, setValue] = useState(loadNickname());

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    saveNickname(trimmed);
    onClose();
  };

  const skip = () => {
    markNicknamePrompted();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            className="relative w-full max-w-md"
          >
            {/* Glow */}
            <div className="absolute -inset-4 bg-gradient-to-br from-amber-400/20 via-violet-500/15 to-blue-500/20 blur-3xl rounded-[3rem]" />

            <form
              onSubmit={submit}
              className="relative bg-[#0a0f1c] border border-white/10 rounded-3xl p-8 space-y-6 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]"
            >
              <div className="text-center space-y-3">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-400/15 text-amber-300 shadow-[0_0_30px_rgba(251,191,36,0.25)]">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h2 className="text-2xl font-display font-bold text-white">
                  What should we call you?
                </h2>
                <p className="text-sm text-muted-foreground">
                  Set a nickname once and we'll use it everywhere.
                  You can always change it later.
                </p>
              </div>

              <div>
                <input
                  autoFocus
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="e.g. Alex"
                  maxLength={NICKNAME_MAX_LEN}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-4 text-lg text-center font-display focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all placeholder:text-white/20"
                />
                <div className="flex justify-end mt-1.5">
                  <span className="text-[10px] text-muted-foreground/60">
                    {value.length}/{NICKNAME_MAX_LEN}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={skip}
                  className="flex-1 py-3 rounded-xl border border-white/10 text-sm font-semibold text-muted-foreground hover:text-white hover:border-white/20 transition-all"
                >
                  Skip
                </button>
                <button
                  type="submit"
                  disabled={!value.trim()}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-bold hover:shadow-[0_0_30px_rgba(251,191,36,0.45)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Save
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
