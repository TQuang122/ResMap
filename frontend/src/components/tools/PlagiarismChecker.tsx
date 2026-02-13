import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Search, AlertTriangle, CheckCircle, Loader2, ExternalLink, Sparkles, Gauge } from 'lucide-react';
import { getData, postData } from '../../utils/api';
import { logHistory } from '../../utils/logger';

interface Source {
  url: string;
  similarity: number;
}

interface SentenceResult {
  sentence: string;
  similarity: number;
  semantic_similarity: number;
  used_ai?: boolean;
  fallback_used?: boolean;
  analysis_method?: string | null;
  sources: Source[];
  is_plagiarized: boolean;
}

interface PlagiarismResponse {
  overall_score: number;
  plagiarism_percentage: number;
  total_sentences: number;
  plagiarized_sentences: number;
  results: SentenceResult[];
  used_ai_similarity: boolean;
  fallback_used: boolean;
  analysis_method: string | null;
  ai_quota_remaining: number | null;
  ai_quota_percent: number | null;
}

interface QuotaResponse {
  used: number;
  limit: number;
  remaining: number;
  usage_percent: number;
  reset_at: string;
}

const PlagiarismChecker: React.FC = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<PlagiarismResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [useAiSimilarity, setUseAiSimilarity] = useState(true);
  const [quota, setQuota] = useState<QuotaResponse | null>(null);
  const [quotaLoading, setQuotaLoading] = useState(false);
  const [quotaError, setQuotaError] = useState<string | null>(null);
  const [quotaEndpointUnsupported, setQuotaEndpointUnsupported] = useState(false);

  const canSubmit = useMemo(() => text.trim().length >= 50, [text]);

  const toNumber = (value: unknown, fallback = 0) =>
    typeof value === 'number' && Number.isFinite(value) ? value : fallback;

  const normalizeSentence = (item: any): SentenceResult => ({
    sentence: typeof item?.sentence === 'string' ? item.sentence : '',
    similarity: toNumber(item?.similarity),
    semantic_similarity: toNumber(item?.semantic_similarity),
    used_ai: Boolean(item?.used_ai),
    fallback_used: Boolean(item?.fallback_used),
    analysis_method: typeof item?.analysis_method === 'string' ? item.analysis_method : null,
    sources: Array.isArray(item?.sources)
      ? item.sources
          .map((source: any) => ({
            url: typeof source?.url === 'string' ? source.url : '',
            similarity: toNumber(source?.similarity),
          }))
          .filter((source: Source) => source.url.length > 0)
      : [],
    is_plagiarized: Boolean(item?.is_plagiarized),
  });

  const normalizeResponse = (raw: any): PlagiarismResponse => ({
    overall_score: toNumber(raw?.overall_score),
    plagiarism_percentage: toNumber(raw?.plagiarism_percentage),
    total_sentences: toNumber(raw?.total_sentences),
    plagiarized_sentences: toNumber(raw?.plagiarized_sentences),
    results: Array.isArray(raw?.results) ? raw.results.map(normalizeSentence) : [],
    used_ai_similarity: Boolean(raw?.used_ai_similarity),
    fallback_used: Boolean(raw?.fallback_used),
    analysis_method: typeof raw?.analysis_method === 'string' ? raw.analysis_method : null,
    ai_quota_remaining:
      typeof raw?.ai_quota_remaining === 'number' ? raw.ai_quota_remaining : null,
    ai_quota_percent: typeof raw?.ai_quota_percent === 'number' ? raw.ai_quota_percent : null,
  });

  const normalizeQuota = (raw: any): QuotaResponse => ({
    used: toNumber(raw?.used),
    limit: toNumber(raw?.limit),
    remaining: toNumber(raw?.remaining),
    usage_percent: toNumber(raw?.usage_percent),
    reset_at: typeof raw?.reset_at === 'string' ? raw.reset_at : '',
  });

  const mapErrorMessage = (err: unknown) => {
    const message = err instanceof Error ? err.message : '';
    if (message.includes('401') || message.includes('Unauthorized') || message.includes('Missing or invalid authorization')) {
      return 'Bạn cần đăng nhập để sử dụng tính năng này.';
    }
    if (message.includes('429') || message.toLowerCase().includes('quota')) {
      return 'Hệ thống đang giới hạn quota. Vui lòng thử lại sau.';
    }
    return 'Có lỗi xảy ra khi kết nối tới server. Vui lòng thử lại sau.';
  };

  const fetchQuota = useCallback(async (showLoading = false) => {
    if (quotaEndpointUnsupported) {
      return;
    }

    if (showLoading) {
      setQuotaLoading(true);
    }

    try {
      const quotaRaw = await getData('/tools/plagiarism-check/quota');
      setQuota(normalizeQuota(quotaRaw));
      setQuotaError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : '';
      if (message.includes('404')) {
        setQuotaEndpointUnsupported(true);
        setQuotaError(null);
      } else {
        setQuotaError(mapErrorMessage(err));
      }
    } finally {
      if (showLoading) {
        setQuotaLoading(false);
      }
    }
  }, [quotaEndpointUnsupported]);

  useEffect(() => {
    void fetchQuota(true);
  }, [fetchQuota]);

  useEffect(() => {
    if (!loading) {
      setProgress(0);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return Math.min(90, prev + Math.floor(Math.random() * 11) + 5);
      });
    }, 500);

    return () => clearInterval(interval);
  }, [loading]);

  const handleCheck = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setProgress(0);
    setResult(null);
    setError(null);

    try {
      const raw = await postData('/tools/plagiarism-check', {
        text,
        max_sentences: 20,
        use_ai_similarity: useAiSimilarity,
      });
      const response = normalizeResponse(raw);
      setResult(response);
      await logHistory({
        tool: 'plagiarism',
        request: { text, max_sentences: 20, use_ai_similarity: useAiSimilarity },
        response,
      });
    } catch (err) {
      console.error(err);
      setError(mapErrorMessage(err));
    } finally {
      setLoading(false);
      setProgress(100);
      if (!quotaEndpointUnsupported) {
        await fetchQuota();
      }
    }
  };

  const getScoreColor = (score: number) => {
    if (score > 50) return 'text-red-600';
    if (score > 20) return 'text-orange-500';
    return 'text-green-600';
  };

  const getScoreBg = (score: number) => {
    if (score > 50) return 'bg-red-50 border-red-200';
    if (score > 20) return 'bg-orange-50 border-orange-200';
    return 'bg-green-50 border-green-200';
  };

  const getMethodInfo = (method: string | null | undefined, fallbackUsed = false) => {
    const normalized = (method || '').toLowerCase();
    if (normalized === 'semantic') {
      return {
        label: fallbackUsed ? 'Semantic (Fallback)' : 'Semantic',
        className: 'bg-blue-100 text-blue-700 border-blue-200',
      };
    }
    if (normalized === 'hybrid') {
      return {
        label: 'Hybrid',
        className: 'bg-violet-100 text-violet-700 border-violet-200',
      };
    }
    if (normalized === 'keyword') {
      return {
        label: fallbackUsed ? 'Keyword (Fallback)' : 'Keyword',
        className: 'bg-slate-100 text-slate-700 border-slate-200',
      };
    }
    return {
      label: fallbackUsed ? 'Standard (Fallback)' : 'Standard',
      className: 'bg-slate-100 text-slate-700 border-slate-200',
    };
  };

  const quotaPercent = Math.min(100, Math.max(0, quota?.usage_percent ?? result?.ai_quota_percent ?? 0));
  const effectiveQuotaRemaining = quota?.remaining ?? result?.ai_quota_remaining ?? null;

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden" aria-busy={loading}>
      <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center gap-2">
        <Search size={20} className="text-[#F36F21]" />
        <h3 className="font-bold text-slate-800">Kiểm tra Đạo văn (Plagiarism Checker)</h3>
      </div>
      
      <div className="p-6 flex flex-col gap-6">
        {/* Input Section */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Nhập văn bản cần kiểm tra (Tối thiểu 50 ký tự)
          </label>
          <textarea 
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Dán nội dung bài làm hoặc đoạn văn cần kiểm tra vào đây..."
            aria-label="Văn bản cần kiểm tra đạo văn"
            className="w-full p-4 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F36F21] text-sm min-h-[200px] leading-relaxed resize-y"
          />
          <div className="mt-2 flex justify-between text-xs text-slate-500">
            <span className={canSubmit ? 'text-green-600' : 'text-orange-500'}>
              {text.length} / 50 ký tự tối thiểu
            </span>
            <span>Khuyên dùng: Kiểm tra từng đoạn ngắn để có kết quả tốt nhất.</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <Sparkles size={16} className="text-[#F36F21]" />
                  AI Similarity
                </p>
                <p className="text-xs text-slate-500 mt-1">Bật để ưu tiên semantic similarity khi quota khả dụng.</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={useAiSimilarity}
                aria-label="Bật tắt AI similarity"
                disabled={loading}
                onClick={() => setUseAiSimilarity((prev) => !prev)}
                className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#F36F21]/40 disabled:opacity-50 ${
                  useAiSimilarity ? 'bg-[#F36F21]' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200 ${
                    useAiSimilarity ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-white" aria-live="polite">
            <p className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <Gauge size={16} className="text-[#F36F21]" />
              AI Quota
            </p>
            {quotaLoading && !quota ? (
              <p className="text-xs text-slate-500 mt-2">Đang tải quota...</p>
            ) : quotaEndpointUnsupported ? (
              <p className="text-xs text-slate-500 mt-2">Quota endpoint chưa được bật ở môi trường hiện tại.</p>
            ) : quotaError ? (
              <p className="text-xs text-amber-600 mt-2">Không thể tải quota lúc này (không ảnh hưởng thao tác kiểm tra).</p>
            ) : (
              <>
                <div className="mt-2 h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-[#F36F21] transition-all duration-300" style={{ width: `${quotaPercent}%` }} />
                </div>
                <div className="mt-2 text-xs text-slate-600 flex items-center justify-between gap-2">
                  <span>Đã dùng: {quotaPercent.toFixed(2)}%</span>
                  <span>Còn lại: {effectiveQuotaRemaining ?? '--'}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleCheck}
          disabled={loading || !canSubmit}
          aria-busy={loading}
          className="self-start px-8 py-3 bg-[#F36F21] text-white font-bold rounded-full hover:bg-orange-600 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none transition-all duration-200 flex items-center gap-2 active:scale-95 min-w-[180px]"
        >
          {loading ? (
            <>
              <span
                className="relative inline-flex items-center justify-center"
                style={{
                  width: 18,
                  height: 18,
                }}
              >
                <span
                  className="absolute inset-0 rounded-full animate-ping opacity-75"
                  style={{ backgroundColor: '#fff' }}
                />
                <span
                  className="relative w-3 h-3 rounded-full"
                  style={{
                    background: 'repeating-conic-gradient(#fff 0 5%, #ff6b6b 20% 50%)',
                    animation: 'spin 1.5s linear infinite',
                  }}
                />
              </span>
              <style>{`
                @keyframes spin {
                  to { transform: rotate(360deg); }
                }
              `}</style>
              Đang phân tích... {progress}%
            </>
          ) : (
            <>
              <Search size={18} />
              Kiểm tra Đạo văn
            </>
          )}
        </button>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-3 border border-red-200" role="alert" aria-live="polite">
            <AlertTriangle size={20} />
            <p>{error}</p>
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className="space-y-6" aria-live="polite">
            <div className="h-px bg-slate-200 w-full" />

            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full border ${getMethodInfo(
                  result.analysis_method,
                  result.fallback_used
                ).className}`}
              >
                {getMethodInfo(result.analysis_method, result.fallback_used).label}
              </span>
              {result.used_ai_similarity && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full border bg-blue-50 border-blue-200 text-blue-700">
                  AI Used
                </span>
              )}
              {result.fallback_used && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full border bg-amber-50 border-amber-200 text-amber-700">
                  Fallback Active
                </span>
              )}
            </div>
            
            {/* Score Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`p-4 rounded-xl border ${getScoreBg(result.overall_score)} flex flex-col items-center justify-center text-center`}>
                <div className={`text-3xl font-black mb-1 ${getScoreColor(result.overall_score)}`}>
                  {result.overall_score}%
                </div>
                <div className="text-sm font-medium text-slate-600">Mức độ Trùng lặp</div>
              </div>
              
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-center">
                <div className="text-3xl font-bold text-slate-800 mb-1">
                  {result.plagiarized_sentences} / {result.total_sentences}
                </div>
                <div className="text-sm font-medium text-slate-600">Câu bị nghi ngờ</div>
              </div>

              <div className={`p-4 rounded-xl border ${result.plagiarism_percentage > 30 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'} flex flex-col items-center justify-center text-center`}>
                <div className={`text-3xl font-bold mb-1 ${result.plagiarism_percentage > 30 ? 'text-red-600' : 'text-green-600'}`}>
                  {result.plagiarism_percentage}%
                </div>
                <div className="text-sm font-medium text-slate-600">Tỷ lệ Đạo văn</div>
              </div>
            </div>

            {/* Detailed Analysis */}
            <div className="space-y-4">
              <h4 className="font-bold text-slate-800 flex items-center gap-2">
                <Search size={18} />
                Chi tiết Phân tích ({result.results.length} câu)
              </h4>
              
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {result.results.map((item, index) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-lg border transition-all hover:shadow-sm ${
                      item.is_plagiarized 
                        ? 'bg-red-50/50 border-red-200' 
                        : 'bg-white border-slate-100'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 shrink-0 ${item.is_plagiarized ? 'text-red-500' : 'text-green-500'}`}>
                        {item.is_plagiarized ? <AlertTriangle size={18} /> : <CheckCircle size={18} />}
                      </div>
                      
                      <div className="flex-1 space-y-2 min-w-0">
                        <p className={`text-slate-800 leading-relaxed ${item.is_plagiarized ? 'font-medium' : ''}`}>
                          {item.sentence}
                        </p>

                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          {item.analysis_method && (
                            <span className={`px-2 py-0.5 rounded-full border ${getMethodInfo(item.analysis_method, Boolean(item.fallback_used)).className}`}>
                              {getMethodInfo(item.analysis_method, Boolean(item.fallback_used)).label}
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded-full border bg-slate-100 text-slate-700 border-slate-200">
                            Semantic: {item.semantic_similarity}%
                          </span>
                        </div>
                         
                        {item.sources.length > 0 && (
                          <div className="mt-3 pl-3 border-l-2 border-slate-200 space-y-2">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Nguồn tìm thấy:</p>
                            {item.sources.slice(0, 3).map((source, sIndex) => (
                              <a 
                                key={sIndex}
                                href={source.url}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline group"
                              >
                                <ExternalLink size={14} className="shrink-0" />
                                <span className="truncate">{source.url}</span>
                                <span className="shrink-0 ml-auto px-2 py-0.5 bg-slate-100 rounded text-xs font-semibold text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600">
                                  {source.similarity}%
                                </span>
                              </a>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className={`shrink-0 text-sm font-bold px-2 py-1 rounded ${
                        item.similarity > 50 ? 'bg-red-100 text-red-600' : 
                        item.similarity > 20 ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {item.similarity}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlagiarismChecker;
