import React, { useEffect, memo } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface StepInfo {
  stepNumber: string;
  title: string;
  description: string;
}

interface StepInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  step: StepInfo | null;
}

// Màu accent cho mỗi step
const STEP_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  '01': { bg: 'bg-[#1A2B42]', text: 'text-[#1A2B42]', border: 'border-[#1A2B42]' },
  '02': { bg: 'bg-[#EA580C]', text: 'text-[#EA580C]', border: 'border-[#EA580C]' },
  '03': { bg: 'bg-[#166534]', text: 'text-[#166534]', border: 'border-[#166534]' },
  '04': { bg: 'bg-[#5B21B6]', text: 'text-[#5B21B6]', border: 'border-[#5B21B6]' },
  '05': { bg: 'bg-[#854D0E]', text: 'text-[#854D0E]', border: 'border-[#854D0E]' },
  '06': { bg: 'bg-[#9F1239]', text: 'text-[#9F1239]', border: 'border-[#9F1239]' },
};

const StepInfoModal: React.FC<StepInfoModalProps> = ({ isOpen, onClose, step }) => {
  // ESC key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!step) return null;

  const colors = STEP_COLORS[step.stepNumber] || STEP_COLORS['01'];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden z-10"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="stepinfo-modal-title"
          >
          <motion.div
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden z-10"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 transition-colors z-10"
              aria-label="Đóng"
            >
              <X size={20} className="text-slate-500" />
            </button>

            {/* Content */}
            <div className="p-6 pt-8">
              {/* Step badge */}
              <div className="flex items-center gap-3 mb-5">
                <div className={`h-12 w-12 rounded-full ${colors.bg} flex items-center justify-center`}>
                  <span className="text-white font-black text-lg">{step.stepNumber}</span>
                </div>
                <span className={`text-sm font-bold uppercase tracking-wider ${colors.text}`}>
                  Step
                </span>
              </div>

              {/* Title */}
              <h3 id="stepinfo-modal-title" className={`text-2xl font-black mb-4 leading-tight ${colors.text}`}>
                {step.title}
              </h3>

              {/* Divider */}
              <div className={`w-16 h-1 ${colors.bg} rounded-full mb-5`} />

              {/* Description */}
              <p className="text-slate-600 text-base leading-relaxed">
                {step.description}
              </p>
            </div>

            {/* Footer */}
            <div className={`px-6 py-4 bg-slate-50 border-t border-slate-100`}>
              <p className="text-xs text-slate-400 text-center">
                Chọn khối ngành bên dưới để xem hướng dẫn chi tiết
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const StepInfoModalMemo = memo(StepInfoModal, (prevProps, nextProps) => {
  return (
    prevProps.isOpen === nextProps.isOpen &&
    prevProps.step?.stepNumber === nextProps.step?.stepNumber &&
    prevProps.step?.title === nextProps.step?.title
  );
});

export default StepInfoModalMemo;
