import React, { useEffect, memo } from 'react';
import { X, Brain, AlertTriangle, CheckCircle, CircleSlash, FileText, ArrowRight } from 'lucide-react';

interface AiUsageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AiUsageModal: React.FC<AiUsageModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const steps = [
    {
      step: 'Bước 1',
      title: 'Chọn đề tài',
      goodFor: [
        'Tìm kiếm ý tưởng mới',
        'Mở rộng phạm vi nghiên cứu',
        'Brainstorm keywords mới',
        'Xác định research gap'
      ],
      badFor: [
        'Xác định đề tài cuối cùng',
        'Đánh giá tính khả thi',
        'Thay thế hoàn toàn tư duy phản biện'
      ],
      risks: 'Thiên kiến xác nhận - AI có thể tạo ra kết quả phù hợp với ý kiến ban đầu của bạn.'
    },
    {
      step: 'Bước 2',
      title: 'Viết đề cương',
      goodFor: [
        'Tạo outline từ template',
        'Phát triển các section phụ',
        'Cải thiện cấu trúc luận văn',
        'Đề xuất các heading phụ'
      ],
      badFor: [
        'Thay thế hoàn toàn đề cương của bạn',
        'Quyết định các chapter chính',
        'Xác định methodology chính'
      ],
      risks: 'Over-reliance - Phụ thuộc quá mức vào AI có thể làm giảm khả năng tư duy độc lập.'
    },
    {
      step: 'Bước 3',
      title: 'Viết literature review',
      goodFor: [
        'Tổng hợp tài liệu từ nhiều nguồn',
        'Tạo draft summary cho các paper',
        'Paraphrase nội dung hiệu quả',
        'Tìm kiếm related works'
      ],
      badFor: [
        'Thay thế hoàn toàn việc đọc paper gốc',
        'Citation và trích dẫn chính xác',
        'Đánh giá chất lượng nghiên cứu'
      ],
      risks: 'Hallucination - AI có thể tạo ra tài liệu hoặc citation không tồn tại.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />

      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden animate-slideUp flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">AI Use in Research</h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Hướng dẫn sử dụng AI hiệu quả trong nghiên cứu
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-800">Lưu ý quan trọng</h4>
                <p className="text-sm text-amber-700 mt-1">
                  AI là công cụ hỗ trợ, không thay thế hoàn toàn tư duy phản biện và nghiên cứu gốc của bạn.
                  Luôn verify thông tin từ nguồn chính thức.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {steps.map((item, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className={`px-4 py-3 ${item.step.includes('1') ? 'bg-orange-50' : item.step.includes('2') ? 'bg-blue-50' : 'bg-green-50'} border-b border-slate-100`}>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      item.step.includes('1') ? 'bg-orange-500 text-white' : 
                      item.step.includes('2') ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'
                    }`}>
                      {item.step}
                    </span>
                    <span className="font-semibold text-slate-800">{item.title}</span>
                  </div>
                </div>
                
                <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Good For */}
                  <div>
                    <h5 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Nên dùng AI để
                    </h5>
                    <div className="space-y-2">
                      {item.goodFor.map((point, pIdx) => (
                        <div key={pIdx} className="text-sm text-slate-600 flex items-start gap-2">
                          <ArrowRight className="w-4 h-4 text-green-500 shrink-0 mt-0.5 flex-shrink-0" />
                          {point}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bad For */}
                  <div>
                    <h5 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                      <CircleSlash className="w-4 h-4" />
                      Không nên dùng AI để
                    </h5>
                    <div className="space-y-2">
                      {item.badFor.map((point, pIdx) => (
                        <div key={pIdx} className="text-sm text-slate-600 flex items-start gap-2">
                          <ArrowRight className="w-4 h-4 text-red-500 shrink-0 mt-0.5 flex-shrink-0" />
                          {point}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Risks */}
                  <div>
                    <h5 className="font-semibold text-amber-700 mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Rủi ro cần tránh
                    </h5>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {item.risks}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-slate-100 rounded-xl p-4">
            <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Nguyên tắc vàng
            </h4>
            <p className="text-sm text-slate-600">
              Luôn <strong>review</strong> và <strong>edit</strong> output của AI. 
              AI giúp bạn nhanh hơn, nhưng quyết định cuối cùng luôn thuộc về bạn.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50">
          <p className="text-xs text-slate-500 text-center">
            Tham khảo: Hướng dẫn sử dụng AI có trách nhiệm trong học thuật • 2026
          </p>
        </div>
      </div>
    </div>
  );
};

const AiUsageModalMemo = memo(AiUsageModal, (prevProps, nextProps) => {
  return prevProps.isOpen === nextProps.isOpen;
});

export default AiUsageModalMemo;
