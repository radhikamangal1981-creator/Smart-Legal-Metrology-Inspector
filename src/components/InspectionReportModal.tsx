import React, { useRef } from 'react';
import { X, Printer, Download, Copy, Check, ShieldCheck, FileText, AlertOctagon, CheckCircle2 } from 'lucide-react';
import { InspectionAuditResult } from '../types/inspection';
import { deriveDetectedFields } from '../utils/fieldExtractor';

interface InspectionReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: InspectionAuditResult;
}

export const InspectionReportModal: React.FC<InspectionReportModalProps> = ({
  isOpen,
  onClose,
  result,
}) => {
  const [copied, setCopied] = React.useState(false);
  const reportRef = useRef<HTMLDivElement | null>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(result, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `INSPECTION_REPORT_${result.inspectionId}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDownloadHTML = () => {
    if (!reportRef.current) return;
    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Legal Metrology Inspection Report - ${result.inspectionId}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; color: #1e293b; }
          .header { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 20px; margin-bottom: 25px; }
          .title { font-size: 22px; font-weight: bold; text-transform: uppercase; color: #0f172a; }
          .subtitle { font-size: 13px; color: #475569; margin-top: 4px; }
          .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-weight: bold; font-size: 13px; margin: 10px 0; }
          .pass { background: #dcfce7; color: #166534; }
          .fail { background: #ffe4e6; color: #9f1239; }
          .review { background: #fef3c7; color: #92400e; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 12px; }
          th, td { border: 1px solid #cbd5e1; padding: 8px 10px; text-align: left; }
          th { background: #f1f5f9; }
          .footer { margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 11px; color: #64748b; text-align: center; }
        </style>
      </head>
      <body>
        ${reportRef.current.innerHTML}
        <div class="footer">
          Official Inspection Record • Generated under SIH26034 Smart Legal Metrology Inspector Engine
        </div>
      </body>
      </html>
    `;
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `INSPECTION_CERTIFICATE_${result.inspectionId}.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const copyReportText = () => {
    const text = `
LEGAL METROLOGY INSPECTION REPORT (SIH26034)
Reference ID: ${result.inspectionId}
Date & Time: ${result.timestamp}
Product: ${result.extractedDeclarations.productName?.value}
Category: ${result.packageCategory}
Overall Compliance: ${result.overallStatus} (Score: ${result.overallScore}/100)
Suggested Legal Action: ${result.suggestedAction}

EXTRACTED DECLARATIONS:
- Generic Commodity: ${result.extractedDeclarations.productName?.genericName || 'N/A'}
- Net Quantity: ${result.extractedDeclarations.netQuantity?.declaredValue} (Standard: ${result.extractedDeclarations.netQuantity?.standardUnitCompliant ? 'YES' : 'NO'})
- MRP: ${result.extractedDeclarations.mrp?.declaredValue} (Includes Taxes: ${result.extractedDeclarations.mrp?.includesTaxesDeclaration ? 'YES' : 'NO'})
- Manufacturer: ${result.extractedDeclarations.manufacturerPacker?.name}, ${result.extractedDeclarations.manufacturerPacker?.fullAddress}
- Mfg Date: ${result.extractedDeclarations.dates?.mfgDate || 'N/A'}, Expiry: ${result.extractedDeclarations.dates?.expiryDate || result.extractedDeclarations.dates?.bestBeforePeriod || 'N/A'}
- Consumer Care: ${result.extractedDeclarations.consumerCare?.phoneOrTollFree || 'N/A'} | ${result.extractedDeclarations.consumerCare?.email || 'N/A'}
- Country of Origin: ${result.extractedDeclarations.countryOfOrigin?.country || 'N/A'}

VIOLATIONS / FINDINGS:
${result.checks
  .map(
    (c) =>
      `[${c.status}] ${c.ruleName} (${c.legalReference}): ${c.findingsAndExplanation} -> Remedial: ${c.remedialAction}`
  )
  .join('\n')}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isCompliant = result.overallStatus === 'COMPLIANT';
  const isNonCompliant = result.overallStatus === 'NON_COMPLIANT';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-300 shadow-2xl max-w-4xl w-full my-auto overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Control Bar (Hidden in Print) */}
        <div className="bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between border-b border-slate-800 print:hidden">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            <span className="font-bold text-sm">Official Legal Metrology Inspection Certificate</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={copyReportText}
              className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition cursor-pointer"
              title="Copy plain text summary"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadJSON}
              className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition cursor-pointer"
              title="Download structured JSON audit trail"
            >
              <Download className="w-3.5 h-3.5" />
              <span>JSON</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadHTML}
              className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition cursor-pointer"
              title="Download standalone HTML certificate"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span>HTML</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Certificate Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-slate-50 print:bg-white print:p-0" ref={reportRef}>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 sm:p-10 max-w-3xl mx-auto print:border-none print:shadow-none print:p-0">
            
            {/* National Crest / Header */}
            <div className="text-center border-b-2 border-slate-900 pb-5 mb-6">
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-xl border-2 border-amber-400 shadow-xs">
                ⚖
              </div>
              <h1 className="text-xs font-bold uppercase tracking-widest text-slate-600">
                Department of Consumer Affairs • Government of India
              </h1>
              <h2 className="text-lg sm:text-xl font-extrabold uppercase tracking-tight text-slate-900 mt-1">
                Legal Metrology Packaged Commodities Inspection Certificate
              </h2>
              <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
                Issued pursuant to Rule 6 &amp; Rule 29 of the Legal Metrology (Packaged Commodities) Rules, 2011
              </p>
            </div>

            {/* Inspection Meta Metadata Box */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs mb-6">
              <div>
                <span className="text-slate-400 block text-[10px] font-semibold">Inspection ID:</span>
                <span className="font-mono font-bold text-slate-900">{result.inspectionId}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-semibold">Timestamp:</span>
                <span className="font-medium text-slate-800">{result.timestamp}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-semibold">Inspector Officer:</span>
                <span className="font-medium text-slate-800">{result.inspectorName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-semibold">Station / Location:</span>
                <span className="font-medium text-slate-800">{result.inspectionLocation}</span>
              </div>
            </div>

            {/* Outcome Banner */}
            <div
              className={`p-4 rounded-xl border mb-6 flex items-center justify-between ${
                isCompliant
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : isNonCompliant
                  ? 'bg-rose-50 border-rose-300 text-rose-900'
                  : 'bg-amber-50 border-amber-300 text-amber-900'
              }`}
            >
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider">Overall Statutory Finding</div>
                <div className="text-lg font-black tracking-tight flex items-center gap-2 mt-0.5">
                  {result.overallStatus}
                  <span className="text-xs font-normal opacity-80">(Score: {result.overallScore}/100)</span>
                </div>
                <p className="text-xs mt-1 leading-relaxed">{result.summaryNotes}</p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] font-semibold block text-slate-500">Statutory Action</span>
                <span className="inline-block mt-0.5 px-3 py-1 text-xs font-bold rounded-lg bg-white border shadow-xs">
                  {result.suggestedAction.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Regulatory Notice: AI Detection vs Compliance Assessment */}
            <div className="mb-5 p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-950">
              <strong className="font-bold text-amber-900 block mb-0.5">
                Statutory Distinction: AI Vision Extraction vs. Legal Metrology Compliance
              </strong>
              <p className="text-[11px] leading-relaxed text-amber-900">
                AI detection confidence reflects character recognition and bounding box localization certainty. Legal compliance is computed independently by assessing statutory conformance under the Legal Metrology (Packaged Commodities) Rules, 2011.
              </p>
            </div>

            {/* Commodity Particulars & Extracted Evidence (6 Attributes) */}
            <div className="mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 border-b border-slate-200 pb-1 flex items-center justify-between">
                <span>1. Detected Declarations &amp; Extracted Values</span>
                <span className="text-[10px] font-mono text-slate-500 lowercase">
                  Field name • Extracted value • Confidence • Location • Readability • Status
                </span>
              </h3>
              <table className="min-w-full text-xs border border-slate-200">
                <thead className="bg-slate-100 text-slate-700 font-bold">
                  <tr>
                    <th className="px-2.5 py-1.5 border-b border-slate-200 text-left">Field Name</th>
                    <th className="px-2.5 py-1.5 border-b border-slate-200 text-left">Extracted Value</th>
                    <th className="px-2.5 py-1.5 border-b border-slate-200 text-center">Confidence</th>
                    <th className="px-2.5 py-1.5 border-b border-slate-200 text-left">Location</th>
                    <th className="px-2.5 py-1.5 border-b border-slate-200 text-center">Readability</th>
                    <th className="px-2.5 py-1.5 border-b border-slate-200 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {deriveDetectedFields(result).map((f) => (
                    <tr key={f.id}>
                      <td className="px-2.5 py-1.5 font-bold text-slate-800 whitespace-nowrap bg-slate-50/50">{f.fieldName}</td>
                      <td className="px-2.5 py-1.5 font-semibold text-slate-900">{f.extractedValue}</td>
                      <td className="px-2.5 py-1.5 text-center font-mono text-[11px] text-slate-700">{f.confidence}%</td>
                      <td className="px-2.5 py-1.5 text-slate-600 whitespace-nowrap">{f.location}</td>
                      <td className="px-2.5 py-1.5 text-center whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          f.readability === 'Clear' ? 'bg-emerald-100 text-emerald-800' :
                          f.readability === 'Difficult' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {f.readability}
                        </span>
                      </td>
                      <td className="px-2.5 py-1.5 text-center whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          f.status === 'Present' ? 'bg-blue-100 text-blue-800' :
                          f.status === 'Missing' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {f.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Checklist Results */}
            <div className="mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 border-b border-slate-200 pb-1">
                2. Statutory Checklist Findings &amp; Penal Evaluations
              </h3>
              <table className="min-w-full text-xs border border-slate-200">
                <thead className="bg-slate-100 font-bold text-slate-700">
                  <tr>
                    <th className="px-3 py-2 text-left">Statutory Rule</th>
                    <th className="px-3 py-2 text-left">Extracted Evidence</th>
                    <th className="px-3 py-2 text-center">Status</th>
                    <th className="px-3 py-2 text-left">Legal Finding / Remedial Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {result.checks.map((c, i) => (
                    <tr key={i} className={c.status === 'FAIL' ? 'bg-rose-50/40' : ''}>
                      <td className="px-3 py-2">
                        <div className="font-bold text-slate-900">{c.ruleName}</div>
                        <div className="font-mono text-[10px] text-slate-500">{c.legalReference}</div>
                      </td>
                      <td className="px-3 py-2 font-mono text-[11px] text-slate-700 max-w-[180px] truncate">
                        "{c.extractedEvidence || 'N/A'}"
                      </td>
                      <td className="px-3 py-2 text-center font-bold">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] ${
                            c.status === 'PASS'
                              ? 'bg-emerald-100 text-emerald-800'
                              : c.status === 'FAIL'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-[11px] text-slate-700">
                        <div>{c.findingsAndExplanation}</div>
                        {c.status === 'FAIL' && (
                          <div className="mt-1 font-semibold text-rose-700">
                            Penalty: {c.penalProvision}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Official Order & Signature Block */}
            <div className="border-t border-slate-300 pt-6 mt-6 grid grid-cols-2 gap-8 text-xs">
              <div>
                <span className="font-bold text-slate-800 block mb-1">Enforcement Officer Directive:</span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {isNonCompliant
                    ? 'The manufacturer/packer is hereby directed to show cause within fifteen (15) days from the receipt of this inspection notice as to why penal proceedings under Section 36(1) of the Legal Metrology Act, 2009 should not be initiated.'
                    : 'The sample package inspected satisfies all mandatory declarations under the Legal Metrology (Packaged Commodities) Rules, 2011 at the time of examination.'}
                </p>
              </div>

              <div className="text-right flex flex-col justify-end items-end">
                <div className="border-b border-slate-400 w-48 mb-1"></div>
                <span className="font-bold text-slate-900">Authorized Signatory</span>
                <span className="text-[10px] text-slate-500">
                  Inspector of Legal Metrology, Enforcement Wing
                </span>
                <span className="text-[9px] font-mono text-slate-400 mt-1">
                  Digital Verification Hash: {result.inspectionId}-VERIFIED
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
