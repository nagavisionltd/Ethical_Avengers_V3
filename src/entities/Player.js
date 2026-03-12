class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'p_i', 'f0');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setOrigin(0.5, 1);
        this.setCollideWorldBounds(true);
        this.setGravityY(1600);
        this.body.setSize(20, 80).setOffset(43, 26);
        this.setPushable(false);

        this.isAtk = false;
        this.queued = false;
        this.fired = false;
        this.combo = 0;
        this.atkID = 0;
        this.isHurt = false;
        this.runSpeed = 420;
        this.jumpCount = 0;

        this.cursors = scene.input.keyboard.createCursorKeys();
        this.keyZ = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        this.keyC = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);

        this.hitArea = scene.add.rectangle(0, 0, 1, 1, 0x00ff00, 0);
        scene.physics.add.existing(this.hitArea);
        this.hitArea.body.setAllowGravity(false);

        this.on('animationupdate', this.onAnimUpdate, this);
        this.on('animationcomplete', (anim) => {
            if (anim.key.startsWith('atk')) {
                this.isAtk = false;
                if (this.hitArea && this.hitArea.body) this.hitArea.body.setSize(1, 1);
                
                if (this.comboResetTimer) this.comboResetTimer.remove();
                this.comboResetTimer = this.scene.time.delayedCall(450, () => {
                    this.combo = 0;
                });
            }
            if (anim.key === 'shoot') this.stopAtk();
        });
    }

    stopAtk() {
        this.isAtk = false;
        this.combo = 0;
        this.queued = false;
        this.fired = false;
        if (this.hitArea && this.hitArea.body) this.hitArea.body.setSize(1, 1);
    }

    onAnimUpdate(anim, frame) {
        if (anim.key === 'shoot' && frame.index === 3 && !this.fired) {
            this.fired = true;
            this.scene.doFire(this);
        }
    }

    refreshHitbox() {
        if (!this.body || !this.isAtk || (this.anims.currentAnim && this.anims.currentAnim.key === 'shoot')) return;
        
        let dataIdx = this.combo - 1;
        if (this.combo === 4) dataIdx = 4; 
        
        const data = D.p.atk[dataIdx];
        if (data && data.hit && this.hitArea && this.hitArea.body) {
            const h = data.hit;
            this.hitArea.body.setSize(h.w, h.h);
            const ox = this.flipX ? -h.x - h.w : h.x;
            this.hitArea.setPosition(this.x + ox, this.y + h.y);

            const kbPower = data.kb || 0.3;
            
            this.scene.enemies.getChildren().forEach(enemy => {
                if (enemy.active && this.scene.physics.overlap(this.hitArea, enemy)) {
                    this.scene.onEnemyHit(enemy, 10, this.atkID, kbPower);
                }
            });
        }
    }

    update() {
        if (!this.body || this.isHurt) return;
        
        if (this.isAtk) {
            this.refreshHitbox();
        }

        const onG = this.body.onFloor() || this.body.touching.down || this.body.blocked.down;
        if (onG) this.jumpCount = 0;

        if (!this.isAtk) {
            if (this.cursors.down.isDown && onG) {
                this.setVelocityX(0);
                const isCrouching = this.anims.currentAnim && this.anims.currentAnim.key === 'crouch';
                const isAtEnd = isCrouching && this.anims.currentFrame.index === this.anims.currentAnim.frames.length;
                if (!isAtEnd) this.play('crouch', true);
            } else if (this.cursors.left.isDown) {
                if (this.anims.isPaused) this.anims.resume();
                this.setVelocityX(-this.runSpeed);
                this.setFlipX(true);
                if (onG) this.play('run', true);
            } else if (this.cursors.right.isDown) {
                if (this.anims.isPaused) this.anims.resume();
                this.setVelocityX(this.runSpeed);
                this.setFlipX(false);
                if (onG) this.play('run', true);
            } else {
                if (this.anims.isPaused) this.anims.resume();
                this.setVelocityX(0);
                if (onG) this.play('idle', true);
            }

            if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
                if (onG) {
                    this.setVelocityY(-850);
                    this.jumpCount = 1;
                    this.scene.sound.play('sj');
                } else if (this.jumpCount < 2) {
                    this.setVelocityY(-750);
                    this.jumpCount = 2;
                    this.scene.sound.play('sj');
                    this.setTintFill(0xffffff);
                    this.scene.time.delayedCall(50, () => this.clearTint());
                }
            }

            if (!onG) {
                this.play(Math.abs(this.body.velocity.x) > 10 ? 'jump_h' : 'jump_v', true);
            }
        } else {
            if (this.combo === 6) this.setVelocityX(this.flipX ? -350 : 350);
            else this.setVelocityX(this.body.velocity.x * 0.95);
        }

        if (Phaser.Input.Keyboard.JustDown(this.keyZ)) this.handleAtk();
        if (Phaser.Input.Keyboard.JustDown(this.keyC)) this.handleShoot();
    }

    handleAtk() {
        if (this.anims.isPaused) this.anims.resume();
        
        // Even faster cancel window (30% through animation) for snappy responses
        if (this.isAtk && this.combo < 6) {
            if (this.anims.currentFrame && this.anims.getProgress() > 0.3) {
                this.combo++;
                this.doAtk();
            }
        } else if (!this.isAtk) {
            if (this.comboResetTimer) this.comboResetTimer.remove();
            if (this.combo > 0 && this.combo < 6) this.combo++;
            else this.combo = 1;
            this.doAtk();
        }
    }

    doAtk() {
        this.isAtk = true;
        this.atkID++;
        this.play(`atk${this.combo}`);
        this.refreshHitbox();

        const duration = (this.combo === 6) ? 1200 : 1000;
        if (this.atkTimer) this.atkTimer.remove();
        this.atkTimer = this.scene.time.delayedCall(duration, () => {
            if (this.isAtk && this.anims.currentAnim && this.anims.currentAnim.key.startsWith('atk')) {
                this.isAtk = false;
            }
        });
    }

    handleShoot() {
        if (this.anims.isPaused) this.anims.resume();
        if (this.isAtk) return;
        this.isAtk = true;
        this.fired = false;
        this.atkID++;
        this.play('shoot');
        if (this.atkTimer) this.atkTimer.remove();
        this.atkTimer = this.scene.time.delayedCall(1200, () => {
            if (this.isAtk && this.anims.currentAnim && this.anims.currentAnim.key === 'shoot') {
                this.stopAtk();
            }
        });
    }
}
