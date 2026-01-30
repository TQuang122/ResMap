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
  const progressScale = Math.max(0, Math.min(1, progressPct / 100));

  const getDotColor = (index: number) => {
    // Static sections: Intro, Benefits, StarterKit, Research How-To (Hero)
    const STATIC_SECTIONS = 4;
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
        right-2 top-1/2 -translate-y-1/2
        rounded-full
        bg-gradient-to-b from-white/40 to-white/15
        backdrop-blur-xl backdrop-saturate-150
        border border-white/25 shadow-lg shadow-black/8
        px-2 py-2
        
        lg:right-8 lg:px-2.5 lg:py-3
      `
      }
      role="navigation"
      aria-label="Section navigation"
    >
      {/* Track */}
      <div className="absolute top-4 bottom-4 left-1/2 -translate-x-1/2 w-px bg-slate-200/45 overflow-hidden rounded-full">
        <div
          className="absolute inset-0 bg-[#F36F21] origin-top rounded-full"
          style={{ transform: `scaleY(${progressScale})` }}
        />
      </div>

      <div className="relative flex flex-col items-center gap-1.5 lg:gap-2">
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
                h-8 w-8 rounded-full
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
                  ${isActive ? 'w-3 h-3' : 'w-2 h-2'}
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
