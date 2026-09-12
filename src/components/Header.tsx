import React from 'react';
import { ShieldCheck, Sliders, RefreshCw, FileText, CheckCircle2, Sparkles, AlertCircle, Layers } from 'lucide-react';

interface HeaderProps {
  onOpenConfig: () => void;
  onOpenReport: () => void;
  onOpenBatchReport?: () => void;
  onReset: () => void;
  activeRuleCount: number;
  totalRuleCount: number;
  hasResult: boolean;
  isAnalyzing: boolean;
  batchCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenConfig,
  onOpenReport,
  onOpenBatchReport,
  onReset,
  activeRuleCount,
  totalRuleCount,
  hasResult,
  isAnalyzing,
  batchCount = 1,
}) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-sm" id="main-header">
      {/* Top Ministry Ribbon */}
      <div className="bg-gradient-to-r from-amber-600 via-slate-800 to-emerald-700 h-1 w-full" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo & Hackathon Branding */}
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-md shadow-indigo-950/50 border border-indigo-400/20 shrink-0">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  Smart Legal Metrology Inspector
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  SIH26034
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Legal Metrology (Packaged Commodities) Rules, 2011 • AI Automated Compliance Engine
              </p>
            </div>
          </div>

          {/* Controls & Badges */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* AI Engine Status Badge */}
            <div className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/80 text-xs text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Multimodal Gemini</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
            </div>

            {/* Config Rules Button */}
            <button
              type="button"
              id="btn-configure-rules"
              onClick={onOpenConfig}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition shadow-sm cursor-pointer"
              title="Configure mandatory statutory checks"
            >
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span>Rules Config</span>
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-700 font-mono text-slate-300">
                {activeRuleCount}/{totalRuleCount}
              </span>
            </button>

            {/* View/Download Single Product Report Button */}
            {hasResult && (
              <button
                type="button"
                id="btn-view-inspection-report"
                onClick={onOpenReport}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-sm cursor-pointer"
                title="View & download official inspection certificate for this product"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Product Report</span>
              </button>
            )}

            {/* View Cumulative Products Registry / Batch Report Button */}
            {onOpenBatchReport && (
              <button
                type="button"
                id="btn-view-batch-report"
                onClick={onOpenBatchReport}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition shadow-sm cursor-pointer"
                title="View cumulative products registry and batch report"
              >
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                <span>Products Registry</span>
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-mono">
                  {batchCount}
                </span>
              </button>
            )}

            {/* Reset / New Inspection */}
            {hasResult && (
              <button
                type="button"
                id="btn-reset-inspection"
                onClick={onReset}
                disabled={isAnalyzing}
                className="inline-flex items-center space-x-1 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700/60 transition cursor-pointer"
                title="Start a new inspection"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">New Scan</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
