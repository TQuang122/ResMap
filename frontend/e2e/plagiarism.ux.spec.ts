import { mkdirSync } from 'node:fs';

import { expect, test } from '@playwright/test';

const EVIDENCE_DIR = '../.sisyphus/evidence';

function ensureEvidenceDir() {
  mkdirSync(EVIDENCE_DIR, { recursive: true });
}

const VALID_TEXT =
  'Machine learning methods are broadly used for sentiment analysis in modern systems. These techniques help improve accuracy for noisy social media text and practical deployment constraints.';

const toSseBody = (events: unknown[]) =>
  events.map((event) => `data: ${JSON.stringify(event)}\n\n`).join('');

test.describe('Plagiarism UX wave2', () => {
  test('toggle ON sends semantic flag and updates badges', async ({ page }) => {
    ensureEvidenceDir();
    let quotaCalls = 0;
    let capturedUseAi: boolean | null = null;

    await page.route('**/api/tools/plagiarism-check/quota', async (route) => {
      quotaCalls += 1;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          used: 120,
          limit: 30000,
          remaining: 29880,
          usage_percent: 0.4,
          reset_at: '2026-03-12T21:57:32.010927+00:00',
        }),
      });
    });

    await page.route('**/api/tools/plagiarism-check/stream', async (route) => {
      const payload = route.request().postDataJSON() as {
        use_ai_similarity?: boolean;
      };
      capturedUseAi = Boolean(payload?.use_ai_similarity);

      const finalResponse = {
        overall_score: 42,
        plagiarism_percentage: 10,
        total_sentences: 2,
        plagiarized_sentences: 0,
        used_ai_similarity: true,
        fallback_used: false,
        analysis_method: 'semantic',
        ai_quota_remaining: 29879,
        ai_quota_percent: 0.41,
        results: [
          {
            sentence: 'Sentence A',
            similarity: 42,
            semantic_similarity: 88,
            used_ai: true,
            fallback_used: false,
            analysis_method: 'semantic',
            is_plagiarized: false,
            sources: [
              {
                url: 'https://example.com/source-a',
                similarity: 42,
              },
            ],
          },
        ],
      };

      await route.fulfill({
        status: 200,
        contentType: 'text/event-stream',
        body: toSseBody([
          {
            progress: 10,
            current: 0,
            total: 1,
            status: 'retrieval',
            message: 'Retrieving...',
          },
          finalResponse,
          {
            progress: 100,
            current: 1,
            total: 1,
            status: 'complete',
            message: 'Analysis complete',
          },
        ]),
      });
    });

    await page.goto('/plagiarism-check');
    await expect(page.getByRole('switch', { name: /ai similarity/i })).toHaveAttribute('aria-checked', 'true');
    await page.locator('textarea').fill(VALID_TEXT);
    await page.getByRole('button', { name: 'Kiểm tra Đạo văn' }).click();

    await expect.poll(() => capturedUseAi).toBe(true);
    await expect(page.getByText(/^Semantic$/).first()).toBeVisible();
    await expect.poll(() => quotaCalls).toBeGreaterThanOrEqual(2);

    await page.screenshot({
      path: `${EVIDENCE_DIR}/task-7-toggle-on.png`,
      fullPage: true,
    });
  });

  test('quota endpoint failure is non-blocking', async ({ page }) => {
    ensureEvidenceDir();
    let capturedUseAi: boolean | null = null;

    await page.route('**/api/tools/plagiarism-check/quota', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ detail: 'Quota temporarily unavailable' }),
      });
    });

    await page.route('**/api/tools/plagiarism-check/stream', async (route) => {
      const payload = route.request().postDataJSON() as {
        use_ai_similarity?: boolean;
      };
      capturedUseAi = Boolean(payload?.use_ai_similarity);

      const finalResponse = {
        overall_score: 21,
        plagiarism_percentage: 5,
        total_sentences: 1,
        plagiarized_sentences: 0,
        used_ai_similarity: false,
        fallback_used: true,
        analysis_method: 'keyword',
        ai_quota_remaining: null,
        ai_quota_percent: null,
        results: [
          {
            sentence: 'Sentence B',
            similarity: 21,
            semantic_similarity: 0,
            used_ai: false,
            fallback_used: true,
            analysis_method: 'keyword',
            is_plagiarized: false,
            sources: [],
          },
        ],
      };

      await route.fulfill({
        status: 200,
        contentType: 'text/event-stream',
        body: toSseBody([
          {
            progress: 10,
            current: 0,
            total: 1,
            status: 'retrieval',
            message: 'Retrieving...',
          },
          finalResponse,
          {
            progress: 100,
            current: 1,
            total: 1,
            status: 'complete',
            message: 'Analysis complete',
          },
        ]),
      });
    });

    await page.goto('/plagiarism-check');
    await expect(
      page.getByText('Không thể tải quota lúc này (không ảnh hưởng thao tác kiểm tra).')
    ).toBeVisible();
    await page.getByRole('switch', { name: /ai similarity/i }).click();
    await page.locator('textarea').fill(VALID_TEXT);
    await page.getByRole('button', { name: 'Kiểm tra Đạo văn' }).click();

    await expect.poll(() => capturedUseAi).toBe(false);
    await expect(page.getByText('Match Overview')).toBeVisible();
    await page.screenshot({
      path: `${EVIDENCE_DIR}/task-7-quota-fail.png`,
      fullPage: true,
    });
  });

  test('mobile layout remains usable at 375px', async ({ page }) => {
    ensureEvidenceDir();

    await page.route('**/api/tools/plagiarism-check/quota', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          used: 10,
          limit: 30000,
          remaining: 29990,
          usage_percent: 0.03,
          reset_at: '2026-03-12T21:57:32.010927+00:00',
        }),
      });
    });

    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/plagiarism-check');

    const hasHorizontalOverflow = await page.evaluate(() => {
      const htmlOverflow = document.documentElement.scrollWidth > window.innerWidth;
      const bodyOverflow = document.body.scrollWidth > window.innerWidth;
      return htmlOverflow || bodyOverflow;
    });

    await expect(page.getByRole('button', { name: 'Kiểm tra Đạo văn' })).toBeVisible();
    expect(hasHorizontalOverflow).toBeFalsy();

    await page.screenshot({
      path: `${EVIDENCE_DIR}/task-7-mobile.png`,
      fullPage: true,
    });
  });
});
