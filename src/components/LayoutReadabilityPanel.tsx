import React from 'react';
import { Layout, Eye, Languages, CheckCircle2, AlertTriangle, Sparkles, BookOpen } from 'lucide-react';
import { LayoutAnalysis, LanguageDetection } from '../types/inspection';

interface LayoutReadabilityPanelProps {
  layout: LayoutAnalysis;
  languages: LanguageDetection[];
}

export const LayoutReadabilityPanel: React.FC<LayoutReadabilityPanelProps> = ({
  layout,
  languages,
}) => {
  const contrastColors = {
    HIGH: { text: 'text-emerald-700', bg: 'bg-emerald-100 border-emerald-200', label: 'High Contrast (Compliant)' },
    MEDIUM: { text: 'text-amber-700', bg: 'bg-amber-100 border-amber-200', label: 'Moderate Contrast (Legible)' },
    POOR: { text: 'text-rose-700', bg: 'bg-rose-100 border-rose-200', label: 'Poor Contrast (Deficient)' },
  }[layout.contrastRatio] || { text: 'text-slate-700', bg: 'bg-slate-100', label: layout.contrastRatio };

  const hasDevanagariOrHindi = languages.some(
    (l) => l.language.toLowerCase().includes('hindi') || l.script.toLowerCase().includes('devanagari')
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden" id="layout-readability-section">
      <div className="border-b border-slate-200 bg-slate-50/80 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Layout className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900">
            Layout, Readability &amp; Language Analysis
          </h3>
        </div>
        <span className="text-[11px] font-medium text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
          Rules 7, 8 &amp; 9 (LMPC)
        </span>
      </div>

      <div className="p-4 sm:p-5 space-y-5">
        {/* Top Grid: PDP & Visual Quality */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          
          {/* PDP Area Metric */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60">
            <span className="text-[11px] font-medium text-slate-500 block">Principal Display Panel</span>
            <div className="flex items-baseline space-x-1 mt-1">
              <span className="text-2xl font-extrabold text-slate-900">{layout.pdpEstimatedPercentage}%</span>
              <span className="text-xs text-slate-500">of frontal area</span>
            </div>
            <div className="text-[11px] text-slate-600 mt-1 font-semibold">
              Location: <span className="text-indigo-700">{layout.pdpLocation}</span>
            </div>
          </div>

          {/* Legibility Score */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60">
            <span className="text-[11px] font-medium text-slate-500 block">Font Legibility Index</span>
            <div className="flex items-baseline space-x-1 mt-1">
              <span className={`text-2xl font-extrabold ${layout.fontLegibilityScore >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>
                {layout.fontLegibilityScore}
              </span>
              <span className="text-xs text-slate-400">/100</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Optical clarity score
            </div>
          </div>

          {/* Contrast Ratio */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60">
            <span className="text-[11px] font-medium text-slate-500 block">Contrast vs Background</span>
            <div className="mt-1.5">
              <span className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-bold border ${contrastColors.bg} ${contrastColors.text}`}>
                {contrastColors.label}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1.5">
              Rule 8 contrast compliance
            </div>
          </div>

          {/* Lighting & Clarity */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60">
            <span className="text-[11px] font-medium text-slate-500 block">Lighting &amp; Surface Clutter</span>
            <div className="text-xs font-bold text-slate-800 mt-1">
              {layout.lightingQuality.replace('_', ' ')}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Interference: <span className="font-medium text-slate-700">{layout.backgroundInterference.replace('_', ' ')}</span>
            </div>
          </div>

        </div>

        {/* Qualitative Assessment Callout */}
        <div className="p-3 rounded-lg bg-indigo-50/70 border border-indigo-200/80 text-xs text-indigo-950 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="font-bold">Principal Display Assessment: </strong>
            {layout.pdpComplianceAssessment}
          </p>
        </div>

        {/* Detected Languages Section */}
        <div className="border-t border-slate-200 pt-4">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center space-x-2">
              <Languages className="w-4 h-4 text-indigo-600" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Detected Languages &amp; Script Verification (Rule 9)
              </h4>
            </div>
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                hasDevanagariOrHindi
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
            >
              {hasDevanagariOrHindi ? 'Bilingual (Hindi + English) ✓' : 'English Only (Hindi Optional/Recommended)'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {languages.map((lang, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{lang.language}</span>
                    <span className="text-[10px] font-semibold bg-indigo-100 text-indigo-800 px-1.5 py-0.2 rounded">
                      {lang.script} Script
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Confidence: <strong className="text-slate-800">{lang.percentageConfidence}%</strong>
                    {lang.isPrimary && ' • (Primary)'}
                  </div>
                </div>
                <div className="mt-2 text-[10px] font-mono text-slate-600 bg-white p-1.5 rounded border border-slate-200 truncate">
                  Snippet: "{lang.sampleTextFound}"
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Statutory Font Size Reference Table */}
        <div className="border-t border-slate-200 pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-slate-600" />
              Statutory Minimum Font Height Thresholds (Rule 12 Table 1)
            </span>
          </div>
          <div className="overflow-x-auto text-[11px]">
            <table className="min-w-full divide-y divide-slate-200 border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-100/80 font-semibold text-slate-700 text-left">
                <tr>
                  <th className="px-3 py-1.5">Net Quantity Category</th>
                  <th className="px-3 py-1.5">Min Height (Normal Package)</th>
                  <th className="px-3 py-1.5">Min Height (Blown/Moulded/Perforated)</th>
                  <th className="px-3 py-1.5">Statutory Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white text-slate-600">
                <tr>
                  <td className="px-3 py-1.5 font-medium text-slate-900">Up to 50 g / 50 ml</td>
                  <td className="px-3 py-1.5">1.0 mm</td>
                  <td className="px-3 py-1.5">2.0 mm</td>
                  <td className="px-3 py-1.5 font-mono text-slate-500">Rule 12, Table 1 (Row 1)</td>
                </tr>
                <tr>
                  <td className="px-3 py-1.5 font-medium text-slate-900">50 g/ml to 200 g/ml</td>
                  <td className="px-3 py-1.5">2.0 mm</td>
                  <td className="px-3 py-1.5">4.0 mm</td>
                  <td className="px-3 py-1.5 font-mono text-slate-500">Rule 12, Table 1 (Row 2)</td>
                </tr>
                <tr>
                  <td className="px-3 py-1.5 font-medium text-slate-900">200 g/ml to 1 kg / 1 L</td>
                  <td className="px-3 py-1.5">4.0 mm</td>
                  <td className="px-3 py-1.5">6.0 mm</td>
                  <td className="px-3 py-1.5 font-mono text-slate-500">Rule 12, Table 1 (Row 3)</td>
                </tr>
                <tr>
                  <td className="px-3 py-1.5 font-medium text-slate-900">Exceeding 1 kg / 1 L</td>
                  <td className="px-3 py-1.5">6.0 mm</td>
                  <td className="px-3 py-1.5">8.0 mm</td>
                  <td className="px-3 py-1.5 font-mono text-slate-500">Rule 12, Table 1 (Row 4)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
