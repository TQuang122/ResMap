import React, { useState } from 'react';
import { Search, Copy, Check, ExternalLink, Loader2, Sparkles } from 'lucide-react';
import { postData } from '../../../utils/api';
import { QueryResponse, QueryVariant, PaperType } from '../../../types';

interface QueryBuilderProps {
  onSearch: (query: string) => void;
}

const PAPER_TYPES: { value: PaperType; label: string; description: string }[] = [
  { value: 'survey', label: 'Survey/Review', description: 'Bài tổng quan, literature review' },
  { value: 'empirical', label: 'Empirical', description: 'Nghiên cứu thực nghiệm, có data' },
  { value: 'benchmark', label: 'Benchmark', description: 'So sánh, đánh giá các phương pháp' },
  { value: 'case', label: 'Case Study', description: 'Nghiên cứu tình huống, ứng dụng' },
];

const SOURCE_ICONS: Record<string, string> = {
  google_scholar: 'https://scholar.google.com/favicon.ico',
  openalex: 'https://openalex.org/favicon.ico',
  semantic_scholar: 'https://www.semanticscholar.org/favicon.ico',
  ieee: 'https://ieeexplore.ieee.org/favicon.ico',
  acm: 'https://dl.acm.org/favicon.ico',
};

const SOURCE_NAMES: Record<string, string> = {
  google_scholar: 'Google Scholar',
  openalex: 'OpenAlex',
  semantic_scholar: 'Semantic Scholar',
  ieee: 'IEEE Xplore',
  acm: 'ACM Digital Library',
};

const QueryBuilder: React.FC<QueryBuilderProps> = ({ onSearch }) => {
  const [topic, setTopic] = useState('');
  const [yearStart, setYearStart] = useState(2020);
  const [yearEnd, setYearEnd] = useState(2025);
  const [selectedTypes, setSelectedTypes] = useState<PaperType[]>([]);
  const [domain, setDomain] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<QueryResponse | null>(null);
  const [copiedQuery, setCopiedQuery] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTypeToggle = (type: PaperType) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleGenerateQueries = async () => {
    if (!topic.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await postData('/papers/queries', {
        topic: topic.trim(),
        year_start: yearStart,
        year_end: yearEnd,
        paper_types: selectedTypes,
        domain: domain.trim() || null,
      });
      setResult(response);
    } catch (e) {
      console.error(e);
      setError('Không thể tạo queries. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (query: QueryVariant) => {
    await navigator.clipboard.writeText(query.query);
    setCopiedQuery(query.source);
    setTimeout(() => setCopiedQuery(null), 2000);
  };

  const handleSearchWithOpenAlex = () => {
    if (result) {
      const oaQuery = result.queries.find(q => q.source === 'openalex');
      if (oaQuery) {
        onSearch(oaQuery.query);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Chủ đề nghiên cứu *
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="VD: sentiment analysis using deep learning"
            className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Năm bắt đầu
            </label>
            <input
              type="number"
              value={yearStart}
              onChange={(e) => setYearStart(parseInt(e.target.value) || 2020)}
              min={2000}
              max={2025}
              className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Năm kết thúc
            </label>
            <input
              type="number"
              value={yearEnd}
              onChange={(e) => setYearEnd(parseInt(e.target.value) || 2025)}
              min={2000}
              max={2025}
              className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Loại paper cần tìm
          </label>
          <div className="flex flex-wrap gap-2">
            {PAPER_TYPES.map((type) => (
              <button
                key={type.value}
                onClick={() => handleTypeToggle(type.value)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedTypes.includes(type.value)
                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-500'
                    : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
                title={type.description}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Domain (tùy chọn)
          </label>
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="VD: Computer Science, Business, Healthcare..."
            className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 text-sm"
          />
        </div>

        <button
          onClick={handleGenerateQueries}
          disabled={loading || !topic.trim()}
          className="w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Sparkles size={18} />
          )}
          Tạo bộ truy vấn
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 text-sm">
          {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Keywords & Synonyms */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <h4 className="font-medium text-slate-800 mb-2">Từ khóa mở rộng</h4>
            <div className="flex flex-wrap gap-2">
              {result.keywords.map((kw, idx) => (
                <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                  {kw}
                </span>
              ))}
              {result.synonyms.map((syn, idx) => (
                <span key={idx} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                  {syn}
                </span>
              ))}
            </div>
          </div>

          {/* Query List */}
          <div className="space-y-3">
            <h4 className="font-medium text-slate-800">Queries cho các nguồn</h4>
            {result.queries.map((query) => (
              <div
                key={query.source}
                className="p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <img 
                      src={SOURCE_ICONS[query.source]} 
                      alt={query.source}
                      className="w-4 h-4"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                    <span className="font-medium text-slate-700">
                      {SOURCE_NAMES[query.source] || query.source}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(query)}
                      className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Copy query"
                    >
                      {copiedQuery === query.source ? (
                        <Check size={16} className="text-green-600" />
                      ) : (
                        <Copy size={16} />
                      )}
                    </button>
                    {query.url && (
                      <a
                        href={query.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Mở trong tab mới"
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                </div>
                <code className="block text-sm text-slate-600 bg-slate-50 p-2 rounded-lg break-all">
                  {query.query}
                </code>
              </div>
            ))}
          </div>

          {/* Search with OpenAlex button */}
          <button
            onClick={handleSearchWithOpenAlex}
            className="w-full px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <Search size={18} />
            Tìm kiếm với ResHunter
          </button>
        </div>
      )}
    </div>
  );
};

export default QueryBuilder;
