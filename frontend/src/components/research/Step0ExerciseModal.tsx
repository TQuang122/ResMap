import React, { useState, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, ExternalLink, Sparkles, CheckCircle, Calculator, BookOpen } from 'lucide-react';
import {
  STEP0_SLIDES,
  STEP0_SKILL_CHECKLIST,
  STEP0_QUANT_FEEDBACK,
  STEP0_QUAL_FEEDBACK,
  STEP0_TEST_IDS,
  Step0ExerciseState,
  restoreExerciseState,
  saveExerciseState,
  generateGoogleScholarLink
} from '../../data/step0ExerciseSchema';

interface Step0ExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  topicKey: string;
}

const Step0ExerciseModal: React.FC<Step0ExerciseModalProps> = ({
  isOpen,
  onClose,
  topicKey
}) => {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [showQuantFeedback, setShowQuantFeedback] = useState(false);
  const [showQualFeedback, setShowQualFeedback] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  
  const [state, setState] = useState<Step0ExerciseState>(() => 
    restoreExerciseState(topicKey, null)
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setState(restoreExerciseState(topicKey, localStorage.getItem(`resmap_step0_exercise_${topicKey}`)));
    } else {
      document.body.style.overflow = 'unset';
      setShowCelebration(false);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, topicKey]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleKeywordChange = useCallback((index: number, value: string) => {
    setState(prev => {
      const newKeywords = [...prev.keywords];
      newKeywords[index] = { ...newKeywords[index], value };
      const newState = { ...prev, keywords: newKeywords };
      saveExerciseState(topicKey, newState);
      return newState;
    });
  }, [topicKey]);

  const handleGuSelect = useCallback((type: 'quant' | 'qual') => {
    setState(prev => {
      const newState = { ...prev, guArgument: { type } };
      saveExerciseState(topicKey, newState);
      return newState;
    });
    if (type === 'quant') {
      setShowQuantFeedback(true);
      setShowQualFeedback(false);
    } else {
      setShowQualFeedback(true);
      setShowQuantFeedback(false);
    }
  }, [topicKey]);

  const handleSearchTopicChange = useCallback((value: string) => {
    setState(prev => {
      const newState = { ...prev, searchTopic: { value } };
      saveExerciseState(topicKey, newState);
      return newState;
    });
  }, [topicKey]);

  const handleSkillToggle = useCallback((skillId: string) => {
    setState(prev => {
      const newSkills = prev.skills.map(s =>
        s.id === skillId ? { ...s, checked: !s.checked } : s
      );
      const newState = { ...prev, skills: newSkills };
      saveExerciseState(topicKey, newState);
      return newState;
    });
  }, [topicKey]);

  const handleNext = () => {
    if (currentSlide < 4) {
      setCurrentSlide(currentSlide + 1);
    } else {
      setState(prev => {
        const newState = { ...prev, completedAt: new Date().toISOString() };
        saveExerciseState(topicKey, newState);
        return newState;
      });
      setShowCelebration(true);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 1) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const progressPercent = (currentSlide / 4) * 100;
  const canProceed = () => {
    if (currentSlide === 1) {
      return state.keywords.every(k => k.value.trim() !== '');
    }
    if (currentSlide === 2) {
      return state.guArgument.type !== null;
    }
    if (currentSlide === 3) {
      return state.searchTopic.value.trim() !== '';
    }
    return true;
  };

  if (!isOpen) return null;

  const currentSlideData = STEP0_SLIDES[currentSlide - 1];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      data-testid={STEP0_TEST_IDS.MODAL}
    >
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Lộ trình Bước 0</h2>
            <p className="text-sm text-gray-500">Slide {currentSlide}/4</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            data-testid={STEP0_TEST_IDS.CLOSE_BTN}
            aria-label="Đóng"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div 
          className="h-2 bg-gray-100"
          data-testid={STEP0_TEST_IDS.PROGRESS_BAR}
        >
          <motion.div 
            className="h-full bg-gradient-to-r from-[#F36F21] to-[#F09819]"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">{currentSlideData.title}</h3>
              <p className="text-gray-600 mb-6">{currentSlideData.description}</p>

              {currentSlide === 1 && (
                <div className="space-y-4">
                  <div className="space-y-3">
                    {[0, 1, 2].map((idx) => (
                      <input
                        key={idx}
                        type="text"
                        placeholder={`Từ khóa ${idx + 1}...`}
                        value={state.keywords[idx]?.value || ''}
                        onChange={(e) => handleKeywordChange(idx, e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:border-[#F36F21] focus:ring-1 focus:ring-[#F36F21] outline-none transition-colors"
                        data-testid={`${STEP0_TEST_IDS.KEYWORD_INPUT_1.replace('1', String(idx + 1))}`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 italic">Ví dụ: "Transformer", "Self-attention", "Forecasting"</p>
                </div>
              )}

              {currentSlide === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <motion.button
                      onClick={() => handleGuSelect('quant')}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        state.guArgument.type === 'quant'
                          ? 'border-[#F36F21] bg-orange-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      data-testid={STEP0_TEST_IDS.CARD_QUANT}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Calculator className={`w-8 h-8 mb-2 ${state.guArgument.type === 'quant' ? 'text-[#F36F21]' : 'text-gray-400'}`} />
                      <div className="font-semibold text-gray-900">Định lượng</div>
                      <p className="text-xs text-gray-500 mt-1">Thích số, biểu đồ, model</p>
                    </motion.button>

                    <motion.button
                      onClick={() => handleGuSelect('qual')}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        state.guArgument.type === 'qual'
                          ? 'border-[#F36F21] bg-orange-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      data-testid={STEP0_TEST_IDS.CARD_QUAL}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <BookOpen className={`w-8 h-8 mb-2 ${state.guArgument.type === 'qual' ? 'text-[#F36F21]' : 'text-gray-400'}`} />
                      <div className="font-semibold text-gray-900">Định tính</div>
                      <p className="text-xs text-gray-500 mt-1">Thích phỏng vấn, quan sát</p>
                    </motion.button>
                  </div>

                  <AnimatePresence>
                    {showQuantFeedback && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-3 bg-blue-50 rounded-lg border border-blue-200"
                        data-testid={STEP0_TEST_IDS.QUANT_FEEDBACK}
                      >
                        <p className="text-sm text-blue-700">{STEP0_QUANT_FEEDBACK}</p>
                      </motion.div>
                    )}
                    {showQualFeedback && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-3 bg-purple-50 rounded-lg border border-purple-200"
                        data-testid={STEP0_TEST_IDS.QUAL_FEEDBACK}
                      >
                        <p className="text-sm text-purple-700">{STEP0_QUAL_FEEDBACK}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {currentSlide === 3 && (
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Nhập chủ đề nghiên cứu của bạn..."
                    value={state.searchTopic.value}
                    onChange={(e) => handleSearchTopicChange(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:border-[#F36F21] focus:ring-1 focus:ring-[#F36F21] outline-none transition-colors"
                    data-testid={STEP0_TEST_IDS.SEARCH_INPUT}
                  />

                  {state.searchTopic.value.trim() && (
                    <a
                      href={generateGoogleScholarLink(state.searchTopic.value)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all"
                      data-testid={STEP0_TEST_IDS.GOOGLE_SCHOLAR_LINK}
                    >
                      <ExternalLink size={18} />
                      Mở Google Scholar
                      <ChevronRight size={16} />
                    </a>
                  )}
                </div>
              )}

              {currentSlide === 4 && (
                <div className="space-y-3">
                  {STEP0_SKILL_CHECKLIST.map((item, idx) => {
                    const skill = state.skills.find(s => s.id === item.id);
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSkillToggle(item.id)}
                        className={`w-full text-left p-4 rounded-lg border transition-all flex items-center gap-3 ${
                          skill?.checked
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                        data-testid={`${STEP0_TEST_IDS.SKILL_CHECK_1.replace('1', String(idx + 1))}`}
                      >
                        {skill?.checked ? (
                          <CheckCircle size={20} className="text-green-500" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                        )}
                        <span className={skill?.checked ? 'line-through' : ''}>{item.label}</span>
                      </button>
                    );
                  })}

                  {!state.skills.some(s => s.checked) && (
                    <p className="text-sm text-orange-600 p-3 bg-orange-50 rounded-lg">
                      Đừng lo, ResMap sẽ hướng dẫn bạn chuẩn bị những thứ này ở Bước tiếp theo.
                    </p>
                  )}
                </div>
              )}

              {showCelebration && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                  data-testid={STEP0_TEST_IDS.COMPLETION_CELEBRATION}
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 0.5 }}
                  >
                    <Sparkles className="w-16 h-16 mx-auto text-[#F36F21]" />
                  </motion.div>
                  <h4 className="text-2xl font-bold text-gray-900 mt-4">Xong rồi! 🎉</h4>
                  <p className="text-gray-600 mt-2">Bạn không còn là "người lạ" với ngành này nữa.</p>
                  <p className="text-sm text-gray-500 mt-1">Giờ thì vào việc thật thôi!</p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="p-4 border-t border-gray-100 flex justify-between">
          <button
            onClick={handlePrev}
            disabled={currentSlide === 1 || showCelebration}
            className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              currentSlide === 1 || showCelebration
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            data-testid={STEP0_TEST_IDS.PREV_BTN}
          >
            <ChevronLeft size={18} />
            Trước
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed() || showCelebration}
            className={`flex items-center gap-1 px-6 py-2 rounded-lg font-medium transition-all ${
              !canProceed() || showCelebration
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-[#F36F21] text-white hover:bg-orange-600'
            }`}
            data-testid={currentSlide === 4 ? STEP0_TEST_IDS.FINISH_BTN : STEP0_TEST_IDS.NEXT_BTN}
          >
            {currentSlide === 4 ? 'Hoàn thành' : 'Tiếp theo'}
            {currentSlide < 4 && <ChevronRight size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};

const Step0ExerciseModalMemo = memo(Step0ExerciseModal, (prevProps, nextProps) => {
  return (
    prevProps.isOpen === nextProps.isOpen &&
    prevProps.topicKey === nextProps.topicKey
  );
});

export default Step0ExerciseModalMemo;
