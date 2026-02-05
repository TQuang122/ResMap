import React, { useState, useEffect, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import IntroSection from '../components/IntroSection';
import BenefitsSection from '../components/BenefitsSection';
import StarterKitSection from '../components/StarterKitSection';
import ResearchHowToSection from '../components/ResearchHowToSection';
import SidebarDots from '../components/SidebarDots';
import Footer from '../components/Footer';
import ChatbotWidget from '../components/ai/ChatbotWidget';

const HomePage: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const fadeUp = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 12 },
    visible: { opacity: 1, y: 0 },
  };
  const [activeSection, setActiveSection] = useState(0);
  const INITIAL_SECTIONS_COUNT = 4;

  const scrollToSection = useCallback((index: number) => {
    const children = Array.from(document.body.querySelectorAll('section') as any) as HTMLElement[];
    if (children[index]) {
      children[index].scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + (window.innerHeight / 3);
      const children = Array.from(document.body.querySelectorAll('section') as any) as HTMLElement[];
      
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

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleStartClick = () => {
    scrollToSection(INITIAL_SECTIONS_COUNT - 1);
  };

  const handleLearnMoreClick = () => {
    scrollToSection(1);
  };

  return (
    <>
      <div className="flex-1 w-full">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <IntroSection onStartClick={handleStartClick} onLearnMoreClick={handleLearnMoreClick} />
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.45, ease: 'easeOut', delay: 0.06 }}
        >
          <BenefitsSection />
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.45, ease: 'easeOut', delay: 0.12 }}
        >
          <StarterKitSection />
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.45, ease: 'easeOut', delay: 0.24 }}
        >
          <ResearchHowToSection />
        </motion.div>
        
        <Footer />
      </div>

      <ChatbotWidget />

      <SidebarDots 
        activeIndex={activeSection} 
        totalSections={INITIAL_SECTIONS_COUNT}
        sectionLabels={['Giới thiệu', 'Lợi ích', 'Starter Kit', 'Research How-To']}
        scrollToSection={scrollToSection}
        isTopicSelected={false}
      />
    </>
  );
};

export default HomePage;
