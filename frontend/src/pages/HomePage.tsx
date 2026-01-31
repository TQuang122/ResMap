import React, { useRef, useState, useEffect, useCallback } from 'react';
import IntroSection from '../components/IntroSection';
import BenefitsSection from '../components/BenefitsSection';
import HeroSection from '../components/HeroSection';
import StarterKitSection from '../components/StarterKitSection';
import StepLayout from '../components/StepLayout';
import SidebarDots from '../components/SidebarDots';
import Footer from '../components/Footer';
import ChatbotWidget from '../components/ai/ChatbotWidget';
import ResExploreModal from '../components/research/ResExploreModal';
import BusinessResExploreModal from '../components/research/BusinessResExploreModal';
import LanguagesResExploreModal from '../components/research/LanguagesResExploreModal';
import DesignResExploreModal from '../components/research/DesignResExploreModal';
import LawResExploreModal from '../components/research/LawResExploreModal';
import MediaResExploreModal from '../components/research/MediaResExploreModal';
import ResearchSuggestionModal from '../components/research/ResearchSuggestionModal';
import AiUsageModal from '../components/research/AiUsageModal';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { StepFullData } from '../types';
import { IT_LECTURERS } from '../data/lecturers/itLecturers';
import { BUSINESS_LECTURERS } from '../data/lecturers/businessLecturers';
import { LANGUAGES_LECTURERS } from '../data/lecturers/languagesLecturers';
import { DESIGN_LECTURERS } from '../data/lecturers/designLecturers';
import { LAW_LECTURERS } from '../data/lecturers/lawLecturers';

const PENDING_TOPIC_KEY = 'resmap_pending_topic';

// Mapping topic titles to their steps data modules
const STEPS_BY_TOPIC: Record<string, () => Promise<{ STEPS_DATA: StepFullData[] }>> = {
  'Công nghệ thông tin': () => import('../data/stepsIt').then(m => m),
  'Kinh doanh, Quản trị & Tài chính': () => import('../data/stepsBusiness').then(m => m),
  'Truyền thông & Media': () => import('../data/stepsMedia').then(m => m),
  'Ngôn ngữ': () => import('../data/stepsLanguages').then(m => m),
  'Thiết kế': () => import('../data/stepsDesign').then(m => m),
  'Luật & Luật kinh tế': () => import('../data/stepsLaw').then(m => m),
};

const HomePage: React.FC = () => {
  const [activeSection, setActiveSection] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const [authNotice, setAuthNotice] = useState<string | null>(null);
  // Intro, Benefits, StarterKit, Research How-To (Hero) = 4 sections
  const INITIAL_SECTIONS_COUNT = 4;
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [stepsData, setStepsData] = useState<StepFullData[]>([]);
  const [isResExploreOpen, setIsResExploreOpen] = useState(false);
  const [isBusinessResExploreOpen, setIsBusinessResExploreOpen] = useState(false);
  const [isLanguagesResExploreOpen, setIsLanguagesResExploreOpen] = useState(false);
  const [isDesignResExploreOpen, setIsDesignResExploreOpen] = useState(false);
  const [isLawResExploreOpen, setIsLawResExploreOpen] = useState(false);
  const [isMediaResExploreOpen, setIsMediaResExploreOpen] = useState(false);
  const [isResearchSuggestionOpen, setIsResearchSuggestionOpen] = useState(false);
  const [isAiUsageOpen, setIsAiUsageOpen] = useState(false);

  // Check auth state on mount and listen for changes
  useEffect(() => {
    if (!supabase) {
      // If supabase is not configured, allow access without auth
      setIsAuthenticated(true);
      return;
    }

    // Check current session
    supabase.auth.getSession().then(({ data }) => {
      setIsAuthenticated(Boolean(data.session));
    });

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(Boolean(session));
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Restore pending topic after login
  useEffect(() => {
    const state = location.state as { authSuccess?: boolean; authMessage?: string; pendingTopic?: string } | null;
    
    if (state?.authSuccess && isAuthenticated) {
      setAuthNotice(state.authMessage || 'Đăng nhập thành công.');
      
      // Check for pending topic from state or localStorage
      const pendingTopic = state.pendingTopic || localStorage.getItem(PENDING_TOPIC_KEY);
      if (pendingTopic) {
        setSelectedTopic(pendingTopic);
        localStorage.removeItem(PENDING_TOPIC_KEY);
      }
      
      navigate(location.pathname, { replace: true, state: {} });
      const timeoutId = window.setTimeout(() => setAuthNotice(null), 3000);
      return () => window.clearTimeout(timeoutId);
    }
    return undefined;
  }, [location.pathname, location.state, navigate, isAuthenticated]);

  // Handle topic selection with auth check
  const handleTopicSelect = useCallback((topic: string) => {
    // If auth check is still loading, wait
    if (isAuthenticated === null) return;

    if (!isAuthenticated) {
      // Save pending topic to localStorage
      localStorage.setItem(PENDING_TOPIC_KEY, topic);
      // Redirect to auth page
      navigate('/auth', { 
        state: { 
          from: location.pathname,
          pendingTopic: topic,
          message: 'Vui lòng đăng nhập để xem hướng dẫn chi tiết theo khối ngành.'
        } 
      });
      return;
    }

    // User is authenticated, proceed with selection
    setSelectedTopic(topic);

    // Load topic-specific data
    const loadData = STEPS_BY_TOPIC[topic];
    if (loadData) {
      loadData().then(m => setStepsData(m.STEPS_DATA));
    }
  }, [isAuthenticated, navigate, location.pathname]);

  const scrollToSection = useCallback((index: number) => {
    const children = Array.from(document.body.querySelectorAll('section')) as HTMLElement[];
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
      const children = Array.from(document.body.querySelectorAll('section')) as HTMLElement[];
      
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

  useEffect(() => {
    if (!selectedTopic) return;

    const timeoutId = window.setTimeout(() => {
      scrollToSection(INITIAL_SECTIONS_COUNT);
    }, 100);

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
      <div className="flex-1 w-full">
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
        <HeroSection selectedTopic={selectedTopic} setSelectedTopic={handleTopicSelect} />

        {/* 5+. Steps (Only if topic selected) */}
        {selectedTopic && stepsData.length > 0 && (
          <>
            {stepsData.map((step) => (
              <StepLayout
                key={step.id}
                stepData={step}
                onResExploreOpen={() => {
                  if (selectedTopic === 'Kinh doanh, Quản trị & Tài chính') {
                    setIsBusinessResExploreOpen(true);
                  } else if (selectedTopic === 'Ngôn ngữ') {
                    setIsLanguagesResExploreOpen(true);
                  } else if (selectedTopic === 'Thiết kế') {
                    setIsDesignResExploreOpen(true);
                  } else if (selectedTopic === 'Luật & Luật kinh tế') {
                    setIsLawResExploreOpen(true);
                  } else if (selectedTopic === 'Truyền thông & Media') {
                    setIsMediaResExploreOpen(true);
                  } else {
                    setIsResExploreOpen(true);
                  }
                }}
                onResearchSuggestionOpen={() => setIsResearchSuggestionOpen(true)}
                onAiUsageOpen={() => setIsAiUsageOpen(true)}
              />
            ))}
          </>
        )}
        
        <Footer />
      </div>

      <ChatbotWidget />

      <ResExploreModal
        isOpen={isResExploreOpen}
        onClose={() => setIsResExploreOpen(false)}
        lecturers={IT_LECTURERS}
      />

      <BusinessResExploreModal
        isOpen={isBusinessResExploreOpen}
        onClose={() => setIsBusinessResExploreOpen(false)}
        lecturers={BUSINESS_LECTURERS}
      />

      <LanguagesResExploreModal
        isOpen={isLanguagesResExploreOpen}
        onClose={() => setIsLanguagesResExploreOpen(false)}
        lecturers={LANGUAGES_LECTURERS}
      />

      <DesignResExploreModal
        isOpen={isDesignResExploreOpen}
        onClose={() => setIsDesignResExploreOpen(false)}
        lecturers={DESIGN_LECTURERS}
      />

      <LawResExploreModal
        isOpen={isLawResExploreOpen}
        onClose={() => setIsLawResExploreOpen(false)}
        lecturers={LAW_LECTURERS}
      />

      <MediaResExploreModal
        isOpen={isMediaResExploreOpen}
        onClose={() => setIsMediaResExploreOpen(false)}
      />

      <ResearchSuggestionModal
        isOpen={isResearchSuggestionOpen}
        onClose={() => setIsResearchSuggestionOpen(false)}
      />

      <AiUsageModal
        isOpen={isAiUsageOpen}
        onClose={() => setIsAiUsageOpen(false)}
      />

        <SidebarDots 
          activeIndex={activeSection} 
          totalSections={selectedTopic ? INITIAL_SECTIONS_COUNT + stepsData.length : INITIAL_SECTIONS_COUNT} 
          sectionLabels={selectedTopic
            ? [
                'Giới thiệu',
                'Lợi ích',
                'Starter Kit',
                'Research How-To',
                ...stepsData.map((s) => `Bước ${s.stepNumber}: ${s.title}`),
              ]
            : ['Giới thiệu', 'Lợi ích', 'Starter Kit', 'Chọn khối ngành']
          }
          scrollToSection={scrollToSection}
          isTopicSelected={!!selectedTopic}
        />
    </>
  );
};

export default HomePage;
