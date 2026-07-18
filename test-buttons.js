import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:5173/');
  
  await page.waitForTimeout(1000);
  
  for (let id of ['btnShuffle', 'btnSettings', 'btnHide', 'btnClose']) {
    try {
      await page.evaluate((btnId) => {
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.click();
        }
      }, id);
      console.log(`${id} clicked via JS`);
    } catch(e) {
      console.log(`${id} failed:`, e.message);
    }
    await page.waitForTimeout(500);
  }
  await browser.close();
})();
