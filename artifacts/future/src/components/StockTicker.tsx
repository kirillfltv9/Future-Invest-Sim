import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { PriceTick } from "@/lib/multiplayerSocket";
import { cn } from "@/lib/utils";

interface Props {
  prices: PriceTick[];
  className?: string;
  speed?: number; // seconds for one full loop
}

function formatPrice(n: number): string {
  if (n >= 1000) return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
  if (n >= 100)  return n.toFixed(1);
  return n.toFixed(2);
}

function TickerItem({ tick }: { tick: PriceTick }) {
  const positive = tick.changePercent > 0.001;
  const negative = tick.changePercent < -0.001;
  const Icon = positive ? TrendingUp : negative ? TrendingDown : Minus;
  const color = positive ? "text-emerald-400" : negative ? "text-red-400" : "text-zinc-400";

  return (
    <div className="inline-flex items-center gap-2 px-4 py-1.5 mx-1 rounded-md bg-white/[0.02] border border-white/5 whitespace-nowrap">
      <span className="font-mono font-bold text-sm text-foreground tracking-wider">{tick.ticker}</span>
      <span className="font-mono text-sm text-foreground/90">${formatPrice(tick.price)}</span>
      <span className={cn("flex items-center gap-0.5 font-mono text-xs font-semibold", color)}>
        <Icon className="w-3 h-3" strokeWidth={2.5} />
        {positive && "+"}
        {tick.changePercent.toFixed(2)}%
      </span>
    </div>
  );
}

/** Horizontal scrolling stock ticker tape — financial-terminal style. */
export function StockTicker({ prices, className, speed = 60 }: Props) {
  if (prices.length === 0) return null;

  // Duplicate the row so the seamless loop has continuous content.
  const row = (
    <div className="inline-flex items-center">
      {prices.map((p) => (
        <TickerItem key={p.ticker} tick={p} />
      ))}
    </div>
  );

  return (
    <div
      className={cn(
        "relative overflow-hidden border-y border-white/5 bg-gradient-to-b from-black/60 to-black/40 backdrop-blur-md",
        className,
      )}
    >
      {/* Edge fade masks */}
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      <motion.div
        className="flex items-center py-2"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      >
        {row}
        {row}
      </motion.div>
    </div>
  );
}
