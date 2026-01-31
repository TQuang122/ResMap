import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { FileText } from 'lucide-react';
import Footer from '../components/Footer';

const TermsPage: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const fadeUp = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="flex-1 w-full overflow-y-scroll no-scrollbar bg-slate-50 flex flex-col">
      <motion.section
        className="w-full bg-gradient-to-r from-orange-500 via-orange-400 to-amber-500 text-white"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="max-w-5xl mx-auto px-4 pt-28 pb-16 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 border border-white/30">
            <FileText size={28} />
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4">Điều khoản sử dụng</h1>
          <p className="text-base md:text-lg text-white/90 max-w-3xl mx-auto leading-relaxed">
            Quy định và điều kiện khi sử dụng ResMap - Nền tảng hướng dẫn nghiên cứu khoa học FPT University.
          </p>
          <p className="mt-4 text-sm text-white/80">Cập nhật lần cuối: 31/01/2026</p>
        </div>
      </motion.section>

      <motion.article
        className="px-4 max-w-4xl mx-auto w-full flex-1"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.08 }}
      >
        <div className="-mt-10 rounded-3xl bg-white shadow-xl border border-slate-100 p-6 md:p-8 mb-16">
          <p className="text-slate-600 leading-relaxed mb-10">
            Vui lòng đọc kỹ các điều khoản dưới đây trước khi sử dụng ResMap. Khi truy cập và sử dụng
            nền tảng, bạn đồng ý tuân thủ các điều khoản và chính sách liên quan.
          </p>

          <div className="space-y-10 text-slate-700">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">1. Mục đích nền tảng</h2>
            <p className="leading-relaxed">
              ResMap là nền tảng hỗ trợ sinh viên FPT University trong hành trình nghiên cứu khoa học,
              cung cấp tài nguyên, hướng dẫn, công cụ tra cứu và hỗ trợ học thuật.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">2. Quyền và trách nhiệm người dùng</h2>
            <ul className="list-disc list-inside space-y-2 text-slate-700">
              <li>Không sử dụng ResMap cho mục đích vi phạm pháp luật hoặc đạo đức học thuật.</li>
              <li>Không đăng tải nội dung có bản quyền khi chưa được phép.</li>
              <li>Không sử dụng ResMap để gian lận, đạo văn hoặc thao túng học thuật.</li>
              <li>Bảo vệ thông tin tài khoản và chịu trách nhiệm với hoạt động sử dụng.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">3. Sở hữu trí tuệ</h2>
            <p className="leading-relaxed">
              Nội dung, thiết kế và dữ liệu trên ResMap thuộc quyền sở hữu của FPT University hoặc
              các bên được cấp phép. Người dùng được phép sử dụng cho mục đích học tập và nghiên cứu,
              không được sao chép, phân phối hoặc thương mại hóa khi chưa có sự cho phép.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">4. Dữ liệu và bảo mật</h2>
            <p className="leading-relaxed">
              ResMap cam kết bảo vệ dữ liệu người dùng theo các chính sách bảo mật hiện hành. Việc
              sử dụng nền tảng đồng nghĩa bạn đồng ý với việc thu thập và xử lý dữ liệu phục vụ mục đích
              vận hành và cải thiện trải nghiệm.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">5. Giới hạn trách nhiệm</h2>
            <p className="leading-relaxed">
              ResMap cung cấp nội dung và công cụ ở mức hỗ trợ học thuật. Chúng tôi không chịu trách nhiệm
              về các quyết định học thuật hoặc kết quả nghiên cứu của người dùng nếu có sai sót phát sinh.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">6. Thay đổi điều khoản</h2>
            <p className="leading-relaxed">
              Chúng tôi có quyền cập nhật điều khoản sử dụng để phù hợp với chính sách và nhu cầu vận hành.
              Phiên bản mới sẽ được công bố trên nền tảng và có hiệu lực từ ngày đăng tải.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">7. Liên hệ</h2>
            <p className="leading-relaxed">
              Nếu có thắc mắc về điều khoản, vui lòng liên hệ: 
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=resmap.researchteam@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#F36F21] font-semibold hover:underline"
              >
                resmap.researchteam@gmail.com
              </a>
              .
            </p>
          </section>
          </div>
        </div>
      </motion.article>
      <Footer />
    </div>
  );
};

export default TermsPage;
