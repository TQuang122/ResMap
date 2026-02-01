import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Plus, Trash2, CheckCircle2, AlertTriangle, FileText, Download, Target, Database, Settings, Cpu, Activity, BarChart2 } from 'lucide-react';
import { ThemeColors } from '../../types';
import { useResearch } from '../../context/ResearchContext';

interface ResBlueprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: ThemeColors;
}

// Default theme if not provided
const defaultTheme: ThemeColors = {
  name: 'green',
  primary: 'bg-emerald-600',
  secondary: 'bg-emerald-100',
  accent: 'bg-emerald-500',
  text: 'text-slate-900',
  accentText: 'text-emerald-600',
  border: 'border-emerald-200',
  borderColor: '#10b981', // emerald-500
  glass: 'bg-white/90',
  gradient: 'from-emerald-50 to-teal-50'
};

// Types for State
interface ScopeState {
  willDo: string[];
  wontDo: string[];
}

interface CanvasBlockData {
  title: string;
  question: string;
  fields: Record<string, string>;
  isComplete: boolean;
}

interface CanvasState {
  data: CanvasBlockData;
  preprocessing: CanvasBlockData;
  method: CanvasBlockData;
  procedure: CanvasBlockData;
  evaluation: CanvasBlockData;
  analysis: CanvasBlockData;
}

type CanvasKey = keyof CanvasState;

const ResBlueprintModal: React.FC<ResBlueprintModalProps> = ({ isOpen, onClose, theme = defaultTheme }) => {
  const [activeTab, setActiveTab] = useState<'scope' | 'canvas' | 'export'>('scope');
  
  const { topic, savedPapers } = useResearch();

  // Print Style
  const printStyle = `
    @media print {
      body * {
        visibility: hidden;
      }
      #print-area, #print-area * {
        visibility: visible;
      }
      #print-area {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        margin: 0;
        padding: 0;
        background: white;
        z-index: 99999;
      }
      /* Prevent blank pages by forcing body/html height */
      html, body {
        height: auto !important;
        overflow: hidden !important;
      }
      @page {
        size: A4;
        margin: 15mm;
      }
    }
  `;

  // --- STATE: SCOPE BUILDER ---
  const [scope, setScope] = useState<ScopeState>({
    willDo: [],
    wontDo: []
  });
  
  // Auto-fill from Context
  useEffect(() => {
    if (isOpen) {
      if (topic && scope.willDo.length === 0) {
        setScope(prev => ({
          ...prev,
          willDo: [
            `Đề tài: ${topic.title}`,
            ...prev.willDo
          ]
        }));
      }
      
      // Auto-fill Data block if papers exist
      if (savedPapers.length > 0 && !canvas.data.fields.source) {
        const paperSources = savedPapers.slice(0, 3).map(p => p.title).join(', ');
        setCanvas(prev => ({
          ...prev,
          data: {
            ...prev.data,
            fields: {
              ...prev.data.fields,
              source: `Tham khảo từ các bài báo: ${paperSources}...`
            }
          }
        }));
      }
    }
  }, [isOpen, topic, savedPapers]);

  const [tempWillDo, setTempWillDo] = useState('');
  const [tempWontDo, setTempWontDo] = useState('');

  // --- STATE: METHODOLOGY CANVAS ---
  const [canvas, setCanvas] = useState<CanvasState>({
    data: {
      title: 'Data / Input',
      question: 'Dữ liệu đến từ đâu và như thế nào?',
      fields: { source: '', size: '', type: '' },
      isComplete: false
    },
    preprocessing: {
      title: 'Preprocessing',
      question: 'Bạn xử lý dữ liệu thô như thế nào?',
      fields: { cleaning: '', transformation: '', split: '' },
      isComplete: false
    },
    method: {
      title: 'Method / Model',
      question: '"Vũ khí" chính bạn dùng là gì?',
      fields: { framework: '', architecture: '', reasoning: '' },
      isComplete: false
    },
    procedure: {
      title: 'Procedure',
      question: 'Quá trình thực hiện diễn ra sao?',
      fields: { steps: '', params: '', tools: '' },
      isComplete: false
    },
    evaluation: {
      title: 'Evaluation',
      question: 'Làm sao biết kết quả tốt hay xấu?',
      fields: { metrics: '', baseline: '' },
      isComplete: false
    },
    analysis: {
      title: 'Analysis',
      question: 'Bạn sẽ bàn luận gì về kết quả?',
      fields: { errors: '', insights: '', limitations: '' },
      isComplete: false
    }
  });

  const [activeBlock, setActiveBlock] = useState<CanvasKey | null>(null);

  // --- HANDLERS: SCOPE ---
  const addScopeItem = (type: 'willDo' | 'wontDo') => {
    const val = type === 'willDo' ? tempWillDo : tempWontDo;
    if (!val.trim()) return;
    
    setScope(prev => ({
      ...prev,
      [type]: [...prev[type], val]
    }));
    
    if (type === 'willDo') setTempWillDo('');
    else setTempWontDo('');
  };

  const removeScopeItem = (type: 'willDo' | 'wontDo', idx: number) => {
    setScope(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== idx)
    }));
  };

  // --- HANDLERS: CANVAS ---
  const updateCanvasField = (blockKey: CanvasKey, fieldKey: string, value: string) => {
    setCanvas(prev => {
      const block = prev[blockKey];
      const newFields = { ...block.fields, [fieldKey]: value };
      
      // Simple validation: check if all fields have some content
      const isComplete = Object.values(newFields).every(v => v.trim().length > 0);

      return {
        ...prev,
        [blockKey]: { ...block, fields: newFields, isComplete }
      };
    });
  };

  // --- ICONS MAPPING ---
  const getBlockIcon = (key: CanvasKey) => {
    switch (key) {
      case 'data': return <Database size={20} />;
      case 'preprocessing': return <Settings size={20} />;
      case 'method': return <Cpu size={20} />;
      case 'procedure': return <Activity size={20} />;
      case 'evaluation': return <Target size={20} />;
      case 'analysis': return <BarChart2 size={20} />;
    }
  };

  // --- RENDER: SCOPE TAB ---
  const renderScopeTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
      {/* What I WILL DO */}
      <div className="bg-green-50/50 rounded-2xl border border-green-200 p-6 flex flex-col h-full">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <h3 className="font-bold text-green-900 text-lg">What I WILL DO</h3>
            <p className="text-sm text-green-700">Phạm vi bạn cam kết thực hiện</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
          {scope.willDo.length === 0 && (
            <div className="text-center py-10 text-green-400 italic">
              Chưa có mục nào. Hãy thêm các nhiệm vụ chính, dữ liệu sẽ dùng, hoặc phương pháp cụ thể.
            </div>
          )}
          {scope.willDo.map((item, idx) => (
            <div key={idx} className="bg-white p-3 rounded-xl border border-green-100 shadow-sm flex items-start gap-3 group">
              <span className="text-green-500 font-bold mt-0.5">•</span>
              <span className="flex-1 text-slate-700">{item}</span>
              <button 
                onClick={() => removeScopeItem('willDo', idx)}
                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-auto">
          <input
            type="text"
            value={tempWillDo}
            onChange={(e) => setTempWillDo(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addScopeItem('willDo')}
            placeholder="Ví dụ: Sử dụng bộ dữ liệu VinDr-CXR..."
            className="flex-1 px-4 py-2 rounded-xl border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-500/20"
          />
          <button 
            onClick={() => addScopeItem('willDo')}
            className="w-10 h-10 rounded-xl bg-green-600 text-white flex items-center justify-center hover:bg-green-700 transition-colors"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* What I WON'T DO */}
      <div className="bg-red-50/50 rounded-2xl border border-red-200 p-6 flex flex-col h-full">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 className="font-bold text-red-900 text-lg">What I WON'T DO</h3>
            <p className="text-sm text-red-700">Giới hạn để tránh lan man</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
          {scope.wontDo.length === 0 && (
            <div className="text-center py-10 text-red-400 italic">
              Chưa có mục nào. Hãy loại trừ các trường hợp ngoại lệ, phần cứng không hỗ trợ, v.v.
            </div>
          )}
          {scope.wontDo.map((item, idx) => (
            <div key={idx} className="bg-white p-3 rounded-xl border border-red-100 shadow-sm flex items-start gap-3 group">
              <span className="text-red-500 font-bold mt-0.5">×</span>
              <span className="flex-1 text-slate-700">{item}</span>
              <button 
                onClick={() => removeScopeItem('wontDo', idx)}
                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-auto">
          <input
            type="text"
            value={tempWontDo}
            onChange={(e) => setTempWontDo(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addScopeItem('wontDo')}
            placeholder="Ví dụ: Không xử lý ảnh chất lượng thấp..."
            className="flex-1 px-4 py-2 rounded-xl border border-red-200 focus:outline-none focus:ring-2 focus:ring-red-500/20"
          />
          <button 
            onClick={() => addScopeItem('wontDo')}
            className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-colors"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
    </div>
  );

  // --- RENDER: CANVAS TAB ---
  const renderCanvasTab = () => (
    <div className="h-full flex flex-col">
      {/* Visual Pipeline */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4 min-h-[180px] flex items-center justify-center">
        <div className="flex items-center gap-4 px-4 min-w-max">
          {(Object.keys(canvas) as CanvasKey[]).map((key, idx, arr) => {
            const block = canvas[key];
            const isActive = activeBlock === key;
            const isLast = idx === arr.length - 1;

            return (
              <React.Fragment key={key}>
                {/* Block */}
                <button
                  onClick={() => setActiveBlock(key)}
                  className={`
                    relative w-40 h-32 rounded-xl border-2 flex flex-col items-center justify-center p-3 gap-2 transition-all duration-300
                    ${isActive 
                      ? 'border-emerald-500 bg-emerald-50 shadow-lg scale-105 z-10' 
                      : block.isComplete
                        ? 'border-green-200 bg-white hover:border-emerald-300'
                        : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300'}
                  `}
                >
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center mb-1
                    ${isActive 
                      ? 'bg-emerald-500 text-white' 
                      : block.isComplete 
                        ? 'bg-green-100 text-green-600'
                        : 'bg-slate-200 text-slate-500'}
                  `}>
                    {getBlockIcon(key)}
                  </div>
                  <div className="text-center">
                    <div className={`text-xs font-bold uppercase tracking-wider mb-0.5 ${isActive ? 'text-emerald-700' : 'text-slate-500'}`}>
                      {idx + 1}. {key}
                    </div>
                    <div className={`font-semibold text-sm leading-tight ${isActive ? 'text-emerald-900' : 'text-slate-700'}`}>
                      {block.title}
                    </div>
                  </div>
                  
                  {/* Status indicator */}
                  <div className="absolute top-2 right-2">
                    {block.isComplete && <div className="w-2 h-2 rounded-full bg-green-500" />}
                  </div>
                </button>

                {/* Arrow */}
                {!isLast && (
                  <div className="text-slate-300">
                    <ArrowRight size={24} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Editing Panel (Drawer) */}
      <AnimatePresence mode="wait">
        {activeBlock ? (
          <motion.div
            key={activeBlock}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="h-[320px] bg-white border-t border-slate-200 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] p-6 md:p-8 flex flex-col md:flex-row gap-8"
          >
            {/* Left: Guide */}
            <div className="md:w-1/3 border-r border-slate-100 pr-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  {getBlockIcon(activeBlock)}
                </div>
                <h4 className="font-bold text-slate-900 text-lg">{canvas[activeBlock].title}</h4>
              </div>
              <p className="text-slate-600 font-medium mb-4">
                {canvas[activeBlock].question}
              </p>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Lời khuyên</div>
              <p className="text-sm text-slate-500 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                Hãy điền ngắn gọn nhưng đủ ý. Với khối ngành IT, cần chỉ rõ tên công nghệ, thư viện, hoặc thuật toán cụ thể thay vì nói chung chung.
              </p>
            </div>

            {/* Right: Form Fields */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto">
              {Object.entries(canvas[activeBlock].fields).map(([fieldKey, value]) => (
                <div key={fieldKey} className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase block">
                    {fieldKey}
                  </label>
                  <textarea
                    value={value}
                    onChange={(e) => updateCanvasField(activeBlock, fieldKey, e.target.value)}
                    className="w-full h-32 p-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 resize-none text-sm leading-relaxed"
                    placeholder={`Nhập thông tin cho ${fieldKey}...`}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="h-[320px] flex flex-col items-center justify-center text-slate-400 border-t border-slate-100 bg-slate-50/50">
            <Target size={48} className="mb-4 opacity-50" />
            <p className="font-medium">Chọn một khối ở trên để bắt đầu chỉnh sửa</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );

  const handlePrint = () => {
    // Strategy: Create an iframe, write content, print, then remove
    const printContent = document.getElementById('print-area');
    if (!printContent) return;

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(`
        <html>
          <head>
            <title>Research Blueprint - ResMap</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              @page { size: A4; margin: 15mm; }
              body { font-family: sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              ul { padding-left: 20px; }
              li { margin-bottom: 4px; }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
          </body>
        </html>
      `);
      doc.close();

      // Wait for Tailwind CDN (brief delay) or images to load if any
      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        // Remove iframe after print (with delay to ensure print dialog opened)
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1000);
      }, 500);
    }
  };

  // --- RENDER: EXPORT TAB ---
  const renderExportTab = () => (
    <div className="h-full bg-slate-100/50 p-4 md:p-8 overflow-y-auto flex justify-center">
      <div className="w-full max-w-[210mm] bg-white shadow-xl p-[10mm] min-h-[297mm] text-slate-900 mx-auto" id="print-area">
        {/* Header */}
        <div className="border-b-2 border-slate-900 pb-4 mb-8">
          <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900 mb-2">Approach & Methodology</h1>
          <div className="flex justify-between text-sm text-slate-500 font-medium">
            <span>Research Blueprint Artifact</span>
            <span>Generated by ResMap</span>
          </div>
        </div>

        {/* 1. Scope Section */}
        <div className="mb-8">
          <h2 className="text-lg font-bold uppercase tracking-wider text-slate-900 mb-4 border-l-4 border-slate-900 pl-3">
            1. Research Scope
          </h2>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-green-700 text-sm uppercase mb-2">In Scope</h3>
              <ul className="list-disc list-outside ml-4 space-y-1 text-sm text-slate-700">
                {scope.willDo.length > 0 ? scope.willDo.map((item, i) => <li key={i}>{item}</li>) : <li className="italic text-slate-400">Not specified</li>}
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-red-700 text-sm uppercase mb-2">Out of Scope</h3>
              <ul className="list-disc list-outside ml-4 space-y-1 text-sm text-slate-700">
                {scope.wontDo.length > 0 ? scope.wontDo.map((item, i) => <li key={i}>{item}</li>) : <li className="italic text-slate-400">Not specified</li>}
              </ul>
            </div>
          </div>
        </div>

        {/* 2. Methodology Pipeline */}
        <div className="mb-8">
          <h2 className="text-lg font-bold uppercase tracking-wider text-slate-900 mb-4 border-l-4 border-slate-900 pl-3">
            2. Methodology Pipeline
          </h2>
          <div className="space-y-6">
            {(Object.keys(canvas) as CanvasKey[]).map((key) => {
              const block = canvas[key];
              return (
                <div key={key} className="flex gap-4">
                  <div className="w-32 shrink-0 pt-1">
                    <div className="font-bold text-slate-900 uppercase text-sm">{block.title}</div>
                  </div>
                  <div className="flex-1 grid grid-cols-3 gap-4 border-l border-slate-200 pl-4">
                    {Object.entries(block.fields).map(([fieldKey, val]) => (
                      <div key={fieldKey}>
                        <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">{fieldKey}</div>
                        <div className="text-sm text-slate-700">{val || '—'}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-4 border-t border-slate-200 text-center text-xs text-slate-400">
          Created with ResMap - The Research Assistant for Students
        </div>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <style>{printStyle}</style>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-6xl h-[85vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${theme.accent} text-white flex items-center justify-center shadow-lg shadow-emerald-500/20`}>
                <FileText size={20} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900">ResBlueprint</h2>
                <p className="text-sm text-slate-500 font-medium">Xây dựng phương pháp nghiên cứu mạch lạc</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="px-6 border-b border-slate-200 bg-white">
            <div className="flex gap-8">
              {[
                { id: 'scope', label: '1. Phạm vi (Scope)', icon: Target },
                { id: 'canvas', label: '2. Methodology Canvas', icon: Activity },
                { id: 'export', label: '3. Xuất bản', icon: Download },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`
                    py-4 px-2 text-sm font-bold flex items-center gap-2 border-b-2 transition-all
                    ${activeTab === tab.id 
                      ? `border-emerald-600 text-emerald-600` 
                      : 'border-transparent text-slate-500 hover:text-slate-700'}
                  `}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-hidden bg-slate-50 relative">
            {activeTab === 'scope' && <div className="p-6 h-full">{renderScopeTab()}</div>}
            {activeTab === 'canvas' && <div className="h-full pt-6">{renderCanvasTab()}</div>}
            {activeTab === 'export' && renderExportTab()}
          </div>

          {/* Footer Actions (Only for Export tab usually, or universal nav) */}
          <div className="px-6 py-4 border-t border-slate-200 bg-white flex justify-between items-center">
            <div className="text-xs text-slate-400 font-medium">
              * Dữ liệu được lưu tạm thời trên trình duyệt
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-slate-600 font-bold text-sm hover:bg-slate-100 transition-colors"
              >
                Đóng
              </button>
              {activeTab === 'export' ? (
                <button
                  onClick={handlePrint}
                  className={`px-6 py-2 rounded-lg ${theme.accent} text-white font-bold text-sm shadow-lg shadow-emerald-500/25 hover:opacity-90 transition-opacity flex items-center gap-2`}
                >
                  <Download size={16} />
                  In / Lưu PDF
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (activeTab === 'scope') setActiveTab('canvas');
                    else if (activeTab === 'canvas') setActiveTab('export');
                  }}
                  className={`px-6 py-2 rounded-lg ${theme.accent} text-white font-bold text-sm shadow-lg shadow-emerald-500/25 hover:opacity-90 transition-opacity flex items-center gap-2`}
                >
                  Tiếp tục
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ResBlueprintModal;
