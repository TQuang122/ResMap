import React, { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Home, FolderOpen, Quote, Search, Sparkles, ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const MenuDrawer: React.FC<MenuDrawerProps> = ({ isOpen, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const prevPathRef = useRef(location.pathname);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) && isOpen) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen, onClose]);

  // Close only when route actually changes while open
  useEffect(() => {
    if (isOpen && prevPathRef.current !== location.pathname) {
      onClose();
    }
    prevPathRef.current = location.pathname;
  }, [isOpen, location.pathname, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Render using Portal to document.body
  return createPortal(
    <div 
      className={`fixed inset-0 z-[9999] transition-opacity duration-300 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
        onClick={onClose} 
      />
      
      {/* Drawer Panel */}
      <div 
        ref={menuRef}
        className={`absolute top-0 left-0 h-full w-[350px] bg-white shadow-2xl transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Menu Header */}
        <div className="h-16 px-5 border-b border-gray-100 flex justify-between items-center shrink-0 bg-white">
          <span className="font-black text-xl text-slate-900">Menu</span>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>
        
        {/* Menu Links */}
        <nav className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto">
          <Link 
            to="/home" 
            className={`flex items-center justify-between p-3 rounded-xl transition-all ${
              location.pathname === '/home' 
              ? 'bg-orange-50 text-[#F36F21] font-bold' 
              : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Home size={18} />
              <span>Trang chủ</span>
            </div>
            {location.pathname === '/home' && <ChevronRight size={16} />}
          </Link>

          <Link 
            to="/starter-kit" 
            className={`flex items-center justify-between p-3 rounded-xl transition-all ${
              location.pathname === '/starter-kit' 
              ? 'bg-orange-50 text-[#F36F21] font-bold' 
              : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <FolderOpen size={18} />
              <span>Research Starter Kit</span>
            </div>
            {location.pathname === '/starter-kit' && <ChevronRight size={16} />}
          </Link>

          <Link 
            to="/citation-check" 
            className={`flex items-center justify-between p-3 rounded-xl transition-all ${
              location.pathname === '/citation-check' 
              ? 'bg-orange-50 text-[#F36F21] font-bold' 
              : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Quote size={18} />
              <span>APA/IEEE Checker</span>
            </div>
            {location.pathname === '/citation-check' && <ChevronRight size={16} />}
          </Link>

          <Link 
            to="/plagiarism-check" 
            className={`flex items-center justify-between p-3 rounded-xl transition-all ${
              location.pathname === '/plagiarism-check' 
              ? 'bg-orange-50 text-[#F36F21] font-bold' 
              : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Search size={18} />
              <span>Plagiarism Checker</span>
            </div>
            {location.pathname === '/plagiarism-check' && <ChevronRight size={16} />}
          </Link>

          <Link 
            to="/ai-assistant" 
            className={`flex items-center justify-between p-3 rounded-xl transition-all ${
              location.pathname === '/ai-assistant' 
              ? 'bg-orange-50 text-[#F36F21] font-bold' 
              : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Sparkles size={18} />
              <span>AI Assistant</span>
            </div>
            {location.pathname === '/ai-assistant' && <ChevronRight size={16} />}
          </Link>
        </nav>

        {/* Footer */}
        <div className="p-5 border-t border-gray-100 bg-slate-50">
          <p className="text-xs text-slate-400 text-center">
            © 2026 FPT University
          </p>
        </div>
      </div>
    </div>,
    document.body // Portal target
  );
};

export default MenuDrawer;
