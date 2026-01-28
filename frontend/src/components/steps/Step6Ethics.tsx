import React from 'react';
import { ShieldCheck, FileCheck, CheckCircle2 } from 'lucide-react';
import { ThemeColors } from '../../types';

interface Step6EthicsProps {
  theme: ThemeColors;
}

const Step6Ethics: React.FC<Step6EthicsProps> = ({ theme }) => {
  return (
    <>
       <div className="bg-red-500/10 p-6 rounded-2xl border border-red-200 mb-8">
         <h4 className="text-xl font-bold mb-3 flex items-center gap-2 text-red-700">
           <ShieldCheck className="w-6 h-6" /> Cảnh báo Đạo văn
         </h4>
         <p className="text-sm opacity-90 font-medium">
           Tại FPTU, tỷ lệ tương đồng (Turnitin) thường yêu cầu dưới 20%. Hãy luôn trích dẫn nguồn ngay cả khi diễn giải (paraphrase).
         </p>
       </div>
       <div className="space-y-4 mb-8">
         <h4 className="text-xl font-bold">Cam kết đạo đức</h4>
         <div className="flex items-start gap-3 opacity-80">
           <ShieldCheck size={20} className="mt-0.5" />
           <p>Bảo mật danh tính người tham gia khảo sát.</p>
         </div>
         <div className="flex items-start gap-3 opacity-80">
           <FileCheck size={20} className="mt-0.5" />
           <p>Minh bạch trong việc khai báo các xung đột lợi ích.</p>
         </div>
       </div>
       <button className={`${theme.accent} text-white w-full px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg`}>
         <CheckCircle2 size={20} /> Hoàn tất & Kiểm tra Turnitin
       </button>
    </>
  );
};

export default Step6Ethics;
