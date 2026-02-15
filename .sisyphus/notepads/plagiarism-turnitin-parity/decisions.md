
- 2026-02-14: Freeze contract by adding `report_v2` as optional/nullable on `PlagiarismCheckResponse` to avoid breaking legacy consumers.
- 2026-02-14: Validate both payload modes in integration tests: legacy payload without `report_v2` and extended payload with typed `report_v2`.
- 2026-02-14: Kept explainability additions strictly under optional  and encoded confidence as metadata strings to preserve schema/backward compatibility for legacy consumers.
- 2026-02-14: Kept explainability additions strictly under optional report_v2 and encoded confidence as metadata strings to preserve schema/backward compatibility for legacy consumers.
- 2026-02-14: Implemented citation/reference exclusion reporting entirely under optional report_v2 metadata/caveats to keep API compatibility with legacy consumers.
- 2026-02-14: Chose fail-open minimal output when exclusions remove analyzable sentences (score 0, empty results) and added explicit caveat/flags rather than throwing validation or processing errors.

- 2026-02-14: Kept legacy response fields untouched and implemented source grouping only inside optional `report_v2`, using deterministic `src-###` IDs derived from sorted stable source keys.
- 2026-02-14: Used sentence-derived synthetic offsets for report_v2 spans to keep grouping deterministic from analyzed results without introducing new response fields or storing raw source content.

- 2026-02-14: Feature-detected report_v2 in frontend using `result.report_v2 && ...` conditional rendering to preserve backward compatibility with legacy payloads.
- 2026-02-14: Placed advisory block prominently between score cards and source groups for visibility.
- 2026-02-14: Used Vietnamese labels for source_type (Học thuật/Web) and confidence_band (Cao/Trung bình/Thấp) to match product language.
- 2026-02-14: Added data-test attribute for Playwright testability without exposing unnecessary CSS classes.
