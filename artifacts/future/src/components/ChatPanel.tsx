import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ChatMessage {
  id: string;
  from: string;
  name: string;
  text: string;
  ts: number;
}

export interface ReactionKind {
  id: string;
  emoji: string;
  label: string;
}

export const REACTIONS: ReactionKind[] = [
  { id: "rocket", emoji: "🚀", label: "Pump it" },
  { id: "moneybag", emoji: "💰", label: "Big bag" },
  { id: "chart", emoji: "📈", label: "Up only" },
  { id: "skull", emoji: "💀", label: "RIP portfolio" },
  { id: "fire", emoji: "🔥", label: "On fire" },
  { id: "diamond", emoji: "💎", label: "Diamond hands" },
];

interface Props {
  messages: ChatMessage[];
  myPlayerId: string | null;
  onSend: (text: string) => void;
  onReact: (kind: string) => void;
  open: boolean;
  onToggle: () => void;
  unread: number;
}

/** Side chat panel + quick reaction buttons. */
export function ChatPanel({
  messages, myPlayerId, onSend, onReact, open, onToggle, unread,
}: Props) {
  const [draft, setDraft] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, open]);

  const submit = () => {
    const text = draft.trim().slice(0, 200);
    if (!text) return;
    onSend(text);
    setDraft("");
  };

  return (
    <>
      {/* Floating toggle button when collapsed */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={onToggle}
            className="fixed bottom-6 right-6 z-[60] flex items-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-600 text-black font-bold shadow-[0_8px_30px_rgba(250,204,21,0.45)] hover:shadow-[0_12px_45px_rgba(250,204,21,0.6)] hover:-translate-y-0.5 transition-all"
            aria-label="Open chat"
          >
            <MessageCircle className="w-5 h-5" strokeWidth={2.5} />
            <span className="text-sm">Chat</span>
            {unread > 0 && (
              <span className="ml-1 min-w-5 px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-extrabold">
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: 360, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 360, opacity: 0 }}
            transition={{ type: "spring", stiffness: 240, damping: 28 }}
            className="fixed bottom-6 right-6 w-80 max-h-[70vh] z-[55] bg-[#0a0e1f]/95 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between bg-black/30">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-amber-400" />
                <span className="font-display font-bold text-sm">Trading Floor</span>
              </div>
              <button
                onClick={onToggle}
                className="text-white/40 hover:text-white/80 transition-colors"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div ref={listRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
              {messages.length === 0 ? (
                <div className="text-center text-xs text-muted-foreground/60 italic mt-8">
                  No messages yet. Talk smack to your friends.
                </div>
              ) : (
                messages.map((m) => {
                  const mine = m.from === myPlayerId;
                  return (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 6, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className={cn(
                        "flex flex-col max-w-[85%]",
                        mine ? "ml-auto items-end" : "items-start"
                      )}
                    >
                      <div
                        className={cn(
                          "text-[10px] uppercase tracking-wider font-bold mb-0.5 px-1",
                          mine ? "text-amber-300/80" : "text-muted-foreground"
                        )}
                      >
                        {mine ? "You" : m.name}
                      </div>
                      <div
                        className={cn(
                          "px-3 py-1.5 rounded-2xl text-sm leading-snug break-words",
                          mine
                            ? "bg-amber-500/20 border border-amber-400/30 text-amber-50 rounded-tr-sm"
                            : "bg-white/5 border border-white/10 text-foreground rounded-tl-sm"
                        )}
                      >
                        {m.text}
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Reaction buttons */}
            <div className="px-3 py-2 border-t border-white/10 bg-black/20">
              <div className="text-[9px] uppercase tracking-widest text-muted-foreground mb-1.5 px-1">
                Quick reactions
              </div>
              <div className="grid grid-cols-6 gap-1">
                {REACTIONS.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => onReact(r.id)}
                    title={r.label}
                    className="aspect-square flex items-center justify-center text-xl rounded-lg bg-white/5 border border-white/10 hover:bg-amber-400/20 hover:border-amber-400/40 hover:-translate-y-0.5 active:scale-90 transition-all"
                  >
                    {r.emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Composer */}
            <form
              onSubmit={(e) => { e.preventDefault(); submit(); }}
              className="p-3 border-t border-white/10 bg-black/30 flex gap-2"
            >
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                maxLength={200}
                placeholder="Send a message…"
                className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-amber-400/50 focus:bg-white/10 transition-all"
              />
              <button
                type="submit"
                disabled={!draft.trim()}
                className={cn(
                  "px-3 rounded-xl flex items-center justify-center transition-all",
                  draft.trim()
                    ? "bg-amber-500 text-black hover:bg-amber-400"
                    : "bg-white/5 text-muted-foreground/40 cursor-not-allowed"
                )}
                aria-label="Send"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

interface FloatingReactionsProps {
  reactions: { id: string; emoji: string; from: string; }[];
  onExpire: (id: string) => void;
}

/** Renders large floating emoji that drift up and fade out. Mounted near the
 *  game stage so reactions feel like they fly across the screen. */
export function FloatingReactions({ reactions, onExpire }: FloatingReactionsProps) {
  return (
    <div className="fixed inset-0 pointer-events-none z-[70] overflow-hidden">
      <AnimatePresence>
        {reactions.map((r) => (
          <FloatingItem key={r.id} reaction={r} onExpire={() => onExpire(r.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function FloatingItem({
  reaction, onExpire,
}: {
  reaction: { id: string; emoji: string };
  onExpire: () => void;
}) {
  // Random horizontal start position (10% – 90%)
  const startXRef = useRef<number>(10 + Math.random() * 80);
  const driftRef = useRef<number>((Math.random() - 0.5) * 20);
  const expireRef = useRef(onExpire);
  useEffect(() => { expireRef.current = onExpire; }, [onExpire]);

  useEffect(() => {
    const t = setTimeout(() => expireRef.current(), 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      initial={{ y: "85vh", x: 0, opacity: 0, scale: 0.5 }}
      animate={{
        y: "10vh",
        x: driftRef.current,
        opacity: [0, 1, 1, 0],
        scale: [0.5, 1.2, 1.4, 0.9],
        rotate: [0, -10, 12, -6, 0],
      }}
      transition={{ duration: 3, ease: "easeOut" }}
      style={{ left: `${startXRef.current}%` }}
      className="absolute text-7xl select-none drop-shadow-[0_0_30px_rgba(255,200,80,0.6)]"
    >
      {reaction.emoji}
    </motion.div>
  );
}
