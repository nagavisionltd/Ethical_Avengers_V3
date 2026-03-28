const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    page.on('console', msg => {
        console.log(`[BROWSER ${msg.type().toUpperCase()}] ${msg.text()}`);
    });
    
    page.on('pageerror', error => {
        console.log(`[BROWSER ERROR] ${error.message}`);
    });

    console.log("Navigating to http://127.0.0.1:8005/index.html...");
    await page.goto('http://127.0.0.1:8005/index.html', { waitUntil: 'networkidle' });
    
    await page.waitForTimeout(2000);
    console.log("Clicking body...");
    await page.mouse.click(100, 100);
    await page.waitForTimeout(4000);
    
    await browser.close();
})();
