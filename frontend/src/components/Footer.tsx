import React from 'react';
import { MapPin, Mail, Phone, Facebook, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer id="page-footer" className="w-full bg-slate-900 text-white pt-16 pb-8 px-4 shrink-0">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
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
            <li><a href="#" className="hover:text-[#F36F21] transition-colors">Về chúng tôi</a></li>
            <li><a href="#" className="hover:text-[#F36F21] transition-colors">Thư viện số</a></li>
            <li><a href="#" className="hover:text-[#F36F21] transition-colors">Phòng QLKH</a></li>
            <li><a href="#" className="hover:text-[#F36F21] transition-colors">Biểu mẫu & Quy định</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-6">Liên hệ</h4>
          <ul className="space-y-4 text-sm text-slate-400">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="shrink-0 mt-0.5 text-[#F36F21]" />
              <span>7 Đ. D1, Long Thạnh Mỹ, Thủ Đức, Thành phố Hồ Chí Minh 700000, Việt Nam</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="shrink-0 text-[#F36F21]" />
              <span>resmap.researchteam@gmail.com</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="shrink-0 text-[#F36F21]" />
              <span>024 7300 1866</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto pt-8 border-t border-slate-800 text-center text-slate-500 text-xs">
        <p>© 2024 FPT University. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
