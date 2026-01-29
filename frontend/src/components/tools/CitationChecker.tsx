import React, { useState } from 'react';
import { Check, AlertCircle, RefreshCw, Quote } from 'lucide-react';
import { postData } from '../../utils/api';
import { logHistory } from '../../utils/logger';

const CitationChecker: React.FC = () => {
  const [text, setText] = useState('');
  const [style, setStyle] = useState('APA');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{is_valid: boolean, suggestions: string} | null>(null);

  const handleCheck = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const response = await postData('/tools/check', { text, style });
      setResult(response);
      await logHistory({
        tool: 'citation',
        request: { text, style },
        response,
      });
    } catch (error) {
      console.error(error);
      setResult({ is_valid: false, suggestions: "Lỗi kết nối server." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center gap-2">
        <Quote size={20} className="text-[#F36F21]" />
        <h3 className="font-bold text-slate-800">Kiểm tra Trích dẫn (Citation Checker)</h3>
      </div>
      
      <div className="p-6 flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Chọn định dạng</label>
          <div className="flex gap-4">
            {['APA', 'IEEE'].map((s) => (
              <label key={s} className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="style" 
                  value={s} 
                  checked={style === s} 
                  onChange={(e) => setStyle(e.target.value)}
                  className="accent-[#F36F21]"
                />
                <span className="text-sm font-medium">{s} Style</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Nhập trích dẫn của bạn</label>
          <textarea 
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={style === 'APA' ? "Ví dụ: Nguyen, A. (2023). Title of paper. Journal Name." : "Ví dụ: [1] A. Nguyen, \"Title of paper,\" Journal Name, 2023."}
            className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F36F21] text-sm min-h-[100px]"
          />
        </div>

        <button 
          onClick={handleCheck}
          disabled={loading || !text.trim()}
          className="self-start px-6 py-2 bg-[#F36F21] text-white font-bold rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors flex items-center gap-2"
        >
          {loading ? <RefreshCw size={16} className="animate-spin" /> : <Check size={16} />}
          Kiểm tra ngay
        </button>

        {result && (
          <div className={`mt-4 p-4 rounded-xl border flex items-start gap-3 ${
            result.is_valid ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            {result.is_valid ? <Check className="mt-0.5 shrink-0" /> : <AlertCircle className="mt-0.5 shrink-0" />}
            <div>
              <h4 className="font-bold">{result.is_valid ? "Hợp lệ" : "Cần chỉnh sửa"}</h4>
              <p className="text-sm mt-1">{result.suggestions}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CitationChecker;
