import React from 'react';
import Footer from '../components/Footer';
import TopicGenerator from '../components/tools/TopicGenerator';
import WritingAssistant from '../components/tools/WritingAssistant';

const AiAssistantPage: React.FC = () => {
  return (
    <div className="flex-1 w-full overflow-y-scroll no-scrollbar bg-slate-50 flex flex-col">
      <div className="pt-32 pb-20 px-4 max-w-5xl mx-auto w-full flex-1">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
            AI <span className="text-[#F36F21]">Research Assistant</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Gợi ý đề tài NCKH/Capstone và hỗ trợ tóm tắt/viết lại đoạn văn theo phong cách học thuật.
          </p>
        </div>

        <div className="flex flex-col gap-8">
          <TopicGenerator />
          <WritingAssistant />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AiAssistantPage;
