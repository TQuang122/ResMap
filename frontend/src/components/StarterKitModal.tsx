import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, FileText, Table, Users, ClipboardCheck, ListTodo, ShieldCheck } from 'lucide-react';

interface StarterKitModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    id: number;
    icon: React.ReactNode;
    title: string;
    description: string;
  } | null;
}

const iconMap: Record<string, React.ReactNode> = {
  'Template Đồ án (Capstone)': <FileText size={48} />,
  'Mẫu báo cáo NCKH (ResFes)': <FileText size={48} />,
  'HD trích dẫn APA 7': <Table size={48} />,
  'Tips bảo vệ (Defense)': <ShieldCheck size={48} />,
};

const StarterKitModal: React.FC<StarterKitModalProps> = ({ isOpen, onClose, item }) => {
  if (!item) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full pointer-events-auto overflow-hidden">
              <div className="relative bg-gradient-to-br from-[#F36F21] to-[#FF8C42] p-6 text-white">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <X size={20} />
                </button>
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-white/20 rounded-2xl">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{item.title}</h3>
                    <p className="text-white/80 text-sm">Template chuẩn FPTU</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <p className="text-slate-600 leading-relaxed mb-6">
                  {item.description}
                </p>

                <div className="bg-slate-50 rounded-xl p-4 mb-6">
                  <h4 className="font-bold text-slate-800 text-sm mb-3">Nội dung bao gồm:</h4>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#F36F21]" />
                      Template chuẩn format FPTU
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#F36F21]" />
                      Ví dụ minh họa cụ thể
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#F36F21]" />
                      Checklist đánh giá theo tiêu chí
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#F36F21]" />
                      Hướng dẫn chi tiết từng phần
                    </li>
                  </ul>
                </div>

                <div className="flex gap-3">
                  <button
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#F36F21] text-white font-bold rounded-xl hover:bg-orange-600 transition-colors"
                  >
                    <Download size={18} />
                    Tải về
                  </button>
                  <button
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <FileText size={18} />
                    Xem trước
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default StarterKitModal;
