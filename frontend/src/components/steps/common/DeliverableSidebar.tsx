import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle2, Circle, ChevronDown, ChevronUp, X, ClipboardList } from 'lucide-react';
import { DeliverableItem, ThemeColors } from '../../../types';

interface DeliverableSidebarProps {
  stepId: string;
  deliverables: DeliverableItem[];
  theme: ThemeColors;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
  mobileOnly?: boolean; // When true, only render mobile drawer (not desktop sidebar)
}

interface CheckedState {
  [key: string]: boolean;
}

interface NotesState {
  [key: string]: string;
}

const STORAGE_KEY_PREFIX = 'resmap_step_';

const DeliverableSidebar: React.FC<DeliverableSidebarProps> = ({
  stepId,
  deliverables,
  theme,
  isMobileOpen = false,
  onMobileClose,
  mobileOnly = false
}) => {
  const [checkedItems, setCheckedItems] = useState<CheckedState>({});
  const [notes, setNotes] = useState<NotesState>({});
  const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>({});

  // Load from localStorage on mount
  useEffect(() => {
    const savedChecked = localStorage.getItem(`${STORAGE_KEY_PREFIX}${stepId}_checked`);
    const savedNotes = localStorage.getItem(`${STORAGE_KEY_PREFIX}${stepId}_notes`);
    
    if (savedChecked) {
      try {
        setCheckedItems(JSON.parse(savedChecked));
      } catch (e) {
        console.error('Failed to parse checked items:', e);
      }
    }
    
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (e) {
        console.error('Failed to parse notes:', e);
      }
    }

    // Expand first item by default
    if (deliverables.length > 0) {
      setExpandedItems({ [deliverables[0].id]: true });
    }
  }, [stepId, deliverables]);

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${stepId}_checked`, JSON.stringify(checkedItems));
  }, [stepId, checkedItems]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${stepId}_notes`, JSON.stringify(notes));
  }, [stepId, notes]);

  const toggleCheck = useCallback((criteriaKey: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [criteriaKey]: !prev[criteriaKey]
    }));
  }, []);

  const handleNoteChange = useCallback((deliverableId: string, value: string) => {
    setNotes(prev => ({
      ...prev,
      [deliverableId]: value
    }));
  }, []);

  const toggleExpand = useCallback((deliverableId: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [deliverableId]: !prev[deliverableId]
    }));
  }, []);

  const getCompletionCount = (deliverable: DeliverableItem) => {
    const total = deliverable.criteria.length;
    const completed = deliverable.criteria.filter((_, idx) => 
      checkedItems[`${deliverable.id}_${idx}`]
    ).length;
    return { completed, total };
  };

  const sidebarContent = (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-black flex items-center gap-2">
          <ClipboardList size={20} />
          Đầu ra cần có & Tiêu chí
        </h3>
        {onMobileClose && (
          <button
            onClick={onMobileClose}
            className="lg:hidden p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Đóng"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Deliverables List */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {deliverables.map((deliverable) => {
          const { completed, total } = getCompletionCount(deliverable);
          const isExpanded = expandedItems[deliverable.id];
          const isComplete = completed === total;

          return (
            <div
              key={deliverable.id}
              className={`rounded-xl border transition-all duration-200 ${
                isComplete 
                  ? 'border-green-300 bg-green-50/50' 
                  : 'border-white/30 bg-white/20'
              }`}
            >
              {/* Deliverable Header */}
              <button
                onClick={() => toggleExpand(deliverable.id)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-white/10 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    isComplete ? 'bg-green-500 text-white' : theme.accent + ' text-white'
                  }`}>
                    {isComplete ? (
                      <CheckCircle2 size={16} />
                    ) : (
                      <span className="text-xs font-bold">{completed}/{total}</span>
                    )}
                  </div>
                  <span className="font-bold">{deliverable.label}</span>
                </div>
                {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-4 pb-4 space-y-3">
                  {/* Criteria Checkboxes */}
                  <ul className="space-y-2">
                    {deliverable.criteria.map((criterion, idx) => {
                      const key = `${deliverable.id}_${idx}`;
                      const isChecked = checkedItems[key] || false;
                      
                      return (
                        <li key={key}>
                          <button
                            onClick={() => toggleCheck(key)}
                            className={`w-full flex items-start gap-3 p-2 rounded-lg text-left transition-all text-sm ${
                              isChecked 
                                ? 'bg-green-100/50 line-through opacity-70' 
                                : 'hover:bg-white/20'
                            }`}
                          >
                            {isChecked ? (
                              <CheckCircle2 size={18} className="text-green-600 shrink-0 mt-0.5" />
                            ) : (
                              <Circle size={18} className="opacity-50 shrink-0 mt-0.5" />
                            )}
                            <span>{criterion}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>

                  {/* Notes Textarea */}
                  <textarea
                    value={notes[deliverable.id] || ''}
                    onChange={(e) => handleNoteChange(deliverable.id, e.target.value)}
                    placeholder={deliverable.placeholder}
                    rows={3}
                    className="w-full p-3 rounded-lg bg-white/40 border border-white/30 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-300 placeholder:text-gray-400"
                    maxLength={500}
                  />
                  <div className="text-xs text-right opacity-50">
                    {(notes[deliverable.id] || '').length}/500
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar - Only render if NOT mobileOnly */}
      {!mobileOnly && (
        <aside className="hidden lg:block w-full h-full">
          {sidebarContent}
        </aside>
      )}

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={onMobileClose}
          />
          {/* Drawer */}
          <div className={`lg:hidden fixed inset-y-0 left-0 w-[85%] max-w-md z-50 ${theme.bg} ${theme.text} p-6 shadow-2xl overflow-y-auto`}>
            {sidebarContent}
          </div>
        </>
      )}
    </>
  );
};

export default DeliverableSidebar;
