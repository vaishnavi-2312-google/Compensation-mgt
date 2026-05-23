import { formatCurrency } from '@/lib/utils';

interface CompensationBarProps {
  base: number; // in thousands
  bonus: number; // in thousands
  stock: number; // in thousands
  compact?: boolean;
}

export default function CompensationBar({ base, bonus, stock, compact = false }: CompensationBarProps) {
  const total = base + bonus + stock;
  if (total === 0) return null;

  const basePct = (base / total) * 100;
  const bonusPct = (bonus / total) * 100;
  const stockPct = (stock / total) * 100;

  if (compact) {
    return (
      <div className="w-full">
        {/* Visual Bar Stack */}
        <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-hover-custom">
          {base > 0 && (
            <div
              className="h-full bg-accent-primary transition-all duration-300"
              style={{ width: `${basePct}%` }}
              title={`Base: ${formatCurrency(base)} (${basePct.toFixed(0)}%)`}
            />
          )}
          {stock > 0 && (
            <div
              className="h-full bg-accent-secondary transition-all duration-300"
              style={{ width: `${stockPct}%` }}
              title={`Stock: ${formatCurrency(stock)} (${stockPct.toFixed(0)}%)`}
            />
          )}
          {bonus > 0 && (
            <div
              className="h-full bg-warning transition-all duration-300"
              style={{ width: `${bonusPct}%` }}
              title={`Bonus: ${formatCurrency(bonus)} (${bonusPct.toFixed(0)}%)`}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Visual Bar Stack */}
      <div className="flex h-3 w-full overflow-hidden rounded-md bg-hover-custom">
        {base > 0 && (
          <div
            className="h-full bg-accent-primary transition-all duration-300"
            style={{ width: `${basePct}%` }}
          />
        )}
        {stock > 0 && (
          <div
            className="h-full bg-accent-secondary transition-all duration-300"
            style={{ width: `${stockPct}%` }}
          />
        )}
        {bonus > 0 && (
          <div
            className="h-full bg-warning transition-all duration-300"
            style={{ width: `${bonusPct}%` }}
          />
        )}
      </div>

      {/* Legend & Breakdown */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-secondary">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-accent-primary" />
          <span>Base: <strong className="text-text-primary">{formatCurrency(base)}</strong> ({basePct.toFixed(0)}%)</span>
        </div>
        {stock > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-accent-secondary" />
            <span>Stock: <strong className="text-text-primary">{formatCurrency(stock)}</strong> ({stockPct.toFixed(0)}%)</span>
          </div>
        )}
        {bonus > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-warning" />
            <span>Bonus: <strong className="text-text-primary">{formatCurrency(bonus)}</strong> ({bonusPct.toFixed(0)}%)</span>
          </div>
        )}
      </div>
    </div>
  );
}
