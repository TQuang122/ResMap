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

// New interfaces for Step Layout refactoring

export interface DeliverableItem {
  id: string;
  label: string;
  criteria: string[];
  placeholder: string;
}

export interface GuidanceItem {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  subSteps?: string[];
}

export interface SupportData {
  tools: { label: string; description: string }[];
  tips: string[];
  videoUrl?: string;
  videoTitle?: string;
}

export interface StepFullData {
  id: string;
  stepNumber: string;
  title: string;
  description: string;
  theme: ThemeColors;
  deliverables: DeliverableItem[];
  guidance: GuidanceItem[];
  support: SupportData;
}