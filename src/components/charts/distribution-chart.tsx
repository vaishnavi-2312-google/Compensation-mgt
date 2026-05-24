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
        <div className="rounded-lg border border-border-custom bg-white/95 backdrop-blur-md p-3 shadow-md">
          <p className="text-xs font-bold uppercase tracking-wider text-text-secondary">{label}</p>
          <div className="mt-1.5 space-y-1">
            <p className="text-sm font-black text-accent-primary">
              Total Comp: {formatCurrency(payload[0].value)}
            </p>
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
              <stop offset="0%" stopColor="#1F2937" stopOpacity={0.85} />
              <stop offset="100%" stopColor="#1F2937" stopOpacity={0.25} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
          <XAxis
            dataKey="company"
            stroke="#737373"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            dy={8}
          />
          <YAxis
            stroke="#737373"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `$${v}k`}
          />
          <Tooltip content={customTooltip} cursor={{ fill: 'rgba(0, 0, 0, 0.01)' }} />
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
