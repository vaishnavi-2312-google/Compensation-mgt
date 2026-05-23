'use client';

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface LevelDistData {
  level: string;
  count: number;
}

interface LevelDistributionProps {
  data: LevelDistData[];
}

export default function LevelDistributionChart({ data }: LevelDistributionProps) {
  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-border-custom bg-bg-secondary p-3 shadow-md">
          <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Level: {label}</p>
          <p className="text-sm font-bold text-accent-primary mt-1">
            Entries: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
          <XAxis
            type="number"
            stroke="#94A3B8"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <YAxis
            type="category"
            dataKey="level"
            stroke="#94A3B8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            dx={-4}
          />
          <Tooltip content={customTooltip} cursor={{ fill: 'rgba(255, 255, 255, 0.02)' }} />
          <Bar
            dataKey="count"
            fill="#7C5CFF"
            radius={[0, 4, 4, 0]}
            maxBarSize={20}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
