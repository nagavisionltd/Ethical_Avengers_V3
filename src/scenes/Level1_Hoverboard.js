class Level1_Hoverboard extends BaseScene {
    constructor() {
        super('Level1_Hoverboard');
    }

    create(data) {
        this.charKey = data.char || 'cherry';

        // --- PARALLAX BACKGROUNDS ---
        const W = this.cameras.main.width;
        const H = this.cameras.main.height;

        // Layer 1: Distant sky (slowest parallax)
        this.bg_sky_a = this.add.tileSprite(0, 0, W, H, 'warped_sky_a').setOrigin(0).setScrollFactor(0);
        this.bg_sky_b = this.add.tileSprite(0, 0, W, H, 'warped_sky_b').setOrigin(0).setScrollFactor(0);

        // Layer 2: Far buildings
        this.bg_far = this.add.tileSprite(0, 0, W, H, 'warped_far_bg').setOrigin(0).setScrollFactor(0);

        // Layer 3: Near buildings (fastest parallax)
        this.bg_near = this.add.tileSprite(0, 0, W, H, 'warped_near_bg').setOrigin(0).setScrollFactor(0);

        // --- PLAYER ---
        // Uses BaseScene initPlayer
        this.initPlayer(200, H / 2, W, this.charKey);
        this.player.body.setAllowGravity(false); // Hoverboard mode: no gravity

        // --- GROUPS ---
        // BaseScene already creates this.projs and this.enemies

        // Track parallax offset
        this.parallaxOffset = 0;

        // --- PHYSICS ---
        // BaseScene handles player vs enemies collision

        // --- TIMERS ---
        this.enemyTimer = this.time.addEvent({
            delay: 1200,
            callback: this.spawnEnemy,
            callbackScope: this,
            loop: true
        });

        // Level End Timer
        this.levelTimer = this.time.delayedCall(30000, () => {
            this.sound.stopAll();
            this.scene.start('TravelCutscene', { char: this.charKey });
        });

        // --- SOUND ---
        this.sound.play('m2', { loop: true, volume: 0.4 });
    }

    update() {
        if (this.player && this.player.active) {
            this.player.update();
            this.player.y = Phaser.Math.Clamp(this.player.y, 50, this.cameras.main.height - 50);
            this.player.x = Phaser.Math.Clamp(this.player.x, 50, this.cameras.main.width - 50);
        }

        // --- PARALLAX SCROLLING ---
        this.parallaxOffset += 5; // Auto-scroll speed
        this.bg_sky_a.tilePositionX = this.parallaxOffset * 0.2;
        this.bg_sky_b.tilePositionX = this.parallaxOffset * 0.3;
        this.bg_far.tilePositionX = this.parallaxOffset * 0.5;
        this.bg_near.tilePositionX = this.parallaxOffset * 1.5;

        // --- Enemy Management ---
        Phaser.Actions.IncX(this.enemies.getChildren(), -10);
        this.enemies.getChildren().forEach(enemy => {
            if (enemy.x < -100) {
                enemy.destroy();
            }
            if (enemy.update) enemy.update();
        });

        this.projs.getChildren().forEach(proj => {
            if (proj.x > this.cameras.main.width + 100 || proj.x < -100) {
                proj.destroy();
            }
        });
    }

    spawnEnemy() {
        const type = Phaser.Math.RND.pick(['walker', 'drone']);
        const y = Phaser.Math.Between(100, this.cameras.main.height - 100);
        const x = this.cameras.main.width + 100;

        if (type === 'walker') {
            const w = this.spawnWalker(x, y);
            w.body.setAllowGravity(false); // Flying mode
            // Overworld-style AI: move horizontally
            w.update = () => {
                if (w.active) {
                    w.x -= 2;
                }
            };
        } else {
            this.spawnDrone(x, y);
        }
    }
}
