class Level1_Antarctica extends BaseScene {
    constructor() {
        super('Level1_Antarctica');
    }

    create(data) {
        this.sound.stopAll();
        this.sound.play('m1', { loop: true, volume: 0.5 });
        this.charKey = data.char || 'default'; 
        this.isRestarting = false; 
        this.isWinning = false;

        this.cameras.main.setBackgroundColor('#000000');
        this.cameras.main.fadeIn(500);

        const map = this.make.tilemap({ key: 'tm_antarctica' });
        const SCALE = 2; 
        // Guarantee huge horizontal scrolling space even if map parsing fails
        const levelW = Math.max(7680, (map.widthInPixels || 0) * SCALE);
        const levelH = Math.max(1080, (map.heightInPixels || 0) * SCALE);

        this.physics.world.setBounds(0, 0, levelW, levelH);
        // Remove height bound to allow vertical scrolling even if map is short
        this.cameras.main.setBounds(0, -2000, levelW, levelH + 4000); 

        this.bg = this.add.image(0, 0, 'bg_antarctica').setOrigin(0, 0).setDepth(0).setScrollFactor(0);
        this.bg.setScale(Math.max(960 / this.bg.width, 540 / this.bg.height));

        const tiles = map.addTilesetImage('antarctica_tiles', 'antarctica_tiles');
        if (tiles) {
            this.groundLayer = map.createLayer('ground', tiles, 0, 0);
            if (this.groundLayer) {
                this.groundLayer.setScale(SCALE).setDepth(10);

            }
        }

        // Helper: case-insensitive object layer lookup
        const findObjectLayer = (name) => {
            const lower = name.toLowerCase();
            return map.objects?.find(l => l.name.toLowerCase() === lower) || map.getObjectLayer(name);
        };

        this.collisionBoxes = this.physics.add.staticGroup();
        const collisionLayer = findObjectLayer('collisions');
        if (collisionLayer && collisionLayer.objects) {
            collisionLayer.objects.forEach(obj => {
                let boxX = obj.x * SCALE;
                let boxY = obj.y * SCALE;
                let boxW = obj.width * SCALE;
                let boxH = obj.height * SCALE;

                if (obj.polygon) {
                    let minX = 0, minY = 0, maxX = 0, maxY = 0;
                    obj.polygon.forEach(p => {
                        if (p.x < minX) minX = p.x; if (p.x > maxX) maxX = p.x;
                        if (p.y < minY) minY = p.y; if (p.y > maxY) maxY = p.y;
                    });
                    boxW = (maxX - minX) * SCALE;
                    boxH = (maxY - minY) * SCALE;
                    boxX = (obj.x + minX) * SCALE;
                    boxY = (obj.y + minY) * SCALE;
                }

                const zone = this.add.rectangle(boxX + (boxW / 2), boxY + (boxH / 2), boxW, boxH, 0xff0000, 0);
                this.physics.add.existing(zone, true);
                this.collisionBoxes.add(zone);
            });
        }

        const spawnLayer = findObjectLayer('spawns');
        let playerStartX = 150;
        let playerStartY = levelH / 2;

        if (spawnLayer && spawnLayer.objects) {
            const startObj = spawnLayer.objects.find(o => o.name === 'start');
            if (startObj) {
                playerStartX = startObj.x * SCALE;
                playerStartY = startObj.y * SCALE;
            }
        }

        this.initPlayer(playerStartX, playerStartY, levelW, this.charKey);
        if (this.player) {
            this.player.setDepth(100);
            this.physics.add.collider(this.player, this.collisionBoxes);


            // Camera is already set up correctly by initPlayer in BaseScene
            // Do NOT override startFollow or setFollowOffset here
        }

        const deathZone = this.add.rectangle(levelW / 2, levelH + 50, levelW * 2, 100, 0x0000ff, 0);
        this.physics.add.existing(deathZone, true);
        this.physics.add.overlap(this.player, deathZone, () => {
            if (this.isRestarting) return;
            this.isRestarting = true;
            this.cameras.main.fadeOut(300, 0, 0, 0, (cam, progress) => {
                if (progress === 1) this.scene.restart({ char: this.charKey });
            });
        });

        this.shard = this.spawnMemoryShard(levelW - 200, levelH - 100, 'truth');

        const triggerLayer = findObjectLayer('triggers');
        if (triggerLayer && triggerLayer.objects) {
            triggerLayer.objects.forEach(obj => {
                const zone = this.add.zone((obj.x + obj.width / 2) * SCALE, (obj.y + obj.height / 2) * SCALE, obj.width * SCALE, obj.height * SCALE);
                this.physics.add.existing(zone, true);

                let dKey = null;
                if (obj.properties) {
                    obj.properties.forEach(p => {
                        if (p.name === 'dialogueKey') dKey = p.value;
                    });
                }

                this.physics.add.overlap(this.player, zone, () => {
                    if (dKey && !obj.triggered) {
                        obj.triggered = true;
                        if (obj.name === 'cave_entrance') this.bg.setTexture('bg_antarctica_cave');
                        this.scene.pause();
                        this.scene.launch('DialogueScene', { script: dKey, nextScene: this.scene.key, sceneData: data, isInternal: true });
                    }
                });
            });
        }

        this.events.on('shard-collected', () => {
            if (!this.isWinning) {
                this.isWinning = true;
                this.sound.stopAll();
                this.cameras.main.fadeOut(2000);
                this.time.delayedCall(2000, () => {
                    this.scene.start('DialogueScene', {
                        script: 'level2_abyss_descending',
                        nextScene: 'Level2_Abyss',
                        sceneData: { char: this.charKey }
                    });
                });
            }
        });

        let spawnedEnemyCount = 0;
        if (spawnLayer && spawnLayer.objects) {
            spawnLayer.objects.forEach(obj => {
                if (obj.type === 'enemy') {
                    let eType = 'walker';
                    if (obj.properties) {
                        obj.properties.forEach(p => { if (p.name === 'enemyType') eType = p.value; });
                    }
                    const spawnY = (obj.y + (obj.height || 0)) * SCALE - 40;
                    if (eType === 'drone') {
                        const d = this.spawnDrone(obj.x * SCALE, (obj.y - 60) * SCALE);
                        if (d) { d.setDepth(100); spawnedEnemyCount++; }
                    } else {
                        const w = this.spawnWalker(obj.x * SCALE, spawnY);
                        if (w) { w.setDepth(100); spawnedEnemyCount++; }
                    }
                }
            });
        }

        // FALLBACK: guarantee enemies if Tiled map has no enemy spawn objects
        if (spawnedEnemyCount === 0) {
            const waveCount = 5;
            const spawnFloorY = levelH - 100;
            for (let i = 0; i < waveCount; i++) {
                const xPos = playerStartX + 400 + (i * (levelW / waveCount));
                if (xPos >= levelW - 200) continue;
                if (i % 3 === 0) {
                    const d = this.spawnDrone(xPos, spawnFloorY - 150);
                    if (d) d.setDepth(100);
                } else {
                    const w = this.spawnWalker(xPos, spawnFloorY - 40);
                    if (w) w.setDepth(100);
                }
            }
        }

        this.physics.add.collider(this.enemies, this.collisionBoxes);

        this.physics.add.overlap(this.player.hitArea, this.enemies, (h, e) => {
            this.onEnemyHit(e, this.player.currentDmg || 10, this.player.atkID, this.player.currentKB || 1);
        }, null, this);

        this.physics.add.overlap(this.projs, this.enemies, (p, e) => {
            this.onEnemyHit(e, 20, p.getData('atkID'), 1);
            p.destroy();
        }, null, this);

        this.scene.launch('UIScene', { char: this.charKey });
    }

    update() {
        if (this.player && this.player.active) {
            this.player.update();
            this.updateCameraLookAhead();
        }
        if (this.enemies) this.enemies.getChildren().forEach(e => { if (e.update) e.update(); });
    }
}