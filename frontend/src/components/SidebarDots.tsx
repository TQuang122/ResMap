import React, { useEffect, useRef, useState } from 'react';
import { THEMES } from '../constants';
import { ArrowDown } from 'lucide-react';

interface SidebarDotsProps {
  activeIndex: number;
  totalSections: number;
  scrollToSection: (index: number) => void;
  sectionLabels?: string[];
  isTopicSelected?: boolean;
}

const SidebarDots: React.FC<SidebarDotsProps> = ({
  activeIndex,
  totalSections,
  scrollToSection,
  sectionLabels,
  isTopicSelected = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const hideTimeoutRef = useRef<number | null>(null);
  const [visibleIndex, setVisibleIndex] = useState<number | null>(null);
  const labels = sectionLabels && sectionLabels.length === totalSections
    ? sectionLabels
    : Array.from({ length: totalSections }).map((_, i) => `Section ${i + 1}`);

  const progressPct = totalSections <= 1 ? 0 : (activeIndex / (totalSections - 1)) * 100;
  const progressScale = Math.max(0, Math.min(1, progressPct / 100));

  const scheduleHide = () => {
    if (hideTimeoutRef.current) {
      window.clearTimeout(hideTimeoutRef.current);
    }
    hideTimeoutRef.current = window.setTimeout(() => {
      setVisibleIndex(null);
      hideTimeoutRef.current = null;
    }, 1000);
  };

  useEffect(() => {
    scheduleHide();
  }, [activeIndex]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        scheduleHide();
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      if (hideTimeoutRef.current) {
        window.clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  const getDotColor = (index: number) => {
    const STATIC_SECTIONS = 4;
    if (index < STATIC_SECTIONS) return 'bg-gray-500';

    const stepKeys = ['step1', 'step2', 'step3', 'step4', 'step5', 'step6'];
    const themeKey = stepKeys[index - STATIC_SECTIONS];
    return THEMES[themeKey]?.accent || 'bg-gray-500';
  };

  return (
    <div
      ref={containerRef}
      className={
        `
        fixed z-40 pointer-events-auto transition-all duration-300
        right-1 top-1/2 -translate-y-1/2
        rounded-full
        bg-gradient-to-b from-white/40 to-white/15
        backdrop-blur-xl backdrop-saturate-150
        border border-white/25 shadow-lg shadow-black/8
        px-1 py-1
        
        lg:right-2 lg:px-1.5 lg:py-1.5
      `
      }
      role="navigation"
      aria-label="Section navigation"
    >
      <div className="absolute top-2.5 bottom-2.5 left-1/2 -translate-x-1/2 w-px bg-slate-200/45 overflow-hidden rounded-full">
        <div
          className="absolute inset-0 bg-[#F36F21] origin-top rounded-full"
          style={{ transform: `scaleY(${progressScale})` }}
        />
      </div>

      <div className="relative flex flex-col items-center gap-1 lg:gap-1">
        {Array.from({ length: totalSections }).map((_, index) => {
          const isActive = activeIndex === index;
          const isVisited = index < activeIndex;
          const dotColorClass = getDotColor(index);
          const label = labels[index];
          const isMajorSelectionStep = !isTopicSelected && index === 3 && activeIndex === 3;
          const isLabelVisible = visibleIndex === index;

          return (
            <div
              key={index}
              onClick={() => setVisibleIndex((prev) => (prev === index ? null : index))}
              className={
                `
                group relative
                flex items-center justify-center
                transition-all duration-200
                ${isMajorSelectionStep ? 'h-7 w-7' : 'h-6 w-6 rounded-full hover:scale-105 active:scale-95'}
              `
              }
            >
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  scrollToSection(index);
                  scheduleHide();
                }}
                className={`
                  group relative
                  flex items-center justify-center
                  transition-all duration-200
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F36F21]/60 focus-visible:ring-offset-2
                  ${isMajorSelectionStep ? 'h-7 w-7' : 'h-6 w-6 rounded-full hover:scale-105 active:scale-95'}
                `}
                aria-label={label}
                title={label}
              >
                {isMajorSelectionStep ? (
                  <div className="relative flex items-center justify-center animate-pulse">
                    <div className="absolute inset-0 bg-[#F36F21]/20 rounded-full animate-ping" />
                    <div className={`
                      relative z-10 flex items-center justify-center w-5.5 h-5.5 rounded-full 
                      bg-[#F36F21] text-white shadow-lg shadow-orange-500/30
                      transition-transform duration-300 group-hover:translate-y-1
                    `}>
                      <ArrowDown size={11} strokeWidth={3} />
                    </div>
                  </div>
                ) : (
                  <span
                    className={
                      `
                      rounded-full transition-all duration-250 ease-out
                      ${isActive ? 'w-2.5 h-2.5' : 'w-1.5 h-1.5'}
                      ${isActive ? `${dotColorClass} ring-2 ring-[#F36F21]/40` : ''}
                      ${!isActive && isVisited ? `${dotColorClass} opacity-70` : ''}
                      ${!isActive && !isVisited ? 'bg-slate-300/80 group-hover:bg-slate-400' : ''}
                    `
                    }
                  />
                )}
              </button>

              <span
                className={
                  `
                  hidden lg:block
                  absolute right-full mr-3
                  px-3 py-1.5
                  rounded-full
                  bg-slate-900 text-white
                  text-xs font-bold
                  whitespace-nowrap
                  shadow-lg
                  ${isLabelVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'}
                  transition-all duration-200
                  ${isMajorSelectionStep ? 'mr-4 bg-[#F36F21]' : ''}
                `
                }
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SidebarDots;
