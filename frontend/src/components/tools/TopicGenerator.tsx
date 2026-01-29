import React, { useState } from 'react';
import { Lightbulb, Loader2, Sparkles } from 'lucide-react';
import { postData } from '../../utils/api';
import { supabase } from '../../lib/supabase';
import { logHistory } from '../../utils/logger';

type TopicSuggestion = {
  title: string;
  description: string;
  difficulty: string;
};

const TopicGenerator: React.FC = () => {
  const [major, setMajor] = useState('');
  const [keywords, setKeywords] = useState('');
  const [loading, setLoading] = useState(false);
  const [topics, setTopics] = useState<TopicSuggestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<Record<string, boolean>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

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
    } catch (e) {
      console.error(e);
      setError('Không thể tạo gợi ý lúc này. Vui lòng thử lại sau.');
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

  const difficultyClass = (d: string) => {
    const v = d.toLowerCase();
    if (v.includes('hard')) return 'bg-red-50 text-red-700 border-red-200';
    if (v.includes('medium')) return 'bg-orange-50 text-orange-700 border-orange-200';
    return 'bg-green-50 text-green-700 border-green-200';
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center gap-2">
        <Lightbulb size={20} className="text-[#F36F21]" />
        <h3 className="font-bold text-slate-800">Topic Generator (Gợi ý đề tài)</h3>
      </div>

      <div className="p-6 flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Chuyên ngành</label>
            <input
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              placeholder="VD: Kỹ thuật phần mềm, Digital Marketing, AI..."
              className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F36F21] text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Từ khóa / sở thích (tuỳ chọn)</label>
            <input
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="VD: chatbot, ESG, recommender, TikTok..."
              className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F36F21] text-sm"
            />
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || !major.trim()}
          className="self-start px-6 py-2 bg-[#F36F21] text-white font-bold rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors flex items-center gap-2"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
          Tạo 5 đề tài
        </button>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 text-sm">
            {error}
          </div>
        )}

        {topics.length > 0 && (
          <div className="space-y-3">
            {topics.map((t, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-slate-900">{t.title}</h4>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">{t.description}</p>
                  </div>
                  <span className={`shrink-0 text-xs font-bold px-2 py-1 rounded-full border ${difficultyClass(t.difficulty)}`}>
                    {t.difficulty}
                  </span>
                </div>
                <div className="mt-3">
                  <button
                    onClick={() => handleSave(t)}
                    disabled={savingId === t.title || savedIds[t.title]}
                    className="text-xs font-semibold px-3 py-1.5 rounded-full border border-orange-200 text-orange-600 hover:bg-orange-50 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {savedIds[t.title] ? 'Đã lưu' : savingId === t.title ? 'Đang lưu...' : 'Lưu đề tài'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicGenerator;
