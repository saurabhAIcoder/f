export interface IncomeStatementWideRow {
  fiscal_year: number;
  IS_COGS: number | null;
  IS_DIST: number | null;
  IS_DPS: number | null;
  IS_EBIT: number | null;
  IS_EBT: number | null;
  IS_EPSB: number | null;
  IS_EPSD: number | null;
  IS_FINEXP: number | null;
  IS_FININC: number | null;
  IS_GNA: number | null;
  IS_GP: number | null;
  IS_IMP: number | null;
  IS_MI: number | null;
  IS_MKT: number | null;
  IS_NI: number | null;
  IS_NICONT: number | null;
  IS_NIDISC: number | null;
  IS_NISH: number | null;
  IS_OOE: number | null;
  IS_OOI: number | null;
  IS_REV_OTH: number | null;
  IS_REV_RT: number | null;
  IS_REV_TOT: number | null;
  IS_REV_WS: number | null;
  IS_ROY: number | null;
  IS_SUN: number | null;
  IS_TAX: number | null;
  IS_WAVGB: number | null;
  IS_WAVGD: number | null;

  // Calculated Metrics
  gross_margin_pct?: number | null;
  ebit_margin_pct?: number | null;
  net_margin_pct?: number | null;
  rev_yoy_pct?: number | null;
  gp_yoy_pct?: number | null;
  ebit_yoy_pct?: number | null;
  ni_yoy_pct?: number | null;
  epsb_yoy_pct?: number | null;
  dps_yoy_pct?: number | null;
}

export interface IncomeStatementTidyRow {
  fiscal_year: number;
  line_item_code: string;
  line_item: string;
  statement_group: string;
  value: number | null;
  sheet: string;
}

export interface SegmentTidyRow {
  fiscal_year: number;
  dimension: string;
  segment: string;
  value: number | null;
  share_pct?: number | null;
  yoy_pct?: number | null;
}

export interface GeographyTidyRow {
  fiscal_year: number;
  region_comparable: string;
  value: number | null;
  basis: string;
  share_pct?: number | null;
  yoy_pct?: number | null;
}

export interface OpexTidyRow {
  fiscal_year: number;
  expense_line: string;
  value_eur_mn: number | null;
  pct_of_net_sales: number | null;
  yoy_pct?: number | null;
}

export interface WorkforceRow {
  fiscal_year: number;
  employees_fte: number | null;
  revenue_per_employee_eur000: number | null;
  employees_yoy_pct?: number | null;
  rev_per_emp_yoy_pct?: number | null;
}

export interface DashboardData {
  incomeStatementWide: IncomeStatementWideRow[];
  incomeStatementTidy: IncomeStatementTidyRow[];
  segmentTidy: SegmentTidyRow[];
  geographyTidy: GeographyTidyRow[];
  opexTidy: OpexTidyRow[];
  workforce: WorkforceRow[];
  
  // Filter Options (computed dynamically)
  availableYears: number[];
  availableDimensions: string[];
  availableSegments: string[];
  availableGeographies: string[];
  availableGeoBases: string[];
  availableExpenseCategories: string[];
}

export interface DashboardFilters {
  selectedYear: number | 'All';
  selectedSegment: string | 'All';
  selectedDimension: string | 'All';
  selectedGeography: string | 'All';
  selectedGeoBasis: string | 'All';
  selectedExpenseCategory: string | 'All';
}

export type NavigationTab = 
  | 'overview' 
  | 'financial' 
  | 'segments' 
  | 'geography' 
  | 'opex' 
  | 'workforce' 
  | 'yoy' 
  | 'explorer';

export interface KPICardMetric {
  title: string;
  code: string;
  currentValue: number | null;
  previousValue: number | null;
  yoyChangePct: number | null;
  unit: string;
  prefix?: string;
  formatter?: (val: number | null) => string;
}
