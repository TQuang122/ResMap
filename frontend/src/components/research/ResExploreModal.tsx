import React, { memo, useState, useEffect, useMemo, useCallback } from 'react';
import { LecturerData } from '../../types';
import { supabase } from '../../lib/supabase';
import ResExploreSidebar from './ResExploreSidebar';
import ResExplorePanel from './ResExplorePanel';
import { useToastActions } from '../ui/Toast';

interface ResExploreModalProps {
  isOpen: boolean;
  onClose: () => void;
  lecturers: LecturerData[];
}

const ResExploreModal: React.FC<ResExploreModalProps> = ({ isOpen, onClose, lecturers }) => {
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [interestedIds, setInterestedIds] = useState<Set<string>>(new Set());
  const [savingId, setSavingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const toast = useToastActions();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      loadInterestedLecturers();
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const loadInterestedLecturers = async () => {
    if (!supabase) return;
    setLoading(true);
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;

    if (!userId) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('interested_lecturers')
      .select('lecturer_id')
      .eq('user_id', userId);

    if (!error && data) {
      setInterestedIds(new Set(data.map((item) => item.lecturer_id)));
    }
    setLoading(false);
  };

  const allAreas = useMemo(() => {
    const areas = new Set<string>();
    lecturers.forEach((lecturer) => {
      lecturer.researchAreas.forEach((area) => areas.add(area));
    });
    return Array.from(areas);
  }, [lecturers]);

  const lecturerCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    lecturers.forEach((lecturer) => {
      lecturer.researchAreas.forEach((area) => {
        counts[area] = (counts[area] || 0) + 1;
      });
    });
    return counts;
  }, [lecturers]);

  const filteredLecturers = useMemo(() => {
    let filtered = lecturers;

    if (selectedAreas.length > 0) {
      filtered = filtered.filter((lecturer) =>
        lecturer.researchAreas.some((area) => selectedAreas.includes(area))
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (lecturer) =>
          lecturer.fullName.toLowerCase().includes(query) ||
          lecturer.researchTopics.some((topic) => topic.toLowerCase().includes(query)) ||
          lecturer.department.toLowerCase().includes(query) ||
          lecturer.researchAreas.some((area) => area.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [lecturers, selectedAreas, searchQuery]);

  const handleToggleArea = useCallback((area: string) => {
    setSelectedAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelectedAreas([...allAreas]);
  }, [allAreas]);

  const handleClearAll = useCallback(() => {
    setSelectedAreas([]);
  }, []);

  const handleToggleExpand = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  const handleToggleInterest = async (lecturer: LecturerData, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!supabase) return;

    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;
    if (!userId) {
      toast.info('Yêu cầu đăng nhập', 'Vui lòng đăng nhập để lưu giảng viên quan tâm.');
      return;
    }

    setSavingId(lecturer.id);
    const isInterested = interestedIds.has(lecturer.id);

    if (isInterested) {
      const { error } = await supabase
        .from('interested_lecturers')
        .delete()
        .eq('user_id', userId)
        .eq('lecturer_id', lecturer.id);

      if (!error) {
        setInterestedIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(lecturer.id);
          return newSet;
        });
      }
    } else {
      const { error } = await supabase.from('interested_lecturers').insert({
        user_id: userId,
        lecturer_id: lecturer.id,
        lecturer_name: lecturer.fullName,
        department: lecturer.department,
        research_areas: lecturer.researchAreas,
        research_topics: lecturer.researchTopics,
        lab: lecturer.lab || null,
        email: lecturer.email,
      });

      if (!error) {
        setInterestedIds((prev) => new Set(prev).add(lecturer.id));
      }
    }
    setSavingId(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />

      <div className="relative w-full max-w-6xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden animate-slideUp flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white">
          <div>
            <h2 className="text-xl font-bold text-slate-900">ResExplore</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Khám phá giảng viên và hướng nghiên cứu tại FPT University
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <ResExploreSidebar
            allAreas={allAreas}
            selectedAreas={selectedAreas}
            onToggleArea={handleToggleArea}
            onSelectAll={handleSelectAll}
            onClearAll={handleClearAll}
            lecturerCounts={lecturerCounts}
          />

          <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-sm text-slate-500">Đang tải dữ liệu...</p>
              </div>
            ) : filteredLecturers.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <svg
                  className="w-16 h-16 text-slate-300 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-lg font-medium text-slate-700 mb-1">Không tìm thấy kết quả</h3>
                <p className="text-sm text-slate-500">
                  Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredLecturers.map((lecturer) => (
                  <ResExplorePanel
                    key={lecturer.id}
                    lecturer={lecturer}
                    isExpanded={expandedId === lecturer.id}
                    isInterested={interestedIds.has(lecturer.id)}
                    isSaving={savingId === lecturer.id}
                    onToggle={() => handleToggleExpand(lecturer.id)}
                    onToggleInterest={(e) => handleToggleInterest(lecturer, e)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-200 bg-slate-50">
          <p className="text-sm text-slate-500">
            Hiển thị <span className="font-medium text-slate-700">{filteredLecturers.length}</span> trên tổng số{' '}
            <span className="font-medium text-slate-700">{lecturers.length}</span> giảng viên
          </p>
          {selectedAreas.length > 0 && (
            <p className="text-sm text-slate-500">
              Đã lọc theo: <span className="font-medium text-slate-700">{selectedAreas.join(', ')}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResExploreModal;
