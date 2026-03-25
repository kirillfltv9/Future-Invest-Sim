import { useState, useMemo } from "react";
import { Modal } from "@/components/ui/Modal";
import { formatCurrency } from "@/lib/utils";
import { StockInfo, StockPrice, StockHolding, TradeRequestAction } from "@workspace/api-client-react";
import { useExecuteTrade, useGetGame } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { getGetGameQueryKey } from "@workspace/api-client-react";
import { Loader2 } from "lucide-react";

interface TradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  stockInfo: StockInfo;
  stockPrice: StockPrice;
  holding?: StockHolding;
  cashBalance: number;
  sessionId: string;
}

export function TradeModal({
  isOpen,
  onClose,
  stockInfo,
  stockPrice,
  holding,
  cashBalance,
  sessionId,
}: TradeModalProps) {
  const [action, setAction] = useState<"buy" | "sell">("buy");
  const [sharesStr, setSharesStr] = useState("1");
  const queryClient = useQueryClient();

  const shares = parseInt(sharesStr) || 0;
  const totalValue = shares * stockPrice.price;
  
  const canAfford = cashBalance >= totalValue;
  const hasEnoughShares = holding ? holding.shares >= shares : false;
  
  const isValid = shares > 0 && (action === "buy" ? canAfford : hasEnoughShares);

  const executeTrade = useExecuteTrade({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetGameQueryKey(sessionId) });
        onClose();
        setSharesStr("1");
      }
    }
  });

  const handleTrade = () => {
    if (!isValid) return;
    executeTrade.mutate({
      sessionId,
      data: {
        ticker: stockInfo.ticker,
        action: action === "buy" ? TradeRequestAction.buy : TradeRequestAction.sell,
        shares,
      }
    });
  };

  const handleSharesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setSharesStr(val);
  };

  const maxBuy = Math.floor(cashBalance / stockPrice.price);
  const maxSell = holding?.shares || 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Trade ${stockInfo.ticker}`}>
      <div className="space-y-6">
        
        {/* Header Info */}
        <div className="flex justify-between items-center bg-black/20 p-4 rounded-xl border border-white/5">
          <div>
            <div className="text-sm text-muted-foreground">{stockInfo.name}</div>
            <div className="text-2xl font-display font-semibold text-financial">
              {formatCurrency(stockPrice.price)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Your Position</div>
            <div className="font-medium text-financial">{holding?.shares || 0} shares</div>
          </div>
        </div>

        {/* Action Toggle */}
        <div className="flex p-1 bg-black/30 rounded-lg">
          <button
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
              action === "buy" ? "bg-success text-white shadow-lg" : "text-muted-foreground hover:text-white"
            }`}
            onClick={() => setAction("buy")}
          >
            Buy
          </button>
          <button
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
              action === "sell" ? "bg-destructive text-white shadow-lg" : "text-muted-foreground hover:text-white"
            }`}
            onClick={() => setAction("sell")}
            disabled={maxSell === 0}
          >
            Sell
          </button>
        </div>

        {/* Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground flex justify-between">
            <span>Shares</span>
            <span>
              {action === "buy" ? `Max: ${maxBuy}` : `Max: ${maxSell}`}
            </span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={sharesStr}
              onChange={handleSharesChange}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-xl text-financial text-right focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              placeholder="0"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              Shares
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-3 pt-4 border-t border-white/10">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Estimated Total</span>
            <span className="text-financial font-medium">{formatCurrency(totalValue)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Available Cash</span>
            <span className="text-financial font-medium">{formatCurrency(cashBalance)}</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleTrade}
          disabled={!isValid || executeTrade.isPending}
          className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-2 ${
            !isValid
              ? "bg-white/5 text-muted-foreground cursor-not-allowed"
              : action === "buy"
              ? "bg-success hover:bg-success/90 text-white shadow-lg shadow-success/20 hover:-translate-y-0.5"
              : "bg-destructive hover:bg-destructive/90 text-white shadow-lg shadow-destructive/20 hover:-translate-y-0.5"
          }`}
        >
          {executeTrade.isPending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            `Review ${action === "buy" ? "Order" : "Sale"}`
          )}
        </button>
      </div>
    </Modal>
  );
}
