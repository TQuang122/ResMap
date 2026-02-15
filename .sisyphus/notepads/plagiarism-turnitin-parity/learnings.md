
- 2026-02-14: `PlagiarismCheckResponse` remains backward compatible when new fields are introduced as `Optional[...] = None`.
- 2026-02-14: Added typed `report_v2` submodels (`source_groups`, `spans`, `caveats`, `metadata`) without changing legacy required keys.
- 2026-02-14: Added deterministic  scoring-policy metadata (, , evidence counters) derived from sentence-level evidence without changing legacy top-level aggregates.
- 2026-02-14: Added deterministic report_v2 scoring-policy metadata (scoring_policy, confidence_band, evidence counters) derived from sentence-level evidence without changing legacy top-level aggregates.
- 2026-02-14: Added an exclusion pipeline telemetry surface in report_v2 metadata/caveats (removed chars/ratios and exclusion counters) so citation-heavy preprocessing is transparent instead of silent.
- 2026-02-14: Graceful over-exclusion behavior is now explicit through INSUFFICIENT_ANALYZABLE_TEXT caveat plus analyzable_text_minimal metadata, while legacy response fields remain stable.

- 2026-02-14: Built `report_v2.source_groups` by deduping sentence-level source URLs with stable keys (`doi:*` before normalized `url:*`) and deterministic ordering, then emitted sentence-index spans without exposing page content.
- 2026-02-14: Added `source_group_count` and `source_group_spans` metadata so grouped evidence totals reflect deduped attribution while preserving legacy `source_counts` behavior.

- 2026-02-14: Implemented frontend report_v2 UI in PlagiarismChecker.tsx with feature-detection for optional report_v2.
- 2026-02-14: Added advisory block with Vietnamese text explaining similarity is indicator, not misconduct verdict.
- 2026-02-14: Added source groups section with academic/web/other type badges and span similarity chips.
- 2026-02-14: Added caveats section with amber warning styling for limitations and exclusions.
- 2026-02-14: Added confidence_band and scoring_policy metadata display with Vietnamese labels.
- 2026-02-14: Preserved legacy "Chi tiết Phân tích" fallback when report_v2 is absent.
- 2026-02-14: Added data-test="match-span" attribute on source group cards for Playwright testing.
