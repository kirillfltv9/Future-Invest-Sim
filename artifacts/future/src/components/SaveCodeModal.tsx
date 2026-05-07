import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Copy, Loader2, Save, X } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  /**
   * Async function that creates the save and returns the resume code.
   * Should reject if creation fails.
   */
  onSave: () => Promise<string>;
  /**
   * Optional label shown after the user copies — typically "Leave game" or "Back to start".
   * If provided, the action will trigger after the user clicks the bottom button.
   */
  onLeave?: () => void;
  leaveLabel?: string;
}

export function SaveCodeModal({ isOpen, onClose, onSave, onLeave, leaveLabel = "Leave game" }: Props) {
  const [code, setCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    setError(null);
    try {
      const c = await onSave();
      setCode(c);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save game");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!code) return;
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleClose = () => {
    setCode(null);
    setError(null);
    setCopied(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="max-w-md w-full bg-[#0d1117] border border-white/10 rounded-3xl p-8 space-y-5 relative"
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5"
            >
              <X className="w-4 h-4" />
            </button>

            {!code ? (
              <div className="text-center space-y-5">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <Save className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-display font-bold">Save your game</h3>
                <p className="text-sm text-muted-foreground">
                  We'll create a one-time resume code so you can pick up exactly where you left off.
                </p>
                {error && <p className="text-sm text-red-400">{error}</p>}
                <div className="flex gap-2">
                  <button
                    onClick={handleClose}
                    className="flex-1 py-3 rounded-xl border border-white/10 text-sm font-semibold text-muted-foreground hover:text-foreground hover:border-white/20"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreate}
                    disabled={loading}
                    className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Generate code
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-5">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-400/10 flex items-center justify-center">
                  <Check className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-display font-bold">Game saved</h3>
                <p className="text-sm text-muted-foreground">
                  Use this code on the start screen to resume. Keep it somewhere safe.
                </p>
                <div className="bg-black/40 border border-white/10 rounded-2xl py-5">
                  <div className="text-5xl font-display font-bold tracking-[0.3em] font-mono">{code}</div>
                </div>
                <button
                  onClick={handleCopy}
                  className="w-full py-2.5 rounded-xl border border-white/10 text-sm font-semibold hover:bg-white/5 flex items-center justify-center gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy code
                    </>
                  )}
                </button>
                {onLeave ? (
                  <button
                    onClick={() => {
                      handleClose();
                      onLeave();
                    }}
                    className="w-full py-3 rounded-xl bg-white text-black font-semibold hover:bg-white/90"
                  >
                    {leaveLabel}
                  </button>
                ) : (
                  <button
                    onClick={handleClose}
                    className="w-full py-3 rounded-xl bg-white text-black font-semibold hover:bg-white/90"
                  >
                    Done
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
