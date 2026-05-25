import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('ASC Knowledge Hub - Smoke Tests & UX Audit', () => {

  test('Homepage loads and passes accessibility audit', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Smoke test
    await expect(page).toHaveTitle(/ASC/);
    await expect(page.locator('text=Sign In')).toBeVisible();

    // Visual Regression
    await expect(page).toHaveScreenshot('homepage.png', { fullPage: true });

    // Accessibility Audit
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    // We expect 0 serious violations
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Admin user can login and access profile', async ({ page }) => {
    await page.goto('http://localhost:3000/auth/login');
    
    await page.fill('input[name="email"]', 'admin@asc-cybernetics.org');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Should redirect to profile
    await page.waitForURL('**/profile');
    
    // Ensure profile data loaded from the seed
    await expect(page.locator('input[name="first_name"]')).toHaveValue('System');
    await expect(page.locator('input[name="last_name"]')).toHaveValue('Administrator');

    // Take screenshot of authenticated state
    await expect(page).toHaveScreenshot('admin-profile.png', { fullPage: true });
  });

  test('Senior Researcher persona workflow', async ({ page }) => {
    await page.goto('http://localhost:3000/auth/login');
    
    await page.fill('input[name="email"]', 'senior.researcher@asc-cybernetics.org');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    await page.waitForURL('**/profile');
    
    // Verify specific persona data
    await expect(page.locator('input[name="first_name"]')).toHaveValue('Aris');
    await expect(page.locator('input[name="last_name"]')).toHaveValue('Scholar');
    
    // Verify Navbar shows authenticated links
    await expect(page.locator('text=Directory')).toBeVisible();
    await expect(page.locator('text=Sign Out')).toBeVisible();
  });

});
