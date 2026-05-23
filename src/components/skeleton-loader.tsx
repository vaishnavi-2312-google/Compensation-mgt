import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('animate-pulse rounded bg-hover-custom/60', className)} />
  );
}

export default function TableSkeleton() {
  return (
    <div className="w-full space-y-4">
      {/* Header Skeleton */}
      <div className="flex items-center space-x-4 py-2 border-b border-border-custom">
        <Skeleton className="h-4 w-[150px]" />
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-4 w-[80px]" />
        <Skeleton className="h-4 w-[120px]" />
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-4 w-[150px] ml-auto" />
      </div>

      {/* Row Skeletons */}
      {Array.from({ length: 6 }).map((_, idx) => (
        <div key={idx} className="flex items-center space-x-4 py-4 border-b border-border-custom/50">
          <Skeleton className="h-5 w-[140px]" />
          <Skeleton className="h-4 w-[90px]" />
          <Skeleton className="h-5 w-[60px]" />
          <Skeleton className="h-4 w-[110px]" />
          <Skeleton className="h-4 w-[70px]" />
          <div className="flex flex-col space-y-1.5 ml-auto w-[160px]">
            <Skeleton className="h-4 w-[80px] self-end" />
            <Skeleton className="h-1.5 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
