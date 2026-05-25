import { test, expect } from '@playwright/test';

test.describe('ASC Knowledge Hub - Scholarly Glossary', () => {

  test('Renders published glossary terms and filters them', async ({ page }) => {
    await page.goto('http://localhost:3000/glossary');
    
    // Check for the header
    await expect(page.locator('h1')).toContainText('Scholarly Glossary');

    // Check that Requisite Variety is rendered (from our seed data)
    await expect(page.locator('text=Requisite Variety')).toBeVisible();
    await expect(page.locator('text=Autopoiesis')).toBeVisible();

    // Check that 'Cyber' (which is in review) is NOT visible
    await expect(page.locator('text=computers and hacking')).toBeHidden();

    // Test Search Filter
    await page.fill('input[type="search"]', 'Ashby');
    
    // Autopoiesis should disappear, Requisite Variety should remain
    await expect(page.locator('text=Autopoiesis')).toBeHidden();
    await expect(page.locator('text=Requisite Variety')).toBeVisible();
  });

  test('Submits a new glossary term securely', async ({ page }) => {
    // 1. Log in as a user (using the one we set to password123)
    await page.goto('http://localhost:3000/auth/login');
    await page.fill('input[name="email"]', 'tj@tjmcleish.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Wait for the profile page to load
    await page.waitForURL('**/profile');

    // 2. Go to New Glossary Term page
    await page.goto('http://localhost:3000/glossary/new');
    
    // 3. Submit a new term
    await page.fill('input[name="title"]', 'Variety');
    await page.fill('textarea[name="content"]', 'A measure of the number of possible states of a system.');
    
    await page.getByRole('button', { name: /Submit for Review/i }).click();

    // 4. Verify Success UI
    await expect(page.locator('text=Term Submitted!')).toBeVisible();
    await expect(page.locator('text=in review')).toBeVisible();
  });

});
