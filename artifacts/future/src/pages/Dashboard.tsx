import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { getSessionId, clearSessionId } from "@/lib/session";
import { 
  useGetGame, 
  useListStocks, 
  useAdvanceDay,
  getGetGameQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { formatCurrency, formatPercent, getProfitLossColor, cn } from "@/lib/utils";
import { LogOut, Calendar, TrendingUp, TrendingDown, Clock, Newspaper, Loader2, AlertCircle, Zap, FastForward, RotateCcw, Trophy, ChevronRight, Star } from "lucide-react";
import { PortfolioChart } from "@/components/dashboard/PortfolioChart";
import { HoldingsList } from "@/components/dashboard/HoldingsList";
import { MarketPanel } from "@/components/dashboard/MarketPanel";

type LevelConfig = {
  name: string;
  description: string;
  targetGainPercent: number;
  badge: string;
};

type GameWithLevel = {
  sessionId: string;
  playerName: string;
  currentDay: number;
  currentDate: string;
  startingCash: number;
  cashBalance: number;
  holdings: unknown[];
  stockPrices: unknown[];
  portfolioHistory: unknown[];
  tradeHistory: unknown[];
  totalPortfolioValue: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  marketSentiment: string;
  newsEvents: string[];
  marketMode: string;
  level: number;
  levelConfig: LevelConfig;
  levelGainPercent: number;
  levelCompleted: boolean;
  isMaxLevel: boolean;
};

export function Dashboard() {
  const [, setLocation] = useLocation();
  const sessionId = getSessionId();
  const queryClient = useQueryClient();
  const [advancingNextLevel, setAdvancingNextLevel] = useState(false);
  const [showLevelComplete, setShowLevelComplete] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      setLocation("/");
    }
  }, [sessionId, setLocation]);

  const { data: rawGame, isLoading: gameLoading, error: gameError } = useGetGame(sessionId || "", {
    query: { enabled: !!sessionId, retry: false }
  });

  const game = rawGame as unknown as GameWithLevel | undefined;

  const { data: stocks = [], isLoading: stocksLoading } = useListStocks();

  const advanceDay = useAdvanceDay({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetGameQueryKey(sessionId!) });
      }
    }
  });

  const [fastForwarding, setFastForwarding] = useState(false);

  // Show level complete overlay once when condition first hits
  useEffect(() => {
    if (game?.levelCompleted === true) {
      setShowLevelComplete(true);
    }
  }, [game?.levelCompleted]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.code !== "Space") return;
      if (!showLevelComplete) return;
      if (game?.isMaxLevel === true) return;
      e.preventDefault();
      handleNextLevel();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showLevelComplete, game?.isMaxLevel, advancingNextLevel]);

  async function handleFastForward(days: number) {
    if (!game || fastForwarding || advanceDay.isPending) return;
    setFastForwarding(true);
    try {
      await fetch(`/api/game/${game.sessionId}/advance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ days }),
      });
      queryClient.invalidateQueries({ queryKey: getGetGameQueryKey(sessionId!) });
    } finally {
      setFastForwarding(false);
    }
  }

  async function handleNextLevel() {
    if (!game || advancingNextLevel) return;
    setAdvancingNextLevel(true);
    try {
      await fetch(`/api/game/${game.sessionId}/next-level`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      queryClient.invalidateQueries({ queryKey: getGetGameQueryKey(sessionId!) });
      setShowLevelComplete(false);
    } finally {
      setAdvancingNextLevel(false);
    }
  }

  if (gameError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
        <AlertCircle className="w-16 h-16 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">Session Expired or Invalid</h2>
        <p className="text-muted-foreground mb-6">Could not load your game state.</p>
        <button 
          onClick={() => { clearSessionId(); setLocation("/"); }}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
        >
          Start New Game
        </button>
      </div>
    );
  }

  if (gameLoading || stocksLoading || !game) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground animate-pulse">Loading Terminal Data...</p>
      </div>
    );
  }

  const isPositive = game.totalGainLoss >= 0;
  const level = game.level ?? 1;
  const levelConfig: LevelConfig = game.levelConfig ?? {
    name: "Tutorial",
    badge: "🌱",
    targetGainPercent: 10,
    description: "Learn the basics.",
  };
  const levelProgress = levelConfig.targetGainPercent > 0
    ? Math.min(100, Math.max(0, ((game.levelGainPercent ?? 0) / levelConfig.targetGainPercent) * 100))
    : 0;
  const isBusy = advanceDay.isPending || fastForwarding;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col overflow-hidden">

      {/* Level Complete Overlay */}
      <AnimatePresence>
        {showLevelComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 260 }}
              className="relative bg-[#0d1117] border border-white/10 rounded-3xl p-8 max-w-md w-full mx-4 text-center shadow-2xl overflow-hidden"
            >
              {/* Glow */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-yellow-400/20 blur-3xl rounded-full" />
              </div>

              <div className="relative z-10">
                <div className="text-6xl mb-4 animate-bounce">🏆</div>
                <div className="text-xs uppercase tracking-widest text-yellow-400 font-semibold mb-2">Level Complete</div>
                <h2 className="text-3xl font-display font-bold mb-1">
                  {levelConfig.badge} {levelConfig.name}
                </h2>
                <p className="text-muted-foreground text-sm mb-6">
                  You grew your portfolio by{" "}
                  <span className="text-emerald-400 font-bold">+{(game.levelGainPercent ?? 0).toFixed(1)}%</span>
                  {" "}— target was +{levelConfig.targetGainPercent}%
                </p>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-white/5 rounded-xl p-3">
                    <div className="text-xs text-muted-foreground mb-1">Portfolio Value</div>
                    <div className="font-display font-bold text-lg">{formatCurrency(game.totalPortfolioValue)}</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3">
                    <div className="text-xs text-muted-foreground mb-1">Days Played</div>
                    <div className="font-display font-bold text-lg">Day {game.currentDay}</div>
                  </div>
                </div>

                {game.isMaxLevel === true ? (
                  <div className="space-y-3">
                    <div className="p-4 rounded-xl bg-yellow-400/10 border border-yellow-400/20 text-yellow-300 text-sm font-medium">
                      ☄️ You've conquered all 1000 levels. You are truly Omniscient.
                    </div>
                    <button
                      onClick={() => setShowLevelComplete(false)}
                      className="w-full px-6 py-3 rounded-xl font-semibold bg-white/10 hover:bg-white/15 transition-colors"
                    >
                      Keep Playing
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Preview next level */}
                    <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-left text-sm">
                      <div className="text-xs text-muted-foreground mb-0.5">Next up — Level {level + 1}</div>
                      <div className="font-semibold text-foreground">Harder conditions, higher target</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        You'll restart with your original {formatCurrency(game.startingCash).replace(".00", "")} — clean slate, new challenge.
                      </div>
                    </div>
                    <button
                      onClick={handleNextLevel}
                      disabled={advancingNextLevel}
                      className="w-full px-6 py-3 rounded-xl font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.4)] disabled:opacity-60"
                    >
                      {advancingNextLevel ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          Next Level <ChevronRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                    {!advancingNextLevel && (
                      <p className="text-center text-xs text-muted-foreground/50">
                        or press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/60 font-mono text-[10px]">Space</kbd>
                      </p>
                    )}
                    <button
                      onClick={() => setShowLevelComplete(false)}
                      className="w-full px-4 py-2 rounded-xl text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Keep playing this level
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Navigation Bar */}
      <header className="h-16 border-b border-white/5 bg-black/20 backdrop-blur-md flex items-center justify-between px-6 shrink-0 sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <div className="font-display font-bold text-xl tracking-tight flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Future.
          </div>
          <div className="h-6 w-px bg-white/10" />

          {/* Level badge */}
          <button
            onClick={() => (game.levelCompleted === true) && setShowLevelComplete(true)}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border transition-all",
              game.levelCompleted === true
                ? "border-yellow-400/50 bg-yellow-400/10 text-yellow-300 cursor-pointer hover:bg-yellow-400/20"
                : "border-white/10 bg-white/5 text-foreground cursor-default"
            )}
          >
            <span>Lv {level}</span>
            <span className="text-muted-foreground font-normal hidden sm:inline">· {levelConfig.name}</span>
            {game.levelCompleted === true && <Trophy className="w-3 h-3 text-yellow-400 ml-0.5" />}
          </button>

          <div className="h-6 w-px bg-white/10" />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span className="font-medium text-foreground">Day {game.currentDay}</span>
            <span className="opacity-60 hidden sm:inline">({game.currentDate})</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 text-sm border border-white/5">
            <span className="text-muted-foreground">Sentiment:</span>
            <span className={`font-medium capitalize ${
              game.marketSentiment === 'bullish' ? 'text-success' : 
              game.marketSentiment === 'bearish' ? 'text-destructive' : 'text-primary'
            }`}>
              {game.marketSentiment}
            </span>
          </div>
          
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
            <button
              onClick={() => advanceDay.mutate({ sessionId: game.sessionId })}
              disabled={isBusy}
              title="Advance 1 Day"
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-lg bg-transparent hover:bg-white/10 text-foreground transition-all disabled:opacity-50"
            >
              {advanceDay.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Clock className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">+1</span>
            </button>
            <button
              onClick={() => handleFastForward(5)}
              disabled={isBusy}
              title="Fast Forward 5 Days"
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-[0_0_12px_rgba(59,130,246,0.35)] disabled:opacity-50"
            >
              {fastForwarding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
              5x
            </button>
            <button
              onClick={() => handleFastForward(30)}
              disabled={isBusy}
              title="Skip 1 Month (30 Days)"
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-lg bg-transparent hover:bg-white/10 text-muted-foreground transition-all disabled:opacity-50"
            >
              {fastForwarding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FastForward className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">1M</span>
            </button>
          </div>
          
          <button
            onClick={() => { clearSessionId(); setLocation("/"); }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-lg border border-white/10 text-muted-foreground hover:text-destructive hover:border-destructive/40 hover:bg-destructive/10 transition-all"
            title="Restart Game"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restart
          </button>
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="flex-1 overflow-hidden p-4 md:p-6">
        <div className="h-full max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Portfolio & Holdings (Spans 8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6 overflow-y-auto pr-2 pb-20 lg:pb-0">
            
            {/* Portfolio Hero Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel rounded-3xl p-6 md:p-8 relative overflow-hidden"
            >
              <div className={`absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[100px] opacity-20 pointer-events-none ${
                isPositive ? 'bg-success' : 'bg-destructive'
              }`} />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                <div className="space-y-1">
                  <div className="text-muted-foreground font-medium text-sm">Total Value</div>
                  <div className="text-4xl md:text-5xl font-display font-bold text-financial tracking-tight">
                    {formatCurrency(game.totalPortfolioValue)}
                  </div>
                  <div className={`flex items-center gap-1 font-medium mt-2 ${getProfitLossColor(game.totalGainLoss)}`}>
                    {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    <span className="text-financial">{formatCurrency(Math.abs(game.totalGainLoss))}</span>
                    <span className="text-sm opacity-80">({formatPercent(game.totalGainLossPercent)})</span>
                    <span className="text-muted-foreground text-xs font-sans ml-1 uppercase">ALL TIME</span>
                  </div>
                </div>

                <div className="space-y-1 md:border-l border-white/10 md:pl-6">
                  <div className="text-muted-foreground font-medium text-sm">Available Cash</div>
                  <div className="text-2xl md:text-3xl font-display font-bold text-financial">
                    {formatCurrency(game.cashBalance)}
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    Started with {formatCurrency(game.startingCash)}
                  </div>
                </div>

                <div className="space-y-1 md:border-l border-white/10 md:pl-6">
                  <div className="text-muted-foreground font-medium text-sm">Invested</div>
                  <div className="text-2xl md:text-3xl font-display font-bold text-financial">
                    {formatCurrency(game.totalPortfolioValue - game.cashBalance)}
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    Across {game.holdings.length} assets
                  </div>
                </div>
              </div>

              {/* Level Progress Bar */}
              <div className="relative z-10 mt-6 pt-5 border-t border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-base">{levelConfig.badge}</span>
                    <span className="font-semibold text-foreground">Level {level} — {levelConfig.name}</span>
                    <span className="text-muted-foreground hidden sm:inline">· {levelConfig.description}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm shrink-0">
                    <span className={cn(
                      "font-bold font-display",
                      (game.levelGainPercent ?? 0) >= 0 ? "text-emerald-400" : "text-red-400"
                    )}>
                      {(game.levelGainPercent ?? 0) >= 0 ? "+" : ""}{(game.levelGainPercent ?? 0).toFixed(1)}%
                    </span>
                    <span className="text-muted-foreground">/ +{levelConfig.targetGainPercent}% goal</span>
                  </div>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className={cn(
                      "h-full rounded-full transition-all",
                      game.levelCompleted === true
                        ? "bg-gradient-to-r from-yellow-400 to-yellow-500"
                        : levelProgress > 60
                        ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
                        : levelProgress > 20
                        ? "bg-gradient-to-r from-primary to-blue-400"
                        : "bg-gradient-to-r from-white/20 to-white/30"
                    )}
                    initial={{ width: 0 }}
                    animate={{ width: `${levelProgress}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
                {game.levelCompleted === true && (
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1.5 text-yellow-400 text-sm font-semibold">
                      <Star className="w-3.5 h-3.5 fill-yellow-400" />
                      Level Complete!
                    </div>
                    {game.isMaxLevel !== true && (
                      <button
                        onClick={() => setShowLevelComplete(true)}
                        className="text-xs px-3 py-1 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors font-semibold flex items-center gap-1"
                      >
                        Next Level <ChevronRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Chart */}
              <PortfolioChart 
                history={game.portfolioHistory} 
                totalGainLossPercent={game.totalGainLossPercent} 
              />
            </motion.div>

            {/* News Ticker */}
            {game.newsEvents.length > 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-black/30 border border-white/5 rounded-2xl p-4 flex items-start gap-4"
              >
                <div className="shrink-0 p-2 bg-white/5 rounded-lg text-muted-foreground">
                  <Newspaper className="w-5 h-5" />
                </div>
                <div className="flex-1 space-y-2">
                  <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Market News</h4>
                  <ul className="space-y-1">
                    {game.newsEvents.map((news, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-primary/50 shrink-0" />
                        {news}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}

            {/* Holdings */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-panel rounded-3xl overflow-hidden flex-1 min-h-[300px]"
            >
              <div className="p-5 border-b border-white/5">
                <h3 className="text-xl font-display font-semibold">Current Holdings</h3>
              </div>
              <HoldingsList holdings={game.holdings as Parameters<typeof HoldingsList>[0]["holdings"]} prices={game.stockPrices as Parameters<typeof HoldingsList>[0]["prices"]} />
            </motion.div>

          </div>

          {/* Right Column: Market (Spans 4 cols) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-4 h-full hidden lg:block"
          >
            <MarketPanel 
              stocks={stocks} 
              prices={game.stockPrices as Parameters<typeof MarketPanel>[0]["prices"]}
              holdings={game.holdings as Parameters<typeof MarketPanel>[0]["holdings"]}
              cashBalance={game.cashBalance}
              sessionId={game.sessionId}
              volatilityMultiplier={levelConfig.volatilityMultiplier}
            />
          </motion.div>

        </div>
      </main>
      
      {/* Mobile Market Panel */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-white/10 p-4 z-50 h-[50vh] overflow-y-auto">
        <MarketPanel 
          stocks={stocks} 
          prices={game.stockPrices as Parameters<typeof MarketPanel>[0]["prices"]}
          holdings={game.holdings as Parameters<typeof MarketPanel>[0]["holdings"]}
          cashBalance={game.cashBalance}
          sessionId={game.sessionId}
          volatilityMultiplier={levelConfig.volatilityMultiplier}
        />
      </div>

    </div>
  );
}
