# Plagiarism Check Turnitin-like Improvement Plan

## TL;DR

> **Quick Summary**: Upgrade ResMap plagiarism checking to a Turnitin-like reporting experience (clear match evidence, grouped sources, citation-aware analysis, stronger scoring explainability) while keeping legacy API behavior stable.
>
> **Deliverables**:
> - Backward-compatible `report_v2` response extension on `/api/tools/plagiarism-check`
> - Citation/reference exclusion pipeline and source-grouped match evidence
> - New frontend Similarity Report UI (grouped matches, highlights, caveats)
> - Regression + new backend/frontend tests with offline-safe verification
>
> **Estimated Effort**: Large
> **Parallel Execution**: YES - 3 waves
> **Critical Path**: Task 1 -> Task 2 -> Task 5 -> Task 6

---

## Context

### Original Request
Create a concrete work plan to improve plagiarism checking so it is closer to Turnitin quality.

### Interview Summary
**Key Discussions**:
- User explicitly requested planning deliverable (not implementation in this session).
- Goal is practical Turnitin-like quality, especially report usefulness and trust.

**Research Findings**:
- Existing backend already has multi-source connectors, dedupe, semantic fallback, and quota telemetry.
- Existing tests already cover plagiarism backend flows and Playwright UX smoke/behavior.
- Authoritative Turnitin guidance emphasizes similarity as signal (not misconduct verdict), grouped report interpretation, and cautious AI-writing indicator usage.

### Metis Review
**Identified Gaps** (addressed in this plan):
- Locked scope to report quality + explainability, not proprietary Turnitin corpus parity.
- Preserved legacy metrics and payload keys; introduced optional `report_v2` for new semantics.
- Added explicit guardrails for ethics, compatibility, and offline-safe test strategy.
- Added edge-case handling for citations, references, repeated text, and connector outages.

---

## Work Objectives

### Core Objective
Deliver a backward-compatible plagiarism report upgrade that is significantly more interpretable and robust, with Turnitin-like reporting behaviors adapted to ResMap's open-web and academic-source architecture.

### Concrete Deliverables
- `report_v2` object added to plagiarism response without removing legacy fields.
- Source-grouped evidence model (Academic/Web/Other) with match spans and normalized source details.
- Citation/reference exclusion controls with transparent impact reporting.
- Frontend report view showing grouped matches, severity, and policy caveats.
- Automated backend + Playwright coverage for new behaviors and regressions.

### Definition of Done
- [x] `POST /api/tools/plagiarism-check` still returns legacy keys and optional `report_v2`.
- [x] Backend plagiarism suites pass: `uv run pytest tests/test_plagiarism_*.py -q`.
- [x] Frontend plagiarism e2e suites pass: `npm run test:e2e -- --grep plagiarism`.
- [x] New v2 tests pass for grouping, exclusion, and highlight evidence.
- [x] UI clearly states similarity != misconduct and AI indicators are advisory.

### Must Have
- Backward-compatible API contract.
- Deterministic, offline-safe automated tests for new logic.
- Explainable report structure with concrete source evidence.

### Must NOT Have (Guardrails)
- No claim of full Turnitin parity or proprietary submission-repository matching.
- No misconduct verdict automation.
- No breaking changes to existing response keys.
- No mandatory live-network dependency in tests.
- No storage of full external copyrighted source content in persisted logs.

---

## Verification Strategy (MANDATORY)

> **UNIVERSAL RULE: ZERO HUMAN INTERVENTION**
>
> Every task is verifiable via agent-executed commands/tools only.

### Test Decision
- **Infrastructure exists**: YES
- **Automated tests**: Tests-after
- **Framework**: `pytest` (backend), `Playwright` (frontend e2e)

### Agent-Executed QA Scenarios (MANDATORY - ALL tasks)

Primary tools by deliverable:
- Backend/API: Bash (`uv run pytest`, `curl`)
- Frontend/UI: Playwright e2e
- Contracts/types: Bash test commands + schema assertions in tests

Evidence location standard:
- `.sisyphus/evidence/task-1-legacy-contract.log`
- `.sisyphus/evidence/task-5-v2-happy.png`
- `.sisyphus/evidence/task-6-backend-suite.log`

---

## Execution Strategy

### Parallel Execution Waves

Wave 1 (Start immediately)
- Task 1: Contract freeze + `report_v2` schema
- Task 4: Scoring policy and weighting design (depends only on current code)

Wave 2 (After Wave 1)
- Task 2: Match extraction + source grouping backend
- Task 3: Citation/reference exclusion backend

Wave 3 (After Wave 2)
- Task 5: Frontend Similarity Report v2 UI
- Task 6: Full regression + new tests + rollout guardrails

Critical path: Task 1 -> Task 2 -> Task 5 -> Task 6

### Dependency Matrix

| Task | Depends On | Blocks | Can Parallelize With |
|------|------------|--------|---------------------|
| 1 | None | 2, 5, 6 | 4 |
| 2 | 1 | 5, 6 | 3 |
| 3 | 1 | 5, 6 | 2 |
| 4 | None | 6 | 1 |
| 5 | 1, 2, 3 | 6 | None |
| 6 | 1, 2, 3, 4, 5 | None | None |

### Agent Dispatch Summary

| Wave | Tasks | Recommended Agents |
|------|-------|-------------------|
| 1 | 1, 4 | `task(category="unspecified-high", load_skills=["git-master"], run_in_background=false)` |
| 2 | 2, 3 | `task(category="deep", load_skills=["git-master"], run_in_background=false)` |
| 3 | 5, 6 | `task(category="visual-engineering", load_skills=["ui-ux-pro-max","playwright"], run_in_background=false)` |

---

## TODOs

- [x] 1. Freeze compatibility contract and define `report_v2`

  **What to do**:
  - Define `report_v2` schema extension in backend response model as optional.
  - Keep legacy keys (`overall_score`, `plagiarism_percentage`, `results`, etc.) unchanged.
  - Add explicit field definitions for grouped matches, spans, exclusions, and caveats.

  **Must NOT do**:
  - Rename or remove existing response fields.
  - Change existing status codes or route paths.

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: API contract work with compatibility risk.
  - **Skills**: [`git-master`]
    - `git-master`: keep atomic changes and contract-safe history.
  - **Skills Evaluated but Omitted**:
    - `playwright`: not needed for schema-only step.

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 4)
  - **Blocks**: 2, 5, 6
  - **Blocked By**: None

  **References**:
  - `backend/app/schemas/plagiarism.py` - existing request/response contract to extend safely.
  - `backend/app/api/endpoints/plagiarism.py` - endpoint response model binding and compatibility constraints.
  - `backend/tests/test_plagiarism_integration_wave3.py` - existing legacy payload expectations.

  **Acceptance Criteria**:
  - [ ] Response model includes optional `report_v2` object.
  - [ ] Existing fields remain present and unchanged in tests.
  - [ ] `uv run pytest tests/test_plagiarism_integration_wave3.py -q` -> PASS.

  **Agent-Executed QA Scenarios**:
  ```text
  Scenario: Legacy payload remains intact after schema extension
    Tool: Bash (pytest)
    Preconditions: Backend deps installed via uv
    Steps:
      1. Run: uv run pytest tests/test_plagiarism_integration_wave3.py -q
      2. Assert exit code 0
      3. Capture test log to .sisyphus/evidence/task-1-legacy-contract.log
    Expected Result: Legacy contract tests pass unchanged
    Failure Indicators: Missing keys, validation errors, non-zero exit
    Evidence: .sisyphus/evidence/task-1-legacy-contract.log

  Scenario: New report_v2 field is optional, not required
    Tool: Bash (pytest)
    Preconditions: New schema tests added
    Steps:
      1. Run: uv run pytest -q -k "plagiarism and report_v2_optional"
      2. Assert tests include case with report_v2 omitted
      3. Assert exit code 0
    Expected Result: Both with/without report_v2 payloads validate
    Failure Indicators: Validation requires report_v2 unexpectedly
    Evidence: .sisyphus/evidence/task-1-v2-optional.log
  ```

- [x] 2. Implement backend match extraction and source grouping

  **What to do**:
  - Build grouped sources for report output: Academic/Web/Other.
  - Include normalized source metadata (domain, type, priority, top matched snippets/spans).
  - Ensure dedupe keys remain identifier-first (doi/pmid/arxiv_id/url/title).

  **Must NOT do**:
  - Break current dedupe behavior used by existing tests.
  - Fetch/store full copyrighted content in responses.

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: non-trivial data aggregation and dedupe correctness.
  - **Skills**: [`git-master`]
    - `git-master`: preserve incremental commits and safe rollback points.
  - **Skills Evaluated but Omitted**:
    - `ui-ux-pro-max`: backend-only task.

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Task 3)
  - **Blocks**: 5, 6
  - **Blocked By**: 1

  **References**:
  - `backend/app/services/plagiarism.py` - source connector orchestration, dedupe, and scoring hooks.
  - `backend/tests/test_plagiarism_sources.py` - connector and dedupe expectations to preserve.
  - `backend/tests/test_plagiarism_integration_wave3.py` - source telemetry and fail-open patterns.

  **Acceptance Criteria**:
  - [ ] `report_v2.source_groups` is returned with deterministic grouping.
  - [ ] Group counts match underlying deduped source list.
  - [ ] Existing source tests remain green.

  **Agent-Executed QA Scenarios**:
  ```text
  Scenario: Grouping is deterministic for mixed source candidates
    Tool: Bash (pytest)
    Preconditions: Stubbed connector fixtures for crossref/pubmed/duckduckgo
    Steps:
      1. Run: uv run pytest -q -k "plagiarism and source_groups"
      2. Assert Academic/Web/Other keys exist
      3. Assert counts equal expected fixture values
    Expected Result: Stable grouped output across runs
    Failure Indicators: Non-deterministic ordering/count mismatch
    Evidence: .sisyphus/evidence/task-2-source-groups.log

  Scenario: Connector outage remains fail-open with grouped output
    Tool: Bash (pytest)
    Preconditions: One connector fixture forced timeout
    Steps:
      1. Run: uv run pytest -q -k "plagiarism and fail_open and source_groups"
      2. Assert response still succeeds with available connectors
      3. Assert degraded connector appears in failure telemetry
    Expected Result: Request succeeds with partial sources
    Failure Indicators: Entire request fails due to single source outage
    Evidence: .sisyphus/evidence/task-2-fail-open.log
  ```

- [x] 3. Add citation/reference exclusion pipeline with transparent reporting

  **What to do**:
  - Add explicit exclusion modes: quoted text, in-text citations, references section.
  - Emit exclusion summary in `report_v2` (tokens/segments excluded).
  - Handle edge cases: short remaining text, mixed punctuation, VI/EN citation patterns.

  **Must NOT do**:
  - Silently exclude large text blocks without reporting.
  - Return empty success without explanatory metadata.

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: text-processing correctness + edge cases.
  - **Skills**: [`git-master`]
    - `git-master`: careful iterative refactoring in complex parsing logic.
  - **Skills Evaluated but Omitted**:
    - `playwright`: not primary verification path for parser logic.

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Task 2)
  - **Blocks**: 5, 6
  - **Blocked By**: 1

  **References**:
  - `backend/app/services/plagiarism.py` - current exclusion and sentence splitting logic.
  - `backend/app/schemas/plagiarism.py` - request flags and response telemetry fields.
  - `backend/tests/test_plagiarism_backend_first.py` - baseline behavioral tests.

  **Acceptance Criteria**:
  - [ ] Exclusion behavior is configurable and represented in response metadata.
  - [ ] Empty/near-empty post-exclusion text returns clear, structured outcome.
  - [ ] Regression tests confirm no crash on citation-heavy input.

  **Agent-Executed QA Scenarios**:
  ```text
  Scenario: Citation-heavy text excludes references and still returns valid report
    Tool: Bash (pytest)
    Preconditions: Fixture includes references section and in-text citations
    Steps:
      1. Run: uv run pytest -q -k "plagiarism and exclude_citations"
      2. Assert excluded segment count > 0
      3. Assert report status is successful and structured
    Expected Result: Exclusions applied and reported explicitly
    Failure Indicators: Crash, silent exclusion, or malformed response
    Evidence: .sisyphus/evidence/task-3-exclusions.log

  Scenario: Over-exclusion guard when remaining text is too short
    Tool: Bash (pytest)
    Preconditions: Input where exclusions leave minimal analyzable text
    Steps:
      1. Run: uv run pytest -q -k "plagiarism and over_exclusion_guard"
      2. Assert response includes explanatory warning field
      3. Assert API still returns valid JSON contract
    Expected Result: Graceful handling with explicit warning
    Failure Indicators: Empty results without explanation
    Evidence: .sisyphus/evidence/task-3-over-exclusion.log
  ```

- [x] 4. Introduce explainable scoring policy and confidence bands

  **What to do**:
  - Define and implement weighted scoring policy (source reliability + match quality).
  - Add confidence bands and caveats in `report_v2` (low/medium/high confidence).
  - Keep legacy `overall_score` semantics unchanged for compatibility.

  **Must NOT do**:
  - Reinterpret legacy metrics without explicit new fields.
  - Present confidence as misconduct decision.

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: scoring design tradeoffs with backward compatibility.
  - **Skills**: [`git-master`]
    - `git-master`: preserve auditable scoring policy changes.
  - **Skills Evaluated but Omitted**:
    - `ui-ux-pro-max`: primarily backend policy work.

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 1)
  - **Blocks**: 6
  - **Blocked By**: None

  **References**:
  - `backend/app/services/plagiarism.py` - similarity aggregation and source priority constants.
  - `backend/app/schemas/plagiarism.py` - extendable response structure for confidence metadata.
  - `backend/README.md` - documented source and quota behavior baseline.

  **Acceptance Criteria**:
  - [ ] New scoring policy appears only in `report_v2` fields.
  - [ ] Legacy top-level scores remain backward-compatible.
  - [ ] Tests validate confidence-band outputs for controlled fixtures.

  **Agent-Executed QA Scenarios**:
  ```text
  Scenario: Weighted score changes v2 confidence, not legacy score
    Tool: Bash (pytest)
    Preconditions: Fixture with mixed high/low reliability sources
    Steps:
      1. Run: uv run pytest -q -k "plagiarism and scoring_policy_v2"
      2. Assert report_v2.confidence_band is set
      3. Assert legacy overall_score fixture value unchanged
    Expected Result: v2 enriched while legacy contract stable
    Failure Indicators: Legacy score drift due to new policy
    Evidence: .sisyphus/evidence/task-4-scoring-policy.log

  Scenario: AI similarity unavailable still produces confidence caveat
    Tool: Bash (pytest)
    Preconditions: Force semantic quota exhaustion
    Steps:
      1. Run: uv run pytest -q -k "plagiarism and quota_exhausted and confidence"
      2. Assert fallback_used true and caveat included
      3. Assert response remains 200 in API integration test
    Expected Result: Graceful fallback with clear confidence caveat
    Failure Indicators: Missing caveat or failed request
    Evidence: .sisyphus/evidence/task-4-quota-caveat.log
  ```

- [x] 5. Build frontend Similarity Report v2 UI

  **What to do**:
  - Add report sections: similarity overview, source groups, per-sentence match highlights, exclusions summary.
  - Add clarity blocks: "Similarity is an indicator, not misconduct verdict" and AI caveat text.
  - Preserve mobile usability and accessibility semantics.

  **Must NOT do**:
  - Remove existing result view before parity is reached.
  - Hide uncertainty/fallback conditions from users.

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: complex report UX with data-heavy interactions.
  - **Skills**: [`ui-ux-pro-max`, `playwright`]
    - `ui-ux-pro-max`: design and hierarchy for report readability.
    - `playwright`: deterministic UI verification and regression evidence.
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: covered by `ui-ux-pro-max` priority skill.

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 3
  - **Blocks**: 6
  - **Blocked By**: 1, 2, 3

  **References**:
  - `frontend/src/components/tools/PlagiarismChecker.tsx` - current checker UI and result rendering structure.
  - `frontend/src/components/tools/PaperHunter/PaperScorecard.tsx` - score visualization patterns to reuse.
  - `frontend/e2e/plagiarism.ux.spec.ts` - existing UX assertions and screenshot evidence pattern.
  - `frontend/e2e/plagiarism.smoke.spec.ts` - baseline page controls and route smoke.

  **Acceptance Criteria**:
  - [ ] New UI renders when `report_v2` exists and degrades gracefully when absent.
  - [ ] Source-group section and highlights are visible in Playwright test.
  - [ ] Mobile layout remains usable without horizontal overflow.

  **Agent-Executed QA Scenarios**:
  ```text
  Scenario: report_v2 happy path renders source groups and highlights
    Tool: Playwright
    Preconditions: Route mock for /api/tools/plagiarism-check returns report_v2 payload
    Steps:
      1. Navigate to http://localhost:5173/plagiarism-check
      2. Fill textarea with test content >= 50 chars
      3. Click button[name="Kiem tra Dao van"]
      4. Assert section heading "Source Breakdown" visible
      5. Assert at least one highlight span with data-test="match-span"
      6. Save screenshot .sisyphus/evidence/task-5-v2-happy.png
    Expected Result: Rich v2 report appears with grouped evidence
    Failure Indicators: fallback-only UI despite report_v2 payload
    Evidence: .sisyphus/evidence/task-5-v2-happy.png

  Scenario: no report_v2 payload falls back to legacy UI without crash
    Tool: Playwright
    Preconditions: Route mock returns legacy-only payload
    Steps:
      1. Navigate to /plagiarism-check
      2. Submit valid text
      3. Assert legacy "Chi tiet Phan tich" block visible
      4. Assert no uncaught error in browser console
      5. Save screenshot .sisyphus/evidence/task-5-v2-fallback.png
    Expected Result: Backward-compatible UI behavior maintained
    Failure Indicators: blank state, JS error, or broken layout
    Evidence: .sisyphus/evidence/task-5-v2-fallback.png
  ```

- [x] 6. Add regression suite, rollout guardrails, and release checklist

  **What to do**:
  - Add/extend backend tests for `report_v2`, grouping, exclusions, and confidence caveats.
  - Add Playwright scenarios for v2 rendering and fallback behavior.
  - Introduce rollout gate (feature flag) and release checklist with rollback criteria.

  **Must NOT do**:
  - Merge without evidence artifacts for both backend and frontend.
  - Enable v2 by default in production without passing all gates.

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: integration quality gate across backend and frontend.
  - **Skills**: [`playwright`, `git-master`]
    - `playwright`: UI evidence and non-regression.
    - `git-master`: controlled release/rollback commits.
  - **Skills Evaluated but Omitted**:
    - `ui-ux-pro-max`: design already handled in Task 5.

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 3 final
  - **Blocks**: None
  - **Blocked By**: 1, 2, 3, 4, 5

  **References**:
  - `backend/tests/test_plagiarism_backend_first.py` - API behavior and fallback checks.
  - `backend/tests/test_plagiarism_sources.py` - connector reliability and cap policies.
  - `backend/tests/test_plagiarism_persistent_quota.py` - quota persistence behavior.
  - `frontend/e2e/plagiarism.ux.spec.ts` - interaction-driven non-regression patterns.
  - `frontend/package.json` - canonical e2e command scripts.

  **Acceptance Criteria**:
  - [ ] All plagiarism backend tests pass.
  - [ ] All plagiarism frontend e2e tests pass.
  - [ ] Rollout checklist includes rollback trigger and compatibility checks.

  **Agent-Executed QA Scenarios**:
  ```text
  Scenario: Full backend plagiarism suite passes with v2 changes
    Tool: Bash (pytest)
    Preconditions: backend dependencies installed
    Steps:
      1. Run: uv run pytest tests/test_plagiarism_*.py -q
      2. Assert exit code 0
      3. Save output .sisyphus/evidence/task-6-backend-suite.log
    Expected Result: No backend regression
    Failure Indicators: Any failing test
    Evidence: .sisyphus/evidence/task-6-backend-suite.log

  Scenario: Frontend plagiarism e2e passes with v2 and legacy modes
    Tool: Bash (Playwright)
    Preconditions: frontend deps installed, app test server configured
    Steps:
      1. Run: npm run test:e2e -- --grep plagiarism
      2. Assert exit code 0
      3. Save report/log path
    Expected Result: Existing and new flows pass
    Failure Indicators: e2e failures in v2 or fallback paths
    Evidence: .sisyphus/evidence/task-6-e2e-suite.log
  ```

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 1 | `feat(plagiarism): add report_v2 response contract` | schemas + endpoint wiring | `uv run pytest tests/test_plagiarism_integration_wave3.py -q` |
| 2-3 | `feat(plagiarism): add grouped matches and citation exclusions` | plagiarism service + tests | `uv run pytest tests/test_plagiarism_*.py -q` |
| 4 | `feat(plagiarism): add explainable scoring policy metadata` | plagiarism service + tests | `uv run pytest -q -k plagiarism` |
| 5 | `feat(frontend): render plagiarism similarity report v2` | plagiarism UI + e2e tests | `npm run test:e2e -- --grep plagiarism` |
| 6 | `chore(plagiarism): finalize rollout guardrails and regression gates` | tests + docs/checklists | backend + frontend suites |

---

## External References

- `https://guides.turnitin.com/hc/en-us/articles/22774058814093-AI-writing-detection-in-the-new-enhanced-Similarity-Report` - AI indicator caveats and interpretation limits.
- `https://www.turnitin.com/papers/understanding-the-turnitin-similarity-report-instructor-guide-enhanced` - similarity report reading model and grouped-match framing.
- `https://www.turnitin.com/blog/the-new-turnitin-similarity-report-updated-integrity-features` - feature framing for clearer insight presentation.

---

## Success Criteria

### Verification Commands

```bash
cd backend && uv run pytest tests/test_plagiarism_*.py -q
# Expected: all selected tests pass

cd frontend && npm run test:e2e -- --grep plagiarism
# Expected: plagiarism e2e suites pass

curl -s -X POST http://localhost:8000/api/tools/plagiarism-check \
  -H "Content-Type: application/json" \
  -d '{"text":"Machine learning improves student research quality when citation discipline and source validation are applied consistently across drafts.","use_ai_similarity":true}'
# Expected: legacy keys present + optional report_v2
```

### Final Checklist
- [x] All Must Have items are present.
- [x] All Must NOT Have constraints are respected.
- [x] Legacy response compatibility is preserved.
- [x] New report_v2 behaviors are covered by automated tests.
- [x] UI caveats clearly avoid misconduct over-claims.
