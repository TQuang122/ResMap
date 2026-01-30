import React, { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';
import { GuidanceItem, ThemeColors } from '../../../types';

interface GuidanceSectionProps {
  items: GuidanceItem[];
  theme: ThemeColors;
}

const GuidanceSection: React.FC<GuidanceSectionProps> = ({ items, theme }) => {
  const [expandedId, setExpandedId] = useState<string | null>(items[0]?.id || null);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-black mb-6">Hướng dẫn cụ thể</h3>
      
      {items.map((item) => {
        const isExpanded = expandedId === item.id;
        
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
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Feeling Stuck Helper */}
      <div className="mt-6 p-4 bg-white/10 rounded-xl border border-white/20">
        <p className="text-sm opacity-70 text-center">
          Feeling stuck? <span className="font-semibold">Watch how others have done it before</span>
        </p>
      </div>
    </div>
  );
};

export default GuidanceSection;
