'use client';

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { formatCurrency } from '@/lib/utils';

interface DistributionData {
  company: string;
  medianTC: number;
  base: number;
}

interface DistributionChartProps {
  data: DistributionData[];
}

export default function DistributionChart({ data }: DistributionChartProps) {
  // Format tooltip values
  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-border-custom bg-bg-secondary p-3 shadow-md">
          <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">{label}</p>
          <div className="mt-1.5 space-y-1">
            <p className="text-sm font-bold text-accent-primary">
              Total Comp: {formatCurrency(payload[0].value)}
            </p>
            {payload[1] && (
              <p className="text-xs text-text-secondary">
                Base Salary: {formatCurrency(payload[1].value)}
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          barGap={6}
        >
          <defs>
            <linearGradient id="tcGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7C5CFF" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#7C5CFF" stopOpacity={0.15} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis
            dataKey="company"
            stroke="#94A3B8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            dy={8}
          />
          <YAxis
            stroke="#94A3B8"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `$${v}k`}
          />
          <Tooltip content={customTooltip} cursor={{ fill: 'rgba(255, 255, 255, 0.02)' }} />
          <Bar
            dataKey="medianTC"
            name="Total Comp"
            fill="url(#tcGrad)"
            radius={[4, 4, 0, 0]}
            maxBarSize={45}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
