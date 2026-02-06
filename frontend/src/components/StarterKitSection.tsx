import React, { useState } from 'react';
import { Download, ArrowRight, FileText } from 'lucide-react';
import { STARTER_KIT_ITEMS } from '../data/starterKit';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import StarterKitModal from './StarterKitModal';

interface StarterKitItemData {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const starterKitDetails: Record<number, { title: string; description: string }> = {
  0: {
    title: 'Template Đồ án (Capstone)',
    description: 'Template chuẩn cấu trúc đồ án tốt nghiệp FPTU, bao gồm: Đề cương nghiên cứu, Báo cáo tiến độ, và Bài báo khoa học. Được thiết kế theo format chuẩn của trường với đầy đủ các mục: Tóm tắt, Giới thiệu, Phương pháp, Kết quả, Thảo luận, và Kết luận.',
  },
  1: {
    title: 'Mẫu báo cáo NCKH (ResFes)',
    description: 'Template chuẩn cho bài báo nghiên cứu sinh viên (ResFes), bao gồm cấu trúc abstract, keyword, introduction, methodology, results, và references theo chuẩn quốc tế.',
  },
  2: {
    title: 'Hướng dẫn trích dẫn APA 7',
    description: 'Tài liệu hướng dẫn chi tiết cách trích dẫn theo chuẩn APA 7, bao gồm: Trích dẫn trong văn bản (in-text citation), danh sách tài liệu tham khảo (reference list), và các ví dụ cụ thể cho từng loại nguồn.',
  },
  3: {
    title: 'Tips bảo vệ (Defense)',
    description: 'Checklist và hướng dẫn chuẩn bị bảo vệ đồ án trước Hội đồng, bao gồm: Các câu hỏi thường gặp, cách trả lời, và mẫu slide trình bày.',
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.5,
      ease: 'easeOut',
    },
  }),
};

const StarterKitSection: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<StarterKitItemData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePreviewClick = (index: number) => {
    const item = STARTER_KIT_ITEMS[index];
    const detail = starterKitDetails[index];
    setSelectedItem({
      id: index,
      icon: item.icon,
      title: detail.title,
      description: detail.description,
    });
    setIsModalOpen(true);
  };

  return (
    <>
      <section className="h-auto w-full bg-gradient-to-b from-slate-50 via-white to-slate-100 flex flex-col items-center justify-center shrink-0 relative px-4 md:px-6 lg:px-10 pt-20 pb-16 overflow-hidden">
        {/* Neural Network Background */}
        <div className="absolute inset-0 opacity-8">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="neural" width="80" height="80" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="3" fill="#F36F21" opacity="0.6"/>
                <circle cx="40" cy="30" r="2" fill="#F36F21" opacity="0.4"/>
                <circle cx="70" cy="15" r="2.5" fill="#F36F21" opacity="0.5"/>
                <circle cx="20" cy="50" r="2" fill="#F36F21" opacity="0.3"/>
                <circle cx="55" cy="55" r="3" fill="#F36F21" opacity="0.5"/>
                <circle cx="75" cy="60" r="2" fill="#F36F21" opacity="0.4"/>
                <circle cx="5" cy="75" r="2.5" fill="#F36F21" opacity="0.5"/>
                <circle cx="35" cy="70" r="2" fill="#F36F21" opacity="0.3"/>
                <circle cx="65" cy="80" r="3" fill="#F36F21" opacity="0.6"/>
                {/* Connections */}
                <line x1="10" y1="10" x2="40" y2="30" stroke="#F36F21" strokeWidth="0.5" opacity="0.3"/>
                <line x1="40" y1="30" x2="70" y2="15" stroke="#F36F21" strokeWidth="0.5" opacity="0.3"/>
                <line x1="10" y1="10" x2="20" y2="50" stroke="#F36F21" strokeWidth="0.5" opacity="0.2"/>
                <line x1="20" y1="50" x2="55" y2="55" stroke="#F36F21" strokeWidth="0.5" opacity="0.3"/>
                <line x1="55" y1="55" x2="75" y2="60" stroke="#F36F21" strokeWidth="0.5" opacity="0.3"/>
                <line x1="20" y1="50" x2="5" y2="75" stroke="#F36F21" strokeWidth="0.5" opacity="0.2"/>
                <line x1="5" y1="75" x2="35" y2="70" stroke="#F36F21" strokeWidth="0.5" opacity="0.3"/>
                <line x1="35" y1="70" x2="65" y2="80" stroke="#F36F21" strokeWidth="0.5" opacity="0.3"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#neural)"/>
          </svg>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-white/60" />

        <div className="max-w-[1400px] w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch relative z-10">

          <motion.div
            className="lg:col-span-5 relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#F36F21] to-[#FF8C42] p-8 md:p-10 flex flex-col justify-between min-h-[320px] lg:min-h-auto"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="relative z-10">
              <motion.div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider mb-6"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <span>Nền tảng vững chắc</span>
              </motion.div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
                Research <br />
                <span className="text-white/90">Starter Kit</span>
              </h2>
              <p className="text-white/90 text-sm md:text-base leading-relaxed max-w-md">
                Bộ tài liệu chuẩn hóa từ Đại học FPT, sẵn sàng cho kỳ Capstone và nghiên cứu khoa học.
              </p>
            </div>

            <div className="relative z-10 mt-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/starter-kit"
                  className="inline-flex items-center gap-2 bg-white text-[#F36F21] font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all w-fit"
                >
                  <span>Xem tất cả</span>
                  <ArrowRight size={18} />
                </Link>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
          >
            {STARTER_KIT_ITEMS.slice(0, 4).map((item, idx) => (
              <motion.div
                key={idx}
                custom={idx}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-5 md:p-6 hover:border-[#F36F21]/30 hover:shadow-xl transition-all duration-300"
                whileHover={{ y: -4 }}
              >
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-r from-[#F36F21] to-[#FF8C42]" style={{ mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', maskComposite: 'exclude' }} />
                </div>

                <div className="flex items-start justify-between mb-4 relative z-10">
                  <div className="p-2.5 rounded-xl bg-slate-50 text-[#F36F21] group-hover:bg-[#F36F21] group-hover:text-white transition-colors">
                    {item.icon}
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => handlePreviewClick(idx)}
                      className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-500 hover:text-white transition-colors cursor-pointer"
                      aria-label="Xem chi tiết"
                    >
                      <FileText size={16} />
                    </button>
                    <button
                      type="button"
                      className="p-2 rounded-lg bg-slate-50 text-slate-500 hover:bg-[#F36F21] hover:text-white transition-colors cursor-pointer"
                      aria-label="Tải về"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                </div>

                <p className="font-bold text-slate-800 text-sm md:text-base relative z-10">{item.label}</p>
                <p className="text-xs text-slate-500 mt-1 relative z-10">Template chuẩn FPTU</p>
              </motion.div>
            ))}

            <motion.div
              custom={4}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Link
                to="/starter-kit"
                className="group relative overflow-hidden rounded-2xl bg-slate-50 border border-dashed border-slate-300 p-5 md:p-6 flex flex-col items-center justify-center text-center hover:border-[#F36F21] hover:bg-[#F36F21]/5 transition-all duration-300 h-full min-h-[140px]"
              >
                <div className="p-3 rounded-xl bg-white shadow-sm text-[#F36F21] mb-3 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                  <ArrowRight size={24} />
                </div>
                <p className="font-bold text-slate-700 text-sm">Xem thêm</p>
                <p className="text-xs text-slate-500 mt-1">+{STARTER_KIT_ITEMS.length - 4} tài liệu khác</p>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="w-full text-center mt-12 md:mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
            Sẵn sàng cho hành trình nghiên cứu của bạn
          </p>
          <motion.div
            className="animate-bounce flex justify-center text-slate-300"
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ArrowRight size={20} className="rotate-90" />
          </motion.div>
        </motion.div>
      </section>

      <StarterKitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={selectedItem}
      />
    </>
  );
};

export default StarterKitSection;
