class DebugScene extends Phaser.Scene {
    constructor() {
        super({ key: 'DebugScene' });
    }

    preload() {
        console.log('DebugScene: Preloading assets...');
        // Load ONLY what's needed for this test.
        
        // 1. The problematic tileset
        this.load.image('debug_tiles', 'new_tilesets/warped_city_files/ENVIRONMENT/tileset.png');

        // 2. The problematic animation frames
        const cherryIdleFrames = [0, 3, 6, 9, 12, 15, 18];
        cherryIdleFrames.forEach(n => {
            const frameKey = `cherry_${n.toString().padStart(4, '0')}`;
            this.load.image(frameKey, `assets/images/characters/cherry/${frameKey}.png`);
        });

        this.load.on('loaderror', (file) => {
            console.error(`DEBUG: Asset failed to load: ${file.key} at ${file.url}`);
        });
        
        this.load.on('complete', () => {
            console.log('DebugScene: Preload complete.');
        });
    }

    create() {
        console.log('DebugScene: Creating scene...');

        // --- TEST 1: Tilemap Background ---
        try {
            const map = this.make.tilemap({ tileWidth: 32, tileHeight: 32, width: 30, height: 17 });
            const tileset = map.addTilesetImage('debug_tiles');
            if (tileset) {
                 const layer = map.createLayer(0, tileset, 0, 0);
                 console.log('DebugScene: Tilemap layer created successfully.');
            } else {
                 console.error('DebugScene: addTilesetImage failed. The "debug_tiles" texture key is likely missing.');
                 this.add.rectangle(480, 270, 960, 540, 0xff0000); // Red screen for error
            }
        } catch(e) {
            console.error('DebugScene: CRASH during tilemap creation.', e);
        }
        
        // --- TEST 2: Character Animation ---
        try {
            const cherryIdleFrames = [0, 3, 6, 9, 12, 15, 18].map(n => ({
                key: `cherry_${n.toString().padStart(4, '0')}`
            }));
            
            this.anims.create({
                key: 'debug_cherry_idle',
                frames: cherryIdleFrames,
                frameRate: 12,
                repeat: -1
            });
            console.log('DebugScene: "debug_cherry_idle" animation created.');

            const player = this.add.sprite(480, 400, 'cherry_0000').setScale(0.5);
            player.play('debug_cherry_idle');
            console.log('DebugScene: Player created and playing animation.');
        } catch(e) {
            console.error('DebugScene: CRASH during animation creation or playback.', e);
        }

        this.add.text(480, 50, 'DEBUG MODE', { fontSize: '32px', fontFamily: '"Press Start 2P"' }).setOrigin(0.5);
    }
}