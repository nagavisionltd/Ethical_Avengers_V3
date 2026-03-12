class Level1_IceWall extends BaseScene {
    constructor() {
        super('Level1_IceWall');
    }

    create(data) {
        super.create(); // Call BaseScene create for fades

        this.charKey = data.char || 'default';
        const W = Math.max(1600, this.cameras.main.width * 2);
        const H = this.cameras.main.height; // 540 standard

        // --- PHYSICS & CAMERA INIT ---
        this.physics.world.setBounds(0, 0, W, H);
        this.physics.world.gravity.y = 0; // 2.5D top-down zero gravity feel

        this.cameraLock = { min: 0, max: this.cameras.main.width };

        // --- BACKGROUND ---
        // Sky
        this.add.rectangle(0, 0, W, H * 0.5, 0x001a33).setOrigin(0).setScrollFactor(0);
        // Floor
        this.add.rectangle(0, H * 0.5, W, H * 0.5, 0x003366).setOrigin(0).setScrollFactor(1);

        // Ice Pillars (Procedural)
        for (let x = 0; x < W; x += 256) {
            let pHeight = Phaser.Math.Between(150, 300);
            this.add.rectangle(x, H * 0.5 - pHeight, 96, pHeight, 0x66ccff, 0.5).setOrigin(0).setScrollFactor(0.8);
        }

        // --- PLAYER INIT ---
        // Use BaseScene's initPlayer to load the real sprite with NeoPlayer logic
        this.initPlayer(100, H - 100, W, this.charKey);

        // Adjust player physics for 2.5D beat 'em up lane movement
        this.player.enable25DMode();
        this.player.setCollideWorldBounds(true);
        this.player.setDrag(800, 800);

        // Prevent player from walking into the sky
        this.limitY = H * 0.5;

        // --- GROUPS ---
        // this.enemies is created by initPlayer

        // --- WAVES SETUP ---
        this.waves = [
            { x: this.cameras.main.width, count: 2, triggered: false },
            { x: this.cameras.main.width * 1.5, count: 3, triggered: false },
            { x: W - 100, isBoss: true, triggered: false }
        ];
        this.currentWave = -1;

        // --- UI ---
        this.msgText = this.add.text(this.cameras.main.width / 2, 80, 'GO RIGHT!', {
            fontFamily: '"Press Start 2P"', fontSize: '24px', fill: '#fff', stroke: '#000', strokeThickness: 4
        }).setScrollFactor(0).setOrigin(0.5);
    }

    update() {
        if (!this.player || !this.player.active) return;

        // NeoPlayer update handles walking/attacking
        this.player.update();

        // Clamp Y limit for the "floor" and camera constraints
        if (this.player.baseLaneY < this.limitY) {
            this.player.baseLaneY = this.limitY;
            if (!this.player.isJumping25D) this.player.y = this.limitY;
        }

        if (this.player.x < this.cameraLock.min) this.player.x = this.cameraLock.min;
        if (this.player.x > this.cameraLock.max) this.player.x = this.cameraLock.max;

        // Z-Sorting & Shadow using true baseLaneY
        const playerLaneY = this.player.is25D ? this.player.baseLaneY : this.player.y;
        this.player.setDepth(playerLaneY);

        if (!this.playerShadow) {
            this.playerShadow = this.add.ellipse(this.player.x, playerLaneY, 60, 20, 0x000000, 0.4).setOrigin(0.5, 0.5);
        }
        this.playerShadow.x = this.player.x;
        this.playerShadow.y = playerLaneY;
        this.playerShadow.setDepth(playerLaneY - 1);
        this.playerShadow.setVisible(this.player.is25D);

        this.enemies.getChildren().forEach(e => {
            e.setDepth(e.y); // Enemies still use their Y for now
        });

        // Wave Tracking
        this.checkWaves();
    }

    checkWaves() {
        let camX = this.cameras.main.scrollX;
        for (let i = 0; i < this.waves.length; i++) {
            let w = this.waves[i];
            // Trigger when camera sees the point
            if (!w.triggered && camX + this.cameras.main.width >= w.x) {
                w.triggered = true;
                this.currentWave = i;
                this.lockArena(w.x);
                if (w.isBoss) this.spawnBoss(w.x);
                else this.spawnEnemyWave(w.count, w.x);
                break;
            }
        }

        // Unlock criteria
        if (this.currentWave !== -1 && this.enemies.countActive() === 0) {
            this.unlockArena();
        }
    }

    lockArena(rightX) {
        this.msgText.setText('DEFEAT ENEMIES!');
        this.cameraLock.max = rightX;
        this.cameraLock.min = rightX - this.cameras.main.width;
        this.cameras.main.setBounds(this.cameraLock.min, 0, this.cameras.main.width, this.cameras.main.height);
    }

    unlockArena() {
        this.msgText.setText('GO RIGHT!');
        const W = Math.max(1600, this.cameras.main.width * 2);
        this.cameraLock.max = W;
        this.cameraLock.min = this.cameras.main.scrollX;
        this.cameras.main.setBounds(0, 0, W, this.cameras.main.height);
        this.currentWave = -1;
    }

    spawnEnemyWave(count, areaX) {
        for (let i = 0; i < count; i++) {
            let ex = Phaser.Math.Between(areaX - 100, areaX - 20);
            let ey = Phaser.Math.Between(this.limitY + 50, this.cameras.main.height - 50);
            const type = Phaser.Math.RND.pick(['walker', 'drone']);
            if (type === 'walker') {
                const w = this.spawnWalker(ex, ey);
                w.body.setAllowGravity(false); // 2.5D movement
            } else {
                this.spawnDrone(ex, ey);
            }
        }
    }

    spawnBoss(areaX) {
        this.msgText.setText('BOSS: THE GATEKEEPER');

        // Placeholder boss graphics generator
        if (!this.textures.exists('boss_gatekeeper')) {
            let g = this.make.graphics({ x: 0, y: 0, add: false });
            g.fillStyle(0x4B0082); g.fillRect(0, 0, 128, 128);
            g.fillStyle(0x00ffff); g.fillCircle(64, 64, 30);
            g.generateTexture('boss_gatekeeper', 128, 128);
        }

        let ex = areaX - 80;
        let ey = this.limitY + 100;
        let b = this.enemies.create(ex, ey, 'boss_gatekeeper').setOrigin(0.5, 1);
        b.body.setAllowGravity(false);
        b.setData('hp', 300);
        b.setData('isBoss', true);
        b.setData('maxHP', 300);

        // Show boss bar
        const ui = this.scene.get('UIScene');
        if (ui && ui.showBossBar) ui.showBossBar('GATEKEEPER', true);

        // Simple Boss AI
        b.update = () => {
            if (!b.active || !this.player || !this.player.active) return;
            if (b.getData('isStunned')) return;

            this.physics.moveToObject(b, this.player, 80);

            const dist = Phaser.Math.Distance.BetweenPoints(this.player, b);
            if (dist < 80) {
                b.body.setVelocity(0, 0);
                if (Phaser.Math.Between(1, 100) > 95) {
                    if (this.onPlayerHit) this.onPlayerHit(this.player, b);
                }
            }
        };
    }

    onEnemyDeath(enemy) {
        super.onEnemyDeath(enemy);
        if (enemy.getData('isBoss')) {
            this.msgText.setText('STAGE 1 CLEARED!');
            const ui = this.scene.get('UIScene');
            if (ui && ui.showBossBar) ui.showBossBar('', false);

            this.time.delayedCall(3000, () => {
                this.cameras.main.fadeOut(1000, 0, 0, 0);
                this.cameras.main.once('camerafadeoutcomplete', () => {
                    this.unlockLevel('Aurelion'); // unlock next logical stage if needed
                    this.scene.start('WorldSelectScene'); // go back to map
                });
            });
        }
    }
}
