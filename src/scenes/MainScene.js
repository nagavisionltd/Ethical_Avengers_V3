class MainScene extends BaseScene {
    constructor() { super('Main'); }
    create(data) {
        const W = 5000; this.physics.world.setBounds(0, 0, W, 540);

        // FIXED: Use TileSprite for proper scrolling/repeating without distortion
        // scaling height to fit 540 (approx 0.5 scale of 1120)
        this.bg = this.add.tileSprite(0, 0, W, 540, 'bg1')
            .setOrigin(0)
            .setScrollFactor(0.5) // Parallax effect
            .setScale(1, 0.55); // Squash slightly to fit if needed, or better yet, let tileSprite handle window

        this.add.tileSprite(0, 500, W, 40, 'floor').setOrigin(0);

        const g = this.physics.add.staticGroup();
        g.create(W / 2, 530, null).setDisplaySize(W, 20).refreshBody();

        // This initializes this.player AND this.enemies group
        const charKey = data && data.char ? data.char : 'cherry'; // Default to cherry if no data
        this.charKey = charKey; // Store for passing to next level
        this.initPlayer(100, 400, W, charKey);
        this.physics.add.collider(this.player, g);
        this.physics.add.collider(this.enemies, g);

        // Launch UI here with character data
        this.scene.launch('UIScene', { char: charKey });

        // Spawn Walkers
        for (let i = 0; i < 3; i++) this.spawnWalker(800 + i * 1000, 400);

        // Spawn Drones (NEW)
        this.spawnDrone(1200, 200);
        this.spawnDrone(2200, 150);
        this.spawnDrone(3200, 250);

        const b = this.enemies.create(4500, 400, 'cyborg_001').setOrigin(0.5, 1).setScale(0.5).setCollideWorldBounds(true);
        b.setData({ hp: 100, maxHP: 100, isBoss: true });
        b.anims.play('b_i');

        // BOSS AI: Chase Player
        b.update = () => {
            if (!b.active || !this.player.active) return;
            if (b.getData('isStunned')) {
                b.anims.play('boss_hurt', true);
                return;
            }

            const dist = Phaser.Math.Distance.Between(b.x, b.y, this.player.x, this.player.y);
            const speed = 120; // Boss speed

            // Simple Chase
            if (dist > 120) {
                b.setVelocityX(this.player.x < b.x ? -speed : speed);
                b.setFlipX(this.player.x < b.x); // Face player
                b.anims.play('boss_walk', true);
            } else {
                b.setVelocityX(0);

                // Attack Logic
                if (b.anims.currentAnim && b.anims.currentAnim.key === 'boss_atk') {
                    // Check for impact (approximate frame index)
                    const frameIdx = b.anims.currentFrame ? b.anims.currentFrame.index : 0;
                    if (frameIdx >= 2 && !b.hasHit) {
                        const hitDist = Phaser.Math.Distance.Between(b.x, b.y, this.player.x, this.player.y);
                        if (hitDist < 160) {
                            this.onPlayerHit(this.player, b);
                            b.hasHit = true;
                        }
                    }

                    // Reset flag near end of animation loop
                    if (b.anims.getProgress() >= 0.95) {
                        b.hasHit = false;
                    }
                } else {
                    b.anims.play('boss_atk', true);
                    b.hasHit = false;
                }
            }
        };

        // Use the common overlap registration from BaseScene
        this.physics.add.overlap(this.player.hitArea, this.enemies, (h, e) => this.onEnemyHit(e, 10, this.player.atkID));
        this.physics.add.overlap(this.projs, this.enemies, (p, e) => { this.onEnemyHit(e, 20, p.getData('atkID'), 0); p.destroy(); });

        this.portal = this.add.zone(4800, 400, 100, 400);
        this.physics.add.existing(this.portal, true);
        this.physics.add.overlap(this.player, this.portal, () => {
            this.sound.stopAll();
            this.scene.start('UmbraPrimeScene', { char: this.charKey });
        });

        this.sound.play('m1', { loop: true, volume: 0.4 });
        this.bossRef = b;
    }
    update() {
        this.player.update();
        this.enemies.getChildren().forEach(e => { if (e.update) e.update(); });

        if (this.bossRef && this.bossRef.active) {
            const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.bossRef.x, this.bossRef.y);
            const ui = this.scene.get('UIScene');
            if (dist < 600) ui.showBossBar('Cyborg Vanguard', true);
        }
    }
}
