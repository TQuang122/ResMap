import { THEMES } from '../constants';
import { ThemeColors } from '../types';

export interface StepInfo {
  id: string;
  stepNumber: string;
  title: string;
  description: string;
  theme: ThemeColors;
}

export const STEPS_DATA: StepInfo[] = [
  {
    id: 'step1',
    stepNumber: "01",
    title: "Chọn vấn đề & Câu hỏi nghiên cứu",
    description: "Xác định đề tài Capstone/ResFes khả thi, được Mentor phê duyệt và phù hợp với chuyên ngành.",
    theme: THEMES.step1
  },
  {
    id: 'step2',
    stepNumber: "02",
    title: "Tìm & Sàng lọc tài liệu (LR)",
    description: "Xây dựng cơ sở lý thuyết (Literature Review) từ các nguồn uy tín (IEEE, ScienceDirect) để tìm Research Gap.",
    theme: THEMES.step2
  },
  {
    id: 'step3',
    stepNumber: "03",
    title: "Chọn thiết kế & Phương pháp",
    description: "Chọn phương pháp nghiên cứu (Quantitative/Qualitative) phù hợp với yêu cầu của Hội đồng chuyên môn.",
    theme: THEMES.step3
  },
  {
    id: 'step4',
    stepNumber: "04",
    title: "Thiết kế công cụ & Lập kế hoạch",
    description: "Thiết kế bảng hỏi, kịch bản phỏng vấn và lập kế hoạch thu thập dữ liệu thực tế tại FPTU hoặc doanh nghiệp.",
    theme: THEMES.step4
  },
  {
    id: 'step5',
    stepNumber: "05",
    title: "Phân tích & Trình bày kết quả",
    description: "Phân tích dữ liệu (SPSS, Nvivo), trực quan hóa kết quả và viết báo cáo theo chuẩn format của trường.",
    theme: THEMES.step5
  },
  {
    id: 'step6',
    stepNumber: "06",
    title: "Đạo đức & Chuẩn mực",
    description: "Kiểm tra đạo văn (Turnitin), đảm bảo đạo đức nghiên cứu và chuẩn bị slide bảo vệ trước Hội đồng.",
    theme: THEMES.step6
  }
];
