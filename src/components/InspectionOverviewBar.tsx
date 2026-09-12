import React from 'react';
import { ShieldCheck, AlertTriangle, XCircle, CheckCircle2, FileDown, Eye, AlertOctagon, HelpCircle, Layers } from 'lucide-react';
import { InspectionAuditResult } from '../types/inspection';

interface InspectionOverviewBarProps {
  result: InspectionAuditResult;
  onOpenReport: () => void;
  onOpenBatchReport?: () => void;
  batchCount?: number;
  onScrollToTable: () => void;
}

export const InspectionOverviewBar: React.FC<InspectionOverviewBarProps> = ({
  result,
  onOpenReport,
  onOpenBatchReport,
  batchCount = 1,
  onScrollToTable,
}) => {
  const passCount = result.checks.filter((c) => c.status === 'PASS').length;
  const failCount = result.checks.filter((c) => c.status === 'FAIL').length;
  const reviewCount = result.checks.filter((c) => c.status === 'NEEDS_REVIEW').length;

  const isCompliant = result.overallStatus === 'COMPLIANT';
  const isNonCompliant = result.overallStatus === 'NON_COMPLIANT';

  const statusConfig = {
    COMPLIANT: {
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-900',
      badgeBg: 'bg-emerald-600 text-white',
      icon: CheckCircle2,
      label: 'COMPLIANT',
      description: 'Meets statutory declaration requirements under Legal Metrology (Packaged Commodities) Rules, 2011.',
    },
    NON_COMPLIANT: {
      bg: 'bg-rose-50 border-rose-200 text-rose-900',
      badgeBg: 'bg-rose-600 text-white',
      icon: XCircle,
      label: 'NON-COMPLIANT',
      description: 'Critical statutory violations detected. Subject to penal notice under Section 36(1) of Legal Metrology Act.',
    },
    PARTIALLY_COMPLIANT: {
      bg: 'bg-amber-50 border-amber-200 text-amber-900',
      badgeBg: 'bg-amber-500 text-white',
      icon: AlertTriangle,
      label: 'NEEDS REVIEW / CONDITIONAL',
      description: 'Minor irregularities or borderline font/contrast declarations requiring officer inspection.',
    },
  }[result.overallStatus];

  const actionLabels: Record<string, { text: string; color: string }> = {
    APPROVE: { text: 'Approve for Distribution', color: 'text-emerald-700 bg-emerald-100 border-emerald-300' },
    ISSUE_NOTICE: { text: 'Issue Statutory Notice (Sec 36)', color: 'text-rose-700 bg-rose-100 border-rose-300' },
    CONFISCATE_SAMPLE: { text: 'Confiscate Sample for Seizure', color: 'text-red-800 bg-red-100 border-red-300' },
    PHYSICAL_INSPECTION_REQUIRED: { text: 'Physical Station Verification', color: 'text-amber-800 bg-amber-100 border-amber-300' },
  };

  const actionInfo = actionLabels[result.suggestedAction] || actionLabels.PHYSICAL_INSPECTION_REQUIRED;
  const StatusIcon = statusConfig.icon;

  return (
    <div className={`rounded-xl border p-4 sm:p-5 shadow-xs transition ${statusConfig.bg}`} id="inspection-overview-card">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        
        {/* Left Column: Status Badge, Title & Description */}
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider ${statusConfig.badgeBg}`}>
              <StatusIcon className="w-3.5 h-3.5" />
              {statusConfig.label}
            </span>
            <span className="text-xs font-mono font-medium text-slate-500">
              Ref: {result.inspectionId}
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-600 font-medium">
              {result.timestamp}
            </span>
          </div>

          <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {result.extractedDeclarations.productName?.value || 'Packaged Commodity Inspection'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {result.summaryNotes}
          </p>

          <div className="pt-1 flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-slate-700">Enforcement Action:</span>
            <span className={`px-2.5 py-0.5 rounded-md font-semibold border ${actionInfo.color}`}>
              {actionInfo.text}
            </span>
          </div>
        </div>

        {/* Right Column: Score Meter & Statistics Counters */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 bg-white/80 backdrop-blur-xs p-4 rounded-xl border border-slate-200/80 shrink-0">
          
          {/* Circular/Gauge Score */}
          <div className="text-center pr-2 sm:pr-4 border-r border-slate-200">
            <div className="flex items-baseline justify-center gap-0.5">
              <span className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
                isCompliant ? 'text-emerald-600' : isNonCompliant ? 'text-rose-600' : 'text-amber-600'
              }`}>
                {result.overallScore}
              </span>
              <span className="text-xs font-bold text-slate-400">/100</span>
            </div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mt-0.5">
              Compliance Score
            </div>
          </div>

          {/* Breakdown Pills */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
            <button
              onClick={onScrollToTable}
              className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 transition text-left cursor-pointer"
              title="View passed checks"
            >
              <div className="text-lg font-bold text-emerald-700 leading-none">{passCount}</div>
              <div className="text-[10px] font-medium text-emerald-800 mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-2.5 h-2.5" /> Pass
              </div>
            </button>

            <button
              onClick={onScrollToTable}
              className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100/80 border border-rose-200 transition text-left cursor-pointer"
              title="View failed violations"
            >
              <div className="text-lg font-bold text-rose-700 leading-none">{failCount}</div>
              <div className="text-[10px] font-medium text-rose-800 mt-1 flex items-center gap-1">
                <XCircle className="w-2.5 h-2.5" /> Violations
              </div>
            </button>

            <button
              onClick={onScrollToTable}
              className="p-2 rounded-lg bg-amber-50 hover:bg-amber-100/80 border border-amber-200 transition text-left cursor-pointer"
              title="View items needing officer review"
            >
              <div className="text-lg font-bold text-amber-700 leading-none">{reviewCount}</div>
              <div className="text-[10px] font-medium text-amber-800 mt-1 flex items-center gap-1">
                <HelpCircle className="w-2.5 h-2.5" /> Review
              </div>
            </button>
          </div>

          {/* Action Buttons: Single Product Report & All Products Ledger */}
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <button
              type="button"
              onClick={onOpenReport}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-3.5 py-2.5 text-xs font-bold rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition shadow-sm cursor-pointer"
              title="Generate court-ready inspection certificate and statutory notice for this package"
            >
              <FileDown className="w-3.5 h-3.5 text-indigo-400" />
              <span>Generate Report</span>
            </button>

            {onOpenBatchReport && (
              <button
                type="button"
                onClick={onOpenBatchReport}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-3 py-2.5 text-xs font-semibold rounded-lg bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition border border-slate-300 shadow-2xs cursor-pointer"
                title="View cumulative registry report of all audited products"
              >
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                <span>Products Registry ({batchCount})</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
