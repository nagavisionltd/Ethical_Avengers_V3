class BaseScene extends Phaser.Scene {
    constructor(key) {
        super(key);
    }

    create(data) {
        this.cameras.main.fadeIn(500);

        // Add global listener for animation errors to help debug missing frames
        this.anims.on('animationerror', (key, animation, gameObject) => {
            console.error(`[BaseScene] Animation Error! Key: ${key}, Object:`, gameObject);
        });
    }

    initAnimatedTiles(map) {
        this.animatedTiles = [];
        const animLookup = {};

        // 1. Build lookup of animated tile starting GIDs
        map.tilesets.forEach(tileset => {
            const tileData = tileset.tileData;
            if (!tileData) return;
            for (let tileId in tileData) {
                const anims = tileData[tileId].animation;
                if (anims && anims.length > 0) {
                    const startingGid = parseInt(tileId) + tileset.firstgid;
                    animLookup[startingGid] = anims.map(a => ({
                        tileid: a.tileid + tileset.firstgid,
                        duration: a.duration
                    }));
                }
            }
        });

        if (Object.keys(animLookup).length === 0) return;

        // 2. Scan all layers for these tiles
        map.layers.forEach(layerData => {
            const layer = layerData.tilemapLayer;
            if (!layer) return;
            layer.forEachTile(tile => {
                if (animLookup[tile.index]) {
                    this.animatedTiles.push({
                        tile: tile,
                        animations: animLookup[tile.index],
                        currentFrame: 0,
                        timer: 0
                    });
                }
            });
        });
        console.log(`[BaseScene] Initialized ${this.animatedTiles.length} animated tiles.`);
    }

    updateAnimatedTiles(delta) {
        if (!this.animatedTiles) return;
        this.animatedTiles.forEach(anim => {
            anim.timer += delta;
            const currentAnim = anim.animations[anim.currentFrame];
            if (anim.timer >= currentAnim.duration) {
                anim.timer -= currentAnim.duration;
                anim.currentFrame = (anim.currentFrame + 1) % anim.animations.length;
                anim.tile.index = anim.animations[anim.currentFrame].tileid;
            }
        });
    }

    initPlayer(x, y, levelW, type = 'default') {
        this.sound.stopAll();
        // Use existing camera bounds height if set, otherwise default to 540
        const camH = this.cameras.main._bounds ? this.cameras.main._bounds.height : 540;
        this.cameras.main.setBounds(0, 0, levelW, Math.max(camH, 540));

        // --- RPG SYSTEM ---
        this.rpg = new RPGSystem(this);

        // Map 'curt' to 'default' since that's how assets are loaded
        const charType = (type === 'curt') ? 'default' : type;

        if (['cherry', 'adam', 'bigz', 'ignite', 'ninja', 'lordsoul', 'default'].includes(charType)) {
            this.player = new NeoPlayer(this, x, y, charType);
        } else {
            console.warn(`Character type '${type}' not recognized by NeoPlayer. Attempting NeoPlayer with 'default'.`);
            this.player = new NeoPlayer(this, x, y, 'default');
        }

        this.player.setData({ maxHP: 100, hp: 100, invincible: false });
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        
        // Remove deadzone entirely so tracking is constant and immediate
        this.cameras.main.setDeadzone(0, 0); 

        this.projs = this.physics.add.group();
        this.enemies = this.physics.add.group();

        this.physics.add.overlap(this.player, this.enemies, this.onPlayerHit, null, this);
        
        // Phaser 3: followOffset is SUBTRACTED from target position.
        // Negative X = camera shifts RIGHT = player appears LEFT (correct for facing right)
        // Positive X = camera shifts LEFT = player appears RIGHT (correct for facing left)
        this.cameras.main.setFollowOffset(this.player.flipX ? 250 : -250, 200);
        this.lastCameraFlipX = this.player.flipX;


        const ui = this.scene.get('UIScene');
        if (ui) {
            if (ui.setPlayerInfo) ui.setPlayerInfo(type);
            if (ui.updateHP) ui.updateHP(1);
            if (ui.showBossBar) ui.showBossBar('', false);
        }
    }

    doFire(player) {
        if (!player || !player.active) return;

        if (player.prefix === 'lordsoul') {
            const currentAnim = player.anims.currentAnim?.key || 'NONE';
            const comboType = player.comboType || '';
            const spawnX = player.x + (player.flipX ? -50 : 50);
            
            if (currentAnim.includes('blast1')) {
                const p = this.projs.create(spawnX, player.y - 130, 'ls_blast1_proj_1');
                if (p) {
                    p.setDepth(1000); p.setScale(3.5); p.body.setAllowGravity(false);
                    p.body.setVelocityX(player.flipX ? -900 : 900);
                    p.setData('atkID', player.atkID);
                    if (this.anims.exists('lordsoul_blast1_proj')) p.anims.play('lordsoul_blast1_proj', true);
                    this.time.delayedCall(2000, () => { if (p && p.active) p.destroy(); });
                }
                return;
            }
            
            if (currentAnim.includes('blast2')) {
                const fingerOffsetX = player.flipX ? -60 : 60; // Increased offset
                const p = this.projs.create(spawnX + fingerOffsetX, player.y - 150, 'ls_blast2_proj_1'); // Higher
                if (p) {
                    p.setDepth(1000); p.setScale(5.0); p.body.setAllowGravity(false);
                    p.body.setVelocityX(player.flipX ? -900 : 900);
                    p.setData('atkID', player.atkID);
                    if (this.anims.exists('lordsoul_blast2_proj')) p.anims.play('lordsoul_blast2_proj', true);
                    this.time.delayedCall(2000, () => { if (p && p.active) p.destroy(); });
                }
                return;
            }
            
            if (comboType === 'beam' || currentAnim.includes('blast3') || currentAnim.includes('bigbeam')) {
                // Remove projectile sprite, use particle emitter instead
                this.triggerBeamParticleEffect(spawnX, player.y - 80, player.flipX);
                return;
            }

            if (currentAnim.includes('jump_atk')) {
                const p = this.projs.create(spawnX, player.y - 40, 'ls_jp_5_proj');
                if (p) {
                    p.setDepth(1000); p.setScale(2); p.body.setAllowGravity(false);
                    // Angle slightly down
                    p.body.setVelocity(player.flipX ? -600 : 600, 400);
                    p.rotation = player.flipX ? 0.5 : -0.5;
                    p.setData('atkID', player.atkID);
                    this.time.delayedCall(1500, () => { if (p && p.active) p.destroy(); });
                }
                return;
            }
        }

        let projKey = 'orb', projAnim = 'orb_f', startFrame = 'f0', fireY = -60;
        if (player.prefix === 'ignite') { projKey = 'ignite_blast_projectile_01'; projAnim = 'ignite_projectile_anim'; startFrame = null; fireY = -100; }
        else if (player.prefix === 'default') { projKey = 'cs_proj_1'; projAnim = 'default_projectile_anim'; startFrame = null; fireY = -60; }

        const p = this.projs.create(player.x + (player.flipX ? -60 : 60), player.y + fireY, projKey, startFrame);
        if (p) {
            if (player.prefix === 'ignite') p.setScale(0.4);
            p.body.setAllowGravity(false).setVelocityX(player.flipX ? -800 : 800);
            p.setFlipX(player.flipX);
            if (this.anims.exists(projAnim)) p.anims.play(projAnim);
            p.setData('atkID', player.atkID);
            this.time.delayedCall(2000, () => { if (p && p.active) p.destroy(); });
        }
    }

    onPlayerHit(player, enemy) {
        if (!player.active || !enemy.active) return;
        if (player.getData('invincible') || player.isAtk) return;

        const newHP = player.getData('hp') - 10;
        player.setData('hp', newHP);
        player.setData('invincible', true);
        player.isHurt = true;

        const ui = this.scene.get('UIScene');
        if (ui) ui.updateHP(Math.max(0, newHP / 100));

        player.setTint(0xff0000);
        this.cameras.main.shake(150, 0.005);
        this.sound.play('sh');

        const kbDir = enemy.x < player.x ? 1 : -1;
        player.setVelocity(kbDir * 150, -100);

        this.time.delayedCall(250, () => { if (player.active) player.isHurt = false; });

        this.tweens.add({
            targets: player, alpha: 0.3, duration: 100, yoyo: true, repeat: 5,
            onComplete: () => { if (player.active) { player.setData('invincible', false); player.setAlpha(1); player.clearTint(); } }
        });

        if (newHP <= 0) {
            this.triggerExplosion(player.x, player.y - 40);
            const lives = this.registry.get('playerLives') || 0;
            const newLives = Math.max(0, lives - 1);
            this.registry.set('playerLives', newLives);
            const ui = this.scene.get('UIScene');
            if (ui && ui.updateLivesDisplay) ui.updateLivesDisplay();
            this.time.delayedCall(1000, () => { if (newLives > 0) this.scene.restart(); else this.handleGameOver(); });
        }
    }

    handleGameOver() {
        this.cameras.main.fadeOut(2000, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.registry.set('playerLives', 3);
            this.scene.start('ModeSelectScene');
        });
    }

    onEnemyHit(enemy, dmg, sourceAtkID, kbPower = 1) {
        if (!enemy.active) return;
        if (enemy.getData('lastHit') === sourceAtkID) return;
        enemy.setData('lastHit', sourceAtkID);

        // --- COMBAT FEEDBACK (Hit Stop, Shake, Particles) ---
        CombatFeedback.triggerImpact(this, enemy.x, enemy.y - 40, kbPower);

        if (enemy instanceof Enemy) {
            enemy.takeHit(dmg, kbPower, this.player.x);
        } else {
            const currentHP = enemy.getData('hp') - dmg;
            enemy.setData('hp', currentHP);
            enemy.setData('isStunned', true);
            if (enemy.stunTimer) enemy.stunTimer.remove();
            const playerCombo = (this.player && this.player.active) ? this.player.combo : 1;
            let stunDuration = 400 * kbPower, yKB = -75 * kbPower;
            if (playerCombo >= 5 || kbPower >= 2.0) { stunDuration = 800; yKB = -300; } 
            else if (playerCombo >= 3) { stunDuration = 600; }
            enemy.stunTimer = this.time.delayedCall(stunDuration, () => { if (enemy.active) enemy.setData('isStunned', false); });
            if (enemy.setTintFill) enemy.setTintFill(0xffffff); 
            else if (enemy.setTint) enemy.setTint(0xffffff);
            else if (enemy.setFillStyle) enemy.setFillStyle(0xffffff);

            const kbDir = (this.player && this.player.active && this.player.x < enemy.x) ? 1 : -1;
            
            // Only apply horizontal knockback if power is high enough (finisher)
            const finalKB = (kbPower >= 0.8) ? (150 * kbPower) : 0;
            const finalY = (kbPower >= 0.8) ? yKB : 0;

            if (enemy.setVelocity) {
                enemy.setVelocity(kbDir * finalKB, finalY);
            } else if (enemy.body) {
                enemy.body.setVelocity(kbDir * finalKB, finalY);
            }
            
            this.time.delayedCall(50, () => { 
                if (enemy.active) { 
                    if (enemy.clearTint) enemy.clearTint(); 
                    if (enemy.setTint) enemy.setTint(0xff0000); 
                    else if (enemy.setFillStyle) enemy.setFillStyle(0xff0000);

                    this.time.delayedCall(150, () => { 
                        if (enemy.active) {
                            if (enemy.clearTint) enemy.clearTint(); 
                            else if (enemy.setFillStyle) enemy.setFillStyle(0xff3333);
                        }
                    }); 
                } 
            });
            // Let the enemy instance handle its own death state to avoid race conditions
        }

        const ui = this.scene.get('UIScene');
        if (ui) {
            ui.updateScore(100);
            if (this.player && this.player.active && this.player.isAtk) ui.showCombo(this.player.combo);
        }
        if (enemy.getData('isBoss') && ui) ui.updateBossHP(Math.max(0, enemy.getData('hp') / enemy.getData('maxHP')));
        // Sound based on impact power
        if (kbPower >= 2.0) this.sound.play('hit_heavy', { volume: 0.8 });
        else if (kbPower >= 0.8) this.sound.play('hit_medium', { volume: 0.6 });
        else this.sound.play('hit_light', { volume: 0.4 });
    }

    onEnemyDeath(enemy) {
        if (this.rpg) {
            const isElite = enemy.getData('isBoss') || enemy.getData('maxHP') > 100;
            const xpGain = isElite ? 100 : 20;
            const ecGain = Phaser.Math.Between(5, 15);
            this.rpg.addXP(xpGain);
            this.rpg.addCredits(ecGain, enemy.x, enemy.y - 60);
        }
        this.spawnSoulOrb(enemy.x, enemy.y - 20);
    }

    spawnSoulOrb(x, y) {
        if (!this.textures.exists('generated_soul_orb')) {
            const orbGraphic = this.add.graphics();
            orbGraphic.fillStyle(0x00ffff, 1); orbGraphic.fillCircle(6, 6, 4);
            orbGraphic.lineStyle(2, 0xffffff, 1); orbGraphic.strokeCircle(6, 6, 5);
            orbGraphic.generateTexture('generated_soul_orb', 12, 12); orbGraphic.destroy();
        }
        if (!this.soulOrbsGroup || !this.soulOrbsGroup.scene || !this.soulOrbsGroup.scene.sys) {
            this.soulOrbsGroup = this.physics.add.group();
            if (this.collisionBoxes) this.physics.add.collider(this.soulOrbsGroup, this.collisionBoxes);
            if (this.tileColliders) this.tileColliders.forEach(layer => this.physics.add.collider(this.soulOrbsGroup, layer));
            this.physics.add.overlap(this.player, this.soulOrbsGroup, (player, orb) => {
                orb.destroy();
                const currentOrbs = this.registry.get('soulOrbs') || 0;
                this.registry.set('soulOrbs', currentOrbs + 1);
                const ui = this.scene.get('UIScene');
                if (ui && ui.updateSoulOrbs) ui.updateSoulOrbs();
                const txt = this.add.text(orb.x, orb.y, '+1 SOUL', { fontFamily: '"Press Start 2P"', fontSize: '10px', fill: '#00ffff' }).setOrigin(0.5).setDepth(200);
                this.tweens.add({ targets: txt, y: orb.y - 50, alpha: 0, duration: 1000, onComplete: () => txt.destroy() });
            });
        }
        const orb = this.soulOrbsGroup.create(x, y, 'generated_soul_orb');
        if (orb) {
            orb.setBounce(0.5); orb.setCollideWorldBounds(true); orb.setDragX(100);
            orb.setVelocity(Phaser.Math.Between(-100, 100), Phaser.Math.Between(-300, -150));
            this.tweens.add({ targets: orb, scale: 1.5, alpha: 0.6, duration: 500, yoyo: true, repeat: -1 });
        }
    }

    unlockLevel(levelID) {
        const unlocked = this.registry.get('unlockedLevels') || ['Khemra'];
        if (!unlocked.includes(levelID)) { unlocked.push(levelID); this.registry.set('unlockedLevels', unlocked); }
    }

    triggerBeamParticleEffect(x, y, flipX) {
        // Create emitter directly
        const emitter = this.add.particles(x, y, 'orb', {
            speed: { min: 400, max: 600 },
            angle: { min: -10, max: 10 },
            scale: { start: 1.5, end: 0 },
            blendMode: 'ADD',
            lifespan: 300,
            quantity: 5,
            tint: 0x00ff00,
            emitZone: { type: 'random', source: new Phaser.Geom.Circle(0, 0, 10) }
        });
        
        this.time.delayedCall(500, () => emitter.destroy());
    }

    triggerExplosion(x, y) {
        const ex = this.add.sprite(x, y, 'exp').setScale(3.5).setDepth(1000);
        ex.play('explode');
        ex.once('animationcomplete', () => { if (ex.active) ex.destroy(); });
        this.time.delayedCall(1000, () => { if (ex && ex.active) ex.destroy(); });
    }

    spawnDestructible(x, y, type = 'barrel1') {
        const obj = this.physics.add.sprite(x, y, type).setOrigin(0.5, 1).setScale(0.4).setImmovable(true).setDepth(5);
        obj.setData('hp', 20);
        this.physics.add.collider(this.player, obj);
        this.physics.add.overlap(this.player.hitArea, obj, (h, o) => { if (o.active) this.onEnemyHit(o, 10, this.player.atkID, 0.5); });
        this.physics.add.overlap(this.projs, obj, (p, o) => { if (p.active && o.active) { this.onEnemyHit(o, 20, p.getData('atkID'), 0.5); p.destroy(); } });
        return obj;
    }

    spawnWalker(x, y) {
        const w = new Enemy(this, x, y, 'walker');
        this.enemies.add(w);
        w.update = () => {
            if (!w.body || !this.player.active) return;
            if (w.getData('isStunned')) return;
            const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, w.x, w.y);
            const now = this.time.now;
            if (dist <= 80 && now - (w.getData('lastAtk') || 0) > 1500) {
                w.setData('lastAtk', now); w.setVelocityX(this.player.x < w.x ? -300 : 300); w.setVelocityY(-200); w.setTint(0xff5555);
                this.time.delayedCall(300, () => { if (w.active) w.clearTint(); });
            } 
            else if (dist < 400 && dist > 70 && w.body.onFloor()) {
                w.setVelocityX(this.player.x < w.x ? -120 : 120); w.setFlipX(this.player.x < w.x);
                if (w.anims.exists('walker_walk')) w.anims.play('walker_walk', true);
            } else if (w.body.onFloor()) { 
                w.setVelocityX(0); if (w.anims.exists('walker_idle')) w.anims.play('walker_idle', true); 
            }
        };
        return w;
    }

    spawnDrone(x, y) {
        const d = new Enemy(this, x, y, 'drone');
        this.enemies.add(d);
        d.update = () => {
            if (!d.body || !this.player.active) return;
            if (d.getData('isStunned')) return;
            const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, d.x, d.y);
            const now = this.time.now;
            if (dist < 150 && this.player.y > d.y && now - (d.getData('lastAtk') || 0) > 2000) {
                d.setData('lastAtk', now); d.setTint(0xffaa00);
                this.physics.moveToObject(d, this.player, 350);
                this.time.delayedCall(400, () => { if (d.active) d.clearTint(); });
            } else if (now - (d.getData('lastAtk') || 0) > 800) {
                const angle = Phaser.Math.Angle.Between(d.x, d.y, this.player.x, this.player.y - 80);
                this.physics.velocityFromRotation(angle, 120, d.body.velocity);
            }
            d.setFlipX(this.player.x < d.x);
        };
        return d;
    }

    spawnMemoryShard(x, y, type = 'truth') {
        const shard = this.physics.add.sprite(x, y, null).setSize(20, 20).setOrigin(0.5);
        shard.setData('type', type);
        const color = type === 'truth' ? 0x00aaff : 0xff0000;
        const box = this.add.rectangle(x, y, 20, 20, color, 0.8);
        shard.visual = box;
        this.physics.add.overlap(this.player, shard, () => {
            const current = this.registry.get('memoryShards') || 0;
            this.registry.set('memoryShards', current + 1);
            if (this.rpg) this.rpg.addXP(50);
            this.sound.play('sa');
            shard.visual.destroy(); shard.destroy();
            this.events.emit('shard-collected', type);
        });
        shard.update = () => {
            if (shard.active) {
                shard.visual.setPosition(shard.x, shard.y);
                shard.visual.setScale(1 + Math.sin(this.time.now / 200) * 0.2);
            }
        };
        return shard;
    }

    spawnLava(yStart) {
        const W = this.cameras.main.width * 10;
        this.lava = this.add.rectangle(0, yStart, W, 1000, 0xff3300, 0.5).setOrigin(0, 0);
        this.physics.add.existing(this.lava, false);
        this.lava.body.setAllowGravity(false); this.lava.body.setImmovable(true);
        this.lavaRiseSpeed = 0.5;
        this.physics.add.overlap(this.player, this.lava, () => {
            if (!this.player.getData('invincible')) {
                this.onPlayerHit(this.player, { x: this.player.x, y: this.lava.y, active: true });
                this.player.y -= 50;
            }
        });
    }

    updateLava(delta) {
        if (this.lava && this.lava.active) {
            this.lava.y -= this.lavaRiseSpeed * (delta / 16);
            this.lava.body.updateFromGameObject();
        }
    }

    triggerImpactEffect(x, y, kbPower) {
        const impact = this.add.sprite(x, y, 'exp').setScale(0.5 * kbPower).setDepth(1001);
        impact.setTint(0xffff00); impact.play('explode');
        impact.once('animationcomplete', () => impact.destroy());
        for (let i = 0; i < 5; i++) {
            const p = this.add.rectangle(x, y, 4, 4, 0xffffff);
            this.physics.add.existing(p); p.body.setAllowGravity(true);
            p.body.setVelocity(Phaser.Math.Between(-200, 200), Phaser.Math.Between(-400, -100));
            this.time.delayedCall(300, () => p.destroy());
        }
    }

    updateCameraLookAhead() {
        if (this.player && this.player.active) {
            // Only update offset when player changes direction
            if (this.player.flipX !== this.lastCameraFlipX) {
                this.lastCameraFlipX = this.player.flipX;
                
                // Phaser 3: followOffset is SUBTRACTED from target.
                const targetX = this.player.flipX ? 250 : -250;
                
                this.cameras.main.setFollowOffset(targetX, 200);
            }
        }
    }

    applyMagnetEffect(targetX, targetY, radius = 300, force = 0.1) {
        if (!this.enemies) return;
        this.enemies.getChildren().forEach(enemy => {
            if (!enemy.active) return;
            const dist = Phaser.Math.Distance.Between(targetX, targetY, enemy.x, enemy.y);
            if (dist < radius) {
                const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, targetX, targetY);
                const vx = Math.cos(angle) * (radius - dist) * force;
                const vy = Math.sin(angle) * (radius - dist) * force;
                
                if (enemy.body) {
                    enemy.body.velocity.x += vx;
                    enemy.body.velocity.y += vy;
                } else {
                    enemy.x += vx * 0.1;
                    enemy.y += vy * 0.1;
                }
            }
        });
    }
}