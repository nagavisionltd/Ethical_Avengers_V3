const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    page.on('console', msg => {
        if (msg.type() === 'error' || msg.type() === 'warning' || msg.text().includes('Missing') || msg.text().includes('Asset')) {
            console.log(`[BROWSER ${msg.type().toUpperCase()}] ${msg.text()}`);
        }
    });

    page.on('pageerror', err => {
        console.log(`[PAGE ERROR] ${err.message}`);
    });

    console.log("Navigating to http://127.0.0.1:8000/index.html...");
    await page.goto('http://127.0.0.1:8000/index.html', { waitUntil: 'networkidle' });
    
    // give it a moment to boot
    await page.waitForTimeout(3000);
    
    await browser.close();
})();
