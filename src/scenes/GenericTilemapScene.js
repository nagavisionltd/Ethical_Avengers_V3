// ======================================================================
// GenericTilemapScene.js — Data-driven arcade level scene
// Loads any tilemap from ARCADE_LEVELS config, handles collisions,
// spawns player & enemies, and portals to the next level.
// ======================================================================

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

        console.log(`[SCENE CREATE] arcadeStageIndex: ${data.arcadeStageIndex}, char: ${data.char}`);
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

        // 5. Collisions (Object-based or Tile-based)
        this.collisionBoxes = this.physics.add.staticGroup();
        this.tileColliders = [];
        let collisionCount = 0;

        for (const layerName of levelConfig.collisionLayers) {
            const objLayer = map.getObjectLayer(layerName);
            
            if (objLayer && objLayer.objects) {
                console.log(`COLLISION LAYER "${layerName}" (Object): ${objLayer.objects.length} objects`);
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
                        boxW = Math.round((maxX - minX) * SCALE);
                        boxH = Math.round((maxY - minY) * SCALE);
                        boxX = Math.round((obj.x + minX) * SCALE);
                        boxY = Math.round((obj.y + minY) * SCALE);
                    } else {
                        boxX = Math.round(obj.x * SCALE);
                        boxY = Math.round(obj.y * SCALE);
                        boxW = Math.round(obj.width * SCALE);
                        boxH = Math.round(obj.height * SCALE);
                    }

                    const zone = this.add.rectangle(
                        boxX + (boxW / 2), boxY + (boxH / 2),
                        boxW, boxH, 0xff0000, 0.3
                    ).setDepth(1000);
                    this.physics.add.existing(zone, true);
                    if (zone.body) {
                        zone.body.setSize(boxW, boxH);
                    }

                    if (obj.type && obj.type.toLowerCase() === 'jumpthrough') {
                        zone.body.checkCollision.down = false;
                        zone.body.checkCollision.left = false;
                        zone.body.checkCollision.right = false;
                    }

                    this.collisionBoxes.add(zone);
                    collisionCount++;
                });
            } else {
                // Check if it's a tile layer instead
                const tileLayerData = map.getLayer(layerName);
                if (tileLayerData && tileLayerData.tilemapLayer) {
                    console.log(`COLLISION LAYER "${layerName}" (TileLayer): Enabling collision by exclusion`);
                    tileLayerData.tilemapLayer.setCollisionByExclusion([-1]);
                    this.tileColliders.push(tileLayerData.tilemapLayer);
                } else {
                    console.warn(`COLLISION LAYER "${layerName}" NOT FOUND as object or tile layer in tilemap`);
                }
            }
        }
        console.log(`%c COLLISIONS: ${collisionCount} boxes in static group, ${this.tileColliders.length} tile layers `, "background: #0ff; color: #000;");

        // 6. DEATH ZONE — guarantees the player dies/respawns if they fall into a pit
        const deathZone = this.add.rectangle(levelW / 2, levelH + 50, levelW * 2, 100, 0xff0000, 0); // invisible
        this.physics.add.existing(deathZone, true);

        // 7. Player Spawn
        let playerStartX = 150;
        let playerStartY = levelH / 2;

        if (this.levelData && this.levelData.customSpawnX !== undefined) {
             playerStartX = this.levelData.customSpawnX;
             playerStartY = this.levelData.customSpawnY;
             
             // Apply leaping velocity out of hole
             this.time.delayedCall(100, () => {
                 if (this.player && this.player.body) {
                     if (this.levelData.customVelocityY) this.player.body.setVelocityY(this.levelData.customVelocityY);
                     // Player update loop zeroes out X velocity if no key is pressed, preventing the leap.
                     // Apply a physical X translation directly instead of velocity.
                     if (this.levelData.customVelocityX) {
                         this.tweens.add({
                             targets: this.player,
                             x: this.player.x + (this.levelData.customVelocityX * 1.5),
                             duration: 800,
                             ease: 'Power1'
                         });
                     }
                     console.log(`%c [SPAWN] Leaping Out Velocity Applied: (${this.levelData.customVelocityX}, ${this.levelData.customVelocityY}) `, "background: #0f0; color: #000;");
                 }
             });

             // CRITICAL: Delete custom spawn data so it doesn't persist to the NEXT level load
             delete this.levelData.customSpawnX;
             delete this.levelData.customSpawnY;
             delete this.levelData.customVelocityX;
             delete this.levelData.customVelocityY;
        } else if (this.levelConfig && this.levelConfig.key === 'v6_level_neelo_megaman') {
            playerStartX = 250;
            playerStartY = 100;
        }

        const spawnLayer = map.getObjectLayer('Object Layer 1')
            || map.getObjectLayer('spawns');

        if (spawnLayer && spawnLayer.objects.length > 0) {
            const startObj = spawnLayer.objects.find(o => o.name === 'start') || spawnLayer.objects[0];
            playerStartX = startObj.x * SCALE;
            playerStartY = startObj.y * SCALE - 100; // Force an air-drop rather than clipping inside floor
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
        
        // --- UNDERWATER PHYSICS FOR BASEMENT ---
        if (this.levelConfig && this.levelConfig.key === 'v6_level_train_station_basement') {
            this.physics.world.gravity.y = 150; // Slow fall
            console.log(`%c UNDERWATER PHYSICS: Gravity reduced to 150 `, "background: #00f; color: #fff;");
        }

        // 8. Physics Colliders — STORED as references for cleanup
        this.floorCollider = this.physics.add.collider(this.player, this.collisionBoxes);
        this.tileColliders.forEach(layer => {
            this.physics.add.collider(this.player, layer);
        });
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
                     const isAir = Math.random() > 0.5;
                     // Ensure large bodies drop from above the platform rather than clipping floor
                     const spawnY = (obj.y + (obj.height || 0)) * SCALE - (isAir ? 180 : 150);
                    this.spawnEnemy(obj.x * SCALE, spawnY, isAir);
                     spawnedEnemyCount++;
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
                if (xPos >= levelW - 200) continue; 
                const isAir = i % 3 === 0;
                this.spawnEnemy(xPos, spawnFloorY - (isAir ? 180 : 150), isAir);
                spawnedEnemyCount++;
            }
        }

        // --- WAVE LOCK MANAGER INITIALIZATION ---
        this.waveLocks = [];
        if (this.levelConfig && this.levelConfig.key === 'v6_level_train_station') {
             this.waveLocks = [
                 { x: 1800, count: 4, triggered: false, cleared: false },
                 { x: 4500, count: 5, triggered: false, cleared: false }
             ];
             console.log(`%c [WAVE] Initialized 2 lockpoints for Train Station `, "background: #f0f; color: #fff;");
        }
        
        this.enemyCollider = this.physics.add.collider(this.enemies, this.collisionBoxes);
        this.tileColliders.forEach(layer => {
            this.physics.add.collider(this.enemies, layer);
        });

        this.physics.add.overlap(this.player.hitArea, this.enemies, (h, e) => {
            console.log(`[HIT] Player hit Area overlapped with enemy. AtkID: ${this.player.atkID}`);
            this.onEnemyHit(e, this.player.currentDmg || 10, this.player.atkID, this.player.currentKB || 1);
        }, null, this);

        this.physics.add.overlap(this.projs, this.enemies, (p, e) => {
            this.onEnemyHit(e, 20, p.getData('atkID'), 1);
            p.destroy();
        }, null, this);

        // 10. Goal Portals & Intra-level Teleports
        const nextStageIndex = stageIndex + 1;
        const hasNext = nextStageIndex < ARCADE_LEVELS.length;
        let foundAnyGoal = false;

        ['goal', 'goal_1', 'goal_2', 'back_to_station'].forEach(layerName => {
            const goalLayer = map.getObjectLayer(layerName);

            if (goalLayer && goalLayer.objects && goalLayer.objects.length > 0) {
                foundAnyGoal = true;
                console.log(`%c GOAL LAYER: Found ${goalLayer.objects.length} goal objects in ${layerName} `, "background: #f0f; color: #fff;");

                goalLayer.objects.forEach(obj => {
                    const boxX = (obj.x + obj.width / 2) * SCALE;
                    const boxY = (obj.y + obj.height / 2) * SCALE;
                    const boxW = obj.width * SCALE;
                    const boxH = obj.height * SCALE;

                    const zone = this.add.zone(boxX, boxY, boxW, boxH);
                    this.physics.add.existing(zone, true);

                    // Determine properties
                    let isExit = true; // Default to true for goal layer objects
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
                                const bossAlive = this.enemies.getChildren().some(e => e.active && e.isBoss);
                                if (bossAlive) {
                                    if (!this.bossWarningTriggered) {
                                        this.bossWarningTriggered = true;
                                        const levelW = this.cameras.main.width;
                                        const levelH = this.cameras.main.height;
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
                                let targetIndex = stageIndex + 1; // Default
                                if (layerName === 'goal_2') {
                                    targetIndex = stageIndex + 2; // Skip branch
                                } else if (layerName === 'back_to_station') {
                                    // Hardcoded explicit index hunt since StageIndex can sometimes be 0 due to debug warps
                                    targetIndex = ARCADE_LEVELS.findIndex(l => l.key === 'v6_level_train_station');
                                    if (targetIndex === -1) targetIndex = stageIndex - 1; 

                                        // Spawning too far right still risks clipping into the hole (at 3840).
                                        // We spawn at the far left (1000) to ensure the player is safely away.
                                        if (this.levelData) {
                                            this.levelData.customSpawnX = 1000; // Safe left side
                                            this.levelData.customSpawnY = 640;  // Floor level
                                            this.levelData.customVelocityY = -200; // Visual jump indicator
                                        this.levelData.customVelocityX = 0;
                                    }
                                }

                                const canProceed = targetIndex < ARCADE_LEVELS.length;
                                if (canProceed) {
                                    const nextLevel = ARCADE_LEVELS[targetIndex];
                                    this.scene.start('StageTitleScene', {
                                        title: nextLevel.title,
                                        nextScene: 'GenericTilemapScene',
                                        sceneData: {
                                            ...this.levelData,
                                            arcadeStageIndex: targetIndex
                                        }
                                    });
                                } else {
                                    this.scene.start('ModeSelectScene');
                                }
                            });
                        } else if (targetX !== null && targetY !== null && !this.player.isTeleporting) {
                            // Intra-level teleport
                            this.player.isTeleporting = true;

                            if (this.player.body) {
                                this.player.body.enable = false;
                                this.player.body.setVelocity(0, 0);
                            }

                            this.cameras.main.fadeOut(250, 0, 0, 0);

                            this.time.delayedCall(300, () => {
                                this.player.setPosition(targetX * SCALE, targetY * SCALE);
                                if (this.player.body) {
                                    this.player.body.enable = true;
                                }
                                this.cameras.main.fadeIn(250, 0, 0, 0);

                                this.time.delayedCall(500, () => {
                                    this.player.isTeleporting = false;
                                });
                            });
                        }
                    });
                });
            }
        });

        // End of goal processing


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

        // 13. NPCs Layer
        this.npcs = this.physics.add.group();
        const npcLayer = map.getObjectLayer('npcs');
        
        let npcSpawned = false;

        if (npcLayer && npcLayer.objects) {
            npcLayer.objects.forEach(obj => {
                this.spawnNPC(obj.x * SCALE, obj.y * SCALE, obj.properties, SCALE);
                npcSpawned = true;
            });
        }

        // Add collision for NPCs
        this.physics.add.collider(this.npcs, this.collisionBoxes);
        this.tileColliders.forEach(layer => {
            this.physics.add.collider(this.npcs, layer);
        });

        // Setup interaction zone
        this.physics.add.overlap(this.player, this.npcs, (player, npc) => {
            if (!npc.getData('isInteracting')) {
                // Show interaction prompt
                if (!npc.getData('promptText')) {
                    const prompt = this.add.text(npc.x, npc.y - 60, '[UP] TALK', {
                        fontFamily: '"Press Start 2P"',
                        fontSize: '10px',
                        color: '#00ffaa',
                        stroke: '#000',
                        strokeThickness: 3
                    }).setOrigin(0.5).setDepth(200);
                    
                    this.tweens.add({
                        targets: prompt,
                        y: npc.y - 70,
                        duration: 500,
                        yoyo: true,
                        repeat: -1
                    });
                    npc.setData('promptText', prompt);
                } else {
                    npc.getData('promptText').setVisible(true);
                }

                // Check for interaction input (UP arrow or interaction key)
                let upPressed = false;
                if (this.cursors && this.cursors.up) {
                    upPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up);
                } else if (this.input.keyboard) {
                    const upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
                    upPressed = Phaser.Input.Keyboard.JustDown(upKey);
                }
                upPressed = upPressed || (this.player.mobileInput && this.player.mobileInput.up && !this.player.lastUpState);
                
                if (upPressed && this.player.body.onFloor()) {
                    npc.setData('isInteracting', true);
                    npc.getData('promptText').setVisible(false);
                    
                    // Face the player
                    npc.setFlipX(player.x > npc.x);
                    player.setVelocityX(0); // Stop player

                    const dKey = npc.getData('dialogueKey');
                    
                    if (dKey && typeof DIALOGUE !== 'undefined' && DIALOGUE[dKey]) {
                        this.scene.pause();
                        this.scene.launch('DialogueScene', {
                            script: dKey, // Changed from dialogueKey to script
                            nextScene: this.scene.key,
                            isInternal: true
                        });
                        
                        // Reset interaction flag after a delay so they can talk again
                        this.time.delayedCall(1000, () => {
                            if (npc.active) npc.setData('isInteracting', false);
                        });
                    } else {
                        console.warn(`[NPC] Dialogue key ${dKey} not found!`);
                        npc.setData('isInteracting', false);
                    }
                }
            }
        });

        // Launch UI
        this.scene.launch('UIScene', { char: this.player ? this.player.prefix : 'cherry' });
        this.scene.bringToTop('UIScene');

        // --- LEVEL SKIP KEYS ---
        if (this.input && this.input.keyboard) {
            this.input.keyboard.on('keydown', (event) => {
                const num = parseInt(event.key);
                if (!isNaN(num) && num >= 1 && num <= ARCADE_LEVELS.length) {
                    const nextStageIndex = num - 1;
                    const nextLevel = ARCADE_LEVELS[nextStageIndex];
                    if (nextLevel) {
                        console.log(`[SKIP KEY] Starting Level: ${nextLevel.title}`);
                        this.cameras.main.fadeOut(500);
                        this.time.delayedCall(500, () => {
                            // Create a clean data object for shortcuts (prevent persistent spawns)
                            const cleanData = { ...this.levelData };
                            delete cleanData.customSpawnX;
                            delete cleanData.customSpawnY;
                            delete cleanData.customVelocityX;
                            delete cleanData.customVelocityY;

                            this.scene.start('StageTitleScene', {
                                title: nextLevel.title,
                                nextScene: 'GenericTilemapScene',
                                sceneData: {
                                    ...cleanData,
                                    arcadeStageIndex: nextStageIndex
                                }
                            });
                        });
                    }
                }
            });
        }

        // 14. Level Specific Mechanics (Train Spawner, Water Physics, Aquatic Life)
        this.setupLevelSpecifics(levelConfig.key, map, SCALE);

        console.log(`%c GENERIC_TILEMAP: ${levelConfig.title} FULLY LOADED (${levelW}x${levelH}) `, "background: #0f0; color: #000; font-weight: bold;");
    }

    spawnNPC(x, y, properties, scale) {
        let dKey = 'default_npc';
        let npcType = 'survivor'; // default visual

        if (properties) {
            properties.forEach(p => {
                if (p.name === 'dialogueKey') dKey = p.value;
                if (p.name === 'npcType') npcType = p.value;
            });
        }

        // Using an existing sprite for the NPC as placeholder.
        // We will use 'ignite_idle_01' or 'cs_idle' tinted if we don't have dedicated NPC sprites yet.
        let tex = 'ignite_idle_01'; 
        if (!this.textures.exists(tex)) tex = 'white_pixel'; // Ultra safe fallback

        const npc = this.npcs.create(x, y, tex).setOrigin(0.5, 1).setScale(0.35);
        npc.setDepth(100);
        
        // Make them look slightly different from characters
        if (tex !== 'white_pixel') {
             npc.setTint(0x88ccff); // Give them a blueish tint
        } else {
             npc.setDisplaySize(32, 64).setTint(0x88ccff);
        }

        // Set physics
        npc.body.setSize(40, 85);
        npc.body.setOffset((npc.width/2) - 20, npc.height - 85);
        npc.setCollideWorldBounds(true);
        npc.setGravityY(2000); // Standard gravity
        npc.setImmovable(true); // Don't get pushed around by player

        // Store data
        npc.setData('dialogueKey', dKey);
        npc.setData('npcType', npcType);
        npc.setData('isInteracting', false);
        
        // Idle bobbing
        this.tweens.add({
            targets: npc,
            y: y + 2,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Function to hide prompt when player walks away
        npc.update = () => {
            if (!this.player || !this.player.active) return;
            const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, npc.x, npc.y);
            const prompt = npc.getData('promptText');
            if (prompt && dist > 100) {
                prompt.setVisible(false);
            }
        };

        return npc;
    }

    // ======================================================================
    // 14. Level Specific Mechanics Setup
    // ======================================================================
    setupLevelSpecifics(key, map, scale) {
        console.log(`[LEVEL MECHANICS] Checking setup for: ${key}`);

        // --- A. UNDERWATER BASEMENT WATER PHYSICS ---
        if (key.includes('basement') || key.includes('underground') || key.includes('aquatic')) {
            console.log("%c [WATER PHYSICS] Reducing gravity and adding drag ", "background: #00f; color: #fff;");
            
            if (this.physics && this.physics.world) {
                this.physics.world.gravity.y = 600; // floaty water gravity
            }

            if (this.player && this.player.body) {
                this.player.body.setDrag(150, 150); // Water resistance
                
                // Add bubble effects timer if you have particles
                this.time.addEvent({
                    delay: 800,
                    callback: () => {
                        if (this.player && this.player.active) {
                            // spawn temporary particle or bubble text
                        }
                    },
                    loop: true
                });
            }
        }

        // --- B. TRAIN STATION SPED TIMER ---
        if (key === 'v6_level_train_station' || key.includes('train_station')) {
            console.log("%c [TRAIN MECHANIC] Enabling passing Train looping timer ", "background: #f09; color: #fff;");
            
            this.time.addEvent({
                delay: 25000, // Trigger every 25 seconds
                callback: () => {
                    if (!this.cameras.main) return;
                    console.log("[TRAIN] Spawning passing train!");
                    
                    // Spawn behind railing but above background:
                    const trainY = 192 * scale; // Adjust if track height differs in Tiled
                    const train = this.add.sprite(-300, trainY, 'hover_train').setOrigin(0, 0.5).setDepth(45);
                    this.physics.add.existing(train);
                    
                    if (train.body) {
                        train.body.setAllowGravity(false);
                        train.body.setVelocityX(600); // Zoom by left to right
                    }

                    // Delete once it leaves screenspace
                    this.time.delayedCall(8000, () => { if (train) train.destroy(); });
                },
                loop: true
            });
        }

        // --- C. AQUATIC LIFE (REMOVED as requested) ---

        // --- D. CRYSTAL SHARD COLLECT (Basement) ---
        const shardLayer = map.getObjectLayer('crystal_shard');
        if (shardLayer && shardLayer.objects) {
            console.log(`%c [CRYSTAL SHARD] Spawning collectors `, "background: #0ff; color: #000;");
            shardLayer.objects.forEach(obj => {
                const spawnX = (obj.x + obj.width / 2) * scale;
                const spawnY = (obj.y + obj.height / 2) * scale;

                const shard = this.add.sprite(spawnX, spawnY, 'crystal_shard').setDepth(90).setScale(1.2);
                this.physics.add.existing(shard, true); // Static overlap

                this.tweens.add({
                    targets: shard,
                    y: spawnY - 10,
                    duration: 1000,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });

                if (this.player && this.player.hitArea) {
                     this.physics.add.overlap(this.player.hitArea, shard, () => {
                         console.log("[PLAYER] Shard Collected!");
                         shard.destroy();

                         // Show collect notification / effects
                         const text = this.add.text(spawnX, spawnY - 30, 'CRYSTAL COLLECTED!', { fontSize: '14px', fill: '#0ff', stroke: '#000', strokeThickness: 2 });
                         this.tweens.add({ targets: text, y: spawnY - 60, alpha: 0, duration: 1500, onComplete: () => text.destroy() });

                         const score = (this.registry.get('score') || 0) + 100;
                         this.registry.set('score', score);

                     });
                }
            });
        }

        // --- E. HOLE TRANSITION FALLBACK (Train Station to Basement) ---
        if (key === 'v6_level_train_station' && this.player && this.player.hitArea) {
            const portalX = (map.widthInPixels / 2) * scale; 
            const portalY = (map.heightInPixels - 10) * scale;
            
            // Narrow the hole trigger drastically to prevent accidental re-triggers on return
            // Height is reduced to 40 so you really have to be at the bottom edge.
            const holePortal = this.add.zone(portalX, portalY, 100, 40);
            this.physics.add.existing(holePortal, true);

            this.physics.add.overlap(this.player, holePortal, () => {
                 if (this.portalTriggered) return;
                 this.portalTriggered = true;

                  console.log("[TELEPORT] Falling down into Basement!");
                  if (this.player && this.player.body) {
                      this.player.body.enable = false; // Freeze position instantly
                  }
                  if (this.cameras.main) this.cameras.main.fadeOut(200);

                  this.time.delayedCall(200, () => {
                      // Start basement index Stage 3 Part 2
                      const nextLevelIndex = this.levelData ? (this.levelData.arcadeStageIndex + 1) : 7; // placeholder increment

                      this.scene.start('GenericTilemapScene', {
                          ...this.levelData,
                          arcadeStageIndex: nextLevelIndex
                      });
                  });
            });
        }

        // --- INITIAL BGM SETUP ---
        this.sound.stopAll();
        if (this.levelConfig && this.levelConfig.key === 'v6_level_train_station') {
             this.sound.play('train_bgm', { loop: true, volume: 0.5 });
        } else if (this.levelConfig && this.levelConfig.key === 'v6_level_train_station_basement') {
             this.sound.play('m2', { loop: true, volume: 0.5 }); // Static fallback
        } else if (this.levelConfig && this.levelConfig.key === 'v6_level_neelo_megaman') {
             this.sound.play('music_khemra', { loop: true, volume: 0.5 });
        } else if (this.levelConfig && (this.levelConfig.key.includes('antartica') || this.levelConfig.key.includes('antarctica') || this.levelConfig.key.includes('tm_level1'))) {
             this.sound.play('m1', { loop: true, volume: 0.5 });
        }
    }

    spawnEnemy(x, y, isAir = false) {
        // Correct spawn Y: subtract a small offset to ensure they land ON the floor, not in it
        const spawnY = isAir ? y : y - 20; 

        console.log(`[SPAWN] ${isAir ? 'Drone' : 'Walker'} at (${x}, ${spawnY})`);
        
        // Use the real Enemy class!
        const e = new Enemy(this, x, spawnY, isAir ? 'drone' : 'walker');
        e.setDepth(100);
        
        // Map consistency data (HP/Speed)
        const isGiant = Phaser.Math.Between(0, 1) === 1;
        if (isGiant && !isAir) {
            e.setScale(e.scale * 1.5);
            e.setData('hp', 100);
            e.setData('maxHP', 100);
            e.setData('speed', 80);
        } else {
            e.setData('speed', isAir ? 120 : 130);
        }

        // Add to groups and set world bounds
        if (this.enemies) this.enemies.add(e);
        e.body.setCollideWorldBounds(true);

        // --- PHYSICS COLLISIONS (CRITICAL FOR TRAIN LEVEL) ---
        // 1. Static Platforms (from TMJ)
        if (this.platforms) this.physics.add.collider(e, this.platforms);
        
        // 2. Custom Collision Boxes (Invisible shapes)
        if (this.collisionBoxes) this.physics.add.collider(e, this.collisionBoxes);
        
        // 3. Tilemap Layers (if any specific ones are set as tileColliders)
        if (this.tileColliders) {
            this.tileColliders.forEach(layer => this.physics.add.collider(e, layer));
        }

        return e;
    }

    update(time, delta) {
        this.updateAnimatedTiles(delta);

        if (this.player && this.player.update) {
            this.player.update(this.cursors);
        }
        if (this.enemies) {
            this.enemies.getChildren().forEach(e => { 
                if (e.update) e.update(); 
                if (e.customUpdate) e.customUpdate(); 
                
                // --- ENEMY DEATH ZONE CHECK ---
                // If enemy falls below level, destroy it so it doesn't block wave locks
                if (e.active && e.y > this.levelH + 200) {
                    console.log(`[CLEANUP] Enemy at ${Math.round(e.x)}, ${Math.round(e.y)} fell out of world. Destroying.`);
                    if (this.onEnemyDeath) this.onEnemyDeath(e);
                    e.destroy();
                }
            });
        }

        // --- WAVE LOCK MANAGER UPDATE ---
        if (this.waveLocks && this.waveLocks.length > 0) {
            this.waveLocks.forEach(lock => {
                if (!lock.triggered && this.player && !this.player.isDead && this.player.x > lock.x && this.player.x < lock.x + 200) {
                    lock.triggered = true;
                    console.log(`%c [WAVE] Lock triggered at X=${lock.x} `, "background: #f00; color: #fff;");
                    
                    // Lock bounds surrounding the threshold
                    const boundsX = lock.x - 400;
                    const levelH = this.levelH || 540;
                    this.physics.world.setBounds(boundsX, 0, 800, levelH);
                    this.cameras.main.setBounds(boundsX, 0, 800, levelH);
                    
                    lock.enemies = [];
                    for (let i = 0; i < lock.count; i++) {
                        let isAir = i % 2 === 0;
                        let spawnY = this.player.y - (isAir ? 150 : 100); // Higher spawn to avoid tunneling
                        let rx = lock.x + 300 + (i * 30);
                        let e = this.spawnEnemy(rx, spawnY, isAir);
                        lock.enemies.push(e);
                    }

                    this.sound.stopAll();
                    this.sound.play('boss_bgm', { loop: true, volume: 0.6 });
                }
                
                if (lock.triggered && !lock.cleared) {
                     // Check if any enemies are still alive
                     const alive = lock.enemies.length > 0 && lock.enemies.some(e => e && e.active && e.scene);
                     
                     if (!alive && lock.enemies.length > 0) {
                         lock.cleared = true;
                         console.log(`%c [WAVE] Lock cleared at X:${lock.x} `, "background: #0f0; color: #000; font-weight: bold;");
                         
                         if (this.player) {
                             this.player.setTint(0x00ff00);
                             this.time.delayedCall(500, () => { if (this.player) this.player.clearTint(); });
                         }

                         // Release camera
                         this.physics.world.setBounds(0, 0, this.levelW, this.levelH);
                         this.cameras.main.setBounds(0, 0, this.levelW, this.levelH);
                         
                         // Restore music if level 3
                         if (this.levelConfig && this.levelConfig.key === 'v6_level_train_station') {
                              this.sound.stopAll();
                              this.sound.play('train_bgm', { loop: true, volume: 0.5 });
                         }
                     }
                }
            });
        }
        if (this.npcs) {
            this.npcs.getChildren().forEach(n => { if (n.update) n.update(); });
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

        // RESET WAVE LOCKS ON DEATH
        if (this.waveLocks) {
            this.waveLocks.forEach(lock => {
                lock.triggered = false;
                lock.cleared = false;
                if (lock.enemies) {
                    lock.enemies.forEach(e => { if (e && e.active) e.destroy(); });
                    lock.enemies = [];
                }
            });
            // Reset bounds
            this.physics.world.setBounds(0, 0, this.levelW, this.levelH);
            this.cameras.main.setBounds(0, 0, this.levelW, this.levelH);
            console.log("[PLAYER DEATH] Wave locks and bounds reset");
        }

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
