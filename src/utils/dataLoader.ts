import * as XLSX from 'xlsx';
import {
  DashboardData,
  IncomeStatementWideRow,
  IncomeStatementTidyRow,
  SegmentTidyRow,
  GeographyTidyRow,
  OpexTidyRow,
  WorkforceRow,
} from '../types/dashboard';

// Import bundled excel data as fallback for Vercel deployment
import fallbackData from '../data/excelData.json';

export function parseNum(val: any): number | null {
  if (val === null || val === undefined || val === '' || val === 'NaN' || val === 'N/A') {
    return null;
  }
  const n = Number(val);
  return isNaN(n) ? null : n;
}

export function calcYoY(current: number | null, previous: number | null): number | null {
  if (current === null || previous === null || previous === 0) {
    return null;
  }
  return ((current - previous) / Math.abs(previous)) * 100;
}

export function formatCurrencyEUR(val: number | null, decimals = 0): string {
  if (val === null || val === undefined) return 'N/A';
  const prefix = val < 0 ? '-€' : '€';
  const absVal = Math.abs(val);
  return `${prefix}${absVal.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}M`;
}

export function formatEUR(val: number | null, decimals = 2): string {
  if (val === null || val === undefined) return 'N/A';
  const prefix = val < 0 ? '-€' : '€';
  const absVal = Math.abs(val);
  return `${prefix}${absVal.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

export function formatNumber(val: number | null, decimals = 0): string {
  if (val === null || val === undefined) return 'N/A';
  return val.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatPercent(val: number | null, decimals = 1): string {
  if (val === null || val === undefined) return 'N/A';
  const prefix = val > 0 ? '+' : '';
  return `${prefix}${val.toFixed(decimals)}%`;
}

export async function loadDashboardData(): Promise<DashboardData> {
  let rawSheets: Record<string, any[]> = {};

  try {
    const response = await fetch('/ADS_GY_Equity_CLEANED.xlsx');
    if (response.ok) {
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      workbook.SheetNames.forEach((sheetName) => {
        const sheet = workbook.Sheets[sheetName];
        if (sheet) {
          rawSheets[sheetName] = XLSX.utils.sheet_to_json<any>(sheet);
        }
      });
    } else {
      console.warn('Fetch excel returned non-ok status, using bundled static JSON dataset');
      rawSheets = fallbackData as any;
    }
  } catch (err) {
    console.warn('Error fetching Excel file, using bundled static JSON dataset:', err);
    rawSheets = fallbackData as any;
  }

  // Ensure rawSheets has all required sheets
  if (!rawSheets['IncomeStatement_Wide']) {
    rawSheets = fallbackData as any;
  }

  // 1. IncomeStatement_Wide
  const rawIsWide = rawSheets['IncomeStatement_Wide'] || [];
  let isWideData: IncomeStatementWideRow[] = rawIsWide.map((row: any) => ({
    fiscal_year: Number(row.fiscal_year),
    IS_COGS: parseNum(row.IS_COGS),
    IS_DIST: parseNum(row.IS_DIST),
    IS_DPS: parseNum(row.IS_DPS),
    IS_EBIT: parseNum(row.IS_EBIT),
    IS_EBT: parseNum(row.IS_EBT),
    IS_EPSB: parseNum(row.IS_EPSB),
    IS_EPSD: parseNum(row.IS_EPSD),
    IS_FINEXP: parseNum(row.IS_FINEXP),
    IS_FININC: parseNum(row.IS_FININC),
    IS_GNA: parseNum(row.IS_GNA),
    IS_GP: parseNum(row.IS_GP),
    IS_IMP: parseNum(row.IS_IMP),
    IS_MI: parseNum(row.IS_MI),
    IS_MKT: parseNum(row.IS_MKT),
    IS_NI: parseNum(row.IS_NI),
    IS_NICONT: parseNum(row.IS_NICONT),
    IS_NIDISC: parseNum(row.IS_NIDISC),
    IS_NISH: parseNum(row.IS_NISH),
    IS_OOE: parseNum(row.IS_OOE),
    IS_OOI: parseNum(row.IS_OOI),
    IS_REV_OTH: parseNum(row.IS_REV_OTH),
    IS_REV_RT: parseNum(row.IS_REV_RT),
    IS_REV_TOT: parseNum(row.IS_REV_TOT),
    IS_REV_WS: parseNum(row.IS_REV_WS),
    IS_ROY: parseNum(row.IS_ROY),
    IS_SUN: parseNum(row.IS_SUN),
    IS_TAX: parseNum(row.IS_TAX),
    IS_WAVGB: parseNum(row.IS_WAVGB),
    IS_WAVGD: parseNum(row.IS_WAVGD),
  })).sort((a, b) => a.fiscal_year - b.fiscal_year);

  isWideData = isWideData.map((row, idx, arr) => {
    const prev = idx > 0 ? arr[idx - 1] : null;
    const rev = row.IS_REV_TOT;
    
    const gross_margin_pct = rev && row.IS_GP !== null ? (row.IS_GP / rev) * 100 : null;
    const ebit_margin_pct = rev && row.IS_EBIT !== null ? (row.IS_EBIT / rev) * 100 : null;
    const net_margin_pct = rev && row.IS_NI !== null ? (row.IS_NI / rev) * 100 : null;

    return {
      ...row,
      gross_margin_pct,
      ebit_margin_pct,
      net_margin_pct,
      rev_yoy_pct: prev ? calcYoY(row.IS_REV_TOT, prev.IS_REV_TOT) : null,
      gp_yoy_pct: prev ? calcYoY(row.IS_GP, prev.IS_GP) : null,
      ebit_yoy_pct: prev ? calcYoY(row.IS_EBIT, prev.IS_EBIT) : null,
      ni_yoy_pct: prev ? calcYoY(row.IS_NI, prev.IS_NI) : null,
      epsb_yoy_pct: prev ? calcYoY(row.IS_EPSB, prev.IS_EPSB) : null,
      dps_yoy_pct: prev ? calcYoY(row.IS_DPS, prev.IS_DPS) : null,
    };
  });

  // 2. IncomeStatement_Tidy
  const rawIsTidy = rawSheets['IncomeStatement_Tidy'] || [];
  const isTidyData: IncomeStatementTidyRow[] = rawIsTidy.map((row: any) => ({
    fiscal_year: Number(row.fiscal_year),
    line_item_code: String(row.line_item_code || ''),
    line_item: String(row.line_item || ''),
    statement_group: String(row.statement_group || ''),
    value: parseNum(row.value),
    sheet: String(row.sheet || ''),
  }));

  // 3. Segment_Tidy
  const rawSeg = rawSheets['Segment_Tidy'] || [];
  let segData: SegmentTidyRow[] = rawSeg.map((row: any) => ({
    fiscal_year: Number(row.fiscal_year),
    dimension: String(row.dimension || ''),
    segment: String(row.segment || ''),
    value: parseNum(row.value),
  }));

  const segByDimYear: Record<string, number> = {};
  segData.forEach((s) => {
    const key = `${s.fiscal_year}_${s.dimension}`;
    segByDimYear[key] = (segByDimYear[key] || 0) + (s.value || 0);
  });
  segData = segData.map((s) => {
    const tot = segByDimYear[`${s.fiscal_year}_${s.dimension}`];
    return {
      ...s,
      share_pct: tot && s.value !== null ? (s.value / tot) * 100 : null,
    };
  });

  // 4. Geography_Tidy
  const rawGeo = rawSheets['Geography_Tidy'] || [];
  let geoData: GeographyTidyRow[] = rawGeo.map((row: any) => ({
    fiscal_year: Number(row.fiscal_year),
    region_comparable: String(row.region_comparable || ''),
    value: parseNum(row.value),
    basis: String(row.basis || ''),
  }));

  const geoByBasisYear: Record<string, number> = {};
  geoData.forEach((g) => {
    const key = `${g.fiscal_year}_${g.basis}`;
    geoByBasisYear[key] = (geoByBasisYear[key] || 0) + (g.value || 0);
  });
  geoData = geoData.map((g) => {
    const tot = geoByBasisYear[`${g.fiscal_year}_${g.basis}`];
    return {
      ...g,
      share_pct: tot && g.value !== null ? (g.value / tot) * 100 : null,
    };
  });

  // 5. Opex_Tidy
  const rawOpex = rawSheets['Opex_Tidy'] || [];
  const opexData: OpexTidyRow[] = rawOpex.map((row: any) => ({
    fiscal_year: Number(row.fiscal_year),
    expense_line: String(row.expense_line || ''),
    value_eur_mn: parseNum(row.value_eur_mn),
    pct_of_net_sales: parseNum(row.pct_of_net_sales),
  }));

  // 6. Workforce
  const rawWf = rawSheets['Workforce'] || [];
  let wfData: WorkforceRow[] = rawWf.map((row: any) => ({
    fiscal_year: Number(row.fiscal_year),
    employees_fte: parseNum(row.employees_fte),
    revenue_per_employee_eur000: parseNum(row.revenue_per_employee_eur000),
  })).sort((a: any, b: any) => a.fiscal_year - b.fiscal_year);

  wfData = wfData.map((row, idx, arr) => {
    const prev = idx > 0 ? arr[idx - 1] : null;
    return {
      ...row,
      employees_yoy_pct: prev ? calcYoY(row.employees_fte, prev.employees_fte) : null,
      rev_per_emp_yoy_pct: prev ? calcYoY(row.revenue_per_employee_eur000, prev.revenue_per_employee_eur000) : null,
    };
  });

  // Filter options
  const availableYears = Array.from(new Set(isWideData.map((r) => r.fiscal_year))).sort((a, b) => a - b);
  const availableDimensions = Array.from(new Set(segData.map((r) => r.dimension))).filter(Boolean);
  const availableSegments = Array.from(new Set(segData.map((r) => r.segment))).filter(Boolean);
  const availableGeographies = Array.from(new Set(geoData.map((r) => r.region_comparable))).filter(Boolean);
  const availableGeoBases = Array.from(new Set(geoData.map((r) => r.basis))).filter(Boolean);
  const availableExpenseCategories = Array.from(new Set(opexData.map((r) => r.expense_line))).filter(Boolean);

  return {
    incomeStatementWide: isWideData,
    incomeStatementTidy: isTidyData,
    segmentTidy: segData,
    geographyTidy: geoData,
    opexTidy: opexData,
    workforce: wfData,
    availableYears,
    availableDimensions,
    availableSegments,
    availableGeographies,
    availableGeoBases,
    availableExpenseCategories,
  };
}
