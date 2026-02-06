import React from 'react';
import { FileText, ListChecks, Link as LinkIcon, GraduationCap } from 'lucide-react';

export interface StarterKitItem {
  icon: React.ReactNode;
  label: string;
  url?: string;
}

export const STARTER_KIT_ITEMS: StarterKitItem[] = [
  { icon: <FileText />, label: "Template Đồ án (Capstone)" },
  { icon: <ListChecks />, label: "Mẫu báo cáo NCKH (ResFes)", url: "https://drive.google.com/drive/folders/1Fnp4bxiCK0J5XYSHyRfUVfsnws4t2j6D?usp=sharing" },
  { icon: <LinkIcon />, label: "HD trích dẫn APA 7" },
  { icon: <GraduationCap />, label: "Tips bảo vệ (Defense)" },
];
