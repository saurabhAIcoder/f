import React from 'react';
import { RotateCcw, Calendar, ShieldCheck, Menu, X } from 'lucide-react';
import { DashboardFilters } from '../types/dashboard';

interface HeaderProps {
  filters: DashboardFilters;
  onResetFilters: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  filters,
  onResetFilters,
  mobileMenuOpen,
  setMobileMenuOpen,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#0b0f19]/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Title & Badge */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-400 hover:text-white bg-slate-800/60 rounded-lg"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl lg:text-2xl font-bold text-white tracking-tight">
                Financial & Business Performance
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <ShieldCheck className="w-3.5 h-3.5" /> Executive Analytics
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              2016–2023 Performance Analysis & Corporate Intelligence
            </p>
          </div>
        </div>

        {/* Right Header Status Controls */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            <span>Period: <strong className="text-white font-medium">2016–2023</strong></span>
            {filters.selectedYear !== 'All' && (
              <span className="bg-indigo-600 text-white px-1.5 py-0.5 rounded font-mono text-[11px]">
                FY{filters.selectedYear}
              </span>
            )}
          </div>

          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition-colors shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Reset Filters</span>
          </button>
        </div>
      </div>
    </header>
  );
};
