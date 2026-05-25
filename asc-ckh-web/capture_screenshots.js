const { chromium } = require('@playwright/test');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\tj\\.gemini\\antigravity\\brain\\f365401a-f428-403b-ab72-bf9f54412f03';
const BASE_URL = 'http://localhost:3000';

const PAGES = [
  { name: 'home',               url: '/' },
  { name: 'events',             url: '/events' },
  { name: 'directory',          url: '/directory' },
  { name: 'organizations',      url: '/directory/organizations' },
  { name: 'glossary',           url: '/glossary' },
  { name: 'admin_overview',     url: '/admin' },
  { name: 'admin_moderation',   url: '/admin/moderation' },
  { name: 'admin_members',      url: '/admin/members' },
  { name: 'admin_data_quality', url: '/admin/curation' },
  { name: 'login',              url: '/auth/login' },
];

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  for (const { name, url } of PAGES) {
    try {
      console.log(`Capturing: ${url}`);
      await page.goto(`${BASE_URL}${url}`, { waitUntil: 'networkidle', timeout: 15000 });
      await page.waitForTimeout(800);
      const dest = path.join(ARTIFACT_DIR, `audit_${name}.png`);
      await page.screenshot({ path: dest, fullPage: true });
      console.log(`  Saved → ${dest}`);
    } catch (err) {
      console.error(`  ERROR on ${url}: ${err.message}`);
    }
  }

  await browser.close();
  console.log('Done.');
})();
