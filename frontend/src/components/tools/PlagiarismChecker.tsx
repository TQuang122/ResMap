import React, { useState } from 'react';
import { Search, AlertTriangle, CheckCircle, Loader2, ExternalLink } from 'lucide-react';
import { postData } from '../../utils/api';
import { logHistory } from '../../utils/logger';

interface Source {
  url: string;
  similarity: number;
}

interface SentenceResult {
  sentence: string;
  similarity: number;
  sources: Source[];
  is_plagiarized: boolean;
}

interface PlagiarismResponse {
  overall_score: number;
  plagiarism_percentage: number;
  total_sentences: number;
  plagiarized_sentences: number;
  results: SentenceResult[];
}

const PlagiarismChecker: React.FC = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PlagiarismResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async () => {
    if (!text.trim() || text.length < 50) return;
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await postData('/tools/plagiarism-check', { 
        text,
        max_sentences: 20
      });
      setResult(response);
      await logHistory({
        tool: 'plagiarism',
        request: { text, max_sentences: 20 },
        response,
      });
    } catch (err) {
      console.error(err);
      setError("Có lỗi xảy ra khi kết nối tới server. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
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

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
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
            className="w-full p-4 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F36F21] text-sm min-h-[200px] leading-relaxed resize-y"
          />
          <div className="mt-2 flex justify-between text-xs text-slate-500">
            <span className={text.length < 50 ? 'text-orange-500' : 'text-green-600'}>
              {text.length} / 50 ký tự tối thiểu
            </span>
            <span>Khuyên dùng: Kiểm tra từng đoạn ngắn để có kết quả tốt nhất.</span>
          </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={handleCheck}
          disabled={loading || text.length < 50}
          className="self-start px-8 py-3 bg-[#F36F21] text-white font-bold rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-sm hover:shadow-md"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Đang phân tích (có thể mất 30-60s)...
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
          <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-3 border border-red-200">
            <AlertTriangle size={20} />
            <p>{error}</p>
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className="space-y-6">
            <div className="h-px bg-slate-200 w-full" />
            
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
