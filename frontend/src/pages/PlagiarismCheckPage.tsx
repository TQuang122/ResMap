import React from 'react';
import PlagiarismChecker from '../components/tools/PlagiarismChecker';
import Footer from '../components/Footer';

const PlagiarismCheckPage: React.FC = () => {
  return (
    <div className="flex-1 w-full overflow-y-scroll no-scrollbar bg-slate-50 flex flex-col">
      <div className="pt-32 pb-20 px-4 max-w-5xl mx-auto w-full flex-1">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
            Free <span className="text-[#F36F21]">Plagiarism Checker</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Kiểm tra nhanh mức độ trùng lặp nội dung với các nguồn trên Internet.
            Công cụ này sử dụng DuckDuckGo và CrossRef để tìm kiếm và so sánh văn bản.
          </p>
          <p className="text-sm text-slate-500 mt-4">
            Lưu ý: Đây là công cụ hỗ trợ, không thay thế hoàn toàn Turnitin hoặc các phần mềm chuyên nghiệp.
          </p>
        </div>

        <div className="flex justify-center">
          <PlagiarismChecker />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PlagiarismCheckPage;
