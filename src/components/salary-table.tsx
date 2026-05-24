'use client';

import Link from 'next/link';
import { ArrowUpDown, ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react';
import LevelBadge from './level-badge';
import CompensationBar from './compensation-bar';
import { formatCurrency } from '@/lib/utils';
import { SalaryEntry } from '@/data/mock-salaries';

interface SalaryTableProps {
  data: SalaryEntry[];
  sortField: string;
  sortDirection: 'asc' | 'desc';
  onSort: (field: string) => void;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
}

export default function SalaryTable({
  data,
  sortField,
  sortDirection,
  onSort,
  pagination,
  onPageChange,
}: SalaryTableProps) {
  const headers = [
    { field: 'company', label: 'Company', sortable: true },
    { field: 'role', label: 'Role', sortable: true },
    { field: 'level', label: 'Level', sortable: true },
    { field: 'location', label: 'Location', sortable: true },
    { field: 'yoe', label: 'Experience', sortable: true, labelSub: 'YoE / YaC' },
    { field: 'base', label: 'Base', sortable: true },
    { field: 'stock', label: 'Stock / yr', sortable: true },
    { field: 'bonus', label: 'Bonus / yr', sortable: true },
    { field: 'totalCompensation', label: 'Total Compensation', sortable: true, labelSub: 'Breakdown' },
    { field: 'confidenceScore', label: 'Confidence', sortable: true },
  ];

  return (
    <div className="space-y-4">
      {/* Table Container */}
      <div className="overflow-x-auto rounded-table border border-border-custom bg-card/10 glass-panel">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="sticky top-0 z-10 bg-bg-secondary/90 backdrop-blur-md border-b border-border-custom text-xs font-semibold text-text-secondary uppercase">
            <tr>
              {headers.map(h => (
                <th
                  key={h.field}
                  onClick={() => h.sortable && onSort(h.field)}
                  className={`px-4 py-3.5 select-none ${
                    h.sortable ? 'cursor-pointer hover:text-text-primary transition-colors' : ''
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <div>
                      <div>{h.label}</div>
                      {h.labelSub && <div className="text-[9px] text-text-secondary/60 lowercase normal-case">{h.labelSub}</div>}
                    </div>
                    {h.sortable && (
                      <ArrowUpDown
                        className={`h-3 w-3 transition-colors ${
                          sortField === h.field ? 'text-accent-primary' : 'text-text-secondary/40'
                        }`}
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-custom/50">
            {data.map(row => (
              <tr
                key={row.id}
                className="group hover:bg-hover-custom transition-all duration-150"
              >
                {/* Company Link */}
                <td className="px-4 py-4 font-semibold text-text-primary">
                  <Link
                    href={`/company/${row.company.toLowerCase()}`}
                    className="hover:text-accent-primary hover:underline transition-colors"
                  >
                    {row.company}
                  </Link>
                </td>
                
                {/* Role */}
                <td className="px-4 py-4 text-text-primary font-medium">{row.role}</td>
                
                {/* Level Badge */}
                <td className="px-4 py-4">
                  <LevelBadge level={row.level} standardizedLevel={row.standardizedLevel} />
                </td>
                
                {/* Location */}
                <td className="px-4 py-4 text-text-secondary">{row.location}</td>
                
                {/* YoE / YaC */}
                <td className="px-4 py-4 text-text-primary">
                  <span>{row.yoe} yrs</span>
                  <span className="text-text-secondary text-xs block font-normal">at co: {row.yac} yrs</span>
                </td>
                
                {/* Base, Stock, Bonus */}
                <td className="px-4 py-4 font-medium text-text-primary">{formatCurrency(row.base)}</td>
                <td className="px-4 py-4 text-text-secondary">{row.stock > 0 ? formatCurrency(row.stock) : '—'}</td>
                <td className="px-4 py-4 text-text-secondary">{row.bonus > 0 ? formatCurrency(row.bonus) : '—'}</td>
                
                {/* Total Compensation & breakdown bar */}
                <td className="px-4 py-4 w-[220px]">
                  <div className="font-bold text-text-primary text-base group-hover:text-accent-primary transition-colors">
                    {formatCurrency(row.totalCompensation)}
                  </div>
                  <div className="mt-1 w-full">
                    <CompensationBar base={row.base} stock={row.stock} bonus={row.bonus} compact />
                  </div>
                </td>

                {/* Confidence Badge */}
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      row.confidenceScore === 'High'
                        ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20'
                        : row.confidenceScore === 'Medium'
                        ? 'bg-amber-500/10 text-amber-700 border border-amber-500/20'
                        : 'bg-rose-500/10 text-rose-700 border border-rose-500/20'
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        row.confidenceScore === 'High'
                          ? 'bg-emerald-600'
                          : row.confidenceScore === 'Medium'
                          ? 'bg-amber-500'
                          : 'bg-rose-600'
                      }`}
                    />
                    {row.confidenceScore}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between px-2 text-sm text-text-secondary">
        <div>
          Showing{' '}
          <span className="font-semibold text-text-primary">
            {pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1}
          </span>{' '}
          to{' '}
          <span className="font-semibold text-text-primary">
            {Math.min(pagination.page * pagination.limit, pagination.total)}
          </span>{' '}
          of <span className="font-semibold text-text-primary">{pagination.total}</span> records
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="flex items-center gap-1 rounded-lg border border-border-custom bg-card px-3 py-1.5 text-xs font-semibold text-text-primary hover:bg-hover-custom disabled:opacity-40 disabled:hover:bg-card transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Prev
          </button>
          <span className="text-xs text-text-secondary">
            Page {pagination.page} of {pagination.totalPages || 1}
          </span>
          <button
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
            className="flex items-center gap-1 rounded-lg border border-border-custom bg-card px-3 py-1.5 text-xs font-semibold text-text-primary hover:bg-hover-custom disabled:opacity-40 disabled:hover:bg-card transition-colors"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
