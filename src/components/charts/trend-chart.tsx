'use client';

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { formatCurrency } from '@/lib/utils';

interface ProgressionPoint {
  level: string;
  yoe: number;
  base: number;
  stock: number;
  bonus: number;
  totalCompensation: number;
}

interface TrendChartProps {
  data: ProgressionPoint[];
}

export default function TrendChart({ data }: TrendChartProps) {
  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-border-custom bg-bg-secondary p-3 shadow-md">
          <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Level: {label}</p>
          <div className="mt-1.5 space-y-1">
            <p className="text-sm font-bold text-accent-primary">
              Total Comp: {formatCurrency(payload[0].value)}
            </p>
            <p className="text-xs text-text-secondary">
              Base Salary: {formatCurrency(payload[1].value)}
            </p>
            <p className="text-xs text-text-secondary">
              Stock Grant: {formatCurrency(payload[2].value)}
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
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="progressionGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7C5CFF" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#7C5CFF" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis
            dataKey="level"
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
          <Tooltip content={customTooltip} />
          <Legend
            verticalAlign="top"
            height={36}
            iconType="circle"
            iconSize={6}
            wrapperStyle={{ fontSize: '11px', color: '#94A3B8' }}
          />
          <Area
            type="monotone"
            dataKey="totalCompensation"
            name="Total Comp"
            stroke="#7C5CFF"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#progressionGrad)"
          />
          <Area
            type="monotone"
            dataKey="base"
            name="Base Salary"
            stroke="#3B82F6"
            strokeWidth={1.5}
            fill="none"
            strokeDasharray="4 4"
          />
          <Area
            type="monotone"
            dataKey="stock"
            name="Stock / yr"
            stroke="#22C55E"
            strokeWidth={1.5}
            fill="none"
            strokeDasharray="4 4"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
