import { Database } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  onClearFilters?: () => void;
}

export default function EmptyState({
  title = 'No records found',
  description = 'Try adjusting your filters, query parameters, or search terms to see matching compensation entries.',
  onClearFilters,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[350px] flex-col items-center justify-center rounded-table border border-dashed border-border-custom bg-card/25 p-8 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-hover-custom text-text-secondary">
        <Database className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-text-primary">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-text-secondary leading-relaxed">
        {description}
      </p>
      {onClearFilters && (
        <button
          onClick={onClearFilters}
          className="mt-6 rounded-btn bg-accent-primary px-4 py-2 text-sm font-semibold text-text-primary shadow-sm shadow-accent-primary/20 transition-all duration-150 hover:bg-accent-primary/95"
        >
          Reset All Filters
        </button>
      )}
    </div>
  );
}
