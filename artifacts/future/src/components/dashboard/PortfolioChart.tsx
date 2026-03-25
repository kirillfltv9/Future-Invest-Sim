import { useMemo } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PortfolioSnapshot } from "@workspace/api-client-react";
import { formatCurrency, getProfitLossColor } from "@/lib/utils";

interface PortfolioChartProps {
  history: PortfolioSnapshot[];
  totalGainLossPercent: number;
}

export function PortfolioChart({ history, totalGainLossPercent }: PortfolioChartProps) {
  const isPositive = totalGainLossPercent >= 0;
  
  // Custom colors based on overall performance
  const strokeColor = isPositive ? "hsl(var(--success))" : "hsl(var(--destructive))";
  const fillColor = isPositive ? "var(--color-success)" : "var(--color-destructive)";

  const formattedData = useMemo(() => {
    return history.map(point => ({
      ...point,
      displayDate: `Day ${point.day}`,
    }));
  }, [history]);

  if (!history || history.length === 0) {
    return <div className="h-64 flex items-center justify-center text-muted-foreground">No history available yet</div>;
  }

  return (
    <div className="h-[300px] w-full mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={formattedData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={strokeColor} stopOpacity={0.3} />
              <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="displayDate" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            dy={10}
            minTickGap={30}
          />
          <YAxis 
            domain={['auto', 'auto']} 
            hide 
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="glass-panel p-3 rounded-lg border border-white/10 shadow-xl">
                    <div className="text-xs text-muted-foreground mb-1">{data.date} (Day {data.day})</div>
                    <div className="text-lg font-bold text-financial">{formatCurrency(data.totalValue)}</div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="totalValue"
            stroke={strokeColor}
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorValue)"
            animationDuration={1500}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
