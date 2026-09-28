import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
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
import { DollarSign, PieChart as PieIcon, TrendingUp, Users, Award, Shield } from 'lucide-react';
import { DashboardData, DashboardFilters, IncomeStatementWideRow } from '../types/dashboard';
import { KPICard } from '../components/KPICard';
import {
  formatCurrencyEUR,
  formatEUR,
  formatNumber,
  formatPercent,
} from '../utils/dataLoader';

interface OverviewViewProps {
  data: DashboardData;
  filters: DashboardFilters;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ data, filters }) => {
  // Filter dataset by selected year if filtered
  const filteredIsWide = React.useMemo(() => {
    if (filters.selectedYear === 'All') return data.incomeStatementWide;
    return data.incomeStatementWide.filter((r) => r.fiscal_year === filters.selectedYear);
  }, [data.incomeStatementWide, filters.selectedYear]);

  // Determine current active metrics for KPI cards
  const latestRow: IncomeStatementWideRow =
    filters.selectedYear === 'All'
      ? data.incomeStatementWide[data.incomeStatementWide.length - 1]
      : data.incomeStatementWide.find((r) => r.fiscal_year === filters.selectedYear) ||
        data.incomeStatementWide[data.incomeStatementWide.length - 1];

  const prevRow: IncomeStatementWideRow | undefined =
    data.incomeStatementWide.find((r) => r.fiscal_year === latestRow.fiscal_year - 1);

  const wfRow = data.workforce.find((w) => w.fiscal_year === latestRow.fiscal_year);
  const prevWfRow = data.workforce.find((w) => w.fiscal_year === latestRow.fiscal_year - 1);

  // Prepare chart data for Revenue Composition
  const revCompData = data.incomeStatementWide.map((r) => ({
    year: `FY${r.fiscal_year}`,
    Wholesale: r.IS_REV_WS ?? 0,
    Retail: r.IS_REV_RT ?? 0,
    Other: r.IS_REV_OTH ?? 0,
    Total: r.IS_REV_TOT ?? 0,
  }));

  // Prepare chart data for Profitability Margins
  const marginsData = data.incomeStatementWide.map((r) => ({
    year: `FY${r.fiscal_year}`,
    'Gross Margin %': r.gross_margin_pct ? Number(r.gross_margin_pct.toFixed(2)) : 0,
    'EBIT Margin %': r.ebit_margin_pct ? Number(r.ebit_margin_pct.toFixed(2)) : 0,
    'Net Profit Margin %': r.net_margin_pct ? Number(r.net_margin_pct.toFixed(2)) : 0,
  }));

  return (
    <div className="space-y-6">
      {/* Executive Summary Cards Header */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-400" /> Executive Financial Overview
          </h2>
          <span className="text-xs text-slate-400">
            Selected Period: <strong className="text-indigo-400">FY {latestRow.fiscal_year}</strong>
          </span>
        </div>

        {/* 8 Core KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Total Revenue */}
          <KPICard
            title="Total Revenue"
            code="IS_REV_TOT"
            currentValueFormatted={formatCurrencyEUR(latestRow.IS_REV_TOT)}
            previousValueFormatted={formatCurrencyEUR(prevRow?.IS_REV_TOT ?? null)}
            yoyChangePct={latestRow.rev_yoy_pct ?? null}
            unit=""
            icon={<DollarSign className="w-5 h-5" />}
          />

          {/* 2. Gross Profit */}
          <KPICard
            title="Gross Profit"
            code="IS_GP"
            currentValueFormatted={formatCurrencyEUR(latestRow.IS_GP)}
            previousValueFormatted={formatCurrencyEUR(prevRow?.IS_GP ?? null)}
            yoyChangePct={latestRow.gp_yoy_pct ?? null}
            unit=""
            icon={<PieIcon className="w-5 h-5" />}
          />

          {/* 3. EBIT */}
          <KPICard
            title="Operating Profit (EBIT)"
            code="IS_EBIT"
            currentValueFormatted={formatCurrencyEUR(latestRow.IS_EBIT)}
            previousValueFormatted={formatCurrencyEUR(prevRow?.IS_EBIT ?? null)}
            yoyChangePct={latestRow.ebit_yoy_pct ?? null}
            unit=""
            icon={<TrendingUp className="w-5 h-5" />}
          />

          {/* 4. Net Income */}
          <KPICard
            title="Net Income"
            code="IS_NI"
            currentValueFormatted={formatCurrencyEUR(latestRow.IS_NI)}
            previousValueFormatted={formatCurrencyEUR(prevRow?.IS_NI ?? null)}
            yoyChangePct={latestRow.ni_yoy_pct ?? null}
            unit=""
            icon={<Award className="w-5 h-5" />}
          />

          {/* 5. EPS Basic */}
          <KPICard
            title="EPS (Basic)"
            code="IS_EPSB"
            currentValueFormatted={formatEUR(latestRow.IS_EPSB)}
            previousValueFormatted={formatEUR(prevRow?.IS_EPSB ?? null)}
            yoyChangePct={latestRow.epsb_yoy_pct ?? null}
            unit=""
            icon={<Shield className="w-5 h-5" />}
          />

          {/* 6. Dividend Per Share */}
          <KPICard
            title="Dividend Per Share"
            code="IS_DPS"
            currentValueFormatted={formatEUR(latestRow.IS_DPS)}
            previousValueFormatted={formatEUR(prevRow?.IS_DPS ?? null)}
            yoyChangePct={latestRow.dps_yoy_pct ?? null}
            unit=""
            icon={<DollarSign className="w-5 h-5" />}
          />

          {/* 7. Employees FTE */}
          <KPICard
            title="Total Employees"
            code="FTE"
            currentValueFormatted={formatNumber(wfRow?.employees_fte ?? null)}
            previousValueFormatted={formatNumber(prevWfRow?.employees_fte ?? null)}
            yoyChangePct={wfRow?.employees_yoy_pct ?? null}
            unit="FTE"
            icon={<Users className="w-5 h-5" />}
          />

          {/* 8. Revenue per Employee */}
          <KPICard
            title="Revenue / Employee"
            code="PROD"
            currentValueFormatted={formatNumber(wfRow?.revenue_per_employee_eur000 ?? null, 1)}
            previousValueFormatted={formatNumber(prevWfRow?.revenue_per_employee_eur000 ?? null, 1)}
            yoyChangePct={wfRow?.rev_per_emp_yoy_pct ?? null}
            unit="€000"
            icon={<TrendingUp className="w-5 h-5" />}
          />
        </div>
      </div>

      {/* Main Revenue & Margins Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend Area Chart */}
        <div className="card-glass rounded-xl p-5 border border-slate-800/80 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Revenue Growth Trend</h3>
              <p className="text-xs text-slate-400">Total Net Sales (IS_REV_TOT) 2016–2023 (€ Million)</p>
            </div>
            <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs px-2.5 py-1 rounded-full font-mono">
              €18.4B - €21.4B
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.incomeStatementWide} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="fiscal_year" stroke="#94a3b8" tickLine={false} />
                <YAxis stroke="#94a3b8" tickFormatter={(val) => `€${val / 1000}kM`} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const row = data.incomeStatementWide.find((r) => r.fiscal_year === label);
                      return (
                        <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl text-xs space-y-1">
                          <p className="font-bold text-white">FY {label}</p>
                          <p className="text-indigo-400">
                            Total Revenue: <strong className="text-white">{formatCurrencyEUR(row?.IS_REV_TOT ?? null)}</strong>
                          </p>
                          <p className="text-emerald-400">
                            YoY Growth: <strong>{formatPercent(row?.rev_yoy_pct ?? null)}</strong>
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area type="monotone" dataKey="IS_REV_TOT" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Profitability Margins Multi-Line Chart */}
        <div className="card-glass rounded-xl p-5 border border-slate-800/80 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Profitability & Margin Analysis</h3>
              <p className="text-xs text-slate-400">Gross %, EBIT %, and Net Profit % Margins Over Time</p>
            </div>
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-2.5 py-1 rounded-full font-mono">
              Gross ~50%
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={marginsData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="year" stroke="#94a3b8" tickLine={false} />
                <YAxis stroke="#94a3b8" tickFormatter={(v) => `${v}%`} />
                <Tooltip
                  formatter={(value: any, name: any) => [`${Number(value).toFixed(2)}%`, name]}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                />
                <Legend />
                <Line type="monotone" dataKey="Gross Margin %" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="EBIT Margin %" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Net Profit Margin %" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Revenue Composition Stacked Bar Chart */}
      <div className="card-glass rounded-xl p-5 border border-slate-800/80 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Revenue Stream Composition</h3>
            <p className="text-xs text-slate-400">Breakdown by Wholesale (IS_REV_WS), Retail (IS_REV_RT), and Other (IS_REV_OTH)</p>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revCompData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="year" stroke="#94a3b8" tickLine={false} />
              <YAxis stroke="#94a3b8" tickFormatter={(v) => `€${v / 1000}kM`} />
              <Tooltip
                formatter={(val: any, name: any) => [formatCurrencyEUR(val), name]}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
              />
              <Legend />
              <Bar dataKey="Wholesale" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} />
              <Bar dataKey="Retail" stackId="a" fill="#06b6d4" radius={[0, 0, 0, 0]} />
              <Bar dataKey="Other" stackId="a" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
