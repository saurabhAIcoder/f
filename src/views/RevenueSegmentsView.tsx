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
import { Layers, PieChart as PieIcon, Sliders } from 'lucide-react';
import { DashboardData, DashboardFilters, SegmentTidyRow } from '../types/dashboard';
import { DataTable, Column } from '../components/DataTable';
import { formatCurrencyEUR, formatPercent } from '../utils/dataLoader';

interface RevenueSegmentsViewProps {
  data: DashboardData;
  filters: DashboardFilters;
}

const SEGMENT_COLORS = [
  '#6366f1',
  '#06b6d4',
  '#10b981',
  '#f59e0b',
  '#ec4899',
  '#8b5cf6',
  '#3b82f6',
];

export const RevenueSegmentsView: React.FC<RevenueSegmentsViewProps> = ({
  data,
  filters,
}) => {
  const [selectedDim, setSelectedDim] = useState<string>('Product Category');

  // Filter segments by selected dimension
  const filteredSegsByDim = useMemo(() => {
    return data.segmentTidy.filter((r) => r.dimension === selectedDim);
  }, [data.segmentTidy, selectedDim]);

  // Unique segments for selected dimension
  const segmentsInDim = useMemo(() => {
    return Array.from(new Set(filteredSegsByDim.map((r) => r.segment)));
  }, [filteredSegsByDim]);

  // Transform data for line chart (Year vs Segment values)
  const lineChartData = useMemo(() => {
    const map: Record<number, any> = {};
    data.availableYears.forEach((y) => {
      map[y] = { year: `FY${y}`, fiscal_year: y };
    });

    filteredSegsByDim.forEach((r) => {
      if (map[r.fiscal_year]) {
        map[r.fiscal_year][r.segment] = r.value ?? 0;
      }
    });

    return Object.values(map);
  }, [filteredSegsByDim, data.availableYears]);

  // Segment Share & Comparison for selected year (or latest year if All)
  const activeYear = filters.selectedYear === 'All' ? 2023 : filters.selectedYear;
  const barChartData = useMemo(() => {
    const yearSegs = filteredSegsByDim.filter((r) => r.fiscal_year === activeYear);
    return yearSegs.map((s) => ({
      segment: s.segment,
      Revenue: s.value ?? 0,
      'Share %': s.share_pct ? Number(s.share_pct.toFixed(1)) : 0,
    }));
  }, [filteredSegsByDim, activeYear]);

  // Columns for Segment Table
  const tableColumns: Column<SegmentTidyRow>[] = [
    {
      key: 'fiscal_year',
      header: 'Fiscal Year',
      accessor: (r) => r.fiscal_year,
      render: (r) => <span className="font-bold text-white">FY {r.fiscal_year}</span>,
      sortable: true,
    },
    {
      key: 'dimension',
      header: 'Dimension',
      accessor: (r) => r.dimension,
      render: (r) => (
        <span className="bg-slate-800 text-indigo-300 px-2 py-0.5 rounded text-xs">
          {r.dimension}
        </span>
      ),
    },
    {
      key: 'segment',
      header: 'Segment / Category',
      accessor: (r) => r.segment,
      render: (r) => <span className="font-semibold text-slate-100">{r.segment}</span>,
    },
    {
      key: 'value',
      header: 'Value (€M)',
      accessor: (r) => r.value,
      render: (r) => formatCurrencyEUR(r.value),
      align: 'right',
    },
    {
      key: 'share_pct',
      header: 'Share of Dim %',
      accessor: (r) => r.share_pct,
      render: (r) => formatPercent(r.share_pct ?? null),
      align: 'right',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title & Dimension Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" /> Segment & Product Category Analysis
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Dynamic business dimension performance parsing across Footwear, Apparel, Brands & Channels.
          </p>
        </div>

        {/* Dimension Selector Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1.5 rounded-xl text-xs">
          <span className="text-slate-400 font-medium px-2 flex items-center gap-1">
            <Sliders className="w-3.5 h-3.5 text-indigo-400" /> Dimension:
          </span>
          {data.availableDimensions.map((dim) => {
            const isActive = selectedDim === dim;
            return (
              <button
                key={dim}
                onClick={() => setSelectedDim(dim)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {dim}
              </button>
            );
          })}
        </div>
      </div>

      {/* Segment Line Chart & Bar Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Segment Trend Multi-Line Chart */}
        <div className="card-glass rounded-xl p-5 border border-slate-800/80 shadow-xl">
          <div className="mb-4">
            <h3 className="text-base font-bold text-white tracking-tight">
              {selectedDim} Revenue Trend (2016–2023)
            </h3>
            <p className="text-xs text-slate-400">Historical performance (€ Million) by {selectedDim}</p>
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
                {segmentsInDim.map((seg, idx) => (
                  <Line
                    key={seg}
                    type="monotone"
                    dataKey={seg}
                    stroke={SEGMENT_COLORS[idx % SEGMENT_COLORS.length]}
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Segment Share Bar Chart for Active Year */}
        <div className="card-glass rounded-xl p-5 border border-slate-800/80 shadow-xl">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                FY {activeYear} Segment Revenue Breakdown
              </h3>
              <p className="text-xs text-slate-400">Comparative revenue contribution and percentage share</p>
            </div>
            <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs px-2.5 py-1 rounded-full font-mono">
              FY {activeYear}
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="segment" stroke="#94a3b8" tickLine={false} />
                <YAxis stroke="#94a3b8" tickFormatter={(v) => `€${v}M`} />
                <Tooltip
                  formatter={(val: any, name: any) => [
                    name === 'Share %' ? `${val}%` : formatCurrencyEUR(val),
                    name,
                  ]}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                />
                <Legend />
                <Bar dataKey="Revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Segment Summary Data Table */}
      <DataTable
        title={`Segment Data Matrix (${selectedDim})`}
        subtitle="Raw segment entries, revenue figures, and percentage shares"
        data={filteredSegsByDim}
        columns={tableColumns}
        exportFilename={`Adidas_Segment_${selectedDim.replace(/\s+/g, '_')}.csv`}
        pageSize={10}
      />
    </div>
  );
};
