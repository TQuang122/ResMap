import React from 'react';
import { ThemeColors } from '../types';

interface StepLayoutProps {
  stepNumber: string;
  title: string;
  description: string;
  theme: ThemeColors;
  children: React.ReactNode;
}

const StepLayout: React.FC<StepLayoutProps> = ({ stepNumber, title, description, theme, children }) => {
  return (
    <section className={`
      w-full h-auto shrink-0 
      flex flex-col relative ${theme.bg} ${theme.text} 
      pt-32 pb-20 transition-all
    `}>
      <div className="max-w-[1600px] mx-auto w-full flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-16 px-3 md:px-6 lg:px-10">
        
        {/* Text Side - Always visible, full content */}
        <div className="shrink-0 lg:col-span-5 flex flex-col justify-center pt-2 lg:pt-0">
          <span className="text-xs md:text-sm lg:text-base font-black uppercase tracking-[0.2em] opacity-60 mb-3 md:mb-5 lg:mb-6">
            Bước {stepNumber}
          </span>
          <h2 className="text-xl md:text-3xl lg:text-5xl font-black mb-4 md:mb-8 lg:mb-10 leading-[1.1]">
            {title}
          </h2>
          <div className={`w-14 md:w-20 lg:w-28 h-1.5 md:h-2 mb-4 md:mb-8 lg:mb-10 ${theme.accent} opacity-80 rounded-full`}></div>
          <p className="text-xs md:text-base lg:text-lg leading-relaxed opacity-80 font-medium">
            {description}
          </p>
        </div>

        {/* Content Side (Glass Panel) */}
        {/* Mobile: fit content. Desktop: Natural flow */}
        <div className="w-full lg:col-span-7 flex items-start">
          <div className={`w-full ${theme.glass} backdrop-blur-xl border border-white/40 p-6 md:p-12 lg:p-16 rounded-2xl md:rounded-3xl shadow-xl text-base md:text-lg lg:text-xl`}>
            {children}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StepLayout;