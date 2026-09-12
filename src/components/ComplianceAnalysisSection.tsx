import React, { useState } from 'react';
import {
  Gavel,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  HelpCircle,
  Info,
  Scale,
  Search,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Cpu,
  BookOpen,
} from 'lucide-react';
import {
  ComplianceCheckResult,
  ComplianceStatus,
  InspectionAuditResult,
  DetectedDeclarationField,
} from '../types/inspection';
import { deriveDetectedFields } from '../utils/fieldExtractor';

interface ComplianceAnalysisSectionProps {
  auditResult: InspectionAuditResult;
  onSelectRequirement?: (ruleId: string) => void;
}

export const ComplianceAnalysisSection: React.FC<ComplianceAnalysisSectionProps> = ({
  auditResult,
  onSelectRequirement,
}) => {
  const [filterStatus, setFilterStatus] = useState<'ALL' | ComplianceStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const checks = auditResult.checks;
  const detectedFields = deriveDetectedFields(auditResult);

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

  const getStatusBadge = (status: ComplianceStatus) => {
    switch (status) {
      case 'PASS':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-emerald-600 text-white shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5" />
            PASS
          </span>
        );
      case 'FAIL':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-rose-600 text-white shadow-xs">
            <XCircle className="w-3.5 h-3.5" />
            FAIL
          </span>
        );
      case 'NEEDS_REVIEW':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-amber-500 text-white shadow-xs">
            <AlertTriangle className="w-3.5 h-3.5" />
            NEEDS REVIEW
          </span>
        );
    }
  };

  const getAssociatedField = (ruleId: string): DetectedDeclarationField | undefined => {
    return detectedFields.find((f) => f.legalRuleId === ruleId);
  };

  return (
    <section
      id="compliance-analysis-section"
      className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
    >
      {/* Section Header */}
      <div className="border-b border-slate-200 bg-slate-900 text-white p-4 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-lg bg-indigo-600 text-white">
                <Gavel className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold tracking-tight text-white flex items-center gap-2">
                  Statutory Compliance Analysis &amp; Mandatory Declarations
                </h2>
                <p className="text-xs text-slate-300">
                  Rule-by-rule verification under Legal Metrology (Packaged Commodities) Rules, 2011 &amp; Section 36 of the Act
                </p>
              </div>
            </div>
          </div>

          {/* Compliance Stats Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-center">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Overall Status</div>
              <div
                className={`text-xs font-black uppercase ${
                  auditResult.overallStatus === 'COMPLIANT'
                    ? 'text-emerald-400'
                    : auditResult.overallStatus === 'NON_COMPLIANT'
                    ? 'text-rose-400'
                    : 'text-amber-400'
                }`}
              >
                {auditResult.overallStatus.replace('_', ' ')}
              </div>
            </div>

            <div className="px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-800/80 text-center">
              <div className="text-[10px] text-emerald-300 font-semibold uppercase">Passed</div>
              <div className="text-xs font-black text-emerald-400">{passCount} Checks</div>
            </div>

            <div className="px-3 py-1.5 rounded-lg bg-rose-950/80 border border-rose-800/80 text-center">
              <div className="text-[10px] text-rose-300 font-semibold uppercase">Violations</div>
              <div className="text-xs font-black text-rose-400">{failCount} Violations</div>
            </div>

            <div className="px-3 py-1.5 rounded-lg bg-amber-950/80 border border-amber-800/80 text-center">
              <div className="text-[10px] text-amber-300 font-semibold uppercase">Review</div>
              <div className="text-xs font-black text-amber-400">{reviewCount} Items</div>
            </div>
          </div>
        </div>
      </div>

      {/* CRITICAL ARCHITECTURAL DISTINCTION BANNER: AI Detection vs Compliance Assessment */}
      <div className="bg-linear-to-r from-amber-50 via-orange-50 to-amber-50 border-b border-amber-200 p-4 sm:p-5 text-amber-950">
        <div className="flex items-start gap-3.5">
          <div className="p-2 rounded-lg bg-amber-200 text-amber-900 shrink-0 mt-0.5">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="space-y-2 text-xs flex-1">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-amber-950 tracking-tight">
                Important Regulatory Notice: AI Vision Detection vs. Statutory Legal Compliance
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-200/80 text-amber-900 font-mono font-bold text-[10px]">
                Enforcement Standard
              </span>
            </div>

            <p className="text-amber-900 leading-relaxed">
              <strong>Do not claim or infer that a packaged product is legally compliant based solely on high AI vision confidence.</strong>{' '}
              Our system strictly separates the <em>AI Detection Layer</em> from the <em>Compliance Assessment Layer</em>:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="bg-white/80 rounded-lg p-2.5 border border-amber-200/90 shadow-2xs">
                <div className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                  <Cpu className="w-4 h-4 text-indigo-600" />
                  <span>AI Detection Layer (Computer Vision)</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Measures character recognition confidence (e.g. 98% certainty that characters "200 mls" or "MRP: Rs. 45/-" appear on the front panel).
                </p>
              </div>

              <div className="bg-white/80 rounded-lg p-2.5 border border-amber-200/90 shadow-2xs">
                <div className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                  <BookOpen className="w-4 h-4 text-emerald-700" />
                  <span>Statutory Compliance Layer (Legal Metrology)</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Evaluates declarations against the Legal Metrology Rules, 2011. A 99% confident AI detection of "mls" or missing "incl. of all taxes" constitutes <strong>definitive proof of a legal violation</strong>, resulting in a <strong>FAIL</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              filterStatus === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            All Requirements ({checks.length})
          </button>
          <button
            onClick={() => setFilterStatus('FAIL')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
              filterStatus === 'FAIL'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white text-rose-700 border border-rose-200 hover:bg-rose-50'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Violations ({failCount})</span>
          </button>
          <button
            onClick={() => setFilterStatus('PASS')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
              filterStatus === 'PASS'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Compliant ({passCount})</span>
          </button>
          <button
            onClick={() => setFilterStatus('NEEDS_REVIEW')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
              filterStatus === 'NEEDS_REVIEW'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white text-amber-800 border border-amber-200 hover:bg-amber-50'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Needs Review ({reviewCount})</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search rules, keywords, or citations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Compliance Requirements List */}
      <div className="divide-y divide-slate-200 p-4 sm:p-6 space-y-3">
        {filteredChecks.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            <Scale className="w-8 h-8 mx-auto text-slate-400 mb-2" />
            <p className="font-semibold text-sm">No compliance checks matched the selected filter.</p>
            <p className="text-xs text-slate-400 mt-1">Try resetting the filter to "All Requirements".</p>
          </div>
        ) : (
          filteredChecks.map((check) => {
            const isExpanded = expandedId === check.ruleId;
            const field = getAssociatedField(check.ruleId);

            return (
              <div
                key={check.ruleId}
                className={`rounded-xl border transition-all ${
                  check.status === 'FAIL'
                    ? 'border-rose-200 bg-rose-50/30'
                    : check.status === 'NEEDS_REVIEW'
                    ? 'border-amber-200 bg-amber-50/30'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                {/* Card Main Row */}
                <div
                  className="p-4 cursor-pointer select-none"
                  onClick={() => setExpandedId(isExpanded ? null : check.ruleId)}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-500">
                          {check.ruleId}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                          {check.legalReference}
                        </span>
                      </div>

                      <h4 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
                        {check.ruleName}
                      </h4>
                    </div>

                    {/* Status & Action */}
                    <div className="flex items-center space-x-3 self-end md:self-auto">
                      {/* Presence & Readability Sub-indicator */}
                      {field && (
                        <div className="hidden sm:flex flex-col text-right text-[11px] text-slate-500">
                          <span className="font-semibold text-slate-700">
                            {field.status} • {field.readability} Readability
                          </span>
                          <span className="font-mono text-[10px]">
                            {field.confidence}% Vision Confidence
                          </span>
                        </div>
                      )}

                      {getStatusBadge(check.status)}

                      <button
                        type="button"
                        className="text-slate-400 hover:text-slate-700 p-1 transition"
                        title={isExpanded ? 'Collapse details' : 'Expand explanation'}
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Primary Reason & Explanation Line */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100">
                    <div className="text-xs text-slate-700 leading-relaxed">
                      <strong className="text-slate-900 font-bold">Explanation: </strong>
                      <span>{check.findingsAndExplanation}</span>
                    </div>
                  </div>
                </div>

                {/* Expanded Details Section: Evidence, Penal Provision, & Remedial Action */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 border-t border-slate-200/80 bg-slate-50/80 rounded-b-xl space-y-3 text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                      {/* Extracted Evidence */}
                      <div className="p-3 bg-white rounded-lg border border-slate-200">
                        <div className="font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                          <Search className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Extracted Packaging Evidence</span>
                        </div>
                        <div className="font-mono text-xs text-slate-900 bg-slate-50 p-2 rounded border border-slate-200">
                          "{check.extractedEvidence || 'Declaration was not detected on Principal Display Panel'}"
                        </div>
                        <div className="mt-2 text-[11px] text-slate-500">
                          <strong>Expected Requirement:</strong> {check.expectedRequirement}
                        </div>
                      </div>

                      {/* Penal Provision & Legal Citation */}
                      <div className="p-3 bg-white rounded-lg border border-slate-200">
                        <div className="font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                          <Gavel className="w-3.5 h-3.5 text-rose-600" />
                          <span>Statutory Penal Citation</span>
                        </div>
                        <div className="font-bold text-xs text-rose-800 bg-rose-50 p-2 rounded border border-rose-200">
                          {check.penalProvision || 'Section 36(1) of the Legal Metrology Act, 2009'}
                        </div>
                        <div className="mt-2 text-[11px] text-slate-600">
                          <strong>Prescribed Remedial Action:</strong> {check.remedialAction}
                        </div>
                      </div>
                    </div>

                    {/* Quick Cross-Link to Canvas Overlay */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-slate-500">
                        Evaluated under Gazette Notification G.S.R. 784(E)
                      </span>
                      {onSelectRequirement && (
                        <button
                          type="button"
                          onClick={() => onSelectRequirement(check.ruleId)}
                          className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>Locate zone on image</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Summary Bar */}
      <div className="px-6 py-3.5 bg-slate-100 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600">
        <div className="flex items-center space-x-2">
          <Scale className="w-4 h-4 text-indigo-600 shrink-0" />
          <span className="font-semibold text-slate-800">
            {failCount > 0 ? (
              <span className="text-rose-700 font-bold">
                ⚠️ Statutory Non-Compliance Detected: {failCount} violations warrant notice under Section 36(1).
              </span>
            ) : reviewCount > 0 ? (
              <span className="text-amber-700 font-bold">
                ⚠️ Physical Verification Required: {reviewCount} declarations have difficult contrast or legibility.
              </span>
            ) : (
              <span className="text-emerald-700 font-bold">
                ✓ Full Statutory Conformance: All mandatory declarations are present, legible, and verified.
              </span>
            )}
          </span>
        </div>

        <div className="text-[11px] text-slate-500">
          Showing {filteredChecks.length} of {checks.length} statutory requirements
        </div>
      </div>
    </section>
  );
};
