import React, { useState } from 'react';
import { X, BookOpen, Search, FileCheck, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import QueryBuilder from './QueryBuilder';
import SearchResults from './SearchResults';
import PaperScorecard from './PaperScorecard';
import { Paper, ScoreResponse } from '../../../types';

interface PaperHunterModalProps {
  isOpen: boolean;
  onClose: () => void;
  researchQuestion?: string;
}

type TabType = 'query' | 'search' | 'scored';

const TABS: { id: TabType; label: string; icon: React.ReactNode }[] = [
  { id: 'query', label: 'Tạo Query', icon: <Filter size={16} /> },
  { id: 'search', label: 'Tìm kiếm', icon: <Search size={16} /> },
  { id: 'scored', label: 'Đã đánh giá', icon: <FileCheck size={16} /> },
];

const PaperHunterModal: React.FC<PaperHunterModalProps> = ({
  isOpen,
  onClose,
  researchQuestion = '',
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('query');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPapers, setSelectedPapers] = useState<Paper[]>([]);
  const [scoredPapers, setScoredPapers] = useState<Map<string, ScoreResponse>>(new Map());
  const [scoringPaper, setScoringPaper] = useState<Paper | null>(null);
  const [rq, setRq] = useState(researchQuestion);

  const handleSearchFromQuery = (query: string) => {
    setSearchQuery(query);
    setActiveTab('search');
  };

  const handleToggleSelect = (paper: Paper) => {
    setSelectedPapers((prev) => {
      const exists = prev.some((p) => p.id === paper.id);
      if (exists) {
        return prev.filter((p) => p.id !== paper.id);
      }
      return [...prev, paper];
    });
  };

  const handleScorePaper = (paper: Paper) => {
    if (!rq.trim()) {
      alert('Vui lòng nhập câu hỏi nghiên cứu trước khi đánh giá paper');
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
  };

  const getDecisionColor = (decision: string) => {
    switch (decision) {
      case 'keep':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'maybe':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'skip':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-blue-600 to-blue-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <BookOpen size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">ResHunter</h2>
                  <p className="text-blue-100 text-sm">Tìm và sàng lọc tài liệu học thuật</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Research Question Input */}
          <div className="p-4 bg-blue-50 border-b border-blue-100">
            <label className="block text-sm font-medium text-blue-800 mb-2">
              Câu hỏi nghiên cứu của bạn (để AI đánh giá độ liên quan)
            </label>
            <textarea
              value={rq}
              onChange={(e) => setRq(e.target.value)}
              placeholder="VD: How can deep learning improve sentiment analysis accuracy on Vietnamese social media data?"
              className="w-full p-3 rounded-xl border border-blue-200 focus:outline-none focus:border-blue-500 text-sm resize-none"
              rows={2}
            />
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-200">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                {tab.icon}
                {tab.label}
                {tab.id === 'scored' && scoredPapers.size > 0 && (
                  <span className="ml-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                    {scoredPapers.size}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'query' && (
              <QueryBuilder onSearch={handleSearchFromQuery} />
            )}

            {activeTab === 'search' && (
              <SearchResults
                initialQuery={searchQuery}
                onScorePaper={handleScorePaper}
                selectedPapers={selectedPapers}
                onToggleSelect={handleToggleSelect}
              />
            )}

            {activeTab === 'scored' && (
              <div className="space-y-4">
                {scoredPapers.size === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <FileCheck size={48} className="mx-auto mb-4 opacity-30" />
                    <p>Chưa có paper nào được đánh giá</p>
                    <p className="text-sm mt-2">
                      Chuyển sang tab "Tìm kiếm" và click "Đánh giá" trên các paper
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Summary Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="p-4 bg-green-50 rounded-xl border border-green-200 text-center">
                        <div className="text-2xl font-bold text-green-700">
                          {Array.from(scoredPapers.values()).filter((s) => s.decision === 'keep').length}
                        </div>
                        <div className="text-sm text-green-600">Giữ lại</div>
                      </div>
                      <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200 text-center">
                        <div className="text-2xl font-bold text-yellow-700">
                          {Array.from(scoredPapers.values()).filter((s) => s.decision === 'maybe').length}
                        </div>
                        <div className="text-sm text-yellow-600">Cân nhắc</div>
                      </div>
                      <div className="p-4 bg-red-50 rounded-xl border border-red-200 text-center">
                        <div className="text-2xl font-bold text-red-700">
                          {Array.from(scoredPapers.values()).filter((s) => s.decision === 'skip').length}
                        </div>
                        <div className="text-sm text-red-600">Bỏ qua</div>
                      </div>
                    </div>

                    {/* Scored Papers List */}
                    {Array.from(scoredPapers.values())
                      .sort((a, b) => b.overall_score - a.overall_score)
                      .map((score) => (
                        <div
                          key={score.paper_id}
                          className={`p-4 rounded-xl border ${getDecisionColor(score.decision)}`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-slate-900">{score.paper_title}</h4>
                              <p className="text-sm text-slate-600 mt-1">{score.summary}</p>
                            </div>
                            <div className="text-right shrink-0">
                              <div className="text-2xl font-bold">{score.overall_score}</div>
                              <div className="text-xs text-slate-500">/10</div>
                            </div>
                          </div>
                          
                          {/* Quick scores */}
                          <div className="flex flex-wrap gap-2 mt-3">
                            <span className="px-2 py-1 bg-white/50 rounded text-xs">
                              Relevance: {score.relevance.score}
                            </span>
                            <span className="px-2 py-1 bg-white/50 rounded text-xs">
                              Novelty: {score.novelty.score}
                            </span>
                            <span className="px-2 py-1 bg-white/50 rounded text-xs">
                              Method: {score.methodology.score}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Scoring Modal */}
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
