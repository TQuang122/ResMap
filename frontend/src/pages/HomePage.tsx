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
import ResearchSuggestionModal from '../components/research/ResearchSuggestionModal';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { StepFullData } from '../types';
import { IT_LECTURERS } from '../data/lecturers/itLecturers';

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
  const containerRef = useRef<HTMLDivElement>(null);
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
  const [isResearchSuggestionOpen, setIsResearchSuggestionOpen] = useState(false);

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
                onResExploreOpen={() => setIsResExploreOpen(true)}
                onResearchSuggestionOpen={() => setIsResearchSuggestionOpen(true)}
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

      <ResearchSuggestionModal
        isOpen={isResearchSuggestionOpen}
        onClose={() => setIsResearchSuggestionOpen(false)}
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
            : ['Giới thiệu', 'Lợi ích', 'Starter Kit', 'Research How-To']
          }
          scrollToSection={scrollToSection} 
        />
    </>
  );
};

export default HomePage;
