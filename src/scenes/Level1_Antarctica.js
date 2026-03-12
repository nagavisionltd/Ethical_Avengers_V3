class Level1_Antarctica extends BaseScene {
    constructor() {
        super('Level1_Antarctica');
    }

    create(data) {
        this.charKey = data.char || 'default'; // Store for goal transition
        this.isRestarting = false; // Guard against infinite restart loop

        this.cameras.main.setBackgroundColor('#000000');
        this.cameras.main.fadeIn(500);

        // 1. Load the Tiled map
        const map = this.make.tilemap({ key: 'tm_antarctica' });
        const SCALE = 2; // Standard scaling for 16-bit tilesets
        const levelW = Math.max(960, map.widthInPixels * SCALE);
        const levelH = Math.max(540, map.heightInPixels * SCALE);

        this.physics.world.setBounds(0, 0, levelW, levelH);
        this.cameras.main.setBounds(0, 0, levelW, levelH);

        // 2. Fixed Background Layer
        this.bg = this.add.image(0, 0, 'bg_antarctica').setOrigin(0, 0).setDepth(0).setScrollFactor(0);
        this.bg.setScale(Math.max(960 / this.bg.width, 540 / this.bg.height));

        // 3. Render Ground Tile Layer
        const tiles = map.addTilesetImage('antarctica_tiles', 'antarctica_tiles');
        if (tiles) {
            const groundLayer = map.createLayer('ground', tiles, 0, 0);
            if (groundLayer) groundLayer.setScale(SCALE).setDepth(10);
        } else {
            console.warn("Failed to load tileset 'antarctica_tiles' for map 'tm_antarctica'");
        }

        // 4. Object-based Collisions Layer
        this.collisionBoxes = this.physics.add.staticGroup();
        const collisionLayer = map.getObjectLayer('collisions');
        if (collisionLayer && collisionLayer.objects) {
            collisionLayer.objects.forEach(obj => {
                let boxX = obj.x * SCALE;
                let boxY = obj.y * SCALE;
                let boxW = obj.width * SCALE;
                let boxH = Math.max(obj.height * SCALE, 64);

                if (obj.polygon) {
                    let minX = 0, minY = 0, maxX = 0, maxY = 0;
                    obj.polygon.forEach(p => {
                        if (p.x < minX) minX = p.x; if (p.x > maxX) maxX = p.x;
                        if (p.y < minY) minY = p.y; if (p.y > maxY) maxY = p.y;
                    });
                    boxW = (maxX - minX) * SCALE;
                    boxH = Math.max((maxY - minY) * SCALE, 64);
                    boxX = (obj.x + minX) * SCALE;
                    boxY = (obj.y + minY) * SCALE;
                }

                const zone = this.add.rectangle(boxX + (boxW / 2), boxY + (boxH / 2), boxW, boxH, 0xff0000, 0);
                this.physics.add.existing(zone, true);

                if (obj.type && obj.type.toLowerCase() === 'jumpthrough') {
                    zone.body.checkCollision.down = false;
                    zone.body.checkCollision.left = false;
                    zone.body.checkCollision.right = false;
                }
                this.collisionBoxes.add(zone);
            });
        }

        // 5. Spawn Locations
        const spawnLayer = map.getObjectLayer('spawns');
        let playerStartX = 150;
        let playerStartY = levelH / 2;

        if (spawnLayer && spawnLayer.objects) {
            const startObj = spawnLayer.objects.find(o => o.name === 'start');
            if (startObj) {
                playerStartX = startObj.x * SCALE;
                playerStartY = startObj.y * SCALE;
            }
        }
        this.respawnX = playerStartX;
        this.respawnY = playerStartY - 50;

        // 6. Init Player
        this.initPlayer(playerStartX, playerStartY, levelW, this.charKey);
        if (this.player) {
            this.player.setDepth(100);
            this.physics.add.collider(this.player, this.collisionBoxes);
        }

        // 7. Death Zone (Bottom of the map) - Prevents Infinite Loops with isRestarting flag
        const deathZone = this.add.rectangle(levelW / 2, levelH + 50, levelW * 2, 100, 0x0000ff, 0.3);
        this.physics.add.existing(deathZone, true);
        this.physics.add.overlap(this.player, deathZone, () => {
            if (this.isRestarting) return;
            if (this.player && this.player.active && !this.player.isDead) {
                this.isRestarting = true;
                this.cameras.main.shake(150, 0.02);
                this.player.setTint(0xff0000);
                this.cameras.main.fadeOut(300, 0, 0, 0, (cam, progress) => {
                    if (progress === 1) this.scene.restart({ char: this.charKey });
                });
            }
        });

        // 8. Triggers (Dialogue, Background Swaps, and Exits)
        const triggerLayer = map.getObjectLayer('triggers');
        if (triggerLayer && triggerLayer.objects) {
            triggerLayer.objects.forEach(obj => {
                const zone = this.add.zone((obj.x + obj.width / 2) * SCALE, (obj.y + obj.height / 2) * SCALE, obj.width * SCALE, obj.height * SCALE);
                this.physics.add.existing(zone, true);

                let isExit = false;
                let dKey = null;
                if (obj.properties) {
                    obj.properties.forEach(p => {
                        if (p.name === 'isExit') isExit = p.value;
                        if (p.name === 'dialogueKey') dKey = p.value;
                    });
                }

                this.physics.add.overlap(this.player, zone, () => {
                    // Trigger dialogues or background swaps exactly once
                    if (dKey && !obj.triggered) {
                        obj.triggered = true;

                        // Scene-specific visual swaps
                        if (obj.name === 'cave_entrance') {
                            this.bg.setTexture('bg_antarctica_cave');
                        }

                        // Launch Dialogue
                        this.sound.stopAll();
                        this.scene.pause();
                        this.scene.launch('DialogueScene', {
                            script: dKey,
                            nextScene: this.scene.key,
                            sceneData: data,
                            isInternal: true
                        });
                    }

                    // Level Exit 
                    if (isExit && !this.isRestarting) {
                        this.isRestarting = true;
                        this.sound.stopAll();
                        this.cameras.main.fadeOut(1000);
                        this.time.delayedCall(1000, () => {
                            this.scene.start('DialogueScene', {
                                script: 'level1_part2_intro',
                                nextScene: 'Level1_Hoverboard',
                                sceneData: { char: this.charKey }
                            });
                        });
                    }
                });
            });
        }

        // 9. Enemies
        if (spawnLayer && spawnLayer.objects) {
            spawnLayer.objects.forEach(obj => {
                if (obj.type === 'enemy') {
                    let eType = 'walker';
                    if (obj.properties) {
                        obj.properties.forEach(p => { if (p.name === 'enemyType') eType = p.value; });
                    }
                    if (eType === 'drone') {
                        const d = this.spawnDrone(obj.x * SCALE, (obj.y - 60) * SCALE);
                        if (d) d.setDepth(100);
                    } else {
                        const w = this.spawnWalker(obj.x * SCALE, (obj.y) * SCALE - 40);
                        if (w) w.setDepth(100);
                    }
                }
            });
            if (this.enemies) {
                this.physics.add.collider(this.enemies, this.collisionBoxes);
                this.physics.add.overlap(this.player.hitArea, this.enemies, (h, e) => {
                    this.onEnemyHit(e, 10, this.player.atkID, this.player.currentKB || 1);
                }, null, this);
                this.physics.add.overlap(this.projs, this.enemies, (p, e) => {
                    this.onEnemyHit(e, 20, p.getData('atkID'), 1);
                    p.destroy();
                }, null, this);
            }
        }

        // Launch UI
        this.scene.launch('UIScene', { char: this.charKey });
    }

    update() {
        if (this.player && this.player.active) {
            this.player.update(this.cursors);
        }
        if (this.enemies) {
            this.enemies.getChildren().forEach(e => { if (e.update) e.update(); });
        }
    }
}
