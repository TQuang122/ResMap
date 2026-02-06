import React from 'react';
import { FileText, Table, Users, ClipboardCheck, ListTodo, ShieldCheck } from 'lucide-react';

export interface StarterKitDetailItem {
  icon: React.ElementType; // Use ElementType for passing component ref
  title: string;
  description: string;
  downloadUrl?: string; // Optional URL for later
}

export const FULL_STARTER_KIT: StarterKitDetailItem[] = [
  {
    icon: FileText,
    title: "Mẫu đề cương nghiên cứu",
    description: "Template chuẩn cấu trúc đề cương FPTU (Research Proposal), bao gồm các mục: Lý do chọn đề tài, Mục tiêu, Câu hỏi nghiên cứu, Phạm vi & Phương pháp.",
  },
  {
    icon: Table,
    title: "Bảng tổng hợp tài liệu (LR Matrix)",
    description: "File Excel/Notion giúp tổng hợp và so sánh các bài báo khoa học (Literature Review Matrix) theo Tác giả, Năm, Phương pháp, Kết quả chính.",
    downloadUrl: "https://docs.google.com/spreadsheets/d/1WwJNZ2hX5e4NvaDO2tRShUPlX38QeGNn1Yawnhick9c/edit?usp=sharing"
  },
  {
    icon: Users,
    title: "Nhật ký tiến độ nhóm",
    description: "Mẫu theo dõi biên bản họp nhóm (Meeting Minutes) và tiến độ làm việc hàng tuần để báo cáo Mentor.",
  },
  {
    icon: ClipboardCheck,
    title: "Mẫu phân công nhiệm vụ",
    description: "Template RACI hoặc bảng phân công công việc chi tiết cho từng thành viên trong nhóm Capstone/ResFes.",
  },
  {
    icon: ListTodo,
    title: "Checklist tuần đầu tiên",
    description: "Danh sách các việc cần làm ngay trong tuần đầu: Chốt đề tài, Gặp Mentor lần 1, Setup công cụ (Zotero, Drive).",
  },
  {
    icon: ShieldCheck,
    title: "Hướng dẫn AI & Quản trị rủi ro",
    description: "Quy định về việc sử dụng AI trong nghiên cứu: Cách viết prompt, cách kiểm chứng nguồn tin (Hallucination check) và trích dẫn AI đúng chuẩn.",
  },
];
