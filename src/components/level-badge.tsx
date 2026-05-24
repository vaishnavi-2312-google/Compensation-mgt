import { cn } from '@/lib/utils';

interface LevelBadgeProps {
  level: string;
  standardizedLevel?: string;
  className?: string;
}

export default function LevelBadge({ level, standardizedLevel, className }: LevelBadgeProps) {
  // Determine color coding based on level text or standardized level
  const lvl = (standardizedLevel || level || '').toLowerCase();
  
  let colorClasses = 'bg-slate-500/10 text-slate-700 border-slate-500/20';

  if (lvl.includes('l3') || lvl.includes('junior') || lvl.includes('e3') || lvl.includes('ict3')) {
    colorClasses = 'bg-blue-500/10 text-blue-700 border-blue-500/20';
  } else if (lvl.includes('l4') || lvl.includes('mid') || lvl.includes('e4') || lvl.includes('ict4')) {
    colorClasses = 'bg-purple-500/10 text-purple-700 border-purple-500/20';
  } else if (lvl.includes('l5') || lvl.includes('senior') || lvl.includes('e5') || lvl.includes('ict5')) {
    colorClasses = 'bg-accent-primary/10 text-accent-primary border-accent-primary/20';
  } else if (lvl.includes('l6') || lvl.includes('staff') || lvl.includes('e6') || lvl.includes('ict6')) {
    colorClasses = 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20';
  } else if (lvl.includes('l7') || lvl.includes('principal') || lvl.includes('e7') || lvl.includes('ict7') || lvl.includes('l8')) {
    colorClasses = 'bg-rose-500/10 text-rose-700 border-rose-500/20';
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-bold tracking-wide uppercase',
        colorClasses,
        className
      )}
    >
      {level}
    </span>
  );
}
