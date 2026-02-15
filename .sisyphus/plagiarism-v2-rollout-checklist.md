# Plagiarism Check v2 Rollout Checklist

## Pre-Rollout Verification

### Backend Tests ✅
- [x] All plagiarism backend tests pass: `uv run pytest tests/test_plagiarism_*.py -q`
- [x] 47 tests passed, 1 warning (non-blocking Pydantic deprecation)

### Frontend E2E Tests ✅
- [x] All plagiarism e2e tests pass: `npm run test:e2e -- --grep plagiarism`
- [x] 12 tests passed across desktop and mobile

### Feature Completeness
- [x] report_v2 schema implemented and backward-compatible
- [x] Source grouping backend logic complete
- [x] Citation exclusion pipeline with transparent reporting
- [x] Scoring policy and confidence bands implemented
- [x] Frontend UI renders report_v2 with graceful fallback
- [x] Advisory text clearly states similarity is indicator, not misconduct verdict

## Rollout Steps

### 1. Feature Flag Configuration
```env
# Default: disabled until full rollout
PLAGIARISM_REPORT_V2_ENABLED=false
```

### 2. Gradual Rollout Sequence
| Phase | Traffic % | Criteria |
|-------|-----------|----------|
| Alpha | 5% | Internal testing, report_v2 only |
| Beta | 25% | External beta users |
| GA | 100% | Full rollout after 48h monitoring |

### 3. Rollback Triggers
Immediate rollback if ANY of:
- [ ] Error rate increases >5% on plagiarism-check endpoint
- [ ] Latency p99 increases >200ms
- [ ] Customer support tickets >10 in 24h related to plagiarism
- [ ] Critical bug in report_v2 rendering

### 4. Post-Rollout Monitoring (48h)
- [ ] Monitor `/api/tools/plagiarism-check` error rate
- [ ] Monitor response latency
- [ ] Monitor quota consumption
- [ ] Collect user feedback on report clarity

## Compatibility Checks

### Backward Compatibility ✅
- [x] Legacy payload keys unchanged (`overall_score`, `results`, etc.)
- [x] report_v2 is optional and nullable
- [x] Frontend gracefully falls back when report_v2 absent

### API Contract Verified
```bash
curl -s -X POST http://localhost:8000/api/tools/plagiarism-check \
  -H "Content-Type: application/json" \
  -d '{"text":"Machine learning improves student research quality when citation discipline and source validation are applied consistently across drafts.","use_ai_similarity":true}'
```
Expected: legacy keys + optional report_v2

## Release Notes Draft

### Changes in v2.0
- **New**: Source-grouped match evidence (Academic/Web/Other)
- **New**: Citation/reference exclusion with transparent reporting
- **New**: Confidence bands and scoring policy metadata
- **New**: Enhanced UI with similarity advisory text

### Advisory
Similarity scores are indicators, not misconduct verdicts. Always review context and citation quality.

## Sign-Off

| Role | Name | Date |
|------|------|------|
| Backend | | |
| Frontend | | |
| QA | | |
| Product | | |
