import React, { useState, useEffect, useRef } from 'react';
import { Menu, Search, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '@/assets/Logo.png';
import { searchContent } from '../utils/search';
import MenuDrawer from './MenuDrawer'; // Import the new Portal component

interface NavigationProps {
  isScrolled: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ isScrolled }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setResults(searchContent(val));
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 py-3 md:py-4 bg-white/80 backdrop-blur-md transition-all duration-300 ${
        isScrolled ? 'border-b border-gray-100' : 'border-b border-transparent'
      }`}>
        <div className="w-full px-3 md:px-6 lg:px-0 flex items-center justify-between max-w-7xl mx-auto">
          
          {/* Left Side: Menu + Search Trigger */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="text-[#F36F21] hover:opacity-80 transition-all active:scale-95 p-2"
            >
              <Menu size={isScrolled ? 20 : 24} />
            </button>
            
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="text-slate-400 hover:text-[#F36F21] transition-all active:scale-95 p-2 hidden md:block"
            >
              <Search size={isScrolled ? 20 : 24} />
            </button>
          </div>

          {/* Center: Logo */}
          <div className="flex items-center">
            <Link to="/home" className="block hover:opacity-90 transition-all duration-300">
              <img
                src={Logo}
                className={`w-auto object-contain transition-all duration-300 ${
                  isScrolled ? 'h-8 md:h-12 lg:h-14' : 'h-10 md:h-16 lg:h-16'
                }`}
                referrerPolicy="no-referrer"
                alt="ResMap Logo"
              />
            </Link>
          </div>


          {/* Right Side: Contact */}
          <button 
            onClick={() => window.dispatchEvent(new Event('resmap:scrollToFooter'))}
            className={`bg-[#F36F21] text-white text-xs md:text-sm font-bold px-4 md:px-5 py-2 md:py-2.5 rounded-full hover:shadow-lg hover:bg-orange-600 transition-all active:scale-95 ${isSearchOpen ? 'hidden md:block' : 'block'}`}
          >
            Liên hệ
          </button>

          {/* Search Bar Overlay */}
          {isSearchOpen && (
            <div ref={searchRef} className="absolute inset-0 bg-white z-50 flex items-center px-4 md:px-20 animate-in fade-in slide-in-from-top-2 duration-200 shadow-sm">
              <Search className="text-slate-400 mr-3" size={20} />
              <input 
                autoFocus
                type="text" 
                value={query}
                onChange={handleSearch}
                placeholder="Tìm kiếm tài liệu, hướng dẫn..."
                className="flex-1 bg-transparent border-none outline-none text-slate-800 placeholder:text-slate-400 font-medium h-full"
              />
              <button onClick={() => setIsSearchOpen(false)} className="text-slate-400 hover:text-slate-600 ml-3">
                <X size={20} />
              </button>

              {/* Results Dropdown */}
              {results.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white shadow-xl border-t border-slate-100 max-h-[300px] overflow-y-auto">
                  {results.map((item, idx) => (
                    <div key={idx} className="p-4 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-none transition-colors group">
                      <h4 className="font-bold text-slate-800 text-sm group-hover:text-[#F36F21]">{item.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{item.description}</p>
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 mt-1 inline-block border border-slate-100 px-1 rounded">
                        {item.type}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </header>

      {/* Menu Drawer - Rendered via Portal */}
      <MenuDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
};

export default Navigation;
