import React, { useState, useEffect } from 'react';
import { X, BookOpen, Search, FileCheck, Bookmark } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SearchResults from './SearchResults';
import PaperScorecard from './PaperScorecard';
import QueryAssistant from './QueryAssistant';
import { Paper, ScoreResponse } from '../../../types';
import { useResearch } from '../../../context/ResearchContext';

interface PaperHunterModalProps {
  isOpen: boolean;
  onClose: () => void;
  researchQuestion?: string;
}

const PaperHunterModal: React.FC<PaperHunterModalProps> = ({
  isOpen,
  onClose,
  researchQuestion = '',
}) => {
  const [viewMode, setViewMode] = useState<'search' | 'saved'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPapers, setSelectedPapers] = useState<Paper[]>([]);
  const [scoredPapers, setScoredPapers] = useState<Map<string, ScoreResponse>>(new Map());
  const [scoringPaper, setScoringPaper] = useState<Paper | null>(null);
  
  // rq is effectively the "Topic" input now
  const [rq, setRq] = useState(researchQuestion);
  const [isRqExpanded, setIsRqExpanded] = useState(false); // New state for collapsing RQ
  const [yearStart, setYearStart] = useState(2020);
  const [yearEnd, setYearEnd] = useState(2025);

  const { topic, addSavedPaper } = useResearch();

  // Auto-fill RQ from Context
  useEffect(() => {
    if (isOpen && topic && !rq) {
      setRq(topic.title);
      // We do NOT auto-fill searchQuery anymore. 
      // We let the AI QueryAssistant suggest keywords first.
    }
  }, [isOpen, topic]);

  const handleToggleSelect = (paper: Paper) => {
    setSelectedPapers((prev) => {
      const exists = prev.some((p) => p.id === paper.id);
      if (exists) return prev.filter((p) => p.id !== paper.id);
      return [...prev, paper];
    });
  };

  const handleScorePaper = (paper: Paper) => {
    if (!rq.trim()) {
      alert('Vui lòng nhập câu hỏi nghiên cứu (Topic) trước khi đánh giá');
      return;
    }
    setScoringPaper(paper);
  };

  const handleScored = (score: ScoreResponse) => {
    setScoredPapers((prev) => {
      const newMap = new Map(prev);
      newMap.set(score.paper_id, score);
      return newMap;
    });

    if (score.decision === 'keep' && scoringPaper) {
      addSavedPaper(scoringPaper);
    }
  };

  const handleBatchScored = (scores: ScoreResponse[]) => {
    if (!scores || scores.length === 0) return;
    setScoredPapers((prev) => {
      const newMap = new Map(prev);
      scores.forEach((s) => newMap.set(s.paper_id, s));
      return newMap;
    });
  };

  const getDecisionColor = (decision: string) => {
    switch (decision) {
      case 'keep': return 'bg-emerald-50 border-emerald-200 text-emerald-800';
      case 'maybe': return 'bg-amber-50 border-amber-200 text-amber-800';
      case 'skip': return 'bg-rose-50 border-rose-200 text-rose-800';
      default: return 'bg-slate-50 border-slate-200 text-slate-800';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.98, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.98, opacity: 0, y: 10 }}
          className="bg-white rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        >
          {/* 1. Header & Search Bar (Fixed Top) */}
          <div className="shrink-0 bg-white border-b border-slate-200 z-10">
            {/* Title Bar */}
            <div className="flex items-center justify-between px-6 py-3 bg-slate-50/50">
              <div className="flex items-center gap-2 text-indigo-700">
                <BookOpen size={20} className="text-indigo-600" />
                <h2 className="font-bold text-lg">ResHunter</h2>
              </div>
              
              {/* View Toggles */}
              <div className="flex bg-slate-200/50 p-1 rounded-lg">
                <button
                  onClick={() => setViewMode('search')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                    viewMode === 'search' 
                      ? 'bg-white text-indigo-600 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Search size={14} className="inline mr-1" />
                  Tìm kiếm
                </button>
                <button
                  onClick={() => setViewMode('saved')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                    viewMode === 'saved' 
                      ? 'bg-white text-indigo-600 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <FileCheck size={14} className="inline mr-1" />
                  Đã đánh giá ({scoredPapers.size})
                </button>
              </div>

              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Smart Search Input Area */}
            {viewMode === 'search' && (
              <div className="px-6 py-4 space-y-4">
                {/* 1. Research Context (Source of Truth for AI) - Collapsible */}
                <div className="bg-indigo-50/50 rounded-xl border border-indigo-100 overflow-hidden transition-all duration-300">
                  <button 
                    onClick={() => setIsRqExpanded(!isRqExpanded)}
                    className="w-full flex items-center justify-between p-3 text-left hover:bg-indigo-100/50 transition-colors"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <div className="shrink-0 w-1 h-8 bg-indigo-400 rounded-full"></div>
                      <div className="min-w-0">
                        <div className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider mb-0.5">
                          Ngữ cảnh nghiên cứu (Context)
                        </div>
                        <div className="text-xs font-medium text-indigo-900 truncate pr-4">
                          {rq || "Chưa nhập ngữ cảnh..."}
                        </div>
                      </div>
                    </div>
                    <span className="text-indigo-400 text-xs font-semibold shrink-0 px-2 py-1 bg-white rounded border border-indigo-100">
                      {isRqExpanded ? 'Thu gọn' : 'Chỉnh sửa'}
                    </span>
                  </button>
                  
                  {isRqExpanded && (
                    <div className="p-3 pt-0 border-t border-indigo-100 bg-white/50">
                      <textarea
                        value={rq}
                        onChange={(e) => setRq(e.target.value)}
                        placeholder="Nhập câu hỏi nghiên cứu đầy đủ để AI hiểu ngữ cảnh..."
                        className="w-full mt-2 p-2 bg-white border border-indigo-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-indigo-500 resize-none h-20 shadow-inner"
                      />
                      <p className="text-[10px] text-indigo-600/70 mt-1 italic flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full inline-block" />
                        AI dùng nội dung này để chấm điểm Relevance.
                      </p>
                    </div>
                  )}
                </div>

                {/* 2. Search Action (Actual Query) */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Từ khóa tìm kiếm (Query)
                  </label>
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                      <input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && setViewMode('search')} // Trigger search on Enter
                        placeholder="Nhập từ khóa ngắn gọn (VD: Quantum SVM Fraud Detection)..."
                        className="w-full pl-4 pr-12 py-3 bg-white border border-slate-300 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-slate-700 placeholder:text-slate-400 shadow-sm"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <Search size={18} />
                      </div>
                    </div>
                    
                    {/* Filters Mini */}
                    <div className="flex gap-2 shrink-0">
                      <select
                        value={yearStart}
                        onChange={(e) => setYearStart(Number(e.target.value))}
                        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 focus:outline-none focus:border-indigo-500"
                      >
                        {[2020, 2021, 2022, 2023, 2024, 2025].map(y => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                      <span className="self-center text-slate-300">-</span>
                      <select
                        value={yearEnd}
                        onChange={(e) => setYearEnd(Number(e.target.value))}
                        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 focus:outline-none focus:border-indigo-500"
                      >
                        {[2020, 2021, 2022, 2023, 2024, 2025].map(y => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* AI Query Assistant (Chips) */}
                <QueryAssistant 
                  topic={rq} 
                  currentSearch={searchQuery} // Pass current search to filter duplicates
                  onSelectQuery={(q) => setSearchQuery(q)} 
                  autoTrigger={!!rq}
                />
              </div>
            )}

          </div>

          {/* 2. Main Content Area (Scrollable) */}
          <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6">
            {viewMode === 'search' ? (
              <SearchResults
                initialQuery={searchQuery}
                onScorePaper={handleScorePaper}
                onBatchScored={handleBatchScored}
                researchQuestion={rq}
                selectedPapers={selectedPapers}
                onToggleSelect={handleToggleSelect}
              />
            ) : (
              // Saved / Scored View
              <div className="space-y-4 max-w-4xl mx-auto">
                {scoredPapers.size === 0 ? (
                  <div className="text-center py-20 opacity-50">
                    <FileCheck size={48} className="mx-auto mb-4" />
                    <p>Chưa có bài báo nào được đánh giá</p>
                  </div>
                ) : (
                  Array.from(scoredPapers.values())
                    .sort((a, b) => b.overall_score - a.overall_score)
                    .map((score) => (
                      <div
                        key={score.paper_id}
                        className={`p-5 rounded-xl border flex gap-4 ${getDecisionColor(score.decision)}`}
                      >
                        <div className="flex-1">
                          <h4 className="font-bold text-lg mb-1">{score.paper_title}</h4>
                          <p className="text-sm opacity-90 leading-relaxed mb-3">{score.summary}</p>
                          <div className="flex gap-2">
                             <span className="px-2 py-1 bg-white/50 rounded text-xs font-bold">
                               Relevance: {score.relevance.score}
                             </span>
                             <span className="px-2 py-1 bg-white/50 rounded text-xs font-bold">
                               Novelty: {score.novelty.score}
                             </span>
                          </div>
                        </div>
                        <div className="text-right">
                           <div className="text-3xl font-black">{score.overall_score}</div>
                           <div className="text-xs font-bold uppercase opacity-60">Score</div>
                        </div>
                      </div>
                    ))
                )}
              </div>
            )}
          </div>

        </motion.div>

        {/* Scoring Modal Overlay */}
        {scoringPaper && (
          <PaperScorecard
            paper={scoringPaper}
            researchQuestion={rq}
            onClose={() => setScoringPaper(null)}
            onScored={handleScored}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default PaperHunterModal;
