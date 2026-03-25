import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useCreateGame } from "@workspace/api-client-react";
import { setSessionId, getSessionId } from "@/lib/session";
import { ArrowRight, Wallet, User, TrendingUp, Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const STARTING_AMOUNTS = [1000, 5000, 10000, 25000, 50000, 100000];

export function Landing() {
  const [, setLocation] = useLocation();
  const [name, setName] = useState("");
  const [cash, setCash] = useState<number>(10000);
  
  // Auto-redirect if session exists
  useEffect(() => {
    if (getSessionId()) {
      setLocation("/dashboard");
    }
  }, [setLocation]);

  const createGame = useCreateGame({
    mutation: {
      onSuccess: (data) => {
        setSessionId(data.sessionId);
        setLocation("/dashboard");
      }
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    createGame.mutate({
      data: {
        playerName: name.trim(),
        startingCash: cash
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={`${import.meta.env.BASE_URL}images/landing-bg.png`} 
          alt="Abstract financial background" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background to-background" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-xl p-8"
      >
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 text-primary mb-6 shadow-[0_0_30px_rgba(var(--primary),0.3)]">
            <TrendingUp className="w-8 h-8" />
          </div>
          <h1 className="text-5xl font-display font-bold mb-4 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
            Future.
          </h1>
          <p className="text-lg text-muted-foreground">
            Master the market. Practice investing with real mechanics, zero risk.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-3xl space-y-8">
          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <User className="w-4 h-4" />
              Trader Alias
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. WallStreetWhale"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-white/20"
              required
              maxLength={20}
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              Starting Capital
            </label>
            <div className="grid grid-cols-3 gap-3">
              {STARTING_AMOUNTS.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => setCash(amount)}
                  className={`py-3 rounded-xl border font-financial transition-all ${
                    cash === amount
                      ? "bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(var(--primary),0.2)]"
                      : "bg-white/5 border-white/5 text-muted-foreground hover:bg-white/10"
                  }`}
                >
                  {formatCurrency(amount).replace('.00', '')}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!name.trim() || createGame.isPending}
            className="w-full py-4 rounded-xl bg-white text-black font-bold text-lg hover:bg-white/90 transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
          >
            {createGame.isPending ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                Initialize Terminal <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
