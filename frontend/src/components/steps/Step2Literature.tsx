import React from 'react';
import { Search, Database, Download } from 'lucide-react';
import { ThemeColors } from '../../types';

interface Step2LiteratureProps {
  theme: ThemeColors;
}

const Step2Literature: React.FC<Step2LiteratureProps> = ({ theme }) => {
  return (
    <>
      <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
         <Search className="w-6 h-6" /> Nguồn tài liệu uy tín
      </h4>
      <div className="grid grid-cols-2 gap-4 mb-8">
        {['IEEE Xplore', 'ScienceDirect', 'Google Scholar', 'Scopus'].map(src => (
          <div key={src} className="bg-white/60 p-4 rounded-xl font-bold border border-orange-100/50 text-center text-sm shadow-sm">
            {src}
          </div>
        ))}
      </div>
      <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
         <Database className="w-6 h-6" /> Công cụ hỗ trợ
      </h4>
      <p className="mb-8 opacity-90 leading-relaxed">
        Sử dụng Mendeley hoặc Zotero để quản lý hàng trăm bài báo và tự động hóa việc trích dẫn theo chuẩn APA/IEEE.
      </p>
      <button className={`${theme.accent} text-white w-full md:w-auto px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-xl transition-all shadow-lg`}>
        <Download size={20} /> Tải Bảng Tổng hợp LR
      </button>
    </>
  );
};

export default Step2Literature;
