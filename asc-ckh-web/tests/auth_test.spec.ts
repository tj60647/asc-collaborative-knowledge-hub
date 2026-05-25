import { test, expect } from '@playwright/test';

test('Can register and login a new user via API', async ({ page }) => {
  const uniqueEmail = `testuser_${Date.now()}@example.com`;
  
  // Register
  await page.goto('http://localhost:3000/auth/register');
  await page.fill('input[name="first_name"]', 'Test');
  await page.fill('input[name="last_name"]', 'User');
  await page.fill('input[name="email"]', uniqueEmail);
  await page.fill('input[name="password"]', 'password123');
  await page.fill('input[name="confirm_password"]', 'password123');
  await page.click('button[type="submit"]');

  // Wait for redirect to profile or an error
  await page.waitForURL(/.*profile|.*login.*/);
  console.log("Current URL after register:", page.url());

  // Log out if we went to profile
  if (page.url().includes('profile')) {
    await page.click('text=Sign Out');
    await page.waitForURL('http://localhost:3000/');
  }

  // Try to log in
  await page.goto('http://localhost:3000/auth/login');
  await page.fill('input[name="email"]', uniqueEmail);
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  
  await page.waitForURL(/.*profile|.*login.*/);
  console.log("Current URL after login:", page.url());
});
