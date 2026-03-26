import { useState } from "react";
import { StockInfo, StockPrice, StockHolding } from "@workspace/api-client-react";
import { formatCurrency, formatPercent, getProfitLossColor, getProfitLossBg, cn } from "@/lib/utils";
import { TradeModal } from "./TradeModal";
import { Search, TrendingUp, TrendingDown, Flame, ArrowUpDown } from "lucide-react";

interface MarketPanelProps {
  stocks: StockInfo[];
  prices: StockPrice[];
  holdings: StockHolding[];
  cashBalance: number;
  sessionId: string;
  volatilityMultiplier?: number;
}

type SortMode = "gainers" | "losers" | "default";

export function MarketPanel({ stocks, prices, holdings, cashBalance, sessionId, volatilityMultiplier = 1.0 }: MarketPanelProps) {
  const [search, setSearch] = useState("");
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>("gainers");

  const priceMap = new Map(prices.map(p => [p.ticker, p]));
  const holdingMap = new Map(holdings.map(h => [h.ticker, h]));

  const searchFiltered = stocks.filter(s =>
    s.ticker.toLowerCase().includes(search.toLowerCase()) ||
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...searchFiltered].sort((a, b) => {
    const pa = priceMap.get(a.ticker);
    const pb = priceMap.get(b.ticker);
    if (!pa || !pb) return 0;
    if (sortMode === "gainers") return pb.changePercent - pa.changePercent;
    if (sortMode === "losers") return pa.changePercent - pb.changePercent;
    return 0;
  });

  const gainers = sorted.filter(s => (priceMap.get(s.ticker)?.changePercent ?? 0) > 0);
  const neutral = sorted.filter(s => (priceMap.get(s.ticker)?.changePercent ?? 0) === 0);
  const losers = sorted.filter(s => (priceMap.get(s.ticker)?.changePercent ?? 0) < 0);

  const displayList = sortMode === "gainers"
    ? [...gainers, ...neutral, ...losers]
    : sortMode === "losers"
    ? [...losers, ...neutral, ...gainers]
    : sorted;

  const selectedStockInfo = selectedTicker ? stocks.find(s => s.ticker === selectedTicker) : null;
  const selectedStockPrice = selectedTicker ? priceMap.get(selectedTicker) : null;

  const tabs: { id: SortMode; label: string; icon: React.ReactNode }[] = [
    { id: "gainers", label: "Gainers", icon: <Flame className="w-3 h-3" /> },
    { id: "default", label: "All", icon: <ArrowUpDown className="w-3 h-3" /> },
    { id: "losers", label: "Losers", icon: <TrendingDown className="w-3 h-3" /> },
  ];

  return (
    <div className="flex flex-col h-full bg-black/20 rounded-2xl border border-white/5 overflow-hidden">
      <div className="p-4 border-b border-white/5 bg-white/5 backdrop-blur-md sticky top-0 z-10 space-y-3">
        <h3 className="text-lg font-display font-semibold">Market</h3>

        {/* Tabs */}
        <div className="flex gap-1 bg-black/30 rounded-lg p-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setSortMode(tab.id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-semibold transition-all",
                sortMode === tab.id
                  ? tab.id === "gainers"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : tab.id === "losers"
                    ? "bg-red-500/20 text-red-400 border border-red-500/30"
                    : "bg-white/10 text-foreground border border-white/10"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.icon}
              {tab.label}
              {tab.id === "gainers" && gainers.length > 0 && (
                <span className="ml-0.5 px-1 py-0 rounded text-[9px] bg-emerald-500/30 text-emerald-400">
                  {gainers.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search symbols or names..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {displayList.map((stock, idx) => {
          const price = priceMap.get(stock.ticker);
          const holding = holdingMap.get(stock.ticker);
          if (!price) return null;

          const isPositive = price.changePercent > 0;
          const isNeutral = price.changePercent === 0;
          const isTopGainer = isPositive && sortMode === "gainers" && idx < 3;

          // Max potential daily downside based on stock volatility × level multiplier
          const baseVol = (stock as StockInfo & { volatility?: number }).volatility ?? 0.02;
          const maxDownPct = Math.min(99, baseVol * volatilityMultiplier * 1.96 * 100);
          const downsideLabel = maxDownPct < 1
            ? `▼ ${maxDownPct.toFixed(2)}%`
            : maxDownPct < 10
            ? `▼ ${maxDownPct.toFixed(1)}%`
            : `▼ ${Math.round(maxDownPct)}%`;

          return (
            <div
              key={stock.ticker}
              onClick={() => setSelectedTicker(stock.ticker)}
              className={cn(
                "group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all",
                isTopGainer
                  ? "bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/10"
                  : "hover:bg-white/5"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center font-display font-bold text-sm relative",
                  getProfitLossBg(price.change)
                )}>
                  {stock.ticker.substring(0, 2)}
                  {isTopGainer && (
                    <span className="absolute -top-1 -right-1 text-[8px]">🔥</span>
                  )}
                </div>
                <div>
                  <div className="font-bold text-financial flex items-center gap-1.5">
                    {stock.ticker}
                    {holding && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-primary/20 text-primary uppercase tracking-wider">
                        OWNED
                      </span>
                    )}
                    {isTopGainer && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-emerald-500/20 text-emerald-400 uppercase tracking-wider">
                        HOT
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground truncate max-w-[90px]">{stock.name}</span>
                    <span className="text-[10px] text-red-400/80 font-mono font-medium">{downsideLabel}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-medium text-financial">
                  {formatCurrency(price.price)}
                </div>
                <div className={cn(
                  "text-xs flex items-center justify-end gap-1 font-medium",
                  isNeutral ? "text-muted-foreground" : getProfitLossColor(price.change)
                )}>
                  {isPositive
                    ? <TrendingUp className="w-3 h-3" />
                    : isNeutral
                    ? null
                    : <TrendingDown className="w-3 h-3" />}
                  {isNeutral ? "–" : formatPercent(price.changePercent)}
                </div>
              </div>
            </div>
          );
        })}

        {displayList.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground text-sm">
            <Search className="w-8 h-8 mb-2 opacity-30" />
            No results found
          </div>
        )}
      </div>

      {selectedStockInfo && selectedStockPrice && (
        <TradeModal
          isOpen={!!selectedTicker}
          onClose={() => setSelectedTicker(null)}
          stockInfo={selectedStockInfo}
          stockPrice={selectedStockPrice}
          holding={holdingMap.get(selectedStockInfo.ticker)}
          cashBalance={cashBalance}
          sessionId={sessionId}
        />
      )}
    </div>
  );
}
