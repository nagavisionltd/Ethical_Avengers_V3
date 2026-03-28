const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    page.on('console', msg => {
        console.log(`[BROWSER ${msg.type().toUpperCase()}] ${msg.text()}`);
    });

    console.log("Navigating to http://127.0.0.1:8005/index.html...");
    await page.goto('http://127.0.0.1:8005/index.html', { waitUntil: 'networkidle' });
    
    await page.waitForTimeout(1000);
    
    await page.evaluate(() => {
        const game = window.game;
        if (!game) return;
        // Test if the new animations are correctly registered
        const animKeys = ['cro_idle', 'cro_run', 'cro_hover', 'cro_atk1', 'cro_sw1', 'cro_kick1', 'cro_blast1'];
        animKeys.forEach(k => {
            console.log(`Checking animation ${k}:`, game.anims.exists(k));
        });
    });
    
    await browser.close();
})();
