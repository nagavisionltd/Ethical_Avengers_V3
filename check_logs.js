const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    page.on('console', msg => {
        console.log(`[BROWSER ${msg.type().toUpperCase()}] ${msg.text()}`);
    });

    console.log("Navigating to http://127.0.0.1:8008/index.html...");
    await page.goto('http://127.0.0.1:8008/index.html', { waitUntil: 'networkidle' });
    
    // give it a moment to boot
    await page.waitForTimeout(1000);
    
    // Jump straight to the generic tilemap scene for debugging
    await page.evaluate(() => {
        // Find any scene that is running
        const scenes = window.game.scene.scenes;
        if (scenes.length > 0) {
            scenes[0].scene.start('GenericTilemapScene', { arcadeStageIndex: 1 });
        }
    });
    
    // Wait for the scene to load and print debugs
    await page.waitForTimeout(3000);
    
    await browser.close();
})();
