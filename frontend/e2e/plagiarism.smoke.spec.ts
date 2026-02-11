import { expect, test } from '@playwright/test';

test.describe('Plagiarism page smoke', () => {
  test('loads plagiarism page and primary controls', async ({ page }) => {
    await page.goto('/plagiarism-check');

    await expect(
      page.getByRole('heading', { name: /free plagiarism checker/i })
    ).toBeVisible();
    await expect(page.getByText('Kiểm tra Đạo văn (Plagiarism Checker)')).toBeVisible();

    await expect(page.locator('textarea').first()).toBeVisible();

    const submitButton = page.getByRole('button', { name: 'Kiểm tra Đạo văn' });
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toBeDisabled();
  });
});
