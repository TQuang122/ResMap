import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles, Compass, Zap, ShieldCheck, Rocket, Flame, Clock, FileWarning, HelpCircle } from 'lucide-react';
import Footer from '../components/Footer';
import Logo from '../assets/Logo.png';

const AboutUsPage: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const fadeUp = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    visible: { opacity: 1, y: 0 },
  };

  useEffect(() => {
    const scrollContainers = document.querySelectorAll<HTMLElement>('.no-scrollbar');
    if (scrollContainers.length > 0) {
      scrollContainers.forEach((container) => {
        container.scrollTo({ top: 0, behavior: 'auto' });
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, []);

  return (
    <div className="flex-1 w-full overflow-y-scroll no-scrollbar bg-slate-50 flex flex-col">
      <motion.section
        className="w-full pt-24"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-orange-500 via-orange-400 to-amber-500 text-white shadow-2xl">
            <div className="absolute inset-0 opacity-25">
              <div className="absolute -top-16 -left-20 h-56 w-56 rounded-full bg-white/30 blur-3xl" />
              <div className="absolute bottom-10 right-8 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
            </div>

            <div className="relative px-6 py-12 md:px-10 md:py-16">
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-10">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/20 border border-white/30 px-4 py-1.5 text-xs uppercase tracking-[0.3em]">
                    <Sparkles size={14} />
                    ResMap Crew
                  </div>
                  <h1 className="mt-6 text-4xl md:text-6xl font-black leading-tight">
                    Nghiên cứu khoa học
                    <span className="block">không còn là ác mộng.</span>
                  </h1>
                  <p className="mt-5 text-lg md:text-xl text-white/90 max-w-2xl leading-relaxed">
                    ResMap giúp sinh viên FPT University đi từ ý tưởng đến đề cương, triển khai và hoàn thiện nghiên cứu
                    theo cách nhanh, rõ và đúng chuẩn.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                      to="/starter-kit"
                      className="inline-flex items-center gap-2 rounded-xl bg-white text-slate-900 px-5 py-3 text-sm font-bold hover:bg-slate-50 transition-colors"
                    >
                      <Rocket size={18} />
                      Bắt đầu với Starter Kit
                    </Link>
                    <Link
                      to="/home"
                      className="inline-flex items-center gap-2 rounded-xl border border-white/40 px-5 py-3 text-sm font-semibold hover:bg-white/10 transition-colors"
                    >
                      <Compass size={18} />
                      Khám phá ResMap
                    </Link>
                  </div>
                </div>

                <div className="w-full lg:w-[360px] bg-white/15 border border-white/30 rounded-3xl p-6 backdrop-blur-sm shadow-2xl">
                  <div className="flex items-center gap-3">
                    <img src={Logo} alt="ResMap" className="h-20 w-20 rounded-2xl bg-white/80 p-2" />
                    <div>
                      <div className="text-sm uppercase tracking-[0.3em]">FPTU</div>
                      <div className="text-xl font-black">RESMAP</div>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-white/90 leading-relaxed">
                    Hướng dẫn nghiên cứu khoa học, công cụ học thuật, và cộng đồng chia sẻ kiến thức dành cho Gen Z.
                  </p>
                  <div className="mt-6 space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Zap size={16} />
                      6 bước chuẩn hóa nghiên cứu
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={16} />
                      Bám chuẩn học thuật & đạo đức
                    </div>
                    <div className="flex items-center gap-2">
                      <Flame size={16} />
                      Tối ưu tiến độ, giảm stress
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="max-w-6xl mx-auto px-4 pt-16 w-full"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.08 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-lg p-6 transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
            <div className="h-12 w-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
              <Clock size={22} />
            </div>
            <p className="text-xs uppercase tracking-[0.3em] text-orange-400">Pain Point</p>
            <h3 className="mt-3 text-xl font-bold text-slate-900">Deadline dí sát</h3>
            <p className="mt-2 text-slate-600 text-sm leading-relaxed">
              Không biết bắt đầu từ đâu, loay hoay với đề cương, timeline bị đẩy lùi.
            </p>
          </div>
          <div className="bg-white rounded-3xl border border-slate-100 shadow-lg p-6 transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
            <div className="h-12 w-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-4">
              <FileWarning size={22} />
            </div>
            <p className="text-xs uppercase tracking-[0.3em] text-orange-400">Pain Point</p>
            <h3 className="mt-3 text-xl font-bold text-slate-900">Sai format trích dẫn</h3>
            <p className="mt-2 text-slate-600 text-sm leading-relaxed">
              APA/IEEE cứ sai lên sai xuống, mất thời gian sửa đi sửa lại.
            </p>
          </div>
          <div className="bg-white rounded-3xl border border-slate-100 shadow-lg p-6 transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
            <div className="h-12 w-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
              <HelpCircle size={22} />
            </div>
            <p className="text-xs uppercase tracking-[0.3em] text-orange-400">Pain Point</p>
            <h3 className="mt-3 text-xl font-bold text-slate-900">Thiếu định hướng</h3>
            <p className="mt-2 text-slate-600 text-sm leading-relaxed">
              Không rõ tiêu chí đánh giá, dễ lạc hướng và bỏ cuộc giữa chừng.
            </p>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="max-w-6xl mx-auto px-4 pt-16 pb-12 w-full"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.16 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-orange-400">ResMap Powers</p>
            <h2 className="mt-4 text-3xl md:text-4xl font-black text-slate-900">Chúng mình giải quyết thế nào?</h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              ResMap thiết kế để bạn không phải "tự bơi". Mọi thứ từ đề tài, phương pháp, tiêu chí, đến
              checklist hoàn thiện đều được chuẩn hóa, trực quan và dễ theo dõi.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-md">
              <div className="text-sm font-bold text-slate-900">Guided Steps</div>
              <p className="mt-2 text-sm text-slate-600">Lộ trình 6 bước chi tiết, dễ hiểu, giúp bạn đi đúng hướng.</p>
            </div>
            <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-md">
              <div className="text-sm font-bold text-slate-900">Tools & Templates</div>
              <p className="mt-2 text-sm text-slate-600">Starter Kit và công cụ kiểm tra trích dẫn hỗ trợ làm bài nhanh.</p>
            </div>
            <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-md">
              <div className="text-sm font-bold text-slate-900">Academic Standard</div>
              <p className="mt-2 text-sm text-slate-600">Tuân thủ tiêu chuẩn học thuật, hạn chế rủi ro đạo văn.</p>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="max-w-6xl mx-auto px-4 pb-20 w-full"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.24 }}
      >
        <div className="rounded-[32px] bg-slate-900 text-white px-6 py-10 md:px-10 md:py-12 relative overflow-hidden">
          <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-orange-500/40 blur-2xl" />
          <div className="relative">
            <p className="text-xs uppercase tracking-[0.3em] text-orange-300">Join the Squad</p>
            <h2 className="mt-4 text-3xl md:text-4xl font-black">Tham gia cộng đồng ResMap</h2>
            <p className="mt-3 text-white/80 max-w-2xl">
              Cùng nhau học nhanh hơn, làm nghiên cứu tốt hơn và hỗ trợ nhau vượt deadline.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/home"
                className="inline-flex items-center gap-2 rounded-xl bg-white text-slate-900 px-5 py-3 text-sm font-bold hover:bg-slate-100 transition-colors"
              >
                Bắt đầu ngay
              </Link>
              <Link
                to="/starter-kit"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-5 py-3 text-sm font-semibold hover:bg-white/10 transition-colors"
              >
                Xem Starter Kit
              </Link>
            </div>
          </div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
};

export default AboutUsPage;
