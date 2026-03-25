import { StockHolding, StockPrice } from "@workspace/api-client-react";
import { formatCurrency, formatPercent, getProfitLossColor } from "@/lib/utils";
import { Briefcase } from "lucide-react";

interface HoldingsListProps {
  holdings: StockHolding[];
  prices: StockPrice[];
}

export function HoldingsList({ holdings, prices }: HoldingsListProps) {
  if (holdings.length === 0) {
    return (
      <div className="p-8 text-center border border-dashed border-white/10 rounded-2xl bg-black/10">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 mb-4 text-muted-foreground">
          <Briefcase className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-medium text-foreground">No Holdings Yet</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
          Explore the market panel to buy your first stock and start building your portfolio.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-muted-foreground uppercase border-b border-white/5">
          <tr>
            <th className="px-4 py-3 font-medium">Asset</th>
            <th className="px-4 py-3 font-medium text-right">Shares</th>
            <th className="px-4 py-3 font-medium text-right">Avg Cost</th>
            <th className="px-4 py-3 font-medium text-right">Current Price</th>
            <th className="px-4 py-3 font-medium text-right">Total Value</th>
            <th className="px-4 py-3 font-medium text-right">Return</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {holdings.map((holding) => {
            const price = prices.find(p => p.ticker === holding.ticker);
            const currentPrice = price?.price || holding.currentPrice;
            const currentTotal = holding.shares * currentPrice;
            const gain = currentTotal - (holding.shares * holding.avgCostBasis);
            const gainPct = gain / (holding.shares * holding.avgCostBasis);

            return (
              <tr key={holding.ticker} className="hover:bg-white/5 transition-colors group">
                <td className="px-4 py-4">
                  <div className="font-bold text-financial text-base">{holding.ticker}</div>
                </td>
                <td className="px-4 py-4 text-right text-financial font-medium">
                  {holding.shares}
                </td>
                <td className="px-4 py-4 text-right text-financial text-muted-foreground">
                  {formatCurrency(holding.avgCostBasis)}
                </td>
                <td className="px-4 py-4 text-right text-financial font-medium">
                  {formatCurrency(currentPrice)}
                </td>
                <td className="px-4 py-4 text-right text-financial font-bold text-foreground">
                  {formatCurrency(currentTotal)}
                </td>
                <td className={`px-4 py-4 text-right text-financial font-medium ${getProfitLossColor(gain)}`}>
                  <div>{formatCurrency(gain)}</div>
                  <div className="text-xs opacity-80">{formatPercent(gainPct)}</div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
