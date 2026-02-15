import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Search, AlertTriangle, CheckCircle, Loader2, ExternalLink, Sparkles, Gauge, Info, BookOpen, AlertCircle, FileText, Layout, Filter, X, ChevronRight, Eye, Copy, Check, Settings, Download } from 'lucide-react';
import { getData, postData, API_BASE_URL, buildHeaders } from '../../utils/api';
import { logHistory } from '../../utils/logger';

interface Source {
  url: string;
  similarity: number;
  matched_ngrams?: string[];
  passage_matches?: PassageMatch[];
  confidence_score?: string;
  match_type?: string;
}

interface PassageMatch {
  text1: string;
  text2: string;
  start1: number;
  end1: number;
  start2: number;
  end2: number;
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
  paraphrase_detected?: boolean;
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
  source_category?: string;
  credibility_score?: number;
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
  ai_detection_score?: number;
  ai_detection_confidence?: string;
  report_v2?: ReportV2;
}

interface QuotaResponse {
  used: number;
  limit: number;
  remaining: number;
  usage_percent: number;
  reset_at: string;
}

const safeHostname = (url: string): string => {
  try {
    return new URL(url).hostname;
  } catch {
    const normalized = url.trim().replace(/^https?:\/\//i, '');
    return normalized.split('/')[0] || 'unknown-source';
  }
};

// Turnitin-style Score Widget
const TurnitinScoreWidget: React.FC<{ score: number; totalSentences: number; plagiarizedSentences: number }> = ({ score, totalSentences, plagiarizedSentences }) => {
  const getScoreColor = (s: number) => {
    if (s === 0) return { bg: '#22c55e', text: '#16a34a', label: 'No Matching' };
    if (s <= 24) return { bg: '#22c55e', text: '#16a34a', label: 'Low' };
    if (s <= 49) return { bg: '#eab308', text: '#ca8a04', label: 'Moderate' };
    if (s <= 74) return { bg: '#f97316', text: '#ea580c', label: 'High' };
    return { bg: '#ef4444', text: '#dc2626', label: 'Very High' };
  };

  const color = getScoreColor(score);
  const percentage = Math.min(100, Math.max(0, score));

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
        <div>
          <h3 className="text-white font-bold text-lg">Similarity Index</h3>
          <p className="text-slate-400 text-sm">Overall similarity percentage</p>
        </div>
        <div className="text-right">
          <div className="text-5xl font-black text-white">{score}%</div>
          <div className="text-slate-400 text-sm">{color.label}</div>
        </div>
      </div>

      <div className="px-6 py-4 bg-slate-50">
        <div className="h-4 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${percentage}%`, backgroundColor: color.bg }}
          />
        </div>
      </div>

      <div className="px-6 py-4 grid grid-cols-3 gap-4 border-t border-slate-100">
        <div className="text-center">
          <div className="text-2xl font-bold text-slate-800">{plagiarizedSentences}</div>
          <div className="text-xs text-slate-500">Sentences Matched</div>
        </div>
        <div className="text-center border-l border-slate-200">
          <div className="text-2xl font-bold text-slate-800">{totalSentences}</div>
          <div className="text-xs text-slate-500">Total Sentences</div>
        </div>
        <div className="text-center border-l border-slate-200">
          <div className="text-2xl font-bold text-slate-800">{totalSentences - plagiarizedSentences}</div>
          <div className="text-xs text-slate-500">Unique</div>
        </div>
      </div>

      <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-3 text-xs">
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded"></span> 0%</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded"></span> 1-24%</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-500 rounded"></span> 25-49%</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-orange-500 rounded"></span> 50-74%</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500 rounded"></span> 75-100%</span>
      </div>
    </div>
  );
};

const MatchOverviewBar: React.FC<{ results: SentenceResult[] }> = ({ results }) => {
  const totalSentences = results.length;
  
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
      <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
        <FileText size={16} />
        Match Overview
      </h4>
      <div className="flex gap-0.5 h-8 rounded overflow-hidden">
        {results.map((item, idx) => {
          let bgColor = 'bg-slate-200';
          if (item.similarity > 74) bgColor = 'bg-red-500';
          else if (item.similarity > 49) bgColor = 'bg-orange-500';
          else if (item.similarity > 24) bgColor = 'bg-yellow-500';
          else if (item.similarity > 0) bgColor = 'bg-green-400';
          
          return (
            <div
              key={idx}
              className={`flex-1 ${bgColor} hover:opacity-80 transition-opacity cursor-pointer`}
              title={`Sentence ${idx + 1}: ${item.similarity}% match`}
            />
          );
        })}
      </div>
      <div className="flex justify-between text-xs text-slate-500 mt-2">
        <span>Sentence 1</span>
        <span>Sentence {totalSentences}</span>
      </div>
    </div>
  );
};

const DocumentViewer: React.FC<{ results: SentenceResult[]; onSentenceClick?: (index: number) => void; selectedIndex?: number }> = ({ results, onSentenceClick, selectedIndex }) => {
  const getHighlightClass = (sim: number) => {
    if (sim > 74) return 'bg-red-100 text-red-900 border-l-4 border-red-500';
    if (sim > 49) return 'bg-orange-100 text-orange-900 border-l-4 border-orange-500';
    if (sim > 24) return 'bg-yellow-100 text-yellow-900 border-l-4 border-yellow-500';
    if (sim > 0) return 'bg-green-100 text-green-900 border-l-4 border-green-400';
    return 'bg-white text-slate-700';
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
        <h4 className="font-semibold text-slate-800 flex items-center gap-2">
          <FileText size={16} />
          Document Viewer
        </h4>
        <span className="text-xs text-slate-500">{results.length} sentences</span>
      </div>
      <div className="max-h-[500px] overflow-y-auto">
        {results.map((item, idx) => (
          <div
            key={idx}
            onClick={() => onSentenceClick?.(idx)}
            className={`p-3 border-b border-slate-100 cursor-pointer transition-all hover:shadow-md ${getHighlightClass(item.similarity)} ${selectedIndex === idx ? 'ring-2 ring-blue-500' : ''}`}
          >
            <div className="flex items-start gap-3">
              <span className="text-xs text-slate-400 shrink-0 w-6">{idx + 1}.</span>
              <div className="flex-1 text-sm leading-relaxed">
                {item.sentence}
              </div>
              <span className={`shrink-0 px-2 py-0.5 rounded text-xs font-bold ${
                item.similarity > 74 ? 'bg-red-200 text-red-700' :
                item.similarity > 49 ? 'bg-orange-200 text-orange-700' :
                item.similarity > 24 ? 'bg-yellow-200 text-yellow-700' :
                item.similarity > 0 ? 'bg-green-200 text-green-700' : 'bg-slate-200 text-slate-600'
              }`}>
                {item.similarity}%
              </span>
            </div>
            {item.sources.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {item.sources.slice(0, 2).map((src, sIdx) => (
                  <span key={sIdx} className="text-xs px-2 py-0.5 bg-white/50 rounded flex items-center gap-1">
                    <ExternalLink size={10} />
                    {safeHostname(src.url)}
                  </span>
                ))}
                {item.sources.length > 2 && (
                  <span className="text-xs text-slate-500">+{item.sources.length - 2} more</span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const SideBySidePanel: React.FC<{ 
  sentence: SentenceResult; 
  sourceUrl?: string;
  onClose: () => void;
}> = ({ sentence, sourceUrl, onClose }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sentence.sentence);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Layout size={20} className="text-white" />
            <h3 className="text-white font-bold">Match Detail</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        
        <div className="grid grid-cols-2 divide-x divide-slate-200 max-h-[70vh] overflow-hidden">
          <div className="flex flex-col">
            <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between">
              <span className="font-semibold text-slate-700">Your Document</span>
              <button 
                onClick={copyToClipboard}
                className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1"
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-1 bg-slate-50/50">
              <div className={`p-4 rounded-lg ${sentence.similarity > 50 ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                <p className="text-slate-800 leading-relaxed">{sentence.sentence}</p>
                <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-sm text-slate-600">Similarity: <strong className={sentence.similarity > 50 ? 'text-red-600' : 'text-yellow-600'}>{sentence.similarity}%</strong></span>
                  <span className="text-xs text-slate-500">Sentence {1}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between">
              <span className="font-semibold text-slate-700">Source</span>
              {sourceUrl && (
                <a 
                  href={sourceUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <ExternalLink size={12} />
                  View Source
                </a>
              )}
            </div>
            <div className="p-4 overflow-y-auto flex-1">
              {sentence.sources.length > 0 ? (
                <div className="space-y-3">
                  {sentence.sources.map((src, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-slate-600 truncate">{safeHostname(src.url)}</span>
                        <div className="flex items-center gap-1">
                          {src.confidence_score && (
                            <span className={`text-xs px-1.5 py-0.5 rounded ${
                              src.confidence_score === 'high' ? 'bg-green-100 text-green-700' :
                              src.confidence_score === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {src.confidence_score.toUpperCase()}
                            </span>
                          )}
                          <span className="text-xs px-2 py-0.5 bg-slate-200 rounded">{src.similarity}%</span>
                        </div>
                      </div>
                      <a 
                        href={src.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-sm text-blue-600 hover:underline line-clamp-2"
                      >
                        {src.url}
                      </a>
                      {src.passage_matches && src.passage_matches.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-slate-200">
                          <span className="text-xs font-medium text-orange-600 flex items-center gap-1">
                            <BookOpen size={12} /> Passage matches ({src.passage_matches.length})
                          </span>
                          <div className="mt-1 space-y-1 max-h-24 overflow-y-auto">
                            {src.passage_matches.slice(0, 3).map((pm, pmIdx) => (
                              <div key={pmIdx} className="text-xs bg-orange-50 p-1.5 rounded border border-orange-100">
                                <span className="text-orange-700 font-medium">"{pm.text1.substring(0, 60)}{pm.text1.length > 60 ? '...' : ''}"</span>
                                <span className="text-slate-400 ml-1">({pm.similarity}% match)</span>
                              </div>
                            ))}
                            {src.passage_matches.length > 3 && (
                              <span className="text-xs text-slate-500">+{src.passage_matches.length - 3} more</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-slate-400 py-8">
                  <AlertCircle size={32} className="mx-auto mb-2" />
                  <p>No source available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FilterControls: React.FC<{
  sourceFilter: string;
  setSourceFilter: (v: string) => void;
  similarityRange: [number, number];
  setSimilarityRange: (v: [number, number]) => void;
  excludeBibliography: boolean;
  setExcludeBibliography: (v: boolean) => void;
  excludeQuotes: boolean;
  setExcludeQuotes: (v: boolean) => void;
  excludeCommonPhrases: boolean;
  setExcludeCommonPhrases: (v: boolean) => void;
  excludeTemplateText: boolean;
  setExcludeTemplateText: (v: boolean) => void;
  citationSeverityReduction: boolean;
  setCitationSeverityReduction: (v: boolean) => void;
  minWordThreshold: number;
  setMinWordThreshold: (v: number) => void;
  sourceContributionThreshold: number;
  setSourceContributionThreshold: (v: number) => void;
}> = ({
  sourceFilter, setSourceFilter,
  similarityRange, setSimilarityRange,
  excludeBibliography, setExcludeBibliography,
  excludeQuotes, setExcludeQuotes,
  excludeCommonPhrases, setExcludeCommonPhrases,
  excludeTemplateText, setExcludeTemplateText,
  citationSeverityReduction, setCitationSeverityReduction,
  minWordThreshold, setMinWordThreshold,
  sourceContributionThreshold, setSourceContributionThreshold,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
      <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
        <Filter size={16} />
        Filters & Settings
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-slate-600 block mb-1">Source Type</label>
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2"
          >
            <option value="all">All Sources</option>
            <option value="academic">Academic</option>
            <option value="web">Web</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-600 block mb-1">Similarity Range</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              max={100}
              value={similarityRange[0]}
              onChange={(e) => setSimilarityRange([Number(e.target.value), similarityRange[1]])}
              className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2"
            />
            <span className="text-slate-400">-</span>
            <input
              type="number"
              min={0}
              max={100}
              value={similarityRange[1]}
              onChange={(e) => setSimilarityRange([similarityRange[0], Number(e.target.value)])}
              className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2"
            />
          </div>
        </div>

        <div className="md:col-span-2 flex flex-wrap gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={excludeBibliography}
              onChange={(e) => setExcludeBibliography(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-[#F36F21] focus:ring-[#F36F21]"
            />
            <span className="text-sm text-slate-600">Exclude Bibliography</span>
          </label>
          
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={excludeQuotes}
              onChange={(e) => setExcludeQuotes(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-[#F36F21] focus:ring-[#F36F21]"
            />
            <span className="text-sm text-slate-600">Exclude Quotes</span>
          </label>
        </div>

        <div className="md:col-span-2 border-t border-slate-200 pt-3 mt-2">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Advanced Exclusions</span>
        </div>

        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={excludeCommonPhrases}
              onChange={(e) => setExcludeCommonPhrases(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-[#F36F21] focus:ring-[#F36F21]"
            />
            <span className="text-sm text-slate-600">Exclude Common Phrases</span>
          </label>
          
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={excludeTemplateText}
              onChange={(e) => setExcludeTemplateText(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-[#F36F21] focus:ring-[#F36F21]"
            />
            <span className="text-sm text-slate-600">Exclude Template Text</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={citationSeverityReduction}
              onChange={(e) => setCitationSeverityReduction(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-[#F36F21] focus:ring-[#F36F21]"
            />
            <span className="text-sm text-slate-600">Citation Severity Reduction</span>
          </label>
        </div>

        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1">Min Words per Match</label>
            <input
              type="number"
              min={1}
              max={50}
              value={minWordThreshold}
              onChange={(e) => setMinWordThreshold(Number(e.target.value))}
              className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1">Min Source Contribution %</label>
            <input
              type="number"
              min={0}
              max={10}
              value={sourceContributionThreshold}
              onChange={(e) => setSourceContributionThreshold(Number(e.target.value))}
              className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const PlagiarismChecker: React.FC = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<PlagiarismResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [useAiSimilarity, setUseAiSimilarity] = useState(true);
  const [excludeSmallMatches, setExcludeSmallMatches] = useState(0);
  const [excludeSmallSources, setExcludeSmallSources] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileText, setFileText] = useState<string>('');
  const [quota, setQuota] = useState<QuotaResponse | null>(null);
  const [quotaLoading, setQuotaLoading] = useState(false);
  const [quotaError, setQuotaError] = useState<string | null>(null);
  const [quotaEndpointUnsupported, setQuotaEndpointUnsupported] = useState(false);
  const [selectedSentenceIndex, setSelectedSentenceIndex] = useState<number | null>(null);
  const [showSideBySide, setShowSideBySide] = useState(false);
  const [sourceFilter, setSourceFilter] = useState('all');
  const [similarityRange, setSimilarityRange] = useState<[number, number]>([0, 100]);
  const [excludeBibliography, setExcludeBibliography] = useState(false);
  const [excludeQuotes, setExcludeQuotes] = useState(false);
  const [excludeCommonPhrases, setExcludeCommonPhrases] = useState(true);
  const [excludeTemplateText, setExcludeTemplateText] = useState(true);
  const [citationSeverityReduction, setCitationSeverityReduction] = useState(true);
  const [minWordThreshold, setMinWordThreshold] = useState(10);
  const [sourceContributionThreshold, setSourceContributionThreshold] = useState(0);
  const [viewMode, setViewMode] = useState<'viewer' | 'sources' | 'details'>('viewer');
  const [eta, setEta] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');

  const canSubmit = useMemo(() => (text.trim().length >= 50 || fileText.trim().length >= 50 || selectedFile !== null), [text, fileText, selectedFile]);

  const [fileContentBase64, setFileContentBase64] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setSelectedFile(file);
    setError(null);
    setFileContentBase64(null);
    
    try {
      let extractedText = '';
      
      if (file.name.endsWith('.txt')) {
        extractedText = await file.text();
      } else if (file.name.endsWith('.docx')) {
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        extractedText = extractTextFromDocx(uint8Array);
      } else if (file.name.endsWith('.pdf')) {
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        const base64 = uint8ArrayToBase64(uint8Array);
        setFileContentBase64(base64);
        extractedText = 'PDF file will be processed on server.';
      } else {
        setError('Unsupported file format. Please use .txt, .docx, .pdf or paste text directly.');
        return;
      }
      
      setFileText(extractedText);
      if (extractedText.trim().length > 0 && extractedText !== 'PDF file will be processed on server.') {
        setText(extractedText);
      }
    } catch (err) {
      console.error('File parsing error:', err);
      setError('Could not parse file. Please paste text directly.');
    }
  };

  const uint8ArrayToBase64 = (uint8Array: Uint8Array): string => {
    let binary = '';
    const chunkSize = 8192;
    for (let i = 0; i < uint8Array.length; i += chunkSize) {
      binary += String.fromCharCode.apply(null, Array.from(uint8Array.subarray(i, i + chunkSize)));
    }
    return btoa(binary);
  };

  const extractTextFromDocx = (uint8Array: Uint8Array): string => {
    const arr = Array.from(uint8Array);
    let text = '';
    let inText = false;
    let currentText = '';
    
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === 0x3C && arr[i + 1] === 0x77) {
        if (inText && currentText.trim()) {
          text += currentText.trim() + ' ';
        }
        inText = false;
        currentText = '';
      }
      
      if (inText) {
        currentText += String.fromCharCode(arr[i]);
      }
      
      if (arr[i] === 0x3E) {
        inText = true;
      }
    }
    
    return text.replace(/\s+/g, ' ').trim();
  };

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
    setEta(null);
    setStatusMessage('Preparing...');

    const startTime = Date.now();
    let lastUpdateTime = startTime;
    let lastProgress = 0;

    const requestPayload: Record<string, unknown> = {
      text,
      max_sentences: 20,
      use_ai_similarity: useAiSimilarity,
      exclude_small_matches: excludeSmallMatches,
      exclude_small_sources: excludeSmallSources,
      exclude_citations: excludeQuotes,
      exclude_common_phrases: excludeCommonPhrases,
      exclude_template_text: excludeTemplateText,
      citation_severity_reduction: citationSeverityReduction,
      min_word_threshold: minWordThreshold,
      source_contribution_threshold: sourceContributionThreshold,
      source_type_filter: sourceFilter !== 'all' ? [sourceFilter] : undefined,
    };

    if (selectedFile && fileContentBase64) {
      requestPayload.file_content = fileContentBase64;
      requestPayload.file_name = selectedFile.name;
    }

    try {
      const headers = await buildHeaders();
      const response = await fetch(`${API_BASE_URL}/tools/plagiarism-check/stream`, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestPayload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Failed to read response stream');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.progress !== undefined) {
                setProgress(data.progress);
                
                if (data.status !== 'complete' && data.progress > 5) {
                  const currentTime = Date.now();
                  const elapsed = (currentTime - startTime) / 1000;
                  const rate = data.progress / elapsed;
                  if (rate > 0) {
                    const remaining = (100 - data.progress) / rate;
                    if (remaining < 60) {
                      setEta(`${Math.ceil(remaining)}s`);
                    } else {
                      setEta(`${Math.ceil(remaining / 60)}m`);
                    }
                  }
                }
                
                if (data.message) {
                  setStatusMessage(data.message);
                }
              }

              if (data.overall_score !== undefined) {
                const response = normalizeResponse(data);
                setResult(response);
                await logHistory({
                  tool: 'plagiarism',
                  request: { text, max_sentences: 20, use_ai_similarity: useAiSimilarity, exclude_small_matches: excludeSmallMatches, exclude_small_sources: excludeSmallSources },
                  response,
                });
              }
            } catch (e) {
              console.error('Failed to parse SSE data:', e);
            }
          }
        }
      }
    } catch (err) {
      console.error(err);
      setError(mapErrorMessage(err));
    } finally {
      setLoading(false);
      setProgress(100);
      setEta(null);
      setStatusMessage('');
      if (!quotaEndpointUnsupported) {
        await fetchQuota();
      }
    }
  };

  const getTurnitinColor = (score: number) => {
    if (score === 0) return { name: 'Blue', bg: 'bg-blue-100', border: 'border-blue-300', text: 'text-blue-700', label: 'Không trùng lặp' };
    if (score <= 24) return { name: 'Green', bg: 'bg-green-100', border: 'border-green-300', text: 'text-green-700', label: 'Trùng lặp thấp' };
    if (score <= 49) return { name: 'Yellow', bg: 'bg-yellow-100', border: 'border-yellow-300', text: 'text-yellow-700', label: 'Trùng lặp vừa' };
    if (score <= 74) return { name: 'Orange', bg: 'bg-orange-100', border: 'border-orange-300', text: 'text-orange-700', label: 'Trùng lặp cao' };
    return { name: 'Red', bg: 'bg-red-100', border: 'border-red-300', text: 'text-red-700', label: 'Trùng lặp rất cao' };
  };

  const exportToPDF = () => {
    if (!result) return;
    
    import('jspdf').then(({ jsPDF }) => {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      let y = margin;
      
      const checkPageBreak = (height: number) => {
        if (y + height > pageHeight - margin) {
          doc.addPage();
          y = margin;
          return true;
        }
        return false;
      };
      
      const getScoreColor = (score: number): [number, number, number] => {
        if (score > 74) return [220, 38, 38];
        if (score > 49) return [249, 115, 22];
        if (score > 24) return [234, 179, 8];
        return [34, 197, 94];
      };
      
      const date = new Date().toLocaleDateString('vi-VN', { 
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
      });
      
      doc.setFillColor(243, 111, 33);
      doc.rect(0, 0, pageWidth, 35, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text('Similarity Report', margin, 22);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('ResMap - FPTU Research Assistant', margin, 31);
      
      y = 50;
      
      const scoreColor = getScoreColor(result.overall_score);
      doc.setFillColor(...scoreColor);
      doc.circle(pageWidth / 2, y + 20, 35, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(32);
      doc.setFont('helvetica', 'bold');
      doc.text(`${result.overall_score}%`, pageWidth / 2, y + 26, { align: 'center' });
      
      y += 50;
      
      const scoreLabel = result.overall_score > 74 ? 'Very High' : 
                       result.overall_score > 49 ? 'High' : 
                       result.overall_score > 24 ? 'Moderate' : 'Low';
      
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(`${scoreLabel} Similarity`, pageWidth / 2, y, { align: 'center' });
      
      y += 15;
      
      doc.setFillColor(243, 243, 243);
      doc.roundedRect(margin, y, pageWidth - 2 * margin, 25, 3, 3, 'F');
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      
      doc.setTextColor(100, 100, 100);
      doc.text('Total Sentences', margin + 15, y + 10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text(`${result.total_sentences}`, margin + 15, y + 20);
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text('Matched', margin + 60, y + 10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text(`${result.plagiarized_sentences}`, margin + 60, y + 20);
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text('Sources', margin + 105, y + 10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text(`${result.report_v2?.source_groups?.length || 0}`, margin + 105, y + 20);
      
      y += 35;
      
      if (result.report_v2?.match_groups && result.report_v2.match_groups.length > 0) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text('Citation Status', margin, y);
        y += 8;
        
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(200, 200, 200);
        
        const groups = result.report_v2.match_groups;
        const total = groups.reduce((sum, g) => sum + g.count, 0);
        const boxWidth = (pageWidth - 2 * margin - 10) / Math.max(groups.length, 1);
        
        groups.forEach((group, idx) => {
          const label = group.group_type === 'cited_and_quoted' ? 'Cited' :
                       group.group_type === 'missing_quotations' ? 'No Quotes' :
                       group.group_type === 'missing_citation' ? 'No Citation' : 'Not Cited';
          
          const color = group.group_type === 'cited_and_quoted' ? [34, 197, 94] :
                       group.group_type === 'missing_quotations' ? [249, 115, 22] :
                       group.group_type === 'missing_citation' ? [234, 179, 8] : [220, 38, 38];
          
          doc.setFillColor(...color);
          doc.roundedRect(margin + idx * boxWidth, y, boxWidth - 2, 20, 2, 2, 'F');
          
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(10);
          doc.setFont('helvetica', 'bold');
          doc.text(`${group.count}`, margin + idx * boxWidth + boxWidth / 2, y + 8, { align: 'center' });
          
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8);
          doc.text(label, margin + idx * boxWidth + boxWidth / 2, y + 16, { align: 'center' });
        });
        
        y += 28;
      }
      
      if (result.report_v2?.source_groups && result.report_v2.source_groups.length > 0) {
        checkPageBreak(30);
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text('Sources', margin, y);
        y += 8;
        
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        
        result.report_v2.source_groups.slice(0, 8).forEach((source) => {
          checkPageBreak(18);
          
          const matchCount = source.spans.length;
          const avgSim = matchCount > 0 
            ? Math.round(source.spans.reduce((sum, s) => sum + s.similarity, 0) / matchCount)
            : 0;
          
          doc.setFillColor(249, 249, 249);
          doc.roundedRect(margin, y, pageWidth - 2 * margin, 16, 2, 2, 'F');
          
          doc.setDrawColor(220, 220, 220);
          doc.line(margin + 2, y, margin + 2, y + 16);
          
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(243, 111, 33);
          doc.text(`${avgSim}%`, margin + 6, y + 10);
          
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(100, 100, 100);
          doc.setFontSize(8);
          
          const hostname = (() => {
            try {
              return new URL(source.canonical_url).hostname;
            } catch {
              return source.canonical_url.substring(0, 30);
            }
          })();
          
          doc.text(`${hostname} (${matchCount} matches)`, margin + 25, y + 6);
          doc.setTextColor(150, 150, 150);
          doc.text(source.canonical_url.substring(0, 60), margin + 25, y + 13);
          
          y += 18;
        });
      }
      
      checkPageBreak(40);
      
      y = pageHeight - 35;
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, y, pageWidth - margin, y);
      
      y += 8;
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`Generated: ${date}`, margin, y);
      doc.text('Page 1', pageWidth - margin, y, { align: 'right' });
      
      y += 5;
      doc.setFontSize(7);
      doc.text('This report is generated by ResMap for educational purposes only.', margin, y);
      y += 4;
      doc.text('Similarity percentage is a tool to help identify potential issues, not a definitive判定 of plagiarism.', margin, y);
      
      doc.save('ResMap_Similarity_Report.pdf');
    });
  };

  const getScoreColor = (score: number) => {
    if (score > 74) return 'text-red-600';
    if (score > 49) return 'text-orange-500';
    if (score > 24) return 'text-yellow-600';
    if (score > 0) return 'text-green-600';
    return 'text-blue-600';
  };

  const getScoreBg = (score: number) => {
    if (score > 74) return 'bg-red-50 border-red-200';
    if (score > 49) return 'bg-orange-50 border-orange-200';
    if (score > 24) return 'bg-yellow-50 border-yellow-200';
    if (score > 0) return 'bg-green-50 border-green-200';
    return 'bg-blue-50 border-blue-200';
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
          
          <div className="mt-3 p-4 rounded-xl border-2 border-dashed border-slate-300 hover:border-[#F36F21] transition-colors">
            <div className="flex items-center justify-center gap-4">
              <label className="flex-1 cursor-pointer">
                <input
                  type="file"
                  accept=".txt,.docx,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  {selectedFile ? selectedFile.name : 'Tải file (.txt, .docx, .pdf)'}
                </span>
              </label>
              {selectedFile && (
                <button
                  type="button"
                  onClick={() => { setSelectedFile(null); setFileText(''); setFileContentBase64(null); }}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Xóa file
                </button>
              )}
            </div>
            <p className="text-xs text-slate-500 text-center mt-2">
              Hỗ trợ .txt, .docx, .pdf - File sẽ được xử lý trên server
            </p>
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
              <div className="flex flex-col items-start">
                <span>Đang phân tích... {progress}%</span>
                {statusMessage && <span className="text-xs opacity-75">{statusMessage}</span>}
                {eta && <span className="text-xs font-medium text-[#F36F21]">~{eta} remaining</span>}
              </div>
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

        {result && (
          <div id="plagiarism-results" className="space-y-6" aria-live="polite">
            <div className="flex justify-between items-center">
              <div className="h-px bg-slate-200 flex-1" />
              <button
                onClick={exportToPDF}
                className="ml-4 px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-2"
              >
                <Download size={16} />
                Xuất PDF
              </button>
            </div>

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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <TurnitinScoreWidget 
                  score={result.overall_score}
                  totalSentences={result.total_sentences}
                  plagiarizedSentences={result.plagiarized_sentences}
                />
                
                {result.ai_detection_score !== undefined && result.ai_detection_score > 0 && (
                  <div className="mt-4 p-4 rounded-xl border-2 bg-purple-50 border-purple-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Sparkles size={20} className="text-purple-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-purple-800">AI Detection</p>
                          <p className="text-sm text-purple-600">
                            <strong>{result.ai_detection_score}%</strong> | 
                            <span className="text-xs ml-1">{result.ai_detection_confidence === 'high' ? 'High' : result.ai_detection_confidence === 'medium' ? 'Medium' : 'Low'} confidence</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="lg:col-span-2 space-y-4">
                <MatchOverviewBar results={result.results} />
                
                <FilterControls
                  sourceFilter={sourceFilter}
                  setSourceFilter={setSourceFilter}
                  similarityRange={similarityRange}
                  setSimilarityRange={setSimilarityRange}
                  excludeBibliography={excludeBibliography}
                  setExcludeBibliography={setExcludeBibliography}
                  excludeQuotes={excludeQuotes}
                  setExcludeQuotes={setExcludeQuotes}
                  excludeCommonPhrases={excludeCommonPhrases}
                  setExcludeCommonPhrases={setExcludeCommonPhrases}
                  excludeTemplateText={excludeTemplateText}
                  setExcludeTemplateText={setExcludeTemplateText}
                  citationSeverityReduction={citationSeverityReduction}
                  setCitationSeverityReduction={setCitationSeverityReduction}
                  minWordThreshold={minWordThreshold}
                  setMinWordThreshold={setMinWordThreshold}
                  sourceContributionThreshold={sourceContributionThreshold}
                  setSourceContributionThreshold={setSourceContributionThreshold}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
                    <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                      <Eye size={16} />
                      View Mode
                    </h4>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={() => setViewMode('viewer')}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-2 ${viewMode === 'viewer' ? 'bg-[#F36F21] text-white' : 'hover:bg-slate-50 text-slate-700'}`}
                    >
                      <FileText size={16} />
                      Document Viewer
                    </button>
                    <button
                      onClick={() => setViewMode('sources')}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-2 ${viewMode === 'sources' ? 'bg-[#F36F21] text-white' : 'hover:bg-slate-50 text-slate-700'}`}
                    >
                      <BookOpen size={16} />
                      All Sources
                    </button>
                    <button
                      onClick={() => setViewMode('details')}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-2 ${viewMode === 'details' ? 'bg-[#F36F21] text-white' : 'hover:bg-slate-50 text-slate-700'}`}
                    >
                      <Search size={16} />
                      Details
                    </button>
                  </div>
                </div>

                {result.report_v2 && result.report_v2.match_groups && result.report_v2.match_groups.length > 0 && (
                  <div className="mt-4 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
                      <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                        <AlertCircle size={16} />
                        Citation Status
                      </h4>
                    </div>
                    <div className="p-4 space-y-2">
                      {result.report_v2.match_groups.map((group) => {
                        const config = {
                          not_cited_or_quoted: { label: 'Not Cited/Quoted', color: 'bg-red-100 border-red-300 text-red-800' },
                          missing_quotations: { label: 'Missing Quotes', color: 'bg-orange-100 border-orange-300 text-orange-800' },
                          missing_citation: { label: 'Missing Citation', color: 'bg-yellow-100 border-yellow-300 text-yellow-800' },
                          cited_and_quoted: { label: 'Cited & Quoted', color: 'bg-green-100 border-green-300 text-green-800' },
                        };
                        const c = config[group.group_type as keyof typeof config] || config.not_cited_or_quoted;
                        return (
                          <div key={group.group_type} className={`p-3 rounded-lg border ${c.color}`}>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{c.label}</span>
                              <span className="text-lg font-bold">{group.count}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="lg:col-span-2">
                {viewMode === 'viewer' && (
                  <DocumentViewer 
                    results={result.results}
                    selectedIndex={selectedSentenceIndex ?? undefined}
                    onSentenceClick={(idx) => {
                      setSelectedSentenceIndex(idx);
                      setShowSideBySide(true);
                    }}
                  />
                )}

                {viewMode === 'sources' && result.report_v2 && result.report_v2.source_groups && (
                  <div className="space-y-3">
                    {result.report_v2.source_groups.map((group) => (
                      <div 
                        key={group.source_id}
                        className="p-4 rounded-lg border border-slate-200 bg-white hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                                group.source_category === 'academic_database' ? 'bg-purple-50 border-purple-200 text-purple-700' :
                                'bg-green-50 border-green-200 text-green-700'
                              }`}>
                                {group.source_category === 'academic_database' ? 'Academic DB' : 'Internet'}
                              </span>
                              <span className="text-xs font-semibold px-2 py-0.5 rounded-full border bg-blue-50 border-blue-200 text-blue-700">
                                {group.credibility_score || 50}/100
                              </span>
                              <span className="text-xs text-slate-500">
                                {group.spans.length} matches
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
                            <div className="flex flex-wrap gap-2">
                              {group.spans.slice(0, 5).map((span, sIndex) => (
                                <button
                                  key={sIndex}
                                  onClick={() => {
                                    setSelectedSentenceIndex(span.sentence_index);
                                    setShowSideBySide(true);
                                  }}
                                  className={`text-xs px-2 py-1 rounded font-medium hover:opacity-80 transition-opacity ${
                                    span.similarity > 50 ? 'bg-red-100 text-red-700' :
                                    span.similarity > 20 ? 'bg-orange-100 text-orange-700' :
                                    'bg-slate-100 text-slate-600'
                                  }`}
                                >
                                  Sentence {span.sentence_index + 1}: {span.similarity}%
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {viewMode === 'details' && (
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
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
                              {item.paraphrase_detected && (
                                <span className="px-2 py-0.5 rounded-full border bg-indigo-100 text-indigo-700 border-indigo-200 font-medium">
                                  Paraphrase
                                </span>
                              )}
                            </div>
                            {item.sources.length > 0 && (
                              <div className="mt-3 pl-3 border-l-2 border-slate-200 space-y-2">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Sources:</p>
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
                )}
              </div>
            </div>

            {showSideBySide && selectedSentenceIndex !== null && result.results[selectedSentenceIndex] && (
              <SideBySidePanel 
                sentence={result.results[selectedSentenceIndex]}
                sourceUrl={result.results[selectedSentenceIndex].sources[0]?.url}
                onClose={() => setShowSideBySide(false)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlagiarismChecker;
