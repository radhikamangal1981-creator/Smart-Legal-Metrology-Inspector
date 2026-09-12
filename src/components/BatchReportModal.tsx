import React, { useRef } from 'react';
import {
  X,
  Printer,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Layers,
  ArrowRight,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { InspectionAuditResult } from '../types/inspection';

interface BatchReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  inspections: InspectionAuditResult[];
  onSelectInspection: (inspection: InspectionAuditResult) => void;
  currentInspectionId?: string;
}

export const BatchReportModal: React.FC<BatchReportModalProps> = ({
  isOpen,
  onClose,
  inspections,
  onSelectInspection,
  currentInspectionId,
}) => {
  const printRef = useRef<HTMLDivElement | null>(null);

  if (!isOpen) return null;

  const total = inspections.length;
  const compliantCount = inspections.filter((i) => i.overallStatus === 'COMPLIANT').length;
  const nonCompliantCount = inspections.filter((i) => i.overallStatus === 'NON_COMPLIANT').length;
  const reviewCount = inspections.filter((i) => i.overallStatus === 'PARTIALLY_COMPLIANT').length;
  const totalViolations = inspections.reduce(
    (acc, i) => acc + i.checks.filter((c) => c.status === 'FAIL').length,
    0
  );

  const complianceRate = total > 0 ? Math.round((compliantCount / total) * 100) : 0;

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      'Inspection ID',
      'Date & Time',
      'Product Name',
      'Category',
      'Manufacturer / Packer',
      'Declared Net Qty',
      'Declared MRP',
      'Compliance Status',
      'Score (out of 100)',
      'Total Violations',
      'Suggested Enforcement Action',
      'Violations Summary',
    ];

    const rows = inspections.map((item) => {
      const violations = item.checks
        .filter((c) => c.status === 'FAIL')
        .map((c) => `${c.ruleName} (${c.legalReference})`)
        .join('; ');

      return [
        `"${item.inspectionId}"`,
        `"${item.timestamp}"`,
        `"${(item.extractedDeclarations.productName?.value || 'N/A').replace(/"/g, '""')}"`,
        `"${item.packageCategory}"`,
        `"${(item.extractedDeclarations.manufacturerPacker?.name || 'N/A').replace(/"/g, '""')}"`,
        `"${(item.extractedDeclarations.netQuantity?.declaredValue || 'N/A').replace(/"/g, '""')}"`,
        `"${(item.extractedDeclarations.mrp?.declaredValue || 'N/A').replace(/"/g, '""')}"`,
        `"${item.overallStatus}"`,
        item.overallScore,
        item.checks.filter((c) => c.status === 'FAIL').length,
        `"${item.suggestedAction}"`,
        `"${violations.replace(/"/g, '""')}"`,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent([headers.join(','), ...rows].join('\n'));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', csvContent);
    downloadAnchor.setAttribute('download', `LEGAL_METROLOGY_BATCH_REPORT_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto"
      id="batch-report-modal"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-bold">Cumulative Products Inspection Registry</h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {total} Products Audited
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Consolidated batch ledger under the Legal Metrology (Packaged Commodities) Rules, 2011
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white transition cursor-pointer"
              title="Download spreadsheet report"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
              title="Print batch report"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={printRef}>
          
          {/* Executive Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Inspected</div>
              <div className="text-2xl font-black text-slate-900 mt-1">{total}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Packaged Commodities</div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5">
              <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Compliant
              </div>
              <div className="text-2xl font-black text-emerald-700 mt-1">{compliantCount}</div>
              <div className="text-[11px] text-emerald-700 font-medium mt-0.5">{complianceRate}% Pass Rate</div>
            </div>

            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5">
              <div className="text-xs font-semibold text-rose-800 uppercase tracking-wider flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5 text-rose-600" /> Non-Compliant
              </div>
              <div className="text-2xl font-black text-rose-700 mt-1">{nonCompliantCount}</div>
              <div className="text-[11px] text-rose-700 font-medium mt-0.5">Notices Warranted (Sec 36)</div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5">
              <div className="text-xs font-semibold text-amber-800 uppercase tracking-wider flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Violations Found
              </div>
              <div className="text-2xl font-black text-amber-700 mt-1">{totalViolations}</div>
              <div className="text-[11px] text-amber-700 font-medium mt-0.5">{reviewCount} Pending Officer Review</div>
            </div>
          </div>

          {/* Product Items Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Audited Products Ledger ({total})
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Click "View Details" to switch active product view
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                    <th className="py-2.5 px-3 font-semibold">Ref ID & Time</th>
                    <th className="py-2.5 px-3 font-semibold">Product Name & Category</th>
                    <th className="py-2.5 px-3 font-semibold">Net Qty & MRP</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Score</th>
                    <th className="py-2.5 px-3 font-semibold">Status</th>
                    <th className="py-2.5 px-3 font-semibold">Key Violations / Action</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {inspections.map((item) => {
                    const isSelected = item.inspectionId === currentInspectionId;
                    const failedChecks = item.checks.filter((c) => c.status === 'FAIL');

                    return (
                      <tr
                        key={item.inspectionId}
                        className={`hover:bg-slate-50/80 transition ${
                          isSelected ? 'bg-indigo-50/50 font-medium' : ''
                        }`}
                      >
                        {/* Ref ID & Time */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          <div className="font-mono font-bold text-slate-800 text-[11px]">
                            {item.inspectionId}
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5">{item.timestamp}</div>
                        </td>

                        {/* Product & Category */}
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900 text-xs line-clamp-1">
                            {item.extractedDeclarations.productName?.value || 'Unlabeled Package'}
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                            <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium border border-slate-200">
                              {item.packageCategory.replace('_', ' ')}
                            </span>
                            <span className="line-clamp-1 text-slate-600">
                              {item.extractedDeclarations.manufacturerPacker?.name?.slice(0, 30)}
                            </span>
                          </div>
                        </td>

                        {/* Qty & MRP */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          <div className="font-semibold text-slate-800">
                            {item.extractedDeclarations.netQuantity?.declaredValue || '—'}
                          </div>
                          <div className="text-[11px] text-slate-600">
                            {item.extractedDeclarations.mrp?.declaredValue || '—'}
                          </div>
                        </td>

                        {/* Score */}
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          <span
                            className={`font-black text-sm ${
                              item.overallStatus === 'COMPLIANT'
                                ? 'text-emerald-600'
                                : item.overallStatus === 'NON_COMPLIANT'
                                ? 'text-rose-600'
                                : 'text-amber-600'
                            }`}
                          >
                            {item.overallScore}
                          </span>
                          <span className="text-[10px] text-slate-400">/100</span>
                        </td>

                        {/* Status Badge */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          {item.overallStatus === 'COMPLIANT' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              <CheckCircle2 className="w-3 h-3" /> PASS
                            </span>
                          )}
                          {item.overallStatus === 'NON_COMPLIANT' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                              <XCircle className="w-3 h-3" /> FAIL
                            </span>
                          )}
                          {item.overallStatus === 'PARTIALLY_COMPLIANT' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                              <AlertTriangle className="w-3 h-3" /> REVIEW
                            </span>
                          )}
                        </td>

                        {/* Key Violations */}
                        <td className="py-3 px-3 text-slate-600 text-[11px] max-w-xs">
                          {failedChecks.length === 0 ? (
                            <span className="text-emerald-700 font-medium">No statutory violations detected</span>
                          ) : (
                            <div className="space-y-0.5">
                              <span className="font-semibold text-rose-700">
                                {failedChecks.length} violation(s):
                              </span>
                              <div className="text-[10px] text-slate-600 line-clamp-2">
                                {failedChecks.map((f) => f.ruleName).join(', ')}
                              </div>
                            </div>
                          )}
                        </td>

                        {/* Action Switch */}
                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => {
                              onSelectInspection(item);
                              onClose();
                            }}
                            className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                              isSelected
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 border border-slate-200'
                            }`}
                          >
                            <span>{isSelected ? 'Active' : 'Inspect'}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Legal Certification Note */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 space-y-1.5">
            <div className="flex items-center space-x-2 text-slate-900 font-bold">
              <Building className="w-4 h-4 text-indigo-600" />
              <span>Department of Consumer Affairs • Legal Metrology Enforcement Registry</span>
            </div>
            <p className="text-slate-500 leading-relaxed">
              This cumulative registry compiles automated audits conducted under Section 36 of the Legal Metrology Act,
              2009 and Rules 6, 8, 9, 12, &amp; 18 of the Legal Metrology (Packaged Commodities) Rules, 2011. Generated
              records are admissible for administrative review, compounding proceedings, and issuing statutory show-cause
              notices.
            </p>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Showing <strong className="text-slate-800">{total}</strong> audited products in this session
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold transition cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-xs cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Download Full CSV</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
