'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronRight, Layers, ArrowUpRight, ShieldCheck, HelpCircle, Users, Scale, Star, ArrowRight, Zap, Target } from 'lucide-react';
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
      <section className="relative mx-auto max-w-7xl px-4 pt-20 pb-24 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-12 items-center">
          
          {/* Left Column: Headline and Search Console */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-6">
              <motion.span 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center gap-1.5 rounded-full bg-accent-primary/5 px-3.5 py-1 text-xs font-semibold tracking-wide text-accent-primary border border-accent-primary/10"
              >
                <Zap className="h-3.5 w-3.5" />
                Standardized Seniority Intelligence
              </motion.span>
              
              <motion.h1 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="text-4xl font-black tracking-tight text-text-primary sm:text-5xl lg:text-6xl leading-[1.05]"
              >
                Compensation Intelligence Built Around <span className="underline decoration-1 underline-offset-8">Levels</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="max-w-xl text-md text-text-secondary leading-relaxed"
              >
                Structured salary intelligence standardized for modern careers. Compare total compensation components (base, equity, bonus) side-by-side using unified market levels.
              </motion.p>
            </div>

            {/* Premium CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href="/salaries"
                className="inline-flex items-center gap-2 rounded-btn bg-accent-primary px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-accent-primary/10 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
              >
                Explore Salaries
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/compare"
                className="inline-flex items-center gap-2 rounded-btn border border-border-custom bg-white/70 px-6 py-3.5 text-sm font-semibold text-text-primary shadow-sm hover:-translate-y-0.5 hover:bg-white hover:shadow-md transition-all duration-200"
              >
                Compare Offers
              </Link>
            </motion.div>

            {/* Elegant Search Console */}
            <motion.form 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              onSubmit={handleSearch} 
              className="rounded-card border border-border-custom bg-card glass-panel p-6 space-y-4"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary" />
                <input
                  type="text"
                  placeholder="Search company, job family, or role..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full rounded-input border border-border-custom bg-white/50 py-3.5 pl-12 pr-4 text-sm text-text-primary placeholder-text-muted outline-none ring-accent-primary focus:bg-white focus:border-accent-primary focus:ring-1 transition-all duration-150"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {/* Role Select */}
                <select
                  value={selectedRole}
                  onChange={e => setSelectedRole(e.target.value)}
                  className="rounded-input border border-border-custom bg-white/50 p-2.5 text-xs text-text-primary outline-none focus:bg-white focus:border-accent-primary transition-all duration-150"
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
                  className="rounded-input border border-border-custom bg-white/50 p-2.5 text-xs text-text-primary outline-none focus:bg-white focus:border-accent-primary transition-all duration-150"
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
                  className="rounded-input border border-border-custom bg-white/50 p-2.5 text-xs text-text-primary outline-none focus:bg-white focus:border-accent-primary transition-all duration-150"
                >
                  <option value="All">All Tiers</option>
                  <option value="Junior (L3)">Junior (L3)</option>
                  <option value="Mid (L4)">Mid (L4)</option>
                  <option value="Senior (L5)">Senior (L5)</option>
                  <option value="Staff (L6)">Staff (L6)</option>
                  <option value="Principal (L7)">Principal (L7)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full rounded-btn bg-accent-primary py-3.5 text-sm font-semibold text-white shadow-sm hover:opacity-95 active:scale-[0.99] transition-all duration-150"
              >
                Search Live Benchmarks
              </button>
            </motion.form>
          </div>

          {/* Right Column: Premium Floating Analytics Visuals */}
          <div className="lg:col-span-6 flex flex-col justify-center relative min-h-[460px]">
            {/* Background ambient lighting */}
            <div className="absolute -inset-4 bg-radial-gradient from-white/90 via-transparent to-transparent blur-2xl pointer-events-none" />

            {/* Visual 1: Level Hierarchy & Delta Mapping Card (Interactive Layout) */}
            <motion.div 
              initial={{ opacity: 0, x: 30, y: -20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="rounded-card border border-border-custom bg-white/80 p-6 glass-panel relative z-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
            >
              <div className="flex items-center justify-between border-b border-border-custom pb-3 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
                  <Scale className="h-3.5 w-3.5 text-accent-primary" />
                  Standardized Senior Mapping
                </span>
                <span className="text-[10px] uppercase font-semibold text-text-muted">Live Aggregates</span>
              </div>

              <div className="space-y-4">
                {/* Meta L5 vs Google L5 */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-text-primary">Meta</span>
                      <LevelBadge level="E5" standardizedLevel="Senior (L5)" />
                    </div>
                    <span className="text-xs font-bold text-text-primary">$411,000</span>
                  </div>
                  <CompensationBar base={208} stock={165} bonus={38} compact />
                </div>

                <div className="flex justify-center items-center py-1">
                  <div className="w-full border-t border-dashed border-border-custom relative flex justify-center">
                    <span className="absolute -top-2.5 rounded-full bg-bg-secondary px-2.5 py-0.5 text-[9px] font-bold text-text-secondary border border-border-custom">
                      +6.7% Delta (Meta vs Google)
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-text-primary">Google</span>
                      <LevelBadge level="L5" standardizedLevel="Senior (L5)" />
                    </div>
                    <span className="text-xs font-bold text-text-primary">$385,000</span>
                  </div>
                  <CompensationBar base={210} stock={140} bonus={35} compact />
                </div>
              </div>
            </motion.div>

            {/* Visual 2: Floating Secondary Live Market Benchmarks Card */}
            <motion.div 
              initial={{ opacity: 0, x: -30, y: 40 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ y: 2, transition: { duration: 0.2 } }}
              className="rounded-card border border-border-custom bg-white/70 p-5 glass-card absolute -bottom-6 -left-8 w-[80%] max-w-[340px] hidden sm:block z-20 shadow-[0_12px_24px_rgba(0,0,0,0.03)]"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-xs font-bold text-text-primary tracking-tight">Market Benchmarks</h4>
                  <span className="text-[9px] uppercase font-semibold text-text-muted">Median Total Comp ($k)</span>
                </div>
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold text-emerald-600 border border-emerald-500/20">Live</span>
              </div>
              <div className="h-[120px] w-full flex items-end gap-2 pt-2">
                {miniChartData.map((item, idx) => {
                  const maxVal = 770;
                  const percentHeight = (item.medianTC / maxVal) * 100;
                  return (
                    <div key={item.company} className="flex-1 flex flex-col items-center h-full justify-end">
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${percentHeight}%` }}
                        transition={{ duration: 0.8, delay: 0.3 + idx * 0.05 }}
                        className="w-full bg-accent-primary/80 rounded-t-sm hover:bg-accent-primary transition-all duration-150 relative group"
                      >
                        <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-text-primary text-white text-[9px] font-bold rounded px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-sm z-30">
                          ${item.medianTC}k
                        </span>
                      </motion.div>
                      <span className="text-[9px] font-semibold text-text-secondary mt-1.5">{item.company.slice(0, 3)}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Visual 3: Standard Indicators Mini Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="absolute -right-6 -bottom-4 rounded-xl border border-border-custom bg-white p-3 shadow-md flex items-center gap-2.5 z-20 pointer-events-none"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-primary/5 text-accent-primary border border-border-custom/50">
                <Target className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-text-muted block">Verify Index</span>
                <span className="text-xs font-bold text-text-primary">98.4% Confidence</span>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* Why Levels Matter Section */}
      <section className="border-t border-border-custom/50 bg-white/40 py-24 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-20">
            <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold text-text-secondary">
              Precision Architecture
            </span>
            <h2 className="text-3xl font-black tracking-tight text-text-primary sm:text-4xl">
              Why Standardized Levels Matter
            </h2>
            <p className="text-text-secondary text-md leading-relaxed">
              Job titles are inflated and inconsistent across tech. An SDE II at Amazon maps to an L4 at Google, while a Software Engineer at Netflix receives staff-level base salaries. We map and standardize raw compensation data.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-card border border-border-custom bg-white/70 p-8 glass-panel space-y-4 hover:-translate-y-1 hover:shadow-md transition-all duration-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-primary/5 text-accent-primary border border-border-custom">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-text-primary tracking-tight">Standardized Tiers</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                We align local company levels (E5, L5, ICT5) to clear industry standard tiers (Junior, Mid, Senior, Staff, Principal) so you can compare apples to apples.
              </p>
            </div>

            <div className="rounded-card border border-border-custom bg-white/70 p-8 glass-panel space-y-4 hover:-translate-y-1 hover:shadow-md transition-all duration-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-primary/5 text-accent-primary border border-border-custom">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-text-primary tracking-tight">Confidence Scores</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Every entry features a data confidence indicator based on verified offer letters, sample volume, and market alignment, giving you reliable decision metrics.
              </p>
            </div>

            <div className="rounded-card border border-border-custom bg-white/70 p-8 glass-panel space-y-4 hover:-translate-y-1 hover:shadow-md transition-all duration-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-primary/5 text-accent-primary border border-border-custom">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-text-primary tracking-tight">Structured Allocation</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                We separate Base Salary, Stock Grants (RSUs/Equity), and Annual Bonuses. Same Total Comp can have vastly different risk profiles depending on allocation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Top Companies Grid */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold text-text-secondary">
              Corporate Benchmarking
            </span>
            <h2 className="text-3xl font-black tracking-tight text-text-primary">
              Explore Top Tech Employers
            </h2>
            <p className="text-text-secondary text-sm">
              Standardized compensation aggregates for premier technology corporations.
            </p>
          </div>
          <Link
            href="/salaries"
            className="flex items-center gap-1.5 text-xs font-bold text-accent-primary hover:opacity-80 transition-opacity border-b border-accent-primary/20 pb-0.5 self-start md:self-auto"
          >
            View Live Salaries Table
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {companiesGrid.map((company, idx) => (
            <motion.div
              key={company.slug}
              whileHover={{ scale: 1.01, y: -2 }}
              transition={{ duration: 0.15 }}
              className="rounded-card border border-border-custom bg-white/70 p-6 glass-panel hover:bg-white hover:shadow-lg hover:shadow-black/5 transition-all duration-200 relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3.5">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-bg-secondary border border-border-custom font-bold text-text-primary text-sm shadow-sm">
                    {company.name.slice(0, 2).toUpperCase()}
                  </span>
                  <div>
                    <h3 className="font-extrabold text-text-primary tracking-tight text-base">{company.name}</h3>
                    <span className="text-[9px] text-text-muted uppercase font-bold tracking-wider">
                      {company.entries} Verified Entries
                    </span>
                  </div>
                </div>
                <Link
                  href={`/company/${company.slug}`}
                  className="rounded-full bg-hover-custom p-2 text-text-secondary hover:text-accent-primary hover:bg-border-custom/50 transition-colors"
                >
                  <ArrowUpRight className="h-4.5 w-4.5" />
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-border-custom/50 pt-4 mt-2">
                <div>
                  <span className="text-[9px] text-text-muted block uppercase font-bold tracking-wider">Median TC</span>
                  <span className="text-xl font-black text-text-primary">${company.medianTC}k</span>
                </div>
                <div>
                  <span className="text-[9px] text-text-muted block uppercase font-bold tracking-wider">Avg Experience</span>
                  <span className="text-sm font-bold text-text-secondary mt-1 block">{company.avgYoE} Yrs</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
