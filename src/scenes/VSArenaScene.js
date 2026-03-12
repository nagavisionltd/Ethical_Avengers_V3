class VSArenaScene extends Phaser.Scene {
    constructor() {
        super('VSArenaScene');
    }

    create(data) {
        // Data: { p1: 'cherry', p2: 'adam', arenaVideo: 'vid_vs_bg_1', isVS: true }
        this.p1Key = data.p1 || 'cherry';
        this.p2Key = data.p2 || 'adam';
        this.videoKey = data.arenaVideo || 'vid_vs_bg_1';

        // --- BACKGROUND ---
        if (this.cache.video.exists(this.videoKey)) {
            const vid = this.add.video(this.cameras.main.width / 2, this.cameras.main.height / 2, this.videoKey);

            const safeResize = () => {
                if (vid && vid.active && vid.texture && vid.texture.key !== '__MISSING' && vid.width > 0) {
                    try {
                        vid.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
                    } catch (e) {
                        console.warn('Failed to resize VSArena video:', e);
                    }
                }
            };

            vid.on('playing', safeResize);
            vid.play(true);
            vid.setVolume(0);

            if (vid.width > 0) safeResize();
            this.time.delayedCall(200, safeResize);
        } else {
            this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'bg_boss').setDisplaySize(960, 540);
        }

        // --- PLATFORM / FLOOR ---
        const floor = this.add.rectangle(480, 530, 960, 20, 0x000000, 0).setOrigin(0.5);
        this.physics.add.existing(floor, true);

        // --- CONTROLS SETUP ---
        // Player 1: Arrows + Z (Atk) + C (Special)
        const p1Controls = this.input.keyboard.createCursorKeys();
        p1Controls.attack = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        p1Controls.special = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);

        // Player 2: WASD + F (Atk) + G (Special)
        const p2Controls = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
        p2Controls.attack = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        p2Controls.special = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.G);

        // --- PLAYERS ---
        // Player 1 (Left) - Pass P1 controls
        this.player1 = new NeoPlayer(this, 200, 400, this.p1Key, p1Controls);
        this.player1.setFlipX(false);
        this.player1.setDepth(10);
        this.physics.add.collider(this.player1, floor);

        // Player 2 (Right) - Pass P2 controls
        this.player2 = new NeoPlayer(this, 760, 400, this.p2Key, p2Controls);
        this.player2.setFlipX(true);
        this.player2.setDepth(10);
        this.physics.add.collider(this.player2, floor);

        // --- PHYSICS & COMBAT ---
        this.physics.add.collider(this.player1, this.player2);

        // PvP Hit Detection
        this.physics.add.overlap(this.player1.hitArea, this.player2, () => {
            if (this.player1.isAtk) this.handleHit(this.player1, this.player2);
        });

        this.physics.add.overlap(this.player2.hitArea, this.player1, () => {
            if (this.player2.isAtk) this.handleHit(this.player2, this.player1);
        });

        this.projs = this.physics.add.group();

        // Use an empty group for enemies to satisfy NeoPlayer's internal check references if any exist
        this.enemies = this.physics.add.group();

        // --- UI ---
        this.scene.launch('UIScene', { isVS: true, p1: this.p1Key, p2: this.p2Key });

        // Timer Listener
        this.game.events.on('vs-time-over', this.handleTimeOver, this);

        // --- MUSIC ---
        this.sound.stopAll();
        this.sound.play('music_drama', { loop: true, volume: 0.6 });
    }

    update() {
        if (this.player1) this.player1.update();
        if (this.player2) this.player2.update();
    }

    // Override BaseScene's doFire logic locally since VSArena doesn't extend BaseScene yet (or needs to handle pvp)
    doFire(player) {
        let projKey = 'orb';
        let projAnim = 'orb_f';
        let fireY = -60;

        if (player.prefix === 'ignite') {
            projKey = 'ignite_blast_projectile_01';
            projAnim = 'ignite_projectile_anim';
            fireY = -100;
        } else if (player.prefix === 'default') {
            projKey = 'cs_proj_1';
            projAnim = 'default_projectile_anim';
            fireY = -60;
        }

        const p = this.projs.create(player.x + (player.flipX ? -60 : 60), player.y + fireY, projKey);
        if (p) {
            if (player.prefix === 'ignite') p.setScale(0.4);
            p.body.setAllowGravity(false).setVelocityX(player.flipX ? -800 : 800);
            if (this.anims.exists(projAnim)) p.play(projAnim);

            const target = (player === this.player1) ? this.player2 : this.player1;

            this.physics.add.overlap(p, target, (proj, vic) => {
                this.handleHit(player, vic, 5);
                proj.destroy();
            });

            this.time.delayedCall(2000, () => { if (p && p.active) p.destroy(); });
        }
    }

    // Satisfy NeoPlayer's call to onEnemyHit (it tries to call scene.onEnemyHit)
    onEnemyHit(enemy, dmg, id, kb) {
        // Redirect to handleHit if it's a player
        if (enemy === this.player1 || enemy === this.player2) {
            // Find attacker
            const attacker = (enemy === this.player1) ? this.player2 : this.player1;
            this.handleHit(attacker, enemy, dmg);
        }
    }

    handleHit(attacker, victim, dmgOverride = null) {
        if (victim.getData('invincible')) return;
        if (victim.getData('lastHit') === attacker.atkID) return;
        victim.setData('lastHit', attacker.atkID);

        const dmg = dmgOverride || 10;
        const currentHP = victim.getData('hp') || 100;
        const newHP = currentHP - dmg;
        victim.setData('hp', newHP);

        const ui = this.scene.get('UIScene');
        if (ui) ui.updateVSHP(victim === this.player1 ? 1 : 2, newHP / 100);

        victim.setTint(0xff0000);
        this.cameras.main.shake(100, 0.01);
        this.sound.play('sh');

        const kbDir = attacker.x < victim.x ? 1 : -1;
        victim.setVelocity(kbDir * 200, -200);

        victim.setData('invincible', true);
        this.tweens.add({
            targets: victim,
            alpha: 0.5,
            duration: 100,
            yoyo: true,
            repeat: 3,
            onComplete: () => {
                if (victim.active) {
                    victim.setData('invincible', false);
                    victim.setAlpha(1);
                    victim.clearTint();
                }
            }
        });

        if (newHP <= 0) {
            this.handleKO(attacker, victim);
        }
    }

    handleTimeOver() {
        const hp1 = this.player1.getData('hp') || 100;
        const hp2 = this.player2.getData('hp') || 100;

        if (hp1 > hp2) this.handleKO(this.player1, this.player2, true);
        else if (hp2 > hp1) this.handleKO(this.player2, this.player1, true);
        else {
            // Draw
            this.add.text(480, 270, 'DRAW GAME', {
                fontFamily: '"Press Start 2P"', fontSize: '40px', color: '#ffffff'
            }).setOrigin(0.5);
            this.time.delayedCall(3000, () => this.scene.start('VSCharacterSelectScene'));
        }
    }

    handleKO(winner, loser, isTimeOut = false) {
        this.player1.active = false;
        this.player2.active = false;
        this.player1.setVelocity(0, 0);
        this.player2.setVelocity(0, 0);

        if (!isTimeOut) {
            loser.setTint(0x555555);
            loser.anims.stop();
        }

        const winText = (winner === this.player1) ? 'PLAYER 1 WINS!' : 'PLAYER 2 WINS!';

        const txt = this.add.text(480, 270, winText, {
            fontFamily: '"Press Start 2P"', fontSize: '40px', color: '#ffd700', stroke: '#000', strokeThickness: 6
        }).setOrigin(0.5).setAlpha(0);

        this.tweens.add({ targets: txt, alpha: 1, duration: 500, ease: 'Power2' });

        this.time.delayedCall(3000, () => {
            this.scene.start('VSCharacterSelectScene');
        });
    }
}