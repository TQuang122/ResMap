import React, { useRef, useState, useEffect } from 'react';
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
import ToolsSection from '../components/ToolsSection';
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
  // Intro, Benefits, Hero, StarterKit, Tools = 5 sections
  const INITIAL_SECTIONS_COUNT = 5;
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

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

  const scrollToSection = (index: number) => {
    if (containerRef.current) {
      const children = Array.from(containerRef.current.children) as HTMLElement[];
      if (children[index]) {
        children[index].scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  };

  const handleStartClick = () => {
    // Scroll to Topic Selection (HeroSection is now 3rd, index 2)
    scrollToSection(2); 
  };

  return (
    <>
      <div 
        ref={containerRef}
        className="flex-1 w-full overflow-y-scroll no-scrollbar scroll-smooth"
      >
        {/* 1. Intro Banner */}
        <IntroSection onStartClick={handleStartClick} />

        {/* 2. Benefits */}
        <BenefitsSection />

        {/* 3. Topic Selection (Original Hero) */}
        <HeroSection selectedTopic={selectedTopic} setSelectedTopic={setSelectedTopic} />

        {/* 4. Starter Kit (Summary) */}
        <StarterKitSection selectedTopic={selectedTopic} />

        {/* 5. Tools Section */}
        <ToolsSection />

        {/* 6+. Steps (Only if topic selected) */}
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
              'Khối ngành',
              'Starter Kit',
              'Công cụ',
              ...STEPS_DATA.map((s) => `Bước ${s.stepNumber}: ${s.title}`),
            ]
          : ['Giới thiệu', 'Lợi ích', 'Khối ngành', 'Starter Kit', 'Công cụ']
        }
        scrollToSection={scrollToSection} 
      />
    </>
  );
};

export default HomePage;
