import React, { useRef, useState, useEffect, useCallback } from 'react';
import IntroSection from '../components/IntroSection';
import BenefitsSection from '../components/BenefitsSection';
import HeroSection from '../components/HeroSection';
import StarterKitSection from '../components/StarterKitSection';
import StepLayout from '../components/StepLayout';
import SidebarDots from '../components/SidebarDots';
import Footer from '../components/Footer';
import { STEPS_DATA } from '../data/stepsData';
import Step1Problem from '../components/steps/Step1Problem';
import Step2Literature from '../components/steps/Step2Literature';
import Step3Method from '../components/steps/Step3Method';
import Step4Planning from '../components/steps/Step4Planning';
import Step5Analysis from '../components/steps/Step5Analysis';
import Step6Ethics from '../components/steps/Step6Ethics';
import { ThemeColors } from '../types';
import ChatbotWidget from '../components/ai/ChatbotWidget';

// Map step IDs to their corresponding components
const STEP_COMPONENTS: Record<string, React.FC<{ theme: ThemeColors }>> = {
  'step1': Step1Problem,
  'step2': Step2Literature,
  'step3': Step3Method,
  'step4': Step4Planning,
  'step5': Step5Analysis,
  'step6': Step6Ethics,
};

const HomePage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState(0);
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
            {STEPS_DATA.map((step) => {
              const StepComponent = STEP_COMPONENTS[step.id];
              return (
                <StepLayout
                  key={step.id}
                  stepNumber={step.stepNumber}
                  title={step.title}
                  description={step.description}
                  theme={step.theme}
                >
                  <StepComponent theme={step.theme} />
                </StepLayout>
              );
            })}
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
