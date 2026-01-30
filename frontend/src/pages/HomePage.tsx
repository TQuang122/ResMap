import React, { useRef, useState, useEffect, useCallback } from 'react';
import IntroSection from '../components/IntroSection';
import BenefitsSection from '../components/BenefitsSection';
import HeroSection from '../components/HeroSection';
import StarterKitSection from '../components/StarterKitSection';
import StepLayout from '../components/StepLayout';
import SidebarDots from '../components/SidebarDots';
import Footer from '../components/Footer';
import { STEPS_DATA } from '../data/stepsData';
import ChatbotWidget from '../components/ai/ChatbotWidget';
import { useLocation, useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const [authNotice, setAuthNotice] = useState<string | null>(null);
  // Intro, Benefits, StarterKit, Research How-To (Hero) = 4 sections
  const INITIAL_SECTIONS_COUNT = 4;
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const scrollToSection = useCallback((index: number) => {
    if (containerRef.current) {
      const children = Array.from(containerRef.current.children) as HTMLElement[];
      if (children[index]) {
        children[index].scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollPosition = container.scrollTop + (window.innerHeight / 3);
      const children = Array.from(container.children) as HTMLElement[];
      
      for (let i = 0; i < children.length; i++) {
        const section = children[i];
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          setActiveSection(i);
          break;
        }
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!selectedTopic) return;

    // After selecting a major group, auto-scroll to the first detailed step.
    // Steps are rendered after the 4 static sections.
    const timeoutId = window.setTimeout(() => {
      scrollToSection(INITIAL_SECTIONS_COUNT);
    }, 50);

    return () => window.clearTimeout(timeoutId);
  }, [selectedTopic, scrollToSection]);

  useEffect(() => {
    const state = location.state as { authSuccess?: boolean; authMessage?: string } | null;
    if (state?.authSuccess) {
      setAuthNotice(state.authMessage || 'Đăng nhập thành công.');
      navigate(location.pathname, { replace: true, state: {} });
      const timeoutId = window.setTimeout(() => setAuthNotice(null), 2000);
      return () => window.clearTimeout(timeoutId);
    }
    return undefined;
  }, [location.pathname, location.state, navigate]);

  const handleStartClick = () => {
    // Scroll to Research How-To + Major Selection (HeroSection is now 4th, index 3)
    scrollToSection(3);
  };

  const handleLearnMoreClick = () => {
    // Scroll to Benefits (2nd section, index 1)
    scrollToSection(1);
  };

  return (
    <>
      <div 
        ref={containerRef}
        className="flex-1 w-full overflow-y-scroll no-scrollbar scroll-smooth"
      >
        {authNotice && (
          <div className="fixed top-24 right-6 z-50 w-[280px] rounded-2xl border border-orange-200 bg-white shadow-xl px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-[0.25em] text-orange-400">ResMap</div>
                <div className="mt-1 text-sm font-semibold text-slate-900">{authNotice}</div>
                <div className="mt-1 text-xs text-slate-500">Bạn đã đăng nhập thành công.</div>
              </div>
              <button
                onClick={() => setAuthNotice(null)}
                className="text-slate-400 hover:text-slate-600 text-sm"
                aria-label="Đóng thông báo"
              >
                ×
              </button>
            </div>
          </div>
        )}
        {/* 1. Intro Banner */}
        <IntroSection onStartClick={handleStartClick} onLearnMoreClick={handleLearnMoreClick} />

        {/* 2. Benefits */}
        <BenefitsSection />

        {/* 3. Starter Kit (Summary) */}
        <StarterKitSection selectedTopic={selectedTopic} />

        {/* 4. Research How-To + Major Selection */}
        <HeroSection selectedTopic={selectedTopic} setSelectedTopic={setSelectedTopic} />

        {/* 5+. Steps (Only if topic selected) */}
        {selectedTopic && (
          <>
            {STEPS_DATA.map((step) => (
              <StepLayout
                key={step.id}
                stepData={step}
              />
            ))}
          </>
        )}
        
        <Footer />
      </div>

      <ChatbotWidget />

        <SidebarDots 
          activeIndex={activeSection} 
          totalSections={selectedTopic ? INITIAL_SECTIONS_COUNT + STEPS_DATA.length : INITIAL_SECTIONS_COUNT} 
          sectionLabels={selectedTopic
            ? [
                'Giới thiệu',
                'Lợi ích',
                'Starter Kit',
                'Research How-To',
                ...STEPS_DATA.map((s) => `Bước ${s.stepNumber}: ${s.title}`),
              ]
            : ['Giới thiệu', 'Lợi ích', 'Starter Kit', 'Research How-To']
          }
          scrollToSection={scrollToSection} 
        />
    </>
  );
};

export default HomePage;
