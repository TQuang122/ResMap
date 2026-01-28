import React from 'react';
import { Code, Briefcase, Megaphone, Languages, Scale, Palette } from 'lucide-react';

export interface Topic {
  icon: React.ReactNode;
  title: string;
}

export const TOPICS: Topic[] = [
  { icon: <Code size={32} className="md:w-10 md:h-10" />, title: "Công nghệ thông tin" },
  { icon: <Briefcase size={32} className="md:w-10 md:h-10" />, title: "Kinh doanh, Quản trị & Tài chính" },
  { icon: <Megaphone size={32} className="md:w-10 md:h-10" />, title: "Truyền thông & Media" },
  { icon: <Languages size={32} className="md:w-10 md:h-10" />, title: "Ngôn ngữ" },
  { icon: <Palette size={32} className="md:w-10 md:h-10" />, title: "Thiết kế" },
  { icon: <Scale size={32} className="md:w-10 md:h-10" />, title: "Luật & Luật kinh tế" },
];
