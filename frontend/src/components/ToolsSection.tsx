import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Quote, Search, ArrowRight } from 'lucide-react';

const ToolsSection: React.FC = () => {
  return (
    <section className="py-20 bg-slate-50 w-full shrink-0">
      <div className="max-w-6xl mx-auto px-4 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 font-bold text-xs uppercase tracking-wider mb-6">
          <Wrench size={16} />
          <span>Công cụ hỗ trợ</span>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 text-center">
          Công cụ Nghiên cứu
        </h2>
        
        <p className="text-slate-600 text-center max-w-2xl mb-12">
          Các công cụ miễn phí hỗ trợ sinh viên trong quá trình nghiên cứu và viết bài.
        </p>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          {/* Citation Checker Card */}
          <Link 
            to="/citation-check"
            className="group bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:border-[#F36F21]/30 transition-all duration-300"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-orange-50 text-[#F36F21] group-hover:bg-[#F36F21] group-hover:text-white transition-colors">
                <Quote size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-[#F36F21] transition-colors">
                  APA/IEEE Citation Checker
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  Kiểm tra định dạng trích dẫn theo chuẩn APA 7 hoặc IEEE. Phát hiện lỗi format cơ bản.
                </p>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#F36F21]">
                  Sử dụng ngay <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          </Link>

          {/* Plagiarism Checker Card */}
          <Link 
            to="/plagiarism-check"
            className="group bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:border-[#F36F21]/30 transition-all duration-300"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-orange-50 text-[#F36F21] group-hover:bg-[#F36F21] group-hover:text-white transition-colors">
                <Search size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-[#F36F21] transition-colors">
                  Free Plagiarism Checker
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  Kiểm tra đạo văn miễn phí bằng cách so sánh với nguồn trên Internet (DuckDuckGo + CrossRef).
                </p>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#F36F21]">
                  Sử dụng ngay <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ToolsSection;
