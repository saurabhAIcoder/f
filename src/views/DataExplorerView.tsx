import React, { useState } from 'react';
import { Database, FileSpreadsheet, Table } from 'lucide-react';
import { DashboardData } from '../types/dashboard';
import { DataTable, Column } from '../components/DataTable';
import { formatCurrencyEUR, formatEUR, formatNumber, formatPercent } from '../utils/dataLoader';

interface DataExplorerViewProps {
  data: DashboardData;
}

type DatasetKey = 'isWide' | 'isTidy' | 'segment' | 'geography' | 'opex' | 'workforce';

export const DataExplorerView: React.FC<DataExplorerViewProps> = ({ data }) => {
  const [activeDataset, setActiveDataset] = useState<DatasetKey>('isWide');

  const datasets: { key: DatasetKey; label: string; count: number; desc: string }[] = [
    {
      key: 'isWide',
      label: 'Income Statement (Wide)',
      count: data.incomeStatementWide.length,
      desc: 'Annual financial statement metrics across 30 key financial codes',
    },
    {
      key: 'isTidy',
      label: 'Income Statement (Tidy)',
      count: data.incomeStatementTidy.length,
      desc: 'Normalized line-item income statement records',
    },
    {
      key: 'segment',
      label: 'Segment Tidy',
      count: data.segmentTidy.length,
      desc: 'Product categories, brands, and channel revenue distribution',
    },
    {
      key: 'geography',
      label: 'Geography Tidy',
      count: data.geographyTidy.length,
      desc: 'Regional revenues and reporting basis definitions',
    },
    {
      key: 'opex',
      label: 'Opex Tidy',
      count: data.opexTidy.length,
      desc: 'Operating expenditure categories and net sales ratios',
    },
    {
      key: 'workforce',
      label: 'Workforce',
      count: data.workforce.length,
      desc: 'Annual FTE employee counts and productivity per employee',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Database className="w-5 h-5 text-indigo-400" /> Interactive Raw Data Explorer
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Inspect, search, sort, filter, and export the raw parsed Excel datasets directly from source workbook sheets.
        </p>
      </div>

      {/* Dataset Selector Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {datasets.map((ds) => {
          const isActive = activeDataset === ds.key;
          return (
            <button
              key={ds.key}
              onClick={() => setActiveDataset(ds.key)}
              className={`p-3 rounded-xl border text-left transition-all duration-150 flex flex-col justify-between ${
                isActive
                  ? 'bg-indigo-600/90 text-white border-indigo-500 shadow-lg shadow-indigo-600/20'
                  : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <div>
                <FileSpreadsheet
                  className={`w-4 h-4 mb-2 ${isActive ? 'text-white' : 'text-indigo-400'}`}
                />
                <div className="text-xs font-bold truncate">{ds.label}</div>
              </div>
              <div
                className={`text-[10px] mt-2 font-mono ${
                  isActive ? 'text-indigo-200' : 'text-slate-500'
                }`}
              >
                {ds.count} Records
              </div>
            </button>
          );
        })}
      </div>

      {/* Render Table based on selected dataset */}
      {activeDataset === 'isWide' && (
        <DataTable
          title="IncomeStatement_Wide Raw Table"
          subtitle="Full 30-column wide financial record per fiscal year"
          data={data.incomeStatementWide}
          columns={[
            { key: 'fiscal_year', header: 'Year', accessor: (r) => r.fiscal_year, render: (r) => <strong>FY {r.fiscal_year}</strong> },
            { key: 'IS_REV_TOT', header: 'IS_REV_TOT (€M)', accessor: (r) => r.IS_REV_TOT, render: (r) => formatCurrencyEUR(r.IS_REV_TOT), align: 'right' },
            { key: 'IS_GP', header: 'IS_GP (€M)', accessor: (r) => r.IS_GP, render: (r) => formatCurrencyEUR(r.IS_GP), align: 'right' },
            { key: 'IS_EBIT', header: 'IS_EBIT (€M)', accessor: (r) => r.IS_EBIT, render: (r) => formatCurrencyEUR(r.IS_EBIT), align: 'right' },
            { key: 'IS_EBT', header: 'IS_EBT (€M)', accessor: (r) => r.IS_EBT, render: (r) => formatCurrencyEUR(r.IS_EBT), align: 'right' },
            { key: 'IS_NI', header: 'IS_NI (€M)', accessor: (r) => r.IS_NI, render: (r) => formatCurrencyEUR(r.IS_NI), align: 'right' },
            { key: 'IS_EPSB', header: 'IS_EPSB (€)', accessor: (r) => r.IS_EPSB, render: (r) => formatEUR(r.IS_EPSB), align: 'right' },
            { key: 'IS_EPSD', header: 'IS_EPSD (€)', accessor: (r) => r.IS_EPSD, render: (r) => formatEUR(r.IS_EPSD), align: 'right' },
            { key: 'IS_DPS', header: 'IS_DPS (€)', accessor: (r) => r.IS_DPS, render: (r) => formatEUR(r.IS_DPS), align: 'right' },
            { key: 'IS_REV_WS', header: 'IS_REV_WS (€M)', accessor: (r) => r.IS_REV_WS, render: (r) => formatCurrencyEUR(r.IS_REV_WS), align: 'right' },
            { key: 'IS_REV_RT', header: 'IS_REV_RT (€M)', accessor: (r) => r.IS_REV_RT, render: (r) => formatCurrencyEUR(r.IS_REV_RT), align: 'right' },
            { key: 'IS_REV_OTH', header: 'IS_REV_OTH (€M)', accessor: (r) => r.IS_REV_OTH, render: (r) => formatCurrencyEUR(r.IS_REV_OTH), align: 'right' },
            { key: 'IS_COGS', header: 'IS_COGS (€M)', accessor: (r) => r.IS_COGS, render: (r) => formatCurrencyEUR(r.IS_COGS), align: 'right' },
            { key: 'IS_MKT', header: 'IS_MKT (€M)', accessor: (r) => r.IS_MKT, render: (r) => formatCurrencyEUR(r.IS_MKT), align: 'right' },
            { key: 'IS_DIST', header: 'IS_DIST (€M)', accessor: (r) => r.IS_DIST, render: (r) => formatCurrencyEUR(r.IS_DIST), align: 'right' },
            { key: 'IS_GNA', header: 'IS_GNA (€M)', accessor: (r) => r.IS_GNA, render: (r) => formatCurrencyEUR(r.IS_GNA), align: 'right' },
          ]}
          exportFilename="IncomeStatement_Wide_Raw.csv"
          pageSize={10}
        />
      )}

      {activeDataset === 'isTidy' && (
        <DataTable
          title="IncomeStatement_Tidy Raw Table"
          subtitle="All normalized line-item rows"
          data={data.incomeStatementTidy}
          columns={[
            { key: 'fiscal_year', header: 'Year', accessor: (r) => r.fiscal_year, render: (r) => <strong>FY {r.fiscal_year}</strong> },
            { key: 'line_item_code', header: 'Line Item Code', accessor: (r) => r.line_item_code, render: (r) => <span className="font-mono text-indigo-400">{r.line_item_code}</span> },
            { key: 'line_item', header: 'Line Item Description', accessor: (r) => r.line_item },
            { key: 'statement_group', header: 'Statement Group', accessor: (r) => r.statement_group },
            { key: 'value', header: 'Value', accessor: (r) => r.value, render: (r) => (r.value !== null ? r.value.toLocaleString() : 'N/A'), align: 'right' },
            { key: 'sheet', header: 'Source Sheet', accessor: (r) => r.sheet },
          ]}
          exportFilename="IncomeStatement_Tidy_Raw.csv"
          pageSize={10}
        />
      )}

      {activeDataset === 'segment' && (
        <DataTable
          title="Segment_Tidy Raw Table"
          subtitle="All product category, brand, and channel records"
          data={data.segmentTidy}
          columns={[
            { key: 'fiscal_year', header: 'Year', accessor: (r) => r.fiscal_year, render: (r) => <strong>FY {r.fiscal_year}</strong> },
            { key: 'dimension', header: 'Dimension', accessor: (r) => r.dimension },
            { key: 'segment', header: 'Segment', accessor: (r) => r.segment, render: (r) => <strong className="text-white">{r.segment}</strong> },
            { key: 'value', header: 'Value (€M)', accessor: (r) => r.value, render: (r) => formatCurrencyEUR(r.value), align: 'right' },
            { key: 'share_pct', header: 'Dimension Share %', accessor: (r) => r.share_pct, render: (r) => formatPercent(r.share_pct ?? null), align: 'right' },
          ]}
          exportFilename="Segment_Tidy_Raw.csv"
          pageSize={10}
        />
      )}

      {activeDataset === 'geography' && (
        <DataTable
          title="Geography_Tidy Raw Table"
          subtitle="Regional financial distribution records"
          data={data.geographyTidy}
          columns={[
            { key: 'fiscal_year', header: 'Year', accessor: (r) => r.fiscal_year, render: (r) => <strong>FY {r.fiscal_year}</strong> },
            { key: 'region_comparable', header: 'Region', accessor: (r) => r.region_comparable, render: (r) => <strong className="text-white">{r.region_comparable}</strong> },
            { key: 'basis', header: 'Reporting Basis', accessor: (r) => r.basis },
            { key: 'value', header: 'Value (€M)', accessor: (r) => r.value, render: (r) => formatCurrencyEUR(r.value), align: 'right' },
            { key: 'share_pct', header: 'Regional Share %', accessor: (r) => r.share_pct, render: (r) => formatPercent(r.share_pct ?? null), align: 'right' },
          ]}
          exportFilename="Geography_Tidy_Raw.csv"
          pageSize={10}
        />
      )}

      {activeDataset === 'opex' && (
        <DataTable
          title="Opex_Tidy Raw Table"
          subtitle="Operating expense line items"
          data={data.opexTidy}
          columns={[
            { key: 'fiscal_year', header: 'Year', accessor: (r) => r.fiscal_year, render: (r) => <strong>FY {r.fiscal_year}</strong> },
            { key: 'expense_line', header: 'Expense Category', accessor: (r) => r.expense_line, render: (r) => <strong className="text-white">{r.expense_line}</strong> },
            { key: 'value_eur_mn', header: 'Value (€M)', accessor: (r) => r.value_eur_mn, render: (r) => (r.value_eur_mn !== null ? formatCurrencyEUR(r.value_eur_mn) : 'N/A'), align: 'right' },
            { key: 'pct_of_net_sales', header: '% of Net Sales', accessor: (r) => r.pct_of_net_sales, render: (r) => (r.pct_of_net_sales !== null ? `${r.pct_of_net_sales.toFixed(1)}%` : 'N/A'), align: 'right' },
          ]}
          exportFilename="Opex_Tidy_Raw.csv"
          pageSize={10}
        />
      )}

      {activeDataset === 'workforce' && (
        <DataTable
          title="Workforce Raw Table"
          subtitle="Annual headcount and revenue productivity records"
          data={data.workforce}
          columns={[
            { key: 'fiscal_year', header: 'Year', accessor: (r) => r.fiscal_year, render: (r) => <strong>FY {r.fiscal_year}</strong> },
            { key: 'employees_fte', header: 'Employees (FTE)', accessor: (r) => r.employees_fte, render: (r) => formatNumber(r.employees_fte), align: 'right' },
            { key: 'employees_yoy_pct', header: 'FTE YoY %', accessor: (r) => r.employees_yoy_pct, render: (r) => formatPercent(r.employees_yoy_pct ?? null), align: 'right' },
            { key: 'revenue_per_employee_eur000', header: 'Revenue / Employee (€000)', accessor: (r) => r.revenue_per_employee_eur000, render: (r) => formatNumber(r.revenue_per_employee_eur000, 1), align: 'right' },
            { key: 'rev_per_emp_yoy_pct', header: 'Productivity YoY %', accessor: (r) => r.rev_per_emp_yoy_pct, render: (r) => formatPercent(r.rev_per_emp_yoy_pct ?? null), align: 'right' },
          ]}
          exportFilename="Workforce_Raw.csv"
          pageSize={10}
        />
      )}
    </div>
  );
};
