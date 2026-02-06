import React from 'react';
import Footer from '../components/Footer';
import { FULL_STARTER_KIT } from '../data/fullStarterKit';
import { Download, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const floatingIcons = [
  { icon: 'wrench', x: 5, y: 12, size: 40, delay: 0 },
  { icon: 'gear', x: 92, y: 18, size: 36, delay: 0.2 },
  { icon: 'ruler', x: 8, y: 28, size: 38, delay: 0.4 },
  { icon: 'pencil', x: 95, y: 35, size: 34, delay: 0.6 },
  { icon: 'book', x: 3, y: 8, size: 40, delay: 0.8 },
  { icon: 'clipboard', x: 88, y: 25, size: 36, delay: 1 },
  { icon: 'beaker', x: 15, y: 18, size: 38, delay: 1.2 },
  { icon: 'lightbulb', x: 85, y: 12, size: 34, delay: 1.4 },
  { icon: 'microscope', x: 50, y: 8, size: 44, delay: 1.6 },
  { icon: 'atom', x: 48, y: 15, size: 36, delay: 1.8 },
  { icon: 'calculator', x: 25, y: 22, size: 34, delay: 2 },
  { icon: 'search', x: 75, y: 30, size: 38, delay: 2.2 },
  { icon: 'graduation', x: 20, y: 35, size: 40, delay: 2.4 },
  { icon: 'flask', x: 80, y: 22, size: 36, delay: 2.6 },
  { icon: 'dna', x: 12, y: 28, size: 38, delay: 2.8 },
  { icon: 'brain', x: 90, y: 8, size: 40, delay: 3 },
];

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  hover: { y: -8, scale: 1.02, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)', transition: { duration: 0.3, ease: 'easeOut' } }
};

const iconHover = {
  scale: 1.15,
  rotate: [0, -10, 10, 0],
  transition: { duration: 0.4, ease: 'easeOut' }
};

const floatAnimation = {
  y: [0, -15, 0],
  transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
};

const buttonHover = {
  scale: 1.05,
  boxShadow: '0 10px 25px -5px rgba(243, 111, 33, 0.3)',
  transition: { duration: 0.2, ease: 'easeOut' }
};

const IconSvg: React.FC<{ type: string; size: number }> = ({ type, size }) => {
  const className = "text-orange-500";
  
  switch (type) {
    case 'wrench':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
          <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 11-8.84 8.84l-3.77 3.77a1 1 0 01-1.4 0l-1.6-1.6a1 1 0 010-1.4z" />
          <path d="M12 2v6" />
        </svg>
      );
    case 'gear':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 00.33l.34 1.34.34a2 2 0 01-2.83 2.83l-.34-.34a1.65 1.65 0 00-1.34-.33 9 9 0 10-9.8 9.8A1.65 1.65 0 004.6 9a2 2 0 01-2.83-2.83l.34-.34a1.65 1.65 0 00.33-1.34 9 9 0 019.8-9.8z" />
        </svg>
      );
    case 'ruler':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
          <path d="M21 3H3v18h18V3z" />
          <path d="M21 9H3" />
          <path d="M21 13H3" />
          <path d="M21 17H3" />
        </svg>
      );
    case 'pencil':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
          <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
          <path d="M19.4 15a1.65 1.65 0 00.33.12.89.89 0 00.24-.07l.34-.07a2 2 0 002.83-2.83l-.07-.34a.89.89 0 00-.07-.24 1.65 1.65 0 00-.12-.33l-.34-.34 0 00a2 2-2.83-2.83l-.34.07a.89.89 0 00-.24.07 1.65 1.65 0 00-.33.12.89.89 0 00-.07.24 2 2 0 00-2.83 2.83l.07.34a.89.89 0 00.07.24 1.65 1.65 0 00.12.33l.34.34a2 2 0 002.83 2.83l-.07.34a.89.89 0 00-.07.24 1.65 1.65 0 00-.12.33l-.34.34a2 2 0 00-2.83 2.83l-.34-.07a.89.89 0 00-.24-.07 1.65 1.65 0 00-.33-.12.89.89 0 00-.07-.24 2 2 0 00-2.83-2.83l.07-.34a.89.89 0 00-.07-.24 1.65 1.65 0 00-.12-.33l-.34-.34z" />
        </svg>
      );
    case 'book':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
          <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
        </svg>
      );
    case 'clipboard':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
          <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
          <rect x="8" y="2" width="8" height="4" rx="1" />
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
    case 'calculator':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
          <rect x="4" y="2" width="16" height="20" rx="2" />
          <path d="M8 6h8" />
          <path d="M8 10h8" />
          <path d="M8 14h4" />
          <path d="M12 14h4" />
          <path d="M8 18h2" />
          <path d="M12 18h2" />
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
    case 'flask':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
          <path d="M9 3h6l-3 5.5L7 20h10l3-5.5L15 3z" />
          <path d="M9 3h6" />
          <circle cx="15" cy="8" r="2" />
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
    default:
      return null;
  }
};

const StarterKitPage: React.FC = () => {
  const driveUrl = import.meta.env.VITE_STARTER_KIT_DRIVE_URL || 'https://drive.google.com/drive/folders/REPLACE_ME';

  return (
    <motion.div
      className="flex-1 w-full overflow-y-scroll no-scrollbar bg-slate-50 flex flex-col relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Floating Tool Icons Background */}
      {floatingIcons.map((item, idx) => (
        <motion.div
          key={idx}
          className="absolute text-orange-500 pointer-events-none"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            zIndex: 0,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ duration: 0.5, delay: item.delay }}
        >
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: item.delay }}
          >
            <IconSvg type={item.icon} size={item.size} />
          </motion.div>
        </motion.div>
      ))}

      <div className="pt-32 pb-20 px-4 max-w-6xl mx-auto w-full flex-1 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <motion.h1
            className="text-4xl md:text-5xl font-black text-slate-900 mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            Research <span className="text-[#F36F21]">Starter Kit</span>
          </motion.h1>
          <motion.p
            className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Bộ công cụ, biểu mẫu và tài liệu hướng dẫn chuẩn hóa dành cho sinh viên FPT.
            Mỗi mục bên dưới sẽ mở thư mục Google Drive (nơi lưu template/tài liệu).
          </motion.p>
        </motion.div>

        <motion.div
          className="flex justify-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <motion.a
            href={driveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold hover:border-[#F36F21] hover:text-[#F36F21] hover:bg-orange-50 transition-colors"
            whileHover={buttonHover}
            whileTap={{ scale: 0.98 }}
          >
            <ExternalLink size={18} />
            Mở thư mục Google Drive
          </motion.a>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {FULL_STARTER_KIT.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group"
                variants={cardVariants}
                whileHover="hover"
              >
                <motion.div
                  className="h-14 w-14 rounded-2xl bg-orange-50 text-[#F36F21] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                  whileHover={iconHover}
                >
                  <Icon size={28} />
                </motion.div>
                <motion.h3
                  className="text-xl font-bold text-slate-900 mb-3 group-hover:text-[#F36F21] transition-colors"
                  whileHover={{ scale: 1.02, color: '#F36F21' }}
                >
                  {item.title}
                </motion.h3>
                <motion.p
                  className="text-slate-500 text-sm leading-relaxed mb-8 flex-1"
                  initial={{ opacity: 0.7 }}
                  whileHover={{ opacity: 1 }}
                >
                  {item.description}
                </motion.p>
                <motion.a
                  href={item.downloadUrl || driveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl border-2 border-slate-100 text-slate-600 font-bold text-sm hover:border-[#F36F21] hover:text-[#F36F21] hover:bg-orange-50 transition-all flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 237, 213, 0.5)', borderColor: '#F36F21', color: '#F36F21' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Download size={18} />
                  Tải về
                </motion.a>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
      <Footer />
    </motion.div>
  );
};

export default StarterKitPage;
