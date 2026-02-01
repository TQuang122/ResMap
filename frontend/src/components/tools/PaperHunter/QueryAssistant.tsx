import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { postData } from '../../../utils/api';
import { QueryResponse } from '../../../types';

interface QueryAssistantProps {
  topic: string;
  currentSearch?: string; // New prop for filtering
  onSelectQuery: (query: string) => void;
  autoTrigger?: boolean;
}

const QueryAssistant: React.FC<QueryAssistantProps> = ({ topic, currentSearch = '', onSelectQuery, autoTrigger = false }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<QueryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateQueries = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const response = await postData('/papers/queries', {
        topic: topic.trim(),
        year_start: 2020,
        year_end: 2025,
        paper_types: [], // Default to all
        domain: null,
      });
      setResult(response);
    } catch (e) {
      console.error(e);
      setError('Không thể tối ưu query.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoTrigger && topic && !result && !loading) {
      generateQueries();
    }
  }, [topic, autoTrigger]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-blue-600 animate-pulse px-4 py-2">
        <Loader2 size={14} className="animate-spin" />
        Đang phân tích câu hỏi nghiên cứu...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-between gap-3 p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg">
        <span>{error}</span>
        <button
          onClick={generateQueries}
          className="p-1 text-red-600 hover:text-red-800 rounded transition-colors"
          title="Thử lại"
        >
          <RefreshCw size={12} />
        </button>
      </div>
    );
  }

  if (!result) {
    return (
      <button
        onClick={generateQueries}
        disabled={!topic.trim()}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-lg hover:bg-indigo-100 transition-colors border border-indigo-200"
      >
        <Sparkles size={14} />
        Gợi ý từ khóa AI
      </button>
    );
  }

  const normalize = (text: string) =>
    text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();

  const isDuplicate = (q: string) => {
    return normalize(q) === normalize(currentSearch);
  };

  const isTooSimilarToTopic = (q: string) => {
    const topicNorm = normalize(topic);
    const qNorm = normalize(q);
    if (!topicNorm || !qNorm) return false;

    if (qNorm === topicNorm) return true;

    // Length-based similarity (avoid full-sentence duplicates)
    if (qNorm.length >= Math.floor(topicNorm.length * 0.8)) return true;

    // Token overlap similarity
    const topicTokens = new Set(topicNorm.split(" ").filter(Boolean));
    const qTokens = qNorm.split(" ").filter(Boolean);
    if (qTokens.length === 0) return false;
    const overlap = qTokens.filter((t) => topicTokens.has(t)).length;
    const overlapRatio = overlap / qTokens.length;

    // Only hide if it's a long, near-duplicate phrase
    return overlapRatio >= 0.9 && qTokens.length >= Math.max(4, Math.floor(topicTokens.size * 0.6));
  };

  return (
    <div className="space-y-3 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <Sparkles size={12} className="text-indigo-500" />
          Gợi ý tìm kiếm
        </div>
        <button 
          onClick={generateQueries}
          className="p-1 text-slate-400 hover:text-indigo-600 rounded transition-colors"
          title="Tạo lại"
        >
          <RefreshCw size={12} />
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {/* OpenAlex Query (Best match) - Hide if duplicate */}
        {result.queries.find(q => q.source === 'openalex') && 
         !isDuplicate(result.queries.find(q => q.source === 'openalex')!.query) &&
         !isTooSimilarToTopic(result.queries.find(q => q.source === 'openalex')!.query) && (
          <button
            onClick={() => onSelectQuery(result.queries.find(q => q.source === 'openalex')!.query)}
            className="px-3 py-1.5 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full border border-indigo-200 hover:bg-indigo-200 hover:border-indigo-300 transition-all text-left max-w-full truncate"
          >
            🎯 Best Match: {result.queries.find(q => q.source === 'openalex')!.query}
          </button>
        )}

        {/* Keywords as Chips */}
        {result.keywords.slice(0, 3).map((kw, i) => (
          !isDuplicate(kw) && !isTooSimilarToTopic(kw) && (
            <button
              key={`kw-${i}`}
              onClick={() => onSelectQuery(kw)}
              className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-medium rounded-full border border-slate-200 hover:bg-white hover:border-blue-300 hover:text-blue-600 hover:shadow-sm transition-all"
            >
              {kw}
            </button>
          )
        ))}

        {/* Synonyms as Chips */}
        {result.synonyms.slice(0, 3).map((syn, i) => (
          !isDuplicate(syn) && !isTooSimilarToTopic(syn) && (
            <button
              key={`syn-${i}`}
              onClick={() => onSelectQuery(syn)}
              className="px-3 py-1.5 bg-slate-50 text-slate-600 text-xs font-medium rounded-full border border-slate-100 hover:bg-white hover:border-green-300 hover:text-green-600 hover:shadow-sm transition-all"
            >
              {syn}
            </button>
          )
        ))}
      </div>
    </div>
  );
};

export default QueryAssistant;
