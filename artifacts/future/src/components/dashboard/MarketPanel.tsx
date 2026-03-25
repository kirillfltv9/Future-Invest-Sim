import { useState } from "react";
import { StockInfo, StockPrice, StockHolding } from "@workspace/api-client-react";
import { formatCurrency, formatPercent, getProfitLossColor, getProfitLossBg, cn } from "@/lib/utils";
import { TradeModal } from "./TradeModal";
import { Search, TrendingUp, TrendingDown } from "lucide-react";

interface MarketPanelProps {
  stocks: StockInfo[];
  prices: StockPrice[];
  holdings: StockHolding[];
  cashBalance: number;
  sessionId: string;
}

export function MarketPanel({ stocks, prices, holdings, cashBalance, sessionId }: MarketPanelProps) {
  const [search, setSearch] = useState("");
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);

  const priceMap = new Map(prices.map(p => [p.ticker, p]));
  const holdingMap = new Map(holdings.map(h => [h.ticker, h]));

  const filteredStocks = stocks.filter(s => 
    s.ticker.toLowerCase().includes(search.toLowerCase()) || 
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedStockInfo = selectedTicker ? stocks.find(s => s.ticker === selectedTicker) : null;
  const selectedStockPrice = selectedTicker ? priceMap.get(selectedTicker) : null;

  return (
    <div className="flex flex-col h-full bg-black/20 rounded-2xl border border-white/5 overflow-hidden">
      <div className="p-4 border-b border-white/5 bg-white/5 backdrop-blur-md sticky top-0 z-10">
        <h3 className="text-lg font-display font-semibold mb-3">Market</h3>
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

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filteredStocks.map((stock) => {
          const price = priceMap.get(stock.ticker);
          const holding = holdingMap.get(stock.ticker);
          if (!price) return null;

          const isPositive = price.change >= 0;

          return (
            <div 
              key={stock.ticker}
              onClick={() => setSelectedTicker(stock.ticker)}
              className="group flex items-center justify-between p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center font-display font-bold text-sm",
                  getProfitLossBg(price.change)
                )}>
                  {stock.ticker.substring(0, 2)}
                </div>
                <div>
                  <div className="font-bold text-financial flex items-center gap-2">
                    {stock.ticker}
                    {holding && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-primary/20 text-primary uppercase tracking-wider">
                        OWNED
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground truncate max-w-[120px]">
                    {stock.name}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-medium text-financial">
                  {formatCurrency(price.price)}
                </div>
                <div className={cn("text-xs flex items-center justify-end gap-1 font-medium", getProfitLossColor(price.change))}>
                  {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {formatPercent(price.changePercent)}
                </div>
              </div>
            </div>
          );
        })}
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
