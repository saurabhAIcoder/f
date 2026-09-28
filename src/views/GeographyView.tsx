import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Globe, MapPin, Filter } from 'lucide-react';
import { DashboardData, DashboardFilters, GeographyTidyRow } from '../types/dashboard';
import { DataTable, Column } from '../components/DataTable';
import { formatCurrencyEUR, formatPercent } from '../utils/dataLoader';

interface GeographyViewProps {
  data: DashboardData;
  filters: DashboardFilters;
}

const REGION_COLORS: Record<string, string> = {
  EMEA: '#6366f1',
  'North America': '#06b6d4',
  'Greater China': '#10b981',
  'Asia-Pacific': '#f59e0b',
  'Latin America': '#ec4899',
  'Other Businesses': '#8b5cf6',
  'Western Europe': '#3b82f6',
  'Russia/CIS': '#ef4444',
  'Other Asian Markets': '#14b8a6',
  'Emerging Markets': '#f97316',
};

export const GeographyView: React.FC<GeographyViewProps> = ({ data, filters }) => {
  const [selectedBasis, setSelectedBasis] = useState<string>('Restated (comparable)');

  // Filter geography rows by selected basis
  const filteredGeo = useMemo(() => {
    let list = data.geographyTidy;
    if (selectedBasis !== 'All') {
      list = list.filter((r) => r.basis === selectedBasis);
    }
    if (filters.selectedGeography !== 'All') {
      list = list.filter((r) => r.region_comparable === filters.selectedGeography);
    }
    return list;
  }, [data.geographyTidy, selectedBasis, filters.selectedGeography]);

  // Unique regions in current filtered set
  const regionsInBasis = useMemo(() => {
    return Array.from(new Set(filteredGeo.map((r) => r.region_comparable)));
  }, [filteredGeo]);

  // Line chart data structure (Year vs Regions)
  const lineChartData = useMemo(() => {
    const map: Record<number, any> = {};
    data.availableYears.forEach((y) => {
      map[y] = { year: `FY${y}`, fiscal_year: y };
    });

    filteredGeo.forEach((r) => {
      if (map[r.fiscal_year]) {
        map[r.fiscal_year][r.region_comparable] = r.value ?? 0;
      }
    });

    return Object.values(map);
  }, [filteredGeo, data.availableYears]);

  // Active Year for regional comparison bar chart
  const activeYear = filters.selectedYear === 'All' ? 2023 : filters.selectedYear;

  const barChartData = useMemo(() => {
    const yearGeo = filteredGeo.filter((r) => r.fiscal_year === activeYear);
    return yearGeo.map((g) => ({
      region: g.region_comparable,
      Revenue: g.value ?? 0,
      'Share %': g.share_pct ? Number(g.share_pct.toFixed(1)) : 0,
    })).sort((a, b) => b.Revenue - a.Revenue);
  }, [filteredGeo, activeYear]);

  // Table columns
  const tableColumns: Column<GeographyTidyRow>[] = [
    {
      key: 'fiscal_year',
      header: 'Fiscal Year',
      accessor: (r) => r.fiscal_year,
      render: (r) => <span className="font-bold text-white">FY {r.fiscal_year}</span>,
      sortable: true,
    },
    {
      key: 'region_comparable',
      header: 'Region / Market',
      accessor: (r) => r.region_comparable,
      render: (r) => (
        <span className="font-semibold text-slate-100 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-indigo-400" />
          {r.region_comparable}
        </span>
      ),
    },
    {
      key: 'basis',
      header: 'Reporting Basis',
      accessor: (r) => r.basis,
      render: (r) => (
        <span
          className={`px-2 py-0.5 rounded text-[11px] ${
            r.basis.includes('Restated')
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
              : 'bg-slate-800 text-slate-400'
          }`}
        >
          {r.basis}
        </span>
      ),
    },
    {
      key: 'value',
      header: 'Revenue / Value (€M)',
      accessor: (r) => r.value,
      render: (r) => formatCurrencyEUR(r.value),
      align: 'right',
    },
    {
      key: 'share_pct',
      header: 'Regional Share %',
      accessor: (r) => r.share_pct,
      render: (r) => formatPercent(r.share_pct ?? null),
      align: 'right',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title & Reporting Basis Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-400" /> Geographical Revenue Analysis
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Regional performance breakdown across EMEA, North America, Greater China, Asia-Pacific & Latin America.
          </p>
        </div>

        {/* Reporting Basis Toggle */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1.5 rounded-xl text-xs">
          <span className="text-slate-400 font-medium px-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-indigo-400" /> Basis:
          </span>
          {['Restated (comparable)', 'As reported FY2020+', 'As reported pre-FY2020', 'All'].map((b) => {
            const isActive = selectedBasis === b;
            return (
              <button
                key={b}
                onClick={() => setSelectedBasis(b)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {b.replace(/\s*\([^)]*\)/, '')}
              </button>
            );
          })}
        </div>
      </div>

      {/* Geographic Line Chart & Regional Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Regional Revenue Trend */}
        <div className="card-glass rounded-xl p-5 border border-slate-800/80 shadow-xl">
          <div className="mb-4">
            <h3 className="text-base font-bold text-white tracking-tight">
              Geographic Revenue Trends ({selectedBasis})
            </h3>
            <p className="text-xs text-slate-400">Regional sales (€ Million) over time</p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="year" stroke="#94a3b8" tickLine={false} />
                <YAxis stroke="#94a3b8" tickFormatter={(v) => `€${v}M`} />
                <Tooltip
                  formatter={(val: any, name: any) => [formatCurrencyEUR(val), name]}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                />
                <Legend />
                {regionsInBasis.map((reg) => (
                  <Line
                    key={reg}
                    type="monotone"
                    dataKey={reg}
                    stroke={REGION_COLORS[reg] || '#6366f1'}
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Regional Bar Comparison */}
        <div className="card-glass rounded-xl p-5 border border-slate-800/80 shadow-xl">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                FY {activeYear} Regional Revenue Ranking
              </h3>
              <p className="text-xs text-slate-400">Sales volume per region (€ Million)</p>
            </div>
            <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs px-2.5 py-1 rounded-full font-mono">
              FY {activeYear}
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} layout="vertical" margin={{ top: 10, right: 20, left: 40, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#94a3b8" tickFormatter={(v) => `€${v}M`} />
                <YAxis dataKey="region" type="category" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val: any) => [formatCurrencyEUR(val), 'Revenue']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                />
                <Bar dataKey="Revenue" fill="#06b6d4" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Geography Summary Data Table */}
      <DataTable
        title="Geographical Data Matrix"
        subtitle="Full regional dataset filtered by reporting basis and region"
        data={filteredGeo}
        columns={tableColumns}
        exportFilename="Adidas_Geography_Data.csv"
        pageSize={10}
      />
    </div>
  );
};
