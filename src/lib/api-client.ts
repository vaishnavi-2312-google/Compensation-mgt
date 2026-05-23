export interface FetchSalariesParams {
  search?: string;
  companies?: string[];
  roles?: string[];
  levels?: string[];
  locations?: string[];
  minComp?: number;
  maxComp?: number;
  sort?: string;
  direction?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface SalariesResponse {
  data: any[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export async function fetchSalaries(params: FetchSalariesParams = {}): Promise<SalariesResponse> {
  const query = new URLSearchParams();
  
  if (params.search) query.append('search', params.search);
  if (params.companies && params.companies.length > 0) query.append('companies', params.companies.join(','));
  if (params.roles && params.roles.length > 0) query.append('roles', params.roles.join(','));
  if (params.levels && params.levels.length > 0) query.append('levels', params.levels.join(','));
  if (params.locations && params.locations.length > 0) query.append('locations', params.locations.join(','));
  if (params.minComp !== undefined) query.append('minComp', params.minComp.toString());
  if (params.maxComp !== undefined) query.append('maxComp', params.maxComp.toString());
  if (params.sort) query.append('sort', params.sort);
  if (params.direction) query.append('direction', params.direction);
  if (params.page !== undefined) query.append('page', params.page.toString());
  if (params.limit !== undefined) query.append('limit', params.limit.toString());

  const res = await fetch(`/api/salaries?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch salaries');
  return res.json();
}

export async function fetchCompany(name: string): Promise<any> {
  const res = await fetch(`/api/company?name=${encodeURIComponent(name)}`);
  if (!res.ok) throw new Error(`Failed to fetch company: ${name}`);
  return res.json();
}

export async function fetchCompaniesList(): Promise<any[]> {
  const res = await fetch('/api/company');
  if (!res.ok) throw new Error('Failed to fetch companies list');
  return res.json();
}

export interface FetchCompareParams {
  companyA: string;
  roleA?: string;
  levelA?: string;
  companyB: string;
  roleB?: string;
  levelB?: string;
}

export async function fetchCompare(params: FetchCompareParams): Promise<any> {
  const query = new URLSearchParams({
    companyA: params.companyA,
    companyB: params.companyB,
  });

  if (params.roleA) query.append('roleA', params.roleA);
  if (params.levelA) query.append('levelA', params.levelA);
  if (params.roleB) query.append('roleB', params.roleB);
  if (params.levelB) query.append('levelB', params.levelB);

  const res = await fetch(`/api/compare?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to compare packages');
  return res.json();
}
