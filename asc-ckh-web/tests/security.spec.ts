import { test, expect } from '@playwright/test';

test.describe('ASC Knowledge Hub - Security & Input Validation', () => {

  test('Rejects profile updates that exceed Zod schema limits', async ({ page }) => {
    // 1. Log in as the Admin (they already exist in the database from the seeder)
    await page.goto('http://localhost:3000/auth/login');
    await page.fill('input[name="email"]', 'tj@tjmcleish.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Wait for the profile page to load
    await page.waitForURL('**/profile');

    // 2. Attempt to submit a massive bio (buffer overflow attempt)
    // Zod schema limits bio to 500 characters
    const massivePayload = 'A'.repeat(600);
    await page.fill('textarea[name="bio"]', massivePayload);

    // Try to save
    await page.getByRole('button', { name: /Save Profile Settings/i }).click();

    // 3. Assert that the server rejected the payload and the UI displays the error
    // Our Server Action returns { error: 'Validation Error: Bio cannot exceed 500 characters' }
    // The ProfileForm component should display this error
    await expect(page.locator('.bg-destructive\\/10')).toContainText(/Bio cannot exceed 500 characters/i);

    // 4. Test missing required fields
    // Zod schema requires first_name to be at least 1 character
    await page.fill('input[name="first_name"]', '');
    await page.getByRole('button', { name: /Save Profile Settings/i }).click();
    await expect(page.locator('.bg-destructive\\/10')).toContainText(/Name is required/i);
  });

});
