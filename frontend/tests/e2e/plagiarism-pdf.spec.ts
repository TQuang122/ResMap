import { expect, test } from '@playwright/test';

const VALID_TEXT =
  'Machine learning methods are broadly used for sentiment analysis in modern systems. These techniques help improve accuracy for noisy social media text and practical deployment constraints.';

test.describe('Plagiarism PDF export', () => {
  test('downloads PDF after streamed plagiarism result', async ({ page }) => {
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

    await page.route('**/api/tools/plagiarism-check/stream', async (route) => {
      const payload = route.request().postDataJSON() as {
        text?: string;
      };

      expect((payload.text ?? '').length).toBeGreaterThanOrEqual(50);

      const finalResponse = {
        overall_score: 37,
        plagiarism_percentage: 37,
        total_sentences: 2,
        plagiarized_sentences: 1,
        used_ai_similarity: true,
        fallback_used: false,
        analysis_method: 'semantic',
        ai_quota_remaining: 29980,
        ai_quota_percent: 0.06,
        results: [
          {
            sentence:
              'Machine learning methods are broadly used for sentiment analysis in modern systems.',
            similarity: 52,
            semantic_similarity: 76,
            used_ai: true,
            fallback_used: false,
            analysis_method: 'semantic',
            is_plagiarized: true,
            sources: [
              {
                url: 'https://example.com/study-1',
                similarity: 52,
                confidence_score: 'high',
                match_type: 'passage',
                passage_matches: [
                  {
                    text1: 'Machine learning methods are broadly used for sentiment analysis',
                    text2: 'Machine learning is widely used for sentiment analysis',
                    start1: 0,
                    end1: 66,
                    start2: 0,
                    end2: 58,
                    similarity: 86,
                  },
                ],
              },
            ],
          },
          {
            sentence:
              'These techniques help improve accuracy for noisy social media text and practical deployment constraints.',
            similarity: 22,
            semantic_similarity: 34,
            used_ai: true,
            fallback_used: false,
            analysis_method: 'semantic',
            is_plagiarized: false,
            sources: [
              {
                url: 'https://example.org/reference',
                similarity: 22,
                confidence_score: 'medium',
                match_type: 'semantic_only',
                passage_matches: [],
              },
            ],
          },
        ],
        report_v2: {
          source_groups: [
            {
              source_id: 'src-001',
              source_type: 'web',
              canonical_url: 'https://example.com/study-1',
              spans: [
                {
                  sentence_index: 0,
                  start_char: 0,
                  end_char: 66,
                  similarity: 52,
                },
              ],
            },
          ],
          match_groups: [
            {
              group_type: 'missing_citation',
              count: 1,
              percentage: 50,
              sample_sentences: [
                'Machine learning methods are broadly used for sentiment analysis in modern systems.',
              ],
            },
          ],
          caveats: [
            {
              code: 'SEMANTIC_UNAVAILABLE_FALLBACK',
              message: 'Keyword fallback applied to a subset of sentences.',
            },
          ],
          metadata: {
            scoring_policy: 'v2_explainable',
            confidence_band: 'medium',
            fallback_sentences: '0',
            exclusion_applied: 'false',
            excluded_characters_ratio: '0.0000',
          },
        },
      };

      const sseBody = [
        {
          progress: 5,
          current: 0,
          total: 2,
          status: 'retrieval',
          message: 'Retrieving candidates...',
          stage: 'retrieval',
          debug: {
            candidates_fetched: 2,
            sources_parsed: 0,
            spans_found: 0,
            sentences_processed: 0,
          },
        },
        {
          progress: 75,
          current: 2,
          total: 2,
          status: 'align',
          message: 'Processing sentence 2/2',
          stage: 'align',
          debug: {
            candidates_fetched: 4,
            sources_parsed: 2,
            spans_found: 1,
            sentences_processed: 2,
          },
        },
        finalResponse,
        {
          progress: 100,
          current: 2,
          total: 2,
          status: 'complete',
          message: 'Analysis complete',
        },
      ]
        .map((event) => `data: ${JSON.stringify(event)}\n\n`)
        .join('');

      await route.fulfill({
        status: 200,
        contentType: 'text/event-stream',
        body: sseBody,
      });
    });

    await page.goto('/plagiarism-check');
    await page.locator('textarea').fill(VALID_TEXT);
    await page.getByRole('button', { name: 'Kiểm tra Đạo văn' }).click();

    const exportButton = page.getByRole('button', { name: 'Xuất PDF' });
    await expect(exportButton).toBeVisible();

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      exportButton.click(),
    ]);

    expect(download.suggestedFilename()).toMatch(/^ResMap_Similarity_Report_.*\.pdf$/);
    const downloadedPath = await download.path();
    expect(downloadedPath).toBeTruthy();
  });
});
