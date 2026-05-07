import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { KeyRound, Loader2, X } from "lucide-react";
import { setSessionId } from "@/lib/session";
import { setMultiplayerIntent } from "@/lib/multiplayerSocket";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function ResumeModal({ isOpen, onClose }: Props) {
  const [, setLocation] = useLocation();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setCode("");
    setError(null);
    setLoading(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleResume = async () => {
    if (loading) return;
    if (code.trim().length < 4) {
      setError("Enter your resume code");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/saves/load", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim().toUpperCase() }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? "Save code not found");
      }
      const data = await res.json();
      if (data.kind === "solo" && typeof data.sessionId === "string") {
        setSessionId(data.sessionId);
        handleClose();
        setLocation("/dashboard");
        return;
      }
      if (
        data.kind === "multiplayer" &&
        typeof data.roomCode === "string" &&
        typeof data.resumeToken === "string"
      ) {
        setMultiplayerIntent({
          mode: "resume",
          playerName: typeof data.playerName === "string" ? data.playerName : "Player",
          joinCode: data.roomCode,
          resumeToken: data.resumeToken,
        });
        handleClose();
        setLocation("/multiplayer");
        return;
      }
      throw new Error("Unrecognized save");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load save");
      setLoading(false);
    }
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

            <div className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <KeyRound className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-display font-bold">Resume a saved game</h3>
              <p className="text-sm text-muted-foreground">
                Enter the code you got when you saved your last session. Codes are single-use.
              </p>
            </div>

            <input
              type="text"
              value={code}
              maxLength={6}
              autoFocus
              onChange={(e) => setCode(e.target.value.replace(/[^A-Za-z0-9]/g, "").toUpperCase())}
              placeholder="ABC123"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3.5 text-2xl font-mono tracking-[0.3em] text-center focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleResume();
              }}
            />
            {error && <p className="text-sm text-red-400 text-center">{error}</p>}
            <button
              onClick={handleResume}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Resume game
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
