import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { formatCurrency, cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import type { PriceTick, PlayerHolding } from "@/lib/multiplayerSocket";

interface MultiplayerTradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticker: string;
  stockName: string;
  price: PriceTick;
  holding: PlayerHolding | undefined;
  cashBalance: number;
  onTrade: (ticker: string, action: "buy" | "sell", shares: number) => void;
}

export function MultiplayerTradeModal({
  isOpen,
  onClose,
  ticker,
  stockName,
  price,
  holding,
  cashBalance,
  onTrade,
}: MultiplayerTradeModalProps) {
  const [action, setAction] = useState<"buy" | "sell">("buy");
  const [sharesStr, setSharesStr] = useState("1");
  const [submitting, setSubmitting] = useState(false);

  const shares = parseInt(sharesStr) || 0;
  const total = shares * price.price;
  const canAfford = cashBalance >= total;
  const hasShares = holding ? holding.shares >= shares : false;
  const isValid = shares > 0 && (action === "buy" ? canAfford : hasShares);

  const handleSubmit = () => {
    if (!isValid || submitting) return;
    setSubmitting(true);
    onTrade(ticker, action, shares);
    // Close after a short tick — server will broadcast updated state
    setTimeout(() => {
      setSubmitting(false);
      setSharesStr("1");
      onClose();
    }, 250);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${ticker} · ${stockName}`}>
      <div className="space-y-5">
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-display font-bold font-financial">
            {formatCurrency(price.price)}
          </span>
          <span
            className={cn(
              "text-sm font-mono font-medium",
              price.changePercent >= 0 ? "text-emerald-400" : "text-red-400",
            )}
          >
            {price.changePercent >= 0 ? "+" : ""}
            {price.changePercent.toFixed(2)}%
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 bg-black/30 rounded-xl p-1">
          <button
            onClick={() => setAction("buy")}
            className={cn(
              "py-2 rounded-lg text-sm font-semibold transition-all",
              action === "buy"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Buy
          </button>
          <button
            onClick={() => setAction("sell")}
            className={cn(
              "py-2 rounded-lg text-sm font-semibold transition-all",
              action === "sell"
                ? "bg-red-500/20 text-red-300 border border-red-500/30"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Sell
          </button>
        </div>

        <div>
          <label className="text-xs text-muted-foreground font-medium">Shares</label>
          <input
            type="number"
            min={1}
            value={sharesStr}
            onChange={(e) => setSharesStr(e.target.value.replace(/[^0-9]/g, ""))}
            className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-lg font-financial focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="bg-white/5 rounded-xl p-4 space-y-2 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Total</span>
            <span className="font-financial text-foreground">{formatCurrency(total)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Cash on hand</span>
            <span className="font-financial">{formatCurrency(cashBalance)}</span>
          </div>
          {holding && (
            <div className="flex justify-between text-muted-foreground">
              <span>Currently held</span>
              <span className="font-financial">{holding.shares.toFixed(2)}</span>
            </div>
          )}
          {action === "buy" && !canAfford && shares > 0 && (
            <div className="text-red-400 text-xs pt-1">Not enough cash</div>
          )}
          {action === "sell" && !hasShares && shares > 0 && (
            <div className="text-red-400 text-xs pt-1">Not enough shares</div>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!isValid || submitting}
          className={cn(
            "w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2",
            isValid && !submitting
              ? action === "buy"
                ? "bg-emerald-500 hover:bg-emerald-400 text-black"
                : "bg-red-500 hover:bg-red-400 text-white"
              : "bg-white/5 text-muted-foreground cursor-not-allowed",
          )}
        >
          {submitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            `${action === "buy" ? "Buy" : "Sell"} ${shares} share${shares === 1 ? "" : "s"}`
          )}
        </button>
      </div>
    </Modal>
  );
}
