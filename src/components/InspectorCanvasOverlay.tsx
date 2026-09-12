import React, { useState } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Layers,
  Eye,
  Info,
  Tag,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
} from 'lucide-react';
import { BoundingBox, InspectionAuditResult, DetectedDeclarationField } from '../types/inspection';
import { deriveDetectedFields } from '../utils/fieldExtractor';

interface InspectorCanvasOverlayProps {
  imageUrl: string;
  boundingBoxes: BoundingBox[];
  selectedBoxId: string | null;
  onSelectBox: (box: BoundingBox | null) => void;
  productName: string;
  auditResult?: InspectionAuditResult;
}

export const InspectorCanvasOverlay: React.FC<InspectorCanvasOverlayProps> = ({
  imageUrl,
  boundingBoxes,
  selectedBoxId,
  onSelectBox,
  productName,
  auditResult,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [showBoxes, setShowBoxes] = useState(true);
  const [showValueTags, setShowValueTags] = useState(true);
  const [filterTag, setFilterTag] = useState<string>('ALL');
  const [hoveredBox, setHoveredBox] = useState<BoundingBox | null>(null);

  // Derive detected fields to associate actual values with bounding boxes
  const detectedFields: DetectedDeclarationField[] = auditResult ? deriveDetectedFields(auditResult) : [];

  const getAssociatedField = (tag: BoundingBox['tag']) => {
    return detectedFields.find((f) => f.tag === tag);
  };

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.75));
  const handleReset = () => {
    setZoomLevel(1);
    setBrightness(100);
    setContrast(100);
  };

  const getTagColor = (tag: BoundingBox['tag']) => {
    switch (tag) {
      case 'net_quantity':
        return {
          border: 'border-emerald-500',
          bg: 'bg-emerald-500/15',
          text: 'text-emerald-800 bg-emerald-50',
          badge: 'bg-emerald-600 text-white',
          glow: 'ring-emerald-400',
        };
      case 'mrp':
        return {
          border: 'border-rose-500',
          bg: 'bg-rose-500/15',
          text: 'text-rose-800 bg-rose-50',
          badge: 'bg-rose-600 text-white',
          glow: 'ring-rose-400',
        };
      case 'product_name':
        return {
          border: 'border-blue-500',
          bg: 'bg-blue-500/15',
          text: 'text-blue-800 bg-blue-50',
          badge: 'bg-blue-600 text-white',
          glow: 'ring-blue-400',
        };
      case 'mfg_date':
      case 'exp_date':
        return {
          border: 'border-amber-500',
          bg: 'bg-amber-500/15',
          text: 'text-amber-800 bg-amber-50',
          badge: 'bg-amber-600 text-white',
          glow: 'ring-amber-400',
        };
      case 'packer':
        return {
          border: 'border-purple-500',
          bg: 'bg-purple-500/15',
          text: 'text-purple-800 bg-purple-50',
          badge: 'bg-purple-600 text-white',
          glow: 'ring-purple-400',
        };
      case 'consumer_care':
        return {
          border: 'border-cyan-500',
          bg: 'bg-cyan-500/15',
          text: 'text-cyan-800 bg-cyan-50',
          badge: 'bg-cyan-600 text-white',
          glow: 'ring-cyan-400',
        };
      case 'origin':
        return {
          border: 'border-teal-500',
          bg: 'bg-teal-500/15',
          text: 'text-teal-800 bg-teal-50',
          badge: 'bg-teal-600 text-white',
          glow: 'ring-teal-400',
        };
      default:
        return {
          border: 'border-indigo-500',
          bg: 'bg-indigo-500/15',
          text: 'text-indigo-800 bg-indigo-50',
          badge: 'bg-indigo-600 text-white',
          glow: 'ring-indigo-400',
        };
    }
  };

  const filteredBoxes = boundingBoxes.filter((box) => {
    if (filterTag === 'ALL') return true;
    if (filterTag === 'COMMODITY') return box.tag === 'product_name';
    if (filterTag === 'NET_QTY_MRP') return box.tag === 'net_quantity' || box.tag === 'mrp';
    if (filterTag === 'DATES') return box.tag === 'mfg_date' || box.tag === 'exp_date' || box.tag === 'batch';
    if (filterTag === 'PACKER_CARE') return box.tag === 'packer' || box.tag === 'consumer_care' || box.tag === 'origin';
    return true;
  });

  const activeBox = hoveredBox || boundingBoxes.find((b) => b.id === selectedBoxId) || null;
  const activeField = activeBox ? getAssociatedField(activeBox.tag) : null;

  return (
    <div
      className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col h-full"
      id="package-inspector-canvas"
    >
      {/* Top Toolbar */}
      <div className="border-b border-slate-200 bg-slate-50/90 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2.5 text-xs">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-slate-800 flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-indigo-600" />
            Visual Packaging Detection &amp; Bounding Boxes
          </span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-500 font-medium">
            {filteredBoxes.length} zones mapped
          </span>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center space-x-1">
          {[
            { id: 'ALL', label: 'All Zones' },
            { id: 'NET_QTY_MRP', label: 'Net Qty & MRP' },
            { id: 'DATES', label: 'Dates & Batch' },
            { id: 'PACKER_CARE', label: 'Packer & Care' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterTag(f.id)}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition cursor-pointer ${
                filterTag === f.id
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Zoom & Overlay Controls */}
        <div className="flex items-center space-x-1.5">
          {/* Toggle Boxes */}
          <button
            type="button"
            onClick={() => setShowBoxes(!showBoxes)}
            className={`px-2 py-1 rounded text-xs font-medium border flex items-center gap-1 cursor-pointer transition ${
              showBoxes
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                : 'bg-white border-slate-200 text-slate-600'
            }`}
            title="Toggle Bounding Boxes"
          >
            <Layers className="w-3 h-3" />
            <span>Boxes {showBoxes ? 'On' : 'Off'}</span>
          </button>

          {/* Toggle Value Tags */}
          <button
            type="button"
            onClick={() => setShowValueTags(!showValueTags)}
            className={`px-2 py-1 rounded text-xs font-medium border flex items-center gap-1 cursor-pointer transition ${
              showValueTags
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                : 'bg-white border-slate-200 text-slate-600'
            }`}
            title="Toggle Extracted Value Labels"
          >
            <Tag className="w-3 h-3" />
            <span>Values</span>
          </button>

          {/* Zoom In/Out Controls */}
          <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={handleZoomOut}
              className="px-2 py-1 hover:bg-slate-100 text-slate-600 transition cursor-pointer"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 py-0.5 text-[11px] font-mono text-slate-700 font-semibold">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              type="button"
              onClick={handleZoomIn}
              className="px-2 py-1 hover:bg-slate-100 text-slate-600 transition cursor-pointer"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-2 py-1 hover:bg-slate-100 text-slate-600 border-l border-slate-200 transition cursor-pointer"
              title="Reset zoom"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Stage / Image Viewer */}
      <div className="relative flex-1 bg-slate-950 min-h-[460px] max-h-[620px] overflow-auto flex items-center justify-center p-4 select-none">
        <div
          className="relative transition-transform duration-150 inline-block shadow-2xl rounded-lg overflow-hidden bg-black/40"
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'center center',
            filter: `brightness(${brightness}%) contrast(${contrast}%)`,
          }}
        >
          {/* Packaging Image */}
          <img
            src={imageUrl}
            alt={productName}
            className="max-h-[580px] max-w-full object-contain block mx-auto pointer-events-none"
          />

          {/* Bounding Boxes Overlay */}
          {showBoxes && (
            <div className="absolute inset-0 pointer-events-auto">
              {filteredBoxes.map((box) => {
                const colors = getTagColor(box.tag);
                const isSelected = selectedBoxId === box.id;
                const isHovered = hoveredBox?.id === box.id;
                const field = getAssociatedField(box.tag);
                const displayVal = field ? field.extractedValue : box.textSnippet;

                return (
                  <div
                    key={box.id}
                    onClick={() => onSelectBox(box)}
                    onMouseEnter={() => setHoveredBox(box)}
                    onMouseLeave={() => setHoveredBox(null)}
                    style={{
                      left: `${box.x}%`,
                      top: `${box.y}%`,
                      width: `${box.width}%`,
                      height: `${box.height}%`,
                    }}
                    className={`absolute border-2 ${colors.border} ${colors.bg} rounded-sm transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? `ring-4 ring-white ring-offset-2 ring-offset-indigo-900 z-30 scale-[1.01] animate-pulse`
                        : isHovered
                        ? 'ring-2 ring-white ring-offset-1 ring-offset-slate-900 z-25 scale-[1.01]'
                        : 'opacity-85 hover:opacity-100 z-10'
                    }`}
                  >
                    {/* Top Tag: Field Name + Confidence */}
                    <div
                      className={`absolute -top-5 left-0 px-1.5 py-0.2 text-[10px] font-bold rounded-t shadow-xs whitespace-nowrap pointer-events-none ${colors.badge} flex items-center gap-1`}
                    >
                      <span>{box.label}</span>
                      <span className="opacity-80">({box.confidence}%)</span>
                    </div>

                    {/* Bottom Tag: Extracted Value Preview (if enabled) */}
                    {showValueTags && displayVal && (
                      <div className="absolute -bottom-5 left-0 max-w-[180px] px-1.5 py-0.2 text-[9px] font-semibold bg-slate-900/90 text-white rounded-b truncate shadow-xs pointer-events-none border border-slate-700">
                        "{displayVal}"
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Enhanced Inspector Drawer / Tooltip at bottom of stage */}
        {activeBox && (
          <div className="absolute bottom-3 left-3 right-3 bg-slate-900/95 backdrop-blur-md text-white border border-slate-700 rounded-xl p-3 text-xs shadow-2xl z-40 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-indigo-300 uppercase tracking-wider text-[11px]">
                    {activeField?.fieldName || activeBox.label}
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-300 font-mono text-[11px]">
                    {activeField?.location || `[x: ${Math.round(activeBox.x)}%, y: ${Math.round(activeBox.y)}%]` }
                  </span>
                </div>
                <div className="text-sm font-bold text-white leading-snug line-clamp-1">
                  {activeField?.extractedValue || activeBox.textSnippet}
                </div>
              </div>

              {/* Attributes: Confidence, Readability, Status */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/80 font-mono font-bold text-[11px] flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-indigo-400" />
                  {activeBox.confidence}% Confidence
                </span>

                {activeField && (
                  <>
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold border flex items-center gap-1 ${
                        activeField.readability === 'Clear'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                          : activeField.readability === 'Difficult'
                          ? 'bg-amber-950 text-amber-300 border-amber-800'
                          : 'bg-rose-950 text-rose-300 border-rose-800'
                      }`}
                    >
                      {activeField.readability === 'Clear' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                      {activeField.readability === 'Difficult' && <AlertTriangle className="w-3 h-3 text-amber-400" />}
                      {activeField.readability === 'Unreadable' && <XCircle className="w-3 h-3 text-rose-400" />}
                      {activeField.readability}
                    </span>

                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                        activeField.status === 'Present'
                          ? 'bg-blue-950 text-blue-300 border-blue-800'
                          : activeField.status === 'Missing'
                          ? 'bg-rose-950 text-rose-300 border-rose-800'
                          : 'bg-amber-950 text-amber-300 border-amber-800'
                      }`}
                    >
                      {activeField.status}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Optical Adjustment Panel at Bottom */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-medium text-slate-500">Brightness:</span>
            <input
              type="range"
              min="60"
              max="160"
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              className="w-20 sm:w-24 accent-indigo-600 h-1 cursor-pointer"
            />
            <span className="font-mono text-[10px] text-slate-500">{brightness}%</span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-medium text-slate-500">Contrast:</span>
            <input
              type="range"
              min="60"
              max="160"
              value={contrast}
              onChange={(e) => setContrast(Number(e.target.value))}
              className="w-20 sm:w-24 accent-indigo-600 h-1 cursor-pointer"
            />
            <span className="font-mono text-[10px] text-slate-500">{contrast}%</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-[11px] text-slate-500">
          <Info className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
          <span>Click any zone above or field on the right to sync inspection evidence.</span>
        </div>
      </div>
    </div>
  );
};
