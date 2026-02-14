import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Search, AlertTriangle, CheckCircle, Loader2, ExternalLink, Sparkles, Gauge, Info, BookOpen, AlertCircle } from 'lucide-react';
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

// report_v2 Types
interface ReportV2SourceSpan {
  sentence_index: number;
  start_char: number;
  end_char: number;
  similarity: number;
}

interface ReportV2SourceGroup {
  source_id: string;
  source_type: string;
  canonical_url: string;
  spans: ReportV2SourceSpan[];
}

interface ReportV2Caveat {
  code: string;
  message: string;
}

interface MatchGroup {
  group_type: string;
  count: number;
  percentage: number;
  sample_sentences: string[];
}

interface ReportV2 {
  source_groups: ReportV2SourceGroup[];
  match_groups: MatchGroup[];
  caveats: ReportV2Caveat[];
  metadata?: Record<string, string>;
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
  report_v2?: ReportV2;
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
  const [excludeSmallMatches, setExcludeSmallMatches] = useState(0);
  const [excludeSmallSources, setExcludeSmallSources] = useState(false);
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
    report_v2: raw?.report_v2 ? {
      source_groups: Array.isArray(raw.report_v2.source_groups) ? raw.report_v2.source_groups : [],
      match_groups: Array.isArray(raw.report_v2.match_groups) ? raw.report_v2.match_groups : [],
      caveats: Array.isArray(raw.report_v2.caveats) ? raw.report_v2.caveats : [],
      metadata: typeof raw.report_v2.metadata === 'object' ? raw.report_v2.metadata : undefined,
    } : undefined,
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
        exclude_small_matches: excludeSmallMatches,
        exclude_small_sources: excludeSmallSources,
      });
      const response = normalizeResponse(raw);
      setResult(response);
      await logHistory({
        tool: 'plagiarism',
        request: { text, max_sentences: 20, use_ai_similarity: useAiSimilarity, exclude_small_matches: excludeSmallMatches, exclude_small_sources: excludeSmallSources },
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

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
            <p className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <Search size={16} className="text-[#F36F21]" />
              Bộ lọc nâng cao
            </p>
            
            <div className="flex flex-wrap gap-3">
              <div className="flex-1 min-w-[140px]">
                <label className="text-xs text-slate-600 block mb-1">
                  Loại bỏ matches &lt; N từ
                </label>
                <select
                  value={excludeSmallMatches}
                  onChange={(e) => setExcludeSmallMatches(Number(e.target.value))}
                  disabled={loading}
                  className="w-full text-sm border border-slate-300 rounded-lg px-2 py-1.5 bg-white"
                >
                  <option value={0}>Không lọc</option>
                  <option value={3}>3 từ</option>
                  <option value={5}>5 từ</option>
                  <option value={10}>10 từ</option>
                  <option value={15}>15 từ</option>
                  <option value={20}>20 từ</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={excludeSmallSources}
                    onChange={(e) => setExcludeSmallSources(e.target.checked)}
                    disabled={loading}
                    className="w-4 h-4 rounded border-slate-300 text-[#F36F21] focus:ring-[#F36F21]"
                  />
                  <span className="text-xs text-slate-600">Loại bỏ nguồn &lt; 3 matches</span>
                </label>
              </div>
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

            {result.report_v2 && result.report_v2.source_groups.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-bold text-slate-800 flex items-center gap-2">
                  <BookOpen size={18} />
                  Tổng quan Matches ({result.report_v2.source_groups.length} nguồn, {result.results.filter(r => r.sources.length > 0).length} câu trùng)
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.report_v2.source_groups.slice(0, 6).map((group) => {
                    const matchCount = group.spans.length;
                    const avgSimilarity = matchCount > 0 
                      ? Math.round(group.spans.reduce((sum, s) => sum + s.similarity, 0) / matchCount)
                      : 0;
                    const maxSim = matchCount > 0 
                      ? Math.max(...group.spans.map(s => s.similarity))
                      : 0;
                    
                    const severityColor = maxSim > 50 ? 'border-red-300 bg-red-50' : 
                                        maxSim > 20 ? 'border-orange-300 bg-orange-50' : 
                                        'border-slate-200 bg-white';
                    
                    return (
                      <div 
                        key={group.source_id}
                        className={`p-3 rounded-lg border-2 ${severityColor} hover:shadow-md transition-all cursor-pointer`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-slate-700 truncate max-w-[70%]">
                            {new URL(group.canonical_url).hostname}
                          </span>
                          <span className="text-xs font-bold text-slate-600">
                            {matchCount} matches
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                maxSim > 50 ? 'bg-red-500' : 
                                maxSim > 20 ? 'bg-orange-400' : 
                                'bg-slate-400'
                              }`}
                              style={{ width: `${avgSimilarity}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-slate-600 w-10 text-right">
                            {avgSimilarity}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {result.report_v2.source_groups.length > 6 && (
                  <p className="text-xs text-slate-500 text-center">
                    + {result.report_v2.source_groups.length - 6} nguồn khác
                  </p>
                )}
              </div>
            )}

            {result.results.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-bold text-slate-800 flex items-center gap-2">
                  <BookOpen size={18} />
                  Tài liệu với Highlight
                </h4>
                
                <div className="p-4 rounded-lg border border-slate-200 bg-white max-h-[400px] overflow-y-auto">
                  <div className="space-y-2 text-sm leading-relaxed">
                    {result.results.map((item, index) => {
                      const highlightColor = item.is_plagiarized 
                        ? 'bg-red-200 text-red-900 font-medium' 
                        : item.sources.length > 0 
                          ? 'bg-yellow-100 text-yellow-900' 
                          : '';
                      const sourceCount = item.sources.length;
                      
                      return (
                        <div key={index} className="flex gap-2">
                          <span className="text-slate-400 text-xs w-6 shrink-0">{index + 1}.</span>
                          <span className={highlightColor}>
                            {item.sentence}
                            {sourceCount > 0 && (
                              <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold bg-slate-200 text-slate-700">
                                {sourceCount} nguồn
                              </span>
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-3 text-xs">
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 bg-red-200 rounded"></span> Trùng cao (&gt;50%)
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 bg-yellow-100 rounded"></span> Có trùng lặp
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 bg-slate-100 rounded"></span> Bình thường
                    </span>
                  </div>
                </div>
              </div>
            )}

            {result.report_v2 && result.report_v2.match_groups && result.report_v2.match_groups.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-bold text-slate-800 flex items-center gap-2">
                  <AlertCircle size={18} />
                  Phân loại Trùng lặp theo Trích dẫn
                </h4>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {result.report_v2.match_groups.map((group) => {
                    const config = {
                      not_cited_or_quoted: { label: 'Không trích dẫn', color: 'bg-red-100 border-red-300 text-red-800', bg: 'bg-red-50' },
                      missing_quotations: { label: 'Thiết ngoặc', color: 'bg-orange-100 border-orange-300 text-orange-800', bg: 'bg-orange-50' },
                      missing_citation: { label: 'Thiết trích dẫn', color: 'bg-yellow-100 border-yellow-300 text-yellow-800', bg: 'bg-yellow-50' },
                      cited_and_quoted: { label: 'Đã trích dẫn', color: 'bg-green-100 border-green-300 text-green-800', bg: 'bg-green-50' },
                    };
                    const c = config[group.group_type as keyof typeof config] || config.not_cited_or_quoted;
                    
                    return (
                      <div 
                        key={group.group_type}
                        className={`p-3 rounded-lg border ${c.color} ${c.bg}`}
                      >
                        <div className="text-2xl font-bold">{group.count}</div>
                        <div className="text-xs font-medium">{c.label}</div>
                        <div className="text-xs opacity-75">{group.percentage}%</div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-200 rounded"></span> Không trích dẫn</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 bg-orange-200 rounded"></span> Thiếu ngoặc</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-200 rounded"></span> Thiếu trích dẫn</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-200 rounded"></span> Đã trích dẫn đúng</span>
                </div>
              </div>
            )}

            {result.report_v2 && result.report_v2.source_groups && result.report_v2.source_groups.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-bold text-slate-800 flex items-center gap-2">
                  <BookOpen size={18} />
                  Nguồn Trùng lặp ({result.report_v2.source_groups.length} nhóm)
                </h4>
                
                <div className="grid gap-3">
                  {result.report_v2.source_groups.map((group, gIndex) => (
                    <div 
                      key={group.source_id}
                      className="p-4 rounded-lg border border-slate-200 bg-white hover:shadow-sm transition-all"
                      data-test="match-span"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                              group.source_type === 'academic' ? 'bg-purple-50 border-purple-200 text-purple-700' :
                              group.source_type === 'web' ? 'bg-green-50 border-green-200 text-green-700' :
                              'bg-slate-100 border-slate-200 text-slate-600'
                            }`}>
                              {group.source_type === 'academic' ? 'Học thuật' : 
                               group.source_type === 'web' ? 'Web' : 
                               group.source_type}
                            </span>
                            <span className="text-xs text-slate-500">
                              {group.spans.length} đoạn trùng
                            </span>
                          </div>
                          <a 
                            href={group.canonical_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 hover:underline line-clamp-2 break-all"
                          >
                            {group.canonical_url}
                          </a>
                        </div>
                        <ExternalLink size={16} className="text-slate-400 shrink-0" />
                      </div>
                      
                      {group.spans.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-100">
                          <p className="text-xs font-medium text-slate-500 mb-2">Đoạn trùng:</p>
                          <div className="flex flex-wrap gap-2">
                            {group.spans.slice(0, 5).map((span, sIndex) => (
                              <span 
                                key={sIndex}
                                className={`text-xs px-2 py-1 rounded font-medium ${
                                  span.similarity > 50 ? 'bg-red-100 text-red-700' :
                                  span.similarity > 20 ? 'bg-orange-100 text-orange-700' :
                                  'bg-slate-100 text-slate-600'
                                }`}
                              >
                                Câu {span.sentence_index + 1}: {span.similarity}%
                              </span>
                            ))}
                            {group.spans.length > 5 && (
                              <span className="text-xs text-slate-500 py-1">
                                +{group.spans.length - 5} đoạn khác
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.report_v2 && result.report_v2.caveats.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 flex items-center gap-2">
                  <AlertCircle size={18} />
                  Cảnh báo & Hạn chế
                </h4>
                
                <div className="space-y-2">
                  {result.report_v2.caveats.map((caveat, cIndex) => (
                    <div 
                      key={cIndex}
                      className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2"
                    >
                      <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                      <p className="text-sm text-amber-800">{caveat.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.report_v2?.metadata && (
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                {result.report_v2.metadata.confidence_band && (
                  <span className="px-2 py-1 bg-slate-100 rounded">
                    Độ tin cậy: {result.report_v2.metadata.confidence_band === 'high' ? 'Cao' : 
                                 result.report_v2.metadata.confidence_band === 'medium' ? 'Trung bình' : 'Thấp'}
                  </span>
                )}
                {result.report_v2.metadata.scoring_policy && (
                  <span className="px-2 py-1 bg-slate-100 rounded">
                    Chính sách: {result.report_v2.metadata.scoring_policy}
                  </span>
                )}
              </div>
            )}

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
