import React, { useState, useEffect, useRef } from 'react';
import { Menu, Search, X, ChevronDown, LogOut, User as UserIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '@/assets/Logo.png';
import { searchContent } from '../utils/search';
import MenuDrawer from './MenuDrawer'; // Import the new Portal component
import { supabase } from '../lib/supabase';
import { AnimatePresence, motion } from 'framer-motion';

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
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [displayEmail, setDisplayEmail] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setIsUserOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  useEffect(() => {
    if (!supabase) return;
    const resolveName = async (sessionUser?: { id: string; email?: string; user_metadata?: Record<string, unknown> }) => {
      if (!sessionUser) {
        setDisplayName(null);
        setDisplayEmail(null);
        setAvatarUrl(null);
        return;
      }

      const metaName = sessionUser.user_metadata?.full_name as string | undefined;
      const metaAvatar = sessionUser.user_metadata?.avatar_url as string | undefined;
      setDisplayName(metaName ?? sessionUser.email ?? null);
      setDisplayEmail(sessionUser.email ?? null);
      setAvatarUrl(metaAvatar ?? null);

      const profileRes = await supabase
        .from('profiles')
        .select('full_name,avatar_url')
        .eq('id', sessionUser.id)
        .maybeSingle();

      if (!profileRes.error && profileRes.data?.full_name) {
        setDisplayName(profileRes.data.full_name);
      }
      if (!profileRes.error && profileRes.data?.avatar_url) {
        setAvatarUrl(profileRes.data.avatar_url);
      }
    };

    supabase.auth.getSession().then(({ data }) => {
      resolveName(data.session?.user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      resolveName(session?.user);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setIsUserOpen(false);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setResults(searchContent(val));
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 py-3 md:py-4 bg-white/80 backdrop-blur-xl transition-all duration-300 ${
        isScrolled ? 'border-b border-gray-100' : 'border-b border-transparent'
      }`}>
        <div className="w-full px-3 md:px-6 lg:px-0 flex items-center justify-between max-w-7xl mx-auto">
          
          {/* Left Side: Menu + Logo */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="text-[#F36F21] hover:opacity-80 transition-all active:scale-95 p-2 md:hidden"
            >
              <Menu size={isScrolled ? 20 : 24} />
            </button>

            <Link to="/home" className="block hover:opacity-90 transition-all duration-300">
              <img
                src={Logo}
                className={`w-auto object-contain transition-all duration-300 ${
                  isScrolled ? 'h-8 md:h-11 lg:h-12' : 'h-9 md:h-14 lg:h-14'
                }`}
                referrerPolicy="no-referrer"
                alt="ResMap Logo"
              />
            </Link>
          </div>

          {/* Center: Navigation (Desktop) */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-500">
            <Link to="/home" className="hover:text-[#F36F21] transition-colors">Trang chủ</Link>
            <Link to="/starter-kit" className="hover:text-[#F36F21] transition-colors">Starter Kit</Link>
            <Link to="/citation-check" className="hover:text-[#F36F21] transition-colors">Citation</Link>
            <Link to="/plagiarism-check" className="hover:text-[#F36F21] transition-colors">Plagiarism</Link>
            <Link to="/ai-assistant" className="hover:text-[#F36F21] transition-colors">AI Assistant</Link>
          </nav>


          {/* Right Side: Auth + Contact */}
          <div className={`flex items-center gap-2 ${isSearchOpen ? 'hidden md:flex' : 'flex'}`}>
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-slate-400 hover:text-[#F36F21] transition-all active:scale-95 p-2"
            >
              <Search size={isScrolled ? 18 : 20} />
            </button>
            {displayName ? (
              <div ref={userRef} className="relative">
                <button
                  onClick={() => setIsUserOpen((prev) => !prev)}
                  className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-2 text-xs font-semibold text-slate-600 hover:border-orange-200 hover:text-orange-500 transition-colors"
                >
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="h-6 w-6 rounded-full object-cover" />
                  ) : (
                    <span className="h-6 w-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-[10px] font-bold">
                      {(displayName[0] || 'U').toUpperCase()}
                    </span>
                  )}
                  <span className="hidden md:inline-block max-w-[120px] truncate">{displayName}</span>
                  <ChevronDown size={14} />
                </button>

                <AnimatePresence>
                  {isUserOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.16 }}
                      className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-xs text-slate-400">Đăng nhập bởi</p>
                        <p className="text-sm font-semibold text-slate-800 truncate">{displayName}</p>
                        <p className="text-xs text-slate-500 truncate">{displayEmail}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                        onClick={() => setIsUserOpen(false)}
                      >
                        <UserIcon size={16} className="text-slate-400" />
                        Hồ sơ cá nhân
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                      >
                        <LogOut size={16} />
                        Đăng xuất
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/auth"
                className="border border-orange-200 text-[#F36F21] text-xs md:text-sm font-bold px-4 md:px-5 py-2 md:py-2.5 rounded-full hover:bg-orange-50 transition-all active:scale-95"
              >
                Đăng nhập
              </Link>
            )}
            <button
              onClick={() => window.dispatchEvent(new Event('resmap:scrollToFooter'))}
              className="bg-[#F36F21] text-white text-xs md:text-sm font-bold px-4 md:px-5 py-2 md:py-2.5 rounded-full hover:shadow-lg hover:bg-orange-600 transition-all active:scale-95"
            >
              Liên hệ
            </button>
          </div>

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
