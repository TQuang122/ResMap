import React from 'react';
import Footer from '../components/Footer';
import { FULL_STARTER_KIT } from '../data/fullStarterKit';
import { Download } from 'lucide-react';

const StarterKitPage: React.FC = () => {
  return (
    <div className="flex-1 w-full overflow-y-scroll no-scrollbar bg-slate-50 flex flex-col">
      <div className="pt-32 pb-20 px-4 max-w-6xl mx-auto w-full flex-1">
        <div className="text-center mb-16">
           <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
            Research <span className="text-[#F36F21]">Starter Kit</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Bộ công cụ, biểu mẫu và tài liệu hướng dẫn chuẩn hóa dành cho sinh viên FPT.
            Tải về và bắt đầu hành trình nghiên cứu của bạn ngay hôm nay.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {FULL_STARTER_KIT.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group">
                <div className="h-14 w-14 rounded-2xl bg-orange-50 text-[#F36F21] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-[#F36F21] transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-1">
                  {item.description}
                </p>
                <button className="w-full py-3 rounded-xl border-2 border-slate-100 text-slate-600 font-bold text-sm hover:border-[#F36F21] hover:text-[#F36F21] hover:bg-orange-50 transition-all flex items-center justify-center gap-2">
                  <Download size={18} />
                  Tải về
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default StarterKitPage;
