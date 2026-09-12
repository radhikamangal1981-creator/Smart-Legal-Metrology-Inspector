import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { InspectionOverviewBar } from './components/InspectionOverviewBar';
import { ImageUploader } from './components/ImageUploader';
import { InspectorCanvasOverlay } from './components/InspectorCanvasOverlay';
import { ExtractedDetailsPanel } from './components/ExtractedDetailsPanel';
import { LayoutReadabilityPanel } from './components/LayoutReadabilityPanel';
import { ComplianceAnalysisSection } from './components/ComplianceAnalysisSection';
import { RuleConfigurationModal } from './components/RuleConfigurationModal';
import { InspectionReportModal } from './components/InspectionReportModal';
import { BatchReportModal } from './components/BatchReportModal';
import { DEFAULT_MANDATORY_RULES } from './data/defaultRules';
import { SAMPLE_PACKAGES } from './data/samplePackages';
import {
  InspectionAuditResult,
  MandatoryRuleConfig,
  PackageCategory,
  BoundingBox,
} from './types/inspection';
import { reevaluateAuditWithRules } from './utils/evaluation';
import { AlertCircle, ShieldAlert, Sparkles, RefreshCw, Layers } from 'lucide-react';

export function App() {
  const [activeRules, setActiveRules] = useState<MandatoryRuleConfig[]>(DEFAULT_MANDATORY_RULES);
  const [selectedCategory, setSelectedCategory] = useState<PackageCategory>('FOOD_BEVERAGE');
  const [currentImage, setCurrentImage] = useState<string>(SAMPLE_PACKAGES[0].imageUrl);
  const [currentResult, setCurrentResult] = useState<InspectionAuditResult | null>(
    SAMPLE_PACKAGES[0].precomputedResult
  );
  const [inspectionHistory, setInspectionHistory] = useState<InspectionAuditResult[]>(
    SAMPLE_PACKAGES.map((s) => s.precomputedResult)
  );
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isConfigOpen, setIsConfigOpen] = useState<boolean>(false);
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [isBatchReportOpen, setIsBatchReportOpen] = useState<boolean>(false);
  const [selectedBox, setSelectedBox] = useState<BoundingBox | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [apiSource, setApiSource] = useState<string>('BENCHMARK_PRESET');

  // Handle image selection or benchmark sample selection
  const handleImageSelected = async (
    base64OrUrl: string,
    mimeType: string,
    category: PackageCategory,
    sampleId?: string,
    fileName?: string
  ) => {
    setErrorMessage(null);
    setCurrentImage(base64OrUrl);
    setSelectedCategory(category);
    setSelectedBox(null);

    // If a sample benchmark is selected, we can load the precomputed data or analyze
    if (sampleId) {
      const sample = SAMPLE_PACKAGES.find((s) => s.id === sampleId);
      if (sample) {
        setApiSource('BENCHMARK_PRESET');
        setCurrentResult(sample.precomputedResult);
        // Ensure present in history
        setInspectionHistory((prev) => {
          if (prev.some((item) => item.inspectionId === sample.precomputedResult.inspectionId)) {
            return prev;
          }
          return [sample.precomputedResult, ...prev];
        });
        return;
      }
    }

    // Call server inspection endpoint
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64: base64OrUrl,
          mimeType,
          category,
          activeRules,
          meta: {
            fileName: fileName || 'package_upload.jpg',
            inspectionLocation: 'Central Enforcement Zone, New Delhi',
            inspectorName: 'Inspector R. Sharma (Badge #LM-408)',
          },
        }),
      });

      const data = await response.json();

      if (data.success && data.result) {
        setApiSource(data.source || 'GEMINI_3_8_FLASH_MULTIMODAL');
        setCurrentResult(data.result);
        // Add new scan to inspection history
        setInspectionHistory((prev) => [data.result, ...prev.filter((p) => p.inspectionId !== data.result.inspectionId)]);
      } else {
        // If API key is not configured or an error occurred
        if (data.isApiKeyMissing) {
          setErrorMessage(
            'GEMINI_API_KEY is not configured on the server. You can still test all features and interactive audits using the pre-loaded real-world benchmark packages above!'
          );
        } else {
          setErrorMessage(data.error || 'Failed to inspect package image.');
        }
      }
    } catch (err: any) {
      console.error('Fetch error calling /api/analyze:', err);
      setErrorMessage(
        'Network error connecting to inspection service. Please check your network or try one of the benchmark packages.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Switch inspection view to an item from the history registry
  const handleSelectFromHistory = (item: InspectionAuditResult) => {
    setCurrentResult(item);
    setSelectedCategory(item.packageCategory);
    setSelectedBox(null);

    // Look for matching sample image
    const matchingSample = SAMPLE_PACKAGES.find((s) => s.precomputedResult.inspectionId === item.inspectionId);
    if (matchingSample) {
      setCurrentImage(matchingSample.imageUrl);
    }
  };

  // Re-evaluate checks when active rules change
  const handleSaveRules = (updatedRules: MandatoryRuleConfig[]) => {
    setActiveRules(updatedRules);
    if (currentResult) {
      const reevaluated = reevaluateAuditWithRules(currentResult, updatedRules);
      setCurrentResult(reevaluated);
      // Update in history as well
      setInspectionHistory((prev) =>
        prev.map((item) => (item.inspectionId === reevaluated.inspectionId ? reevaluated : item))
      );
    }
  };

  const handleReset = () => {
    setSelectedBox(null);
    setErrorMessage(null);
    // Reload first sample as default
    setCurrentImage(SAMPLE_PACKAGES[0].imageUrl);
    setSelectedCategory(SAMPLE_PACKAGES[0].category);
    setCurrentResult(SAMPLE_PACKAGES[0].precomputedResult);
    setApiSource('BENCHMARK_PRESET');
  };

  const scrollToTable = () => {
    const el = document.getElementById('compliance-analysis-section') || document.getElementById('statutory-compliance-table');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans" id="app-root">
      {/* Top Header */}
      <Header
        onOpenConfig={() => setIsConfigOpen(true)}
        onOpenReport={() => setIsReportOpen(true)}
        onOpenBatchReport={() => setIsBatchReportOpen(true)}
        onReset={handleReset}
        activeRuleCount={activeRules.filter((r) => r.required).length}
        totalRuleCount={activeRules.length}
        hasResult={!!currentResult}
        isAnalyzing={isAnalyzing}
        batchCount={inspectionHistory.length}
      />

      {/* Main App Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Error notification banner if any */}
        {errorMessage && (
          <div className="rounded-xl bg-amber-50 border border-amber-300 p-4 text-amber-900 text-xs flex items-start justify-between gap-3 shadow-xs">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">Inspection Notice: </strong>
                <span>{errorMessage}</span>
              </div>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-amber-700 hover:text-amber-950 font-bold text-sm px-2 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Package Image & Benchmark Selection Bar */}
        <ImageUploader
          onImageSelected={handleImageSelected}
          isAnalyzing={isAnalyzing}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* If an audit result is active */}
        {currentResult && (
          <>
            {/* Top Overview & Compliance Score Meter */}
            <InspectionOverviewBar
              result={currentResult}
              onOpenReport={() => setIsReportOpen(true)}
              onOpenBatchReport={() => setIsBatchReportOpen(true)}
              batchCount={inspectionHistory.length}
              onScrollToTable={scrollToTable}
            />

            {/* Split Inspection View: Left Visual Overlay, Right Extracted Particulars */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Interactive Visual Package Inspector */}
              <div className="lg:col-span-6 h-full">
                <InspectorCanvasOverlay
                  imageUrl={currentImage}
                  boundingBoxes={currentResult.boundingBoxes}
                  selectedBoxId={selectedBox?.id || null}
                  onSelectBox={(box) => setSelectedBox(box)}
                  productName={currentResult.extractedDeclarations.productName?.value || 'Package'}
                  auditResult={currentResult}
                />
              </div>

              {/* Right Column: Structured Statutory Declarations with 6 Fields & Flow View */}
              <div className="lg:col-span-6">
                <ExtractedDetailsPanel
                  declarations={currentResult.extractedDeclarations}
                  result={currentResult}
                  highlightTag={selectedBox?.tag || null}
                  onSelectField={(tag) => {
                    const box = currentResult.boundingBoxes.find((b) => b.tag === tag);
                    if (box) {
                      setSelectedBox(box);
                    }
                  }}
                />
              </div>

            </div>

            {/* Compliance-Analysis Section (Positioned Directly Below Image & Declarations) */}
            <ComplianceAnalysisSection
              auditResult={currentResult}
              onSelectRequirement={(ruleId) => {
                const box = currentResult.boundingBoxes.find((b) => b.tag === ruleId);
                if (box) setSelectedBox(box);
              }}
            />

            {/* Layout, Readability, and Language Analysis */}
            <LayoutReadabilityPanel
              layout={currentResult.layoutAnalysis}
              languages={currentResult.detectedLanguages}
            />
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-800">Smart Legal Metrology Inspector</span>
            <span>•</span>
            <span>SIH26034 Prototype</span>
          </div>
          <p className="text-slate-400 text-center sm:text-right">
            Automated verification under the Legal Metrology (Packaged Commodities) Rules, 2011 &amp; Section 36 of Legal Metrology Act, 2009.
          </p>
        </div>
      </footer>

      {/* Rule Configuration Modal */}
      <RuleConfigurationModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        rules={activeRules}
        onSaveRules={handleSaveRules}
        currentCategory={selectedCategory}
      />

      {/* Official Inspection Certificate / Notice Report Modal */}
      {currentResult && (
        <InspectionReportModal
          isOpen={isReportOpen}
          onClose={() => setIsReportOpen(false)}
          result={currentResult}
        />
      )}

      {/* Cumulative Products Batch Report & Registry Modal */}
      <BatchReportModal
        isOpen={isBatchReportOpen}
        onClose={() => setIsBatchReportOpen(false)}
        inspections={inspectionHistory}
        onSelectInspection={handleSelectFromHistory}
        currentInspectionId={currentResult?.inspectionId}
      />
    </div>
  );
}

export default App;
