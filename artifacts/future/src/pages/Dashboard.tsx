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
import { formatCurrency, formatPercent, getProfitLossColor, setActiveCurrency, cn } from "@/lib/utils";
import { LogOut, Calendar, TrendingUp, TrendingDown, Clock, Newspaper, Loader2, AlertCircle, RotateCcw, Trophy, Save } from "lucide-react";
import { PortfolioChart } from "@/components/dashboard/PortfolioChart";
import { HoldingsList } from "@/components/dashboard/HoldingsList";
import { MarketPanel } from "@/components/dashboard/MarketPanel";
import { SaveCodeModal } from "@/components/SaveCodeModal";

type GameData = {
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
  gameWon: boolean;
  progressDays: number;
  progressPercent: number;
  yearsElapsed: number;
  totalDays: number;
  daysRemaining: number;
};

export function Dashboard() {
  const [, setLocation] = useLocation();
  const sessionId = getSessionId();
  const queryClient = useQueryClient();
  const [showWin, setShowWin] = useState(false);
  const [showSave, setShowSave] = useState(false);

  useEffect(() => {
    if (!sessionId) setLocation("/");
  }, [sessionId, setLocation]);

  const { data: rawGame, isLoading: gameLoading, error: gameError } = useGetGame(sessionId || "", {
    query: { enabled: !!sessionId, retry: false }
  });

  const game = rawGame as unknown as GameData | undefined;
  const { data: stocks = [], isLoading: stocksLoading } = useListStocks();

  const [isAdvancing5, setIsAdvancing5] = useState(false);

  const advanceDay = useAdvanceDay({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetGameQueryKey(sessionId!) });
      }
    }
  });

  const advance5Days = async () => {
    if (!game?.sessionId || isAdvancing5) return;
    setIsAdvancing5(true);
    try {
      await fetch(`/api/game/${game.sessionId}/advance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ days: 5 }),
      });
      queryClient.invalidateQueries({ queryKey: getGetGameQueryKey(sessionId!) });
    } finally {
      setIsAdvancing5(false);
    }
  };

  useEffect(() => {
    if (game?.gameWon === true) setShowWin(true);
  }, [game?.gameWon]);

  // Apply game currency synchronously so the first render uses the right symbol
  // (no flash of stale USD on resume or refresh).
  setActiveCurrency((game as { baseCurrency?: string } | undefined)?.baseCurrency ?? "USD");

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.code !== "Space" || !showWin) return;
      e.preventDefault();
      setShowWin(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showWin]);

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
  const isBusy = advanceDay.isPending || isAdvancing5;

  // Progress bar colour based on how far through the 10 years we are
  const progressColor = game.progressPercent >= 100
    ? "bg-gradient-to-r from-yellow-400 to-yellow-500"
    : game.progressPercent > 60
    ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
    : "bg-gradient-to-r from-primary to-blue-400";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col overflow-hidden">

      {/* 10-Year Win Overlay */}
      <AnimatePresence>
        {showWin && (
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
              className="relative bg-[#0d1117] border border-white/10 rounded-3xl max-w-md w-full mx-4 text-center shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-yellow-400/20 blur-3xl rounded-full" />
              </div>
              <div className="relative z-10 p-8 space-y-5">
                <div className="text-6xl animate-bounce">🏆</div>
                <div className="text-xs uppercase tracking-widest text-yellow-400 font-semibold">
                  {game.gameEra === "present" ? "2026 Complete" : game.gameEra === "future" ? "2035 Complete" : "10 Years Complete"}
                </div>
                <h2 className="text-3xl font-display font-bold">You made it.</h2>
                <p className="text-muted-foreground text-sm">
                  {game.gameEra === "present"
                    ? "You started in March 2025 and navigated the AI bubble, oil shocks, and stagflation — all the way through 2026."
                    : game.gameEra === "future"
                    ? "You started in March 2025 and survived a decade of turbulence, recovery, and transformation — all the way to March 2035."
                    : "You started in March 2015 and survived every crash, rally, pandemic, war, and revolution — all the way to March 2025."
                  }
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 rounded-xl p-3">
                    <div className="text-xs text-muted-foreground mb-1">Final Value</div>
                    <div className={cn("font-display font-bold text-lg", isPositive ? "text-emerald-400" : "text-red-400")}>
                      {formatCurrency(game.totalPortfolioValue)}
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3">
                    <div className="text-xs text-muted-foreground mb-1">Total Return</div>
                    <div className={cn("font-display font-bold text-lg", isPositive ? "text-emerald-400" : "text-red-400")}>
                      {isPositive ? "+" : ""}{game.totalGainLossPercent.toFixed(1)}%
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-400/10 to-blue-400/5 border border-emerald-400/20 text-left space-y-3">
                  <p className="text-emerald-400 font-bold text-sm">Now go start investing in real life.</p>
                  <p className="text-white/80 text-sm leading-relaxed">
                    You've trained through Brexit, COVID, the AI boom, the Ukraine war, and every major crash in between. That's not simulation experience anymore — that's genuine market instinct.
                  </p>
                  <p className="text-white/60 text-xs leading-relaxed">
                    Open a brokerage account. Start small. Diversify. Be patient. The market will be there — and now, so will you.
                  </p>
                </div>

                <button
                  onClick={() => setShowWin(false)}
                  className="w-full px-6 py-3 rounded-xl font-semibold bg-white text-black hover:bg-white/90 transition-colors"
                >
                  Keep Playing
                </button>
                <p className="text-center text-xs text-muted-foreground/50">
                  or press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/60 font-mono text-[10px]">Space</kbd> to exit
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="h-16 border-b border-white/5 bg-black/20 backdrop-blur-md flex items-center justify-between px-6 shrink-0 sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <div className="font-display font-bold text-xl tracking-tight flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Future.
          </div>
          <div className="h-6 w-px bg-white/10" />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span className="font-medium text-foreground">{game.currentDate}</span>
          </div>
          <div className="h-6 w-px bg-white/10" />
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="text-white/40">Year</span>
            <span className="font-bold text-foreground">{game.yearsElapsed}</span>
            <span className="text-white/40">of 10</span>
          </div>
          {game.gameWon && (
            <>
              <div className="h-6 w-px bg-white/10" />
              <button
                onClick={() => setShowWin(true)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border border-yellow-400/50 bg-yellow-400/10 text-yellow-300 cursor-pointer hover:bg-yellow-400/20"
              >
                <Trophy className="w-3 h-3" />
                10 Years Done!
              </button>
            </>
          )}
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

          <button
            onClick={() => advanceDay.mutate({ sessionId: game.sessionId })}
            disabled={isBusy || isAdvancing5}
            title="Advance 1 Day"
            className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-foreground transition-all disabled:opacity-50"
          >
            {advanceDay.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Clock className="w-3.5 h-3.5" />}
            Next Day
          </button>

          <button
            onClick={advance5Days}
            disabled={isBusy || isAdvancing5}
            title="Advance 5 Days"
            className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-foreground transition-all disabled:opacity-50"
          >
            {isAdvancing5 ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Clock className="w-3.5 h-3.5" />}
            +5 Days
          </button>

          <button
            onClick={() => setShowSave(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-lg border border-primary/30 text-primary hover:bg-primary/10 transition-all"
            title="Save game and get a resume code"
          >
            <Save className="w-3.5 h-3.5" />
            Save
          </button>

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

      <SaveCodeModal
        isOpen={showSave}
        onClose={() => setShowSave(false)}
        onSave={async () => {
          const res = await fetch("/api/saves/solo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId: game.sessionId }),
          });
          if (!res.ok) throw new Error("Could not save game");
          const data = await res.json();
          return data.code as string;
        }}
        onLeave={() => { clearSessionId(); setLocation("/"); }}
        leaveLabel="Save & exit"
      />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1600px] mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">

          {/* Left/Center column */}
          <div className="lg:col-span-8 space-y-5">

            {/* Portfolio Value Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel rounded-3xl p-6 relative overflow-hidden"
            >
              <div className="absolute inset-0 pointer-events-none">
                <div className={cn(
                  "absolute top-0 right-0 w-64 h-64 blur-3xl rounded-full opacity-10",
                  isPositive ? "bg-emerald-400" : "bg-red-500"
                )} />
              </div>

              <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <div className="text-muted-foreground font-medium text-sm mb-1">Total Portfolio Value</div>
                  <div className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-2">
                    {formatCurrency(game.totalPortfolioValue)}
                  </div>
                  <div className={cn(
                    "inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold",
                    isPositive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                  )}>
                    {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {isPositive ? "+" : ""}{formatCurrency(game.totalGainLoss)} ({isPositive ? "+" : ""}{game.totalGainLossPercent.toFixed(2)}%)
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

              {/* Journey Progress Bar */}
              <div className="relative z-10 mt-6 pt-5 border-t border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold text-foreground">
                      {game.gameEra === "present" ? "2025–2026 Journey" : game.gameEra === "future" ? "2025–2035 Journey" : "2015–2025 Journey"}
                    </span>
                    <span className="text-muted-foreground hidden sm:inline">
                      {game.gameEra === "present" ? "· Mar 2025 → Dec 2026" : game.gameEra === "future" ? "· Mar 2025 → Mar 2035" : "· Mar 2015 → Mar 2025"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm shrink-0 text-muted-foreground">
                    {game.gameWon ? (
                      <span className="text-yellow-400 font-bold">Complete! 🏆</span>
                    ) : (
                      <span>{(game.daysRemaining ?? 0).toLocaleString()} days remaining</span>
                    )}
                  </div>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className={cn("h-full rounded-full transition-all", progressColor)}
                    initial={{ width: 0 }}
                    animate={{ width: `${game.progressPercent}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground/50 mt-1 px-0.5">
                  {game.gameEra === "present" ? (
                    <><span>2025</span><span>Apr</span><span>Jul</span><span>Oct</span><span>2026</span><span>Dec</span></>
                  ) : game.gameEra === "future" ? (
                    <><span>2025</span><span>2027</span><span>2029</span><span>2031</span><span>2033</span><span>2035</span></>
                  ) : (
                    <><span>2015</span><span>2017</span><span>2019</span><span>2021</span><span>2023</span><span>2025</span></>
                  )}
                </div>
              </div>

              {/* Chart */}
              <PortfolioChart
                history={game.portfolioHistory}
                totalGainLossPercent={game.totalGainLossPercent}
              />
            </motion.div>

            {/* News */}
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
                      <li key={i} className={cn(
                        "text-sm flex items-center gap-2",
                        i === 0 && game.newsEvents.length > 1 && news.length > 50
                          ? "text-foreground font-medium"
                          : "text-muted-foreground"
                      )}>
                        <div className={cn(
                          "w-1 h-1 rounded-full shrink-0",
                          i === 0 && game.newsEvents.length > 1 && news.length > 50
                            ? "bg-yellow-400"
                            : "bg-primary/50"
                        )} />
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
              <HoldingsList
                holdings={game.holdings as Parameters<typeof HoldingsList>[0]["holdings"]}
                prices={game.stockPrices as Parameters<typeof HoldingsList>[0]["prices"]}
              />
            </motion.div>
          </div>

          {/* Right column: Market */}
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
        />
      </div>

    </div>
  );
}
