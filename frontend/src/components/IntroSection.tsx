import React from 'react';
import { ArrowRight, Sparkles, GraduationCap, Globe } from 'lucide-react';
import { ThemeColors } from '../types';
import { motion } from 'framer-motion';

interface IntroSectionProps {
  onStartClick: () => void;
  onLearnMoreClick: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const IntroSection: React.FC<IntroSectionProps> = ({ onStartClick, onLearnMoreClick }) => {
  return (
    <section className="min-h-screen w-full flex flex-col items-center justify-center relative bg-gradient-to-b from-slate-50 to-white px-4 pt-32 overflow-hidden shrink-0">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#F36F21]/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] left-[-10%] w-[600px] h-[600px] bg-blue-900/5 rounded-full blur-[120px]" />
      </div>

      <motion.div
        className="max-w-6xl w-full flex flex-col items-center text-center relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <motion.div className="inline-flex items-center justify-center gap-2 px-6 py-2 rounded-full bg-orange-100/50 text-[#F36F21] font-bold text-xs md:text-sm uppercase tracking-wider mb-8 border border-orange-200 shadow-sm" variants={itemVariants}>
          <Sparkles size={16} className="relative top-[-1px]" />
          <span className="leading-none pt-[1px]">Dành riêng cho sinh viên FPT University</span>
        </motion.div>
        
        <motion.h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.1] mb-8 tracking-tight" variants={itemVariants}>
          Đồng hành cùng sinh viên FPT <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#FF512F] to-[#F09819] bg-[length:400%_400%] animate-gradient-normal">
            chinh phục NCKH
          </span>
        </motion.h1>
        
        <motion.p className="text-lg md:text-xl lg:text-2xl text-slate-600 max-w-3xl leading-relaxed mb-12 font-medium" variants={itemVariants}>
          Lộ trình được chuẩn hóa cho sinh viên FPT, từ ý tưởng Capstone đến bài báo quốc tế. Giúp bạn tự tin bảo vệ trước Hội đồng.
        </motion.p>

        <motion.div className="flex flex-col md:flex-row gap-4 w-full md:w-auto" variants={itemVariants}>
          <button 
            onClick={onStartClick}
            className="group relative px-8 py-4 bg-[#F36F21] text-white font-bold rounded-2xl shadow-xl shadow-orange-500/30 hover:shadow-2xl hover:bg-orange-600 hover:-translate-y-1 transition-all duration-300 text-lg flex items-center justify-center gap-3"
          >
            Bắt đầu ngay
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button
            onClick={onLearnMoreClick}
            className="px-8 py-4 bg-white text-slate-700 border border-slate-200 font-bold rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 text-lg flex items-center justify-center gap-2"
          >
            Tìm hiểu thêm
          </button>
        </motion.div>

        {/* Stats / Trust Badges */}
        <motion.div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16 mt-20 pt-10 border-t border-slate-100" variants={itemVariants}>
          <div className="flex flex-col items-center gap-2">
            <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 mb-2">
              <GraduationCap size={24} />
            </div>
            <span className="font-black text-2xl md:text-3xl text-slate-900">100+</span>
            <span className="text-sm font-medium text-slate-500 uppercase tracking-wide">Đề tài/Kỳ</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="p-3 bg-green-50 rounded-2xl text-green-600 mb-2">
              <Globe size={24} />
            </div>
            <span className="font-black text-2xl md:text-3xl text-slate-900">Top 20%</span>
            <span className="text-sm font-medium text-slate-500 uppercase tracking-wide">Đăng báo quốc tế</span>
          </div>
          <div className="col-span-2 md:col-span-1 flex flex-col items-center gap-2">
            <div className="p-3 bg-purple-50 rounded-2xl text-purple-600 mb-2">
              <Sparkles size={24} />
            </div>
            <span className="font-black text-2xl md:text-3xl text-slate-900">A+</span>
            <span className="text-sm font-medium text-slate-500 uppercase tracking-wide">Điểm Capstone</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default IntroSection;
