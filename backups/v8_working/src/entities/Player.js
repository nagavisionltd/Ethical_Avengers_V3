class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'p_i', 'f0');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setOrigin(0.5, 1);
        this.setCollideWorldBounds(true);
        this.setGravityY(1600);
        this.body.setSize(40, 80).setOffset(33, 26);

        this.isAtk = false;
        this.queued = false;
        this.fired = false;
        this.combo = 0;
        this.atkID = 0;

        // Input setup
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.keyZ = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        this.keyC = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);

        // Hitbox setup
        this.hitArea = scene.add.rectangle(0, 0, 1, 1, 0x00ff00, 0);
        scene.physics.add.existing(this.hitArea);
        this.hitArea.body.setAllowGravity(false);

        // Animation Events
        this.on('animationupdate', this.onAnimUpdate, this);
        
        this.on('animationcomplete', (anim) => {
            if (anim.key.startsWith('atk')) {
                if (this.queued && this.combo < 6) {
                    this.combo++;
                    this.doAtk();
                } else {
                    this.stopAtk();
                }
            }
            if (anim.key === 'shoot') {
                this.stopAtk();
            }
        });
    }

    stopAtk() {
        this.isAtk = false;
        this.combo = 0;
        this.queued = false;
        this.hitArea.body.setSize(1, 1);
    }

    onAnimUpdate(anim, frame) {
        this.hitArea.body.setSize(1, 1);
        if (anim.key.startsWith('atk')) {
            // Correctly identify the frame index from the texture frame name (e.g., 'f3')
            const frameName = frame.textureFrame;
            const idx = parseInt(frameName.replace('f', ''));
            const data = D.p.atk[idx];
            if (data && data.hit) {
                const h = data.hit;
                this.hitArea.body.setSize(h.w, h.h);
                const ox = this.flipX ? -h.x - h.w : h.x;
                this.hitArea.setPosition(this.x + ox, this.y + h.y);
            }
        }
        if (anim.key === 'shoot' && frame.index === 3 && !this.fired) {
            this.fired = true;
            this.scene.doFire(this);
        }
    }

    update() {
        if (!this.body) return;
        const onG = this.body.onFloor() || this.body.touching.down || this.body.blocked.down;

        if (!this.isAtk) {
            if (this.cursors.left.isDown) {
                this.setVelocityX(-350);
                this.setFlipX(true);
                if (onG) this.play('run', true);
            } else if (this.cursors.right.isDown) {
                this.setVelocityX(350);
                this.setFlipX(false);
                if (onG) this.play('run', true);
            } else if (this.cursors.down.isDown && onG) {
                this.setVelocityX(0);
                this.play('crouch', true);
            } else {
                this.setVelocityX(0);
                if (onG) this.play('idle', true);
            }

            if (this.cursors.up.isDown && onG) {
                this.setVelocityY(-850);
            }

            if (!onG) {
                this.play(Math.abs(this.body.velocity.x) > 10 ? 'jump_h' : 'jump_v', true);
            }
        } else {
            this.setVelocityX(this.body.velocity.x * 0.95);
        }

        if (Phaser.Input.Keyboard.JustDown(this.keyZ)) this.handleAtk();
        if (Phaser.Input.Keyboard.JustDown(this.keyC)) this.handleShoot();
    }

    handleAtk() {
        if (!this.isAtk) {
            this.combo = 1;
            this.doAtk();
        } else if (this.anims.currentAnim && this.anims.currentAnim.key.startsWith('atk')) {
            this.queued = true;
        }
    }

    doAtk() {
        this.isAtk = true;
        this.queued = false;
        this.play(`atk${this.combo}`);
        this.atkID++;
        
        if (this.atkTimer) this.atkTimer.remove();
        this.atkTimer = this.scene.time.delayedCall(1000, () => {
            if (this.isAtk && this.anims.currentAnim && this.anims.currentAnim.key.startsWith('atk')) {
                this.stopAtk();
            }
        });
    }

    handleShoot() {
        if (this.isAtk) return;
        this.isAtk = true;
        this.fired = false;
        this.play('shoot');
        
        if (this.atkTimer) this.atkTimer.remove();
        this.atkTimer = this.scene.time.delayedCall(1200, () => {
            if (this.isAtk && this.anims.currentAnim && this.anims.currentAnim.key === 'shoot') {
                this.stopAtk();
            }
        });
    }
}
