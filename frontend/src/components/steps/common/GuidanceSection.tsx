import React, { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle, Search, Sparkles, Brain } from 'lucide-react';
import { GuidanceItem, ThemeColors } from '../../../types';

interface GuidanceSectionProps {
  items: GuidanceItem[];
  theme: ThemeColors;
  stepNumber: string;
  onResExploreOpen?: () => void;
  onResearchSuggestionOpen?: () => void;
  onAiUsageOpen?: () => void;
}

const GuidanceSection: React.FC<GuidanceSectionProps> = ({ items, theme, stepNumber, onResExploreOpen, onResearchSuggestionOpen, onAiUsageOpen }) => {
  const [expandedId, setExpandedId] = useState<string | null>(items[0]?.id || null);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-black mb-6">Hướng dẫn cụ thể</h3>
      
      {items.map((item) => {
        const isExpanded = expandedId === item.id;
        const hasResExplore = !!item.resExploreBox;
        const hasResearchSuggestion = stepNumber === "01" && item.stepNumber === 1;
        const hasAiUsage = stepNumber === "01" && item.stepNumber === 1;
        
        return (
          <div
            key={item.id}
            className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
              isExpanded 
                ? 'border-white/50 bg-white/30 shadow-lg' 
                : 'border-white/20 bg-white/10 hover:bg-white/20'
            }`}
          >
            {/* Header */}
            <button
              onClick={() => toggleExpand(item.id)}
              className="w-full p-5 flex items-start gap-4 text-left"
            >
              {/* Step Number Circle */}
              <div className={`shrink-0 w-10 h-10 rounded-full ${theme.accent} text-white flex items-center justify-center font-black text-lg shadow-md`}>
                {item.stepNumber}
              </div>
              
              {/* Title and Preview */}
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-lg leading-tight mb-1">
                  {item.title}
                </h4>
                {!isExpanded && (
                  <p className="text-sm opacity-70 line-clamp-2">
                    {item.description}
                  </p>
                )}
              </div>
              
              {/* Expand Icon */}
              <div className="shrink-0 mt-1">
                {isExpanded ? (
                  <ChevronUp size={20} className="opacity-60" />
                ) : (
                  <ChevronDown size={20} className="opacity-60" />
                )}
              </div>
            </button>

            {/* Expanded Content */}
            {isExpanded && (
              <div className="px-5 pb-5 pt-0">
                {/* Main Description */}
                <div className="pl-14 space-y-4">
                  <p className="opacity-90 leading-relaxed">
                    {item.description}
                  </p>
                  
                  {/* Sub-steps if available */}
                  {item.subSteps && item.subSteps.length > 0 && (
                    <div className="bg-white/20 rounded-xl p-4 space-y-2">
                      <p className="font-semibold text-sm opacity-80 mb-3">Khuyến khích người dùng:</p>
                      <ul className="space-y-2">
                        {item.subSteps.map((subStep, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-sm">
                            <CheckCircle size={16} className="shrink-0 mt-0.5 opacity-60" />
                            <span className="opacity-90">{subStep}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Action Buttons Row */}
                  {(hasResExplore || hasResearchSuggestion || hasAiUsage) && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      {/* ResExplore Button */}
                      {hasResExplore && item.resExploreBox && (
                        <div className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl p-4 border border-blue-400/30 h-full">
                          <div className="flex items-start gap-3">
                            <div className="shrink-0 w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                              <Search className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <h5 className="font-semibold text-blue-900 mb-1">
                                {item.resExploreBox.title}
                              </h5>
                              <p className="text-sm text-blue-700/80 mb-3">
                                {item.resExploreBox.description}
                              </p>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onResExploreOpen?.();
                                }}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors w-full justify-center"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                </svg>
                                {item.resExploreBox.buttonLabel}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Research Suggestion Button */}
                      {hasResearchSuggestion && (
                        <div className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-xl p-4 border border-orange-400/30 h-full">
                          <div className="flex items-start gap-3">
                            <div className="shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                              <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <h5 className="font-semibold text-orange-900 mb-1">
                                Research Suggestion
                              </h5>
                              <p className="text-sm text-orange-700/80 mb-3">
                                Gợi ý đề tài nghiên cứu dựa trên AI theo chuyên ngành và sở thích của bạn
                              </p>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onResearchSuggestionOpen?.();
                                }}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F36F21] to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-medium rounded-lg transition-colors w-full justify-center"
                              >
                                <Sparkles className="w-4 h-4" />
                                Mở AI Assistant
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* AI Use in Research Button */}
                      {hasAiUsage && (
                        <div className="bg-gradient-to-r from-purple-500/20 to-violet-500/20 rounded-xl p-4 border border-purple-400/30 h-full">
                          <div className="flex items-start gap-3">
                            <div className="shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                              <Brain className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <h5 className="font-semibold text-purple-900 mb-1">
                                AI Use in Research
                              </h5>
                              <p className="text-sm text-purple-700/80 mb-3">
                                Hướng dẫn sử dụng AI hiệu quả trong từng giai đoạn nghiên cứu
                              </p>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onAiUsageOpen?.();
                                }}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white text-sm font-medium rounded-lg transition-colors w-full justify-center"
                              >
                                <Brain className="w-4 h-4" />
                                Xem hướng dẫn
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default GuidanceSection;
