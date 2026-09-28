import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { TrendingUp, DollarSign, PieChart, ShieldAlert } from 'lucide-react';
import { DashboardData, DashboardFilters, IncomeStatementWideRow } from '../types/dashboard';
import { DataTable, Column } from '../components/DataTable';
import { formatCurrencyEUR, formatEUR, formatPercent } from '../utils/dataLoader';

interface FinancialPerformanceViewProps {
  data: DashboardData;
  filters: DashboardFilters;
}

export const FinancialPerformanceView: React.FC<FinancialPerformanceViewProps> = ({
  data,
  filters,
}) => {
  // Chart data for Income Statement profitability metrics
  const profitTrendData = data.incomeStatementWide.map((r) => ({
    year: `FY${r.fiscal_year}`,
    'Gross Profit': r.IS_GP ?? 0,
    EBIT: r.IS_EBIT ?? 0,
    'Net Income': r.IS_NI ?? 0,
  }));

  // Shareholder Metrics (EPS & DPS)
  const epsDpsData = data.incomeStatementWide.map((r) => ({
    year: `FY${r.fiscal_year}`,
    'EPS Basic (€)': r.IS_EPSB ?? 0,
    'EPS Diluted (€)': r.IS_EPSD ?? 0,
    'DPS (€)': r.IS_DPS ?? 0,
  }));

  // Columns for Financial Summary Table
  const tableColumns: Column<IncomeStatementWideRow>[] = [
    {
      key: 'fiscal_year',
      header: 'Fiscal Year',
      accessor: (r) => r.fiscal_year,
      render: (r) => <span className="font-bold text-white">FY {r.fiscal_year}</span>,
      sortable: true,
    },
    {
      key: 'IS_REV_TOT',
      header: 'Total Revenue',
      accessor: (r) => r.IS_REV_TOT,
      render: (r) => formatCurrencyEUR(r.IS_REV_TOT),
      align: 'right',
    },
    {
      key: 'IS_GP',
      header: 'Gross Profit',
      accessor: (r) => r.IS_GP,
      render: (r) => formatCurrencyEUR(r.IS_GP),
      align: 'right',
    },
    {
      key: 'gross_margin_pct',
      header: 'Gross Margin',
      accessor: (r) => r.gross_margin_pct,
      render: (r) => formatPercent(r.gross_margin_pct ?? null),
      align: 'right',
    },
    {
      key: 'IS_EBIT',
      header: 'EBIT',
      accessor: (r) => r.IS_EBIT,
      render: (r) => (
        <span className={r.IS_EBIT && r.IS_EBIT < 0 ? 'text-rose-400 font-semibold' : 'text-slate-200'}>
          {formatCurrencyEUR(r.IS_EBIT)}
        </span>
      ),
      align: 'right',
    },
    {
      key: 'ebit_margin_pct',
      header: 'EBIT Margin',
      accessor: (r) => r.ebit_margin_pct,
      render: (r) => formatPercent(r.ebit_margin_pct ?? null),
      align: 'right',
    },
    {
      key: 'IS_EBT',
      header: 'EBT',
      accessor: (r) => r.IS_EBT,
      render: (r) => formatCurrencyEUR(r.IS_EBT),
      align: 'right',
    },
    {
      key: 'IS_NI',
      header: 'Net Income',
      accessor: (r) => r.IS_NI,
      render: (r) => (
        <span className={r.IS_NI && r.IS_NI < 0 ? 'text-rose-400 font-semibold' : 'text-emerald-400 font-semibold'}>
          {formatCurrencyEUR(r.IS_NI)}
        </span>
      ),
      align: 'right',
    },
    {
      key: 'IS_EPSB',
      header: 'EPS Basic',
      accessor: (r) => r.IS_EPSB,
      render: (r) => formatEUR(r.IS_EPSB),
      align: 'right',
    },
    {
      key: 'IS_EPSD',
      header: 'EPS Diluted',
      accessor: (r) => r.IS_EPSD,
      render: (r) => formatEUR(r.IS_EPSD),
      align: 'right',
    },
    {
      key: 'IS_DPS',
      header: 'DPS',
      accessor: (r) => r.IS_DPS,
      render: (r) => (r.IS_DPS !== null ? formatEUR(r.IS_DPS) : <span className="text-slate-500">N/A</span>),
      align: 'right',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-400" /> Income Statement & Profitability Performance
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          In-depth analysis of revenue conversion, operating profit (EBIT), net earnings, and shareholder cash returns.
        </p>
      </div>

      {/* Profitability Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gross Profit, EBIT & Net Income Comparison */}
        <div className="card-glass rounded-xl p-5 border border-slate-800/80 shadow-xl">
          <div className="mb-4">
            <h3 className="text-base font-bold text-white tracking-tight">Income Statement Waterfall Trend</h3>
            <p className="text-xs text-slate-400">Gross Profit (IS_GP), EBIT (IS_EBIT), Net Income (IS_NI) (€ Million)</p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={profitTrendData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="year" stroke="#94a3b8" tickLine={false} />
                <YAxis stroke="#94a3b8" tickFormatter={(v) => `€${v}M`} />
                <Tooltip
                  formatter={(val: any, name: any) => [formatCurrencyEUR(val), name]}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                />
                <Legend />
                <Bar dataKey="Gross Profit" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="EBIT" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Net Income" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Shareholder Metrics (EPS & DPS) */}
        <div className="card-glass rounded-xl p-5 border border-slate-800/80 shadow-xl">
          <div className="mb-4">
            <h3 className="text-base font-bold text-white tracking-tight">Shareholder Metrics (EPS & DPS)</h3>
            <p className="text-xs text-slate-400">Basic EPS (IS_EPSB), Diluted EPS (IS_EPSD), Dividend per Share (IS_DPS) (€)</p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={epsDpsData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="year" stroke="#94a3b8" tickLine={false} />
                <YAxis stroke="#94a3b8" tickFormatter={(v) => `€${v}`} />
                <Tooltip
                  formatter={(val: any, name: any) => [formatEUR(val), name]}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                />
                <Legend />
                <Line type="monotone" dataKey="EPS Basic (€)" stroke="#06b6d4" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="EPS Diluted (€)" stroke="#3b82f6" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} />
                <Line type="monotone" dataKey="DPS (€)" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Financial Summary Table */}
      <DataTable
        title="Income Statement Summary Matrix (2016–2023)"
        subtitle="Full audited financial breakdown with margins, earnings per share, and dividend payouts"
        data={data.incomeStatementWide}
        columns={tableColumns}
        exportFilename="Adidas_Income_Statement_Summary.csv"
        pageSize={10}
      />
    </div>
  );
};
