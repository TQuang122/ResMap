import React from 'react';
import { THEMES } from '../constants';

interface SidebarDotsProps {
  activeIndex: number;
  totalSections: number;
  scrollToSection: (index: number) => void;
  sectionLabels?: string[];
}

const SidebarDots: React.FC<SidebarDotsProps> = ({
  activeIndex,
  totalSections,
  scrollToSection,
  sectionLabels,
}) => {
  const labels = sectionLabels && sectionLabels.length === totalSections
    ? sectionLabels
    : Array.from({ length: totalSections }).map((_, i) => `Section ${i + 1}`);

  const progressPct = totalSections <= 1 ? 0 : (activeIndex / (totalSections - 1)) * 100;

  const getDotColor = (index: number) => {
    // Static sections: Intro, Benefits, Hero, StarterKit, Tools
    const STATIC_SECTIONS = 5;
    if (index < STATIC_SECTIONS) return 'bg-gray-500';

    const stepKeys = ['step1', 'step2', 'step3', 'step4', 'step5', 'step6'];
    const themeKey = stepKeys[index - STATIC_SECTIONS];
    return THEMES[themeKey]?.accent || 'bg-gray-500';
  };

  return (
    <div
      className={
        `
        fixed z-40 pointer-events-auto transition-all duration-300
        bottom-6 left-1/2 -translate-x-1/2
        rounded-full bg-white/55 backdrop-blur-md border border-white/40 shadow-lg shadow-black/5
        px-4 py-3
        
        lg:right-8 lg:top-1/2 lg:-translate-y-1/2 lg:left-auto lg:bottom-auto lg:translate-x-0
        lg:rounded-full lg:px-3 lg:py-4
      `
      }
      role="navigation"
      aria-label="Section navigation"
    >
      {/* Mobile track */}
      <div className="lg:hidden absolute left-5 right-5 top-1/2 -translate-y-1/2 h-px bg-slate-200/80" />
      <div
        className="lg:hidden absolute left-5 top-1/2 -translate-y-1/2 h-px bg-[#F36F21]"
        style={{ width: `${progressPct}%` }}
      />

      {/* Desktop track */}
      <div className="hidden lg:block absolute top-6 bottom-6 left-1/2 -translate-x-1/2 w-px bg-slate-200/80" />
      <div
        className="hidden lg:block absolute top-6 left-1/2 -translate-x-1/2 w-px bg-[#F36F21]"
        style={{ height: `${progressPct}%` }}
      />

      <div className="relative flex items-center gap-2 lg:flex-col lg:gap-3">
        {Array.from({ length: totalSections }).map((_, index) => {
          const isActive = activeIndex === index;
          const isVisited = index < activeIndex;
          const dotColorClass = getDotColor(index);
          const label = labels[index];

          return (
            <button
              key={index}
              onClick={() => scrollToSection(index)}
              className={
                `
                group relative
                h-10 w-10 rounded-full
                flex items-center justify-center
                transition-transform duration-200
                hover:scale-105 active:scale-95
                focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F36F21]/60 focus-visible:ring-offset-2
              `
              }
              aria-label={label}
              title={label}
            >
              <span
                className={
                  `
                  rounded-full transition-all duration-250 ease-out
                  ${isActive ? 'w-3.5 h-3.5' : 'w-2.5 h-2.5'}
                  ${isActive ? `${dotColorClass} ring-2 ring-[#F36F21]/40` : ''}
                  ${!isActive && isVisited ? `${dotColorClass} opacity-70` : ''}
                  ${!isActive && !isVisited ? 'bg-slate-300/80 group-hover:bg-slate-400' : ''}
                `
                }
              />

              {/* Tooltip (desktop) */}
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
                  opacity-0 translate-x-2
                  group-hover:opacity-100 group-hover:translate-x-0
                  group-focus-visible:opacity-100 group-focus-visible:translate-x-0
                  transition-all duration-200
                `
                }
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SidebarDots;
