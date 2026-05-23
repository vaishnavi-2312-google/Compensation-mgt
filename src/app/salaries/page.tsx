'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import SidebarFilters from '@/components/sidebar-filters';
import SalaryTable from '@/components/salary-table';
import TableSkeleton from '@/components/skeleton-loader';
import EmptyState from '@/components/empty-state';
import { fetchSalaries } from '@/lib/api-client';
import { getUniqueCompanies, getUniqueLocations, getUniqueLevels } from '@/data/mock-salaries';

function SalaryTableContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse search params to state
  const getInitialFilters = () => {
    return {
      search: searchParams.get('search') || '',
      companies: searchParams.get('companies') ? searchParams.get('companies')!.split(',') : [],
      roles: searchParams.get('roles') ? searchParams.get('roles')!.split(',') : [],
      levels: searchParams.get('levels') ? searchParams.get('levels')!.split(',') : [],
      locations: searchParams.get('locations') ? searchParams.get('locations')!.split(',') : [],
      minComp: parseInt(searchParams.get('minComp') || '0', 10),
      maxComp: parseInt(searchParams.get('maxComp') || '2000', 10),
    };
  };

  const [filters, setFilters] = useState(getInitialFilters);
  const [sortField, setSortField] = useState(searchParams.get('sort') || 'totalCompensation');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>((searchParams.get('direction') as any) || 'desc');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1', 10));
  const [limit] = useState(10);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  // Pull unique lists to seed sidebar filters
  const uniqueCompanies = getUniqueCompanies();
  const uniqueLocations = getUniqueLocations();
  const uniqueLevels = ['Junior (L3)', 'Mid (L4)', 'Senior (L5)', 'Staff (L6)', 'Principal (L7)', ...getUniqueLevels()];

  // Sync state with URL
  const updateUrl = () => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.companies.length > 0) params.append('companies', filters.companies.join(','));
    if (filters.roles.length > 0) params.append('roles', filters.roles.join(','));
    if (filters.levels.length > 0) params.append('levels', filters.levels.join(','));
    if (filters.locations.length > 0) params.append('locations', filters.locations.join(','));
    if (filters.minComp > 0) params.append('minComp', filters.minComp.toString());
    if (filters.maxComp < 2000) params.append('maxComp', filters.maxComp.toString());
    
    params.append('sort', sortField);
    params.append('direction', sortDirection);
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    router.replace(`/salaries?${params.toString()}`, { scroll: false });
  };

  // Fetch Salaries on state changes
  useEffect(() => {
    let active = true;
    setLoading(true);

    fetchSalaries({
      ...filters,
      sort: sortField,
      direction: sortDirection,
      page,
      limit,
    })
      .then(res => {
        if (active) {
          setData(res.data);
          setPagination(res.pagination);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error(err);
        if (active) setLoading(false);
      });

    updateUrl();

    return () => {
      active = false;
    };
  }, [filters, sortField, sortDirection, page]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [filters]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
    setPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      companies: [],
      roles: [],
      levels: [],
      locations: [],
      minComp: 0,
      maxComp: 2000,
    });
    setSortField('totalCompensation');
    setSortDirection('desc');
    setPage(1);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 w-full">
      
      {/* Title Panel */}
      <div className="space-y-1 mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-text-primary">
          Compensation Records
        </h1>
        <p className="text-text-secondary text-sm">
          Standardized compensation datapoints from verified tech entries.
        </p>
      </div>

      {/* Grid Layout: Left Filters + Right Table */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Sticky Filters Column */}
        <aside className="md:col-span-3 md:sticky md:top-20 h-auto max-h-[85vh] overflow-y-auto pr-1">
          <SidebarFilters
            filters={filters}
            setFilters={setFilters}
            uniqueCompanies={uniqueCompanies}
            uniqueLocations={uniqueLocations}
            uniqueLevels={uniqueLevels}
            onReset={handleResetFilters}
          />
        </aside>

        {/* Results Column */}
        <section className="md:col-span-9 space-y-4">
          {loading ? (
            <div className="rounded-table border border-border-custom bg-card/10 p-6 glass-panel">
              <TableSkeleton />
            </div>
          ) : data.length === 0 ? (
            <EmptyState onClearFilters={handleResetFilters} />
          ) : (
            <SalaryTable
              data={data}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
              pagination={pagination}
              onPageChange={setPage}
            />
          )}
        </section>

      </div>
    </div>
  );
}

export default function SalariesPage() {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 w-full text-center text-text-secondary">
        Loading compensation intelligence console...
      </div>
    }>
      <SalaryTableContent />
    </Suspense>
  );
}
