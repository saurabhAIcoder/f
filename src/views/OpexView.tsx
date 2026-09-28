import React, { useMemo } from 'react';
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
import { PieChart as PieIcon, DollarSign, Percent } from 'lucide-react';
import { DashboardData, DashboardFilters, OpexTidyRow } from '../types/dashboard';
import { DataTable, Column } from '../components/DataTable';
import { formatCurrencyEUR, formatPercent } from '../utils/dataLoader';

interface OpexViewProps {
  data: DashboardData;
  filters: DashboardFilters;
}

const OPEX_COLORS: Record<string, string> = {
  'Marketing and point-of-sale': '#3b82f6',
  'Distribution and selling': '#6366f1',
  'General and administration': '#06b6d4',
  'Sundry expenses': '#8b5cf6',
  'Goodwill / intangible impairment': '#ef4444',
};

export const OpexView: React.FC<OpexViewProps> = ({ data, filters }) => {
  // Filter opex by selected expense category
  const filteredOpex = useMemo(() => {
    if (filters.selectedExpenseCategory === 'All') return data.opexTidy;
    return data.opexTidy.filter((r) => r.expense_line === filters.selectedExpenseCategory);
  }, [data.opexTidy, filters.selectedExpenseCategory]);

  // Stacked Bar Data (Year vs Expense Lines €M)
  const stackedBarData = useMemo(() => {
    const map: Record<number, any> = {};
    data.availableYears.forEach((y) => {
      map[y] = { year: `FY${y}`, fiscal_year: y };
    });

    data.opexTidy.forEach((r) => {
      if (map[r.fiscal_year]) {
        map[r.fiscal_year][r.expense_line] = r.value_eur_mn ?? 0;
      }
    });

    return Object.values(map);
  }, [data.opexTidy, data.availableYears]);

  // Line Chart Data (% of Net Sales)
  const pctLineData = useMemo(() => {
    const map: Record<number, any> = {};
    data.availableYears.forEach((y) => {
      map[y] = { year: `FY${y}`, fiscal_year: y };
    });

    data.opexTidy.forEach((r) => {
      if (map[r.fiscal_year] && r.pct_of_net_sales !== null) {
        map[r.fiscal_year][r.expense_line] = r.pct_of_net_sales;
      }
    });

    return Object.values(map);
  }, [data.opexTidy, data.availableYears]);

  // Table Columns
  const tableColumns: Column<OpexTidyRow>[] = [
    {
      key: 'fiscal_year',
      header: 'Fiscal Year',
      accessor: (r) => r.fiscal_year,
      render: (r) => <span className="font-bold text-white">FY {r.fiscal_year}</span>,
      sortable: true,
    },
    {
      key: 'expense_line',
      header: 'Expense Category',
      accessor: (r) => r.expense_line,
      render: (r) => <span className="font-semibold text-slate-200">{r.expense_line}</span>,
    },
    {
      key: 'value_eur_mn',
      header: 'Amount (€M)',
      accessor: (r) => r.value_eur_mn,
      render: (r) => (r.value_eur_mn !== null ? formatCurrencyEUR(r.value_eur_mn) : <span className="text-slate-500">N/A</span>),
      align: 'right',
    },
    {
      key: 'pct_of_net_sales',
      header: '% of Net Sales',
      accessor: (r) => r.pct_of_net_sales,
      render: (r) => (r.pct_of_net_sales !== null ? `${r.pct_of_net_sales.toFixed(1)}%` : <span className="text-slate-500">N/A</span>),
      align: 'right',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <PieIcon className="w-5 h-5 text-indigo-400" /> Operating Expenses & Cost Structure
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Detailed trend analysis of Marketing, Distribution, G&A, Sundry, and Goodwill impairment expenses.
        </p>
      </div>

      {/* Opex Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Operating Expense Stacked Bar */}
        <div className="card-glass rounded-xl p-5 border border-slate-800/80 shadow-xl">
          <div className="mb-4">
            <h3 className="text-base font-bold text-white tracking-tight">Operating Expense Stacked Breakdown</h3>
            <p className="text-xs text-slate-400">Total expense expenditure by category (€ Million)</p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stackedBarData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="year" stroke="#94a3b8" tickLine={false} />
                <YAxis stroke="#94a3b8" tickFormatter={(v) => `€${v}M`} />
                <Tooltip
                  formatter={(val: any, name: any) => [formatCurrencyEUR(val), name]}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                />
                <Legend />
                {data.availableExpenseCategories.map((exp) => (
                  <Bar key={exp} dataKey={exp} stackId="a" fill={OPEX_COLORS[exp] || '#6366f1'} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense % of Net Sales Line Chart */}
        <div className="card-glass rounded-xl p-5 border border-slate-800/80 shadow-xl">
          <div className="mb-4">
            <h3 className="text-base font-bold text-white tracking-tight">Operating Expenses as % of Net Sales</h3>
            <p className="text-xs text-slate-400">Cost efficiency ratio over time (% of Total Revenue)</p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={pctLineData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="year" stroke="#94a3b8" tickLine={false} />
                <YAxis stroke="#94a3b8" tickFormatter={(v) => `${v}%`} />
                <Tooltip
                  formatter={(val: any, name: any) => [`${val}%`, name]}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                />
                <Legend />
                {data.availableExpenseCategories.map((exp) => (
                  <Line
                    key={exp}
                    type="monotone"
                    dataKey={exp}
                    stroke={OPEX_COLORS[exp] || '#6366f1'}
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Opex Data Table */}
      <DataTable
        title="Operating Expenses Matrix"
        subtitle="Parsed Opex entries with euro figures and revenue percentages"
        data={filteredOpex}
        columns={tableColumns}
        exportFilename="Adidas_Operating_Expenses.csv"
        pageSize={10}
      />
    </div>
  );
};
