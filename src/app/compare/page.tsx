'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Scale, ArrowRight, TrendingUp, TrendingDown, RefreshCw, Sparkles } from 'lucide-react';
import { getUniqueCompanies, getCompanySummary, mockSalaries } from '@/data/mock-salaries';
import ComparisonBars from '@/components/charts/comparison-bars';
import LevelBadge from '@/components/level-badge';
import { formatCurrency } from '@/lib/utils';

function ComparePageContent() {
  const searchParams = useSearchParams();
  const companiesList = getUniqueCompanies();

  // Pick initial selections from URL or defaults
  const [compA, setCompA] = useState(searchParams.get('companyA') || 'Google');
  const [roleA, setRoleA] = useState('Software Engineer');
  const [levelA, setLevelA] = useState(searchParams.get('levelA') || 'L5');

  const [compB, setCompB] = useState(searchParams.get('companyB') || 'Meta');
  const [roleB, setRoleB] = useState('Software Engineer');
  const [levelB, setLevelB] = useState(searchParams.get('levelB') || 'E5');

  // Sliders fine-tuning values
  const [baseA, setBaseA] = useState(210);
  const [stockA, setStockA] = useState(140);
  const [bonusA, setBonusA] = useState(35);

  const [baseB, setBaseB] = useState(208);
  const [stockB, setStockB] = useState(165);
  const [bonusB, setBonusB] = useState(38);

  const rolesList = ['Software Engineer', 'Product Designer', 'Product Manager'];

  // Dynamically resolve levels available for selected companies
  const getLevelsForCompany = (comp: string) => {
    return Array.from(
      new Set(mockSalaries.filter(s => s.company.toLowerCase() === comp.toLowerCase()).map(s => s.level))
    ).sort();
  };

  const levelsA = getLevelsForCompany(compA);
  const levelsB = getLevelsForCompany(compB);

  // Sync sliders to selected company + level averages
  const syncToAverages = (target: 'A' | 'B') => {
    const comp = target === 'A' ? compA : compB;
    const role = target === 'A' ? roleA : roleB;
    const level = target === 'A' ? levelA : levelB;

    const matches = mockSalaries.filter(
      s =>
        s.company.toLowerCase() === comp.toLowerCase() &&
        s.role.toLowerCase() === role.toLowerCase() &&
        s.level.toLowerCase() === level.toLowerCase()
    );

    const average = matches.length > 0 
      ? matches 
      : mockSalaries.filter(s => s.company.toLowerCase() === comp.toLowerCase());

    if (average.length > 0) {
      const avgBase = Math.round(average.reduce((sum, e) => sum + e.base, 0) / average.length);
      const avgStock = Math.round(average.reduce((sum, e) => sum + e.stock, 0) / average.length);
      const avgBonus = Math.round(average.reduce((sum, e) => sum + e.bonus, 0) / average.length);

      if (target === 'A') {
        setBaseA(avgBase);
        setStockA(avgStock);
        setBonusA(avgBonus);
      } else {
        setBaseB(avgBase);
        setStockB(avgStock);
        setBonusB(avgBonus);
      }
    }
  };

  // Sync defaults on mounts and select changes
  useEffect(() => {
    // If level is not in the company's levels, select first one
    if (levelsA.length > 0 && !levelsA.includes(levelA)) {
      setLevelA(levelsA[0]);
    } else {
      syncToAverages('A');
    }
  }, [compA, roleA, levelA]);

  useEffect(() => {
    if (levelsB.length > 0 && !levelsB.includes(levelB)) {
      setLevelB(levelsB[0]);
    } else {
      syncToAverages('B');
    }
  }, [compB, roleB, levelB]);

  // Derived mathematical states
  const totalA = baseA + stockA + bonusA;
  const totalB = baseB + stockB + bonusB;

  const tcDelta = totalA - totalB;
  const tcPctDelta = parseFloat(((tcDelta / (totalB || 1)) * 100).toFixed(1));

  const baseDelta = baseA - baseB;
  const stockDelta = stockA - stockB;
  const bonusDelta = bonusA - bonusB;

  // Synthesize textual overview narrative
  const getNarrative = () => {
    if (totalA === totalB) return 'Both compensation structures result in an identical average package size.';
    
    const higherName = totalA > totalB ? compA : compB;
    const lowerName = totalA > totalB ? compB : compA;
    const higherLevel = totalA > totalB ? levelA : levelB;
    const lowerLevel = totalA > totalB ? levelB : levelA;
    const pct = Math.abs(tcPctDelta);
    
    let driver = '';
    const stDelta = Math.abs(stockDelta);
    const bsDelta = Math.abs(baseDelta);
    
    if (stDelta > bsDelta) {
      driver = `larger equity distribution (+$${stDelta}k/yr)`;
    } else {
      driver = `higher base salary tier (+$${bsDelta}k/yr)`;
    }

    return `${higherName} ${higherLevel} offers a ${pct}% higher total compensation on average compared to ${lowerName} ${lowerLevel}, primarily driven by a ${driver}.`;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 w-full space-y-8">
      {/* Title */}
      <div className="space-y-1 mb-2">
        <h1 className="text-3xl font-bold tracking-tight text-text-primary flex items-center gap-2">
          <Scale className="h-7 w-7 text-accent-primary" />
          Interactive Offer Compare
        </h1>
        <p className="text-text-secondary text-sm">
          Select two packages, adjust values dynamically, and examine allocation deltas.
        </p>
      </div>

      {/* Grid: Columns comparing side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Company A Card Column */}
        <div className="lg:col-span-5 rounded-card border border-border-custom bg-card/45 p-6 glass-panel space-y-6">
          <div className="flex items-center justify-between border-b border-border-custom/50 pb-4">
            <span className="text-xs font-bold text-accent-primary uppercase tracking-widest">Offer Package A</span>
            <button
              onClick={() => syncToAverages('A')}
              className="flex items-center gap-1 text-[10px] uppercase font-bold text-text-secondary hover:text-text-primary transition-colors"
            >
              <RefreshCw className="h-3 w-3" />
              Reset to Average
            </button>
          </div>

          {/* Selectors */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <span className="text-[10px] text-text-secondary uppercase font-semibold block mb-1">Company</span>
              <select
                value={compA}
                onChange={e => setCompA(e.target.value)}
                className="w-full rounded-lg border border-border-custom bg-bg-primary p-2 text-xs text-text-primary outline-none focus:border-accent-primary"
              >
                {companiesList.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            
            <div>
              <span className="text-[10px] text-text-secondary uppercase font-semibold block mb-1">Role</span>
              <select
                value={roleA}
                onChange={e => setRoleA(e.target.value)}
                className="w-full rounded-lg border border-border-custom bg-bg-primary p-2 text-xs text-text-primary outline-none focus:border-accent-primary"
              >
                {rolesList.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div>
              <span className="text-[10px] text-text-secondary uppercase font-semibold block mb-1">Level</span>
              <select
                value={levelA}
                onChange={e => setLevelA(e.target.value)}
                className="w-full rounded-lg border border-border-custom bg-bg-primary p-2 text-xs text-text-primary outline-none focus:border-accent-primary"
              >
                {levelsA.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>

          {/* Sliders Console */}
          <div className="space-y-4 pt-4 border-t border-border-custom/50">
            {/* Base Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-text-secondary font-semibold">Base Salary ($k)</span>
                <span className="text-text-primary font-bold">${baseA}k</span>
              </div>
              <input
                type="range"
                min="0"
                max="500"
                value={baseA}
                onChange={e => setBaseA(parseInt(e.target.value, 10))}
                className="w-full h-1 bg-hover-custom rounded-lg appearance-none cursor-pointer accent-accent-primary"
              />
            </div>

            {/* Stock Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-text-secondary font-semibold">Stock / yr ($k)</span>
                <span className="text-text-primary font-bold">${stockA}k</span>
              </div>
              <input
                type="range"
                min="0"
                max="800"
                value={stockA}
                onChange={e => setStockA(parseInt(e.target.value, 10))}
                className="w-full h-1 bg-hover-custom rounded-lg appearance-none cursor-pointer accent-accent-primary"
              />
            </div>

            {/* Bonus Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-text-secondary font-semibold">Bonus / yr ($k)</span>
                <span className="text-text-primary font-bold">${bonusA}k</span>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                value={bonusA}
                onChange={e => setBonusA(parseInt(e.target.value, 10))}
                className="w-full h-1 bg-hover-custom rounded-lg appearance-none cursor-pointer accent-accent-primary"
              />
            </div>
          </div>

          {/* Summary Box */}
          <div className="pt-6 border-t border-border-custom/50 flex justify-between items-center">
            <div>
              <span className="text-[10px] text-text-secondary block uppercase font-semibold">Total Comp A</span>
              <span className="text-2xl font-extrabold text-text-primary">{formatCurrency(totalA)}</span>
            </div>
            <span className="text-xs font-bold bg-accent-primary/10 border border-accent-primary/20 text-accent-primary rounded-lg px-3 py-1.5">
              {compA} {levelA}
            </span>
          </div>
        </div>

        {/* Delta Analysis Panel (Middle Desktop / Stacks mobile) */}
        <div className="lg:col-span-2 flex flex-col justify-center items-center py-6 lg:py-0 space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-hover-custom border border-border-custom">
            <ArrowRight className="h-5 w-5 text-text-secondary rotate-90 lg:rotate-0" />
          </div>

          {/* Recalculated Comp difference indicator */}
          <div className="text-center space-y-1">
            <span className="text-[10px] uppercase font-bold text-text-secondary tracking-wider block">Recalculated Delta</span>
            <div className={`text-xl font-bold flex items-center gap-1 justify-center ${tcDelta > 0 ? 'text-accent-primary' : tcDelta < 0 ? 'text-accent-secondary' : 'text-text-primary'}`}>
              {tcDelta > 0 ? <TrendingUp className="h-4.5 w-4.5" /> : tcDelta < 0 ? <TrendingDown className="h-4.5 w-4.5" /> : null}
              {tcDelta === 0 ? 'Equal' : `$${Math.abs(tcDelta)}k`}
            </div>
            {tcDelta !== 0 && (
              <span className="text-xs text-text-secondary block font-semibold">
                ({tcDelta > 0 ? '+' : '-'}{Math.abs(tcPctDelta)}%)
              </span>
            )}
          </div>
        </div>

        {/* Company B Card Column */}
        <div className="lg:col-span-5 rounded-card border border-border-custom bg-card/45 p-6 glass-panel space-y-6">
          <div className="flex items-center justify-between border-b border-border-custom/50 pb-4">
            <span className="text-xs font-bold text-accent-secondary uppercase tracking-widest">Offer Package B</span>
            <button
              onClick={() => syncToAverages('B')}
              className="flex items-center gap-1 text-[10px] uppercase font-bold text-text-secondary hover:text-text-primary transition-colors"
            >
              <RefreshCw className="h-3 w-3" />
              Reset to Average
            </button>
          </div>

          {/* Selectors */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <span className="text-[10px] text-text-secondary uppercase font-semibold block mb-1">Company</span>
              <select
                value={compB}
                onChange={e => setCompB(e.target.value)}
                className="w-full rounded-lg border border-border-custom bg-bg-primary p-2 text-xs text-text-primary outline-none focus:border-accent-primary"
              >
                {companiesList.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            
            <div>
              <span className="text-[10px] text-text-secondary uppercase font-semibold block mb-1">Role</span>
              <select
                value={roleB}
                onChange={e => setRoleB(e.target.value)}
                className="w-full rounded-lg border border-border-custom bg-bg-primary p-2 text-xs text-text-primary outline-none focus:border-accent-primary"
              >
                {rolesList.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div>
              <span className="text-[10px] text-text-secondary uppercase font-semibold block mb-1">Level</span>
              <select
                value={levelB}
                onChange={e => setLevelB(e.target.value)}
                className="w-full rounded-lg border border-border-custom bg-bg-primary p-2 text-xs text-text-primary outline-none focus:border-accent-primary"
              >
                {levelsB.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>

          {/* Sliders Console */}
          <div className="space-y-4 pt-4 border-t border-border-custom/50">
            {/* Base Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-text-secondary font-semibold">Base Salary ($k)</span>
                <span className="text-text-primary font-bold">${baseB}k</span>
              </div>
              <input
                type="range"
                min="0"
                max="500"
                value={baseB}
                onChange={e => setBaseB(parseInt(e.target.value, 10))}
                className="w-full h-1 bg-hover-custom rounded-lg appearance-none cursor-pointer accent-accent-secondary"
              />
            </div>

            {/* Stock Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-text-secondary font-semibold">Stock / yr ($k)</span>
                <span className="text-text-primary font-bold">${stockB}k</span>
              </div>
              <input
                type="range"
                min="0"
                max="800"
                value={stockB}
                onChange={e => setStockB(parseInt(e.target.value, 10))}
                className="w-full h-1 bg-hover-custom rounded-lg appearance-none cursor-pointer accent-accent-secondary"
              />
            </div>

            {/* Bonus Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-text-secondary font-semibold">Bonus / yr ($k)</span>
                <span className="text-text-primary font-bold">${bonusB}k</span>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                value={bonusB}
                onChange={e => setBonusB(parseInt(e.target.value, 10))}
                className="w-full h-1 bg-hover-custom rounded-lg appearance-none cursor-pointer accent-accent-secondary"
              />
            </div>
          </div>

          {/* Summary Box */}
          <div className="pt-6 border-t border-border-custom/50 flex justify-between items-center">
            <div>
              <span className="text-[10px] text-text-secondary block uppercase font-semibold">Total Comp B</span>
              <span className="text-2xl font-extrabold text-text-primary">{formatCurrency(totalB)}</span>
            </div>
            <span className="text-xs font-bold bg-accent-secondary/10 border border-accent-secondary/20 text-accent-secondary rounded-lg px-3 py-1.5">
              {compB} {levelB}
            </span>
          </div>
        </div>

      </div>

      {/* Structured Insights Narrative Banner */}
      <div className="rounded-card border border-border-custom bg-card/25 p-5 glass-panel flex flex-col md:flex-row items-start gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-primary/10 text-accent-primary">
          <Sparkles className="h-5 w-5 animate-pulse" />
        </span>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-text-primary">Compensation Delta Narrative Summary</h4>
          <p className="text-xs text-text-secondary leading-relaxed max-w-4xl">
            {getNarrative()}
          </p>
        </div>
      </div>

      {/* Dual Bar Visual Comparison Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Math Table Breakdown of Deltas */}
        <div className="lg:col-span-6 rounded-card border border-border-custom bg-card p-6 space-y-4">
          <h3 className="text-base font-bold text-text-primary tracking-tight">Allocation Details Matrix</h3>
          <div className="space-y-4 pt-2">
            
            {/* Base Allocation row */}
            <div className="flex justify-between items-center border-b border-border-custom/50 pb-2.5 text-sm">
              <span className="text-text-secondary font-semibold">Base Salary</span>
              <div className="flex items-center gap-6">
                <span>${baseA}k vs ${baseB}k</span>
                <span className={`font-bold w-16 text-right ${baseDelta > 0 ? 'text-accent-primary' : baseDelta < 0 ? 'text-accent-secondary' : 'text-text-primary'}`}>
                  {baseDelta > 0 ? `+$${baseDelta}k` : baseDelta < 0 ? `-$${Math.abs(baseDelta)}k` : '—'}
                </span>
              </div>
            </div>

            {/* Stock Allocation row */}
            <div className="flex justify-between items-center border-b border-border-custom/50 pb-2.5 text-sm">
              <span className="text-text-secondary font-semibold">Stock Grants / yr</span>
              <div className="flex items-center gap-6">
                <span>${stockA}k vs ${stockB}k</span>
                <span className={`font-bold w-16 text-right ${stockDelta > 0 ? 'text-accent-primary' : stockDelta < 0 ? 'text-accent-secondary' : 'text-text-primary'}`}>
                  {stockDelta > 0 ? `+$${stockDelta}k` : stockDelta < 0 ? `-$${Math.abs(stockDelta)}k` : '—'}
                </span>
              </div>
            </div>

            {/* Bonus Allocation row */}
            <div className="flex justify-between items-center border-b border-border-custom/50 pb-2.5 text-sm">
              <span className="text-text-secondary font-semibold">Bonus / yr</span>
              <div className="flex items-center gap-6">
                <span>${bonusA}k vs ${bonusB}k</span>
                <span className={`font-bold w-16 text-right ${bonusDelta > 0 ? 'text-accent-primary' : bonusDelta < 0 ? 'text-accent-secondary' : 'text-text-primary'}`}>
                  {bonusDelta > 0 ? `+$${bonusDelta}k` : bonusDelta < 0 ? `-$${Math.abs(bonusDelta)}k` : '—'}
                </span>
              </div>
            </div>

            {/* Total TC row */}
            <div className="flex justify-between items-center text-sm font-bold pt-1">
              <span className="text-text-primary">Total Compensation</span>
              <div className="flex items-center gap-6 text-base">
                <span>${totalA}k vs ${totalB}k</span>
                <span className={`w-16 text-right ${tcDelta > 0 ? 'text-accent-primary' : tcDelta < 0 ? 'text-accent-secondary' : 'text-text-primary'}`}>
                  {tcDelta > 0 ? `+$${tcDelta}k` : tcDelta < 0 ? `-$${Math.abs(tcDelta)}k` : '—'}
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Recharts Comparison Stack */}
        <div className="lg:col-span-6 rounded-card border border-border-custom bg-card/25 p-6 glass-panel">
          <h3 className="text-base font-bold text-text-primary tracking-tight mb-4">Allocation Chart Delta</h3>
          <ComparisonBars
            companyA={{ name: compA, level: levelA, base: baseA, stock: stockA, bonus: bonusA, totalCompensation: totalA }}
            companyB={{ name: compB, level: levelB, base: baseB, stock: stockB, bonus: bonusB, totalCompensation: totalB }}
          />
        </div>
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 w-full text-center text-text-secondary">
        Loading comparison console...
      </div>
    }>
      <ComparePageContent />
    </Suspense>
  );
}
