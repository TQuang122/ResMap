import React, { useState, useEffect, memo } from 'react';
import { Sparkles, Loader2, X, Save, CheckCircle, BookOpen, Lightbulb, ArrowRight } from 'lucide-react';
import { postData } from '../../utils/api';
import { supabase } from '../../lib/supabase';
import { logHistory } from '../../utils/logger';
import { useResearch } from '../../context/ResearchContext';
import { useNavigate } from 'react-router-dom';

interface TopicSuggestion {
  title: string;
  description: string;
  difficulty: string;
}

interface ResearchSuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ResearchSuggestionModal: React.FC<ResearchSuggestionModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [major, setMajor] = useState('');
  const [keywords, setKeywords] = useState('');
  const [loading, setLoading] = useState(false);
  const [topics, setTopics] = useState<TopicSuggestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [savedIds, setSavedIds] = useState<Record<string, boolean>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { setTopic, topic: currentTopic } = useResearch();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setTopics([]);
      setMajor('');
      setKeywords('');
      setError(null);
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

  const handleGenerate = async () => {
    if (!major.trim()) return;
    setLoading(true);
    setError(null);
    setTopics([]);

    try {
      const res = await postData('/chat/suggest', {
        major,
        keywords: keywords.trim() || null,
      });
      setTopics(res.topics || []);
      await logHistory({
        tool: 'topic',
        request: { major, keywords: keywords.trim() || null },
        response: { topics: res.topics || [] },
      });
    } catch (e: any) {
      console.error(e);
      if (e.message?.includes('401') || e.message?.includes('Unauthorized') || e.message?.includes('Missing or invalid authorization')) {
        setShowLoginPrompt(true);
        setError('Vui lòng đăng nhập để sử dụng tính năng gợi ý đề tài.');
      } else {
        setError('Không thể tạo gợi ý lúc này. Vui lòng thử lại sau.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (topic: TopicSuggestion) => {
    if (!supabase) {
      setError('Supabase chưa được cấu hình.');
      return;
    }
    if (savingId === topic.title) return;

    setSavingId(topic.title);
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user.id;
    if (!userId) {
      setError('Bạn cần đăng nhập để lưu đề tài.');
      setSavingId(null);
      return;
    }

    const { error: saveError } = await supabase.from('saved_topics').insert({
      user_id: userId,
      title: topic.title,
      description: topic.description,
      difficulty: topic.difficulty,
    });

    if (saveError) {
      setError('Không thể lưu đề tài. Vui lòng thử lại.');
      setSavingId(null);
      return;
    }

    setSavedIds((prev) => ({ ...prev, [topic.title]: true }));
    setSavingId(null);
  };

  const handleSelectTopic = (topic: TopicSuggestion) => {
    setTopic({
      title: topic.title,
      description: topic.description
    });
    // Optional: close modal or show success feedback
    // onClose(); 
  };

  const filteredTopics = topics.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const difficultyClass = (d: string) => {
    const v = d.toLowerCase();
    if (v.includes('hard') || v.includes('khó')) return 'bg-red-100 text-red-700 border-red-200';
    if (v.includes('medium') || v.includes('trung bình')) return 'bg-orange-100 text-orange-700 border-orange-200';
    return 'bg-green-100 text-green-700 border-green-200';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />

      <div className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden animate-slideUp flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Research Suggestion</h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Gợi ý đề tài nghiên cứu dựa trên AI
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

        <div className="flex-1 overflow-hidden flex">
          <div className="w-full p-6 overflow-y-auto bg-slate-50">
            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-orange-500" />
                Tạo gợi ý đề tài mới
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Chuyên ngành <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                    placeholder="VD: Kỹ thuật phần mềm, Digital Marketing, AI..."
                    className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Từ khóa / Sở thích (tuỳ chọn)
                  </label>
                  <input
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="VD: chatbot, ESG, recommender, TikTok..."
                    className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm"
                  />
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading || !major.trim()}
                className="px-6 py-2.5 bg-gradient-to-r from-[#F36F21] to-orange-600 text-white font-bold rounded-lg hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg shadow-orange-500/20"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang tạo...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Tạo 5 đề tài gợi ý
                  </>
                )}
              </button>

              {error && (
                <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 text-sm">
                  {error}
                  {showLoginPrompt && (
                    <button
                      onClick={() => navigate('/auth')}
                      className="mt-3 px-4 py-2 bg-[#F36F21] text-white font-bold rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      Đăng nhập ngay
                    </button>
                  )}
                </div>
              )}
            </div>

            {topics.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-orange-500" />
                    Kết quả ({filteredTopics.length})
                  </h3>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Tìm kiếm..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500 w-48"
                    />
                    <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredTopics.map((t, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:shadow-md transition-all">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-900">{t.title}</h4>
                          <p className="text-sm text-slate-600 mt-2 leading-relaxed">{t.description}</p>
                        </div>
                        <span className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-full border ${difficultyClass(t.difficulty)}`}>
                          {t.difficulty}
                        </span>
                      </div>
                      <div className="mt-4 flex items-center gap-2">
                        <button
                          onClick={() => handleSelectTopic(t)}
                          className={`
                            inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors
                            ${currentTopic?.title === t.title 
                              ? 'bg-green-100 border-green-200 text-green-700' 
                              : 'border-blue-200 text-blue-600 hover:bg-blue-50'}
                          `}
                        >
                          {currentTopic?.title === t.title ? (
                            <>
                              <CheckCircle className="w-3.5 h-3.5" />
                              Đang chọn
                            </>
                          ) : (
                            <>
                              <ArrowRight className="w-3.5 h-3.5" />
                              Chọn đề tài này
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleSave(t)}
                          disabled={savingId === t.title || savedIds[t.title]}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border border-orange-200 text-orange-600 hover:bg-orange-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                        >
                          {savedIds[t.title] ? (
                            <>
                              <CheckCircle className="w-3.5 h-3.5" />
                              Đã lưu
                            </>
                          ) : savingId === t.title ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              Đang lưu...
                            </>
                          ) : (
                            <>
                              <Save className="w-3.5 h-3.5" />
                              Lưu đề tài
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredTopics.length === 0 && searchQuery && (
                  <div className="text-center py-8 text-slate-500">
                    Không tìm thấy kết quả phù hợp
                  </div>
                )}
              </div>
            )}

            {topics.length === 0 && !loading && (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="font-semibold text-slate-700 mb-2">Chưa có gợi ý nào</h3>
                <p className="text-sm text-slate-500">
                  Nhập chuyên ngành và từ khóa để tạo gợi ý đề tài nghiên cứu
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50">
          <p className="text-xs text-slate-500 text-center">
            Powered by AI • Kết quả chỉ mang tính tham khảo
          </p>
        </div>
      </div>
    </div>
  );
};

const ResearchSuggestionModalMemo = memo(ResearchSuggestionModal, (prevProps, nextProps) => {
  return prevProps.isOpen === nextProps.isOpen;
});

export default ResearchSuggestionModalMemo;
