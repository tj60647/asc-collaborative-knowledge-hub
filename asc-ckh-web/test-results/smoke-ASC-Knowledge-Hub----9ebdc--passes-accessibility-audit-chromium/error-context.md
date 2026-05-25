# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: smoke.spec.ts >> ASC Knowledge Hub - Smoke Tests & UX Audit >> Homepage loads and passes accessibility audit
- Location: tests\smoke.spec.ts:6:7

# Error details

```
Error: expect(page).toHaveTitle(expected) failed

Expected pattern: /ASC/
Received string:  ""
Timeout: 5000ms

Call log:
  - Expect "toHaveTitle" with timeout 5000ms
    14 × unexpected value ""

```

```yaml
- img
- heading "This page couldn’t load" [level=1]
- paragraph: A server error occurred. Reload to try again.
- button "Reload"
- paragraph: ERROR 4090109459
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import AxeBuilder from '@axe-core/playwright';
  3  | 
  4  | test.describe('ASC Knowledge Hub - Smoke Tests & UX Audit', () => {
  5  | 
  6  |   test('Homepage loads and passes accessibility audit', async ({ page }) => {
  7  |     await page.goto('http://localhost:3000');
  8  |     
  9  |     // Smoke test
> 10 |     await expect(page).toHaveTitle(/ASC/);
     |                        ^ Error: expect(page).toHaveTitle(expected) failed
  11 |     await expect(page.locator('text=Sign In')).toBeVisible();
  12 | 
  13 |     // Visual Regression
  14 |     await expect(page).toHaveScreenshot('homepage.png', { fullPage: true });
  15 | 
  16 |     // Accessibility Audit
  17 |     const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  18 |     
  19 |     // We expect 0 serious violations
  20 |     expect(accessibilityScanResults.violations).toEqual([]);
  21 |   });
  22 | 
  23 |   test('Admin user can login and access profile', async ({ page }) => {
  24 |     await page.goto('http://localhost:3000/auth/login');
  25 |     
  26 |     await page.fill('input[name="email"]', 'admin@asc-cybernetics.org');
  27 |     await page.fill('input[name="password"]', 'password123');
  28 |     await page.click('button[type="submit"]');
  29 | 
  30 |     // Should redirect to profile
  31 |     await page.waitForURL('**/profile');
  32 |     
  33 |     // Ensure profile data loaded from the seed
  34 |     await expect(page.locator('input[name="first_name"]')).toHaveValue('System');
  35 |     await expect(page.locator('input[name="last_name"]')).toHaveValue('Administrator');
  36 | 
  37 |     // Take screenshot of authenticated state
  38 |     await expect(page).toHaveScreenshot('admin-profile.png', { fullPage: true });
  39 |   });
  40 | 
  41 |   test('Senior Researcher persona workflow', async ({ page }) => {
  42 |     await page.goto('http://localhost:3000/auth/login');
  43 |     
  44 |     await page.fill('input[name="email"]', 'senior.researcher@asc-cybernetics.org');
  45 |     await page.fill('input[name="password"]', 'password123');
  46 |     await page.click('button[type="submit"]');
  47 | 
  48 |     await page.waitForURL('**/profile');
  49 |     
  50 |     // Verify specific persona data
  51 |     await expect(page.locator('input[name="first_name"]')).toHaveValue('Aris');
  52 |     await expect(page.locator('input[name="last_name"]')).toHaveValue('Scholar');
  53 |     
  54 |     // Verify Navbar shows authenticated links
  55 |     await expect(page.locator('text=Directory')).toBeVisible();
  56 |     await expect(page.locator('text=Sign Out')).toBeVisible();
  57 |   });
  58 | 
  59 | });
  60 | 
```