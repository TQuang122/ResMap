import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, MapPin, RotateCcw, BookOpen, Compass, Edit3 } from 'lucide-react';

const ResearchProcessIntro: React.FC = () => {
  return (
    <motion.section
      className="py-12 px-4 max-w-5xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Main Card */}
      <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl border-2 border-orange-100 p-6 md:p-8 lg:p-10">
        
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-orange-500 flex items-center justify-center flex-shrink-0">
            <RefreshCw className="w-6 h-6 md:w-7 md:h-7 text-white animate-spin-slow" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-gray-900 leading-tight">
              Nghiên cứu là một chu trình lặp
            </h2>
            <p className="text-gray-600 mt-2 text-sm md:text-base">
              Quá trình nghiên cứu không đi theo một đường thẳng, mà giống một chu trình lặp linh hoạt.
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white/60 rounded-2xl p-5 md:p-6 mb-6">
          <p className="text-gray-700 text-sm md:text-base leading-relaxed">
            Bạn sẽ thường xuyên đọc, thử nghiệm, viết, rồi đánh giá lại, và các bước ở sau hoàn toàn có thể 
            dẫn bạn quay lại những bước trước đó. Ví dụ, khi bắt tay triển khai, bạn có thể nhận ra mình cần 
            bổ sung thêm tài liệu, hoặc tinh chỉnh lại câu hỏi nghiên cứu để phù hợp hơn.
          </p>
        </div>

        {/* ResMap Features Grid */}
        <div className="mb-6">
          <p className="text-gray-800 font-bold text-sm md:text-base mb-4">
            ResMap được thiết kế để hỗ trợ cách làm việc này. Chúng mình hi vọng có thể giúp bạn:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {/* Feature 1 */}
            <div className="flex items-start gap-3 bg-white/50 rounded-xl p-4">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <MapPin className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <span className="font-semibold text-gray-900 text-sm md:text-base">Xác định bước hiện tại</span>
                <p className="text-gray-600 text-xs md:text-sm mt-0.5">Biết mình đang ở đâu trong quá trình nghiên cứu</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start gap-3 bg-white/50 rounded-xl p-4">
              <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <RotateCcw className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <span className="font-semibold text-gray-900 text-sm md:text-base">Nhìn thấy các bước liên quan</span>
                <p className="text-gray-600 text-xs md:text-sm mt-0.5">Các bước có thể quay lại hoặc đi tiếp</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start gap-3 bg-white/50 rounded-xl p-4">
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <BookOpen className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <span className="font-semibold text-gray-900 text-sm md:text-base">Dùng cẩm nang đối chiếu</span>
                <p className="text-gray-600 text-xs md:text-sm mt-0.5">Kiểm tra đã làm đủ và đúng trọng tâm chưa</p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex items-start gap-3 bg-white/50 rounded-xl p-4">
              <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Compass className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <span className="font-semibold text-gray-900 text-sm md:text-base">Di chuyển linh hoạt</span>
                <p className="text-gray-600 text-xs md:text-sm mt-0.5">Quay lại khi cần, luôn biết mình đang làm gì</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tool Note */}
        <div className="flex items-start gap-3 bg-gray-900 rounded-2xl p-5 md:p-6 text-white">
          <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center flex-shrink-0">
            <Compass className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <p className="font-bold text-sm md:text-base mb-1">
              Hãy xem ResMap như một công cụ định hướng
            </p>
            <p className="text-gray-300 text-xs md:text-sm leading-relaxed">
              Bạn có thể di chuyển linh hoạt trên bản đồ, quay lại khi cần, và luôn biết mình đang làm gì, 
              và vì sao bước đó quan trọng ở thời điểm hiện tại.
            </p>
          </div>
        </div>

        {/* Customization Note */}
        <div className="mt-6 flex items-center gap-3 text-gray-500 text-xs md:text-sm">
          <Edit3 className="w-4 h-4 flex-shrink-0" />
          <p>
            Cuối cùng, hãy lưu ý rằng hướng dẫn này mang tính tham khảo. Bạn hoàn toàn có thể tùy chỉnh 
            một vài bước để phù hợp với phong cách làm việc của mình nhất.
          </p>
        </div>

      </div>
    </motion.section>
  );
};

export default ResearchProcessIntro;
