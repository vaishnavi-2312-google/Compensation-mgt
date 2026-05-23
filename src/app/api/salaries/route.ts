import { NextResponse } from 'next/server';
import { mockSalaries } from '@/data/mock-salaries';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Read query parameters
  const search = searchParams.get('search')?.toLowerCase() || '';
  const companies = searchParams.get('companies') ? searchParams.get('companies')?.split(',') : [];
  const roles = searchParams.get('roles') ? searchParams.get('roles')?.split(',') : [];
  const levels = searchParams.get('levels') ? searchParams.get('levels')?.split(',') : [];
  const locations = searchParams.get('locations') ? searchParams.get('locations')?.split(',') : [];
  const minComp = parseInt(searchParams.get('minComp') || '0', 10);
  const maxComp = parseInt(searchParams.get('maxComp') || '999999', 10);

  const sort = searchParams.get('sort') || 'totalCompensation';
  const direction = searchParams.get('direction') || 'desc';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  // Apply filters
  let filtered = mockSalaries.filter(entry => {
    // Search keyword match (company, role, level, location)
    if (
      search &&
      !entry.company.toLowerCase().includes(search) &&
      !entry.role.toLowerCase().includes(search) &&
      !entry.level.toLowerCase().includes(search) &&
      !entry.location.toLowerCase().includes(search)
    ) {
      return false;
    }

    // Company filter
    if (companies && companies.length > 0 && !companies.includes(entry.company)) {
      return false;
    }

    // Role filter
    if (roles && roles.length > 0 && !roles.includes(entry.role)) {
      return false;
    }

    // Level filter
    if (levels && levels.length > 0 && !levels.includes(entry.level) && !levels.includes(entry.standardizedLevel)) {
      return false;
    }

    // Location filter
    if (locations && locations.length > 0 && !locations.includes(entry.location)) {
      return false;
    }

    // Compensation range filter
    if (entry.totalCompensation < minComp || entry.totalCompensation > maxComp) {
      return false;
    }

    return true;
  });

  // Apply sorting
  filtered.sort((a: any, b: any) => {
    let valA = a[sort];
    let valB = b[sort];

    if (typeof valA === 'string') {
      valA = valA.toLowerCase();
      valB = valB.toLowerCase();
    }

    if (valA < valB) return direction === 'asc' ? -1 : 1;
    if (valA > valB) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Paginate
  const total = filtered.length;
  const startIndex = (page - 1) * limit;
  const paginated = filtered.slice(startIndex, startIndex + limit);

  return NextResponse.json({
    data: paginated,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
}
