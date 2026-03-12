class Level_ShippingDocks extends BaseScene {
    constructor() {
        super('Level_ShippingDocks');
    }

    create(data) {
        const levelWidth = 3840; // 4x screen width (960 * 4)
        const levelHeight = 540;

        this.physics.world.setBounds(0, 0, levelWidth, levelHeight);

        // --- BACKGROUND PARALLAX (Placeholders) ---
        // Far BG: Dark stormy sky
        this.add.rectangle(0, 0, levelWidth, levelHeight, 0x0a0a20).setOrigin(0).setScrollFactor(0);

        // Far BG: Crane Silhouettes (Placeholder rectangles)
        for (let i = 0; i < 5; i++) {
            this.add.rectangle(400 + i * 800, 100, 40, 440, 0x1a1a2e).setOrigin(0.5, 0).setScrollFactor(0.2);
            this.add.rectangle(400 + i * 800, 100, 200, 20, 0x1a1a2e).setOrigin(0.5, 0).setScrollFactor(0.2);
        }

        // Mid BG: Container stacks (Placeholder rectangles)
        for (let i = 0; i < 15; i++) {
            const colors = [0x4a1a1a, 0x1a4a4a, 0x1a1a4a];
            const h = 100 + Math.random() * 200;
            this.add.rectangle(200 + i * 300, levelHeight - h, 120, h, colors[i % 3])
                .setOrigin(0.5, 0)
                .setScrollFactor(0.5)
                .setStrokeStyle(2, 0x000000);
        }

        // --- RAIN EFFECT ---
        this.rainParticles = this.add.particles(0, 0, 'white_pixel', {
            x: { min: 0, max: levelWidth },
            y: -20,
            lifespan: 1000,
            speedY: { min: 400, max: 600 },
            speedX: { min: -100, max: -50 },
            scale: { start: 0.1, end: 0.1 },
            quantity: 5,
            blendMode: 'ADD',
            alpha: { start: 0.4, end: 0 }
        });
        this.rainParticles.setScrollFactor(0);

        // --- LEVEL LAYOUT ---
        const layout = [];
        const levelGridWidth = 120; // 3840 / 32
        const levelGridHeight = 17; // 544 / 32 (approx 540)

        for (let y = 0; y < levelGridHeight; y++) {
            layout.push(Array(levelGridWidth).fill(0));
        }

        const makePlatform = (x, y, width, height = 1) => {
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    if (x + i < levelGridWidth && y + j < levelGridHeight) {
                        layout[y + j][x + i] = 1;
                    }
                }
            }
        };

        // Main Ground
        makePlatform(0, 16, 120);

        // Container Stacks (Solid Platforms)
        makePlatform(10, 13, 4, 3);
        makePlatform(14, 10, 4, 6);
        makePlatform(25, 12, 6, 4);
        makePlatform(40, 8, 4, 8);
        makePlatform(45, 11, 4, 5);

        // More platforms...
        makePlatform(60, 13, 10, 3);
        makePlatform(80, 9, 5, 7);
        makePlatform(100, 12, 8, 4);

        // Map Creation
        const map = this.make.tilemap({ data: layout, tileWidth: 32, tileHeight: 32 });
        // Use a placeholder tileset or an existing one
        const tiles = map.addTilesetImage('lab_platform');
        const groundLayer = map.createLayer(0, tiles, 0, 0);
        groundLayer.setCollisionByExclusion([-1]);

        // Tint the ground to look wet/nocturnal
        groundLayer.setTint(0x222233);

        // --- PLAYER ---
        this.initPlayer(100, levelHeight - 100, levelWidth, data.char);
        this.physics.add.collider(this.player, groundLayer);

        // Camera
        this.cameras.main.setBounds(0, 0, levelWidth, levelHeight);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

        // --- ENEMIES ---
        this.spawnWalker(800, levelHeight - 100);
        this.spawnWalker(1500, levelHeight - 100);
        this.spawnDrone(1200, 200);
        this.spawnDrone(2200, 150);

        // --- GOAL ---
        const goal = this.add.rectangle(levelWidth - 100, levelHeight - 100, 64, 128, 0x00ffaa, 0.3);
        this.physics.add.existing(goal, true);
        this.physics.add.overlap(this.player, goal, () => {
            this.cameras.main.fadeOut(500, 0, 0, 0, (cam, progress) => {
                if (progress === 1) this.scene.start('WorldSelectScene');
            });
        });

        // Launch UI
        this.scene.launch('UIScene', { char: data.char });
    }

    update() {
        if (this.player && this.player.active) {
            this.player.update();
        }

        // Update rain x bounds to follow camera
        this.rainParticles.setX(this.cameras.main.scrollX);
    }
}
