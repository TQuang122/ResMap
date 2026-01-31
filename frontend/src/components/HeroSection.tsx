import React, { useState } from 'react';
import { ArrowDown, ChevronRight, Sparkles } from 'lucide-react';
import { TOPICS } from '../data/topics';
import { STEPS_DATA } from '../data/stepsData';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import StepInfoModal from './StepInfoModal';

interface TopicCardProps {
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const TopicCard: React.FC<TopicCardProps> = ({ icon, title, onClick }) => {
  const shouldReduceMotion = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-50, 50], [10, -10]);
  const rotateY = useTransform(mouseX, [-50, 50], [-10, 10]);

  const smoothRotateX = useSpring(rotateX, { stiffness: 420, damping: 24 });
  const smoothRotateY = useSpring(rotateY, { stiffness: 420, damping: 24 });

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group cursor-pointer p-6 md:p-6 lg:p-10 rounded-2xl border border-gray-200 hover:border-[#F36F21] transition-all duration-200 hover:shadow-2xl hover:-translate-y-2 bg-white text-center flex flex-col items-center justify-center gap-4 md:gap-4 h-32 md:h-40 lg:h-48 relative overflow-hidden"
      whileHover={!shouldReduceMotion ? { scale: 1.12 } : undefined}
      transition={{ type: 'spring', stiffness: 520, damping: 18 }}
      whileTap={{ scale: 0.98 }}
      style={!shouldReduceMotion ? {
        rotateX: smoothRotateX,
        rotateY: smoothRotateY,
        transformStyle: 'preserve-3d',
      } : undefined}
    >
      {!shouldReduceMotion && (
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{
            background: `radial-gradient(240px circle at ${mouseX.get() + 120}px ${mouseY.get() + 120}px, rgba(243, 111, 33, 0.18), transparent 60%)`,
          }}
        />
      )}
      <div className="text-[#F36F21] transition-transform group-hover:scale-110 duration-200 relative">
        {icon}
      </div>
      <h3 className="font-bold text-xs md:text-xs lg:text-base text-gray-800 relative">{title}</h3>
    </motion.div>
  );
};

const HeroSection: React.FC<{ selectedTopic: string | null; setSelectedTopic: (topic: string) => void }> = ({ selectedTopic, setSelectedTopic }) => {
  const [selectedStep, setSelectedStep] = useState<{ stepNumber: string; title: string; description: string } | null>(null);

  return (
    <section className="h-auto w-full flex flex-col items-center justify-center pt-32 lg:pt-40 pb-12 px-4 relative bg-white shrink-0">
      {/* Research How-To (Overview) */}
      <div className="max-w-6xl w-full mb-14 lg:mb-16 mt-4 lg:mt-0">
        <motion.div
          className="text-center mb-8 lg:mb-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 text-[#F36F21] font-bold text-xs uppercase tracking-wider mb-5 border border-orange-100">
            <Sparkles size={16} />
            <span>Research How-To</span>
          </div>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-black mb-4 leading-[1.1] text-gray-900">
            Quy trình nghiên cứu{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#FF512F] to-[#F09819] bg-[length:400%_400%] animate-gradient-normal">
              trong 6 bước
            </span>
          </h2>
          <p className="text-gray-500 text-sm md:text-lg font-medium max-w-3xl mx-auto px-4">
            Nắm lộ trình tổng quát trước khi chọn khối ngành. Sau đó, hệ thống sẽ mở hướng dẫn chi tiết theo từng khối.
          </p>
        </motion.div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="overflow-x-auto no-scrollbar">
            <div className="flex gap-4 md:gap-3 pb-2 md:pb-0">
              {STEPS_DATA.map((step) => (
                <div
                  key={step.id}
                  onClick={() => setSelectedStep({ stepNumber: step.stepNumber, title: step.title, description: step.description })}
                  className="min-w-[240px] md:min-w-0 md:flex-1 bg-slate-50 border border-slate-100 rounded-2xl p-5 hover:bg-white hover:shadow-lg hover:border-orange-200 transition-all duration-300 group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-white border border-slate-200 flex items-center justify-center font-black text-xs text-slate-700 group-hover:border-orange-200 group-hover:text-[#F36F21] transition-colors">
                        {step.stepNumber}
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-400 group-hover:text-[#F36F21] transition-colors">
                        Step
                      </span>
                    </div>
                    <ChevronRight size={18} className="text-slate-300 group-hover:text-[#F36F21] transition-colors" />
                  </div>
                  <h3 className="font-black text-base md:text-sm lg:text-base text-slate-900 mb-2 group-hover:text-[#F36F21] transition-colors">
                    {step.title}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Major Group Selection */}
      <motion.div
        className="max-w-5xl w-full text-center mb-12 lg:mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-black mb-6 md:mb-8 lg:mb-10 leading-[1.1] text-gray-900">
          Bạn thuộc khối ngành nào <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#FF512F] to-[#F09819] bg-[length:400%_400%] animate-gradient-normal">
            tại FPTU?
          </span>
        </h1>
        <p className="text-gray-500 text-sm md:text-lg lg:text-xl font-medium px-4">
          Chọn khối ngành để mở hướng dẫn chi tiết theo 6 bước
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8 max-w-6xl w-full"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {TOPICS.map((topic, idx) => (
          <motion.div key={idx} variants={itemVariants}>
            <TopicCard 
              icon={topic.icon} 
              title={topic.title}
              onClick={() => setSelectedTopic(topic.title)}
            />
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className={`w-full flex flex-col items-center gap-3 mt-16 transition-all duration-500 ${selectedTopic ? 'opacity-100 translate-y-0' : 'opacity-60'}`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p className={`text-sm font-bold uppercase tracking-[0.2em] transition-colors duration-300 ${
          selectedTopic ? 'text-[#F36F21]' : 'text-slate-400'
        }`}>
          {selectedTopic ? 'Kéo xuống để xem 6 bước chi tiết' : 'Chọn khối ngành để mở chi tiết'}
        </p>
        <div className={`
          p-3 rounded-full border-2 animate-bounce transition-all duration-300 cursor-pointer
          ${selectedTopic 
            ? 'border-[#F36F21] text-[#F36F21] bg-orange-50 shadow-lg shadow-orange-100' 
            : 'border-slate-200 text-slate-300'
          }
        `}>
          <ArrowDown size={24} strokeWidth={2.5} />
        </div>
      </motion.div>

      {/* Step Info Modal */}
      <StepInfoModal
        isOpen={selectedStep !== null}
        onClose={() => setSelectedStep(null)}
        step={selectedStep}
      />
    </section>
  );
};

export default HeroSection;
