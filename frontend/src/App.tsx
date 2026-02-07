import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastProvider } from './components/ui/Toast';
import { PageTransition } from './components/ui/PageTransition';

// Lazy load all page components for code splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const ResHowToPage = lazy(() => import('./pages/ResHowToPage'));
const StarterKitPage = lazy(() => import('./pages/StarterKitPage'));
const CitationCheckPage = lazy(() => import('./pages/CitationCheckPage'));
const PlagiarismCheckPage = lazy(() => import('./pages/PlagiarismCheckPage'));
const AiAssistantPage = lazy(() => import('./pages/AiAssistantPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const AboutUsPage = lazy(() => import('./pages/AboutUsPage'));

// Loading fallback component
const PageLoader: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 via-white to-slate-50">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-3 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
      <p className="text-sm text-slate-500 font-medium">Loading...</p>
    </div>
  </div>
);

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
        <Suspense fallback={<PageLoader />}>
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
              <ProtectedRoute>
                <ResHowToPage />
              </ProtectedRoute>
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
        </Suspense>
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
