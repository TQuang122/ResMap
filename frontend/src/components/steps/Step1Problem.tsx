import React from 'react';
import { Lightbulb, CheckCircle2, Download, PlayCircle } from 'lucide-react';
import { ThemeColors } from '../../types';

interface Step1ProblemProps {
  theme: ThemeColors;
}

const Step1Problem: React.FC<Step1ProblemProps> = ({ theme }) => {
  return (
    <>
      <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Lightbulb className="w-6 h-6" /> Giải thích chi tiết
      </h4>
      <p className="mb-6 opacity-90 leading-relaxed">
        Một câu hỏi nghiên cứu tốt cần đảm bảo tiêu chí <strong>FINER</strong>: Feasible (Khả thi), Interesting (Thú vị), Novel (Mới mẻ), Ethical (Đạo đức) và Relevant (Liên quan).
      </p>
      <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
        <CheckCircle2 className="w-6 h-6" /> Đầu ra (Output)
      </h4>
      <ul className="space-y-3 mb-8">
        {['Tên đề tài sơ bộ', 'Câu hỏi nghiên cứu chính & các câu hỏi phụ', 'Mục tiêu nghiên cứu (General & Specific)'].map((item, idx) => (
          <li key={idx} className="flex items-center gap-3">
            <span className={`w-2 h-2 rounded-full ${theme.accent}`}></span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-4">
        <button className={`${theme.accent} text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-lg`}>
          <Download size={18} /> Tải Template Đề cương
        </button>
        <button className={`bg-white/50 border border-current px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-white/80 transition-all`}>
          <PlayCircle size={18} /> Video Hướng dẫn
        </button>
      </div>
    </>
  );
};

export default Step1Problem;
