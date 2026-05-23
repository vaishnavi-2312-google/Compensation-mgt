'use client';

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { formatCurrency } from '@/lib/utils';

interface ComparisonBarsProps {
  companyA: {
    name: string;
    level: string;
    base: number;
    stock: number;
    bonus: number;
    totalCompensation: number;
  };
  companyB: {
    name: string;
    level: string;
    base: number;
    stock: number;
    bonus: number;
    totalCompensation: number;
  };
}

export default function ComparisonBars({ companyA, companyB }: ComparisonBarsProps) {
  // Map data into chart structure
  const data = [
    {
      category: 'Base Salary',
      [companyA.name]: companyA.base,
      [companyB.name]: companyB.base,
    },
    {
      category: 'Stock / yr',
      [companyA.name]: companyA.stock,
      [companyB.name]: companyB.stock,
    },
    {
      category: 'Bonus / yr',
      [companyA.name]: companyA.bonus,
      [companyB.name]: companyB.bonus,
    },
    {
      category: 'Total Comp',
      [companyA.name]: companyA.totalCompensation,
      [companyB.name]: companyB.totalCompensation,
    },
  ];

  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-border-custom bg-bg-secondary p-3 shadow-md">
          <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">{label}</p>
          <div className="mt-1.5 space-y-1">
            {payload.map((p: any) => (
              <p key={p.name} className="text-sm font-bold" style={{ color: p.color }}>
                {p.name}: {formatCurrency(p.value)}
              </p>
            ))}
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
          barGap={4}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis
            dataKey="category"
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
          <Legend
            verticalAlign="top"
            height={36}
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '12px', paddingBottom: '10px' }}
          />
          <Bar
            dataKey={companyA.name}
            fill="#7C5CFF"
            radius={[4, 4, 0, 0]}
            maxBarSize={35}
          />
          <Bar
            dataKey={companyB.name}
            fill="#22C55E"
            radius={[4, 4, 0, 0]}
            maxBarSize={35}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
