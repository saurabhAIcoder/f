import React, { useState, useMemo } from 'react';
import { Percent, Calendar, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { DashboardData, DashboardFilters } from '../types/dashboard';
import { DataTable, Column } from '../components/DataTable';
import {
  calcYoY,
  formatCurrencyEUR,
  formatEUR,
  formatNumber,
  formatPercent,
} from '../utils/dataLoader';

interface YoYAnalysisViewProps {
  data: DashboardData;
  filters: DashboardFilters;
}

interface YoYRow {
  metric: string;
  code: string;
  unit: string;
  currentValue: number | null;
  previousValue: number | null;
  changeAmount: number | null;
  yoyPct: number | null;
  formatter: (v: number | null) => string;
}

export const YoYAnalysisView: React.FC<YoYAnalysisViewProps> = ({ data, filters }) => {
  const [selectedYear, setSelectedYear] = useState<number>(
    filters.selectedYear === 'All' ? 2023 : filters.selectedYear
  );

  const prevYear = selectedYear - 1;

  const currentIs = data.incomeStatementWide.find((r) => r.fiscal_year === selectedYear);
  const prevIs = data.incomeStatementWide.find((r) => r.fiscal_year === prevYear);

  const currentWf = data.workforce.find((w) => w.fiscal_year === selectedYear);
  const prevWf = data.workforce.find((w) => w.fiscal_year === prevYear);

  // Generate YoY rows for major financial & business metrics
  const yoyRows: YoYRow[] = useMemo(() => {
    const list: {
      metric: string;
      code: string;
      unit: string;
      cur: number | null;
      prev: number | null;
      fmt: (v: number | null) => string;
    }[] = [
      {
        metric: 'Total Revenue',
        code: 'IS_REV_TOT',
        unit: '€M',
        cur: currentIs?.IS_REV_TOT ?? null,
        prev: prevIs?.IS_REV_TOT ?? null,
        fmt: (v) => formatCurrencyEUR(v),
      },
      {
        metric: 'Gross Profit',
        code: 'IS_GP',
        unit: '€M',
        cur: currentIs?.IS_GP ?? null,
        prev: prevIs?.IS_GP ?? null,
        fmt: (v) => formatCurrencyEUR(v),
      },
      {
        metric: 'Operating Profit (EBIT)',
        code: 'IS_EBIT',
        unit: '€M',
        cur: currentIs?.IS_EBIT ?? null,
        prev: prevIs?.IS_EBIT ?? null,
        fmt: (v) => formatCurrencyEUR(v),
      },
      {
        metric: 'Net Income',
        code: 'IS_NI',
        unit: '€M',
        cur: currentIs?.IS_NI ?? null,
        prev: prevIs?.IS_NI ?? null,
        fmt: (v) => formatCurrencyEUR(v),
      },
      {
        metric: 'EPS (Basic)',
        code: 'IS_EPSB',
        unit: '€',
        cur: currentIs?.IS_EPSB ?? null,
        prev: prevIs?.IS_EPSB ?? null,
        fmt: (v) => formatEUR(v),
      },
      {
        metric: 'Dividend Per Share (DPS)',
        code: 'IS_DPS',
        unit: '€',
        cur: currentIs?.IS_DPS ?? null,
        prev: prevIs?.IS_DPS ?? null,
        fmt: (v) => formatEUR(v),
      },
      {
        metric: 'Wholesale Revenue',
        code: 'IS_REV_WS',
        unit: '€M',
        cur: currentIs?.IS_REV_WS ?? null,
        prev: prevIs?.IS_REV_WS ?? null,
        fmt: (v) => formatCurrencyEUR(v),
      },
      {
        metric: 'Retail Revenue',
        code: 'IS_REV_RT',
        unit: '€M',
        cur: currentIs?.IS_REV_RT ?? null,
        prev: prevIs?.IS_REV_RT ?? null,
        fmt: (v) => formatCurrencyEUR(v),
      },
      {
        metric: 'Employees (FTE)',
        code: 'employees_fte',
        unit: 'FTE',
        cur: currentWf?.employees_fte ?? null,
        prev: prevWf?.employees_fte ?? null,
        fmt: (v) => formatNumber(v),
      },
      {
        metric: 'Revenue / Employee',
        code: 'rev_per_emp',
        unit: '€000',
        cur: currentWf?.revenue_per_employee_eur000 ?? null,
        prev: prevWf?.revenue_per_employee_eur000 ?? null,
        fmt: (v) => formatNumber(v, 1),
      },
    ];

    return list.map((item) => {
      const changeAmount = item.cur !== null && item.prev !== null ? item.cur - item.prev : null;
      const yoyPct = calcYoY(item.cur, item.prev);
      return {
        metric: item.metric,
        code: item.code,
        unit: item.unit,
        currentValue: item.cur,
        previousValue: item.prev,
        changeAmount,
        yoyPct,
        formatter: item.fmt,
      };
    });
  }, [currentIs, prevIs, currentWf, prevWf]);

  const tableColumns: Column<YoYRow>[] = [
    {
      key: 'metric',
      header: 'Financial / Operational Metric',
      accessor: (r) => r.metric,
      render: (r) => (
        <div className="flex items-center gap-2">
          <span className="font-bold text-white">{r.metric}</span>
          <span className="bg-slate-800 text-indigo-400 font-mono text-[10px] px-1.5 py-0.5 rounded">
            {r.code}
          </span>
        </div>
      ),
    },
    {
      key: 'currentValue',
      header: `FY ${selectedYear} (Current)`,
      accessor: (r) => r.currentValue,
      render: (r) => <span className="font-semibold text-slate-100">{r.formatter(r.currentValue)}</span>,
      align: 'right',
    },
    {
      key: 'previousValue',
      header: `FY ${prevYear} (Previous)`,
      accessor: (r) => r.previousValue,
      render: (r) => <span className="text-slate-400">{r.formatter(r.previousValue)}</span>,
      align: 'right',
    },
    {
      key: 'changeAmount',
      header: 'YoY Change Value',
      accessor: (r) => r.changeAmount,
      render: (r) => {
        if (r.changeAmount === null) return <span className="text-slate-500">N/A</span>;
        const isPos = r.changeAmount > 0;
        const isNeg = r.changeAmount < 0;
        return (
          <span
            className={isPos ? 'text-emerald-400 font-semibold' : isNeg ? 'text-rose-400 font-semibold' : 'text-slate-400'}
          >
            {isPos ? '+' : ''}
            {r.formatter(r.changeAmount)}
          </span>
        );
      },
      align: 'right',
    },
    {
      key: 'yoyPct',
      header: 'YoY Growth %',
      accessor: (r) => r.yoyPct,
      render: (r) => {
        if (r.yoyPct === null) return <span className="text-slate-500 font-medium">N/A</span>;
        const isPos = r.yoyPct > 0;
        const isNeg = r.yoyPct < 0;
        return (
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-xs ${
              isPos
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : isNeg
                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {isPos ? <TrendingUp className="w-3.5 h-3.5" /> : isNeg ? <TrendingDown className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
            {formatPercent(r.yoyPct)}
          </span>
        );
      },
      align: 'right',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title & Year Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Percent className="w-5 h-5 text-indigo-400" /> Dedicated Year-over-Year (YoY) Performance Matrix
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Standardized YoY growth calculation: <code className="bg-slate-900 px-1 py-0.5 rounded text-indigo-300">((Current - Previous) / |Previous|) * 100</code>
          </p>
        </div>

        {/* Fiscal Year Comparison Picker */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-2 rounded-xl text-xs">
          <Calendar className="w-4 h-4 text-indigo-400" />
          <span className="text-slate-300 font-semibold">Comparing FY:</span>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="bg-slate-950 text-white font-bold px-2 py-1 rounded border border-slate-800 cursor-pointer focus:outline-none"
          >
            {data.availableYears.filter((y) => y > 2016).map((year) => (
              <option key={year} value={year}>
                FY {year} vs FY {year - 1}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* YoY Table Matrix */}
      <DataTable
        title={`Year-over-Year Performance Breakdown (FY ${selectedYear} vs FY ${prevYear})`}
        subtitle="Automated percentage changes with color-coded directional badges"
        data={yoyRows}
        columns={tableColumns}
        exportFilename={`Adidas_YoY_Performance_FY${selectedYear}.csv`}
        pageSize={10}
      />
    </div>
  );
};
