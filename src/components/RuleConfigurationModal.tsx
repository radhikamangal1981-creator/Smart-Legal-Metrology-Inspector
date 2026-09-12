import React, { useState } from 'react';
import { X, Sliders, CheckCircle2, RotateCcw, Shield, AlertCircle } from 'lucide-react';
import { MandatoryRuleConfig, PackageCategory } from '../types/inspection';
import { DEFAULT_MANDATORY_RULES } from '../data/defaultRules';

interface RuleConfigurationModalProps {
  isOpen: boolean;
  onClose: () => void;
  rules: MandatoryRuleConfig[];
  onSaveRules: (updatedRules: MandatoryRuleConfig[]) => void;
  currentCategory: PackageCategory;
}

export const RuleConfigurationModal: React.FC<RuleConfigurationModalProps> = ({
  isOpen,
  onClose,
  rules,
  onSaveRules,
  currentCategory,
}) => {
  const [localRules, setLocalRules] = useState<MandatoryRuleConfig[]>(rules);
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  if (!isOpen) return null;

  const toggleRule = (ruleId: string) => {
    setLocalRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, required: !r.required } : r))
    );
  };

  const resetDefaults = () => {
    setLocalRules([...DEFAULT_MANDATORY_RULES]);
  };

  const handleApply = () => {
    onSaveRules(localRules);
    onClose();
  };

  const filteredRules = localRules.filter((r) => {
    if (categoryFilter === 'ALL') return true;
    return r.applicableCategories.includes(categoryFilter as PackageCategory);
  });

  const activeCount = localRules.filter((r) => r.required).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="border-b border-slate-200 bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-indigo-600/30 text-indigo-400 border border-indigo-500/30">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Configure Mandatory Statutory Checks</h2>
              <p className="text-xs text-slate-400">
                Tailor inspection parameters under Legal Metrology (Packaged Commodities) Rules, 2011.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-600">Filter Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              <option value="FOOD_BEVERAGE">Food &amp; Beverages</option>
              <option value="COSMETICS">Cosmetics &amp; Toiletries</option>
              <option value="GENERAL_FMCG">General FMCG Goods</option>
              <option value="IMPORTED_GOODS">Imported Packaged Goods</option>
              <option value="ELECTRONICS">Electronics &amp; Hardware</option>
            </select>
          </div>

          <div className="flex items-center space-x-3 text-slate-600 font-medium">
            <span>
              Active Checks: <strong className="text-indigo-700">{activeCount}</strong> / {localRules.length}
            </span>
            <button
              type="button"
              onClick={resetDefaults}
              className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-semibold transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Defaults
            </button>
          </div>
        </div>

        {/* Rules Checklist List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {filteredRules.map((rule) => {
            return (
              <div
                key={rule.id}
                onClick={() => toggleRule(rule.id)}
                className={`p-3.5 rounded-xl border transition cursor-pointer flex items-start justify-between gap-4 ${
                  rule.required
                    ? 'bg-indigo-50/40 border-indigo-300 hover:bg-indigo-50/70'
                    : 'bg-slate-50/50 border-slate-200 opacity-60 hover:opacity-100'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-900">{rule.name}</span>
                    <span className="text-[10px] font-mono text-indigo-700 bg-indigo-100/70 px-1.5 py-0.2 rounded">
                      {rule.legalRef}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                        rule.severity === 'CRITICAL'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {rule.severity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {rule.description}
                  </p>
                  <div className="text-[10px] text-slate-400">
                    Applicable to: {rule.applicableCategories.map((c) => c.replace('_', ' ')).join(', ')}
                  </div>
                </div>

                {/* Switch checkbox */}
                <div className="shrink-0 pt-0.5">
                  <div
                    className={`w-10 h-6 flex items-center rounded-full p-1 transition duration-200 ease-in-out ${
                      rule.required ? 'bg-indigo-600' : 'bg-slate-300'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition duration-200 ease-in-out ${
                        rule.required ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Applying configuration will automatically re-score the current inspection report.
          </div>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200/70 rounded-lg transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-sm transition cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Apply &amp; Re-audit</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
