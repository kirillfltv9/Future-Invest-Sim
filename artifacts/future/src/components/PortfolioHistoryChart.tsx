import { useMemo } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";

export interface ValuePoint {
  round: number;
  totalValue: number;
}

interface Props {
  history: ValuePoint[];
  startingCash: number;
  className?: string;
}

export function PortfolioHistoryChart({ history, startingCash, className }: Props) {
  const data = useMemo(
    () => history.map((p) => ({ ...p, label: p.round === 0 ? "Start" : `R${p.round}` })),
    [history],
  );

  const last = history[history.length - 1]?.totalValue ?? startingCash;
  const isPositive = last >= startingCash;
  const stroke = isPositive ? "rgb(52, 211, 153)" : "rgb(248, 113, 113)";
  const gainPct = ((last - startingCash) / startingCash) * 100;

  return (
    <div className={cn("glass-panel rounded-3xl p-5", className)}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Portfolio Trajectory
          </h3>
          <div className="text-xs text-muted-foreground mt-0.5">
            Your total value across each round
          </div>
        </div>
        <div
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold",
            isPositive ? "bg-emerald-500/15 text-emerald-300" : "bg-red-500/15 text-red-300",
          )}
        >
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {isPositive ? "+" : ""}
          {gainPct.toFixed(1)}%
        </div>
      </div>

      <div className="h-[180px] w-full">
        {data.length < 2 ? (
          <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
            Chart will appear once the first round completes
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="mpPortfolioFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={stroke} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={stroke} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 11 }}
                dy={6}
              />
              <YAxis hide domain={["auto", "auto"]} />
              <ReferenceLine
                y={startingCash}
                stroke="rgba(255,255,255,0.18)"
                strokeDasharray="4 4"
              />
              <Tooltip
                cursor={{ stroke: "rgba(255,255,255,0.2)", strokeWidth: 1 }}
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;
                  const p = payload[0].payload as { round: number; totalValue: number };
                  const delta = p.totalValue - startingCash;
                  const pct = (delta / startingCash) * 100;
                  return (
                    <div className="glass-panel px-3 py-2 rounded-lg border border-white/10 shadow-xl">
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">
                        {p.round === 0 ? "Start" : `Round ${p.round}`}
                      </div>
                      <div className="text-base font-bold text-financial">
                        {formatCurrency(p.totalValue)}
                      </div>
                      <div
                        className={cn(
                          "text-xs font-semibold",
                          delta >= 0 ? "text-emerald-300" : "text-red-300",
                        )}
                      >
                        {delta >= 0 ? "+" : ""}
                        {pct.toFixed(2)}%
                      </div>
                    </div>
                  );
                }}
              />
              <Area
                type="monotone"
                dataKey="totalValue"
                stroke={stroke}
                strokeWidth={2.25}
                fill="url(#mpPortfolioFill)"
                isAnimationActive
                animationDuration={500}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
