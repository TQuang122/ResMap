import React, { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle, Search, Sparkles, Brain, AlertTriangle, CheckCircle2, XCircle, Layers, BookOpen, Award, Globe, TrendingUp, Target, Clock, CheckSquare, BarChart3 } from 'lucide-react';
import { GuidanceItem, ThemeColors } from '../../../types';

interface SubStepsDisplayProps {
  subSteps: string[];
  theme: ThemeColors;
}

const PitfallDisplay: React.FC<{ subSteps: string[]; theme: ThemeColors }> = ({ subSteps, theme }) => {
  const isPitfalls = subSteps.length > 0 && subSteps.some(s => (s.includes('Dấu hiệu') || s.includes('Nhận biết')) && s.includes('Xử lý:'));

  if (!isPitfalls) return null;

  const pitfalls = subSteps.map(s => {
    const match = s.match(/^(.*?):\s*(?:Dấu hiệu|Nhận biết)(?:[:\s]|là)?\s*(.*?)\s*Xử lý:\s*(.*)$/i);
    if (match) {
      return {
        title: match[1].trim(),
        signs: match[2].trim(),
        solution: match[3].trim()
      };
    }
    return null;
  }).filter((p): p is { title: string; signs: string; solution: string } => p !== null);

  return (
    <div className="mt-4 relative">
      <div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-gradient-to-b from-red-300 via-orange-300 to-green-300 rounded-full" />

      <div className="space-y-5">
        {pitfalls.map((pitfall, idx) => (
          <div key={idx} className="relative pl-8">
            <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-md z-10">
              <AlertTriangle size={12} className="text-white" />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-4 py-2.5 bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-100/50">
                <h5 className="font-bold text-red-800 text-sm md:text-base">
                  {pitfall.title}
                </h5>
              </div>

              <div className="flex flex-col md:flex-row">
                <div className="flex-1 p-3 md:p-4 bg-gray-50/50 relative">
                  <div className="flex items-start gap-2">
                    <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      Nhận biết
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed mt-2">
                    {pitfall.signs}
                  </p>
                  <div className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 w-6 h-6 rounded-full bg-white shadow border border-gray-200 items-center justify-center">
                    <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                <div className="md:hidden flex items-center justify-center py-1 bg-gray-100">
                  <svg className="w-4 h-4 text-green-600 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>

                <div className="flex-1 p-3 md:p-4 bg-green-50/50 md:border-l border-green-100">
                  <div className="flex items-start gap-2">
                    <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wider">
                      <CheckCircle2 size={10} className="text-green-600" />
                      Xử lý
                    </span>
                  </div>
                  <p className="text-sm text-green-800 leading-relaxed mt-2 font-medium">
                    {pitfall.solution}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// CriteriaGridDisplay - For "Tiêu chí đánh giá" with 4 cards grid (Step 3.3)
const CriteriaGridDisplay: React.FC<{ subSteps: string[]; theme: ThemeColors }> = ({ subSteps }) => {
  const isCriteriaGrid = subSteps.length > 0 && subSteps.some(s => /^[1-5]️⃣/.test(s));

  if (!isCriteriaGrid) return null;

  const criteriaItems = subSteps
    .filter(s => /^[1-5]️⃣/.test(s))
    .map(s => {
      const match = s.match(/^[1-5]️⃣\s*(.*?):\s*(.*)$/);
      if (match) {
        return { number: match[1].trim(), title: match[1].trim(), content: match[2].trim() };
      }
      return null;
    })
    .filter((p): p is { number: string; title: string; content: string } => p !== null);

  const colors = [
    { bg: 'bg-blue-50', border: 'border-blue-200', header: 'bg-gradient-to-r from-blue-500 to-blue-600', text: 'text-blue-900', icon: 'bg-blue-100 text-blue-600' },
    { bg: 'bg-purple-50', border: 'border-purple-200', header: 'bg-gradient-to-r from-purple-500 to-purple-600', text: 'text-purple-900', icon: 'bg-purple-100 text-purple-600' },
    { bg: 'bg-orange-50', border: 'border-orange-200', header: 'bg-gradient-to-r from-orange-400 to-orange-500', text: 'text-orange-900', icon: 'bg-orange-100 text-orange-600' },
    { bg: 'bg-green-50', border: 'border-green-200', header: 'bg-gradient-to-r from-green-500 to-emerald-500', text: 'text-green-900', icon: 'bg-green-100 text-green-600' },
    { bg: 'bg-cyan-50', border: 'border-cyan-200', header: 'bg-gradient-to-r from-cyan-500 to-teal-500', text: 'text-cyan-900', icon: 'bg-cyan-100 text-cyan-600' }
  ];

  return (
    <div className="mt-4 space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {criteriaItems.map((item, idx) => (
          <div key={idx} className={`rounded-lg shadow-sm overflow-hidden bg-white`}>
            <div className={`px-3 py-2 ${colors[idx % colors.length].header} flex items-center gap-2`}>
              <span className={`w-6 h-6 rounded-full ${colors[idx % colors.length].icon} flex items-center justify-center font-bold text-xs`}>
                {idx + 1}
              </span>
              <span className="font-bold text-white text-sm">
                {item.title}
              </span>
            </div>
            <div className={`p-3 border-x border-b ${colors[idx % colors.length].border} ${colors[idx % colors.length].bg}`}>
              <p className={`text-sm ${colors[idx % colors.length].text} leading-relaxed`}>
                {item.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// VerticalTimelineStepsDisplay - For "Cách làm từng bước" with vertical timeline (Step 3.4)
const VerticalTimelineStepsDisplay: React.FC<{ subSteps: string[]; theme: ThemeColors }> = ({ subSteps }) => {
  const [activeStep, setActiveStep] = useState(0);

  const isTimelineSteps = subSteps.length > 0 && subSteps.some(s => /^Bước \d+/.test(s));

  if (!isTimelineSteps) return null;

  const steps = subSteps
    .filter(s => /^Bước \d+/.test(s))
    .map(s => {
      const match = s.match(/^Bước (\d+) – (.*?):\s*(.*)$/);
      if (match) {
        return { step: parseInt(match[1]), title: match[2], content: match[3] };
      }
      return null;
    })
    .filter((p): p is { step: number; title: string; content: string } => p !== null);

  const stepColors = [
    { bg: 'bg-blue-500', text: 'text-blue-600', light: 'bg-blue-50' },
    { bg: 'bg-purple-500', text: 'text-purple-600', light: 'bg-purple-50' },
    { bg: 'bg-orange-500', text: 'text-orange-600', light: 'bg-orange-50' },
    { bg: 'bg-green-500', text: 'text-green-600', light: 'bg-green-50' }
  ];

  const renderStepContent = (content: string) => {
    if (!content) return null;

    const parts = content.split('•').filter(p => p.trim());

    if (parts.length <= 1) {
      return <p className="text-gray-700 leading-relaxed">{content}</p>;
    }

    return (
      <>
        {parts[0] && <p className="text-gray-700 leading-relaxed mb-3">{parts[0].trim()}</p>}
        <ul className="space-y-2">
          {parts.slice(1).map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-gray-700">
              <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-current mt-2" />
              <span>{item.trim()}</span>
            </li>
          ))}
        </ul>
      </>
    );
  };

  return (
    <div className="mt-4">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <div className="flex flex-col gap-3">
            {steps.map((step, idx) => (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`
                  relative p-4 rounded-xl border-2 text-left transition-all duration-300
                  ${activeStep === idx
                    ? `${stepColors[idx % stepColors.length].border} border-current bg-white shadow-md`
                    : 'border-gray-100 bg-gray-50 hover:bg-white hover:shadow-sm'}
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-md
                    ${activeStep === idx ? stepColors[idx % stepColors.length].bg : 'bg-gray-400'}
                  `}>
                    {step.step}
                  </div>
                  <div>
                    <span className={`text-xs font-semibold uppercase tracking-wider ${activeStep === idx ? stepColors[idx % stepColors.length].text : 'text-gray-500'}`}>
                      Bước {step.step}
                    </span>
                    <h5 className={`font-bold text-sm ${activeStep === idx ? 'text-gray-900' : 'text-gray-700'}`}>
                      {step.title}
                    </h5>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="md:w-2/3">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stepColors[activeStep % stepColors.length].bg}`}>
                <span className="text-white font-bold text-lg">{steps[activeStep]?.step}</span>
              </div>
              <div>
                <span className={`text-xs font-semibold uppercase tracking-wider ${stepColors[activeStep % stepColors.length].text}`}>
                  Bước {steps[activeStep]?.step}
                </span>
                <h5 className="font-bold text-xl text-gray-900">
                  {steps[activeStep]?.title}
                </h5>
              </div>
            </div>
            <div className={`p-4 rounded-xl ${stepColors[activeStep % stepColors.length].light}`}>
              {renderStepContent(steps[activeStep]?.content)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// TwoColumnOutputDisplay - For "Đầu ra cụ thể" with two columns (Step 2.2)
const TwoColumnOutputDisplay: React.FC<{ subSteps: string[]; theme: ThemeColors }> = ({ subSteps }) => {
  const isOutput = subSteps.length > 0 && subSteps.some(s => s.startsWith('OUTPUT|'));

  if (!isOutput) return null;

  const columns = subSteps
    .filter(s => s.startsWith('OUTPUT|'))
    .map(s => {
      const parts = s.split('|');
      const title = parts[1];
      const items = parts.slice(2);
      return { title, items };
    });

  if (columns.length === 0) return null;

  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Column 1 - Blue */}
      <div className="bg-white rounded-xl shadow-sm border border-blue-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3">
          <h5 className="font-bold text-white flex items-center gap-2">
            <span className="text-lg">📋</span>
            {columns[0]?.title}
          </h5>
        </div>
        <ul className="p-4 space-y-3">
          {columns[0]?.items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3 text-sm">
              <div className="shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                <span className="text-blue-600 text-xs font-bold">•</span>
              </div>
              <span className="text-gray-700 leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Column 2 - Purple */}
      <div className="bg-white rounded-xl shadow-sm border border-purple-200 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-4 py-3">
          <h5 className="font-bold text-white flex items-center gap-2">
            <span className="text-lg">📝</span>
            {columns[1]?.title}
          </h5>
        </div>
        <ul className="p-4 space-y-3">
          {columns[1]?.items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3 text-sm">
              <div className="shrink-0 w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center mt-0.5">
                <span className="text-purple-600 text-xs font-bold">•</span>
              </div>
              <span className="text-gray-700 leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// CriteriaComparisonDisplay - For "Giữ/Loại" criteria display (Step 2.3)
const CriteriaComparisonDisplay: React.FC<{ subSteps: string[]; theme: ThemeColors }> = ({ subSteps }) => {
  // Check if this is the "Criteria" type (Contains "Giữ:" or "Loại:")
  const isCriteria = subSteps.length > 0 && subSteps.some(s => s.startsWith('Giữ:') || s.startsWith('Loại:'));

  if (!isCriteria) return null;

  // Parse criteria into keep and remove lists
  const keepItems = subSteps.filter(s => s.startsWith('Giữ:')).map(s => s.replace('Giữ:', '').trim());
  const removeItems = subSteps.filter(s => s.startsWith('Loại:')).map(s => s.replace('Loại:', '').trim());

  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Keep Column */}
      <div className="bg-white rounded-xl shadow-sm border border-green-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-3">
          <h5 className="font-bold text-white flex items-center gap-2">
            <CheckCircle2 size={18} />
            Giữ nếu bài
          </h5>
        </div>
        <ul className="p-4 space-y-3">
          {keepItems.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3 text-sm">
              <div className="shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                <CheckCircle2 size={12} className="text-green-600" />
              </div>
              <span className="text-gray-700 leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Remove Column */}
      <div className="bg-white rounded-xl shadow-sm border border-red-200 overflow-hidden">
        <div className="bg-gradient-to-r from-red-500 to-rose-500 px-4 py-3">
          <h5 className="font-bold text-white flex items-center gap-2">
            <XCircle size={18} />
            Loại nếu bài
          </h5>
        </div>
        <ul className="p-4 space-y-3">
          {removeItems.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3 text-sm">
              <div className="shrink-0 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                <XCircle size={12} className="text-red-600" />
              </div>
              <span className="text-gray-700 leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// NestedTabsDisplay - For two-layer strategy display (Step 2.4)
const NestedTabsDisplay: React.FC<{ subSteps: string[]; theme: ThemeColors }> = ({ subSteps, theme }) => {
  const [activeMainTab, setActiveMainTab] = useState(0);
  const [activeSubTab, setActiveSubTab] = useState(0);

  // Check if this is the "Nested Tabs" type (Contains "|" separator with A| or B| prefix)
  const isNestedTabs = subSteps.length > 0 && subSteps.some(s => /^[A-Z]\|/.test(s));

  if (!isNestedTabs) return null;

  // Parse nested structure: "A|Main Title|SubTab: Content" or "A|Main Title|Pass 1 (5–10 phút) – Title: Content"
  const parsed = subSteps.map(s => {
    const parts = s.split('|');
    if (parts.length >= 3) {
      const mainKey = parts[0].trim();
      const mainTitle = parts[1].trim();
      const subContent = parts.slice(2).join('|').trim();
      
      // Find the first colon that separates the header from content
      const colonIndex = subContent.indexOf(':');
      if (colonIndex === -1) {
        return { mainKey, mainTitle, subLabel: subContent, subTitle: '', content: '' };
      }
      
      const headerPart = subContent.substring(0, colonIndex).trim();
      const contentPart = subContent.substring(colonIndex + 1).trim();
      
      // Extract button label and subtitle from header
      // Pattern: "Pass 1 (5–10 phút) – Bird's-eye view" or "A1 – Title"
      let subLabel = headerPart;
      let subTitle = '';
      
      // Check for "Pass X" pattern
      const passMatch = headerPart.match(/^(Pass \d+)\s*(.*)$/);
      if (passMatch) {
        subLabel = passMatch[1]; // "Pass 1"
        const rest = passMatch[2].trim(); // "(5–10 phút) – Bird's-eye view"
        // Remove leading dash if present
        subTitle = rest.replace(/^–\s*/, '').trim();
        // If subTitle starts with "(", include the time info
        if (rest.startsWith('(')) {
          subTitle = rest;
        }
      } else {
        // Check for "AX" pattern (A1, A2, A3)
        const axMatch = headerPart.match(/^([A-Z]\d+)\s*(?:–\s*)?(.*)$/);
        if (axMatch) {
          subLabel = axMatch[1]; // "A1"
          subTitle = axMatch[2].trim(); // "Title"
        }
      }
      
      return {
        mainKey,
        mainTitle,
        subLabel,
        subTitle,
        content: contentPart
      };
    }
    return null;
  }).filter((p): p is { mainKey: string; mainTitle: string; subLabel: string; subTitle: string; content: string } => p !== null);

  // Group by main key
  const groups = parsed.reduce((acc, item) => {
    if (!acc[item.mainKey]) {
      acc[item.mainKey] = { title: item.mainTitle, items: [] };
    }
    acc[item.mainKey].items.push(item);
    return acc;
  }, {} as Record<string, { title: string; items: typeof parsed }>);

  const mainTabs = Object.entries(groups);
  const currentGroup = mainTabs[activeMainTab]?.[1];

  // Reset sub tab when main tab changes
  const handleMainTabChange = (idx: number) => {
    setActiveMainTab(idx);
    setActiveSubTab(0);
  };

  // Helper function to format content with better readability
  const formatPassContent = (content: string) => {
    if (!content) return null;
    
    // First, add line breaks before key patterns
    let formattedContent = content
      // Add break before numbered items
      .replace(/\s*\((\d+)\)\s*/g, '\n($1) ')
      // Add break before key phrases
      .replace(/\.\s*(CHÚ Ý[^:]*:)/gi, '.\n\n$1')
      .replace(/\.\s*(Sau [Pp]ass)/g, '.\n\n$1')
      .replace(/\.\s*(→)/g, '.\n\n$1')
      // Add break before bullet points
      .replace(/\n\s*•\s*/g, '\n\n• ');
    
    // Split by newlines and render
    const lines = formattedContent.split('\n').filter(line => line.trim());
    
    return (
      <div className="space-y-3">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          
          // Check for bullet points
          if (trimmed.startsWith('•')) {
            return (
              <div key={idx} className="flex items-start gap-2">
                <span className="shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mt-0.5">
                  <span className="text-blue-600 text-xs font-bold">•</span>
                </span>
                <span className="text-gray-700 text-sm md:text-base leading-relaxed">{trimmed.substring(1).trim()}</span>
              </div>
            );
          }
          
          // Check for numbered items (1), (2), etc.
          const numberedMatch = trimmed.match(/^\((\d+)\)\s*(.*)$/);
          if (numberedMatch) {
            return (
              <div key={idx} className="flex items-start gap-3 pl-2">
                <span className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold mt-0.5">
                  {numberedMatch[1]}
                </span>
                <span className="text-gray-700 text-sm md:text-base leading-relaxed">{numberedMatch[2]}</span>
              </div>
            );
          }
          
          // Check for warning boxes (⚠️)
          if (trimmed.startsWith('⚠️') || trimmed.includes('⚠️')) {
            return (
              <div key={idx} className="flex items-start gap-2 mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200">
                <span className="shrink-0 text-amber-600 text-lg">⚠️</span>
                <span className="text-amber-800 text-sm md:text-base">{trimmed.replace('⚠️', '').trim()}</span>
              </div>
            );
          }
          
          // Check for arrow conclusions
          if (trimmed.startsWith('→')) {
            return (
              <div key={idx} className="flex items-start gap-2 mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200">
                <span className="shrink-0 text-amber-600 font-bold text-lg">→</span>
                <span className="text-amber-800 font-medium text-sm md:text-base">{trimmed.substring(1).trim()}</span>
              </div>
            );
          }
          
          // Check for key sections like "CHÚ Ý ĐẶC BIỆT:"
          if (trimmed.match(/^CHÚ Ý/i)) {
            return (
              <div key={idx} className="mt-4 p-3 rounded-lg bg-orange-50 border border-orange-200">
                <span className="text-orange-800 font-semibold text-sm md:text-base">{trimmed}</span>
              </div>
            );
          }
          
          // Check for "Sau pass" summaries
          if (trimmed.match(/^Sau [Pp]ass/i)) {
            return (
              <div key={idx} className="mt-4 p-3 rounded-lg bg-green-50 border border-green-200">
                <span className="text-green-800 font-medium text-sm md:text-base">{trimmed}</span>
              </div>
            );
          }
          
          // Default: regular paragraph
          return (
            <p key={idx} className="text-gray-700 text-sm md:text-base leading-relaxed">
              {trimmed}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="mt-4">
      {/* Main Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {mainTabs.map(([key, group], idx) => (
          <button
            key={key}
            onClick={(e) => {
              e.stopPropagation();
              handleMainTabChange(idx);
            }}
            className={`
              px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 border flex items-center gap-2
              ${activeMainTab === idx
                ? 'bg-white text-gray-900 border-white shadow-lg scale-105'
                : 'bg-gray-100 text-gray-700 border-white/40 hover:bg-white opacity-90'}
            `}
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
              activeMainTab === idx ? theme.accent + ' text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {key}
            </span>
            {group.title}
          </button>
        ))}
      </div>

      {/* Content Area */}
      {currentGroup && (
        <div className="bg-white rounded-2xl border border-white/20 shadow-xl overflow-hidden">
          {/* Sub Tabs */}
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex flex-wrap gap-2">
            {currentGroup.items.map((item, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSubTab(idx);
                }}
                className={`
                  px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200
                  ${activeSubTab === idx
                    ? `${theme.accent} text-white shadow-md`
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}
                `}
              >
                {item.subLabel}
              </button>
            ))}
          </div>

          {/* Sub Content */}
          <div className="p-5 md:p-6">
            {currentGroup.items[activeSubTab]?.subTitle && (
              <h5 className="font-bold text-lg md:text-xl mb-4 text-gray-900">
                {currentGroup.items[activeSubTab].subTitle}
              </h5>
            )}
            {formatPassContent(currentGroup.items[activeSubTab]?.content || '')}
          </div>
        </div>
      )}
    </div>
  );
};

// RankingDisplay - For "Nguồn tìm papers uy tín" and rankings display (Step 2.4)
const RankingDisplay: React.FC<{ subSteps: string[]; theme: ThemeColors }> = ({ subSteps, theme }) => {
  const [activeTab, setActiveTab] = useState(0);

  // Check if this is the "Ranking" type (Contains "N|" separator)
  const isRanking = subSteps.length > 0 && subSteps.some(s => /^[N]\|/.test(s));

  if (!isRanking) return null;

  // Parse ranking structure: "N|Title|Content"
  const items = subSteps
    .filter(s => s.startsWith('N|'))
    .map(s => {
      const parts = s.split('|');
      if (parts.length >= 3) {
        const title = parts[1].trim();
        const content = parts.slice(2).join('|').trim();
        return { title, content };
      }
      return null;
    })
    .filter((p): p is { title: string; content: string } => p !== null);

  const currentItem = items[activeTab];

  // Helper function to parse and render ranking content
  const renderRankingContent = (content: string) => {
    if (!content) return null;

    // Split into sections based on headers
    const sections = content.split('\n\n').filter(s => s.trim());

    return (
      <div className="space-y-6">
        {sections.map((section, idx) => {
          // Check for Sources section (starts with •)
          if (section.trim().startsWith('•')) {
            return (
              <div key={idx} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {section.split('\n').filter(s => s.trim().startsWith('•')).map((item, i) => {
                    const cleanItem = item.replace('•', '').trim();
                    const [name, ...descParts] = cleanItem.split(':');
                    const desc = descParts.join(':').trim();
                    return (
                      <div key={i} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                        <span className="font-semibold text-gray-900">{name}</span>
                        {desc && <p className="text-sm text-gray-600 mt-1">{desc}</p>}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          }

          // Check for Conference Rankings (A*, A, B, C)
          if (section.includes('A*') || section.match(/[A-C]\*/)) {
            const lines = section.split('\n').filter(l => l.trim());
            
            return (
              <div className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {lines.map((item, i) => {
                    const rankMatch = item.match(/^([A-C\*]+)[:\s]*(.*)$/);
                    if (rankMatch) {
                      const rank = rankMatch[1];
                      const desc = rankMatch[2];
                      let rankColor = 'bg-gray-100 text-gray-700 border-gray-200';
                      if (rank === 'A*') rankColor = 'bg-gradient-to-r from-purple-500 to-purple-600 text-white';
                      else if (rank === 'A') rankColor = 'bg-gradient-to-r from-green-500 to-green-600 text-white';
                      else if (rank === 'B') rankColor = 'bg-gradient-to-r from-blue-500 to-blue-600 text-white';
                      else if (rank === 'C') rankColor = 'bg-gradient-to-r from-orange-400 to-orange-500 text-white';

                      return (
                        <div key={i} className="rounded-lg p-3 border border-gray-100">
                          <div className={`inline-flex px-2 py-1 rounded text-xs font-bold mb-2 ${rankColor}`}>
                            {rank}
                          </div>
                          <p className="text-xs text-gray-600">{desc}</p>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            );
          }

          // Check for Journal Rankings (Q1, Q2, Q3, Q4)
          if (section.includes('Q1') || section.includes('Quartile')) {
            const lines = section.split('\n').filter(l => l.trim());
            
            return (
              <div className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {lines.map((item, i) => {
                    const qMatch = item.match(/^(Q[1-4])[:\s]*(.*)$/);
                    if (qMatch) {
                      const rank = qMatch[1];
                      const desc = qMatch[2];
                      let rankColor = 'bg-gray-100 text-gray-700 border-gray-200';
                      if (rank === 'Q1') rankColor = 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white';
                      else if (rank === 'Q2') rankColor = 'bg-gradient-to-r from-teal-500 to-teal-600 text-white';
                      else if (rank === 'Q3') rankColor = 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white';
                      else if (rank === 'Q4') rankColor = 'bg-gradient-to-r from-orange-400 to-orange-500 text-white';

                      return (
                        <div key={i} className="rounded-lg p-3 border border-gray-100">
                          <div className={`inline-flex px-2 py-1 rounded text-xs font-bold mb-2 ${rankColor}`}>
                            {rank}
                          </div>
                          <p className="text-xs text-gray-600">{desc}</p>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            );
          }

          // Check for Conference vs Journal explanation
          if (section.toLowerCase().includes('conference') && section.toLowerCase().includes('journal')) {
            return (
              <div key={idx} className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-800 leading-relaxed">{section}</p>
              </div>
            );
          }

          // Default: regular content
          return (
            <p key={idx} className="text-sm text-gray-700 leading-relaxed">
              {section}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="mt-4">
      {/* Tab Buttons Row */}
      <div className="flex flex-wrap gap-2 mb-4">
        {items.map((item, idx) => (
          <button
            key={idx}
            onClick={(e) => {
              e.stopPropagation();
              setActiveTab(idx);
            }}
            className={`
              px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200
              ${activeTab === idx
                ? `${theme.accent} text-white shadow-md`
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'}
            `}
          >
            {item.title}
          </button>
        ))}
      </div>

      {/* Content Below */}
      {currentItem && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          {renderRankingContent(currentItem.content)}
        </div>
      )}
    </div>
  );
};

// InteractiveChecklistDisplay - For interactive checkboxes with strikethrough (Step 4.6)
const InteractiveChecklistDisplay: React.FC<{ subSteps: string[]; theme: ThemeColors }> = ({ subSteps }) => {
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());

  const isChecklist = subSteps.length > 0 && subSteps.some(s => s.startsWith('CHECK|'));

  if (!isChecklist) return null;

  const items = subSteps
    .filter(s => s.startsWith('CHECK|'))
    .map(s => s.replace('CHECK|', '').trim());

  const toggleItem = (idx: number) => {
    setCheckedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(idx)) {
        newSet.delete(idx);
      } else {
        newSet.add(idx);
      }
      return newSet;
    });
  };

  const completedCount = checkedItems.size;
  const totalCount = items.length;
  const allCompleted = completedCount === totalCount;

  return (
    <div className="mt-4 space-y-3">
      {/* Progress indicator */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500 ease-out"
            style={{ width: `${(completedCount / totalCount) * 100}%` }}
          />
        </div>
        <span className={`text-sm font-semibold ${allCompleted ? 'text-green-600' : 'text-gray-500'}`}>
          {completedCount}/{totalCount}
        </span>
      </div>

      {/* Checklist items */}
      <div className="space-y-2">
        {items.map((item, idx) => {
          const isChecked = checkedItems.has(idx);
          return (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                toggleItem(idx);
              }}
              className={`
                w-full flex items-start gap-3 p-3 rounded-lg border-2 text-left transition-all duration-300
                ${isChecked 
                  ? 'bg-green-50 border-green-300 shadow-sm' 
                  : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'}
              `}
            >
              {/* Checkbox */}
              <div className={`
                shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-300
                ${isChecked 
                  ? 'bg-green-500 border-green-500' 
                  : 'bg-white border-gray-300'}
              `}>
                {isChecked && (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              
              {/* Text */}
              <span className={`
                flex-1 text-sm leading-relaxed transition-all duration-300
                ${isChecked 
                  ? 'text-gray-500 line-through decoration-2 decoration-green-500' 
                  : 'text-gray-700'}
              `}>
                {item}
              </span>
            </button>
          );
        })}
      </div>

      {/* Completion message */}
      {allCompleted && (
        <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 flex items-center gap-3">
          <div className="shrink-0 w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
            <CheckCircle2 size={20} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-green-800">Bước này đã hoàn thành!</p>
            <p className="text-sm text-green-600">Bạn đã kiểm tra tất cả các tiêu chí. Sẵn sàng chuyển sang bước tiếp theo.</p>
          </div>
        </div>
      )}
    </div>
  );
};

const SubStepsDisplay: React.FC<SubStepsDisplayProps> = ({ subSteps, theme }) => {
  const [activeTab, setActiveTab] = useState(0);

  // Check if this is the "Process Steps" type (Starts with "Bước A", "Bước B"...)
  const isProcessSteps = subSteps.length > 0 && subSteps[0].startsWith('Bước A');
  
  // Check if this is the "Pitfalls" type (Contains "Dấu hiệu" or "Nhận biết" AND "Xử lý:")
  const isPitfalls = subSteps.length > 0 && subSteps.some(s => (s.includes('Dấu hiệu') || s.includes('Nhận biết')) && s.includes('Xử lý:'));

  // Check if this is the "Criteria Comparison" type (Giữ:/Loại:)
  const isCriteria = subSteps.length > 0 && subSteps.some(s => s.startsWith('Giữ:') || s.startsWith('Loại:'));

  // Check if this is the "Nested Tabs" type (A|...|...) - MUST be after isRanking
  const isNestedTabs = subSteps.length > 0 && subSteps.some(s => /^[A-Z]\|/.test(s) && !s.startsWith('N|'));

  // Check if this is the "Ranking" type (N|...|...) - MUST be before isNestedTabs
  const isRanking = subSteps.length > 0 && subSteps.some(s => /^[N]\|/.test(s));

  // Check if this is the "Two Column Output" type (OUTPUT|...)
  const isOutput = subSteps.length > 0 && subSteps.some(s => s.startsWith('OUTPUT|'));

  // Check if this is the "Criteria Grid" type (1️⃣, 2️⃣, 3️⃣, 4️⃣, 5️⃣)
  const isCriteriaGrid = subSteps.length > 0 && subSteps.some(s => /^[1-5]️⃣/.test(s));

  // Check if this is the "Vertical Timeline Steps" type (Bước 1, Bước 2, ...)
  const isTimelineSteps = subSteps.length > 0 && subSteps.some(s => /^Bước \d+/.test(s));

  // Check if this is the "Interactive Checklist" type (CHECK|...)
  const isChecklist = subSteps.length > 0 && subSteps.some(s => s.startsWith('CHECK|'));

  if (isChecklist) {
    return <InteractiveChecklistDisplay subSteps={subSteps} theme={theme} />;
  }

  if (isCriteriaGrid) {
    return <CriteriaGridDisplay subSteps={subSteps} theme={theme} />;
  }

  if (isTimelineSteps) {
    return <VerticalTimelineStepsDisplay subSteps={subSteps} theme={theme} />;
  }

  if (isPitfalls) {
    return <PitfallDisplay subSteps={subSteps} theme={theme} />;
  }

  if (isCriteria) {
    return <CriteriaComparisonDisplay subSteps={subSteps} theme={theme} />;
  }

  if (isOutput) {
    return <TwoColumnOutputDisplay subSteps={subSteps} theme={theme} />;
  }

  // Check Ranking BEFORE NestedTabs because N| matches [A-Z]|
  if (isRanking) {
    return <RankingDisplay subSteps={subSteps} theme={theme} />;
  }

  if (isNestedTabs) {
    return <NestedTabsDisplay subSteps={subSteps} theme={theme} />;
  }

  if (!isProcessSteps) {
    return (
      <div className="bg-white/20 rounded-xl p-4 space-y-2">
        <ul className="space-y-2">
          {subSteps.map((subStep, idx) => (
            <li key={idx} className="flex items-start gap-3 text-sm">
              <CheckCircle size={16} className="shrink-0 mt-0.5 opacity-60" />
              <span className="opacity-90">{subStep}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // Parse steps for Tab View
  // Format: "Bước A – Title: Content" or "Bước A – Title – Content"
  const steps = subSteps.map(s => {
    const match = s.match(/^(Bước [A-Z]) – (.*?): (.*)$/);
    if (match) {
      return { label: match[1], title: match[2], content: match[3] };
    }
    // Fallback for "Title – Content" or other formats
    const colonParts = s.split(': ');
    const dashParts = s.split(' – ');
    if (dashParts.length >= 2) {
      return {
        label: dashParts[0],
        title: dashParts[1].includes(':') ? dashParts[1].split(':')[0] : dashParts[1],
        content: s.substring(dashParts[0].length + 3)
      };
    }
    return { label: s, title: '', content: s };
  });

  return (
    <div className="mt-6">
      {/* Tabs Header */}
      <div className="flex flex-wrap gap-2 mb-4">
        {steps.map((step, idx) => (
          <button
            key={idx}
            onClick={(e) => {
              e.stopPropagation(); // Prevent accordion collapse
              setActiveTab(idx);
            }}
            className={`
              px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 border
              ${activeTab === idx
                ? 'bg-white text-gray-900 border-white shadow-lg scale-105'
                : 'bg-gray-100 text-gray-900 border-white/40 hover:bg-white opacity-90'}
            `}
          >
            {step.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-2xl p-5 md:p-6 border border-white/20 shadow-xl">
        <h5 className="font-bold text-lg md:text-xl mb-3 text-gray-900">
          {steps[activeTab].title}
        </h5>
        <p className="leading-relaxed text-gray-700 text-sm md:text-base">
          {steps[activeTab].content}
        </p>
      </div>
    </div>
  );
};

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
                  
                  {/* Sub-steps Display (List or Tabs) */}
                  {item.subSteps && item.subSteps.length > 0 && (
                    <SubStepsDisplay subSteps={item.subSteps} theme={theme} />
                  )}

                  {/* Action Buttons Row */}
                  {(hasResExplore || hasResearchSuggestion || hasAiUsage) && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      {/* ResExplore Button */}
                      {hasResExplore && item.resExploreBox && (
                        <div className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl p-4 border border-blue-400/30 h-full flex flex-col">
                          <div className="flex items-start gap-3 h-full">
                            <div className="shrink-0 w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                              <Search className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 flex flex-col h-full">
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
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors w-full justify-center mt-auto"
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
                        <div className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-xl p-4 border border-orange-400/30 h-full flex flex-col">
                          <div className="flex items-start gap-3 h-full">
                            <div className="shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                              <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 flex flex-col h-full">
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
                                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F36F21] to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-medium rounded-lg transition-colors w-full justify-center mt-auto"
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
                        <div className="bg-gradient-to-r from-purple-500/20 to-violet-500/20 rounded-xl p-4 border border-purple-400/30 h-full flex flex-col">
                          <div className="flex items-start gap-3 h-full">
                            <div className="shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                              <Brain className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 flex flex-col h-full">
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
                                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white text-sm font-medium rounded-lg transition-colors w-full justify-center mt-auto"
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
