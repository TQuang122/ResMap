import React, { useEffect } from 'react';

interface MediaResExploreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MediaResExploreModal: React.FC<MediaResExploreModalProps> = ({ isOpen, onClose }) => {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-slideUp">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-sky-50">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Media ResExplore</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Khám phá giảng viên Truyền thông & Media tại FPT University
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-sky-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Hiện tại chưa có thông tin</h3>
          <p className="text-sm text-slate-500">
            Dữ liệu giảng viên Truyền thông & Media đang được cập nhật.<br />
            Vui lòng quay lại sau.
          </p>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
          <p className="text-xs text-slate-500 text-center">
            Liên hệ: resmap@fe.edu.vn để đóng góp dữ liệu
          </p>
        </div>
      </div>
    </div>
  );
};

export default MediaResExploreModal;
