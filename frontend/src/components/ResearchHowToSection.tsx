import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, BookOpen, Target, Search, FlaskConical, FileBarChart, Presentation } from 'lucide-react';
import { STEPS_DATA } from '../data/stepsData';

const stepIcons = [
  <Target key="1" size={20} />,
  <Search key="2" size={20} />,
  <FlaskConical key="3" size={20} />,
  <FileBarChart key="4" size={20} />,
  <BookOpen key="5" size={20} />,
  <Presentation key="6" size={20} />,
];

const stepDeliverables = [
  ['Đề tài sơ bộ', 'Câu hỏi nghiên cứu chính', 'Mục tiêu nghiên cứu'],
  ['Danh sách 10-20 bài báo', 'Bảng tổng hợp LR', 'Research Gap xác định'],
  ['Loại nghiên cứu', 'Quần thể & mẫu nghiên cứu', 'Công cụ thu thập dữ liệu'],
  ['Bảng hỏi/Kịch bản', 'Gantt Chart', 'Consent form'],
  ['Kết quả phân tích', 'Tables & Figures', 'Discussion section'],
  ['Turnitin < 20%', 'Slide bảo vệ', 'Hoàn thiện báo cáo'],
];

const floatingIcons = [
  { icon: 'microscope', x: 5, y: 10, size: 40, delay: 0 },
  { icon: 'atom', x: 90, y: 15, size: 36, delay: 0.2 },
  { icon: 'flask', x: 15, y: 70, size: 32, delay: 0.4 },
  { icon: 'book', x: 85, y: 75, size: 38, delay: 0.6 },
  { icon: 'dna', x: 50, y: 5, size: 44, delay: 0.8 },
  { icon: 'brain', x: 8, y: 40, size: 36, delay: 1 },
  { icon: 'search', x: 92, y: 45, size: 32, delay: 1.2 },
  { icon: 'graduation', x: 50, y: 90, size: 40, delay: 1.4 },
  { icon: 'beaker', x: 25, y: 25, size: 28, delay: 1.6 },
  { icon: 'lightbulb', x: 75, y: 30, size: 30, delay: 1.8 },
];

const IconSvg: React.FC<{ type: string; size: number }> = ({ type, size }) => {
  const className = "text-[#F36F21]";
  
  switch (type) {
    case 'microscope':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <line x1="11" y1="8" x2="11" y2="14" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      );
    case 'atom':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
          <circle cx="12" cy="12" r="3" />
          <ellipse cx="12" cy="12" rx="10" ry="4" />
          <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
        </svg>
      );
    case 'flask':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
          <path d="M9 3h6l-3 5.5L7 20h10l3-5.5L15 3z" />
          <path d="M9 3h6" />
          <circle cx="15" cy="8" r="2" />
        </svg>
      );
    case 'book':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
          <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
        </svg>
      );
    case 'dna':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
          <path d="M2 12s3 7 10 7 10-7 10-7-3-7-10-7-10 7-10 7" />
        </svg>
      );
    case 'brain':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
          <path d="M9.5 2A2.5 2.5 0 0112 4.5v15a2.5 2.5 0 01-4.96.44 2.5 2.5 0 01-2.96-3.08 3 3 0 01-.34-5.58 2.5 2.5 0 01-1.32-4.78 2.5 2.5 0 012.46-4.78z" />
          <path d="M14.5 2A2.5 2.5 0 0117 4.5v15a2.5 2.5 0 01-4.96.44 2.5 2.5 0 01-2.96-3.08 3 3 0 01-.34-5.58 2.5 2.5 0 011.32-4.78 2.5 2.5 0 012.46-4.78z" />
        </svg>
      );
    case 'search':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      );
    case 'graduation':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
          <path d="M22 10v6M2 10l10 5 10-5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      );
    case 'beaker':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
          <path d="M4.5 3h15" />
          <path d="M6 3v16a2 2 0 002 2h8a2 2 0 002-2V3" />
          <path d="M6 14h12" />
        </svg>
      );
    case 'lightbulb':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
          <path d="M9 18h6" />
          <path d="M10 22h4" />
          <path d="M12 2v1" />
          <path d="M12 7a5 5 0 00-9 7 5 5 0 009 7z" />
          <path d="M9 12l-2 2" />
          <path d="M15 12l-2-2" />
        </svg>
      );
    default:
      return null;
  }
};

const ResearchHowToSection: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const handleStepClick = (index: number) => {
    setActiveStep(index);
  };

  const handleNext = () => {
    const newCompleted = new Set(completedSteps);
    newCompleted.add(activeStep);
    setCompletedSteps(newCompleted);
    if (activeStep < STEPS_DATA.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handlePrev = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const currentStep = STEPS_DATA[activeStep];

  return (
    <section className="w-full py-16 px-4 bg-gradient-to-b from-slate-50 via-white to-slate-100 shrink-0 relative overflow-hidden">
      {/* Floating Research Icons */}
      {floatingIcons.map((item, idx) => (
        <motion.div
          key={idx}
          className="absolute opacity-20"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ duration: 0.5, delay: item.delay }}
        >
          <motion.div
            animate={{ y: [0, -10, 0 ] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: item.delay }}
          >
            <IconSvg type={item.icon} size={item.size} />
          </motion.div>
        </motion.div>
      ))}

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 text-[#F36F21] font-bold text-xs uppercase tracking-wider mb-5 border border-orange-100">
            <BookOpen size={16} />
            <span>Lộ trình 6 bước</span>
          </div>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-4 leading-[1.1]">
            Quy trình nghiên cứu{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#FF512F] to-[#F09819] bg-[length:400%_400%] animate-gradient-normal">
              hoàn chỉnh
            </span>
          </h2>
          <p className="text-slate-500 font-medium max-w-2xl mx-auto">
            Nắm lộ trình tổng quát trước khi bắt đầu với đề tài của bạn
          </p>
        </motion.div>

        <div className="mb-10">
          <div className="grid grid-cols-6 gap-2">
            {STEPS_DATA.map((step, idx) => (
              <button
                key={step.id}
                type="button"
                onClick={() => handleStepClick(idx)}
                className="relative flex flex-col items-center gap-2"
              >
                <motion.div
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center font-black text-sm
                    ${activeStep === idx
                      ? 'bg-[#F36F21] text-white shadow-lg shadow-orange-500/30'
                      : completedSteps.has(idx)
                      ? 'bg-green-500 text-white'
                      : 'bg-slate-100 text-slate-500'}
                  `}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {completedSteps.has(idx) ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step.stepNumber
                  )}
                </motion.div>
                <span className="text-xs text-slate-500 font-medium hidden sm:block">
                  {idx + 1}
                </span>
              </button>
            ))}
          </div>
          
          <div className="relative h-1 bg-slate-200 rounded-full mt-4 mx-4">
            <motion.div
              className="absolute top-0 left-0 h-full bg-[#F36F21] rounded-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: activeStep / (STEPS_DATA.length - 1) }}
              transition={{ duration: 0.3 }}
              style={{ transformOrigin: 'left' }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-lg"
          >
            <div className="p-6 md:p-8 lg:p-10">
              <div className="flex items-start gap-4 md:gap-6 mb-6">
                <div className="p-3 md:p-4 rounded-2xl bg-[#F36F21] text-white shrink-0">
                  {stepIcons[activeStep]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#F36F21]">
                      Bước {currentStep.stepNumber}
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-black text-slate-900 mb-3">
                    {currentStep.title}
                  </h3>
                  <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                    {currentStep.description}
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6 mt-6">
                <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wide mb-4">
                  Đầu ra cần đạt
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {stepDeliverables[activeStep].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200"
                    >
                      <div className="w-6 h-6 rounded-full bg-orange-100 text-[#F36F21] flex items-center justify-center text-xs font-bold shrink-0">
                        {idx + 1}
                      </div>
                      <span className="text-sm font-medium text-slate-700">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={activeStep === 0}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors
                    ${activeStep === 0
                      ? 'text-slate-300 cursor-not-allowed'
                      : 'text-slate-600 hover:bg-slate-100'}
                  `}
                >
                  <ChevronRight className="rotate-180" size={18} />
                  <span className="hidden sm:inline">Bước trước</span>
                </button>

                <div className="flex items-center gap-2">
                  {STEPS_DATA.map((_, idx) => (
                    <div
                      key={idx}
                      className={`
                        w-2 h-2 rounded-full transition-colors
                        ${idx === activeStep
                          ? 'bg-[#F36F21]'
                          : idx < activeStep
                          ? 'bg-green-500'
                          : 'bg-slate-200'}
                      `}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={activeStep === STEPS_DATA.length - 1}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors
                    ${activeStep === STEPS_DATA.length - 1
                      ? 'text-slate-300 cursor-not-allowed'
                      : 'text-[#F36F21] hover:bg-orange-50'}
                  `}
                >
                  <span className="hidden sm:inline">
                    {activeStep === STEPS_DATA.length - 1 ? 'Hoàn thành' : 'Bước tiếp theo'}
                  </span>
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <button
            type="button"
            onClick={() => navigate('/reshowto')}
            className="group relative inline-flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-[#F36F21] to-[#F09819] text-white font-bold text-lg rounded-2xl shadow-lg shadow-orange-500/40 hover:shadow-2xl hover:shadow-orange-500/50 hover:from-[#FF7A2F] hover:to-[#FFA826] hover:-translate-y-1.5 active:translate-y-0 active:scale-95 transition-all cursor-pointer overflow-hidden"
          >
            {/* Animated shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shine skew-x-12" />
            <span className="relative flex items-center gap-2">
              Bắt đầu nghiên cứu
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default ResearchHowToSection;
