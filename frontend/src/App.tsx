import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import ResHowToPage from './pages/ResHowToPage';
import StarterKitPage from './pages/StarterKitPage';
import CitationCheckPage from './pages/CitationCheckPage';
import PlagiarismCheckPage from './pages/PlagiarismCheckPage';
import AiAssistantPage from './pages/AiAssistantPage';
import AuthPage from './pages/AuthPage';
import ProtectedRoute from './components/ProtectedRoute';
import ProfilePage from './pages/ProfilePage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import AboutUsPage from './pages/AboutUsPage';
import { ToastProvider } from './components/ui/Toast';
import { PageTransition } from './components/ui/PageTransition';

// Wrapper to handle scroll state for Navigation across pages
const AppContent: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handler = () => {
      const el = document.getElementById('page-footer');
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    window.addEventListener('resmap:scrollToFooter', handler);
    return () => window.removeEventListener('resmap:scrollToFooter', handler);
  }, []);

  useEffect(() => {
    // Reset scroll on route change
    setIsScrolled(false);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      // Smart scroll: transparent when near top, solid when scrolled
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [location]);

  return (
    <div className="relative w-full min-h-screen bg-white text-slate-900 font-sans flex flex-col">
      <Navigation isScrolled={isScrolled} />
      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={
            <PageTransition animation="fade">
              <HomePage />
            </PageTransition>
          } />
          <Route path="/starter-kit" element={
            <PageTransition animation="fade">
              <StarterKitPage />
            </PageTransition>
          } />
          <Route path="/reshowto" element={
            <PageTransition animation="fade">
              <ResHowToPage />
            </PageTransition>
          } />
          <Route
            path="/citation-check"
            element={
              <PageTransition animation="fade">
                <ProtectedRoute>
                  <CitationCheckPage />
                </ProtectedRoute>
              </PageTransition>
            }
          />
          <Route
            path="/plagiarism-check"
            element={
              <PageTransition animation="fade">
                <ProtectedRoute>
                  <PlagiarismCheckPage />
                </ProtectedRoute>
              </PageTransition>
            }
          />
          <Route
            path="/ai-assistant"
            element={
              <PageTransition animation="fade">
                <ProtectedRoute>
                  <AiAssistantPage />
                </ProtectedRoute>
              </PageTransition>
            }
          />
          <Route
            path="/profile"
            element={
              <PageTransition animation="fade">
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              </PageTransition>
            }
          />
          <Route path="/auth" element={
            <PageTransition animation="fade">
              <AuthPage />
            </PageTransition>
          } />
          <Route path="/terms" element={
            <PageTransition animation="fade">
              <TermsPage />
            </PageTransition>
          } />
          <Route path="/privacy" element={
            <PageTransition animation="fade">
              <PrivacyPage />
            </PageTransition>
          } />
          <Route path="/about-us" element={
            <PageTransition animation="fade">
              <AboutUsPage />
            </PageTransition>
          } />
        </Routes>
      </main>
    </div>
  );
}

import { ResearchProvider } from './context/ResearchContext';

const App: React.FC = () => {
  return (
    <ResearchProvider>
      <ToastProvider>
        <Router>
          <AppContent />
        </Router>
      </ToastProvider>
    </ResearchProvider>
  );
};

export default App;
