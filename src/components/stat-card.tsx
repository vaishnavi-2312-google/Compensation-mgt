import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  icon?: ReactNode;
  className?: string;
}

export default function StatCard({
  title,
  value,
  subtitle,
  trend,
  trendDirection,
  icon,
  className,
}: StatCardProps) {
  return (
    <div className={cn('rounded-card bg-card p-6 border border-border-custom shadow-sm relative overflow-hidden', className)}>
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            {title}
          </span>
          <h3 className="text-3xl font-bold tracking-tight text-text-primary mt-1">
            {value}
          </h3>
        </div>
        {icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-bg-secondary border border-border-custom text-text-secondary">
            {icon}
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-4 flex items-center gap-2 text-xs">
          {trend && (
            <span
              className={cn(
                'inline-flex items-center gap-0.5 font-medium px-1.5 py-0.5 rounded',
                trendDirection === 'up' && 'bg-emerald-500/10 text-emerald-400',
                trendDirection === 'down' && 'bg-rose-500/10 text-rose-400',
                (!trendDirection || trendDirection === 'neutral') && 'bg-slate-500/10 text-text-secondary'
              )}
            >
              {trendDirection === 'up' && <ArrowUpRight className="h-3 w-3" />}
              {trendDirection === 'down' && <ArrowDownRight className="h-3 w-3" />}
              {trend}
            </span>
          )}
          {subtitle && <span className="text-text-secondary">{subtitle}</span>}
        </div>
      )}
    </div>
  );
}
