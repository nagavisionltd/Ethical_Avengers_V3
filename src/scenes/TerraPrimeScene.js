class TerraPrimeScene extends BaseScene {
    constructor() {
        super('TerraPrimeScene');
    }

    create(data) {
        this.charKey = data.char || 'cherry';
        const levelWidth = 1920;
        const levelHeight = 540;

        // --- Setup ---
        this.physics.world.setBounds(0, 0, levelWidth, levelHeight);
        this.add.image(0, 0, 'bg1').setOrigin(0).setDisplaySize(levelWidth, levelHeight);

        // --- Tilemap with Smart Tiling ---
        const layout = [];
        const levelGridWidth = 60;
        const levelGridHeight = 17;
        for (let y = 0; y < levelGridHeight; y++) { layout.push(Array(levelGridWidth).fill(-1)); }

        const makeSmartPlatform = (x, y, width) => {
            const TILES = { LEFT: 1, MID: 2, RIGHT: 3, SINGLE: 4 };
            if (width === 1) {
                layout[y][x] = TILES.SINGLE;
            } else if (width > 1) {
                layout[y][x] = TILES.LEFT;
                for (let i = 1; i < width - 1; i++) {
                    layout[y][x + i] = TILES.MID;
                }
                layout[y][x + width - 1] = TILES.RIGHT;
            }
        };

        makeSmartPlatform(0, 16, 10);
        makeSmartPlatform(15, 14, 10);
        makeSmartPlatform(30, 12, 10);
        makeSmartPlatform(45, 14, 10);
        makeSmartPlatform(55, 16, 5);

        const map = this.make.tilemap({ data: layout, tileWidth: 32, tileHeight: 32 });
        const tiles = map.addTilesetImage('terra_tileset');
        const groundLayer = map.createLayer(0, tiles, 0, 0);
        groundLayer.setCollisionByExclusion([-1]);

        // --- Player ---
        this.initPlayer(100, 400, levelWidth, this.charKey);
        this.physics.add.collider(this.player, groundLayer);
        this.cameras.main.setBounds(0, 0, levelWidth, levelHeight);

        // --- Enemies ---
        this.spawnWalker(900, 400);
        this.spawnDrone(1400, 250);

        // --- Return Portal ---
        const returnPortal = this.add.zone(levelWidth - 100, 430 - 100, 100, 400);
        this.physics.add.existing(returnPortal, true);
        this.physics.add.overlap(this.player, returnPortal, () => {
            this.cameras.main.fadeOut(500, 0, 0, 0, (cam, p) => {
                if (p === 1) this.scene.start('Level2_CrystalHub', data);
            });
        }, null, this);

        // --- UI ---
        this.scene.launch('UIScene', { char: this.charKey });
    }

    update() {
        if (this.player && this.player.active) {
            this.player.update();
        }
        this.enemies.getChildren().forEach(e => { if (e.update) e.update(); });
    }
}
