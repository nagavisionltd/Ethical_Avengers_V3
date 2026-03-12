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

        // Map 'curt' to 'default' since that's how assets are loaded
        const charType = (type === 'curt') ? 'default' : type;

        if (['cherry', 'adam', 'bigz', 'ignite', 'ninja', 'default'].includes(charType)) {
            // Lazy load NeoPlayer class if not global (assuming it's loaded in index.html)
            this.player = new NeoPlayer(this, x, y, charType);
        } else {
            // Fallback for any legacy types not migrated yet (though Player class is missing in index.html)
            console.warn(`Character type '${type}' not recognized by NeoPlayer. Attempting NeoPlayer with 'default'.`);
            this.player = new NeoPlayer(this, x, y, 'default');
        }

        this.player.setData({ maxHP: 100, hp: 100, invincible: false });
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1, 0, -100);

        this.projs = this.physics.add.group();
        this.enemies = this.physics.add.group();

        //this.physics.add.collider(this.player, this.enemies);
        this.physics.add.overlap(this.player, this.enemies, this.onPlayerHit, null, this);

        const ui = this.scene.get('UIScene');
        if (ui) {
            if (ui.setPlayerInfo) ui.setPlayerInfo(type);
            if (ui.updateHP) ui.updateHP(1);
            if (ui.showBossBar) ui.showBossBar('', false);
        }
    }

    doFire(player) {
        if (!player || !player.active) return;

        let projKey = 'orb';
        let projAnim = 'orb_f';
        let startFrame = 'f0'; // Default frame if texture is atlas/spritesheet
        let fireY = -60;

        if (player.prefix === 'ignite') {
            projKey = 'ignite_blast_projectile_01'; // Use the first frame as the base texture key
            projAnim = 'ignite_projectile_anim';
            startFrame = null; // Individual image, no frame key needed
            fireY = -100; // Raised specifically for Dr. Ignite's chest level
        } else if (player.prefix === 'default') {
            projKey = 'cs_proj_1';
            projAnim = 'default_projectile_anim';
            startFrame = null;
            fireY = -60; // Standard chest height for chibi
        }

        const p = this.projs.create(player.x + (player.flipX ? -60 : 60), player.y + fireY, projKey, startFrame);
        if (p) {
            if (player.prefix === 'ignite') p.setScale(0.4);
            p.body.setAllowGravity(false).setVelocityX(player.flipX ? -800 : 800);
            p.setFlipX(player.flipX).anims.play(projAnim);
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
            targets: player,
            alpha: 0.3,
            duration: 100,
            yoyo: true,
            repeat: 5,
            onComplete: () => {
                if (player.active) {
                    player.setData('invincible', false);
                    player.setAlpha(1);
                    player.clearTint();
                }
            }
        });

        if (newHP <= 0) {
            this.triggerExplosion(player.x, player.y - 40);

            // --- LIFE SYSTEM LOGIC ---
            const lives = this.registry.get('playerLives') || 0;
            const newLives = Math.max(0, lives - 1);
            this.registry.set('playerLives', newLives);

            const ui = this.scene.get('UIScene');
            if (ui && ui.updateLivesDisplay) ui.updateLivesDisplay();

            this.time.delayedCall(1000, () => {
                if (newLives > 0) {
                    // Respawn
                    this.scene.restart();
                } else {
                    // Game Over
                    this.handleGameOver();
                }
            });
        }
    }

    handleGameOver() {
        console.log("GAME OVER");
        this.cameras.main.fadeOut(2000, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            // Reset lives for next session
            this.registry.set('playerLives', 3);
            this.scene.start('ModeSelectScene');
        });
    }

    // Updated to handle variable knockback per hit
    onEnemyHit(enemy, dmg, sourceAtkID, kbPower = 1) {
        if (!enemy.active) return;
        if (enemy.getData('lastHit') === sourceAtkID) return;
        enemy.setData('lastHit', sourceAtkID);

        const currentHP = enemy.getData('hp') - dmg;
        enemy.setData('hp', currentHP);

        // Stun Logic: Prevent movement for a duration based on impact
        enemy.setData('isStunned', true);
        if (enemy.stunTimer) enemy.stunTimer.remove();
        enemy.stunTimer = this.time.delayedCall(400 * kbPower, () => {
            if (enemy.active) enemy.setData('isStunned', false);
        });

        const ui = this.scene.get('UIScene');
        if (ui) {
            ui.updateScore(100);
            if (this.player && this.player.active && this.player.isAtk) ui.showCombo(this.player.combo);
        }

        if (enemy.getData('isBoss') && ui) {
            ui.updateBossHP(Math.max(0, currentHP / enemy.getData('maxHP')));
        }

        if (enemy.setTintFill) enemy.setTintFill(0xffffff);
        else enemy.setTint(0xffffff);

        this.cameras.main.shake(100 * kbPower, 0.01 * kbPower);
        this.sound.play('sh');

        const kbDir = (this.player && this.player.active && this.player.x < enemy.x) ? 1 : -1;
        // HEAVIER ENEMIES: Standardized knockback logic
        // If kbPower is low (0.02), move is negligible. 
        // If kbPower is high (1.5), move is significant.
        enemy.setVelocity(kbDir * (150 * kbPower), -75 * kbPower);

        this.time.delayedCall(50, () => {
            if (enemy.active) {
                enemy.clearTint();
                enemy.setTint(0xff0000);
                this.time.delayedCall(150, () => {
                    if (enemy.active) enemy.clearTint();
                });
            }
        });

        if (currentHP <= 0) {
            this.triggerExplosion(enemy.x, enemy.y - 40);
            enemy.destroy();
            this.onEnemyDeath(enemy);
        }
    }

    onEnemyDeath(enemy) {
        // Reward Upgrade Point
        const currentPoints = this.registry.get('upgradePoints') || 0;
        this.registry.set('upgradePoints', currentPoints + 1);

        // Signal UI to show point gain
        const ui = this.scene.get('UIScene');
        if (ui && ui.showPointGain) ui.showPointGain();
    }

    unlockLevel(levelID) {
        const unlocked = this.registry.get('unlockedLevels') || ['Khemra'];
        if (!unlocked.includes(levelID)) {
            unlocked.push(levelID);
            this.registry.set('unlockedLevels', unlocked);
        }
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
        // Props use standard knockback power
        this.physics.add.overlap(this.player.hitArea, obj, (h, o) => { if (o.active) this.onEnemyHit(o, 10, this.player.atkID, 0.5); });
        this.physics.add.overlap(this.projs, obj, (p, o) => {
            if (p.active && o.active) {
                this.onEnemyHit(o, 20, p.getData('atkID'), 0.5);
                p.destroy();
            }
        });
        return obj;
    }

    spawnWalker(x, y) {
        const w = this.enemies.create(x, y, 'walker_i', 'f0').setOrigin(0.5, 1).setScale(2.8).setCollideWorldBounds(true).setGravityY(2500);
        w.body.setSize(20, 48).setOffset(14, 0);
        w.setData('hp', 50);
        w.anims.play('walker_idle');
        w.update = () => {
            if (!w.body || !this.player.active) return;
            if (w.getData('isStunned')) return;
            const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, w.x, w.y);
            if (dist < 400 && dist > 60) {
                w.setVelocityX(this.player.x < w.x ? -120 : 120);
                w.setFlipX(this.player.x < w.x);
                w.anims.play('walker_walk', true);
            } else { w.setVelocityX(0); w.anims.play('walker_idle', true); }
        };
        return w;
    }

    spawnDrone(x, y) {
        const d = this.enemies.create(x, y, 'drone1').setOrigin(0.5, 0.5).setScale(2.5).setCollideWorldBounds(true);
        d.body.setSize(20, 20);
        d.body.setAllowGravity(false);
        d.setData('hp', 30);

        if (this.anims.exists('drone_fly')) {
            d.anims.play('drone_fly');
        }

        d.update = () => {
            if (!d.body || !this.player.active) return;
            if (d.getData('isStunned')) return;
            const angle = Phaser.Math.Angle.Between(d.x, d.y, this.player.x, this.player.y - 60);
            this.physics.velocityFromRotation(angle, 180, d.body.velocity);
            d.setFlipX(this.player.x < d.x);
        };
        return d;
    }
}