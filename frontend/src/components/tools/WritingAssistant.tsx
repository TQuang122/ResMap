import React, { useMemo, useState } from 'react';
import { Check, Copy, FileText, Loader2, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { postData } from '../../utils/api';
import { logHistory } from '../../utils/logger';

type Task = 'summarize' | 'rewrite';
type Tone = 'academic' | 'simple' | 'formal';

const WritingAssistant: React.FC = () => {
  const [text, setText] = useState('');
  const [task, setTask] = useState<Task>('summarize');
  const [tone, setTone] = useState<Tone>('academic');
  const [outputLanguage, setOutputLanguage] = useState<'vi' | 'en'>('vi');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const canSubmit = useMemo(() => text.trim().length >= 50, [text]);

  const handleRun = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    setCopied(false);

    try {
      const res = await postData('/tools/writing', {
        text,
        task,
        tone,
        output_language: outputLanguage,
      });
      setResult(res.result || '');
      await logHistory({
        tool: 'writing',
        request: { text, task, tone, output_language: outputLanguage },
        response: { result: res.result || '' },
      });
    } catch (e) {
      console.error(e);
      setError('Không thể xử lý lúc này. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center gap-2">
        <FileText size={20} className="text-[#F36F21]" />
        <h3 className="font-bold text-slate-800">Abstract Summarizer & Rewriter</h3>
      </div>

      <div className="p-6 flex flex-col gap-4">
        <div className="p-4 rounded-xl border border-amber-200 bg-amber-50 text-amber-900 text-sm">
          Lưu ý: Công cụ hỗ trợ viết học thuật. Không dùng để gian lận; hãy kiểm tra lại nội dung, không bịa dữ kiện/citation.
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Chế độ</label>
            <select
              value={task}
              onChange={(e) => setTask(e.target.value as Task)}
              className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F36F21] text-sm"
            >
              <option value="summarize">Tóm tắt (Abstract)</option>
              <option value="rewrite">Viết lại (Paraphrase)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Giọng văn</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value as Tone)}
              className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F36F21] text-sm"
            >
              <option value="academic">Academic</option>
              <option value="formal">Formal</option>
              <option value="simple">Simple</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Ngôn ngữ đầu ra</label>
            <select
              value={outputLanguage}
              onChange={(e) => setOutputLanguage(e.target.value as 'vi' | 'en')}
              className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F36F21] text-sm"
            >
              <option value="vi">Tiếng Việt</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Văn bản đầu vào (&gt;= 50 ký tự)</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Dán abstract hoặc đoạn văn cần tóm tắt/viết lại..."
            className="w-full p-4 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F36F21] text-sm min-h-[160px] leading-relaxed resize-y"
          />
          <div className="mt-2 text-xs text-slate-500">
            {text.trim().length} / 50 ký tự tối thiểu
          </div>
        </div>

        <button
          onClick={handleRun}
          disabled={loading || !canSubmit}
          className="self-start px-6 py-3 bg-[#F36F21] text-white font-bold rounded-full hover:bg-orange-600 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none transition-all duration-200 flex items-center gap-2 active:scale-95"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
          {loading ? 'Đang xử lý...' : 'Xử lý văn bản'}
        </button>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 text-sm flex items-center gap-2">
            <span className="font-bold">Lỗi:</span> {error}
          </div>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl border border-slate-200 bg-slate-50"
          >
            <div className="flex items-center justify-between gap-3 mb-3">
              <h4 className="font-bold text-slate-800">Kết quả</h4>
              <button
                onClick={handleCopy}
                className="px-4 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-100 hover:border-slate-300 text-sm font-semibold text-slate-700 flex items-center gap-2 transition-all duration-200"
              >
                {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                {copied ? 'Đã copy' : 'Copy'}
              </button>
            </div>
            <pre className="whitespace-pre-wrap text-sm text-slate-800 leading-relaxed font-sans">{result}</pre>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default WritingAssistant;
