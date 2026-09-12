import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Scale,
  ExternalLink,
  Gavel,
} from 'lucide-react';
import { ComplianceCheckResult, ComplianceStatus } from '../types/inspection';

interface ComplianceTableProps {
  checks: ComplianceCheckResult[];
  onSelectCheck?: (check: ComplianceCheckResult) => void;
}

export const ComplianceTable: React.FC<ComplianceTableProps> = ({ checks, onSelectCheck }) => {
  const [filterStatus, setFilterStatus] = useState<'ALL' | ComplianceStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  const passCount = checks.filter((c) => c.status === 'PASS').length;
  const failCount = checks.filter((c) => c.status === 'FAIL').length;
  const reviewCount = checks.filter((c) => c.status === 'NEEDS_REVIEW').length;

  const filteredChecks = checks.filter((c) => {
    if (filterStatus !== 'ALL' && c.status !== filterStatus) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        c.ruleName.toLowerCase().includes(q) ||
        c.legalReference.toLowerCase().includes(q) ||
        c.findingsAndExplanation.toLowerCase().includes(q) ||
        c.extractedEvidence.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const toggleRow = (ruleId: string) => {
    setExpandedRowId((prev) => (prev === ruleId ? null : ruleId));
  };

  const getStatusBadge = (status: ComplianceStatus) => {
    switch (status) {
      case 'PASS':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            PASS
          </span>
        );
      case 'FAIL':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle className="w-3 h-3 text-rose-600" />
            FAIL
          </span>
        );
      case 'NEEDS_REVIEW':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            NEEDS REVIEW
          </span>
        );
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">CRITICAL</span>;
      case 'MAJOR':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">MAJOR</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">STANDARD</span>;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden" id="statutory-compliance-table">
      {/* Table Top Toolbar */}
      <div className="border-b border-slate-200 bg-slate-50/80 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <Gavel className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Statutory Compliance &amp; Mandatory Declarations Audit
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Rule-by-rule evaluation against Legal Metrology (Packaged Commodities) Rules, 2011.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setFilterStatus('ALL')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
              filterStatus === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            All ({checks.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('PASS')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1 ${
              filterStatus === 'PASS'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            Pass ({passCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('FAIL')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1 ${
              filterStatus === 'FAIL'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-rose-700 hover:bg-rose-50'
            }`}
          >
            Violations ({failCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('NEEDS_REVIEW')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1 ${
              filterStatus === 'NEEDS_REVIEW'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-amber-700 hover:bg-amber-50'
            }`}
          >
            Review ({reviewCount})
          </button>
        </div>
      </div>

      {/* Search Filter Box */}
      <div className="p-3 bg-white border-b border-slate-200">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search checks by statutory rule, section, keyword, or evidence..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Table View */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50 text-left text-[11px] font-bold text-slate-600 uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Statutory Requirement</th>
              <th className="py-3 px-4">Legal Reference</th>
              <th className="py-3 px-4">Severity</th>
              <th className="py-3 px-4">Extracted Evidence</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-xs bg-white">
            {filteredChecks.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  No statutory checks match the selected filter.
                </td>
              </tr>
            ) : (
              filteredChecks.map((check) => {
                const isExpanded = expandedRowId === check.ruleId;
                const isFail = check.status === 'FAIL';

                return (
                  <React.Fragment key={check.ruleId}>
                    <tr
                      onClick={() => toggleRow(check.ruleId)}
                      className={`hover:bg-slate-50/80 transition cursor-pointer ${
                        isFail ? 'bg-rose-50/20' : ''
                      }`}
                    >
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {check.ruleName}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                        {check.legalReference}
                      </td>
                      <td className="py-3 px-4">
                        {getSeverityBadge(check.severity)}
                      </td>
                      <td className="py-3 px-4 max-w-xs truncate text-slate-700 font-mono text-[11px]">
                        "{check.extractedEvidence || 'Not Found'}"
                      </td>
                      <td className="py-3 px-4 text-center">
                        {getStatusBadge(check.status)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          className="text-slate-400 hover:text-slate-700 p-1"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </td>
                    </tr>

                    {/* Expandable Finding & Legal Action Row */}
                    {isExpanded && (
                      <tr className="bg-slate-50/70 border-b border-slate-200">
                        <td colSpan={6} className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            {/* Findings & Legal Analysis */}
                            <div className="space-y-2">
                              <div>
                                <span className="font-bold text-slate-800 block mb-1">
                                  Findings &amp; Issue Explanation:
                                </span>
                                <p className="text-slate-700 bg-white p-3 rounded-lg border border-slate-200 leading-relaxed">
                                  {check.findingsAndExplanation}
                                </p>
                              </div>
                              <div>
                                <span className="font-bold text-slate-600 text-[11px] block">
                                  Mandatory Statutory Requirement:
                                </span>
                                <p className="text-slate-600 text-[11px] mt-0.5">
                                  {check.expectedRequirement}
                                </p>
                              </div>
                            </div>

                            {/* Remedial & Penal Provision */}
                            <div className="space-y-2">
                              <div>
                                <span className="font-bold text-slate-800 block mb-1">
                                  Remedial / Enforcement Direction:
                                </span>
                                <p className="text-slate-700 bg-white p-3 rounded-lg border border-slate-200 leading-relaxed">
                                  {check.remedialAction}
                                </p>
                              </div>
                              <div className="p-2.5 rounded-lg bg-rose-50/60 border border-rose-200 text-rose-900 text-[11px]">
                                <span className="font-bold block">Statutory Penalty Reference:</span>
                                <span className="font-mono">{check.penalProvision}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
