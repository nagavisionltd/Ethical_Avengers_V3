const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  page.on('console', msg => {
    if (msg.type() !== 'warning' && !msg.text().includes('Failed to load resource')) {
      // quiet noisy logs
    }
  });

  try {
    await page.goto('http://localhost:8080');

    await page.waitForTimeout(2000);

    // Jump to Mountain Interior (Arcade Stage Index 3: tm_mountain_interior)
    await page.evaluate(() => {
      const game = window.game;
      const bootScene = game.scene.getScene('Boot');
      bootScene.scene.stop('ModeSelectScene');
      bootScene.scene.start('GenericTilemapScene', { arcadeStageIndex: 3, char: 'default' });
    });

    await page.waitForTimeout(3000);

    console.log("--- HOLDING RIGHT IN MOUNTAIN INTERIOR ---");
    await page.keyboard.down('ArrowRight');

    for (let i = 0; i < 15; i++) {
      const state = await page.evaluate(() => {
        const s = window.game.scene.getScene('GenericTilemapScene');
        if (s && s.player && s.player.body) {
          return `X: ${Math.round(s.player.x)}, Y: ${Math.round(s.player.y)}, VY: ${Math.round(s.player.body.velocity.y)}, Floor: ${s.player.body.onFloor()}`;
        }
        return 'Player not ready';
      });
      console.log(state);
      await page.waitForTimeout(500);
    }

    await page.keyboard.up('ArrowRight');

  } catch (e) {
    console.log("Test Error", e);
  }

  await browser.close();
})();
