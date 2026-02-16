import { clipText, confidenceLabel, matchGroupLabel, safeHostname } from './format';
import type { PlagiarismResponse } from '../../types/plagiarism';

export interface PdfViewModelOptions {
  evidenceLimit?: number;
}

export interface CitationRow {
  group: string;
  count: number;
  percentage: string;
  samples: string;
}

export interface SourceRow {
  sourceId: string;
  sourceUrl: string;
  domain: string;
  sourceType: string;
  spanCount: number;
  avgSimilarity: number;
  contribution: number;
}

export interface EvidenceRow {
  sentence: string;
  source: string;
  sourceUrl: string;
  similarity: number;
  matchType: string;
  confidence: string;
  passageSnippet: string;
}

export interface PdfViewModel {
  summary: {
    overallScore: number;
    plagiarismPercentage: number;
    totalSentences: number;
    matchedSentences: number;
    distinctSources: number;
    aiDetectionText?: string;
  };
  citationRows: CitationRow[];
  sourceRows: SourceRow[];
  evidenceRows: EvidenceRow[];
  caveatRows: string[];
  methodRows: Array<[string, string]>;
  warnings: string[];
}

const roundPercent = (value: number): number => Math.round(value * 10) / 10;
const DEFAULT_EVIDENCE_LIMIT = 10;
const MAX_EVIDENCE_LIMIT = 20;

const buildSourceRows = (result: PlagiarismResponse): SourceRow[] => {
  const sourceGroups = result.report_v2?.source_groups ?? [];
  if (sourceGroups.length > 0) {
    const totalWeight = sourceGroups.reduce(
      (sum, group) =>
        sum + group.spans.reduce((acc, span) => acc + Math.max(0, span.similarity), 0),
      0
    );

    return sourceGroups
      .map((group) => {
        const spanCount = group.spans.length;
        const totalSim = group.spans.reduce((sum, span) => sum + span.similarity, 0);
        const contribution =
          totalWeight > 0 ? roundPercent((totalSim / totalWeight) * 100) : 0;

        return {
          sourceId: group.source_id,
          sourceUrl: group.canonical_url,
          domain: safeHostname(group.canonical_url),
          sourceType: group.source_type,
          spanCount,
          avgSimilarity: spanCount > 0 ? Math.round(totalSim / spanCount) : 0,
          contribution,
        };
      })
      .sort((a, b) => b.contribution - a.contribution);
  }

  const sourceMap = new Map<string, { simSum: number; count: number }>();
  for (const sentence of result.results) {
    for (const source of sentence.sources) {
      const existing = sourceMap.get(source.url) ?? { simSum: 0, count: 0 };
      existing.simSum += source.similarity;
      existing.count += 1;
      sourceMap.set(source.url, existing);
    }
  }

  const totalSim = Array.from(sourceMap.values()).reduce((sum, item) => sum + item.simSum, 0);

  return Array.from(sourceMap.entries())
    .map(([url, value], index) => ({
      sourceId: `src-${String(index + 1).padStart(3, '0')}`,
      sourceUrl: url,
      domain: safeHostname(url),
      sourceType: 'web',
      spanCount: value.count,
      avgSimilarity: value.count > 0 ? Math.round(value.simSum / value.count) : 0,
      contribution: totalSim > 0 ? roundPercent((value.simSum / totalSim) * 100) : 0,
    }))
    .sort((a, b) => b.contribution - a.contribution);
};

const confidenceRank = (value: string | undefined): number => {
  const normalized = (value ?? '').toLowerCase();
  if (normalized === 'high') return 3;
  if (normalized === 'medium') return 2;
  if (normalized === 'low') return 1;
  return 0;
};

const buildEvidenceRows = (
  result: PlagiarismResponse,
  limit = DEFAULT_EVIDENCE_LIMIT
): { rows: EvidenceRow[]; totalCandidates: number } => {
  const rows: EvidenceRow[] = [];

  for (const sentence of result.results) {
    for (const source of sentence.sources) {
      const bestPassage = (source.passage_matches ?? []).sort(
        (a, b) => (b.text1?.length ?? 0) - (a.text1?.length ?? 0)
      )[0];

      rows.push({
        sentence: clipText(sentence.sentence, 220),
        source: safeHostname(source.url),
        sourceUrl: source.url,
        similarity: source.similarity,
        matchType: source.match_type ?? 'unknown',
        confidence: confidenceLabel(source.confidence_score),
        passageSnippet: bestPassage?.text1 ? clipText(bestPassage.text1, 180) : 'N/A',
      });
    }
  }

  const sortedRows = rows
    .sort((a, b) => {
      if (b.similarity !== a.similarity) return b.similarity - a.similarity;
      const rankDiff = confidenceRank(b.confidence) - confidenceRank(a.confidence);
      if (rankDiff !== 0) return rankDiff;
      return b.passageSnippet.length - a.passageSnippet.length;
    })
    .slice(0, limit);

  return {
    rows: sortedRows,
    totalCandidates: rows.length,
  };
};

export const buildPdfViewModel = (
  result: PlagiarismResponse,
  options: PdfViewModelOptions = {}
): PdfViewModel => {
  const requestedLimit = options.evidenceLimit ?? DEFAULT_EVIDENCE_LIMIT;
  const safeEvidenceLimit = Math.max(1, Math.min(MAX_EVIDENCE_LIMIT, requestedLimit));
  const sourceRows = buildSourceRows(result);
  const citationRows = (result.report_v2?.match_groups ?? []).map((group) => ({
    group: matchGroupLabel(group.group_type),
    count: group.count,
    percentage: `${roundPercent(group.percentage)}%`,
    samples: clipText(group.sample_sentences.join(' | '), 180) || 'N/A',
  }));

  const aiDetectionText =
    typeof result.ai_detection_score === 'number' && result.ai_detection_score > 0
      ? `${roundPercent(result.ai_detection_score)}% (${confidenceLabel(result.ai_detection_confidence)} confidence)`
      : undefined;

  const metadata = result.report_v2?.metadata ?? {};
  const methodRows: Array<[string, string]> = [
    ['Scoring Policy', metadata.scoring_policy ?? 'N/A'],
    ['Confidence Band', metadata.confidence_band ?? 'N/A'],
    ['Fallback Sentences', metadata.fallback_sentences ?? '0'],
    ['Exclusion Applied', metadata.exclusion_applied ?? 'false'],
    ['Excluded Characters Ratio', metadata.excluded_characters_ratio ?? '0'],
  ];

  const evidenceResult = buildEvidenceRows(result, safeEvidenceLimit);
  const warnings: string[] = [];

  if (evidenceResult.totalCandidates > safeEvidenceLimit) {
    warnings.push(
      `PDF evidence section is truncated: showing top ${safeEvidenceLimit}/${evidenceResult.totalCandidates} matches to keep report readable.`
    );
  }

  if (result.total_sentences >= 120) {
    warnings.push(
      `Large submission detected (${result.total_sentences} sentences). PDF generation may take longer than usual.`
    );
  }

  methodRows.push(['PDF Evidence Limit', `${safeEvidenceLimit}`]);
  methodRows.push(['PDF Evidence Candidates', `${evidenceResult.totalCandidates}`]);

  return {
    summary: {
      overallScore: result.overall_score,
      plagiarismPercentage: result.plagiarism_percentage,
      totalSentences: result.total_sentences,
      matchedSentences: result.plagiarized_sentences,
      distinctSources: sourceRows.length,
      aiDetectionText,
    },
    citationRows,
    sourceRows,
    evidenceRows: evidenceResult.rows,
    caveatRows: (result.report_v2?.caveats ?? []).map((caveat) => `${caveat.code}: ${caveat.message}`),
    methodRows,
    warnings,
  };
};
