# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: moderation.spec.ts >> ASC Knowledge Hub - Moderation Dashboard >> Member can ask an expert question securely
- Location: tests\moderation.spec.ts:5:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.waitForURL: Test timeout of 30000ms exceeded.
=========================== logs ===========================
waiting for navigation to "**/profile" until "load"
  navigated to "http://localhost:3000/auth/login?message=Database%20error%20querying%20schema"
============================================================
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - generic [ref=e3]:
      - generic [ref=e4]:
        - link "ASC Knowledge Hub" [ref=e5] [cursor=pointer]:
          - /url: /
          - img [ref=e6]
          - generic [ref=e8]: ASC Knowledge Hub
        - generic [ref=e9]:
          - link "Events" [ref=e10] [cursor=pointer]:
            - /url: /events
          - link "Directory" [ref=e11] [cursor=pointer]:
            - /url: /directory
          - link "Organizations" [ref=e12] [cursor=pointer]:
            - /url: /directory/organizations
          - link "Glossary" [ref=e13] [cursor=pointer]:
            - /url: /glossary
      - navigation "Main navigation" [ref=e15]:
        - link "Sign In" [ref=e16] [cursor=pointer]:
          - /url: /auth/login
          - button "Sign In" [ref=e17]
        - link "Create Account" [ref=e18] [cursor=pointer]:
          - /url: /auth/register
          - button "Create Account" [ref=e19]
  - main [ref=e20]:
    - generic [ref=e22]:
      - generic [ref=e23]:
        - generic [ref=e24]: Welcome back
        - generic [ref=e25]: Sign in to your account to continue
      - generic [ref=e27]:
        - generic [ref=e28]:
          - generic "Social login coming soon" [ref=e29]
          - button [disabled]:
            - img
          - button [disabled]:
            - img
          - button [disabled]:
            - img
        - generic [ref=e34]: Or continue with
        - generic [ref=e35]:
          - generic [ref=e36]: Email
          - textbox "Email" [ref=e37]:
            - /placeholder: m@example.com
        - generic [ref=e38]:
          - generic [ref=e39]:
            - generic [ref=e40]: Password
            - link "Forgot password?" [ref=e41] [cursor=pointer]:
              - /url: /auth/reset-password
          - generic [ref=e42]:
            - textbox "Password" [ref=e43]
            - button "Show password" [ref=e44]:
              - img
              - generic [ref=e45]: Show password
        - button "Sign In" [ref=e46]
        - paragraph [ref=e47]: Database error querying schema
      - generic [ref=e49]:
        - text: Don't have an account?
        - link "Sign up" [ref=e50] [cursor=pointer]:
          - /url: /auth/register
  - generic [ref=e51]:
    - generic [ref=e52]:
      - img [ref=e53]
      - generic [ref=e55]: ASC CKH
    - navigation "Footer navigation" [ref=e56]:
      - link "About" [ref=e57] [cursor=pointer]:
        - /url: /about
  - button "Open Next.js Dev Tools" [ref=e63] [cursor=pointer]:
    - img [ref=e64]
  - alert [ref=e67]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('ASC Knowledge Hub - Moderation Dashboard', () => {
  4  | 
  5  |   test('Member can ask an expert question securely', async ({ page }) => {
  6  |     // 1. Log in as a normal member
  7  |     await page.goto('http://localhost:3000/auth/login');
  8  |     await page.fill('input[name="email"]', 'new.student@asc-cybernetics.org');
  9  |     await page.fill('input[name="password"]', 'password123');
  10 |     await page.click('button[type="submit"]');
  11 | 
> 12 |     await page.waitForURL('**/profile');
     |                ^ Error: page.waitForURL: Test timeout of 30000ms exceeded.
  13 | 
  14 |     // 2. Go to Ask an Expert page
  15 |     await page.goto('http://localhost:3000/glossary/ask');
  16 |     
  17 |     // 3. Submit a new question
  18 |     await page.fill('textarea[name="question"]', 'How does second-order cybernetics affect social systems design?');
  19 |     await page.getByRole('button', { name: /Submit Question/i }).click();
  20 | 
  21 |     // 4. Verify Success UI
  22 |     await expect(page.locator('text=Question Submitted!')).toBeVisible();
  23 |     await expect(page.locator('text=experts will review it')).toBeVisible();
  24 |   });
  25 | 
  26 |   test('Admin can view pending questions and reject one', async ({ page }) => {
  27 |     // 1. Log in as an admin
  28 |     await page.goto('http://localhost:3000/auth/login');
  29 |     await page.fill('input[name="email"]', 'admin@asc-cybernetics.org');
  30 |     await page.fill('input[name="password"]', 'admin123');
  31 |     await page.click('button[type="submit"]');
  32 | 
  33 |     await page.waitForURL('**/profile');
  34 | 
  35 |     // 2. Go to Moderation Dashboard
  36 |     await page.goto('http://localhost:3000/admin/moderation');
  37 |     
  38 |     // 3. Look for the pending questions
  39 |     await expect(page.locator('text=Pending Questions')).toBeVisible();
  40 |     await expect(page.locator('text=Hey you guys are all wrong')).toBeVisible(); // The bad seeded question
  41 | 
  42 |     // 4. Reject the bad question
  43 |     // Playwright selects the first 'Reject' button
  44 |     await page.locator('button:has-text("Reject")').first().click();
  45 |     
  46 |     // Fill reason
  47 |     await page.fill('textarea', 'This question is non-academic trolling and violates guidelines.');
  48 |     
  49 |     // Confirm
  50 |     await page.locator('button:has-text("Confirm")').click();
  51 | 
  52 |     // The text input is cleared and closed, so we know it succeeded
  53 |     await expect(page.locator('text=Reason for Rejection')).toBeHidden();
  54 |   });
  55 | 
  56 | });
  57 | 
```