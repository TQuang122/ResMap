import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Lightbulb, Send, User, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = 'hidden';

    if (supabase) {
      supabase.auth.getUser().then(({ data }) => {
        const user = data.user;
        if (!user) return;
        setUserEmail(user.email ?? null);
        setUserName(user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'Người dùng');
      });
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleSend = () => {
    if (!title.trim() || content.trim().length < 10) return;

    const subject = `[ResMap Feedback] ${title.trim()}`;
    const body = `Người gửi: ${userName ?? 'Ẩn danh'} (${userEmail ?? 'Không có email'})\n\nNội dung:\n${content.trim()}`;
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=resmap.researchteam@gmail.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.open(gmailUrl, '_blank');

    setTitle('');
    setContent('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden z-10"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative p-6 pb-2 text-center">
              <button
                onClick={onClose}
                className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                aria-label="Đóng"
              >
                <X size={20} />
              </button>

              <div className="mx-auto w-16 h-16 bg-[#F36F21] rounded-full flex items-center justify-center mb-4 shadow-lg shadow-orange-200">
                <Lightbulb size={32} className="text-white fill-white" />
              </div>

              <h2 className="text-2xl font-bold text-slate-900">Góp ý cho ResMap</h2>
              <p className="text-slate-500 mt-2 text-sm max-w-xs mx-auto">
                Chia sẻ ý kiến để giúp ResMap ngày càng tốt hơn
              </p>
            </div>

            <div className="p-6 pt-2 space-y-5">
              <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-3 border border-slate-100">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold overflow-hidden">
                  {userEmail ? (
                    <span className="text-sm">{userEmail[0].toUpperCase()}</span>
                  ) : (
                    <User size={20} />
                  )}
                </div>
                <div>
                  <div className="font-semibold text-slate-900 text-sm">{userName ?? 'Khách'}</div>
                  <div className="text-xs text-[#F36F21] font-medium">Reader</div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <span className="w-1 h-3 rounded-full bg-[#F36F21]"></span>
                  Tiêu đề
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="VD: Đề xuất thêm tính năng dark mode"
                  maxLength={200}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#F36F21] focus:ring-1 focus:ring-[#F36F21] transition-all"
                />
                <div className="text-right text-[10px] text-slate-400">Tối đa 200 ký tự</div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <span className="w-1 h-3 rounded-full bg-[#F36F21]"></span>
                  Nội dung góp ý
                </label>
                <textarea
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  placeholder="Hãy chia sẻ ý kiến, đề xuất hoặc báo cáo lỗi của bạn..."
                  maxLength={2000}
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#F36F21] focus:ring-1 focus:ring-[#F36F21] transition-all resize-none"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Tối thiểu 10 ký tự</span>
                  <span>{content.length}/2000</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSend}
                  disabled={!title.trim() || content.trim().length < 10}
                  className="flex-1 px-4 py-3 rounded-xl bg-[#F36F21] text-white font-bold text-sm hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-200"
                >
                  <Send size={16} />
                  Gửi góp ý
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default FeedbackModal;
