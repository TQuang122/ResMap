import React from 'react';

export interface ThemeColors {
  bg: string;
  text: string;
  accent: string;
  accentText: string;
  borderColor: string;
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

// ============ Paper Hunter Types ============

export type PaperType = 'survey' | 'empirical' | 'benchmark' | 'case';

export interface Author {
  name: string;
  affiliation?: string;
}

export interface Paper {
  id: string;
  title: string;
  abstract?: string;
  authors: Author[];
  year?: number;
  venue?: string;
  cited_by_count: number;
  paper_type?: string;
  open_access_url?: string;
  doi?: string;
  concepts: string[];
}

export interface QueryVariant {
  source: string;
  query: string;
  url?: string;
}

export interface QueryResponse {
  original_topic: string;
  keywords: string[];
  synonyms: string[];
  queries: QueryVariant[];
}

export interface SearchResponse {
  total_count: number;
  papers: Paper[];
  query_used: string;
}

export interface ScoreItem {
  score: number;
  reason: string;
}

export interface ScoreResponse {
  paper_id: string;
  paper_title: string;
  relevance: ScoreItem;
  novelty: ScoreItem;
  methodology: ScoreItem;
  reproducibility: ScoreItem;
  citation_context: ScoreItem;
  dataset_fit: ScoreItem;
  overall_score: number;
  decision: 'keep' | 'maybe' | 'skip';
  summary: string;
  error?: string;
}