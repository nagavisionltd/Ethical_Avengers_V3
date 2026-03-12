class KhemraScene extends BaseScene {
    constructor() {
        super('KhemraScene');
    }

    create(data) {
        this.charKey = data.char || 'cherry';
        const levelWidth = 2560;
        const levelHeight = 540;

        // --- Setup ---
        this.physics.world.setBounds(0, 0, levelWidth, levelHeight);
        this.add.image(0, 0, 'celestial_bg').setOrigin(0).setDisplaySize(levelWidth, levelHeight).setScrollFactor(0.5);

        this.bg_far = this.add.tileSprite(0, 0, levelWidth, levelHeight, 'warped_far_bg').setOrigin(0).setTileScale(4).setScrollFactor(0);
        this.bg_near = this.add.tileSprite(0, 0, levelWidth, levelHeight, 'warped_near_bg').setOrigin(0).setTileScale(4).setScrollFactor(0);

        // --- SOLID GROUND FLOOR (spans full level) ---
        this.add.tileSprite(0, 500, levelWidth, 40, 'warped_tileset').setOrigin(0).setTileScale(2).setDepth(1);
        const groundGroup = this.physics.add.staticGroup();
        groundGroup.create(levelWidth / 2, 520, null).setDisplaySize(levelWidth, 40).refreshBody();

        // --- ELEVATED PLATFORMS (for gameplay variety) ---
        const makePlatform = (x, y, w) => {
            this.add.tileSprite(x, y, w, 24, 'warped_tileset').setOrigin(0).setTileScale(1.5).setDepth(1).setTint(0x00ffaa);
            groundGroup.create(x + w / 2, y + 12, null).setDisplaySize(w, 24).refreshBody();
        };
        makePlatform(600, 380, 200);
        makePlatform(1000, 340, 250);
        makePlatform(1500, 360, 180);
        makePlatform(2000, 320, 220);

        // --- Decorative Props ---
        if (this.textures.exists('prop_control_box_1')) {
            this.add.image(500, 490, 'prop_control_box_1').setOrigin(0.5, 1).setScale(0.8);
            this.add.image(1500, 490, 'prop_control_box_1').setOrigin(0.5, 1).setScale(0.8).setFlipX(true);
        }

        // --- Player ---
        this.initPlayer(100, 400, levelWidth, this.charKey);
        this.physics.add.collider(this.player, groundGroup);
        this.physics.add.collider(this.enemies, groundGroup);
        this.cameras.main.setBounds(0, 0, levelWidth, levelHeight);

        // --- Enemies ---
        this.spawnWalker(800, 400);
        this.spawnDrone(1400, 250);

        // --- Hit Detection ---
        this.physics.add.overlap(this.player.hitArea, this.enemies, (h, e) => this.onEnemyHit(e, 10, this.player.atkID));
        this.physics.add.overlap(this.projs, this.enemies, (p, e) => { this.onEnemyHit(e, 20, p.getData('atkID')); p.destroy(); });

        // --- Goal Portal ---
        const goalPortal = this.add.zone(levelWidth - 150, 480 - 100, 100, 400);
        this.physics.add.existing(goalPortal, true);

        this.physics.add.overlap(this.player, goalPortal, () => {
            this.sound.stopAll();
            this.unlockLevel('UmbraPrime');
            this.scene.start('DialogueScene', {
                script: 'level1_part2_intro',
                nextScene: 'Level1_Hoverboard',
                sceneData: { char: this.charKey }
            });
        }, null, this);

        // --- UI ---
        this.scene.launch('UIScene', { char: this.charKey });

        if (this.cache.audio.exists('music_khemra')) {
            this.sound.play('music_khemra', { loop: true, volume: 0.5 });
        } else if (this.cache.audio.exists('m1')) {
            this.sound.play('m1', { loop: true, volume: 0.4 });
        }
    }

    update() {
        if (this.player && this.player.active) {
            this.player.update();
        }
        this.bg_far.tilePositionX = this.cameras.main.scrollX * 0.3;
        this.bg_near.tilePositionX = this.cameras.main.scrollX * 0.6;

        this.enemies.getChildren().forEach(e => { if (e.update) e.update(); });
    }
}
