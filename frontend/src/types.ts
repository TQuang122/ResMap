import React from 'react';

export interface ThemeColors {
  bg: string;
  text: string;
  accent: string;
  glass: string;
}

export interface StepData {
  id: number;
  title: string;
  description: string;
  theme: ThemeColors;
  content: React.ReactNode;
}