import React, { useState } from 'react';
import { Loader2, CheckCircle, XCircle, AlertCircle, X, FileText, Bookmark, Check } from 'lucide-react';
import { postData } from '../../../utils/api';
import { Paper, ScoreResponse, ScoreItem } from '../../../types';
import { supabase } from '../../../lib/supabase';

interface PaperScorecardProps {
  paper: Paper;
  researchQuestion: string;
  onClose: () => void;
  onScored: (score: ScoreResponse) => void;
}

const CRITERIA_LABELS: Record<string, { label: string; description: string }> = {
  relevance: {
    label: 'Relevance',
    description: 'Mức độ liên quan trực tiếp với câu hỏi nghiên cứu',
  },
  novelty: {
    label: 'Novelty',
    description: 'Đóng góp mới (phương pháp, findings, perspectives)',
  },
  methodology: {
    label: 'Methodology',
    description: 'Độ rõ ràng và chặt chẽ của phương pháp',
  },
  reproducibility: {
    label: 'Reproducibility',
    description: 'Khả năng tái lập nghiên cứu',
  },
  citation_context: {
    label: 'Citation Context',
    description: 'Được trích dẫn để khen hay phê bình',
  },
  dataset_fit: {
    label: 'Dataset Fit',
    description: 'Dữ liệu/bối cảnh có phù hợp với nghiên cứu của bạn',
  },
};

const CRITERIA_ORDER = [
  'relevance',
  'novelty',
  'methodology',
  'reproducibility',
  'citation_context',
  'dataset_fit',
];

const PaperScorecard: React.FC<PaperScorecardProps> = ({
  paper,
  researchQuestion,
  onClose,
  onScored,
}) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScoreResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

    const handleScore = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await postData('/papers/score', {
        paper,
        research_question: researchQuestion,
      });
      setResult(response);
      onScored(response);
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'Không thể đánh giá paper. Vui lòng thử lại.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (paper && researchQuestion) {
      handleScore();
    }
  }, [paper.id]);

  const handleSave = async () => {
    if (!result) return;
    if (!supabase) {
      setError('Supabase chưa được cấu hình.');
      return;
    }

    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;
    if (!user) {
      setError('Bạn cần đăng nhập để lưu paper.');
      return;
    }

    setSaving(true);
    setError(null);

    const payload = {
      user_id: user.id,
      paper_id: paper.id,
      title: paper.title,
      authors: paper.authors,
      year: paper.year ?? null,
      venue: paper.venue ?? null,
      abstract: paper.abstract ?? null,
      cited_by_count: paper.cited_by_count,
      open_access_url: paper.open_access_url ?? null,
      scores: result,
      decision: result.decision,
    };

    const { error: saveError } = await supabase
      .from('saved_papers')
      .upsert(payload, { onConflict: 'user_id,paper_id' });

    if (saveError) {
      setError('Không thể lưu paper.');
    } else {
      setSaved(true);
    }
    setSaving(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'bg-green-500';
    if (score >= 6) return 'bg-blue-500';
    if (score >= 4) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getScoreTextColor = (score: number) => {
    if (score >= 8) return 'text-green-700';
    if (score >= 6) return 'text-blue-700';
    if (score >= 4) return 'text-yellow-700';
    return 'text-red-700';
  };

  const getDecisionIcon = (decision: string) => {
    switch (decision) {
      case 'keep':
        return <CheckCircle className="text-green-600" size={24} />;
      case 'maybe':
        return <AlertCircle className="text-yellow-600" size={24} />;
      case 'skip':
        return <XCircle className="text-red-600" size={24} />;
      default:
        return null;
    }
  };

  const getDecisionLabel = (decision: string) => {
    switch (decision) {
      case 'keep':
        return 'Giữ lại';
      case 'maybe':
        return 'Cân nhắc';
      case 'skip':
        return 'Bỏ qua';
      default:
        return decision;
    }
  };

  const getDecisionColor = (decision: string) => {
    switch (decision) {
      case 'keep':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'maybe':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'skip':
        return 'bg-red-100 border-red-300 text-red-800';
      default:
        return 'bg-slate-100 border-slate-300 text-slate-800';
    }
  };

  const renderScoreBar = (score: number) => (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${getScoreColor(score)} transition-all duration-500`}
          style={{ width: `${score * 10}%` }}
        />
      </div>
      <span className={`font-bold text-sm ${getScoreTextColor(score)}`}>
        {score}/10
      </span>
    </div>
  );

  const renderScoreItem = (key: string, item: ScoreItem) => {
    const meta = CRITERIA_LABELS[key];
    return (
      <div key={key} className="p-3 bg-white rounded-lg border border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="font-medium text-slate-800">{meta.label}</span>
            <p className="text-xs text-slate-500">{meta.description}</p>
          </div>
        </div>
        {renderScoreBar(item.score)}
        <p className="mt-2 text-sm text-slate-600">{item.reason}</p>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <FileText size={20} className="text-blue-600" />
            <h3 className="font-bold text-slate-800">Paper Scorecard</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Paper Info */}
        <div className="p-4 border-b border-slate-100 bg-blue-50/50">
          <h4 className="font-medium text-slate-900 mb-1">{paper.title}</h4>
          <p className="text-sm text-slate-600">
            {paper.authors.slice(0, 3).map((a) => a.name).join(', ')}
            {paper.authors.length > 3 && ` +${paper.authors.length - 3}`}
            {paper.year && ` (${paper.year})`}
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 size={48} className="animate-spin text-blue-600 mb-4" />
              <p className="text-slate-600">Đang đánh giá paper với AI...</p>
              <p className="text-sm text-slate-400 mt-2">Có thể mất 10-15 giây</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200">
              {error}
              <button
                onClick={handleScore}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
              >
                Thử lại
              </button>
            </div>
          )}

          {result && (
            <div className="space-y-4">
              {/* Backend Error Warning */}
              {result.error && (
                <div className="p-3 bg-amber-50 text-amber-700 rounded-xl border border-amber-200 text-sm">
                  <p className="font-medium">AI Evaluation Failed:</p>
                  <p className="mt-1 opacity-80">{result.error}</p>
                </div>
              )}

              {/* Decision Banner */}
              <div
                className={`p-4 rounded-xl border-2 flex items-center gap-4 ${getDecisionColor(
                  result.decision
                )}`}
              >
                {getDecisionIcon(result.decision)}
                <div>
                  <div className="font-bold text-lg">
                    {getDecisionLabel(result.decision)}
                  </div>
                  <p className="text-sm opacity-80">
                    Điểm trung bình: {result.overall_score}/10
                  </p>
                </div>
              </div>

              {/* Summary */}
              <div className="p-4 bg-slate-50 rounded-xl">
                <h4 className="font-medium text-slate-800 mb-2">Tóm tắt</h4>
                <p className="text-sm text-slate-600">{result.summary}</p>
              </div>

              {/* Score Details */}
              <div className="space-y-3">
                <h4 className="font-medium text-slate-800">Chi tiết đánh giá</h4>
                {CRITERIA_ORDER.map((key) => {
                  const item = result[key as keyof ScoreResponse] as ScoreItem;
                  if (item && typeof item === 'object' && 'score' in item) {
                    return renderScoreItem(key, item);
                  }
                  return null;
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {result && (
          <div className="p-4 border-t border-slate-200 bg-slate-50">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSave}
                disabled={saving || saved}
                className="flex-1 px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
              >
                {saved ? <Check size={18} /> : <Bookmark size={18} />}
                {saved ? 'Đã lưu vào Profile' : saving ? 'Đang lưu...' : 'Lưu vào Profile'}
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaperScorecard;
