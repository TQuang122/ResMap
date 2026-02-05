import { StepFullData } from '../types';

export const STEPS_BY_TOPIC: Record<string, () => Promise<{ STEPS_DATA: StepFullData[] }>> = {
  'Công nghệ thông tin': () => import('./stepsIt').then(m => m),
  'Kinh doanh, Quản trị & Tài chính': () => import('./stepsBusiness').then(m => m),
  'Truyền thông & Media': () => import('./stepsMedia').then(m => m),
  'Ngôn ngữ': () => import('./stepsLanguages').then(m => m),
  'Thiết kế': () => import('./stepsDesign').then(m => m),
  'Luật & Luật kinh tế': () => import('./stepsLaw').then(m => m),
};
