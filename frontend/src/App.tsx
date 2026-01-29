import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import StarterKitPage from './pages/StarterKitPage';
import CitationCheckPage from './pages/CitationCheckPage';
import PlagiarismCheckPage from './pages/PlagiarismCheckPage';
import AiAssistantPage from './pages/AiAssistantPage';
import AuthPage from './pages/AuthPage';
import ProtectedRoute from './components/ProtectedRoute';
import ProfilePage from './pages/ProfilePage';

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

    // Simple scroll handler for the window/body since some pages might scroll the body
    // Note: HomePage manages its own internal scroll in a div, so this might need adjustment based on where the scrollbar is.
    // However, Navigation expects `isScrolled` to change appearance.
    
    // If we are on StarterKitPage, the scroll is on the div inside the page? 
    // Actually, let's keep it simple: Navigation is fixed.
    // If we want Navigation to react to scroll, we need to listen to the scrolling element.
    // Since HomePage has a specific scrollable div, and StarterKitPage has another...
    // We might need to lift the scroll listener or pass a callback.
    
    // For now, let's just default isScrolled to true on internal pages if we want a solid header,
    // or keep the listener if we can target the right element.
    
    if (location.pathname === '/home') {
      setIsScrolled(false);
    } else {
      setIsScrolled(true);
    }
  }, [location]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-white text-slate-900 font-sans flex flex-col">
      <Navigation isScrolled={isScrolled} />
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/starter-kit" element={<StarterKitPage />} />
        <Route
          path="/citation-check"
          element={
            <ProtectedRoute>
              <CitationCheckPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/plagiarism-check"
          element={
            <ProtectedRoute>
              <PlagiarismCheckPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai-assistant"
          element={
            <ProtectedRoute>
              <AiAssistantPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    </div>
  );
}

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
