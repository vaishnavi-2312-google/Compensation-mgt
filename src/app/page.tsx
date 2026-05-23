'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronRight, Layers, ArrowUpRight, ShieldCheck, HelpCircle, Users, Scale } from 'lucide-react';
import DistributionChart from '@/components/charts/distribution-chart';
import LevelBadge from '@/components/level-badge';
import CompensationBar from '@/components/compensation-bar';

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (selectedRole !== 'All') params.append('roles', selectedRole);
    if (selectedCompany !== 'All') params.append('companies', selectedCompany);
    if (selectedLevel !== 'All') params.append('levels', selectedLevel);
    router.push(`/salaries?${params.toString()}`);
  };

  // Static preview data for the homepage charts and cards
  const miniChartData = [
    { company: 'OpenAI', medianTC: 770, base: 320 },
    { company: 'Netflix', medianTC: 635, base: 520 },
    { company: 'Meta', medianTC: 411, base: 208 },
    { company: 'Stripe', medianTC: 413, base: 228 },
    { company: 'Google', medianTC: 385, base: 210 },
  ];

  const companiesGrid = [
    { name: 'Google', slug: 'google', entries: 9, avgYoE: 7.2, medianTC: 384 },
    { name: 'Meta', slug: 'meta', entries: 7, avgYoE: 7.4, medianTC: 392 },
    { name: 'Stripe', slug: 'stripe', entries: 5, avgYoE: 6.4, medianTC: 340 },
    { name: 'OpenAI', slug: 'openai', entries: 3, avgYoE: 9.0, medianTC: 770 },
    { name: 'Vercel', slug: 'vercel', entries: 3, avgYoE: 6.3, medianTC: 297 },
    { name: 'Ramp', slug: 'ramp', entries: 2, avgYoE: 6.0, medianTC: 343 },
  ];

  return (
    <div className="flex flex-col bg-bg-primary overflow-x-hidden min-h-screen">
      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-4 pt-16 pb-20 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline and Search Hook */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-primary/10 px-3 py-1 text-xs font-semibold text-accent-primary border border-accent-primary/20">
                📊 Standardized Seniority Intelligence
              </span>
              <h1 className="text-4xl font-extrabold tracking-tight text-text-primary sm:text-5xl lg:text-6xl leading-[1.1]">
                Compensation <br className="hidden sm:inline" />
                Intelligence Built <br className="hidden sm:inline" />
                Around <span className="text-accent-primary">Levels</span>
              </h1>
              <p className="max-w-2xl text-lg text-text-secondary leading-relaxed">
                Structured salary insights standardized by organizational level, not job title. Compare actual total compensation breakdown and make offers or decisions with confidence.
              </p>
            </div>

            {/* Interactive Search Console */}
            <form onSubmit={handleSearch} className="rounded-card border border-border-custom bg-card/45 p-6 glass-panel space-y-4">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary" />
                <input
                  type="text"
                  placeholder="Search company, job family, role..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full rounded-input border border-border-custom bg-bg-primary/60 py-3.5 pl-11 pr-4 text-sm text-text-primary placeholder-text-secondary outline-none ring-accent-primary focus:border-accent-primary focus:ring-1"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {/* Role Select */}
                <select
                  value={selectedRole}
                  onChange={e => setSelectedRole(e.target.value)}
                  className="rounded-input border border-border-custom bg-bg-primary/60 p-2.5 text-xs text-text-primary outline-none focus:border-accent-primary"
                >
                  <option value="All">All Roles</option>
                  <option value="Software Engineer">Software Engineer</option>
                  <option value="Product Designer">Product Designer</option>
                  <option value="Product Manager">Product Manager</option>
                </select>

                {/* Company Select */}
                <select
                  value={selectedCompany}
                  onChange={e => setSelectedCompany(e.target.value)}
                  className="rounded-input border border-border-custom bg-bg-primary/60 p-2.5 text-xs text-text-primary outline-none focus:border-accent-primary"
                >
                  <option value="All">All Companies</option>
                  <option value="Google">Google</option>
                  <option value="Meta">Meta</option>
                  <option value="Stripe">Stripe</option>
                  <option value="OpenAI">OpenAI</option>
                  <option value="Vercel">Vercel</option>
                </select>

                {/* Level Select */}
                <select
                  value={selectedLevel}
                  onChange={e => setSelectedLevel(e.target.value)}
                  className="rounded-input border border-border-custom bg-bg-primary/60 p-2.5 text-xs text-text-primary outline-none focus:border-accent-primary"
                >
                  <option value="All">All Levels</option>
                  <option value="Junior (L3)">Junior (L3)</option>
                  <option value="Mid (L4)">Mid (L4)</option>
                  <option value="Senior (L5)">Senior (L5)</option>
                  <option value="Staff (L6)">Staff (L6)</option>
                  <option value="Principal (L7)">Principal (L7)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full rounded-btn bg-accent-primary py-3 text-sm font-bold text-text-primary shadow-sm shadow-accent-primary/20 hover:bg-accent-primary/95 transition-all duration-150"
              >
                Search Salaries
              </button>
            </form>
          </div>

          {/* Right Column: Premium Dashboard Preview */}
          <div className="lg:col-span-5 space-y-6">
            {/* Distribution Graph Preview */}
            <div className="rounded-card border border-border-custom bg-card/30 p-6 glass-panel">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-sm font-bold text-text-primary tracking-tight">Market Benchmarks</h4>
                  <span className="text-[10px] uppercase font-semibold text-text-secondary">Median TC in USD ($k)</span>
                </div>
                <span className="rounded bg-accent-secondary/10 px-2 py-0.5 text-[10px] font-semibold text-accent-secondary">Live</span>
              </div>
              <DistributionChart data={miniChartData} />
            </div>

            {/* Comparison Snapshot Preview */}
            <div className="rounded-card border border-border-custom bg-card p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-border-custom/50 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
                  <Scale className="h-3.5 w-3.5 text-accent-primary" />
                  Standardized Level Delta
                </span>
                <span className="text-xs font-semibold text-accent-secondary">+14.2%</span>
              </div>

              <div className="space-y-3">
                {/* Meta L5 */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-text-primary">Meta</span>
                      <LevelBadge level="E5" standardizedLevel="Senior (L5)" />
                    </div>
                    <span className="text-xs font-bold text-text-primary">$411,000</span>
                  </div>
                  <CompensationBar base={208} stock={165} bonus={38} compact />
                </div>

                {/* Google L5 */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-text-primary">Google</span>
                      <LevelBadge level="L5" standardizedLevel="Senior (L5)" />
                    </div>
                    <span className="text-xs font-bold text-text-primary">$385,000</span>
                  </div>
                  <CompensationBar base={210} stock={140} bonus={35} compact />
                </div>
              </div>

              <Link
                href="/compare?companyA=Meta&levelA=E5&companyB=Google&levelB=L5"
                className="group flex items-center justify-center gap-1.5 rounded-lg bg-hover-custom py-2 text-xs font-bold text-accent-primary transition-colors hover:text-text-primary"
              >
                Explore Full Delta Analysis
                <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Why Levels Matter Section */}
      <section className="border-t border-border-custom bg-bg-secondary/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-text-primary">
              Why Standardized Levels Matter
            </h2>
            <p className="text-text-secondary text-base leading-relaxed">
              Job titles are inflated and inconsistent across tech. An SDE II at Amazon maps to an L4 at Google, while a Software Engineer at Netflix receives staff-level base salaries. We map data to standard tiers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-card border border-border-custom bg-card p-6 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-primary/10 text-accent-primary">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-text-primary">Standardized Tiers</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                We align local company levels (E5, L5, ICT5) to clear industry standard tiers (Junior, Mid, Senior, Staff, Principal) so you can compare apples to apples.
              </p>
            </div>

            <div className="rounded-card border border-border-custom bg-card p-6 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-secondary/10 text-accent-secondary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-text-primary">Confidence Score Indicators</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Every entry features a data confidence indicator based on verified offer letters, sample volume, and market alignment, giving you reliable decision metrics.
              </p>
            </div>

            <div className="rounded-card border border-border-custom bg-card p-6 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10 text-warning">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-text-primary">Structured Components</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                We separate Base Salary, Stock Grants (RSUs/Equity), and Annual Bonuses. Same Total Comp can have vastly different risk profiles depending on the allocation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Top Companies Grid */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-text-primary">
              Explore Top Paying Tech Companies
            </h2>
            <p className="text-text-secondary text-sm">
              Standardized compensation aggregates for premier tech companies.
            </p>
          </div>
          <Link
            href="/salaries"
            className="flex items-center gap-1 text-xs font-bold text-accent-primary hover:text-text-primary transition-colors self-start md:self-auto"
          >
            View All Salaries Table
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {companiesGrid.map(company => (
            <motion.div
              key={company.slug}
              whileHover={{ scale: 1.015 }}
              transition={{ duration: 0.15 }}
              className="rounded-card border border-border-custom bg-card/65 p-6 hover:bg-hover-custom transition-colors relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-bg-secondary border border-border-custom font-bold text-accent-primary">
                    {company.name.slice(0, 2).toUpperCase()}
                  </span>
                  <div>
                    <h3 className="font-bold text-text-primary">{company.name}</h3>
                    <span className="text-[10px] text-text-secondary uppercase font-semibold">
                      {company.entries} Verified Entries
                    </span>
                  </div>
                </div>
                <Link
                  href={`/company/${company.slug}`}
                  className="rounded-full bg-hover-custom p-1.5 text-text-secondary hover:text-accent-primary transition-colors"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-border-custom/50 pt-4 mt-2">
                <div>
                  <span className="text-[10px] text-text-secondary block uppercase font-semibold">Median TC</span>
                  <span className="text-lg font-bold text-text-primary">${company.medianTC}k</span>
                </div>
                <div>
                  <span className="text-[10px] text-text-secondary block uppercase font-semibold">Typical Experience</span>
                  <span className="text-sm font-semibold text-text-secondary">{company.avgYoE} Yrs</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
