import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Users, TrendingUp, Award, UserCheck } from 'lucide-react';
import { DashboardData, DashboardFilters, WorkforceRow } from '../types/dashboard';
import { KPICard } from '../components/KPICard';
import { DataTable, Column } from '../components/DataTable';
import { formatNumber, formatPercent } from '../utils/dataLoader';

interface WorkforceViewProps {
  data: DashboardData;
  filters: DashboardFilters;
}

export const WorkforceView: React.FC<WorkforceViewProps> = ({ data, filters }) => {
  const latestWf = data.workforce[data.workforce.length - 1];
  const prevWf = data.workforce[data.workforce.length - 2];

  // Chart data formatting
  const chartData = data.workforce.map((r) => ({
    year: `FY${r.fiscal_year}`,
    'Employees (FTE)': r.employees_fte ?? 0,
    'Revenue / Employee (€000)': r.revenue_per_employee_eur000 ?? 0,
  }));

  // Table columns
  const tableColumns: Column<WorkforceRow>[] = [
    {
      key: 'fiscal_year',
      header: 'Fiscal Year',
      accessor: (r) => r.fiscal_year,
      render: (r) => <span className="font-bold text-white">FY {r.fiscal_year}</span>,
      sortable: true,
    },
    {
      key: 'employees_fte',
      header: 'Employees (FTE)',
      accessor: (r) => r.employees_fte,
      render: (r) => formatNumber(r.employees_fte),
      align: 'right',
    },
    {
      key: 'employees_yoy_pct',
      header: 'Headcount YoY %',
      accessor: (r) => r.employees_yoy_pct,
      render: (r) => formatPercent(r.employees_yoy_pct ?? null),
      align: 'right',
    },
    {
      key: 'revenue_per_employee_eur000',
      header: 'Revenue / Employee (€000)',
      accessor: (r) => r.revenue_per_employee_eur000,
      render: (r) => formatNumber(r.revenue_per_employee_eur000, 1),
      align: 'right',
    },
    {
      key: 'rev_per_emp_yoy_pct',
      header: 'Productivity YoY %',
      accessor: (r) => r.rev_per_emp_yoy_pct,
      render: (r) => formatPercent(r.rev_per_emp_yoy_pct ?? null),
      align: 'right',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-400" /> Workforce & Productivity Trends
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Analysis of full-time equivalent (FTE) headcount evolution and revenue productivity per employee.
        </p>
      </div>

      {/* Workforce KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Active Headcount"
          code="FTE"
          currentValueFormatted={formatNumber(latestWf.employees_fte)}
          previousValueFormatted={formatNumber(prevWf?.employees_fte ?? null)}
          yoyChangePct={latestWf.employees_yoy_pct ?? null}
          unit="FTE"
          icon={<UserCheck className="w-5 h-5" />}
        />

        <KPICard
          title="Revenue per Employee"
          code="PROD"
          currentValueFormatted={formatNumber(latestWf.revenue_per_employee_eur000, 1)}
          previousValueFormatted={formatNumber(prevWf?.revenue_per_employee_eur000 ?? null, 1)}
          yoyChangePct={latestWf.rev_per_emp_yoy_pct ?? null}
          unit="€000"
          icon={<TrendingUp className="w-5 h-5" />}
        />

        <div className="card-glass rounded-xl p-5 border border-slate-800/80 col-span-1 md:col-span-2 flex items-center gap-4">
          <div className="bg-indigo-600/20 p-3 rounded-xl border border-indigo-500/30 text-indigo-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Productivity Insight
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Headcount stood at <strong className="text-white">{formatNumber(latestWf.employees_fte)} FTE</strong> in FY2023, generating <strong className="text-emerald-400">€{latestWf.revenue_per_employee_eur000}k per employee</strong>, demonstrating consistent operational resilience.
            </p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Headcount FTE Area Chart */}
        <div className="card-glass rounded-xl p-5 border border-slate-800/80 shadow-xl">
          <div className="mb-4">
            <h3 className="text-base font-bold text-white tracking-tight">Full-Time Employees (FTE) Trend</h3>
            <p className="text-xs text-slate-400">Total global workforce headcount (2016–2023)</p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorFte" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="year" stroke="#94a3b8" tickLine={false} />
                <YAxis stroke="#94a3b8" tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip
                  formatter={(val: any) => [formatNumber(val), 'Employees FTE']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                />
                <Area type="monotone" dataKey="Employees (FTE)" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorFte)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue per Employee Line Chart */}
        <div className="card-glass rounded-xl p-5 border border-slate-800/80 shadow-xl">
          <div className="mb-4">
            <h3 className="text-base font-bold text-white tracking-tight">Revenue Productivity per Employee</h3>
            <p className="text-xs text-slate-400">Net Sales generated per FTE (€ Thousands)</p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="year" stroke="#94a3b8" tickLine={false} />
                <YAxis stroke="#94a3b8" tickFormatter={(v) => `€${v}k`} />
                <Tooltip
                  formatter={(val: any) => [`€${val}000`, 'Revenue / Employee']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                />
                <Line type="monotone" dataKey="Revenue / Employee (€000)" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Workforce Summary Table */}
      <DataTable
        title="Workforce & Productivity Matrix"
        subtitle="Annual headcount and efficiency figures"
        data={data.workforce}
        columns={tableColumns}
        exportFilename="Adidas_Workforce_Metrics.csv"
        pageSize={10}
      />
    </div>
  );
};
