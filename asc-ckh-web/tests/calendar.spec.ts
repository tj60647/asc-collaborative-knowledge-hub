import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Calendar UI Tests', () => {
  test('should render the calendar month view and pass accessibility checks', async ({ page }) => {
    // Navigate to the Calendar page
    await page.goto('/calendar');
    
    // Check that the title is visible
    await expect(page.locator('h1').filter({ hasText: 'Society Calendar' })).toBeVisible({ timeout: 15000 });

    // Take a screenshot of the default Month View
    await page.screenshot({ path: 'calendar-month-view.png', fullPage: true });

    // Run axe accessibility scan
    const accessibilityScanResults = await new AxeBuilder({ page })
      .disableRules(['region'])
      .analyze();
    
    // We expect 0 violations, but if there are some we will log them.
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should toggle to the agenda view and render correctly', async ({ page }) => {
    await page.goto('/calendar');
    
    // Click the Agenda view button
    await page.click('button:has-text("Agenda")');
    
    // Check that upcoming events header is visible
    await expect(page.locator('h2').filter({ hasText: 'Upcoming Events' })).toBeVisible();

    // Take a screenshot of the Agenda View
    await page.screenshot({ path: 'calendar-agenda-view.png', fullPage: true });
  });
});
