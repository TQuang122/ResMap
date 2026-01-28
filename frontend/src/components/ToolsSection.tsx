import React from 'react';
import CitationChecker from './tools/CitationChecker';
import { Wrench } from 'lucide-react';

const ToolsSection: React.FC = () => {
  return (
    <section className="py-20 bg-slate-50 w-full shrink-0">
      <div className="max-w-6xl mx-auto px-4 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 font-bold text-xs uppercase tracking-wider mb-6">
          <Wrench size={16} />
          <span>Công cụ hỗ trợ</span>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 text-center">
          Kiểm tra trích dẫn tự động
        </h2>
        
        <p className="text-slate-600 text-center max-w-2xl mb-12">
          Đảm bảo trích dẫn của bạn tuân thủ đúng chuẩn APA 7 hoặc IEEE. Công cụ sử dụng AI để phát hiện lỗi sai cơ bản.
        </p>

        <CitationChecker />
      </div>
    </section>
  );
};

export default ToolsSection;
