import React from 'react';
import { Filter, X, ChevronDown } from 'lucide-react';
import { DashboardData, DashboardFilters } from '../types/dashboard';

interface FilterBarProps {
  data: DashboardData;
  filters: DashboardFilters;
  onFilterChange: (key: keyof DashboardFilters, value: any) => void;
  onResetFilters: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  data,
  filters,
  onFilterChange,
  onResetFilters,
}) => {
  const isFiltered =
    filters.selectedYear !== 'All' ||
    filters.selectedSegment !== 'All' ||
    filters.selectedGeography !== 'All' ||
    filters.selectedGeoBasis !== 'All' ||
    filters.selectedExpenseCategory !== 'All';

  return (
    <div className="bg-slate-900/90 border-b border-slate-800/80 px-4 lg:px-8 py-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Filter Title */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
          <Filter className="w-4 h-4 text-indigo-400" />
          <span>Global Controls & Filters</span>
          {isFiltered && (
            <span className="bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full text-[10px] font-normal border border-indigo-500/30">
              Active Filters
            </span>
          )}
        </div>

        {/* Filter Inputs Grid */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          {/* Fiscal Year Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1.5">
            <span className="text-slate-400 font-medium">Year:</span>
            <select
              value={filters.selectedYear}
              onChange={(e) =>
                onFilterChange(
                  'selectedYear',
                  e.target.value === 'All' ? 'All' : Number(e.target.value)
                )
              }
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer pr-1"
            >
              <option value="All" className="bg-slate-900 text-white">All Years (2016-23)</option>
              {data.availableYears.map((year) => (
                <option key={year} value={year} className="bg-slate-900 text-white">
                  FY {year}
                </option>
              ))}
            </select>
          </div>

          {/* Product / Segment Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1.5">
            <span className="text-slate-400 font-medium">Segment:</span>
            <select
              value={filters.selectedSegment}
              onChange={(e) => onFilterChange('selectedSegment', e.target.value)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer max-w-[150px] truncate"
            >
              <option value="All" className="bg-slate-900 text-white">All Segments</option>
              {data.availableSegments.map((seg) => (
                <option key={seg} value={seg} className="bg-slate-900 text-white">
                  {seg}
                </option>
              ))}
            </select>
          </div>

          {/* Geography Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1.5">
            <span className="text-slate-400 font-medium">Region:</span>
            <select
              value={filters.selectedGeography}
              onChange={(e) => onFilterChange('selectedGeography', e.target.value)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer max-w-[150px] truncate"
            >
              <option value="All" className="bg-slate-900 text-white">All Regions</option>
              {data.availableGeographies.map((geo) => (
                <option key={geo} value={geo} className="bg-slate-900 text-white">
                  {geo}
                </option>
              ))}
            </select>
          </div>

          {/* Geography Basis Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1.5">
            <span className="text-slate-400 font-medium">Geo Basis:</span>
            <select
              value={filters.selectedGeoBasis}
              onChange={(e) => onFilterChange('selectedGeoBasis', e.target.value)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer max-w-[160px] truncate"
            >
              <option value="All" className="bg-slate-900 text-white">All Reporting Bases</option>
              {data.availableGeoBases.map((basis) => (
                <option key={basis} value={basis} className="bg-slate-900 text-white">
                  {basis}
                </option>
              ))}
            </select>
          </div>

          {/* Expense Category Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1.5">
            <span className="text-slate-400 font-medium">Opex:</span>
            <select
              value={filters.selectedExpenseCategory}
              onChange={(e) => onFilterChange('selectedExpenseCategory', e.target.value)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer max-w-[160px] truncate"
            >
              <option value="All" className="bg-slate-900 text-white">All Opex Categories</option>
              {data.availableExpenseCategories.map((exp) => (
                <option key={exp} value={exp} className="bg-slate-900 text-white">
                  {exp}
                </option>
              ))}
            </select>
          </div>

          {/* Reset button if filtered */}
          {isFiltered && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1 text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 transition-colors"
              title="Clear all filters"
            >
              <X className="w-3.5 h-3.5 text-rose-400" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
