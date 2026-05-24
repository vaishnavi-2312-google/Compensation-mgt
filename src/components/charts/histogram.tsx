'use client';

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface HistogramData {
  range: string;
  count: number;
}

interface HistogramChartProps {
  data: HistogramData[];
}

export default function HistogramChart({ data }: HistogramChartProps) {
  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-border-custom bg-white/95 backdrop-blur-md p-3 shadow-md">
          <p className="text-xs font-bold uppercase tracking-wider text-text-secondary">Range: {label}</p>
          <p className="text-sm font-black text-accent-primary mt-1">
            Entries: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -30, bottom: 0 }}
        >
          <defs>
            <linearGradient id="histGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4B5563" stopOpacity={0.85} />
              <stop offset="100%" stopColor="#4B5563" stopOpacity={0.25} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
          <XAxis
            dataKey="range"
            stroke="#737373"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            dy={8}
          />
          <YAxis
            stroke="#737373"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip content={customTooltip} cursor={{ fill: 'rgba(0, 0, 0, 0.01)' }} />
          <Bar
            dataKey="count"
            name="Entries count"
            fill="url(#histGrad)"
            radius={[4, 4, 0, 0]}
            maxBarSize={55}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
