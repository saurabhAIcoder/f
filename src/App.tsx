import React, { useState, useEffect } from 'react';
import { Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { DashboardData, DashboardFilters, NavigationTab } from './types/dashboard';
import { loadDashboardData } from './utils/dataLoader';
import { DashboardLayout } from './components/DashboardLayout';
import { OverviewView } from './views/OverviewView';
import { FinancialPerformanceView } from './views/FinancialPerformanceView';
import { RevenueSegmentsView } from './views/RevenueSegmentsView';
import { GeographyView } from './views/GeographyView';
import { OpexView } from './views/OpexView';
import { WorkforceView } from './views/WorkforceView';
import { YoYAnalysisView } from './views/YoYAnalysisView';
import { DataExplorerView } from './views/DataExplorerView';

const defaultFilters: DashboardFilters = {
  selectedYear: 'All',
  selectedSegment: 'All',
  selectedDimension: 'All',
  selectedGeography: 'All',
  selectedGeoBasis: 'All',
  selectedExpenseCategory: 'All',
};

export function App() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<NavigationTab>('overview');
  const [filters, setFilters] = useState<DashboardFilters>(defaultFilters);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const parsedData = await loadDashboardData();
      setData(parsedData);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to load Excel dataset');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFilterChange = (key: keyof DashboardFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters(defaultFilters);
  };

  // Loading State UI
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] text-white flex flex-col items-center justify-center p-6 space-y-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
          <Loader2 className="w-8 h-8 text-indigo-400 absolute inset-0 m-auto animate-pulse" />
        </div>
        <div className="text-center space-y-1">
          <h2 className="text-lg font-bold tracking-tight">Initializing Dashboard Engine</h2>
          <p className="text-xs text-slate-400 font-mono">
            Parsing ADS_GY_Equity_CLEANED.xlsx & computing financial metrics...
          </p>
        </div>
      </div>
    );
  }

  // Error State UI
  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#0b0f19] text-white flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="bg-rose-500/10 p-4 rounded-2xl border border-rose-500/20 text-rose-400">
          <AlertTriangle className="w-12 h-12" />
        </div>
        <div className="max-w-md space-y-2">
          <h2 className="text-xl font-bold">Failed to Load Dashboard Data</h2>
          <p className="text-xs text-slate-400">
            {error || 'The dataset ADS_GY_Equity_CLEANED.xlsx could not be processed.'}
          </p>
        </div>
        <button
          onClick={fetchData}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-indigo-600/20"
        >
          <RefreshCw className="w-4 h-4" /> Retry Loading Dataset
        </button>
      </div>
    );
  }

  return (
    <DashboardLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      data={data}
      filters={filters}
      onFilterChange={handleFilterChange}
      onResetFilters={handleResetFilters}
    >
      {activeTab === 'overview' && <OverviewView data={data} filters={filters} />}
      {activeTab === 'financial' && <FinancialPerformanceView data={data} filters={filters} />}
      {activeTab === 'segments' && <RevenueSegmentsView data={data} filters={filters} />}
      {activeTab === 'geography' && <GeographyView data={data} filters={filters} />}
      {activeTab === 'opex' && <OpexView data={data} filters={filters} />}
      {activeTab === 'workforce' && <WorkforceView data={data} filters={filters} />}
      {activeTab === 'yoy' && <YoYAnalysisView data={data} filters={filters} />}
      {activeTab === 'explorer' && <DataExplorerView data={data} />}
    </DashboardLayout>
  );
}

export default App;
