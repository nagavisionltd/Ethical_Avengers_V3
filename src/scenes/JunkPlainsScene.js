class JunkPlainsScene extends BaseScene {
    constructor() {
        super('JunkPlainsScene');
    }

    create(data) {
        console.log("JUNK_PLAINS: Finalizing Level v16.3.8 - Intended Flow");
        this.levelData = data || {}; // Store for portal transition

        // 1. Narrative Intro Trigger (Story mode only — arcade skips dialogue)
        const isArcade = data.gameMode === 'arcade';
        if (!isArcade && !data.dialoguePlayed) {
            console.log("JUNK_PLAINS: Triggering Intro Dialogue");
            this.scene.start('DialogueScene', {
                script: 'junk_plains_intro',
                nextScene: 'JunkPlainsScene',
                sceneData: { ...data, dialoguePlayed: true }
            });
            return;
        }

        super.create(data);

        // 2. Load the intended map dynamically
        const mapKey = data.mapKey || 'junk_plains_map';
        const map = this.make.tilemap({ key: mapKey });

        // 3. Map Tilesets: JSON tileset name → Phaser preloaded image key
        // This must cover EVERY possible tileset name that appears in any of the JSON map files.
        const tilesetMap = {
            // Mars / Mountain tilesets (old names from original Tiled exports)
            'back': 'mars_back', 'middle': 'mars_middle', 'near': 'mars_near', 'tileset': 'mars_tileset',
            // Mars / Mountain tilesets (renamed by our fix script)
            'mars_back': 'mars_back', 'mars_middle': 'mars_middle', 'mars_near': 'mars_near', 'mars_tileset': 'mars_tileset',
            'mars_floor_001': 'mars_floor_001', 'mars_floor_002': 'mars_floor_002', 'mars_floor_003': 'mars_floor_003', 'mars_floor_004': 'mars_floor_004',
            'mars_floor_005': 'mars_floor_005', 'mars_floor_006': 'mars_floor_006',
            // Junk Wastelands tilesets
            'junk_back': 'junk_back', 'junk_middle': 'junk_middle', 'junk_near': 'junk_near', 'junk_tileset': 'junk_tileset',
            // Cyberpunk strip
            'cyberpunk_strip': 'cyberpunk_strip', 'cyberpunk-corridor-strip': 'cyberpunk_strip',
            // Warped Zone tilesets
            'warped_back2': 'warped_back2', 'warped_back_alt': 'warped_back_alt', 'warped_tileset_alt': 'warped_tileset_alt',
            'back-2': 'warped_back2',
            // Warped City backgrounds
            'buildings-bg': 'w_buildings_bg', 'near-buildings-bg': 'w_near_buildings_bg',
            'skyline-a': 'w_skyline_a', 'skyline-b': 'w_skyline_b',
            // Alien / Mountain Interior
            'background': 'alien_bg', 'back-structures': 'alien_back_structures',
            // Rocky Mountains / Glacial
            'sky': 'g_sky', 'sky_lightened': 'g_sky_light',
            'glacial_mountains': 'g_mountains', 'glacial_mountains_lightened': 'g_mountains_light',
            'clouds_mg_3': 'g_clouds_3', 'clouds_mg_2': 'g_clouds_2', 'clouds_mg_1': 'g_clouds_1',
            'clouds_bg': 'g_clouds_bg', 'cloud_lonely': 'g_cloud_lonely',
            'props1': 'caves_props1', 'props2': 'caves_props2'
        };

        // Address naming collisions where multiple unrelated maps simply named their tileset "tileset"
        if (mapKey === 'map_warped_city') tilesetMap['tileset'] = 'w_tileset';
        else if (mapKey === 'map_mountain_interior') tilesetMap['tileset'] = 'alien_tileset';

        const allTiles = [];
        map.tilesets.forEach(ts => {
            const phaserKey = tilesetMap[ts.name] || ts.name;
            try {
                const t = map.addTilesetImage(ts.name, phaserKey);
                if (t) {
                    allTiles.push(t);
                    console.log(`Successfully mapped tileset: ${ts.name} to image key: ${phaserKey}`);
                } else {
                    console.error(`FAILED to map tileset: ${ts.name} to image key: ${phaserKey}`);
                }
            } catch (e) { console.error("Missing tileset mapping for:", ts.name, e); }
        });

        console.log("Total tilesets mapped:", allTiles.length);

        // 4. Create Layers with Scale
        const SCALE = 2;
        let currentDepth = 1;
        let collisionsLayer = null;

        // Create all tile layers from the map (map.layers only contains tile layers in Phaser 3)
        console.log('map.layers count:', map.layers.length);
        map.layers.forEach((layerData, i) => {
            try {
                const layer = map.createLayer(layerData.name, allTiles, 0, 0);
                if (layer) {
                    layer.setScale(SCALE);
                    layer.setDepth(currentDepth++);
                    let nonZero = 0;
                    layer.layer.data.forEach(row => row.forEach(tile => { if (tile.index > 0) nonZero++; }));
                    console.log(`LAYER OK: ${layerData.name} | tiles: ${nonZero} | depth: ${layer.depth}`);
                } else {
                    console.error(`createLayer returned NULL for: ${layerData.name}`);
                }
            } catch (e) {
                console.error(`createLayer EXCEPTION for: ${layerData.name}`, e.message);
            }
        });

        // Initialize any animated tiles defined in Tiled (e.g., steam, neon signs)
        this.initAnimatedTiles(map);

        // --- NEW: Object-based Collisions ---
        this.collisionBoxes = this.physics.add.staticGroup();
        const collisionLayerData = map.getObjectLayer('Collisions');

        if (collisionLayerData && collisionLayerData.objects) {
            collisionLayerData.objects.forEach(obj => {
                let boxX, boxY, boxW, boxH;

                if (obj.polygon) {
                    let minX = 0, minY = 0, maxX = 0, maxY = 0;
                    obj.polygon.forEach(p => {
                        if (p.x < minX) minX = p.x;
                        if (p.x > maxX) maxX = p.x;
                        if (p.y < minY) minY = p.y;
                        if (p.y > maxY) maxY = p.y;
                    });
                    boxW = (maxX - minX) * SCALE;
                    boxH = Math.max((maxY - minY) * SCALE, 30); // Prevent tunneling
                    boxX = (obj.x + minX) * SCALE;
                    boxY = (obj.y + minY) * SCALE;
                } else {
                    boxX = obj.x * SCALE;
                    boxY = obj.y * SCALE;
                    boxW = obj.width * SCALE;
                    boxH = Math.max(obj.height * SCALE, 30); // Guarantee minimum height to prevent phasing
                }

                // Create a VISIBLE red rectangle with a static physics body for debugging
                const zone = this.add.rectangle(boxX + (boxW / 2), boxY + (boxH / 2), boxW, boxH, 0xff0000, 0.4);
                this.physics.add.existing(zone, true); // true = static body

                // By default, make all collision boxes SOLID on all sides so staircases/slopes work correctly.
                // If you want a platform the player can jump up through, add a Custom Property in Tiled:
                // Name: type, Type: string, Value: jumpthrough
                if (obj.type && obj.type.toLowerCase() === 'jumpthrough') {
                    zone.body.checkCollision.down = false;
                    zone.body.checkCollision.left = false;
                    zone.body.checkCollision.right = false;
                }

                this.collisionBoxes.add(zone);
            });
            console.log("JUNK_PLAINS: Loaded Object Layer 'Collisions' with " + collisionLayerData.objects.length + " boxes/polygons.");
        }

        // 5. World & Camera Bounds
        let levelW = map.widthInPixels * SCALE;
        let levelH = map.heightInPixels * SCALE;
        if (levelW < 960) levelW = 960;
        if (levelH < 540) levelH = 540;

        this.physics.world.setBounds(0, 0, levelW, levelH);
        this.cameras.main.setBounds(0, 0, levelW, levelH);

        // 6. Spawn System Initialization
        let playerStartX = 150;
        let playerStartY = levelH / 2; // Spawn in middle of screen to avoid dropping out of bounds

        const objLayer = map.getObjectLayer('Object Layer 1');
        if (objLayer && objLayer.objects.length > 0) {
            const startObj = objLayer.objects.find(o => o.name === 'start') || objLayer.objects[0];
            playerStartX = startObj.x * SCALE;
            playerStartY = startObj.y * SCALE;
        }

        // --- CRITICAL FIX: initPlayer creates 'this.enemies' and 'this.projs' groups ---
        this.initPlayer(playerStartX, playerStartY, levelW, data.char || data.charType || 'default');

        // Force player to render ON TOP of all tilemap layers
        if (this.player) {
            this.player.setDepth(100);
        }

        // 7. Enemy Spawning (MUST happen after initPlayer)
        if (objLayer && objLayer.objects.length > 0) {
            objLayer.objects.forEach((obj) => {
                if (obj.name !== 'start' && obj.x * SCALE > playerStartX + 300) {
                    const dice = Phaser.Math.Between(0, 100);
                    if (dice < 60) {
                        this.spawnWalker(obj.x * SCALE, obj.y * SCALE);
                    } else {
                        this.spawnDrone(obj.x * SCALE, (obj.y - 60) * SCALE);
                    }
                }
            });
        }

        this.physics.add.collider(this.player, this.collisionBoxes);
        this.physics.add.collider(this.enemies, this.collisionBoxes);

        this.physics.add.overlap(this.player.hitArea, this.enemies, (h, e) => {
            this.onEnemyHit(e, 10, this.player.atkID, this.player.currentKB || 1);
        }, null, this);

        this.physics.add.overlap(this.projs, this.enemies, (p, e) => {
            this.onEnemyHit(e, 20, p.getData('atkID'), 1);
            p.destroy();
        }, null, this);

        // 9. Goal Portal
        // Moved the portal extremely far to the right so it doesn't instantly end small test maps.
        const portal = this.add.zone(Math.max(levelW - 120, 5000), 480 - 100, 100, 400);
        this.physics.add.existing(portal, true);
        this.physics.add.overlap(this.player, portal, () => {
            this.cameras.main.fadeOut(1000);
            this.time.delayedCall(1000, () => this.scene.start('CrystalHubScene', {
                char: this.levelData.char,
                gameMode: this.levelData.gameMode,
                junkPlainsComplete: true
            }));
        });

        this.cameras.main.setBackgroundColor('#000000');
        this.cameras.main.fadeIn(500);

        console.log("JUNK_PLAINS: v16.3.8 Loaded Successfully");
    }

    update(time, delta) {
        this.updateAnimatedTiles(delta);

        if (this.player && this.player.update) {
            this.player.update(this.cursors);
        }
        if (this.enemies) {
            this.enemies.getChildren().forEach(e => { if (e.update) e.update(); });
        }
    }
}
