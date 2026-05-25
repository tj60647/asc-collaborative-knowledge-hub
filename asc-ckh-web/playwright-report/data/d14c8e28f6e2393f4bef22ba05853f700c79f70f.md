# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: smoke.spec.ts >> ASC Knowledge Hub - Smoke Tests & UX Audit >> Senior Researcher persona workflow
- Location: tests\smoke.spec.ts:41:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('input[name="email"]')

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [active]:
    - generic [ref=e4]:
      - generic [ref=e5]:
        - generic [ref=e6]:
          - navigation [ref=e7]:
            - button "previous" [disabled] [ref=e8]:
              - img "previous" [ref=e9]
            - generic [ref=e11]:
              - generic [ref=e12]: 1/
              - text: "1"
            - button "next" [disabled] [ref=e13]:
              - img "next" [ref=e14]
          - img
        - generic [ref=e16]:
          - generic [ref=e17]:
            - img [ref=e18]
            - generic "Latest available version is detected (16.2.6)." [ref=e20]: Next.js 16.2.6
            - generic [ref=e21]: Turbopack
          - img
      - dialog "Runtime ReferenceError" [ref=e23]:
        - generic [ref=e26]:
          - generic [ref=e27]:
            - generic [ref=e28]:
              - generic [ref=e29]:
                - generic [ref=e30]: Runtime ReferenceError
                - generic [ref=e31]: Server
              - generic [ref=e32]:
                - button "Copy Error Info" [ref=e33] [cursor=pointer]:
                  - img [ref=e34]
                - button "No related documentation found" [disabled] [ref=e36]:
                  - img [ref=e37]
                - button "Attach Node.js inspector" [ref=e39] [cursor=pointer]:
                  - img [ref=e40]
            - generic [ref=e49]: Mountain is not defined
          - generic [ref=e50]:
            - generic [ref=e51]:
              - paragraph [ref=e53]:
                - img [ref=e55]
                - generic [ref=e58]: src\app\layout.tsx (39:14) @ RootLayout
                - button "Open in editor" [ref=e59] [cursor=pointer]:
                  - img [ref=e61]
              - generic [ref=e64]:
                - generic [ref=e65]: 37 | <div className="w-full max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items...
                - generic [ref=e66]: 38 | <div className="flex items-center space-x-2 mb-4 md:mb-0">
                - generic [ref=e67]: "> 39 | <Mountain className=\"h-4 w-4 text-zinc-300\" />"
                - generic [ref=e68]: "| ^"
                - generic [ref=e69]: 40 | <span className="text-xs font-semibold text-zinc-500">ASC CKH</span>
                - generic [ref=e70]: 41 | </div>
                - generic [ref=e71]: 42 |
            - generic [ref=e72]:
              - generic [ref=e73]:
                - paragraph [ref=e74]:
                  - text: Call Stack
                  - generic [ref=e75]: "6"
                - button "Show 5 ignore-listed frame(s)" [ref=e76] [cursor=pointer]:
                  - text: Show 5 ignore-listed frame(s)
                  - img [ref=e77]
              - generic [ref=e79]:
                - generic [ref=e80]:
                  - text: RootLayout
                  - button "Open RootLayout in editor" [ref=e81] [cursor=pointer]:
                    - img [ref=e82]
                - text: src\app\layout.tsx (39:14)
        - generic [ref=e84]: "1"
        - generic [ref=e85]: "2"
    - generic [ref=e90] [cursor=pointer]:
      - button "Open Next.js Dev Tools" [ref=e91]:
        - img [ref=e92]
      - generic [ref=e95]:
        - button "Open issues overlay" [ref=e96]:
          - generic [ref=e97]:
            - generic [ref=e98]: "0"
            - generic [ref=e99]: "1"
          - generic [ref=e100]: Issue
        - button "Collapse issues badge" [ref=e101]:
          - img [ref=e102]
  - generic [ref=e105]:
    - img [ref=e106]
    - heading "This page couldn’t load" [level=1] [ref=e108]
    - paragraph [ref=e109]: A server error occurred. Reload to try again.
    - button "Reload" [ref=e112] [cursor=pointer]
  - paragraph [ref=e113]: ERROR 4090109459
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
  10 |     await expect(page).toHaveTitle(/ASC/);
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
> 44 |     await page.fill('input[name="email"]', 'senior.researcher@asc-cybernetics.org');
     |                ^ Error: page.fill: Test timeout of 30000ms exceeded.
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