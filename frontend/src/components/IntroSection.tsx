import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import BackgroundParticles from './ui/BackgroundParticles';

interface IntroSectionProps {
  onStartClick: () => void;
  onLearnMoreClick: () => void;
}

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: 'easeOut',
    },
  }),
};

const Counter: React.FC<{ value: number; suffix?: string }> = ({ value, suffix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    const stepTime = duration / steps;

    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{count}{suffix}</span>;
};

const IntroSection: React.FC<IntroSectionProps> = ({ onStartClick, onLearnMoreClick }) => {
  return (
    <section className="min-h-screen w-full flex flex-col items-center justify-center relative bg-gradient-to-b from-slate-50 via-white to-slate-100 px-4 pt-32 overflow-hidden shrink-0">
      <BackgroundParticles count={25} colors={['#F36F21', '#FF8C42', '#F09819', '#CBD5E1']} />

      <motion.div
        custom={0}
        variants={textVariants}
        initial="hidden"
        animate="visible"
        className="inline-flex items-center justify-center gap-2 px-6 py-2 rounded-full bg-orange-100/50 text-[#F36F21] font-bold text-xs md:text-sm uppercase tracking-wider mb-8 border border-orange-200 shadow-sm"
      >
        <Sparkles size={16} className="relative top-[-1px]" />
        <span className="leading-none pt-[1px]">Dành riêng cho sinh viên FPT University</span>
      </motion.div>

      <motion.h1
        custom={1}
        variants={textVariants}
        initial="hidden"
        animate="visible"
        className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.1] mb-8 tracking-tight text-center"
      >
        Đồng hành cùng sinh viên FPT <br className="hidden md:block" />
        <span className="relative inline-block -my-4 mx-2 px-4">
          <span className="absolute inset-0 blur-[100px] bg-gradient-to-b from-[#FF512F] to-[#F09819] opacity-40 rounded-2xl" />
          <span className="relative text-transparent bg-clip-text bg-gradient-to-b from-[#FF512F] to-[#F09819] bg-[length:400%_400%] animate-gradient-normal">
            chinh phục NCKH
          </span>
        </span>
      </motion.h1>

      <motion.p
        custom={2}
        variants={textVariants}
        initial="hidden"
        animate="visible"
        className="text-lg md:text-xl lg:text-2xl text-slate-600 max-w-3xl leading-relaxed mb-12 font-medium text-center"
      >
        Lộ trình được chuẩn hóa cho sinh viên FPT, từ ý tưởng Capstone đến bài báo quốc tế. Giúp bạn tự tin bảo vệ trước Hội đồng.
      </motion.p>

      <motion.div
        custom={3}
        variants={textVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col md:flex-row items-center justify-center gap-4 mb-20"
      >
        <button 
          onClick={onStartClick}
          className="group relative px-8 py-4 bg-[#F36F21] text-white font-bold rounded-2xl shadow-xl shadow-orange-500/30 hover:shadow-2xl hover:bg-orange-600 hover:-translate-y-1 transition-all duration-300 text-lg flex items-center justify-center gap-3 min-w-[160px]"
        >
          <span className="text-xl">🚀</span>
          <span>Bắt đầu ngay</span>
        </button>
        
        <button
          onClick={onLearnMoreClick}
          className="px-8 py-4 bg-white text-slate-700 border border-slate-200 font-bold rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 text-lg flex items-center justify-center gap-2 min-w-[160px]"
        >
          <span>🔍</span>
          <span>Tìm hiểu thêm</span>
        </button>
        
        <motion.button
          type="button"
          onClick={onLearnMoreClick}
          className="flex items-center justify-center w-14 h-14 rounded-full border-2 border-slate-200 bg-white text-slate-500 hover:text-[#F36F21] hover:border-[#F36F21] transition-colors"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          aria-label="Cuộn xuống"
        >
          <span className="text-xl">↓</span>
        </motion.button>
      </motion.div>

      <motion.div
        custom={4}
        variants={textVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16"
      >
        <div className="flex flex-col items-center gap-2">
          <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 mb-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <span className="font-black text-3xl md:text-4xl text-slate-900">
            <Counter value={100} />+
          </span>
          <span className="text-sm font-medium text-slate-500 uppercase tracking-wide">Đề tài/Kỳ</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="p-3 bg-green-50 rounded-2xl text-green-600 mb-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="font-black text-3xl md:text-4xl text-slate-900">
            Top <Counter value={20} />%
          </span>
          <span className="text-sm font-medium text-slate-500 uppercase tracking-wide">Đăng báo quốc tế</span>
        </div>
        <div className="col-span-2 md:col-span-1 flex flex-col items-center gap-2">
          <div className="p-3 bg-purple-50 rounded-2xl text-purple-600 mb-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <span className="font-black text-3xl md:text-4xl text-slate-900">
            A+
          </span>
          <span className="text-sm font-medium text-slate-500 uppercase tracking-wide">Điểm Capstone</span>
        </div>
      </motion.div>
    </section>
  );
};

export default IntroSection;
