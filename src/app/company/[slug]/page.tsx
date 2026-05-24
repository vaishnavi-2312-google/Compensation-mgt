'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { Layers, Users, TrendingUp, DollarSign, Calendar, MapPin, ChevronLeft } from 'lucide-react';
import StatCard from '@/components/stat-card';
import HistogramChart from '@/components/charts/histogram';
import LevelDistributionChart from '@/components/charts/level-distribution';
import TrendChart from '@/components/charts/trend-chart';
import LevelBadge from '@/components/level-badge';
import CompensationBar from '@/components/compensation-bar';
import { fetchCompany } from '@/lib/api-client';
import { formatCurrency } from '@/lib/utils';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function CompanyPage({ params }: PageProps) {
  const { slug } = use(params);
  
  const [loading, setLoading] = useState(true);
  const [companyData, setCompanyData] = useState<any>(null);
  const [activeRoleTab, setActiveRoleTab] = useState<string>('All');

  useEffect(() => {
    setLoading(true);
    fetchCompany(slug)
      .then(res => {
        setCompanyData(res);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 w-full text-center text-text-secondary">
        Analyzing corporate compensation metrics...
      </div>
    );
  }

  if (!companyData) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 w-full text-center space-y-4">
        <h2 className="text-xl font-bold text-text-primary">Company Not Found</h2>
        <p className="text-text-secondary text-sm">We couldn&apos;t find any verified compensation records for {slug}.</p>
        <Link href="/salaries" className="text-accent-primary font-semibold hover:underline">
          Go back to Salaries Search
        </Link>
      </div>
    );
  }

  // Filter raw entries based on role tab
  const filteredEntries = activeRoleTab === 'All' 
    ? companyData.rawEntries 
    : companyData.rawEntries.filter((e: any) => e.role === activeRoleTab);

  // Available roles inside company entries
  const companyRoles = ['All', ...Array.from(new Set(companyData.rawEntries.map((e: any) => e.role))) as string[]];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 w-full space-y-8">
      {/* Header breadcrumb */}
      <div>
        <Link
          href="/salaries"
          className="inline-flex items-center gap-1 text-xs font-semibold text-text-secondary hover:text-accent-primary transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Salaries
        </Link>
      </div>

      {/* Top Profile Summary Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-border-custom/50 pb-6">
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-card border border-border-custom font-extrabold text-2xl text-accent-primary shadow-sm shadow-accent-primary/5">
            {companyData.logo}
          </span>
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">
              {companyData.name} Compensation Profile
            </h1>
            <p className="text-text-secondary text-sm flex items-center gap-2">
              <span>Verified Levels: {companyData.levelDistribution.length}</span>
              <span>•</span>
              <span>Total Entries: {companyData.totalEntries}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/compare?companyA=${companyData.name}`}
            className="rounded-btn border border-border-custom bg-bg-secondary px-5 py-2.5 text-xs font-bold text-text-primary hover:bg-hover-custom transition-colors"
          >
            Compare Company Offer
          </Link>
        </div>
      </div>

      {/* Metric Stat Blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Median Total Comp"
          value={formatCurrency(companyData.medianCompensation)}
          trend="+4.8%"
          trendDirection="up"
          subtitle="vs market median"
          icon={<DollarSign className="h-5 w-5 text-accent-primary" />}
        />
        <StatCard
          title="Median Base Salary"
          value={formatCurrency(companyData.medianBase)}
          subtitle="annual base salary"
          icon={<TrendingUp className="h-5 w-5 text-accent-secondary" />}
        />
        <StatCard
          title="Median Stock / yr"
          value={formatCurrency(companyData.medianStock)}
          subtitle="RSU/Equity grants"
          icon={<Layers className="h-5 w-5 text-purple-400" />}
        />
        <StatCard
          title="Total Data Points"
          value={companyData.totalEntries}
          subtitle="verified sample size"
          icon={<Users className="h-5 w-5 text-slate-400" />}
        />
      </div>

      {/* Main Charts Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Histogram & Level Progression */}
        <div className="lg:col-span-8 space-y-8">
          {/* Progression Curve */}
          <div className="rounded-card border border-border-custom bg-card/25 p-6 glass-panel">
            <div className="space-y-1 mb-6">
              <h3 className="text-base font-bold text-text-primary tracking-tight">Level Progression Slope</h3>
              <p className="text-xs text-text-secondary">Expected compensation trajectory by level and experience.</p>
            </div>
            <TrendChart data={companyData.levelProgression} />
          </div>

          {/* Histogram */}
          <div className="rounded-card border border-border-custom bg-card/25 p-6 glass-panel">
            <div className="space-y-1 mb-6">
              <h3 className="text-base font-bold text-text-primary tracking-tight">Compensation Histogram</h3>
              <p className="text-xs text-text-secondary">Frequency distribution of total compensation brackets.</p>
            </div>
            <HistogramChart data={companyData.histogram} />
          </div>
        </div>

        {/* Right Column: Highest Paying Levels, Distribution Lists */}
        <div className="lg:col-span-4 space-y-8">
          {/* Level Entry Count Distribution */}
          <div className="rounded-card border border-border-custom bg-card/25 p-6 glass-panel">
            <h3 className="text-base font-bold text-text-primary tracking-tight mb-4">Sample Share by Level</h3>
            <LevelDistributionChart data={companyData.levelDistribution} />
          </div>

          {/* Highest Paying Levels Leaderboard */}
          <div className="rounded-card border border-border-custom bg-card p-6 space-y-4">
            <h3 className="text-base font-bold text-text-primary tracking-tight">Levels Compensation Bands</h3>
            <div className="divide-y divide-border-custom/50 space-y-3 pt-1">
              {companyData.payingLevels.map((pl: any, idx: number) => (
                <div key={pl.level} className="flex justify-between items-center py-2.5 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-text-secondary w-5">#{idx + 1}</span>
                    <LevelBadge level={pl.level} />
                  </div>
                  <span className="font-bold text-text-primary">{formatCurrency(pl.medianCompensation)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Raw Salary Entries Listing Table */}
      <div className="rounded-card border border-border-custom bg-card/25 p-6 glass-panel space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-base font-bold text-text-primary tracking-tight">Verified Salary Entries</h3>
            <p className="text-xs text-text-secondary">Raw records for {companyData.name} filtered by role family.</p>
          </div>

          {/* Tab Selection Row */}
          <div className="flex bg-bg-secondary rounded-lg p-0.5 border border-border-custom">
            {companyRoles.map((role: string) => (
              <button
                key={role}
                onClick={() => setActiveRoleTab(role)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  activeRoleTab === role
                    ? 'bg-accent-primary text-white shadow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {role === 'All' ? 'All Roles' : role}
              </button>
            ))}
          </div>
        </div>

        {/* Clean Compact List of Entries */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-border-custom text-xs font-bold text-text-secondary uppercase">
                <th className="pb-3 pr-4">Level</th>
                <th className="pb-3 px-4">Role</th>
                <th className="pb-3 px-4">Location</th>
                <th className="pb-3 px-4">YoE</th>
                <th className="pb-3 px-4">Breakdown (Base/Stock/Bonus)</th>
                <th className="pb-3 pl-4 text-right">Total Comp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-custom/30 text-text-secondary">
              {filteredEntries.map((entry: any) => (
                <tr key={entry.id} className="hover:bg-hover-custom/30 transition-colors">
                  <td className="py-3.5 pr-4 font-bold text-text-primary">
                    <LevelBadge level={entry.level} standardizedLevel={entry.standardizedLevel} />
                  </td>
                  <td className="py-3.5 px-4 font-medium text-text-primary">{entry.role}</td>
                  <td className="py-3.5 px-4 flex items-center gap-1.5 text-xs">
                    <MapPin className="h-3 w-3 text-text-secondary/60" />
                    {entry.location}
                  </td>
                  <td className="py-3.5 px-4 text-xs font-semibold text-text-primary">{entry.yoe} Yoe</td>
                  <td className="py-3.5 px-4 w-[280px]">
                    <div className="text-[10px] flex justify-between mb-1">
                      <span>Base: ${entry.base}k</span>
                      <span>Stock: ${entry.stock}k</span>
                      <span>Bonus: ${entry.bonus}k</span>
                    </div>
                    <CompensationBar base={entry.base} stock={entry.stock} bonus={entry.bonus} compact />
                  </td>
                  <td className="py-3.5 pl-4 text-right font-bold text-text-primary text-base">
                    {formatCurrency(entry.totalCompensation)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
