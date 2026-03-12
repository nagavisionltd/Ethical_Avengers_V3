class UmbraPrimeScene extends BaseScene {
    constructor() { super('UmbraPrimeScene'); }

    create(data) {
        const W = 6000; // Level width
        const H = 540;  // Level height
        this.physics.world.setBounds(0, 0, W, H);
        this.charKey = data.char || 'cherry';

        // 1. SKY LAYER (Far)
        this.add.tileSprite(0, 0, W, H, 'warped_sky_a').setOrigin(0).setTileScale(4).setScrollFactor(0.05);
        this.add.tileSprite(0, 0, W, H, 'warped_sky_b').setOrigin(0).setTileScale(4).setScrollFactor(0.1);

        // 2. BUILDINGS LAYER (Mid-Far)
        this.add.tileSprite(0, 50, W, H, 'warped_far_bg').setOrigin(0).setTileScale(4).setScrollFactor(0.2);

        // 3. NEAR BUILDINGS LAYER (Mid)
        this.add.tileSprite(0, 100, W, H, 'warped_near_bg').setOrigin(0).setTileScale(4).setScrollFactor(0.4);

        // 4. ANIMATED PROPS (Neon Signs, Monitors)
        for (let i = 0; i < 15; i++) {
            let px = 300 + i * 450 + Math.random() * 100;
            let py = 150 + Math.random() * 100;

            if (Math.random() > 0.5) {
                if (this.textures.exists('wc_neon_1'))
                    this.add.sprite(px, py, 'wc_neon_1').setScale(4).play('wc_neon_anim').setScrollFactor(0.4);
            } else {
                if (this.textures.exists('wc_monitor_1'))
                    this.add.sprite(px, py, 'wc_monitor_1').setScale(4).play('wc_monitor_anim').setScrollFactor(0.4);
            }

            if (Math.random() > 0.7) {
                this.add.image(px, py - 80, 'warped_prop_antenna').setScale(4).setScrollFactor(0.4);
            }
        }

        // 5. FLOOR / GROUND
        this.add.tileSprite(0, 480, W, 64, 'warped_tileset').setOrigin(0).setTileScale(4).setScrollFactor(1.0).setDepth(1);

        const ground = this.physics.add.staticGroup();
        ground.create(W / 2, 530, null).setDisplaySize(W, 20).refreshBody();

        // 5b. AIR TRAFFIC (Background)
        for (let i = 0; i < 5; i++) {
            const y = 100 + Math.random() * 200;
            const speed = (15 + Math.random() * 10) * 1000;
            const vehicleKey = Math.random() > 0.5 ? 'warped_vehicle_police' : 'warped_vehicle_truck';

            const traffic = this.add.image(-200, y, vehicleKey)
                .setScale(0.5 + Math.random() * 0.5)
                .setAlpha(0.4)
                .setDepth(-1);

            this.tweens.add({
                targets: traffic,
                x: W + 200,
                duration: speed,
                ease: 'Linear',
                loop: -1,
                delay: i * 3000
            });
        }

        // Launch UI
        this.scene.launch('UIScene', { char: this.charKey });

        // 6. PLAYER
        this.initPlayer(150, 400, W, this.charKey);
        this.player.setDepth(10);

        this.physics.add.collider(this.player, ground);
        this.physics.add.collider(this.enemies, ground);

        // 7. ENEMIES & DESTRUCTIBLES
        for (let i = 0; i < 10; i++) {
            const bx = 1200 + i * 550;
            const b1 = this.spawnDestructible(bx, 500, 'barrel1');
            const b2 = this.spawnDestructible(bx + 120, 500, 'box');
            if (b1) b1.setDepth(9);
            if (b2) b2.setDepth(9);

            if (i > 0) {
                const w = this.spawnWalker(bx + 300, 400);
                if (w) w.setDepth(10);

                if (i % 2 === 0) {
                    const d = this.spawnDrone(bx + 400, 200);
                    if (d) d.setDepth(10);
                }
            }
        }

        // 8. COMBAT LOGIC
        this.physics.add.overlap(this.player.hitArea, this.enemies, (h, e) => this.onEnemyHit(e, 10, this.player.atkID));
        this.physics.add.overlap(this.projs, this.enemies, (p, e) => {
            this.onEnemyHit(e, 20, p.getData('atkID'));
            p.destroy();
        });

        // 9. LEVEL END / TRANSITION
        const goal = this.add.zone(W - 200, 430, 100, 400);
        this.physics.add.existing(goal, true);

        this.physics.add.overlap(this.player, goal, () => {
            this.sound.stopAll();
            this.unlockLevel('Aetherion'); // Unlock the next node
            this.cameras.main.fadeOut(1000, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('StageTitleScene', {
                    title: 'PART 2: THE LAB',
                    nextScene: 'Lab',
                    sceneData: { char: this.charKey }
                });
            });
        });

        // 10. MUSIC & TEXT
        this.sound.stopAll();
        this.sound.play('m1', { loop: true, volume: 0.4 });

        const txt = this.add.text(480, 200, 'UMBRA PRIME', {
            fontFamily: '"Press Start 2P"', fontSize: '40px', color: '#ff00aa', stroke: '#000', strokeThickness: 6
        }).setOrigin(0.5).setScrollFactor(0).setAlpha(0);

        this.add.text(480, 260, 'PART 1: THE STREETS', {
            fontFamily: '"Press Start 2P"', fontSize: '20px', color: '#ffffff', stroke: '#000', strokeThickness: 4
        }).setOrigin(0.5).setScrollFactor(0).setAlpha(0);

        this.tweens.add({
            targets: txt,
            alpha: 1,
            y: 150,
            duration: 1000,
            ease: 'Power2',
            yoyo: true,
            hold: 2000,
            onComplete: () => txt.destroy()
        });
    }

    update() {
        if (this.player && this.player.update) this.player.update();
        this.enemies.getChildren().forEach(e => { if (e.update) e.update(); });
    }
}