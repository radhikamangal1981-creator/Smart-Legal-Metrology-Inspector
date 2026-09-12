import React, { useState, useRef } from 'react';
import { Upload, Camera, Sparkles, Image as ImageIcon, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { PackageCategory, SamplePackageItem } from '../types/inspection';
import { SAMPLE_PACKAGES } from '../data/samplePackages';

interface ImageUploaderProps {
  onImageSelected: (base64: string, mimeType: string, category: PackageCategory, sampleId?: string, fileName?: string) => void;
  isAnalyzing: boolean;
  selectedCategory: PackageCategory;
  onCategoryChange: (cat: PackageCategory) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelected,
  isAnalyzing,
  selectedCategory,
  onCategoryChange,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'samples' | 'camera'>('samples');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const categories: { label: string; value: PackageCategory }[] = [
    { label: 'Food & Beverages', value: 'FOOD_BEVERAGE' },
    { label: 'Cosmetics & Toiletries', value: 'COSMETICS' },
    { label: 'General FMCG Goods', value: 'GENERAL_FMCG' },
    { label: 'Electronics & Hardware', value: 'ELECTRONICS' },
    { label: 'Imported Packaged Goods', value: 'IMPORTED_GOODS' },
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPEG, PNG, or WEBP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      onImageSelected(base64, file.type, selectedCategory, undefined, file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError('Unable to access device camera. Please check permissions or upload an image file.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 1280;
    canvas.height = videoRef.current.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    stopCamera();
    onImageSelected(dataUrl, 'image/jpeg', selectedCategory, undefined, 'camera_capture.jpg');
  };

  const handleSelectSample = (sample: SamplePackageItem) => {
    onImageSelected(sample.imageUrl, 'image/svg+xml', sample.category, sample.id, `${sample.id}.svg`);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden" id="package-input-section">
      {/* Tab Header */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/70 px-4 py-2.5">
        <div className="flex items-center space-x-1.5">
          <button
            type="button"
            onClick={() => {
              setActiveTab('samples');
              stopCamera();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === 'samples'
                ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Benchmark Samples
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('upload');
              stopCamera();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Upload Package Photo
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('camera');
              startCamera();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === 'camera'
                ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Camera Capture
          </button>
        </div>

        {/* Commodity Category Dropdown */}
        <div className="flex items-center space-x-2">
          <label htmlFor="package-category-select" className="text-xs font-medium text-slate-500 hidden sm:inline">
            Category:
          </label>
          <select
            id="package-category-select"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value as PackageCategory)}
            className="text-xs font-semibold bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="p-4 sm:p-5">
        {/* Tab 1: Benchmark Samples */}
        {activeTab === 'samples' && (
          <div>
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Select a Legal Metrology Benchmark Package</h3>
                <p className="text-xs text-slate-500">
                  Pre-configured real-world packaging cases with compliant and non-compliant statutory variations.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {SAMPLE_PACKAGES.map((sample) => {
                const outcomeBadges = {
                  COMPLIANT: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', text: 'COMPLIANT' },
                  NON_COMPLIANT: { bg: 'bg-rose-50 text-rose-700 border-rose-200', text: 'NON-COMPLIANT' },
                  PARTIALLY_COMPLIANT: { bg: 'bg-amber-50 text-amber-700 border-amber-200', text: 'NEEDS REVIEW' },
                }[sample.expectedOutcome];

                return (
                  <div
                    key={sample.id}
                    onClick={() => handleSelectSample(sample)}
                    className="group border border-slate-200 hover:border-indigo-400 rounded-xl p-3 bg-slate-50/50 hover:bg-indigo-50/30 transition cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Thumbnail Preview */}
                      <div className="h-36 w-full rounded-lg bg-white border border-slate-200 overflow-hidden flex items-center justify-center p-2 mb-2.5 group-hover:scale-[1.02] transition">
                        <img
                          src={sample.imageUrl}
                          alt={sample.title}
                          className="h-full object-contain"
                        />
                      </div>

                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${outcomeBadges.bg}`}>
                          {outcomeBadges.text}
                        </span>
                        <span className="text-[10px] font-medium text-slate-400">
                          {sample.brand}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition">
                        {sample.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {sample.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-200/80 flex items-center justify-between">
                      <span className="text-[10px] font-medium text-indigo-600 group-hover:underline">
                        Load &amp; Inspect →
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {sample.category.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Upload Package Photo */}
        {activeTab === 'upload' && (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileInput}
              className="hidden"
              id="package-file-input"
            />
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 sm:p-12 text-center transition cursor-pointer ${
                dragActive
                  ? 'border-indigo-500 bg-indigo-50/50'
                  : 'border-slate-300 hover:border-indigo-400 bg-slate-50/50 hover:bg-slate-50'
              }`}
            >
              <div className="mx-auto w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mb-3 shadow-xs">
                <Upload className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                Upload Packaged Commodity Image
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Drag and drop high-resolution photo of the package label, Principal Display Panel, or declaration panel.
              </p>
              <div className="mt-3 inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white shadow-xs">
                <span>Browse Files</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Supported formats: JPEG, PNG, WEBP (Max 20MB)
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: Camera Capture */}
        {activeTab === 'camera' && (
          <div>
            {cameraError ? (
              <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{cameraError}</span>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="relative rounded-xl overflow-hidden bg-slate-900 aspect-video max-h-96 mx-auto flex items-center justify-center border border-slate-700">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-contain"
                  />
                  {!cameraActive && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 text-slate-400 text-xs">
                      Initializing camera stream...
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={capturePhoto}
                    disabled={!cameraActive || isAnalyzing}
                    className="inline-flex items-center space-x-2 px-5 py-2.5 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition disabled:opacity-50 cursor-pointer"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Capture &amp; Analyze Package</span>
                  </button>
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Loading Overlay when analyzing */}
      {isAnalyzing && (
        <div className="bg-indigo-900/90 backdrop-blur-xs text-white p-3 text-center flex items-center justify-center space-x-2.5 text-xs font-semibold animate-pulse">
          <RefreshCw className="w-4 h-4 animate-spin text-indigo-300" />
          <span>Multimodal Gemini 3.8 Flash inspecting statutory declarations against Legal Metrology Rules...</span>
        </div>
      )}
    </div>
  );
};
