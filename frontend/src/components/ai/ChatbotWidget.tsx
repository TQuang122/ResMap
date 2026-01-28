import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Sparkles, BookOpen } from 'lucide-react';
import { postData } from '../../utils/api';

interface TopicSuggestion {
  title: string;
  description: string;
  difficulty: string;
}

const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [major, setMajor] = useState('');
  const [keywords, setKeywords] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{type: 'bot' | 'user', content: any}[]>([
    { type: 'bot', content: "Chào bạn! Mình là AI ResMap. Bạn đang bí ý tưởng nghiên cứu? Hãy cho mình biết ngành học của bạn nhé!" }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!major) return;

    // Add user message
    setMessages(prev => [...prev, { 
      type: 'user', 
      content: `Ngành: ${major}. Keywords: ${keywords || 'Không có'}` 
    }]);

    setLoading(true);

    try {
      const response = await postData('/chat/suggest', { major, keywords });
      const topics: TopicSuggestion[] = response.topics;

      // Add bot response with topics
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: topics 
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: "Xin lỗi, mình đang gặp sự cố kết nối tới server. Vui lòng thử lại sau! (Hãy chắc chắn backend đang chạy)" 
      }]);
      console.error(error);
    } finally {
      setLoading(false);
      setKeywords(''); // Clear keywords but keep major for refinement
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      
      {/* Chat Window */}
      <div 
        className={`bg-white rounded-2xl shadow-2xl border border-slate-200 w-[350px] md:w-[400px] mb-4 overflow-hidden transition-all duration-300 origin-bottom-right pointer-events-auto ${
          isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 h-0 mb-0'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#F36F21] to-orange-600 p-4 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-white/20 rounded-lg">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="font-bold text-sm">Gợi ý Đề tài AI</h3>
              <p className="text-[10px] text-orange-100">Powered by FPTU ResMap</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Messages Area */}
        <div className="h-[400px] overflow-y-auto p-4 bg-slate-50 flex flex-col gap-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[85%] rounded-2xl p-3 text-sm ${
                  msg.type === 'user' 
                    ? 'bg-[#F36F21] text-white rounded-br-none' 
                    : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-bl-none'
                }`}
              >
                {typeof msg.content === 'string' ? (
                  <p>{msg.content}</p>
                ) : (
                  <div className="flex flex-col gap-3">
                    <p className="font-bold text-[#F36F21]">Gợi ý cho bạn:</p>
                    {msg.content.map((topic: TopicSuggestion, i: number) => (
                      <div key={i} className="p-2 bg-orange-50 rounded-lg border border-orange-100">
                        <h4 className="font-bold text-slate-800 mb-1 flex items-start gap-1">
                          <BookOpen size={14} className="mt-1 shrink-0 text-[#F36F21]" />
                          {topic.title}
                        </h4>
                        <p className="text-xs text-slate-600 mb-1">{topic.description}</p>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                          topic.difficulty === 'Easy' ? 'bg-green-100 text-green-700 border-green-200' :
                          topic.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                          'bg-red-100 text-red-700 border-red-200'
                        }`}>
                          Độ khó: {topic.difficulty}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm border border-slate-100">
                <Loader2 size={18} className="animate-spin text-[#F36F21]" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-slate-100 flex flex-col gap-2">
          <select 
            value={major} 
            onChange={(e) => setMajor(e.target.value)}
            className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#F36F21]"
            required
          >
            <option value="" disabled>Chọn chuyên ngành...</option>
            <option value="SE">Kỹ thuật phần mềm (SE)</option>
            <option value="IA">An toàn thông tin (IA)</option>
            <option value="Biz">Quản trị kinh doanh (Biz)</option>
            <option value="GD">Thiết kế đồ họa (GD)</option>
            <option value="Media">Truyền thông đa phương tiện</option>
            <option value="Lang">Ngôn ngữ</option>
          </select>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="Từ khóa (vd: AI, Marketing...)"
              className="flex-1 text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#F36F21]"
            />
            <button 
              type="submit" 
              disabled={loading || !major}
              className="bg-[#F36F21] text-white p-2 rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
        </form>
      </div>

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 w-14 bg-[#F36F21] hover:bg-orange-600 text-white rounded-full shadow-lg shadow-orange-500/30 flex items-center justify-center transition-all hover:scale-110 active:scale-95 pointer-events-auto"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
      </button>
    </div>
  );
};

export default ChatbotWidget;
