import React, { useState } from 'react';
import { Search, Loader2, ExternalLink, FileText, Users, Calendar, Award, ChevronDown, ChevronUp } from 'lucide-react';
import { postData } from '../../../utils/api';
import { Paper, SearchResponse, PaperType } from '../../../types';

interface SearchResultsProps {
  initialQuery?: string;
  onScorePaper: (paper: Paper) => void;
  selectedPapers: Paper[];
  onToggleSelect: (paper: Paper) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ 
  initialQuery = '', 
  onScorePaper,
  selectedPapers,
  onToggleSelect
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [yearStart, setYearStart] = useState(2020);
  const [yearEnd, setYearEnd] = useState(2025);
  const [sortBy, setSortBy] = useState<'relevance' | 'cited_by_count' | 'publication_date'>('relevance');
  const [paperTypes, setPaperTypes] = useState<PaperType[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedPapers, setExpandedPapers] = useState<Set<string>>(new Set());

  React.useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = async (searchQuery?: string) => {
    const q = searchQuery || query;
    if (!q.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await postData('/papers/search', {
        query: q.trim(),
        year_start: yearStart,
        year_end: yearEnd,
        sort_by: sortBy,
        paper_types: paperTypes,
        limit: 20,
      });
      setResult(response);
    } catch (e) {
      console.error(e);
      setError('Không thể tìm kiếm papers. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (paperId: string) => {
    setExpandedPapers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(paperId)) {
        newSet.delete(paperId);
      } else {
        newSet.add(paperId);
      }
      return newSet;
    });
  };

  const isSelected = (paper: Paper) => {
    return selectedPapers.some(p => p.id === paper.id);
  };

  const formatCitations = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Nhập từ khóa tìm kiếm..."
          className="flex-1 p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 text-sm"
        />
        <button
          onClick={() => handleSearch()}
          disabled={loading || !query.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-slate-600">Năm:</span>
          <input
            type="number"
            value={yearStart}
            onChange={(e) => setYearStart(parseInt(e.target.value) || 2020)}
            className="w-20 p-2 rounded-lg border border-slate-200 text-sm"
          />
          <span>-</span>
          <input
            type="number"
            value={yearEnd}
            onChange={(e) => setYearEnd(parseInt(e.target.value) || 2025)}
            className="w-20 p-2 rounded-lg border border-slate-200 text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-600">Sắp xếp:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'relevance' | 'cited_by_count' | 'publication_date')}
            className="p-2 rounded-lg border border-slate-200 text-sm"
          >
            <option value="relevance">Độ liên quan</option>
            <option value="cited_by_count">Trích dẫn nhiều nhất</option>
            <option value="publication_date">Mới nhất</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 text-sm">
          {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>Tìm thấy {result.total_count.toLocaleString()} papers</span>
            <span>{selectedPapers.length} đã chọn để đánh giá</span>
          </div>

          {result.papers.map((paper) => (
            <div
              key={paper.id}
              className={`p-4 bg-white rounded-xl border transition-all ${
                isSelected(paper) 
                  ? 'border-blue-500 bg-blue-50/30' 
                  : 'border-slate-200 hover:border-blue-300'
              }`}
            >
              {/* Header */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={isSelected(paper)}
                  onChange={() => onToggleSelect(paper)}
                  className="mt-1.5 w-4 h-4 accent-blue-600"
                />
                <div className="flex-1 min-w-0">
                  <h4 
                    className="font-medium text-slate-900 cursor-pointer hover:text-blue-600"
                    onClick={() => toggleExpand(paper.id)}
                  >
                    {paper.title}
                  </h4>
                  
                  {/* Meta info */}
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Users size={12} />
                      {paper.authors.slice(0, 3).map(a => a.name).join(', ')}
                      {paper.authors.length > 3 && ` +${paper.authors.length - 3}`}
                    </span>
                    {paper.year && (
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {paper.year}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Award size={12} />
                      {formatCitations(paper.cited_by_count)} citations
                    </span>
                    {paper.venue && (
                      <span className="flex items-center gap-1 text-blue-600">
                        <FileText size={12} />
                        {paper.venue.length > 40 ? paper.venue.slice(0, 40) + '...' : paper.venue}
                      </span>
                    )}
                  </div>

                  {/* Concepts/Tags */}
                  {paper.concepts.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {paper.concepts.slice(0, 4).map((concept, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full"
                        >
                          {concept}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onScorePaper(paper)}
                    className="px-3 py-1.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    Đánh giá
                  </button>
                  {paper.open_access_url && (
                    <a
                      href={paper.open_access_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Open Access PDF"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                  <button
                    onClick={() => toggleExpand(paper.id)}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    {expandedPapers.has(paper.id) ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </button>
                </div>
              </div>

              {/* Expanded Abstract */}
              {expandedPapers.has(paper.id) && paper.abstract && (
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {paper.abstract}
                  </p>
                  {paper.doi && (
                    <a
                      href={`https://doi.org/${paper.doi.replace('https://doi.org/', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-2 text-xs text-blue-600 hover:underline"
                    >
                      DOI: {paper.doi}
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!result && !loading && (
        <div className="text-center py-12 text-slate-500">
          <Search size={48} className="mx-auto mb-4 opacity-30" />
          <p>Nhập từ khóa để bắt đầu tìm kiếm papers</p>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
