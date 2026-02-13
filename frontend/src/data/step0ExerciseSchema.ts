// Step 0 Exercise Modal - Data Schema and Types (v2.0 - Interactive Roadmap)
// Version: 2.0.0

export interface Step0Keyword {
  id: string;
  value: string;
}

export interface Step0GuArgument {
  type: 'quant' | 'qual' | null;
}

export interface Step0SearchTopic {
  value: string;
}

export interface Step0SkillCheck {
  id: string;
  checked: boolean;
}

export interface Step0ExerciseState {
  version: 2;
  topicKey: string;
  keywords: Step0Keyword[];
  guArgument: Step0GuArgument;
  searchTopic: Step0SearchTopic;
  skills: Step0SkillCheck[];
  completedAt: string | null;
  updatedAt: string;
}

export interface Step0Slide {
  id: number;
  title: string;
  description: string;
}

export const STEP0_SLIDES: Step0Slide[] = [
  {
    id: 1,
    title: '🔑 Nhặt "Mật mã" ngành',
    description: 'Đừng đọc cả cuốn sách. Hãy nhìn vào tiêu đề các bài báo gần đây và điền 3 từ bạn thấy nhiều nhất.'
  },
  {
    id: 2,
    title: '🧪 Bạn thuộc "Hệ" nào?',
    description: 'Mỗi ngành có một cách "nói chuyện" khác nhau. Chọn lĩnh vực của bạn:'
  },
  {
    id: 3,
    title: '📍 Tìm bài "Huyền thoại"',
    description: 'Đừng bơi giữa biển. Hãy tìm các bài Review hoặc Survey.'
  },
  {
    id: 4,
    title: '🎒 Hành trang tối thiểu',
    description: 'Để không bị "sang chấn", bạn cần tích vào những ô này:'
  }
];

export const STEP0_SKILL_CHECKLIST = [
  { id: 'skill1', label: 'Đọc lướt Abstract mà không cần từ điển' },
  { id: 'skill2', label: 'Biết dùng AI để giải thích thuật ngữ khó' },
  { id: 'skill3', label: 'Có một thư mục để lưu file PDF (Zotero/Mendeley)' }
];

export const STEP0_QUANT_FEEDBACK = "Hãy tập trung vào phần Methodology và Result trong bài báo nhé!";
export const STEP0_QUAL_FEEDBACK = "Hãy chú ý đến phần Discussion và Findings - nơi tác giả chia sẻ insights!";

export const STEP0_STORAGE_KEY_PREFIX = 'resmap_step0_exercise_';

export const STEP0_TEST_IDS = {
  TRIGGER: 'step0-exercise-trigger',
  MODAL: 'step0-exercise-modal',
  CLOSE_BTN: 'step0-close-btn',
  PROGRESS_BAR: 'step0-progress-bar',
  
  // Slide 1 - Keywords
  KEYWORD_INPUT_1: 'step0-keyword-1',
  KEYWORD_INPUT_2: 'step0-keyword-2',
  KEYWORD_INPUT_3: 'step0-keyword-3',
  
  // Slide 2 - Gu Argument
  CARD_QUANT: 'step0-card-quant',
  CARD_QUAL: 'step0-card-qual',
  QUANT_FEEDBACK: 'step0-quant-feedback',
  QUAL_FEEDBACK: 'step0-qual-feedback',
  
  // Slide 3 - Search
  SEARCH_INPUT: 'step0-search-topic',
  SEARCH_BTN: 'step0-search-btn',
  GOOGLE_SCHOLAR_LINK: 'step0-google-scholar-link',
  
  // Slide 4 - Skills
  SKILL_CHECK_1: 'step0-skill-check-1',
  SKILL_CHECK_2: 'step0-skill-check-2',
  SKILL_CHECK_3: 'step0-skill-check-3',
  
  // Navigation
  NEXT_BTN: 'step0-next-btn',
  PREV_BTN: 'step0-prev-btn',
  FINISH_BTN: 'step0-finish-btn',
  
  // Completion
  COMPLETION_CELEBRATION: 'step0-celebration'
} as const;

export function getDefaultExerciseState(topicKey: string): Step0ExerciseState {
  return {
    version: 2,
    topicKey,
    keywords: [
      { id: 'kw1', value: '' },
      { id: 'kw2', value: '' },
      { id: 'kw3', value: '' }
    ],
    guArgument: { type: null },
    searchTopic: { value: '' },
    skills: STEP0_SKILL_CHECKLIST.map(item => ({
      id: item.id,
      checked: false
    })),
    completedAt: null,
    updatedAt: new Date().toDateString()
  };
}

export function restoreExerciseState(topicKey: string, stored: string | null): Step0ExerciseState {
  const defaultState = getDefaultExerciseState(topicKey);
  
  if (!stored) return defaultState;
  
  try {
    const parsed = JSON.parse(stored);
    if (parsed.version !== 2 || parsed.topicKey !== topicKey) {
      return defaultState;
    }
    return parsed as Step0ExerciseState;
  } catch {
    return defaultState;
  }
}

export function saveExerciseState(topicKey: string, state: Step0ExerciseState): void {
  const key = `${STEP0_STORAGE_KEY_PREFIX}${topicKey}`;
  const toSave = { ...state, updatedAt: new Date().toISOString() };
  localStorage.setItem(key, JSON.stringify(toSave));
}

export function generateGoogleScholarLink(topic: string): string {
  const encodedTopic = encodeURIComponent(topic);
  return `https://scholar.google.com/scholar?q=${encodedTopic}+review+OR+survey`;
}
