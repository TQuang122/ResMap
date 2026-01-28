import React from 'react';
import { Copy, ListChecks, Calendar, Download } from 'lucide-react';
import { ThemeColors } from '../../types';

interface Step4PlanningProps {
  theme: ThemeColors;
}

const Step4Planning: React.FC<Step4PlanningProps> = ({ theme }) => {
  return (
    <>
      <div className="bg-white/50 border-l-4 border-purple-700 p-6 rounded-r-xl mb-8 shadow-sm">
        <h4 className="text-xl font-bold mb-2">Giai đoạn thực hiện (Data Collection)</h4>
        <p className="opacity-80">Đây là lúc bạn biến lý thuyết thành hành động. Hãy đảm bảo tính nhất quán trong quá trình thu thập thông tin.</p>
      </div>
      <div className="space-y-4 mb-8">
        {[
          { label: 'Mẫu kịch bản phỏng vấn', icon: <Copy size={18} /> },
          { label: 'Mẫu bảng hỏi khảo sát (Likert scale)', icon: <ListChecks size={18} /> },
          { label: 'Lịch trình Gantt Chart', icon: <Calendar size={18} /> }
        ].map((item, i) => (
          <div key={i} className="flex justify-between items-center p-4 bg-white/60 rounded-xl border border-purple-100 hover:bg-white/80 transition-colors cursor-pointer group">
            <span className="font-bold flex items-center gap-3">{item.icon} {item.label}</span>
            <Download className="text-purple-400 group-hover:text-purple-700 transition-colors" size={20} />
          </div>
        ))}
      </div>
      <button className={`${theme.accent} text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-lg`}>
         <Calendar size={20} /> Tải Kế hoạch Mẫu
      </button>
    </>
  );
};

export default Step4Planning;
