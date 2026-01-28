import React from 'react';
import CitationChecker from '../components/tools/CitationChecker';
import Footer from '../components/Footer';

const CitationCheckPage: React.FC = () => {
  return (
    <div className="flex-1 w-full overflow-y-scroll no-scrollbar bg-slate-50 flex flex-col">
      <div className="pt-32 pb-20 px-4 max-w-5xl mx-auto w-full flex-1">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
            APA/IEEE <span className="text-[#F36F21]">Citation Checker</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Dán trích dẫn của bạn để kiểm tra nhanh lỗi format theo APA 7 hoặc IEEE.
            Kết quả hiện tại là kiểm tra mức cơ bản; bạn có thể dùng để rà soát trước khi nộp.
          </p>
        </div>

        <div className="flex justify-center">
          <CitationChecker />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CitationCheckPage;
