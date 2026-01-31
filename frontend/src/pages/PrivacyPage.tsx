import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Shield } from 'lucide-react';
import Footer from '../components/Footer';

const PrivacyPage: React.FC = () => {
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
            <Shield size={28} />
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4">Chính sách bảo mật</h1>
          <p className="text-base md:text-lg text-white/90 max-w-3xl mx-auto leading-relaxed">
            Cam kết bảo vệ thông tin và dữ liệu người dùng tại ResMap.
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
            ResMap tôn trọng quyền riêng tư của người dùng và cam kết bảo vệ dữ liệu cá nhân. Chính sách
            này mô tả cách chúng tôi thu thập, sử dụng và bảo vệ thông tin.
          </p>

          <div className="space-y-10 text-slate-700">
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">1. Thu thập thông tin</h2>
              <p className="leading-relaxed">
                Chúng tôi có thể thu thập thông tin cơ bản như tên, email, khoa/ngành học và nội dung nghiên
                cứu mà bạn cung cấp khi sử dụng nền tảng.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">2. Mục đích sử dụng</h2>
              <p className="leading-relaxed">
                Thông tin được sử dụng để cung cấp dịch vụ, cá nhân hóa trải nghiệm, lưu lịch sử nghiên cứu
                và cải thiện chất lượng nền tảng.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">3. Chia sẻ dữ liệu</h2>
              <p className="leading-relaxed">
                ResMap không chia sẻ thông tin cá nhân với bên thứ ba, trừ khi có yêu cầu pháp lý hoặc
                được sự đồng ý từ người dùng.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">4. Bảo mật dữ liệu</h2>
              <p className="leading-relaxed">
                Chúng tôi áp dụng các biện pháp kỹ thuật và quản trị phù hợp để bảo vệ dữ liệu khỏi truy cập
                trái phép, mất mát hoặc lạm dụng.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">5. Quyền của người dùng</h2>
              <p className="leading-relaxed">
                Bạn có quyền truy cập, chỉnh sửa hoặc yêu cầu xóa dữ liệu cá nhân. Vui lòng liên hệ với
                đội ngũ ResMap để được hỗ trợ.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">6. Cookie và theo dõi</h2>
              <p className="leading-relaxed">
                ResMap có thể sử dụng cookie và công cụ phân tích cơ bản để hiểu hành vi người dùng và
                cải thiện trải nghiệm. Bạn có thể quản lý cookie trong trình duyệt.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">7. Liên hệ</h2>
              <p className="leading-relaxed">
                Nếu có thắc mắc về chính sách bảo mật, vui lòng liên hệ:
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

export default PrivacyPage;
