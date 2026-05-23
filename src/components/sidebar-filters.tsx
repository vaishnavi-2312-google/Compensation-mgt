'use client';

import { Search, ChevronDown, ChevronRight, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarFiltersProps {
  filters: {
    search: string;
    companies: string[];
    roles: string[];
    levels: string[];
    locations: string[];
    minComp: number;
    maxComp: number;
  };
  setFilters: (filters: any) => void;
  uniqueCompanies: string[];
  uniqueLocations: string[];
  uniqueLevels: string[];
  onReset: () => void;
}

export default function SidebarFilters({
  filters,
  setFilters,
  uniqueCompanies,
  uniqueLocations,
  uniqueLevels,
  onReset,
}: SidebarFiltersProps) {
  const [openSections, setOpenSections] = useState({
    companies: true,
    roles: true,
    levels: true,
    locations: true,
    compensation: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSearchChange = (val: string) => {
    setFilters((prev: any) => ({ ...prev, search: val }));
  };

  const handleCheckboxChange = (category: 'companies' | 'roles' | 'levels' | 'locations', item: string) => {
    setFilters((prev: any) => {
      const list = [...prev[category]];
      if (list.includes(item)) {
        return { ...prev, [category]: list.filter(i => i !== item) };
      } else {
        return { ...prev, [category]: [...list, item] };
      }
    });
  };

  const handleCompChange = (type: 'minComp' | 'maxComp', val: number) => {
    setFilters((prev: any) => ({ ...prev, [type]: val }));
  };

  const rolesList = ['Software Engineer', 'Product Designer', 'Product Manager'];
  const levelsList = ['Junior (L3)', 'Mid (L4)', 'Senior (L5)', 'Staff (L6)', 'Principal (L7)'];

  return (
    <div className="space-y-6 w-full pr-0 md:pr-4">
      {/* Search Input */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Search Platform</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            placeholder="Search company, level, title..."
            value={filters.search}
            onChange={e => handleSearchChange(e.target.value)}
            className="w-full rounded-input border border-border-custom bg-card/50 py-2.5 pl-10 pr-4 text-sm text-text-primary placeholder-text-secondary outline-none ring-accent-primary focus:border-accent-primary focus:ring-1"
          />
        </div>
      </div>

      {/* Header with Clear Filter */}
      <div className="flex items-center justify-between border-b border-border-custom pb-3 pt-2">
        <h3 className="text-sm font-bold text-text-primary tracking-tight">Active Filters</h3>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
        >
          <RotateCcw className="h-3 w-3" />
          Reset All
        </button>
      </div>

      {/* Roles Section */}
      <div className="space-y-2">
        <button
          onClick={() => toggleSection('roles')}
          className="flex w-full items-center justify-between text-xs font-bold uppercase tracking-wider text-text-secondary hover:text-text-primary"
        >
          <span>Job Roles</span>
          {openSections.roles ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        </button>
        <AnimatePresence initial={false}>
          {openSections.roles && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden space-y-2 pt-1"
            >
              {rolesList.map(role => (
                <label key={role} className="flex items-center gap-2.5 text-sm text-text-secondary hover:text-text-primary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.roles.includes(role)}
                    onChange={() => handleCheckboxChange('roles', role)}
                    className="h-4 w-4 rounded border-border-custom bg-card text-accent-primary focus:ring-0 accent-accent-primary cursor-pointer"
                  />
                  <span>{role}</span>
                </label>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Companies Section */}
      <div className="space-y-2">
        <button
          onClick={() => toggleSection('companies')}
          className="flex w-full items-center justify-between text-xs font-bold uppercase tracking-wider text-text-secondary hover:text-text-primary"
        >
          <span>Companies</span>
          {openSections.companies ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        </button>
        <AnimatePresence initial={false}>
          {openSections.companies && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden space-y-2 pt-1 max-h-[180px] overflow-y-auto"
            >
              {uniqueCompanies.map(comp => (
                <label key={comp} className="flex items-center gap-2.5 text-sm text-text-secondary hover:text-text-primary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.companies.includes(comp)}
                    onChange={() => handleCheckboxChange('companies', comp)}
                    className="h-4 w-4 rounded border-border-custom bg-card text-accent-primary focus:ring-0 accent-accent-primary cursor-pointer"
                  />
                  <span>{comp}</span>
                </label>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Levels Section */}
      <div className="space-y-2">
        <button
          onClick={() => toggleSection('levels')}
          className="flex w-full items-center justify-between text-xs font-bold uppercase tracking-wider text-text-secondary hover:text-text-primary"
        >
          <span>Standardized Levels</span>
          {openSections.levels ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        </button>
        <AnimatePresence initial={false}>
          {openSections.levels && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden space-y-2 pt-1"
            >
              {levelsList.map(lvl => (
                <label key={lvl} className="flex items-center gap-2.5 text-sm text-text-secondary hover:text-text-primary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.levels.includes(lvl)}
                    onChange={() => handleCheckboxChange('levels', lvl)}
                    className="h-4 w-4 rounded border-border-custom bg-card text-accent-primary focus:ring-0 accent-accent-primary cursor-pointer"
                  />
                  <span>{lvl}</span>
                </label>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Locations Section */}
      <div className="space-y-2">
        <button
          onClick={() => toggleSection('locations')}
          className="flex w-full items-center justify-between text-xs font-bold uppercase tracking-wider text-text-secondary hover:text-text-primary"
        >
          <span>Geographic Location</span>
          {openSections.locations ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        </button>
        <AnimatePresence initial={false}>
          {openSections.locations && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden space-y-2 pt-1 max-h-[180px] overflow-y-auto"
            >
              {uniqueLocations.map(loc => (
                <label key={loc} className="flex items-center gap-2.5 text-sm text-text-secondary hover:text-text-primary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.locations.includes(loc)}
                    onChange={() => handleCheckboxChange('locations', loc)}
                    className="h-4 w-4 rounded border-border-custom bg-card text-accent-primary focus:ring-0 accent-accent-primary cursor-pointer"
                  />
                  <span>{loc}</span>
                </label>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Compensation Range Section */}
      <div className="space-y-3">
        <button
          onClick={() => toggleSection('compensation')}
          className="flex w-full items-center justify-between text-xs font-bold uppercase tracking-wider text-text-secondary hover:text-text-primary"
        >
          <span>Total Compensation ($k)</span>
          {openSections.compensation ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        </button>
        <AnimatePresence initial={false}>
          {openSections.compensation && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden space-y-4 pt-1"
            >
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <span className="text-[10px] text-text-secondary uppercase">Min TC</span>
                  <input
                    type="number"
                    value={filters.minComp || ''}
                    onChange={e => handleCompChange('minComp', Math.max(0, parseInt(e.target.value || '0', 10)))}
                    className="w-full rounded-lg border border-border-custom bg-card/30 p-2 text-xs text-text-primary outline-none focus:border-accent-primary"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-text-secondary uppercase">Max TC</span>
                  <input
                    type="number"
                    value={filters.maxComp || ''}
                    onChange={e => handleCompChange('maxComp', Math.max(0, parseInt(e.target.value || '0', 10)))}
                    className="w-full rounded-lg border border-border-custom bg-card/30 p-2 text-xs text-text-primary outline-none focus:border-accent-primary"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
