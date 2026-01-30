import React, { useState } from 'react';
import { ClipboardList } from 'lucide-react';
import { StepFullData } from '../types';
import DeliverableSidebar from './steps/common/DeliverableSidebar';
import GuidanceSection from './steps/common/GuidanceSection';
import SupportPanel from './steps/common/SupportPanel';

interface StepLayoutProps {
  stepData: StepFullData;
  onResExploreOpen?: () => void;
  onResearchSuggestionOpen?: () => void;
}

const StepLayout: React.FC<StepLayoutProps> = ({ stepData, onResExploreOpen, onResearchSuggestionOpen }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { stepNumber, title, description, theme, deliverables, guidance, support } = stepData;

  return (
    <section className={`
      w-full min-h-screen shrink-0 
      flex flex-col relative ${theme.bg} ${theme.text} 
      pt-24 md:pt-28 lg:pt-32 pb-16 md:pb-20 transition-all
    `}>
      {/* Header Section */}
      <div className="max-w-[1600px] mx-auto w-full px-4 md:px-6 lg:px-10 mb-8 lg:mb-12">
        <div className="max-w-3xl">
          <span className="text-xs md:text-sm font-black uppercase tracking-[0.2em] opacity-60 mb-3 md:mb-4 block">
            Bước {stepNumber}
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black mb-4 md:mb-6 leading-[1.1]">
            {title}
          </h2>
          <div className={`w-14 md:w-20 lg:w-24 h-1.5 md:h-2 mb-4 md:mb-6 ${theme.accent} opacity-80 rounded-full`}></div>
          <p className="text-sm md:text-base lg:text-lg leading-relaxed opacity-80 font-medium">
            {description}
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-[1600px] mx-auto w-full flex-1 px-4 md:px-6 lg:px-10">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* Left Sidebar - Deliverables (Desktop) */}
          <div className="hidden lg:block lg:col-span-4 xl:col-span-3">
            <div className={`sticky top-28 ${theme.glass} backdrop-blur-xl border border-white/40 p-6 rounded-2xl shadow-xl max-h-[calc(100vh-8rem)] overflow-y-auto`}>
              <DeliverableSidebar
                stepId={stepData.id}
                deliverables={deliverables}
                theme={theme}
              />
            </div>
          </div>

          {/* Right Content - Guidance + Support */}
          <div className="w-full lg:col-span-8 xl:col-span-9 space-y-6 lg:space-y-8">
            {/* Guidance Section */}
            <div className={`${theme.glass} backdrop-blur-xl border border-white/40 p-6 md:p-8 lg:p-10 rounded-2xl md:rounded-3xl shadow-xl`}>
              <GuidanceSection items={guidance} theme={theme} stepNumber={stepNumber} onResExploreOpen={onResExploreOpen} onResearchSuggestionOpen={onResearchSuggestionOpen} />
            </div>

            {/* Support Panel */}
            <div>
              <SupportPanel data={support} theme={theme} stepTitle={title} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile FAB - Open Checklist */}
      <button
        onClick={() => setIsMobileSidebarOpen(true)}
        className={`lg:hidden fixed bottom-6 right-6 z-30 ${theme.accent} text-white p-4 rounded-full shadow-2xl flex items-center gap-2 hover:scale-105 transition-transform`}
        aria-label="Xem Checklist & Ghi chú"
      >
        <ClipboardList size={24} />
        <span className="font-bold text-sm hidden sm:inline">Checklist</span>
      </button>

      {/* Mobile Sidebar Drawer */}
      <DeliverableSidebar
        stepId={stepData.id}
        deliverables={deliverables}
        theme={theme}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
        mobileOnly={true}
      />
    </section>
  );
};

export default StepLayout;