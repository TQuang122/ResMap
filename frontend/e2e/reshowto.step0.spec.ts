import { expect, test } from '@playwright/test';

test.describe('ResHowTo Step 0 exercise modal', () => {
  test('Complete full stepper flow', async ({ page }) => {
    await page.goto('/reshowto?topic=cong-nghe-thong-tin');

    await page.waitForSelector('#research-process-intro', { timeout: 15000 });

    await expect(page.getByRole('heading', { name: /Bước 0:/i })).toBeVisible({ timeout: 10000 });

    await page.getByTestId('step0-exercise-trigger').click();

    await expect(page.getByTestId('step0-exercise-modal')).toBeVisible();

    await expect(page.getByTestId('step0-progress-bar')).toBeVisible();

    await page.getByTestId('step0-keyword-1').fill('Machine Learning');
    await page.getByTestId('step0-keyword-2').fill('Deep Learning');
    await page.getByTestId('step0-keyword-3').fill('NLP');

    await page.getByTestId('step0-next-btn').click();

    await page.getByTestId('step0-card-quant').click();

    await expect(page.getByTestId('step0-quant-feedback')).toBeVisible();

    await page.getByTestId('step0-next-btn').click();

    await page.getByTestId('step0-search-topic').fill('AI in Education');

    await expect(page.getByTestId('step0-google-scholar-link')).toBeVisible();

    await page.getByTestId('step0-next-btn').click();

    await page.getByTestId('step0-skill-check-1').click();

    await page.getByTestId('step0-finish-btn').click();

    await expect(page.getByTestId('step0-celebration')).toBeVisible();

    await page.keyboard.press('Escape');

    await expect(page.getByTestId('step0-exercise-modal')).not.toBeVisible();
  });

  test('Modal closes via ESC', async ({ page }) => {
    await page.goto('/reshowto?topic=cong-nghe-thong-tin');

    await page.waitForSelector('#research-process-intro', { timeout: 15000 });

    await page.getByTestId('step0-exercise-trigger').click();

    await expect(page.getByTestId('step0-exercise-modal')).toBeVisible();

    await page.keyboard.press('Escape');

    await expect(page.getByTestId('step0-exercise-modal')).not.toBeVisible();
  });
});