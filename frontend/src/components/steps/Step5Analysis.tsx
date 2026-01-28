import React from 'react';
import { PieChart, BarChart3 } from 'lucide-react';
import { ThemeColors } from '../../types';

interface Step5AnalysisProps {
  theme: ThemeColors;
}

const Step5Analysis: React.FC<Step5AnalysisProps> = ({ theme }) => {
  return (
    <>
       <div className="mb-8">
         <h4 className="text-xl font-bold mb-4">Cấu trúc trình bày (IMRaD)</h4>
         <div className="grid grid-cols-2 gap-3">
           {[
             {k: 'Results:', v: 'Trưng bày dữ liệu'},
             {k: 'Discussion:', v: 'Giải thích ý nghĩa'},
             {k: 'Limitations:', v: 'Hạn chế nghiên cứu'},
             {k: 'Future work:', v: 'Hướng mở rộng'}
           ].map((item, i) => (
             <div key={i} className="p-3 bg-white/40 rounded-lg text-sm border border-yellow-800/10">
               <b>{item.k}</b> {item.v}
             </div>
           ))}
         </div>
       </div>
       <div className="bg-white/50 p-6 rounded-2xl mb-8 flex items-center gap-6 shadow-sm border border-yellow-100">
         <PieChart size={48} className="opacity-60" />
         <div>
           <h5 className="font-bold text-lg">Trực quan hóa dữ liệu</h5>
           <p className="text-sm opacity-80">Hướng dẫn sử dụng Tableau và PowerBI để vẽ các biểu đồ chuẩn quốc tế.</p>
         </div>
       </div>
       <button className={`${theme.accent} text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-lg`}>
         <BarChart3 size={20} /> Tải Mẫu Báo cáo Kết quả
       </button>
    </>
  );
};

export default Step5Analysis;
