import React from 'react';
import { Download, ArrowDown, ExternalLink } from 'lucide-react';
import { STARTER_KIT_ITEMS } from '../data/starterKit';
import { Link } from 'react-router-dom';

const StarterKitSection: React.FC<{ selectedTopic: string | null }> = ({ selectedTopic }) => {
  return (
    <section className="h-auto w-full bg-gray-50 flex flex-col items-center justify-center shrink-0 relative px-4 md:px-6 lg:px-10 pt-32 pb-16">
      <div className="max-w-[1400px] w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        
        <div className="space-y-6 md:space-y-8">
          <div>
            <span className="inline-block bg-[#FF6B00]/10 text-[#FF6B00] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              Nền tảng vững chắc
            </span>
            <h2 className="text-2xl md:text-4xl lg:text-6xl font-black text-gray-900 leading-tight">
              Research <span className="text-[#FF6B00]">Starter Kit</span>
            </h2>
          </div>
          <p className="text-sm md:text-base lg:text-lg text-gray-600 leading-relaxed">
            Bộ tài liệu chuẩn hóa từ Đại học FPT giúp sinh viên sẵn sàng cho kỳ Capstone Project và các kỳ thi nghiên cứu khoa học.
          </p>
          <Link 
            to="/starter-kit"
            className="bg-[#FF6B00] text-white font-bold h-10 md:h-12 lg:h-14 px-5 md:px-7 lg:px-9 rounded-xl shadow-lg shadow-orange-200 hover:scale-105 hover:bg-orange-600 transition-all flex items-center gap-3 w-fit text-sm lg:text-base"
          >
            <ExternalLink size={24} />
            <span>Xem nội dung chi tiết</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 md:gap-5 lg:gap-6">
            {STARTER_KIT_ITEMS.map((item, idx) => (
                <div key={idx} className="p-5 md:p-7 lg:p-8 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4 md:gap-5 hover:shadow-md transition-shadow">
                    <div className="text-[#FF6B00] bg-orange-50 w-fit p-3 md:p-4 rounded-lg">
                        {item.icon}
                    </div>
                    <p className="font-bold text-gray-800 text-xs md:text-xs lg:text-sm">{item.label}</p>
                </div>
            ))}
        </div>
      </div>

      <div className="w-full text-center mt-12 md:mt-16 hidden md:block">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
          {selectedTopic 
            ? `Bắt đầu 6 bước nghiên cứu ngành "${selectedTopic}"` 
            : "Vui lòng chọn đề tài nghiên cứu để bắt đầu các bước nghiên cứu"}
        </p>
        <div className={`animate-bounce flex justify-center ${selectedTopic ? 'text-gray-300' : 'text-gray-300 opacity-50'}`}>
            <ArrowDown size={20} />
        </div>
      </div>
    </section>
  );
};

export default StarterKitSection;