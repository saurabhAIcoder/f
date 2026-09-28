import React, { useState } from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  Layers,
  Globe,
  PieChart,
  Users,
  Percent,
  Database,
  ChevronRight,
  Activity,
} from 'lucide-react';
import { NavigationTab, DashboardData, DashboardFilters } from '../types/dashboard';
import { Header } from './Header';
import { FilterBar } from './FilterBar';

interface DashboardLayoutProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  data: DashboardData;
  filters: DashboardFilters;
  onFilterChange: (key: keyof DashboardFilters, value: any) => void;
  onResetFilters: () => void;
  children: React.ReactNode;
}

interface NavItem {
  id: NavigationTab;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  activeTab,
  setActiveTab,
  data,
  filters,
  onFilterChange,
  onResetFilters,
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'financial', label: 'Financial Performance', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'segments', label: 'Revenue & Segments', icon: <Layers className="w-4 h-4" /> },
    { id: 'geography', label: 'Geography', icon: <Globe className="w-4 h-4" /> },
    { id: 'opex', label: 'Operating Expenses', icon: <PieChart className="w-4 h-4" /> },
    { id: 'workforce', label: 'Workforce', icon: <Users className="w-4 h-4" /> },
    { id: 'yoy', label: 'YoY Analysis', icon: <Percent className="w-4 h-4" /> },
    { id: 'explorer', label: 'Data Explorer', icon: <Database className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col antialiased">
      {/* Top Header */}
      <Header
        filters={filters}
        onResetFilters={onResetFilters}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Global Interactive Filter Bar */}
      <FilterBar
        data={data}
        filters={filters}
        onFilterChange={onFilterChange}
        onResetFilters={onResetFilters}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden lg:flex flex-col w-64 border-r border-slate-800/80 bg-slate-900/60 p-4 space-y-1 shrink-0">
          <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-indigo-400" /> Navigation
          </div>

          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-600/90 text-white shadow-lg shadow-indigo-600/20 border border-indigo-500/30'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-indigo-200" />}
              </button>
            );
          })}

          <div className="mt-auto pt-6 px-3 border-t border-slate-800/60">
            <div className="bg-slate-950/80 rounded-xl p-3.5 border border-slate-800/80">
              <div className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider mb-1">
                Data Source
              </div>
              <p className="text-[11px] text-slate-400">
                Parsed from <span className="text-slate-200 font-mono">ADS_GY_Equity_CLEANED.xlsx</span>
              </p>
              <div className="mt-2 flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Data Validated & Ready</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm flex">
            <div className="w-72 bg-slate-900 h-full p-4 border-r border-slate-800 flex flex-col space-y-2">
              <div className="flex items-center justify-between px-2 pb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Menu Sections
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-slate-400 hover:text-white text-xs font-medium"
                >
                  Close
                </button>
              </div>

              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium ${
                      isActive
                        ? 'bg-indigo-600 text-white font-semibold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-6">
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800/80 px-4 lg:px-8 py-3 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>
          <span className="font-semibold text-slate-300">Financial & Business Performance Dashboard</span>
          <span className="mx-2 text-slate-600">|</span>
          <span>Data period: 2016–2023</span>
        </div>
        <div className="text-[11px] text-slate-400">
          Source: Adidas AG Financial Reporting Dataset (ADS GY Equity)
        </div>
      </footer>
    </div>
  );
};
