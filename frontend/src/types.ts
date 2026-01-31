import React from 'react';

export interface ThemeColors {
  bg: string;
  text: string;
  accent: string;
  accentText: string;
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
  resExploreBox?: ResExploreBoxConfig;
}

export interface BlogItem {
  title: string;
  url: string;
  author?: string;
  date?: string;
  description?: string;
}

export interface VideoItem {
  title: string;
  url: string;
  duration?: string;
  thumbnail?: string;
}

export interface SupportData {
  tools: { label: string; description: string }[];
  tips: string[];
  videoUrl?: string;
  videoTitle?: string;
  blogs?: BlogItem[];
  additionalVideos?: VideoItem[];
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
  resExploreBox?: ResExploreBoxConfig;
}

export interface ResExploreBoxConfig {
  title: string;
  description: string;
  buttonLabel: string;
}

export interface LecturerData {
  id: string;
  title: string;
  fullName: string;
  department: string;
  phone?: string;
  email: string;
  personalWebsite?: string;
  orcid?: string;
  researchGate?: string;
  googleScholar?: string;
  researchAreas: string[];
  researchTopics: string[];
  lab?: string;
  note?: string;
}