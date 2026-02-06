import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import BackgroundParticles from './ui/BackgroundParticles';

const floatingShapes = [
  { type: 'circle', size: 80, x: 10, y: 15, delay: 0, color: 'bg-orange-200' },
  { type: 'circle', size: 60, x: 85, y: 20, delay: 0.5, color: 'bg-yellow-200' },
  { type: 'circle', size: 40, x: 75, y: 70, delay: 1, color: 'bg-amber-200' },
  { type: 'rect', size: 100, x: 15, y: 75, delay: 1.5, color: 'bg-orange-100' },
  { type: 'circle', size: 50, x: 5, y: 50, delay: 2, color: 'bg-yellow-100' },
  { type: 'rect', size: 70, x: 88, y: 60, delay: 2.5, color: 'bg-amber-100' },
];

const dramaticEntrance = {
  hidden: { opacity: 0, scale: 0.8, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const textVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.7,
      ease: 'easeOut',
    },
  }),
};

const floatAnimation = {
  y: [0, -20, 0],
  transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
};

const floatAnimationSlow = {
  y: [0, -15, 0],
  x: [0, 10, 0],
  transition: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
};

const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
};

const shimmerAnimation = {
  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
  transition: { duration: 3, repeat: Infinity, ease: 'linear' },
};

const TypewriterText: React.FC<{ 
  texts: { text: string; gradient?: boolean; cursorColor?: string }[]; 
  delay?: number;
  speed?: number;
}> = ({ texts, delay = 0, speed = 100 }) => {
  const [displayedTexts, setDisplayedTexts] = useState<{ text: string; complete: boolean }[]>(
    texts.map(t => ({ text: '', complete: false }))
  );

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];
    let globalDelay = delay;

    texts.forEach((item, textIndex) => {
      let charIndex = 0;
      
      const typeChar = () => {
        setActiveIndex(textIndex);
        if (charIndex <= item.text.length) {
          setDisplayedTexts(prev => {
            const newTexts = [...prev];
            newTexts[textIndex] = { 
              text: item.text.slice(0, charIndex), 
              complete: charIndex >= item.text.length 
            };
            return newTexts;
          });
          charIndex++;
          timeouts.push(setTimeout(typeChar, speed));
        }
      };

      timeouts.push(setTimeout(typeChar, globalDelay));
      globalDelay += item.text.length * speed + 200;
    });

    return () => timeouts.forEach(clearTimeout);
  }, [texts, delay, speed]);

  return (
    <span className="inline-flex flex-col items-start">
      {displayedTexts.map((item, idx) => (
        <span key={idx} className={idx > 0 ? "mt-4 relative flex justify-center w-full" : "relative"}>
          {idx > 0 && (
            <span className="absolute inset-0 blur-[100px] bg-gradient-to-b from-[#FF512F] to-[#F09819] opacity-40 rounded-2xl" />
          )}
          <span className={texts[idx].gradient ? "relative text-transparent bg-clip-text bg-gradient-to-b from-[#FF512F] to-[#F09819]" : "text-slate-900"}>
            {item.text}
          </span>
          {idx === activeIndex && !item.complete && (
            <motion.span
              className={`ml-1 w-3 h-full rounded align-middle ${idx === 0 ? 'bg-slate-900' : 'bg-gradient-to-b from-[#FF512F] to-[#F09819]'}`}
              animate={{ opacity: [0, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              style={{ display: 'inline-block', height: '1.2em', width: '0.3em', verticalAlign: 'middle' }}
            />
          )}
        </span>
      ))}
    </span>
  );
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
      <BackgroundParticles count={45} colors={['#F36F21', '#FF8C42', '#F09819', '#CBD5E1']} />

      {floatingShapes.map((shape, idx) => (
        <motion.div
          key={idx}
          className={`absolute ${shape.color} opacity-20 pointer-events-none blur-xl rounded-full`}
          style={{
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            width: shape.size,
            height: shape.size,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ duration: 1, delay: shape.delay }}
        >
          <motion.div
            animate={shape.type === 'circle' ? floatAnimation : floatAnimationSlow}
            transition={{ duration: shape.type === 'circle' ? 6 : 8, repeat: Infinity, ease: 'easeInOut', delay: shape.delay }}
          />
        </motion.div>
      ))}

      <motion.div
        custom={0}
        variants={textVariants}
        initial="hidden"
        animate="visible"
        className="inline-flex items-center justify-center gap-2 px-6 py-2 rounded-full bg-orange-100/50 text-[#F36F21] font-bold text-xs md:text-sm uppercase tracking-wider mb-8 border border-orange-200 shadow-sm"
        whileHover={{ scale: 1.05 }}
      >
        <Sparkles size={16} className="relative top-[-1px]" />
        <motion.span
          className="leading-none pt-[1px]"
          animate={pulseAnimation}
        >
          Dành riêng cho sinh viên FPT University
        </motion.span>
      </motion.div>

      <motion.h1
        custom={1}
        variants={dramaticEntrance}
        initial="hidden"
        animate="visible"
        className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.1] mb-8 tracking-tight text-center"
      >
        <TypewriterText 
          texts={[
            { text: 'Đồng hành cùng sinh viên FPT', gradient: false },
            { text: 'chinh phục NCKH', gradient: true },
          ]}
          speed={100}
        />
      </motion.h1>

      <motion.p
        custom={2}
        variants={dramaticEntrance}
        initial="hidden"
        animate="visible"
        className="text-lg md:text-xl lg:text-2xl text-slate-600 max-w-3xl leading-relaxed mb-12 font-medium text-center"
      >
        Lộ trình được chuẩn hóa cho sinh viên FPT, từ ý tưởng Capstone đến bài báo quốc tế. Giúp bạn tự tin bảo vệ trước Hội đồng.
      </motion.p>

      <motion.div
        custom={3}
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex flex-col md:flex-row items-center justify-center gap-4 mb-20"
      >
        <motion.button
          onClick={onStartClick}
          className="group relative px-8 py-4 bg-[#F36F21] text-white font-bold rounded-2xl shadow-xl shadow-orange-500/30 text-lg flex items-center justify-center gap-3 min-w-[160px] overflow-hidden"
          whileHover={{ scale: 1.05, boxShadow: '0 25px 50px -12px rgba(243, 111, 33, 0.4)' }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.span
            className="text-xl relative z-10"
            whileHover={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.3 }}
          >
            🚀
          </motion.span>
          <span className="relative z-10">Bắt đầu ngay</span>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
        </motion.button>

        <motion.button
          onClick={onLearnMoreClick}
          className="px-8 py-4 bg-white text-slate-700 border border-slate-200 font-bold rounded-2xl text-lg flex items-center justify-center gap-2 min-w-[160px] relative overflow-hidden"
          whileHover={{ scale: 1.02, borderColor: '#94a3b8', boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.1)' }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.span
            whileHover={{ scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            🔍
          </motion.span>
          <span>Tìm hiểu thêm</span>
        </motion.button>

        <motion.button
          type="button"
          onClick={onLearnMoreClick}
          className="flex items-center justify-center w-14 h-14 rounded-full border-2 border-slate-200 bg-white text-slate-500 hover:text-[#F36F21] hover:border-[#F36F21] transition-colors shadow-lg cursor-pointer"
          animate={{ y: [0, 8, 0], boxShadow: ['0 4px 6px -1px rgba(0, 0, 0, 0.1)', '0 10px 15px -3px rgba(0, 0, 0, 0.1)', '0 4px 6px -1px rgba(0, 0, 0, 0.1)'] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          whileHover={{ scale: 1.1, boxShadow: '0 20px 25px -5px rgba(243, 111, 33, 0.2)' }}
          aria-label="Cuộn xuống"
        >
          <span className="text-xl">↓</span>
        </motion.button>
      </motion.div>

      <motion.div
        custom={4}
        variants={dramaticEntrance}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16"
      >
        <motion.div
          className="flex flex-col items-center gap-2 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          <motion.div
            className="p-3 bg-blue-50 rounded-2xl text-blue-600 mb-2"
            whileHover={{ rotate: 10, scale: 1.1 }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </motion.div>
          <motion.span
            className="font-black text-3xl md:text-4xl text-slate-900"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, type: 'spring' }}
          >
            <Counter value={100} />+
          </motion.span>
          <span className="text-sm font-medium text-slate-500 uppercase tracking-wide">Đề tài/Kỳ</span>
        </motion.div>
        <motion.div
          className="flex flex-col items-center gap-2 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          <motion.div
            className="p-3 bg-green-50 rounded-2xl text-green-600 mb-2"
            whileHover={{ rotate: -10, scale: 1.1 }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </motion.div>
          <motion.span
            className="font-black text-3xl md:text-4xl text-slate-900"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, type: 'spring' }}
          >
            Top <Counter value={20} />%
          </motion.span>
          <span className="text-sm font-medium text-slate-500 uppercase tracking-wide">Đăng báo quốc tế</span>
        </motion.div>
        <motion.div
          className="col-span-2 md:col-span-1 flex flex-col items-center gap-2 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          <motion.div
            className="p-3 bg-purple-50 rounded-2xl text-purple-600 mb-2"
            whileHover={{ rotate: 10, scale: 1.1 }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </motion.div>
          <motion.span
            className="font-black text-3xl md:text-4xl text-slate-900"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.4, type: 'spring' }}
          >
            A+
          </motion.span>
          <span className="text-sm font-medium text-slate-500 uppercase tracking-wide">Điểm Capstone</span>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default IntroSection;
