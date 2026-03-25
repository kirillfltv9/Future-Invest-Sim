import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { getSessionId, clearSessionId } from "@/lib/session";
import { 
  useGetGame, 
  useListStocks, 
  useAdvanceDay,
  getGetGameQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { formatCurrency, formatPercent, getProfitLossColor } from "@/lib/utils";
import { LogOut, Calendar, TrendingUp, TrendingDown, Clock, Newspaper, Loader2, AlertCircle, Zap, FastForward } from "lucide-react";
import { PortfolioChart } from "@/components/dashboard/PortfolioChart";
import { HoldingsList } from "@/components/dashboard/HoldingsList";
import { MarketPanel } from "@/components/dashboard/MarketPanel";

export function Dashboard() {
  const [, setLocation] = useLocation();
  const sessionId = getSessionId();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!sessionId) {
      setLocation("/");
    }
  }, [sessionId, setLocation]);

  const { data: game, isLoading: gameLoading, error: gameError } = useGetGame(sessionId || "", {
    query: { enabled: !!sessionId, retry: false }
  });

  const { data: stocks = [], isLoading: stocksLoading } = useListStocks();

  const advanceDay = useAdvanceDay({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetGameQueryKey(sessionId!) });
      }
    }
  });

  const [fastForwarding, setFastForwarding] = useState(false);

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

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="h-16 border-b border-white/5 bg-black/20 backdrop-blur-md flex items-center justify-between px-6 shrink-0 sticky top-0 z-40">
        <div className="flex items-center gap-6">
          <div className="font-display font-bold text-xl tracking-tight flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Future.
          </div>
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
              disabled={advanceDay.isPending || fastForwarding}
              title="Advance 1 Day"
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-lg bg-transparent hover:bg-white/10 text-foreground transition-all disabled:opacity-50"
            >
              {advanceDay.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Clock className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">+1</span>
            </button>
            <button
              onClick={() => handleFastForward(5)}
              disabled={advanceDay.isPending || fastForwarding}
              title="Fast Forward 5 Days"
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-[0_0_12px_rgba(59,130,246,0.35)] disabled:opacity-50"
            >
              {fastForwarding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
              5x
            </button>
            <button
              onClick={() => handleFastForward(30)}
              disabled={advanceDay.isPending || fastForwarding}
              title="Skip 1 Month (30 Days)"
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-lg bg-transparent hover:bg-white/10 text-muted-foreground transition-all disabled:opacity-50"
            >
              {fastForwarding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FastForward className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">1M</span>
            </button>
          </div>
          
          <button 
            onClick={() => { clearSessionId(); setLocation("/"); }}
            className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
            title="End Session"
          >
            <LogOut className="w-5 h-5" />
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
              {/* Decorative background glow based on performance */}
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
              <HoldingsList holdings={game.holdings} prices={game.stockPrices} />
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
              prices={game.stockPrices} 
              holdings={game.holdings}
              cashBalance={game.cashBalance}
              sessionId={game.sessionId}
            />
          </motion.div>

        </div>
      </main>
      
      {/* Mobile Market Panel (Overlay) - simplistic approach for mobile view */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-white/10 p-4 z-50 h-[50vh] overflow-y-auto">
         <MarketPanel 
            stocks={stocks} 
            prices={game.stockPrices} 
            holdings={game.holdings}
            cashBalance={game.cashBalance}
            sessionId={game.sessionId}
          />
      </div>

    </div>
  );
}
