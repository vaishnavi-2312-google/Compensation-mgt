import { formatCurrency } from '@/lib/utils';
import { motion } from 'framer-motion';

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

  // Shared motion config
  const segmentProps = {
    initial: { opacity: 0, width: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.4 },
    whileHover: { scale: 1.02 },
  };

  if (compact) {
    return (
      <div className="glass-card p-2 rounded-[var(--radius-card)]">
        {/* Visual Bar Stack */}
        <div className="flex h-2 overflow-hidden rounded-full bg-[var(--color-hover-custom)]">
          {base > 0 && (
            <motion.div
              {...segmentProps}
              style={{ width: `${basePct}%`, background: 'var(--color-accent-primary)' }}
              title={`Base: ${formatCurrency(base)} (${basePct.toFixed(0)}%)`}
            />
          )}
          {stock > 0 && (
            <motion.div
              {...segmentProps}
              style={{ width: `${stockPct}%`, background: 'var(--color-accent-secondary)' }}
              title={`Stock: ${formatCurrency(stock)} (${stockPct.toFixed(0)}%)`}
            />
          )}
          {bonus > 0 && (
            <motion.div
              {...segmentProps}
              style={{ width: `${bonusPct}%`, background: 'var(--color-highlight)' }}
              title={`Bonus: ${formatCurrency(bonus)} (${bonusPct.toFixed(0)}%)`}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2 glass-card p-3 rounded-[var(--radius-card)]">
      {/* Visual Bar Stack */}
      <div className="flex h-4 w-full overflow-hidden rounded-md bg-[var(--color-hover-custom)]">
        {base > 0 && (
          <motion.div
            {...segmentProps}
            style={{ width: `${basePct}%`, background: 'var(--color-accent-primary)' }}
          />
        )}
        {stock > 0 && (
          <motion.div
            {...segmentProps}
            style={{ width: `${stockPct}%`, background: 'var(--color-accent-secondary)' }}
          />
        )}
        {bonus > 0 && (
          <motion.div
            {...segmentProps}
            style={{ width: `${bonusPct}%`, background: 'var(--color-highlight)' }}
          />
        )}
      </div>

      {/* Legend & Breakdown */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--color-text-secondary)]">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[var(--color-accent-primary)]" />
          <span>
            Base: <strong className="text-[var(--color-text-primary)]">{formatCurrency(base)}</strong> ({basePct.toFixed(0)}%)
          </span>
        </div>
        {stock > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[var(--color-accent-secondary)]" />
            <span>
              Stock: <strong className="text-[var(--color-text-primary)]">{formatCurrency(stock)}</strong> ({stockPct.toFixed(0)}%)
            </span>
          </div>
        )}
        {bonus > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[var(--color-highlight)]" />
            <span>
              Bonus: <strong className="text-[var(--color-text-primary)]">{formatCurrency(bonus)}</strong> ({bonusPct.toFixed(0)}%)
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
