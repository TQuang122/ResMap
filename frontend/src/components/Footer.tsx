import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, Facebook, Youtube } from 'lucide-react';
import FeedbackModal from './FeedbackModal';

const Footer: React.FC = () => {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const handleScrollToTop = () => {
    const scrollContainers = document.querySelectorAll<HTMLElement>('.no-scrollbar');
    if (scrollContainers.length > 0) {
      scrollContainers.forEach((container) => {
        container.scrollTo({ top: 0, behavior: 'smooth' });
      });
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <footer id="page-footer" className="w-full bg-slate-900 text-white pt-16 pb-8 px-4 shrink-0">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl font-black tracking-tight text-white">FPTU <span className="text-[#F36F21]">RESMAP</span></span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-6">
              Nền tảng hướng dẫn nghiên cứu khoa học dành riêng cho sinh viên Đại học FPT. 
              Đồng hành cùng bạn trên con đường chinh phục tri thức và sáng tạo.
            </p>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/fptresearchguide" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 rounded-lg hover:bg-[#F36F21] transition-colors"><Facebook size={20} /></a>
              <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-[#F36F21] transition-colors"><Youtube size={20} /></a>
            </div>
          </div>
          
          <div>
          <h4 className="font-bold text-lg mb-6">Liên kết</h4>
          <ul className="space-y-3 text-sm text-slate-400">
            <li>
              <Link to="/home" onClick={handleScrollToTop} className="hover:text-[#F36F21] transition-colors">
                Trang chủ
              </Link>
            </li>
            <li>
              <Link to="/about-us" onClick={handleScrollToTop} className="hover:text-[#F36F21] transition-colors">
                Về chúng tôi
              </Link>
            </li>
          </ul>
        </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Hỗ trợ</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <Link to="/terms" onClick={handleScrollToTop} className="hover:text-[#F36F21] transition-colors">
                  Điều khoản
                </Link>
              </li>
              <li>
                <Link to="/privacy" onClick={handleScrollToTop} className="hover:text-[#F36F21] transition-colors">
                  Bảo mật
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setIsFeedbackOpen(true)}
                  className="hover:text-[#F36F21] transition-colors"
                >
                  Góp ý
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Liên hệ</h4>
          <ul className="space-y-4 text-sm text-slate-400">
            <li className="flex items-center gap-3">
              <Mail size={18} className="shrink-0 text-[#F36F21]" />
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=resmap.researchteam@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-[#F36F21] transition-colors"
              >
                resmap.researchteam@gmail.com
              </a>
            </li>
          </ul>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto pt-8 border-t border-slate-800 text-center text-slate-500 text-xs">
          <p>© 2026 ResMap. All rights reserved.</p>
        </div>
      </footer>
      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
    </>
  );
};

export default Footer;
