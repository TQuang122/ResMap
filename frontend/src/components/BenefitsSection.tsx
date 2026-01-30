import React from 'react';
import { Award, TrendingUp, BookOpen, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const BenefitsSection: React.FC = () => {
  const benefits = [
    {
      icon: <Award className="w-8 h-8 text-[#FF6B00]" />,
      title: "Điểm cộng Capstone",
      description: "Đề tài nghiên cứu tốt là nền tảng vững chắc để đạt điểm A trong kỳ đồ án tốt nghiệp."
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-blue-600" />,
      title: "Làm đẹp CV & Hồ sơ",
      description: "Minh chứng cho khả năng tư duy logic và giải quyết vấn đề - kỹ năng mọi nhà tuyển dụng tìm kiếm."
    },
    {
      icon: <BookOpen className="w-8 h-8 text-green-600" />,
      title: "Cơ hội Học bổng",
      description: "Mở rộng cơ hội du học thạc sĩ, tiến sĩ với các bài báo được công bố trên tạp chí uy tín."
    },
    {
      icon: <Users className="w-8 h-8 text-purple-600" />,
      title: "Kết nối Mentor xịn",
      description: "Làm việc trực tiếp với các giảng viên đầu ngành và mở rộng Network học thuật."
    }
  ];

  return (
    <section className="w-full py-24 px-4 bg-white shrink-0">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
            Tại sao sinh viên nên làm nghiên cứu?
          </h2>
          <p className="text-lg text-slate-500 font-medium">
            Không chỉ là điểm số, đó là bước đệm cho sự nghiệp tương lai
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {benefits.map((item, idx) => (
            <motion.div
              key={idx}
              className="p-6 md:p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-[#FF6B00]/30 hover:bg-[#FF6B00]/5 hover:shadow-lg transition-all duration-300 group"
              variants={itemVariants}
            >
              <div className="mb-4 p-3 bg-white rounded-xl w-fit shadow-sm group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>
              <h3 className="font-bold text-xl text-slate-900 mb-3">{item.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default BenefitsSection;
