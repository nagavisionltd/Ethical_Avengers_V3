class LabScene extends BaseScene {
    constructor() { super('Lab'); }
    create(data) {
        const W = 4000; this.physics.world.setBounds(0, 0, W, 540);

        this.add.tileSprite(0, 0, W, 540, 'lab_back').setOrigin(0).setTileScale(3.1).setScrollFactor(0.2);
        this.add.tileSprite(0, 0, W, 540, 'lab_mid').setOrigin(0).setTileScale(1).setScrollFactor(0.6).setAlpha(0.7);

        const g = this.physics.add.staticGroup();
        this.add.tileSprite(0, 500, W, 40, 'lab_platform').setOrigin(0).setTileScale(2).setTint(0x4444ff).setDepth(1);
        g.create(W / 2, 530, null).setDisplaySize(W, 20).refreshBody();

        for (let i = 0; i < 5; i++) {
            const px = 800 + i * 700;
            this.add.tileSprite(px, 350, 300, 32, 'lab_platform').setOrigin(0).setTileScale(1).setTint(0x00ffaa).setDepth(1);
            g.create(px + 150, 360, null).setDisplaySize(300, 20).refreshBody();
        }

        const charKey = data && data.char ? data.char : 'cherry';
        this.charKey = charKey;
        this.initPlayer(100, 400, W, charKey);
        this.player.setDepth(10);
        this.physics.add.collider(this.player, g);
        this.physics.add.collider(this.enemies, g);

        for (let i = 0; i < 6; i++) {
            this.spawnWalker(600 + i * 600, 400);
            if (i % 2 === 0) this.spawnDrone(800 + i * 600, 200);
        }

        this.physics.add.overlap(this.player.hitArea, this.enemies, (h, e) => this.onEnemyHit(e, 10, this.player.atkID));
        this.physics.add.overlap(this.projs, this.enemies, (p, e) => { this.onEnemyHit(e, 20, p.getData('atkID')); p.destroy(); });

        this.portal = this.add.zone(3800, 450, 100, 400);
        this.physics.add.existing(this.portal, true);
        this.physics.add.overlap(this.player, this.portal, () => {
            this.sound.stopAll();
            this.cameras.main.fadeOut(500);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('StageTitleScene', {
                    title: 'PART 3: THE HEART OF THE SHADOW',
                    nextScene: 'BossFight',
                    sceneData: { char: this.charKey }
                });
            });
        });

        this.add.tileSprite(0, 0, W, 540, 'lab_fore').setOrigin(0).setTileScale(3.1).setScrollFactor(1.2).setAlpha(0.4).setDepth(20);
        this.sound.play('m2', { loop: true, volume: 0.3, detune: -200 });
    }
    update() {
        this.player.update();
        this.enemies.getChildren().forEach(e => { if (e.update) e.update(); });
    }
}