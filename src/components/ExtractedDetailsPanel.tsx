import React, { useState } from 'react';
import {
  Package,
  Scale,
  IndianRupee,
  Building2,
  PhoneCall,
  Calendar,
  Layers,
  Globe,
  Copy,
  Check,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  HelpCircle,
  FileCheck2,
  Sparkles,
  ArrowRight,
  Maximize2,
  Table,
  LayoutGrid,
} from 'lucide-react';
import {
  ExtractedDeclarations,
  InspectionAuditResult,
  BoundingBox,
  DetectedDeclarationField,
  FieldReadability,
  FieldPresenceStatus,
} from '../types/inspection';
import { deriveDetectedFields } from '../utils/fieldExtractor';

interface ExtractedDetailsPanelProps {
  declarations: ExtractedDeclarations;
  result: InspectionAuditResult;
  highlightTag?: string | null;
  onSelectField?: (tag: BoundingBox['tag']) => void;
}

export const ExtractedDetailsPanel: React.FC<ExtractedDetailsPanelProps> = ({
  declarations,
  result,
  highlightTag,
  onSelectField,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'FLOW_LIST' | 'CARD_GRID'>('FLOW_LIST');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PRESENT' | 'MISSING' | 'UNCLEAR'>('ALL');

  const fields: DetectedDeclarationField[] = deriveDetectedFields(result);

  const copyToClipboard = (text: string, key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const getFieldIcon = (tag: BoundingBox['tag']) => {
    switch (tag) {
      case 'product_name':
        return <Package className="w-4 h-4 text-blue-600 shrink-0" />;
      case 'net_quantity':
        return <Scale className="w-4 h-4 text-emerald-600 shrink-0" />;
      case 'mrp':
        return <IndianRupee className="w-4 h-4 text-rose-600 shrink-0" />;
      case 'packer':
        return <Building2 className="w-4 h-4 text-purple-600 shrink-0" />;
      case 'consumer_care':
        return <PhoneCall className="w-4 h-4 text-cyan-600 shrink-0" />;
      case 'mfg_date':
      case 'exp_date':
        return <Calendar className="w-4 h-4 text-amber-600 shrink-0" />;
      case 'origin':
        return <Globe className="w-4 h-4 text-teal-600 shrink-0" />;
      default:
        return <FileCheck2 className="w-4 h-4 text-slate-600 shrink-0" />;
    }
  };

  const renderReadabilityBadge = (readability: FieldReadability) => {
    switch (readability) {
      case 'Clear':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Clear
          </span>
        );
      case 'Difficult':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            Difficult
          </span>
        );
      case 'Unreadable':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3 text-rose-600" />
            Unreadable
          </span>
        );
    }
  };

  const renderStatusBadge = (status: FieldPresenceStatus) => {
    switch (status) {
      case 'Present':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Check className="w-3 h-3 text-blue-600" />
            Present
          </span>
        );
      case 'Missing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3 text-rose-600" />
            Missing
          </span>
        );
      case 'Unclear':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <HelpCircle className="w-3 h-3 text-amber-600" />
            Unclear
          </span>
        );
    }
  };

  const filteredFields = fields.filter((f) => {
    if (filterStatus === 'ALL') return true;
    if (filterStatus === 'PRESENT') return f.status === 'Present';
    if (filterStatus === 'MISSING') return f.status === 'Missing';
    if (filterStatus === 'UNCLEAR') return f.status === 'Unclear';
    return true;
  });

  const presentCount = fields.filter((f) => f.status === 'Present').length;
  const missingCount = fields.filter((f) => f.status === 'Missing').length;
  const unclearCount = fields.filter((f) => f.status === 'Unclear').length;
  const clearCount = fields.filter((f) => f.readability === 'Clear').length;

  return (
    <div
      className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col h-full"
      id="extracted-declarations-panel"
    >
      {/* Header Bar */}
      <div className="border-b border-slate-200 bg-slate-50/90 px-4 sm:px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <FileCheck2 className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Detected Packaging Declarations &amp; Extracted Values
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Actual text and values extracted with vision confidence, location, readability, and presence status
          </p>
        </div>

        {/* View Toggle & Status Filter */}
        <div className="flex items-center space-x-2">
          <div className="inline-flex p-0.5 rounded-lg bg-slate-200/80 border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('FLOW_LIST')}
              className={`px-2.5 py-1 rounded-md font-semibold transition cursor-pointer flex items-center gap-1 ${
                viewMode === 'FLOW_LIST'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Sequential field flow view"
            >
              <Table className="w-3.5 h-3.5" />
              <span>Flow View</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('CARD_GRID')}
              className={`px-2.5 py-1 rounded-md font-semibold transition cursor-pointer flex items-center gap-1 ${
                viewMode === 'CARD_GRID'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Detailed field cards grid"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>
          </div>
        </div>
      </div>

      {/* Field Detection Summary Chips Bar */}
      <div className="px-4 sm:px-5 py-2.5 bg-slate-100/60 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-2.5 py-1 rounded-md font-semibold transition cursor-pointer ${
              filterStatus === 'ALL'
                ? 'bg-slate-800 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Fields ({fields.length})
          </button>
          <button
            onClick={() => setFilterStatus('PRESENT')}
            className={`px-2.5 py-1 rounded-md font-semibold transition cursor-pointer ${
              filterStatus === 'PRESENT'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-blue-700 border border-blue-200 hover:bg-blue-50'
            }`}
          >
            Present ({presentCount})
          </button>
          {missingCount > 0 && (
            <button
              onClick={() => setFilterStatus('MISSING')}
              className={`px-2.5 py-1 rounded-md font-semibold transition cursor-pointer ${
                filterStatus === 'MISSING'
                  ? 'bg-rose-600 text-white'
                  : 'bg-white text-rose-700 border border-rose-200 hover:bg-rose-50'
              }`}
            >
              Missing ({missingCount})
            </button>
          )}
          {unclearCount > 0 && (
            <button
              onClick={() => setFilterStatus('UNCLEAR')}
              className={`px-2.5 py-1 rounded-md font-semibold transition cursor-pointer ${
                filterStatus === 'UNCLEAR'
                  ? 'bg-amber-600 text-white'
                  : 'bg-white text-amber-700 border border-amber-200 hover:bg-amber-50'
              }`}
            >
              Unclear ({unclearCount})
            </button>
          )}
        </div>

        <div className="text-[11px] text-slate-500 font-medium">
          <span className="text-emerald-700 font-bold">{clearCount}</span> Clear readability • Click row to highlight on image
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-3">
        {viewMode === 'FLOW_LIST' ? (
          /* Flow Table / Row View Matching: Field name → Extracted value → Confidence → Bounding box/location → Readability → Status */
          <div className="space-y-2.5">
            {filteredFields.map((field) => {
              const isSelected = highlightTag === field.tag;

              return (
                <div
                  key={field.id}
                  onClick={() => onSelectField && onSelectField(field.tag)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50/90 border-indigo-400 ring-2 ring-indigo-300 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-indigo-200 hover:bg-slate-50/70 shadow-2xs'
                  }`}
                >
                  {/* Top Bar: Field Name + Value + Copy */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div className="flex items-center space-x-2.5">
                      <div className="p-1.5 rounded-lg bg-slate-100 border border-slate-200">
                        {getFieldIcon(field.tag)}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                          {field.fieldName}
                        </div>
                        <div className="text-sm sm:text-base font-extrabold text-slate-900 mt-0.5 leading-snug">
                          {field.extractedValue}
                        </div>
                      </div>
                    </div>

                    {/* Copy Button */}
                    <div className="flex items-center space-x-1 self-end md:self-auto">
                      <button
                        onClick={(e) => copyToClipboard(field.extractedValue, field.id, e)}
                        className="inline-flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
                        title="Copy extracted text"
                      >
                        {copiedKey === field.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700 font-bold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Flow Chain Attributes: Confidence → Location → Readability → Status */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
                    {/* Confidence */}
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 font-mono text-slate-700">
                      <Sparkles className="w-3 h-3 text-indigo-500" />
                      <span>{field.confidence}% Confidence</span>
                    </div>

                    <ArrowRight className="w-3 h-3 text-slate-300 hidden sm:inline" />

                    {/* Location */}
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700">
                      <span className="text-slate-400 font-medium">Location:</span>
                      <span className="font-semibold text-slate-800">{field.location}</span>
                    </div>

                    <ArrowRight className="w-3 h-3 text-slate-300 hidden sm:inline" />

                    {/* Readability */}
                    <div className="flex items-center gap-1">
                      <span className="text-slate-400 text-[11px] font-medium hidden sm:inline">Readability:</span>
                      {renderReadabilityBadge(field.readability)}
                    </div>

                    <ArrowRight className="w-3 h-3 text-slate-300 hidden sm:inline" />

                    {/* Status */}
                    <div className="flex items-center gap-1">
                      <span className="text-slate-400 text-[11px] font-medium hidden sm:inline">Status:</span>
                      {renderStatusBadge(field.status)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Card Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredFields.map((field) => {
              const isSelected = highlightTag === field.tag;

              return (
                <div
                  key={field.id}
                  onClick={() => onSelectField && onSelectField(field.tag)}
                  className={`p-4 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-indigo-50/90 border-indigo-400 ring-2 ring-indigo-300 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-indigo-200 hover:bg-slate-50/80 shadow-2xs'
                  }`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-bold text-slate-600 flex items-center gap-1.5 uppercase tracking-wider">
                        {getFieldIcon(field.tag)}
                        {field.fieldName}
                      </span>
                      <button
                        onClick={(e) => copyToClipboard(field.extractedValue, field.id, e)}
                        className="text-slate-400 hover:text-slate-700 p-1 rounded transition cursor-pointer"
                        title="Copy text"
                      >
                        {copiedKey === field.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {/* Extracted Value */}
                    <div className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                      {field.extractedValue}
                    </div>

                    {/* Location & Coordinates */}
                    <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
                      <span className="font-semibold text-slate-700">{field.location}</span>
                    </div>

                    {/* Raw Text preview if available */}
                    {field.rawText && (
                      <div className="mt-2 text-[10px] font-mono text-slate-500 bg-slate-50 p-1.5 rounded border border-slate-200 truncate">
                        Raw: "{field.rawText}"
                      </div>
                    )}
                  </div>

                  {/* Bottom Badges */}
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono font-semibold text-slate-500">
                      {field.confidence}% Vision
                    </span>
                    <div className="flex items-center space-x-1.5">
                      {renderReadabilityBadge(field.readability)}
                      {renderStatusBadge(field.status)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Info Notice */}
      <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
        <span className="font-medium text-slate-600">
          Showing {filteredFields.length} of {fields.length} detected packaging declarations
        </span>
        <span className="text-[11px] text-indigo-600 font-semibold">
          Click any field to zoom &amp; locate on canvas
        </span>
      </div>
    </div>
  );
};
