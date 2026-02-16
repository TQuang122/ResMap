export interface PassageMatch {
  text1: string;
  text2: string;
  start1: number;
  end1: number;
  start2: number;
  end2: number;
  similarity: number;
}

export interface Source {
  url: string;
  similarity: number;
  matched_ngrams?: string[];
  passage_matches?: PassageMatch[];
  confidence_score?: string;
  match_type?: string;
}

export interface SentenceResult {
  sentence: string;
  similarity: number;
  semantic_similarity: number;
  used_ai?: boolean;
  fallback_used?: boolean;
  analysis_method?: string | null;
  sources: Source[];
  is_plagiarized: boolean;
  paraphrase_detected?: boolean;
}

export interface ReportV2SourceSpan {
  sentence_index: number;
  start_char: number;
  end_char: number;
  similarity: number;
}

export interface ReportV2SourceGroup {
  source_id: string;
  source_type: string;
  canonical_url: string;
  spans: ReportV2SourceSpan[];
  source_category?: string;
  credibility_score?: number;
}

export interface ReportV2Caveat {
  code: string;
  message: string;
}

export interface MatchGroup {
  group_type: string;
  count: number;
  percentage: number;
  sample_sentences: string[];
}

export interface ReportV2 {
  source_groups: ReportV2SourceGroup[];
  match_groups: MatchGroup[];
  caveats: ReportV2Caveat[];
  metadata?: Record<string, string>;
}

export interface PlagiarismResponse {
  overall_score: number;
  plagiarism_percentage: number;
  total_sentences: number;
  plagiarized_sentences: number;
  results: SentenceResult[];
  used_ai_similarity: boolean;
  fallback_used: boolean;
  analysis_method: string | null;
  ai_quota_remaining: number | null;
  ai_quota_percent: number | null;
  ai_detection_score?: number;
  ai_detection_confidence?: string;
  report_generated_at?: string;
  report_version?: string;
  report_v2?: ReportV2;
}

export interface QuotaResponse {
  used: number;
  limit: number;
  remaining: number;
  usage_percent: number;
  reset_at: string;
}
