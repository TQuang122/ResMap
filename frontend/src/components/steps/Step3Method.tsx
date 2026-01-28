import React from 'react';
import { ScrollText, CheckSquare, Download } from 'lucide-react';
import { ThemeColors } from '../../types';

interface Step3MethodProps {
  theme: ThemeColors;
}

const Step3Method: React.FC<Step3MethodProps> = ({ theme }) => {
  return (
    <>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
         <div className="border border-green-800/20 rounded-2xl p-5 bg-white/40 shadow-sm">
           <h5 className="font-black text-lg mb-2">Định lượng</h5>
           <p className="text-sm opacity-80 italic">Số liệu, thống kê, khảo sát diện rộng, thí nghiệm.</p>
         </div>
         <div className="border border-green-800/20 rounded-2xl p-5 bg-white/40 shadow-sm">
           <h5 className="font-black text-lg mb-2">Định tính</h5>
           <p className="text-sm opacity-80 italic">Phỏng vấn sâu, quan sát, nghiên cứu tình huống (Case study).</p>
         </div>
       </div>
       <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
         <ScrollText className="w-6 h-6" /> Checklist Phương pháp
       </h4>
       <ul className="space-y-3 mb-8">
         <li className="flex items-start gap-3">
           <CheckSquare className="w-5 h-5 mt-0.5" />
           <span>Xác định quần thể và mẫu nghiên cứu (Sampling)</span>
         </li>
         <li className="flex items-start gap-3">
           <CheckSquare className="w-5 h-5 mt-0.5" />
           <span>Lựa chọn công cụ phân tích (SPSS, AMOS, Python, NVivo)</span>
         </li>
       </ul>
       <button className={`${theme.accent} text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-lg`}>
         <Download size={20} /> Tải Template Chương 3
       </button>
    </>
  );
};

export default Step3Method;
