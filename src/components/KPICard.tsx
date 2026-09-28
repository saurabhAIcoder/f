import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatPercent } from '../utils/dataLoader';

interface KPICardProps {
  title: string;
  code?: string;
  currentValueFormatted: string;
  previousValueFormatted?: string;
  yoyChangePct: number | null;
  unit?: string;
  icon?: React.ReactNode;
  subtitle?: string;
  isInversePositive?: boolean; // e.g. for expense increase where lower might be better
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  code,
  currentValueFormatted,
  previousValueFormatted,
  yoyChangePct,
  unit,
  icon,
  subtitle,
  isInversePositive = false,
}) => {
  let isPositive = yoyChangePct !== null && yoyChangePct > 0;
  let isNegative = yoyChangePct !== null && yoyChangePct < 0;

  if (isInversePositive) {
    isPositive = yoyChangePct !== null && yoyChangePct < 0;
    isNegative = yoyChangePct !== null && yoyChangePct > 0;
  }

  return (
    <div className="card-glass rounded-xl p-5 border border-slate-800/80 hover:border-indigo-500/30 transition-all duration-200 shadow-lg group flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
            {code && <span className="bg-slate-800 px-1.5 py-0.5 rounded text-[10px] text-indigo-400 font-mono">{code}</span>}
            {title}
          </span>
          {icon && <div className="text-indigo-400 group-hover:text-sky-400 transition-colors">{icon}</div>}
        </div>

        <div className="flex items-baseline justify-between mt-1">
          <div className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            {currentValueFormatted}
            {unit && <span className="text-xs font-normal text-slate-400 ml-1">{unit}</span>}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          {yoyChangePct !== null ? (
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium ${
                isPositive
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : isNegative
                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {isPositive ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : isNegative ? (
                <TrendingDown className="w-3.5 h-3.5" />
              ) : (
                <Minus className="w-3.5 h-3.5" />
              )}
              {formatPercent(yoyChangePct)} YoY
            </span>
          ) : (
            <span className="text-slate-500 font-medium">N/A</span>
          )}
        </div>

        {previousValueFormatted && (
          <span className="text-slate-400 font-normal">
            PY: <span className="text-slate-300 font-medium">{previousValueFormatted}</span>
          </span>
        )}

        {subtitle && !previousValueFormatted && (
          <span className="text-slate-400 text-[11px]">{subtitle}</span>
        )}
      </div>
    </div>
  );
};
