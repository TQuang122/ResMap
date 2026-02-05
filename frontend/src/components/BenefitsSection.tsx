import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const benefits = [
  {
    emoji: '🏆',
    title: 'A+ Capstone',
    subtitle: 'Điểm cao',
    description: 'Đề tài NCKH chất lượng là nền tảng vững chắc để đạt điểm cao trong kỳ đồ án tốt nghiệp.',
  },
  {
    emoji: '📈',
    title: 'Career',
    subtitle: 'Làm đẹp CV',
    description: 'Minh chứng tư duy logic và giải quyết vấn đề - kỹ năng nhà tuyển dụng tìm kiếm.',
  },
  {
    emoji: '📝',
    title: 'APA 7',
    subtitle: 'Template chuẩn',
    description: 'Format và cấu trúc đề cương được chuẩn hóa theo format trường FPTU.',
  },
  {
    emoji: '🎓',
    title: 'ResFes',
    subtitle: 'Template NCKH',
    description: 'Mẫu báo cáo nghiên cứu khoa học sinh viên theo chuẩn quốc tế.',
  },
  {
    emoji: '🤝',
    title: 'Network',
    subtitle: 'Kết nối Mentor',
    description: 'Làm việc trực tiếp với giảng viên đầu ngành, mở rộng network học thuật.',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: 'easeOut',
    },
  }),
};

const BenefitsSection: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full py-20 px-4 bg-gradient-to-b from-slate-50 via-white to-slate-100 shrink-0">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 text-[#F36F21] font-bold text-xs uppercase tracking-wider mb-5 border border-orange-100"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
          >
            <span>✨</span>
            <span>Tại sao ResMap?</span>
          </motion.div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-4 leading-[1.1]">
            Lợi ích khi sử dụng{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#FF512F] to-[#F09819] bg-[length:400%_400%] animate-gradient-normal">
              ResMap
            </span>
          </h2>
          <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">
            Không chỉ là công cụ, đây là bước đệm cho sự nghiệp và học thuật của bạn
          </p>
        </motion.div>

        <div className="relative flex items-center">
          <motion.button
            type="button"
            onClick={scrollLeft}
            className="flex-shrink-0 z-10 w-12 h-12 rounded-full bg-white shadow-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:text-[#F36F21] hover:border-[#F36F21] hover:shadow-xl transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft size={24} />
          </motion.button>

          <div
            ref={scrollRef}
            className="flex-1 flex gap-4 overflow-x-auto pb-8 snap-x snap-mandatory no-scrollbar"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {benefits.map((benefit, idx) => (
              <motion.div
                key={idx}
                custom={idx}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className="snap-center shrink-0 w-[280px] md:w-[300px]"
              >
                <motion.div
                  className="h-full bg-white rounded-3xl border border-slate-200 p-6 hover:shadow-xl transition-all duration-300 group cursor-pointer relative overflow-hidden"
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 rounded-3xl p-[1px] bg-gradient-to-r from-[#F36F21] via-[#FF8C42] to-[#F09819]" style={{ mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', maskComposite: 'exclude' }} />
                  </div>

                  <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <span className="text-4xl">{benefit.emoji}</span>
                  </div>

                  <h3 className="text-xl font-black text-slate-900 mb-1">
                    {benefit.title}
                  </h3>
                  <p className="text-sm font-bold text-[#F36F21] mb-3">
                    {benefit.subtitle}
                  </p>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>

          <motion.button
            type="button"
            onClick={scrollRight}
            className="flex-shrink-0 z-10 w-12 h-12 rounded-full bg-white shadow-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:text-[#F36F21] hover:border-[#F36F21] hover:shadow-xl transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronRight size={24} />
          </motion.button>
        </div>

        <motion.div
          className="flex justify-center gap-2 mt-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          {benefits.map((_, idx) => (
            <motion.div
              key={idx}
              className="w-2 h-2 rounded-full bg-slate-300"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: idx * 0.2 }}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default BenefitsSection;
