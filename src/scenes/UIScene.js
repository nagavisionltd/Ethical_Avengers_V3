class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UIScene', active: false });
    }

    create(data) {
        this.isVS = data && data.isVS;
        this.startTime = Date.now();
        this.vsTime = 99; // 99 seconds for VS
        this.lastTimeTick = 0;

        // Container for all UI to easily toggle
        this.mainGroup = this.add.container(0, 0);
        this.vsGroup = this.add.container(0, 0);
        this.mobileGroup = this.add.container(0, 0);

        if (this.isVS) {
            this.createVSUI(data);
        } else {
            this.createMainUI(data);
        }

        // --- MOBILE CONTROLS ---
        // Only show if on a touch-capable mobile device
        if (this.sys.game.device.os.android || this.sys.game.device.os.iOS || this.sys.game.device.os.iPad) {
            this.createMobileControls();
        }
    }

    createMainUI(data) {
        // --- PLAYER INFO (Top Left) ---
        const bg = this.add.rectangle(20, 20, 54, 54, 0x000000).setOrigin(0).setStrokeStyle(2, 0x333333);
        this.playerThumb = this.add.image(47, 47, 'chibi_soul_thumb').setOrigin(0.5).setScale(0.8);
        this.playerName = this.add.text(84, 18, 'PLAYER', { fontFamily: '"Press Start 2P"', fontSize: '10px', fill: '#00ffaa' });

        // --- LIVES COUNTER ---
        this.livesGroup = this.add.container(84, 2);
        this.updateLivesDisplay();

        this.add.rectangle(84, 34, 254, 20, 0x000000, 0.5).setOrigin(0);
        this.playerHPBar = this.add.rectangle(86, 36, 250, 16, 0x00ffaa).setOrigin(0);

        // --- CENTER HUD ---
        const centerX = this.scale.width / 2;
        this.timeText = this.add.text(centerX - 120, 30, 'TIME: 00:00', { fontFamily: '"Press Start 2P"', fontSize: '14px', fill: '#ffffff' }).setOrigin(0.5);
        this.scoreText = this.add.text(centerX + 120, 30, 'SCORE: 000000', { fontFamily: '"Press Start 2P"', fontSize: '14px', fill: '#ffff00' }).setOrigin(0.5);
        this.comboText = this.add.text(centerX, 80, '', { fontFamily: '"Press Start 2P"', fontSize: '20px', fill: '#00ffaa', stroke: '#000000', strokeThickness: 4 }).setOrigin(0.5);

        // --- BOSS INFO ---
        this.bossContainer = this.add.container(640, 20).setAlpha(0);
        this.bossContainer.add(this.add.rectangle(0, 0, 304, 24, 0x000000, 0.5).setOrigin(0));
        this.bossHPBar = this.add.rectangle(2, 2, 300, 20, 0xff0044).setOrigin(0);
        this.bossLabel = this.add.text(0, 28, 'BOSS', { fontFamily: '"Press Start 2P"', fontSize: '10px', fill: '#ff0044' });
        this.bossContainer.add(this.bossLabel);

        this.score = 0;
        if (data && data.char) this.setPlayerInfo(data.char);

        this.mainGroup.add([bg, this.playerThumb, this.playerName, this.playerHPBar, this.timeText, this.scoreText, this.comboText, this.bossContainer]);
    }

    createVSUI(data) {
        // --- P1 INFO (Top Left) ---
        this.add.text(20, 20, 'P1', { fontFamily: '"Press Start 2P"', fontSize: '16px', fill: '#00ffaa' });
        this.add.rectangle(20, 45, 304, 24, 0x000000).setOrigin(0).setStrokeStyle(2, 0xffffff);
        this.p1VSBar = this.add.rectangle(22, 47, 300, 20, 0x00ffaa).setOrigin(0);

        // --- P2 INFO (Top Right) ---
        this.add.text(940, 20, 'P2', { fontFamily: '"Press Start 2P"', fontSize: '16px', fill: '#ff0055' }).setOrigin(1, 0);
        this.add.rectangle(636, 45, 304, 24, 0x000000).setOrigin(0).setStrokeStyle(2, 0xffffff);
        this.p2VSBar = this.add.rectangle(638, 47, 300, 20, 0xff0055).setOrigin(0);

        // --- TIMER (Center Top) ---
        this.vsTimerText = this.add.text(480, 40, '99', {
            fontFamily: '"Press Start 2P"', fontSize: '40px', fill: '#ffd700', stroke: '#000000', strokeThickness: 4
        }).setOrigin(0.5);
    }

    createMobileControls() {
        // Only show touch controls on mobile devices (or forced)
        const y = 450; // Base Y position
        const radius = 40;
        const color = 0xffffff;
        const alpha = 0.3;

        // D-PAD (Left)
        // Left
        this.createTouchBtn(80, y, 'left', 0x00ffaa);
        // Right
        this.createTouchBtn(220, y, 'right', 0x00ffaa);
        // Up (Jump) - positioned slightly higher
        this.createTouchBtn(150, y - 60, 'up', 0x00ffaa);
        // Down
        this.createTouchBtn(150, y + 60, 'down', 0x00ffaa);

        // ACTION BUTTONS (Right)
        // Attack (A)
        this.createTouchBtn(800, y + 20, 'attack', 0xff0055, 50);
        // Special/Shoot (B)
        this.createTouchBtn(880, y - 40, 'shoot', 0x00aaff, 40);
    }

    createTouchBtn(x, y, action, tint, r = 35) {
        const btn = this.add.circle(x, y, r, 0xffffff, 0.3).setInteractive();
        const icon = this.add.text(x, y, action.toUpperCase().substr(0, 1), { fontSize: '20px', color: '#000' }).setOrigin(0.5);

        btn.on('pointerdown', () => {
            btn.setAlpha(0.6);
            this.emitInput(action, true);
        });

        btn.on('pointerup', () => {
            btn.setAlpha(0.3);
            this.emitInput(action, false);
        });

        btn.on('pointerout', () => {
            btn.setAlpha(0.3);
            this.emitInput(action, false);
        });
    }

    emitInput(action, isDown) {
        // Emit global event that Player class can listen to
        this.game.events.emit('mobile-input', { action, isDown });
    }

    setPlayerInfo(key) {
        const map = {
            'default': { name: 'CHIBI SOUL', thumb: 'chibi_soul_thumb', frame: null },
            'cherry': { name: 'VERONA ROSE', thumb: 'hud_portrait_verona', frame: null },
            'adam': { name: 'LEON G', thumb: 'hud_portrait_leon', frame: null },
            'bigz': { name: 'BIG ZEEKO', thumb: 'hud_portrait_zeeko', frame: null },
            'ignite': { name: 'DR. JACK', thumb: 'hud_portrait_jack', frame: null },
            'ninja': { name: 'NAGA SOUL', thumb: 'hud_portrait_naga', frame: null },
            'cro': { name: 'CRO', thumb: 'hud_portrait_sophia', frame: null } // Using Sophia for Cro if requested, or placeholders
        };

        const info = map[key] || map['default'];

        if (this.playerName) this.playerName.setText(info.name);

        if (this.playerThumb) {
            const tKey = this.textures.exists(info.thumb) ? info.thumb : 'chibi_soul_thumb';
            this.playerThumb.setTexture(tKey, info.frame);

            // Auto-fit thumbnail into 50x50 box
            this.playerThumb.setScale(1); // Reset scale first
            const maxDim = 50;
            const s = Math.min(maxDim / this.playerThumb.width, maxDim / this.playerThumb.height);
            this.playerThumb.setScale(s);
        }

        this.startTime = Date.now();
    }

    update(time, delta) {
        if (this.isVS) {
            // VS Timer Logic
            if (this.vsTime > 0) {
                this.lastTimeTick += delta;
                if (this.lastTimeTick > 1000) {
                    this.vsTime--;
                    this.vsTimerText.setText(this.vsTime.toString());
                    this.lastTimeTick = 0;
                    if (this.vsTime === 0) {
                        // Time Over
                        this.game.events.emit('vs-time-over');
                    }
                }
            }
        } else {
            // Standard Timer Logic
            const elapsed = Date.now() - this.startTime;
            const totalSeconds = Math.floor(elapsed / 1000);
            const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
            const seconds = (totalSeconds % 60).toString().padStart(2, '0');
            if (this.timeText) this.timeText.setText(`TIME: ${minutes}:${seconds}`);
        }
    }

    updateHP(percent) {
        if (this.playerHPBar) this.playerHPBar.width = 250 * percent;
    }

    updateVSHP(playerNum, percent) {
        if (playerNum === 1 && this.p1VSBar) this.p1VSBar.width = 300 * percent;
        if (playerNum === 2 && this.p2VSBar) this.p2VSBar.width = 300 * percent;
    }

    updateLivesDisplay() {
        if (!this.livesGroup) return;
        this.livesGroup.removeAll(true);
        const lives = this.registry.get('playerLives') || 0;
        for (let i = 0; i < lives; i++) {
            // Simple heart or dot for now
            const dot = this.add.circle(i * 15, 8, 5, 0x00ffaa);
            this.livesGroup.add(dot);
        }
    }

    showBossBar(name, visible = true) {
        if (this.bossLabel) {
            this.bossLabel.setText(`BOSS: ${name.toUpperCase()}`);
            this.tweens.add({ targets: this.bossContainer, alpha: visible ? 1 : 0, duration: 500 });
        }
    }

    updateBossHP(percent) {
        if (this.bossHPBar) this.bossHPBar.width = 300 * percent;
    }

    updateScore(amount) {
        this.score += amount;
        if (this.scoreText) this.scoreText.setText(`SCORE: ${this.score.toString().padStart(6, '0')}`);
    }

    showCombo(count) {
        if (!this.comboText) return;
        if (count < 2) {
            this.comboText.setText('');
            return;
        }
        this.comboText.setText(`${count} HIT COMBO!`);
        this.comboText.setScale(1.5);
        this.tweens.add({ targets: this.comboText, scale: 1, duration: 100, ease: 'Back.easeOut' });
    }

    showPointGain() {
        const txt = this.add.text(this.scale.width / 2, 120, '+1 AUGMENT POINT', {
            fontFamily: '"Press Start 2P"', fontSize: '12px', fill: '#ffd700', stroke: '#000', strokeThickness: 2
        }).setOrigin(0.5);

        this.tweens.add({
            targets: txt,
            y: 80,
            alpha: 0,
            duration: 1500,
            onComplete: () => txt.destroy()
        });
    }
}