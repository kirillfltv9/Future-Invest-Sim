import { useState } from "react";
import { StockInfo } from "@workspace/api-client-react";
import { formatCurrency, formatPercent, getProfitLossColor, getProfitLossBg, cn } from "@/lib/utils";
import { Search, TrendingUp, TrendingDown, Flame, ArrowUpDown } from "lucide-react";
import { MultiplayerTradeModal } from "./MultiplayerTradeModal";
import type { PriceTick, PlayerHolding } from "@/lib/multiplayerSocket";

interface Props {
  stocks: StockInfo[];
  prices: PriceTick[];
  holdings: PlayerHolding[];
  cashBalance: number;
  canTrade: boolean;
  onTrade: (ticker: string, action: "buy" | "sell", shares: number) => void;
}

type SortMode = "gainers" | "losers" | "default";

export function MultiplayerMarketPanel({ stocks, prices, holdings, cashBalance, canTrade, onTrade }: Props) {
  const [search, setSearch] = useState("");
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>("gainers");

  const priceMap = new Map(prices.map((p) => [p.ticker, p]));
  const holdingMap = new Map(holdings.map((h) => [h.ticker, h]));

  const filtered = stocks.filter(
    (s) =>
      s.ticker.toLowerCase().includes(search.toLowerCase()) ||
      s.name.toLowerCase().includes(search.toLowerCase()),
  );

  const sorted = [...filtered].sort((a, b) => {
    const pa = priceMap.get(a.ticker);
    const pb = priceMap.get(b.ticker);
    if (!pa || !pb) return 0;
    if (sortMode === "gainers") return pb.changePercent - pa.changePercent;
    if (sortMode === "losers") return pa.changePercent - pb.changePercent;
    return 0;
  });

  const gainers = sorted.filter((s) => (priceMap.get(s.ticker)?.changePercent ?? 0) > 0);

  const tabs: { id: SortMode; label: string; icon: React.ReactNode }[] = [
    { id: "gainers", label: "Gainers", icon: <Flame className="w-3 h-3" /> },
    { id: "default", label: "All", icon: <ArrowUpDown className="w-3 h-3" /> },
    { id: "losers", label: "Losers", icon: <TrendingDown className="w-3 h-3" /> },
  ];

  const selectedStock = selectedTicker ? stocks.find((s) => s.ticker === selectedTicker) : null;
  const selectedPrice = selectedTicker ? priceMap.get(selectedTicker) : null;

  return (
    <div className="flex flex-col h-full bg-black/20 rounded-2xl border border-white/5 overflow-hidden">
      <div className="p-4 border-b border-white/5 bg-white/5 backdrop-blur-md sticky top-0 z-10 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-display font-semibold">Market</h3>
          {!canTrade && (
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Trading locked
            </span>
          )}
        </div>

        <div className="flex gap-1 bg-black/30 rounded-lg p-1">
          {tabs.map((tab) => (
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
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.icon}
              {tab.label}
              {tab.id === "gainers" && gainers.length > 0 && (
                <span className="ml-0.5 px-1 rounded text-[9px] bg-emerald-500/30 text-emerald-400">
                  {gainers.length}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {sorted.map((stock) => {
          const price = priceMap.get(stock.ticker);
          const holding = holdingMap.get(stock.ticker);
          if (!price) return null;
          const isPositive = price.changePercent > 0;
          const isNeutral = price.changePercent === 0;

          return (
            <div
              key={stock.ticker}
              onClick={() => canTrade && setSelectedTicker(stock.ticker)}
              className={cn(
                "flex items-center justify-between p-3 rounded-xl transition-all",
                canTrade ? "cursor-pointer hover:bg-white/5" : "opacity-70",
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center font-display font-bold text-sm",
                    getProfitLossBg(price.change),
                  )}
                >
                  {stock.ticker.substring(0, 2)}
                </div>
                <div>
                  <div className="font-bold text-financial flex items-center gap-1.5">
                    {stock.ticker}
                    {holding && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-primary/20 text-primary uppercase tracking-wider">
                        OWNED
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground truncate max-w-[120px] block">
                    {stock.name}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-financial">{formatCurrency(price.price)}</div>
                <div
                  className={cn(
                    "text-xs flex items-center justify-end gap-1 font-medium",
                    isNeutral ? "text-muted-foreground" : getProfitLossColor(price.change),
                  )}
                >
                  {isPositive ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : isNeutral ? null : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {isNeutral ? "–" : formatPercent(price.changePercent)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedStock && selectedPrice && (
        <MultiplayerTradeModal
          isOpen={!!selectedTicker}
          onClose={() => setSelectedTicker(null)}
          ticker={selectedStock.ticker}
          stockName={selectedStock.name}
          price={selectedPrice}
          holding={holdingMap.get(selectedStock.ticker)}
          cashBalance={cashBalance}
          onTrade={onTrade}
        />
      )}
    </div>
  );
}
