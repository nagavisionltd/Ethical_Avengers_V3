// ======================================================================
// GenericTilemapScene.js — Data-driven arcade level scene
// Loads any tilemap from ARCADE_LEVELS config, handles collisions,
// spawns player & enemies, and portals to the next level.
// ======================================================================

const ARCADE_LEVELS = [
    {
        key: 'tm_antarctica',
        title: 'Stage 1: Antarctica (The Ice Wall)',
        collisionLayers: ['collisions'],
        tilesetOverrides: { 'antarctica_tiles': 'antarctica_tiles' },
        bgImage: 'bg_antarctica'
    },
    {
        key: 'tm_rocky_mountains',
        title: 'Stage 2: Rocky Mountains',
        collisionLayers: ['Collisions'],
        tilesetOverrides: {}
    },
    {
        key: 'tm_arcade_map',
        title: 'Stage 3: Arcade Quest',
        collisionLayers: ['collisions-floor-platforms'],
        tilesetOverrides: {}
    },
    {
        key: 'tm_night_sky',
        title: 'Stage 4: Nebula Heights',
        collisionLayers: ['ground'],
        tilesetOverrides: {}
    }
];

// Master tileset name → Phaser image key mapping
const GLOBAL_TILESET_MAP = {
    // Rocky Mountains / Glacial
    'sky': 'g_sky', 'sky_lightened': 'g_sky_light',
    'glacial_mountains': 'g_mountains', 'glacial_mountains_lightened': 'g_mountains_light',
    'clouds_mg_3': 'g_clouds_3', 'clouds_mg_2': 'g_clouds_2', 'clouds_mg_1': 'g_clouds_1',
    'clouds_bg': 'g_clouds_bg', 'cloud_lonely': 'g_cloud_lonely',
    'props1': 'caves_props1', 'props2': 'caves_props2',

    // Mars tilesets
    'back': 'mars_back', 'middle': 'mars_middle', 'near': 'mars_near', 'tileset': 'mars_tileset',
    'mars_back': 'mars_back', 'mars_middle': 'mars_middle', 'mars_near': 'mars_near', 'mars_tileset': 'mars_tileset',
    'mars_floor_002': 'mars_floor_002', 'mars_floor_004': 'mars_floor_004', 'mars_floor_005': 'mars_floor_005',
    // Mars - sunny mountains
    'sunny-mountains-sky': 'sunny_mountains_sky',
    'sunny-mountains-hills': 'sunny_mountains_hills',
    'sunny-mountains-far-back': 'sunny_mountains_far_back',
    'foreground': 'sunny_mountains_fg',

    // Mountain Interior (Alien)
    'background': 'alien_bg', 'back-structures': 'alien_back_structures',

    // Cyberpunk corridor (Lab)
    'cyberpunk-corridor': 'cp_corridor',
    'cyberpunk-corridor-strip': 'cyberpunk_strip',
    'cyberpunk-corridor-bg-custom': 'cp_bg_custom',
    'panel_1_0': 'cp_panel_1_0', 'panel_0_0': 'cp_panel_0_0',
    'panel_2_0': 'cp_panel_2_0', 'panel_1_1': 'cp_panel_1_1', 'panel_2_1': 'cp_panel_2_1',

    // Sewers
    'sewer_tiles': 'sewer_tiles', 'sewer_back': 'sewer_back',
    'sewer_front': 'sewer_front', 'sewer_mid': 'sewer_mid',

    // Sewers Part 2 (using sewer tiles as fallback)
    'level3_mockup_169': 'sewer_back',
    'level3_layer3_foreground': 'sewer_front',
    'level3_layer1_abyss': 'sewer_mid',

    // Cyber City
    'GUNSTAR-HEROES': 'gunstar_heroes_tiles',
    'bg1': 'bg1',

    // Lava Lab
    'lava_background': 'lava_back',
    'lava-tile': 'lava_tile',
    'middle-rocks': 'lava_middle_rocks',
    'lab_background': 'lab_back',
    'tile-set-sci-fi-interior-platform': 'lab_platform',
    'lab_cp_back': 'cp_back',

    // Night Sky / Nebula
    'spaceworld_parallax_nebula': 'nebula_bg',
    'boss-fight-2': 'bg_boss',
    'warped_tileset': 'warped_tileset',

    // Warped City / Other
    'buildings-bg': 'w_buildings_bg', 'near-buildings-bg': 'w_near_buildings_bg',
    'skyline-a': 'w_skyline_a', 'skyline-b': 'w_skyline_b',

    // Junk
    'junk_back': 'junk_back', 'junk_middle': 'junk_middle',
    'junk_near': 'junk_near', 'junk_tileset': 'junk_tileset',
    'cyberpunk_strip': 'cyberpunk_strip',
    'warped_back2': 'warped_back2', 'warped_back_alt': 'warped_back_alt',
    'warped_tileset_alt': 'warped_tileset_alt',
    'back-2': 'warped_back2',
    'back': 'mars_back', 'middle': 'mars_middle', 'near': 'mars_near', 'tileset': 'mars_tileset',
    'panel_1_0': 'cp_panel_1_0', 'panel_0_0': 'cp_panel_0_0',
    'panel_2_0': 'cp_panel_2_0', 'panel_1_1': 'cp_panel_1_1', 'panel_2_1': 'cp_panel_2_1',
    'cyberpunk_strip': 'cyberpunk_strip',
    'Collisions': 'white_pixel'
};

class GenericTilemapScene extends BaseScene {
    constructor() {
        super('GenericTilemapScene');
    }

    // CRITICAL: Clean up when scene is stopped/restarted
    shutdown() {
        console.log("GENERIC_TILEMAP: shutdown() — cleaning up physics");
        if (this.floorCollider) this.physics.world.removeCollider(this.floorCollider);
        if (this.enemyCollider) this.physics.world.removeCollider(this.enemyCollider);
        this.floorCollider = null;
        this.enemyCollider = null;
        this.collisionBoxes = null;
        this.portalTriggered = false;
    }

    create(data) {
        console.log("%c GENERIC_TILEMAP: create() START ", "background: #ff0; color: #000; font-weight: bold;");
        console.log("Data:", JSON.stringify(data));

        // Reset state from any previous run
        this.portalTriggered = false;
        this.floorCollider = null;
        this.enemyCollider = null;
        this.levelData = data || {};

        const stageIndex = data.arcadeStageIndex || 0;
        this.levelConfig = ARCADE_LEVELS[stageIndex];
        const levelConfig = this.levelConfig;

        if (!levelConfig) {
            console.error("GENERIC_TILEMAP: No level config for stage index:", stageIndex);
            this.scene.start('ModeSelectScene');
            return;
        }

        console.log(`GENERIC_TILEMAP: Loading ${levelConfig.title} (key: ${levelConfig.key})`);

        // Call BaseScene.create for fadeIn
        super.create(data);

        // 1. Create the tilemap
        const map = this.make.tilemap({ key: levelConfig.key });

        // 1b. Render Fixed Camera Background
        if (levelConfig.bgImage) {
            this.bg = this.add.image(0, 0, levelConfig.bgImage).setOrigin(0, 0).setDepth(0).setScrollFactor(0);
            this.bg.setScale(Math.max(960 / this.bg.width, 540 / this.bg.height));
            console.log(`GENERIC_TILEMAP: Added static background image ${levelConfig.bgImage}`);
        }

        // 2. Build merged tileset mapping (global + per-level overrides)
        const tilesetMap = { ...GLOBAL_TILESET_MAP, ...levelConfig.tilesetOverrides };

        const allTiles = [];
        map.tilesets.forEach(ts => {
            const phaserKey = tilesetMap[ts.name] || ts.name;
            try {
                const t = map.addTilesetImage(ts.name, phaserKey);
                if (t) {
                    allTiles.push(t);
                    console.log(`TILESET OK: ${ts.name} → ${phaserKey}`);
                } else {
                    console.warn(`TILESET FAIL: ${ts.name} → ${phaserKey} (returned null)`);
                }
            } catch (e) {
                console.warn(`TILESET ERR: ${ts.name} → ${phaserKey}`, e.message);
            }
        });

        // 3. Create all tile layers
        // Use the level's specific scale, or default to 2 for older 16-bit maps
        const SCALE = levelConfig.scale || 2;
        let currentDepth = 1;

        map.layers.forEach((layerData) => {
            try {
                const layer = map.createLayer(layerData.name, allTiles, 0, 0);
                if (layer) {
                    layer.setScale(SCALE);

                    // Render layers with specific names above the player (depth 100)
                    const lowerName = layerData.name.toLowerCase();
                    if (lowerName.includes('front') || lowerName.includes('fore') || lowerName.includes('top') || lowerName.includes('above')) {
                        layer.setDepth(150 + currentDepth++);
                    } else {
                        layer.setDepth(10 + currentDepth++);
                    }
                }
            } catch (e) {
                console.warn(`LAYER ERR: ${layerData.name}`, e.message);
            }
        });

        this.initAnimatedTiles(map);

        // 4. World & Camera Bounds — SET EARLY so physics world is ready
        let levelW = map.widthInPixels * SCALE;
        let levelH = map.heightInPixels * SCALE;
        if (levelW < 960) levelW = 960;
        if (levelH < 540) levelH = 540;

        this.levelW = levelW;
        this.levelH = levelH;

        this.physics.world.setBounds(0, 0, levelW, levelH);
        this.cameras.main.setBounds(0, 0, levelW, levelH);

        // Bounds set dynamically by map size
        this.currentFloor = -1; // keep for any future use

        // 5. Object-based Collisions
        this.collisionBoxes = this.physics.add.staticGroup();
        let collisionCount = 0;

        for (const layerName of levelConfig.collisionLayers) {
            const objLayer = map.getObjectLayer(layerName);
            if (!objLayer || !objLayer.objects) {
                console.warn(`COLLISION LAYER "${layerName}" NOT FOUND in tilemap`);
                continue;
            }

            console.log(`COLLISION LAYER "${layerName}": ${objLayer.objects.length} objects`);

            objLayer.objects.forEach(obj => {
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
                    boxH = Math.max((maxY - minY) * SCALE, 64);
                    boxX = (obj.x + minX) * SCALE;
                    boxY = (obj.y + minY) * SCALE;
                } else {
                    boxX = obj.x * SCALE;
                    boxY = obj.y * SCALE;
                    boxW = obj.width * SCALE;
                    boxH = Math.max(obj.height * SCALE, 64);
                }

                const zone = this.add.rectangle(
                    boxX + (boxW / 2), boxY + (boxH / 2),
                    boxW, boxH, 0xff0000, 0.3
                );
                this.physics.add.existing(zone, true);

                if (obj.type && obj.type.toLowerCase() === 'jumpthrough') {
                    zone.body.checkCollision.down = false;
                    zone.body.checkCollision.left = false;
                    zone.body.checkCollision.right = false;
                }

                this.collisionBoxes.add(zone);
                collisionCount++;
            });
        }
        console.log(`%c COLLISIONS: ${collisionCount} boxes in static group, group size: ${this.collisionBoxes.getLength()} `, "background: #0ff; color: #000;");

        // 6. DEATH ZONE — guarantees the player dies/respawns if they fall into a pit
        const deathZone = this.add.rectangle(levelW / 2, levelH + 50, levelW * 2, 100, 0xff0000, 0); // invisible
        this.physics.add.existing(deathZone, true);

        // 7. Player Spawn
        let playerStartX = 150;
        let playerStartY = levelH / 2;

        const spawnLayer = map.getObjectLayer('Object Layer 1')
            || map.getObjectLayer('spawns');

        if (spawnLayer && spawnLayer.objects.length > 0) {
            const startObj = spawnLayer.objects.find(o => o.name === 'start') || spawnLayer.objects[0];
            playerStartX = startObj.x * SCALE;
            playerStartY = startObj.y * SCALE;
        }

        this.initPlayer(playerStartX, playerStartY, levelW, data.char || data.charType || 'default');

        // Cinematic Dialogue Trigger
        const scriptKey = `${this.levelConfig.key}_intro`;
        if (typeof DIALOGUE !== 'undefined' && DIALOGUE[scriptKey]) {
            this.time.delayedCall(500, () => {
                const diagScene = this.scene.get('DialogueScene');
                if (diagScene) {
                    this.scene.pause();
                    this.scene.launch('DialogueScene', {
                        script: scriptKey,
                        nextScene: this.scene.scene.key,
                        sceneData: data,
                        isInternal: true
                    });
                }
            });
        }

        // Save for respawning
        this.respawnX = playerStartX;
        this.respawnY = playerStartY - 50; // spawn slightly higher so they drop in

        if (this.player) {
            this.player.setDepth(100);
            console.log(`%c PLAYER: spawned at (${playerStartX}, ${playerStartY}), body exists: ${!!this.player.body}, body enabled: ${this.player.body?.enable} `, "background: #0f0; color: #000;");

            // Death zone overlap
            this.physics.add.overlap(this.player, deathZone, () => {
                if (this.player.isDead) return;

                // Fall damage
                let hp = this.player.getData('hp') - 20;
                this.player.setData('hp', hp);
                this.events.emit('player_health_change', Math.max(0, hp), this.player.getData('maxHP') || 100);

                if (hp <= 0) {
                    this.handlePlayerDeath();
                } else {
                    // Respawn
                    this.player.setPosition(this.respawnX, this.respawnY);
                    this.player.body.setVelocity(0, 0);
                    // Hit stop/jerk effect
                    this.cameras.main.shake(150, 0.02);
                    this.player.setTint(0xff0000);
                    this.time.delayedCall(300, () => { if (this.player) this.player.clearTint(); });
                }
            });
        }

        // 8. Physics Colliders — STORED as references for cleanup
        this.floorCollider = this.physics.add.collider(this.player, this.collisionBoxes);
        console.log(`%c COLLIDER REGISTERED: player <-> collisionBoxes (${this.collisionBoxes.getLength()} bodies), active: ${this.floorCollider.active} `, "background: #f0f; color: #fff;");

        // Verify each collision body
        let enabledBodies = 0;
        this.collisionBoxes.getChildren().forEach(child => {
            if (child.body && child.body.enable) enabledBodies++;
        });
        console.log(`%c BODY CHECK: ${enabledBodies}/${this.collisionBoxes.getLength()} collision bodies enabled `, "background: #ff0; color: #000;");

        // 9. Enemy Spawning
        let spawnedEnemyCount = 0;
        const enemyLayer = spawnLayer || map.getObjectLayer('Object Layer 1');

        if (enemyLayer && enemyLayer.objects.length > 0) {
            enemyLayer.objects.forEach((obj) => {
                if (obj.name !== 'start' && obj.type !== 'boss' && obj.x * SCALE > playerStartX + 300) {
                    if (Math.random() > 0.3) {
                        const spawnY = (obj.y + (obj.height || 0)) * SCALE - 40;
                        const w = this.spawnWalker(obj.x * SCALE, spawnY);
                        if (w) { w.setDepth(100); spawnedEnemyCount++; }
                    } else {
                        const spawnY = (obj.y + (obj.height || 0) - 60) * SCALE;
                        const d = this.spawnDrone(obj.x * SCALE, spawnY);
                        if (d) { d.setDepth(100); spawnedEnemyCount++; }
                    }
                } else if (obj.type === 'boss') {
                    const spawnY = (obj.y + (obj.height || 0)) * SCALE - 40;
                    const boss = this.spawnWalker(obj.x * SCALE, spawnY);
                    if (boss) {
                        boss.isBoss = true;
                        boss.setScale(SCALE * 2);
                        boss.health = 300;
                        boss.setTint(0xff5555);
                        spawnedEnemyCount++;
                        console.log(`%c BOSS SPAWNED at (${obj.x * SCALE}, ${obj.y * SCALE}) `, "background: #f00; color: #fff;");
                    }
                }
            });
        }

        // FALLBACK: guarantee enemies if Tiled map has no enemy spawn objects
        if (spawnedEnemyCount < 3) {
            console.log(`%c ENEMY FALLBACK: only ${spawnedEnemyCount} from Tiled — spawning hardcoded wave `, "background: #f90; color: #000;");
            // Spread enemies across the level in 5 waves
            const waveCount = 5;
            const spawnFloorY = levelH - 100; // slightly above bottom

            for (let i = 0; i < waveCount; i++) {
                const xPos = playerStartX + 400 + (i * (levelW / waveCount));
                if (xPos >= levelW - 200) continue; // Don't spawn at the very edge
                if (i % 3 === 0) {
                    // Drone hovering above ground
                    const d = this.spawnDrone(xPos, spawnFloorY - 150);
                    if (d) d.setDepth(100);
                } else {
                    // Walker on the ground
                    const w = this.spawnWalker(xPos, spawnFloorY - 40);
                    if (w) w.setDepth(100);
                }
            }
        }


        this.enemyCollider = this.physics.add.collider(this.enemies, this.collisionBoxes);

        this.physics.add.overlap(this.player.hitArea, this.enemies, (h, e) => {
            this.onEnemyHit(e, 10, this.player.atkID, this.player.currentKB || 1);
        }, null, this);

        this.physics.add.overlap(this.projs, this.enemies, (p, e) => {
            this.onEnemyHit(e, 20, p.getData('atkID'), 1);
            p.destroy();
        }, null, this);

        // 10. Goal Portals & Intra-level Teleports
        const nextStageIndex = stageIndex + 1;
        const hasNext = nextStageIndex < ARCADE_LEVELS.length;

        const goalLayer = map.getObjectLayer('goal');

        if (goalLayer && goalLayer.objects && goalLayer.objects.length > 0) {
            console.log(`%c GOAL LAYER: Found ${goalLayer.objects.length} goal objects `, "background: #f0f; color: #fff;");

            goalLayer.objects.forEach(obj => {
                const boxX = (obj.x + obj.width / 2) * SCALE;
                const boxY = (obj.y + obj.height / 2) * SCALE;
                const boxW = obj.width * SCALE;
                const boxH = obj.height * SCALE;

                const zone = this.add.zone(boxX, boxY, boxW, boxH);
                this.physics.add.existing(zone, true);

                // Determine properties
                let isExit = false;
                let targetX = null;
                let targetY = null;
                let requiresBoss = false;

                if (obj.properties) {
                    obj.properties.forEach(prop => {
                        if (prop.name === 'isExit') isExit = prop.value;
                        if (prop.name === 'targetX') targetX = prop.value;
                        if (prop.name === 'targetY') targetY = prop.value;
                        if (prop.name === 'requiresBoss') requiresBoss = prop.value;
                        if (prop.name === 'dialogueKey') obj.dialogueKey = prop.value;
                    });
                }

                this.physics.add.overlap(this.player, zone, () => {
                    if (this.portalTriggered) return;

                    // Support for dialogue triggers BEFORE exit
                    if (obj.dialogueKey && !obj.triggered) {
                        obj.triggered = true;
                        if (this.scene.get('DialogueScene')) {
                            this.scene.launch('DialogueScene', {
                                dialogueKey: obj.dialogueKey,
                                nextScene: this.scene.key,
                                isInternal: true
                            });
                            this.scene.pause();
                        }
                    }

                    if (isExit) {
                        // Check if boss is defeated
                        if (requiresBoss) {
                            // Find any active boss in the enemies group
                            const bossAlive = this.enemies.getChildren().some(e => e.active && e.isBoss);
                            if (bossAlive) {
                                // Boss is still alive, block exit and show warning
                                if (!this.bossWarningTriggered) {
                                    this.bossWarningTriggered = true;
                                    const warnText = this.add.text(levelW / 2, levelH / 2, 'DEFEAT THE BOSS!', {
                                        fontSize: '48px',
                                        fill: '#ff0000',
                                        fontFamily: 'Courier',
                                        stroke: '#000000',
                                        strokeThickness: 6
                                    }).setOrigin(0.5).setScrollFactor(0).setDepth(200);

                                    this.time.delayedCall(2000, () => {
                                        warnText.destroy();
                                        this.bossWarningTriggered = false;
                                    });
                                }
                                return; // Block transition
                            }
                        }

                        this.portalTriggered = true;
                        this.cameras.main.fadeOut(1000);
                        this.time.delayedCall(1000, () => {
                            if (hasNext) {
                                const nextLevel = ARCADE_LEVELS[nextStageIndex];
                                this.scene.start('StageTitleScene', {
                                    title: nextLevel.title,
                                    nextScene: 'GenericTilemapScene',
                                    sceneData: {
                                        ...this.levelData,
                                        arcadeStageIndex: nextStageIndex
                                    }
                                });
                            } else {
                                this.scene.start('ModeSelectScene');
                            }
                        });
                    } else if (targetX !== null && targetY !== null && !this.player.isTeleporting) {
                        // Intra-level teleport
                        this.player.isTeleporting = true;

                        // Disable player physics temporarily
                        if (this.player.body) {
                            this.player.body.enable = false;
                            this.player.body.setVelocity(0, 0);
                        }

                        // Fast fade to black
                        this.cameras.main.fadeOut(250, 0, 0, 0);

                        this.time.delayedCall(300, () => {
                            // Warp player
                            this.player.setPosition(targetX * SCALE, targetY * SCALE);
                            if (this.player.body) {
                                this.player.body.enable = true;
                            }
                            // Fade back in
                            this.cameras.main.fadeIn(250, 0, 0, 0);

                            // Cooldown before they can teleport again
                            this.time.delayedCall(500, () => {
                                this.player.isTeleporting = false;
                            });
                        });
                    }
                });
            });

        } else {
            // FALLBACK: Old logic - Place portal firmly inside level boundaries at the far right
            const portalX = levelW - 100;
            const portal = this.add.zone(portalX, levelH / 2, 200, levelH * 2);
            this.physics.add.existing(portal, true); // Static body

            this.physics.add.overlap(this.player, portal, () => {
                if (this.portalTriggered) return;
                this.portalTriggered = true;

                this.cameras.main.fadeOut(1000);
                this.time.delayedCall(1000, () => {
                    if (hasNext) {
                        const nextLevel = ARCADE_LEVELS[nextStageIndex];
                        this.scene.start('StageTitleScene', {
                            title: nextLevel.title,
                            nextScene: 'GenericTilemapScene',
                            sceneData: {
                                ...this.levelData,
                                arcadeStageIndex: nextStageIndex
                            }
                        });
                    } else {
                        this.scene.start('ModeSelectScene');
                    }
                });
            });
        }

        // 11. Guide Text
        const textLayer = map.getObjectLayer('guide_text');
        if (textLayer && textLayer.objects && textLayer.objects.length > 0) {
            textLayer.objects.forEach(obj => {
                if (obj.text && obj.text.text) {
                    const txt = this.add.text(obj.x * SCALE, obj.y * SCALE, obj.text.text, {
                        fontFamily: obj.text.fontfamily || 'Courier',
                        fontSize: (obj.text.pixelsize * SCALE) + 'px',
                        color: obj.text.color || '#ffffff',
                        fontStyle: obj.text.bold ? 'bold' : 'normal',
                        stroke: '#000000',
                        strokeThickness: 4 * SCALE
                    }).setDepth(50).setOrigin(0.5);

                    // Make it flash
                    this.tweens.add({
                        targets: txt,
                        alpha: 0.2,
                        duration: 500,
                        yoyo: true,
                        repeat: -1
                    });
                }
            });
        }

        this.cameras.main.setBackgroundColor('#000000');
        this.cameras.main.fadeIn(500);

        // 12. Generic Triggers Layer
        const triggerLayer = map.getObjectLayer('triggers');
        if (triggerLayer && triggerLayer.objects) {
            triggerLayer.objects.forEach(obj => {
                const zone = this.add.zone((obj.x + obj.width / 2) * SCALE, (obj.y + obj.height / 2) * SCALE, obj.width * SCALE, obj.height * SCALE);
                this.physics.add.existing(zone, true);

                let dKey = null;
                if (obj.properties) {
                    obj.properties.forEach(p => { if (p.name === 'dialogueKey') dKey = p.value; });
                }

                this.physics.add.overlap(this.player, zone, () => {
                    if (dKey && !obj.triggered) {
                        obj.triggered = true;

                        // Special: If it's the Antarctica Cave Entrance, hot-swap BG
                        if (obj.name === 'cave_entrance') {
                            if (this.bg && this.bg.setTexture) {
                                this.bg.setTexture('bg_antarctica_cave');
                                console.log("%c BACKGROUND SWAPPED to cave ", "background: #00f; color: #fff;");
                            }
                        }

                        this.scene.launch('DialogueScene', {
                            dialogueKey: dKey,
                            nextScene: this.scene.key,
                            isInternal: true
                        });
                        this.scene.pause();
                    }
                });
            });
        }

        console.log(`%c GENERIC_TILEMAP: ${levelConfig.title} FULLY LOADED (${levelW}x${levelH}) `, "background: #0f0; color: #000; font-weight: bold;");
    }

    update(time, delta) {
        this.updateAnimatedTiles(delta);

        if (this.player && this.player.update) {
            this.player.update(this.cursors);
        }
        if (this.enemies) {
            this.enemies.getChildren().forEach(e => { if (e.update) e.update(); });
        }



        // --- SPECIFIC CAMERA ZONING FOR LAVA LAB ---
        if (this.levelConfig && this.levelConfig.key === 'tm_lava_lab' && this.player && this.player.active) {
            let py = this.player.y;
            let boundsTop = 0;
            let boundsBottom = 896;
            let targetZoom = 1;

            if (py >= 2304) { boundsTop = 2304; boundsBottom = this.levelH; }      // Floor 4
            else if (py >= 1536) { boundsTop = 1536; boundsBottom = 2304; }   // Floor 3
            else if (py >= 896) {
                boundsTop = 896;
                boundsBottom = 1536;
                targetZoom = 1.25; // Floor 2 is short, zoom in to hide slack
            }
            else { boundsTop = 0; boundsBottom = 896; }                       // Floor 1

            if (this._currentCamZone !== boundsTop) {
                this._currentCamZone = boundsTop;
                // By making the bounds exactly the size of the floor, the camera can pan
                // when jumping if the floor is > 540px tall (or zoomed), but will never bleed into another floor.
                this.cameras.main.setBounds(0, boundsTop, this.levelW, boundsBottom - boundsTop);
            }

            // Apply zoom smoothly if it changes
            if (this.cameras.main.zoom !== targetZoom) {
                this.cameras.main.zoomTo(targetZoom, 500, 'Sine.easeInOut');
            }
        }

        // DEBUG: Log player y every 2 seconds to track falling
        if (this.player && this.player.active) {
            if (!this._lastDebugLog || time - this._lastDebugLog > 2000) {
                this._lastDebugLog = time;
                const onFloor = this.player.body.onFloor();
                const touching = this.player.body.touching;
                console.log(`[DEBUG] Player y=${Math.round(this.player.y)}, vy=${Math.round(this.player.body.velocity.y)}, onFloor=${onFloor}, touching.down=${touching.down}, collider active=${this.floorCollider?.active}, collisionGroup size=${this.collisionBoxes?.getLength()}`);
            }
        }
    }

    handlePlayerDeath() {
        if (this.player.isDead) return;
        this.player.isDead = true;
        this.cameras.main.shake(500, 0.05);
        this.player.setTint(0xff0000);

        const charType = this.player.charType || 'default';
        const hurtAnim = charType + '_hurt';
        if (this.anims.exists(hurtAnim)) {
            this.player.play(hurtAnim, true);
        }

        this.player.body.setVelocity(0, -300);

        let lives = this.registry.get('playerLives') - 1;
        this.registry.set('playerLives', Math.max(0, lives));

        const ui = this.scene.get('UIScene');
        if (ui && ui.updateLivesDisplay) ui.updateLivesDisplay();

        this.time.delayedCall(1500, () => {
            if (lives > 0) {
                this.respawnPlayer();
            } else {
                this.gameOver();
            }
        });
    }

    respawnPlayer() {
        this.cameras.main.fadeOut(500);
        this.time.delayedCall(500, () => {
            this.player.isDead = false;
            this.player.clearTint();
            this.player.setPosition(this.respawnX, this.respawnY);

            const maxHP = 100;
            this.player.setData('hp', maxHP);
            this.events.emit('player_health_change', maxHP, maxHP);

            this.player.body.setVelocity(0, 0);
            this.cameras.main.fadeIn(500);
        });
    }

    gameOver() {
        this.cameras.main.fadeOut(1000, 0, 0, 0);
        this.time.delayedCall(1000, () => {
            if (this.scene.get('GameOverScene')) {
                const score = (this.registry.get('gameState') || {}).score || 0;
                this.scene.start('GameOverScene', { score });
            } else {
                this.scene.start('ModeSelectScene');
            }
        });
    }
}
