class NeoPlayer extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texturePrefix, customControls = null) {
        // --- SAFE START KEY ---
        let startKey;
        let startFrame = null;
        if (texturePrefix === 'bigz') {
            startKey = 'bigz_idle_sheet';
            startFrame = 0;
        } else if (texturePrefix === 'ignite') {
            startKey = 'ignite_idle_01';
        } else if (texturePrefix === 'default') {
            startKey = 'cs_idle';
        } else if (texturePrefix === 'adam') {
            startKey = 'adam_0000';
        } else if (texturePrefix === 'ninja') {
            startKey = 'cn_idle_0';
        } else if (texturePrefix === 'lordsoul') {
            startKey = 'ls_idle';
        } else {
            startKey = `${texturePrefix}_0003`;
            if (!scene.textures.exists(startKey)) startKey = `${texturePrefix}_0001`;
            if (!scene.textures.exists(startKey)) startKey = `${texturePrefix}_0000`;
        }

        if (!scene.textures.exists(startKey)) {
            startKey = 'cs_idle';
            startFrame = null;
        }

        super(scene, x, y, startKey, startFrame);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.prefix = texturePrefix;

        // --- FETCH UPGRADED STATS ---
        const charStats = scene.registry.get('charStats') || { 'default': { health: 5, speed: 5, power: 5 } };
        const myStats = charStats[this.prefix] || charStats['default'];
        
        // Global RPG Bonuses
        const rpgStats = scene.registry.get('stats') || { power: 1, speed: 1, will: 1 };
        const hpGrowth = scene.registry.get('maxHP') || 1.0;
        const atkGrowth = scene.registry.get('atkDmg') || 1.0;
        const regenGrowth = scene.registry.get('energyRegen') || 1.0;

        const healthBonus = (myStats.health - 5) * 10 + (rpgStats.will - 1) * 15;
        const speedBonus = (myStats.speed - 5) * 20 + (rpgStats.speed - 1) * 10;
        this.powerMultiplier = (1.0 + ((myStats.power - 5) * 0.1) + ((rpgStats.power - 1) * 0.15)) * atkGrowth;
        this.energyRegenRate = 1.0 * regenGrowth;

        this.maxHP = (100 + healthBonus) * hpGrowth;
        this.setData('hp', this.maxHP);
        this.setData('maxHP', this.maxHP);

        // --- CHARACTER CALIBRATION ---
        this.runSpeed = 450 + speedBonus;
        this.setOrigin(0.5, 1);

        if (this.prefix === 'adam') {
            this.runSpeed = 380 + speedBonus;
        } else if (this.prefix === 'bigz') {
            this.runSpeed = 400 + speedBonus;
        } else if (this.prefix === 'ignite') {
            this.runSpeed = 420 + speedBonus;
        } else if (this.prefix === 'default') {
            this.runSpeed = 450 + speedBonus;
        } else if (this.prefix === 'ninja') {
            this.runSpeed = 480 + speedBonus;
        } else if (this.prefix === 'lordsoul') {
            this.runSpeed = 460 + speedBonus;
        }

        if (this.prefix === 'default') this.targetDisplayHeight = 250;
        else if (this.prefix === 'lordsoul') this.targetDisplayHeight = 180;
        else {
            let fH = this.frame ? this.frame.realHeight : 500;
            if (fH <= 0) fH = 500;
            this.targetDisplayHeight = fH;
        }

        this.setCollideWorldBounds(true);
        this.setGravityY(1200);
        this.setPushable(false);
        this.setMaxVelocity(1000, 1500);

        this.isAtk = false; this.combo = 0; this.atkID = Date.now(); this.jumpCount = 0;
        this.isHovering = false;
        this.hasFired = false;
        this.lastTapTime = 0; this.lastTapKey = null; this.isDashing = false;
        this.lastGroundedTime = 0;
        this.GROUND_GRACE_MS = 100;
        this._isInitialized = false;

        if (customControls) {
            this.cursors = customControls;
            this.keyZ = customControls.attack || scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
            this.keyC = customControls.special || scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
            this.keyX = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
            this.keyV = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.V);
            this.keyE = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        } else {
            this.cursors = scene.input.keyboard.createCursorKeys();
            this.keyZ = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
            this.keyC = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
            this.keyX = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
            this.keyV = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.V);
            this.keyE = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        }
        this.keySpace = customControls?.jump || scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.mobileInput = { up: false, down: false, left: false, right: false, attack: false, shoot: false, sword: false, proj: false, special: false, jump: false };
        if (!customControls) {
            scene.game.events.on('mobile-input', (data) => { this.mobileInput[data.action] = data.isDown; });
        }

        this.hitArea = scene.add.rectangle(0, 0, 1, 1, 0x00ff00, 0);
        scene.physics.add.existing(this.hitArea);
        this.hitArea.body.setAllowGravity(false);

        this.comboData = {
            'cherry': {
                1: { activeIndex: 1, hitArea: { w: 110, h: 60, x: 40, y: -85 } },
                2: { activeIndex: 1, hitArea: { w: 110, h: 60, x: 40, y: -85 } },
                3: { activeIndex: 2, hitArea: { w: 110, h: 60, x: 40, y: -85 } },
                4: { activeIndex: 2, hitArea: { w: 130, h: 60, x: 40, y: -85 } },
                5: { activeIndex: 3, hitArea: { w: 180, h: 100, x: 40, y: -95 } }
            },
            'adam': {
                1: { activeIndex: 1, hitArea: { w: 120, h: 80, x: 60, y: -70 } },
                2: { activeIndex: 1, hitArea: { w: 120, h: 80, x: 60, y: -70 } },
                3: { activeIndex: 1, hitArea: { w: 140, h: 90, x: 70, y: -70 } },
                4: { activeIndex: 2, hitArea: { w: 160, h: 100, x: 80, y: -80 } },
                5: { activeIndex: 5, hitArea: { w: 200, h: 120, x: 100, y: -80 } }
            },
            'ignite': {
                1: { activeIndex: 4, hitArea: { w: 120, h: 100, x: 80, y: -20 } },
                2: { activeIndex: 1, hitArea: { w: 120, h: 100, x: 80, y: -20 } },
                3: { activeIndex: 4, hitArea: { w: 130, h: 110, x: 90, y: -20 } },
                4: { activeIndex: 1, hitArea: { w: 150, h: 130, x: 100, y: -20 } }
            },
            'bigz': {
                1: { activeIndex: 1, hitArea: { w: 160, h: 150, x: 120, y: -50 } },
                2: { activeIndex: 1, hitArea: { w: 160, h: 150, x: 120, y: -50 } },
                3: { activeIndex: 1, hitArea: { w: 160, h: 150, x: 120, y: -50 } },
                4: { activeIndex: 1, hitArea: { w: 160, h: 150, x: 120, y: -50 } },
                5: { activeIndex: 1, hitArea: { w: 200, h: 180, x: 140, y: -60 } },
            },
            'ninja': {
                1: { activeIndex: 2, hitArea: { w: 140, h: 120, x: 100, y: -30 } },
                2: { activeIndex: 2, hitArea: { w: 140, h: 120, x: 100, y: -30 } },
                3: { activeIndex: 2, hitArea: { w: 150, h: 130, x: 110, y: -30 } },
                4: { activeIndex: 2, hitArea: { w: 170, h: 150, x: 120, y: -40 } }
            },
            'lordsoul': {
                1: { activeIndex: 1, hitArea: { w: 120, h: 100, x: 80, y: -20 } },
                2: { activeIndex: 3, hitArea: { w: 120, h: 100, x: 80, y: -20 } },
                3: { activeIndex: 2, hitArea: { w: 130, h: 110, x: 90, y: -20 } },
                4: { activeIndex: 1, hitArea: { w: 130, h: 110, x: 90, y: -20 } },
                5: { activeIndex: 1, hitArea: { w: 140, h: 120, x: 100, y: -20 } },
                6: { activeIndex: 4, hitArea: { w: 150, h: 130, x: 110, y: -30 } },
                7: { activeIndex: 3, hitArea: { w: 150, h: 130, x: 110, y: -30 } },
                8: { activeIndex: 2, hitArea: { w: 180, h: 150, x: 120, y: -40 } },
                'jump': { activeIndex: 3, hitArea: { w: 130, h: 100, x: 90, y: 0 } }
            },
            'default': {
                1: { activeIndex: 2, hitArea: { w: 100, h: 100, x: 70, y: -20 } },
                2: { activeIndex: 2, hitArea: { w: 100, h: 100, x: 70, y: -20 } },
                3: { activeIndex: 2, hitArea: { w: 100, h: 100, x: 70, y: -20 } },
                4: { activeIndex: 2, hitArea: { w: 110, h: 100, x: 80, y: -20 } },
                5: { activeIndex: 2, hitArea: { w: 110, h: 100, x: 80, y: -20 } },
                6: { activeIndex: 2, hitArea: { w: 110, h: 100, x: 80, y: -20 } },
                7: { activeIndex: 3, hitArea: { w: 130, h: 120, x: 90, y: -20 } },
                8: { activeIndex: 2, hitArea: { w: 140, h: 120, x: 100, y: -20 } },
                9: { activeIndex: 2, hitArea: { w: 150, h: 140, x: 110, y: -30 } }
            }
        };

        this.kickData = {
            'lordsoul': {
                1: { activeIndex: 2, hitArea: { w: 140, h: 100, x: 90, y: -20 } },
                2: { activeIndex: 1, hitArea: { w: 140, h: 100, x: 90, y: -20 } },
                3: { activeIndex: 2, hitArea: { w: 180, h: 120, x: 110, y: -30 } },
                'jump': { activeIndex: 2, hitArea: { w: 150, h: 100, x: 80, y: 20 } },
                'move': { activeIndex: 1, hitArea: { w: 160, h: 100, x: 90, y: -10 } }
            }
        };

        this.swordData = {
            'lordsoul': {
                1: { activeIndex: 1, hitArea: { w: 160, h: 120, x: 100, y: -30 } },
                2: { activeIndex: 1, hitArea: { w: 160, h: 120, x: 100, y: -30 } },
                3: { activeIndex: 0, hitArea: { w: 170, h: 130, x: 110, y: -30 } },
                4: { activeIndex: 1, hitArea: { w: 200, h: 150, x: 130, y: -40 } },
                'jump': { activeIndex: 2, hitArea: { w: 180, h: 140, x: 110, y: 0 } }
            }
        };

        this.blastData = {
            'lordsoul': {
                1: { activeIndex: 2, hitArea: { w: 100, h: 80, x: 70, y: -20 } },
                2: { activeIndex: 2, hitArea: { w: 100, h: 80, x: 70, y: -20 } },
                3: { activeIndex: 4, hitArea: { w: 150, h: 120, x: 100, y: -30 } }
            }
        };

        this.airPunchData = {
            'lordsoul': {
                1: { activeIndex: 0, hitArea: { w: 100, h: 80, x: 70, y: 0 } },
                2: { activeIndex: 0, hitArea: { w: 100, h: 80, x: 70, y: 0 } },
                3: { activeIndex: 0, hitArea: { w: 120, h: 90, x: 80, y: 0 } },
                4: { activeIndex: 0, hitArea: { w: 120, h: 90, x: 80, y: 0 } },
                5: { activeIndex: 0, hitArea: { w: 150, h: 100, x: 90, y: 0 } }
            }
        };

        this.on('animationcomplete', this.handleAnimComplete, this);
        this.on('animationupdate', this.handleAnimUpdate, this);
        this.on('animationstart', this.handleAnimStart, this);

        // --- RPG LEVEL UP LISTENER ---
        this.levelUpListener = (newLevel) => {
            if (!this.active || !this.scene) return;
            
            // Level up bonuses: +20 Health, +20% Attack Power
            this.maxHP += 20;
            this.setData('maxHP', this.maxHP);
            this.setData('hp', this.maxHP); // Full heal on level up
            this.powerMultiplier += 0.2;
            
            // Safe UI access
            const ui = this.scene.scene ? this.scene.scene.get('UIScene') : null;
            if (ui && ui.updateHP) ui.updateHP(1);
            
            // Visual pop
            this.setTintFill(0x00ffff);
            this.scene.time.delayedCall(500, () => {
                if (this.active) this.clearTint();
            });
            console.log(`[NeoPlayer] Level Up! HP: ${this.maxHP}, Power: ${this.powerMultiplier.toFixed(2)}`);
        };
        
        scene.events.on('level-up', this.levelUpListener);

        this.is25D = false;
        this.baseLaneY = y;
        this.isJumping25D = false;
        this.jumpVelocityZ = 0;
        this.jumpZ = 0;
    }

    destroy(fromScene) {
        if (this.scene) {
            this.scene.events.off('level-up', this.levelUpListener);
        }
        super.destroy(fromScene);
    }

    initializeCharacter() {
        if (this._isInitialized || !this.frame || this.frame.realHeight <= 0) return;
        
        // Calculate a FIXED scale based on the first frame seen (usually idle)
        this.baseScale = this.targetDisplayHeight / this.frame.realHeight;
        this.setScale(this.baseScale);
        
        this.recalculateOffset();
        this._isInitialized = true;
    }

    enable25DMode() {
        this.is25D = true;
        this.body.setAllowGravity(false);
        this.baseLaneY = this.y;
    }

    safePlay(key, ignoreIfPlaying = false) {
        if (!this.anims) return false;
        const exists = this.scene.anims.exists(key);
        if (exists) {
            this.play(key, ignoreIfPlaying);
            return true;
        } else {
            let fallbackIdle = `${this.prefix}_idle`;
            if (!this.scene.anims.exists(fallbackIdle)) fallbackIdle = 'default_idle';
            if (key !== fallbackIdle) this.play(fallbackIdle, true);
            if (key.includes('atk') || key.includes('shoot') || key.includes('special')) this.resetControl();
            return false;
        }
    }

    resetControl(comboReset = true) {
        this.isAtk = false;
        if (comboReset) { this.combo = 0; this.comboType = null; }
        if (this.hitArea && this.hitArea.body) this.hitArea.body.enable = false;
        this.hasFired = false;
        this.inComboWindow = false;
    }

    update() {
        if (!this.body) return;
        if (!this._isInitialized) { this.initializeCharacter(); return; }
        if (!this.isAtk && this.hitArea && this.hitArea.body) this.hitArea.body.enable = false;
        if (this.is25D) { this.update25D(); return; }

        // --- GROUND CHECK ---
        const rawOnG = this.body.onFloor();
        if (rawOnG) { this.lastGroundedTime = this.scene.time.now; this.jumpCount = 0; this.isHovering = false; }
        // Use strict onFloor for animation logic to prevent "air running" during grace periods
        const animOnG = rawOnG;
        const jumpOnG = rawOnG || (this.scene.time.now - this.lastGroundedTime < this.GROUND_GRACE_MS);

        if (Math.abs(this.body.velocity.x) < 50 && (!this.dashBuffer || this.scene.time.now > this.dashBuffer)) this.isDashing = false;

        // --- INPUTS ---
        const leftDown = this.cursors.left.isDown || this.mobileInput.left;
        const rightDown = this.cursors.right.isDown || this.mobileInput.right;
        const upDown = this.cursors.up.isDown || this.mobileInput.up || this.mobileInput.jump;
        
        const jumpTrigger = Phaser.Input.Keyboard.JustDown(this.keySpace) || Phaser.Input.Keyboard.JustDown(this.cursors.up) || (this.mobileInput.jump && !this.lastJumpState);
        this.lastJumpState = this.mobileInput.jump;

        const attackPressed = Phaser.Input.Keyboard.JustDown(this.keyZ) || (this.mobileInput.attack && !this.prevMobileAttack);
        const shootPressed = Phaser.Input.Keyboard.JustDown(this.keyC) || (this.mobileInput.shoot && !this.prevMobileShoot);
        const swordPressed = Phaser.Input.Keyboard.JustDown(this.keyX) || (this.mobileInput.sword && !this.prevMobileSword);
        const projPressed = Phaser.Input.Keyboard.JustDown(this.keyV) || (this.mobileInput.proj && !this.prevMobileProj);
        const specialPressed = Phaser.Input.Keyboard.JustDown(this.keyE) || (this.mobileInput.special && !this.prevMobileSpecial);

        this.prevMobileAttack = this.mobileInput.attack; this.prevMobileShoot = this.mobileInput.shoot; this.prevMobileSword = this.mobileInput.sword; this.prevMobileProj = this.mobileInput.proj; this.prevMobileSpecial = this.mobileInput.special;

        if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) this.checkDash('left');
        if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) this.checkDash('right');

        // --- HORIZONTAL MOVEMENT (Always process inputs for velocity) ---
        if (leftDown) {
            const speed = this.isDashing ? this.runSpeed * 1.5 : this.runSpeed;
            this.setVelocityX(-speed); this.setFlipX(true);
        } else if (rightDown) {
            const speed = this.isDashing ? this.runSpeed * 1.5 : this.runSpeed;
            this.setVelocityX(speed); this.setFlipX(false);
        } else if (!this.isAtk) {
            this.setVelocityX(0);
        } else {
            // Apply friction if attacking and no input
            this.setVelocityX(this.body.velocity.x * 0.95);
        }

        // --- MAGNET EFFECT FOR ATTACKS ---
        if (this.isAtk && this.scene.applyMagnetEffect) {
            // Magnet pull toward player's impact zone
            const pullX = this.x + (this.flipX ? -80 : 80);
            this.scene.applyMagnetEffect(pullX, this.y - 100, 250, 0.15);
        }

        // --- JUMP LOGIC ---
        const canCancel = this.isAtk && this.inComboWindow;
        if (jumpTrigger) {
            if (canCancel) this.resetControl(false);
            if (jumpOnG || this.jumpCount === 0) {
                this.setVelocityY(-1000); this.jumpCount = 1; this.lastGroundedTime = 0;
            } else if (this.jumpCount < 2 && this.isMoveUnlocked('double_jump')) {
                // Additive Double Jump ("building velocity" - not too much)
                this.setVelocityY(Math.min(this.body.velocity.y, 0) - 1100); 
                this.jumpCount = 2;
            }
        }

        // --- HOVER LOGIC (Lord Soul) ---
        if (this.prefix === 'lordsoul' && !animOnG && upDown && this.jumpCount > 0 && this.body.velocity.y > -50) {
            this.setVelocityY(20); this.isHovering = true;
        } else if (this.isHovering && (!upDown || animOnG)) {
            this.isHovering = false;
        }

        // --- ANIMATION SELECTION (Only if not in attack animation) ---
        if (!this.isAtk) {
            if (animOnG) {
                // On Ground
                if (leftDown || rightDown) {
                    if (this.prefix === 'lordsoul') {
                        const absVel = Math.abs(this.body.velocity.x);
                        if (this.isDashing) {
                            if (absVel > 600) this.safePlay(`${this.prefix}_fly`, true);
                            else this.safePlay(`${this.prefix}_dash_aura`, true);
                        } else {
                            if (absVel > 300) this.safePlay(`${this.prefix}_run`, true);
                            else if (absVel > 50) this.safePlay(`${this.prefix}_walk`, true);
                            else this.safePlay(`${this.prefix}_move`, true);
                        }
                    } else {
                        this.safePlay(`${this.prefix}_run`, true);
                    }
                } else if (this.cursors.down.isDown && this.scene.anims.exists(`${this.prefix}_crouch`)) {
                    this.safePlay(`${this.prefix}_crouch`, true);
                } else {
                    this.safePlay(`${this.prefix}_idle`, true);
                }
            } else {
                // In Air
                const absVelX = Math.abs(this.body.velocity.x);
                if (this.prefix === 'lordsoul' && this.isDashing && absVelX > 50) {
                    // Flight Logic for Lord Soul (Only while Dashing)
                    if (absVelX > 600) this.safePlay(`${this.prefix}_fly`, true);
                    else this.safePlay(`${this.prefix}_dash_aura`, true);
                } else if (this.isHovering) {
                    this.safePlay(`${this.prefix}_hover`, true);
                } else if (this.body.velocity.y < -10) {
                    // Rising
                    const isMovingX = absVelX > 50;
                    if (isMovingX && this.scene.anims.exists(`${this.prefix}_jump_forward`)) {
                        this.safePlay(`${this.prefix}_jump_forward`, true);
                    } else {
                        this.safePlay(`${this.prefix}_jump`, true);
                    }
                } else {
                    // Falling / Peak
                    this.safePlay(`${this.prefix}_fall`, true);
                }
            }
        }

        if (!animOnG && this.body.velocity.y > 1200) this.body.setVelocityY(1200);

        // --- ATTACK TRIGGERS ---
        if (attackPressed) { if (!animOnG && Math.abs(this.body.velocity.y) > 50) this.doAirAttack(); else this.doAttack(); }
        if (shootPressed) this.doKick();
        if (swordPressed) this.doSword();
        if (projPressed) this.doProjectileCombo();
        if (specialPressed) this.doBeamAttack();
    }

    update25D() {
        const leftDown = this.cursors.left.isDown || this.mobileInput.left, rightDown = this.cursors.right.isDown || this.mobileInput.right;
        const upDown = this.cursors.up.isDown || this.mobileInput.up, downDown = this.cursors.down.isDown || this.mobileInput.down;
        const attackPressed = Phaser.Input.Keyboard.JustDown(this.keyZ) || (this.mobileInput.attack && !this.prevMobileAttack);
        const jumpPressed = Phaser.Input.Keyboard.JustDown(this.keySpace) || (this.mobileInput.jump && !this.prevMobileJump);
        this.prevMobileAttack = this.mobileInput.attack; this.prevMobileJump = this.mobileInput.jump;

        if (!this.isAtk) {
            if (leftDown) { this.setVelocityX(-this.runSpeed); this.setFlipX(true); } else if (rightDown) { this.setVelocityX(this.runSpeed); this.setFlipX(false); } else this.setVelocityX(0);
            if (!this.isJumping25D) {
                if (upDown) this.setVelocityY(-this.runSpeed * 0.7); else if (downDown) this.setVelocityY(this.runSpeed * 0.7); else this.setVelocityY(0);
                this.baseLaneY = this.y;
            } else this.setVelocityY(0);
            if (jumpPressed && !this.isJumping25D) { this.isJumping25D = true; this.jumpVelocityZ = -12; this.jumpZ = 0; this.safePlay(`${this.prefix}_jump`, true); }
            if (this.isJumping25D) {
                this.jumpZ += this.jumpVelocityZ; this.jumpVelocityZ += 0.6; this.y = this.baseLaneY + this.jumpZ;
                if (this.jumpZ >= 0) {
                    this.jumpZ = 0;
                    this.y = this.baseLaneY;
                    this.isJumping25D = false;
                }
            }
            if (!this.isJumping25D) {
                if (leftDown || rightDown || upDown || downDown) this.safePlay(`${this.prefix}_run`, true); else this.safePlay(`${this.prefix}_idle`, true);
            }
            if (attackPressed) this.doAttack();
        } else {
            this.setVelocityX(this.body.velocity.x * 0.9); this.setVelocityY(this.body.velocity.y * 0.9); this.y = this.baseLaneY + this.jumpZ;
            if (this.isJumping25D) {
                this.jumpZ += this.jumpVelocityZ; this.jumpVelocityZ += 0.6;
                if (this.jumpZ >= 0) { this.jumpZ = 0; this.y = this.baseLaneY; this.isJumping25D = false; }
            }
        }
    }

    isMoveUnlocked(moveKey) {
        // Unlock all moves for testing as requested
        return true;
    }

    showLockedFeedback(moveName) {
        if (this._lastLockNotify && this.scene.time.now - this._lastLockNotify < 2000) return;
        if (this.scene.rpg && this.scene.rpg.showFloatingText) {
            this.scene.rpg.showFloatingText(`${moveName} LOCKED`, this.x, this.y - 100, '#ff0000');
        }
    }

    doKick() {
        if (!this.isMoveUnlocked('c_kick_combo')) { this.showLockedFeedback('KICK COMBO'); return; }
        
        // Free-Flow Logic: Allow switching to Kick from other attacks during cancel window
        if (this.isAtk) {
            if (this.comboType === 'kick') {
                if (this.combo < 3) this.comboBuffered = true;
                return;
            } else if (this.inComboWindow) {
                // Cancel current non-kick attack into a kick
                this.resetControl(true); // Reset combo counter for new chain
            } else {
                return; // Locked in non-cancelable frames
            }
        }
        
        if (this.comboResetTimer) { this.comboResetTimer.remove(); this.comboResetTimer = null; }
        
        const onG = this.body.onFloor() || (this.scene.time.now - this.lastGroundedTime < this.GROUND_GRACE_MS);
        
        if (this.prefix === 'lordsoul') {
            if (!onG) {
                this.isAtk = true; this.atkID++; this.comboType = 'kick'; this.combo = 'jump';
                this.currentKB = 1.5; this.currentDmg = 15 * this.powerMultiplier;
                this.safePlay(`${this.prefix}_jump_kick`);
                this.scene.time.delayedCall(800, () => this.resetControl());
                return;
            }
            // Check for movement kick (Dash attack: forward forward + kick)
            if (this.isDashing) {
                this.isAtk = true; this.atkID++; this.comboType = 'kick'; this.combo = 'move';
                this.currentKB = 2.0; this.currentDmg = 18 * this.powerMultiplier;
                this.safePlay(`${this.prefix}_mkick`);
                this.scene.time.delayedCall(600, () => this.resetControl());
                return;
            }
        }

        this.isAtk = true; this.atkID++; this.comboType = 'kick';
        if (this.safetyTimer) this.safetyTimer.remove();
        this.safetyTimer = this.scene.time.delayedCall(1000, () => this.resetControl(false));
        let maxKick = 1; while (this.scene.anims.exists(`${this.prefix}_kick${maxKick + 1}`)) maxKick++;
        this.combo = (this.combo % maxKick) + 1;
        this.currentKB = 0.8 * this.combo; this.currentDmg = 12 * this.powerMultiplier;
        this.safePlay(`${this.prefix}_kick${this.combo}`); this.setVelocityX(0);
    }

    doSword() {
        if (!this.isMoveUnlocked('x_sword_combo')) { this.showLockedFeedback('SWORD COMBO'); return; }
        
        // Free-Flow Logic
        if (this.isAtk) { 
            if (this.comboType === 'sword') {
                if (this.combo < 4) this.comboBuffered = true; 
                return; 
            } else if (this.inComboWindow) {
                this.resetControl(true);
            } else {
                return;
            }
        }
        
        if (this.comboResetTimer) { this.comboResetTimer.remove(); this.comboResetTimer = null; }

        const onG = this.body.onFloor() || (this.scene.time.now - this.lastGroundedTime < this.GROUND_GRACE_MS);
        if (!onG && this.prefix === 'lordsoul') {
            this.isAtk = true; this.atkID++; this.comboType = 'sword'; this.combo = 'jump';
            this.currentKB = 1.8; this.currentDmg = 20 * this.powerMultiplier;
            this.safePlay(`${this.prefix}_jump_sword`);
            this.scene.time.delayedCall(800, () => this.resetControl());
            return;
        }

        this.isAtk = true; this.atkID++; this.comboType = 'sword';
        if (this.safetyTimer) this.safetyTimer.remove();
        this.safetyTimer = this.scene.time.delayedCall(1000, () => this.resetControl(false));
        let maxSword = 1; while (this.scene.anims.exists(`${this.prefix}_sw${maxSword + 1}`)) maxSword++;
        this.combo = (this.combo % maxSword) + 1;
        this.currentKB = 2.0 * this.combo; this.currentDmg = 15 * this.powerMultiplier;
        this.safePlay(`${this.prefix}_sw${this.combo}`); this.setVelocityX(0);
    }

    doProjectileCombo() {
        if (!this.isMoveUnlocked('v_blast_1')) { this.showLockedFeedback('V-BLAST'); return; }
        if (this.isAtk) { if (this.comboType === 'blast' && this.combo < 2) this.comboBuffered = true; return; }
        if (this.comboResetTimer) { this.comboResetTimer.remove(); this.comboResetTimer = null; }
        this.isAtk = true; this.atkID++; this.comboType = 'blast';
        if (this.safetyTimer) this.safetyTimer.remove();
        this.safetyTimer = this.scene.time.delayedCall(1200, () => this.resetControl(false));
        let maxBlast = 2; 
        if (this.combo === 1 && !this.isMoveUnlocked('v_blast_2')) { this.resetControl(); return; }
        this.combo = (this.combo % maxBlast) + 1;
        this.currentKB = 0.5; this.currentDmg = 8 * this.powerMultiplier;
        this.safePlay(`${this.prefix}_blast${this.combo}`); this.setVelocityX(0);
    }

    doBeamAttack() {
        if (!this.isMoveUnlocked('e_beam')) { this.showLockedFeedback('E-BEAM'); return; }
        if (this.isAtk) return;
        if (this.comboResetTimer) { this.comboResetTimer.remove(); this.comboResetTimer = null; }
        
        const onG = this.body.onFloor() || (this.scene.time.now - this.lastGroundedTime < this.GROUND_GRACE_MS);
        
        this.isAtk = true; this.atkID++; this.comboType = 'beam';
        if (this.safetyTimer) this.safetyTimer.remove();
        this.safetyTimer = this.scene.time.delayedCall(1200, () => this.resetControl(false));
        this.currentKB = 2.5; this.currentDmg = 40 * this.powerMultiplier;
        
        if (!onG && this.prefix === 'lordsoul') {
            this.safePlay(`${this.prefix}_bigbeam`);
            // Continuous magnet pull during air beam
            const pull = this.scene.time.addEvent({
                delay: 50, repeat: 10, callback: () => {
                    if (this.scene.applyMagnetEffect) this.scene.applyMagnetEffect(this.x + (this.flipX ? -200 : 200), this.y, 400, 0.1);
                }
            });
        } else {
            this.safePlay(`${this.prefix}_blast3`);
            this.setVelocityX(0);
            // Magnet pull for ground beam
            if (this.prefix === 'lordsoul') {
                this.scene.time.delayedCall(200, () => {
                   if (this.scene.applyMagnetEffect) this.scene.applyMagnetEffect(this.x + (this.flipX ? -200 : 200), this.y, 400, 0.2);
                });
            }
        }
    }

    doAirAttack() {
        if (this.isAtk) {
             // Allow chaining if in cancel window for the *same* move type (Air Punch)
             if (this.inComboWindow && this.prefix === 'lordsoul' && this.comboType === 'air_punch' && this.combo < 5) {
                 this.comboBuffered = true;
             }
             return;
        }

        this.isAtk = true; this.atkID++;
        
        if (this.prefix === 'lordsoul') {
            if (this.comboResetTimer) { this.comboResetTimer.remove(); this.comboResetTimer = null; }
            
            this.comboType = 'air_punch';
            let maxAirCombo = 3; // Reduced to 3 hits
            
            // Increment combo only if not buffered
            if (!this.comboBuffered) this.combo = 0; 
            this.combo = (this.combo % maxAirCombo) + 1;

            this.currentKB = 1.2; 
            this.currentDmg = 15 * this.powerMultiplier;
            
            this.safePlay(`${this.prefix}_jump_atk${this.combo}`);
            
            if (this.safetyTimer) this.safetyTimer.remove();
            this.safetyTimer = this.scene.time.delayedCall(800, () => this.resetControl(false));
        } else {
            this.combo = 0;
            this.currentKB = 0.8; this.currentDmg = 10 * this.powerMultiplier; this.safePlay(`${this.prefix}_atk1`);
            this.scene.time.delayedCall(800, () => this.resetControl());
        }
    }

    doAttack() {
        if (this.isAtk) { 
            // If already punching/attacking with Z
            if (this.comboType === null || this.comboType === 'punch') {
                if (this.inComboWindow) this.comboBuffered = true; 
                return;
            } else if (this.inComboWindow) {
                // Switching from Kick/Sword back to Punch
                this.resetControl(true);
            } else {
                return;
            }
        }
        
        if (this.comboResetTimer) { this.comboResetTimer.remove(); this.comboResetTimer = null; }
        this.isAtk = true; this.atkID++; this.comboBuffered = false;
        this.comboType = 'punch'; // Explicitly set type
        
        if (this.safetyTimer) this.safetyTimer.remove();
        this.safetyTimer = this.scene.time.delayedCall(600, () => this.resetControl(false));
        let maxCombo = 1; while (this.scene.anims.exists(`${this.prefix}_atk${maxCombo + 1}`)) maxCombo++;
        if (this.combo >= 3 && !this.isMoveUnlocked('full_z_combo')) { this.combo = 0; }
        this.inComboWindow = false;
        this.damageMult = 1.0;
        if (this.activeFrameEndTime && this.scene.time.now - this.activeFrameEndTime < 100) {
            this.damageMult = 1.25; this.setTintFill(0xffffff); this.scene.time.delayedCall(50, () => this.clearTint()); this.activeFrameEndTime = 0;
        }
        this.combo = (this.combo % maxCombo) + 1;
        if (this.prefix === 'adam') {
            if (this.combo === 5) { this.currentKB = 3.5; this.setVelocityX(this.flipX ? -350 : 350); }
            else if (this.combo === 4) { this.currentKB = 1.8; this.setVelocityX(this.flipX ? -150 : 150); }
            else this.currentKB = 0.4;
        } else {
            if (this.combo === maxCombo) { this.currentKB = 2.5; this.setVelocityX(this.flipX ? -200 : 200); }
            else this.currentKB = 0.1 * this.combo;
        }
        this.currentDmg = 10 * this.powerMultiplier * this.damageMult;
        this.safePlay(`${this.prefix}_atk${this.combo}`);
    }

    handleAnimComplete(anim) {
        if (anim.key.includes('atk') || anim.key.includes('shoot') || anim.key.includes('special') ||
            anim.key.includes('kick') || anim.key.includes('sw') || anim.key.includes('blast')) {
            if (this.safetyTimer) { this.safetyTimer.remove(); this.safetyTimer = null; }
            if (this.hitArea && this.hitArea.body) this.hitArea.body.enable = false;
            this.resetControl(false);
            if (this.comboBuffered) {
                this.comboBuffered = false;
                if (anim.key.includes('atk')) {
                    // Check if it was an air attack
                    if (this.comboType === 'air_punch') this.doAirAttack();
                    else this.doAttack();
                }
                else if (anim.key.includes('kick')) this.doKick();
                else if (anim.key.includes('sw')) this.doSword();
                else if (anim.key.includes('blast')) this.doProjectileCombo();
                return;
            }
            this.comboBuffered = false; this.inComboWindow = false;
            let comboWindow = 250; if (this.prefix === 'lordsoul') comboWindow = 280;
            this.comboResetTimer = this.scene.time.delayedCall(comboWindow, () => { this.combo = 0; this.comboType = null; this.comboResetTimer = null; });
        }
    }

    handleAnimStart(anim, frame) { this.handleAnimUpdate(anim, frame); }

    recalculateOffset() {
        if (!this.frame || this.frame.realHeight <= 0 || !this.body || !this.baseScale) return;
        
        // DYNAMIC SCALE for Lord Soul: Normalize inconsistent frame heights
        if (this.prefix === 'lordsoul') {
            const dynamicScale = this.targetDisplayHeight / this.frame.realHeight;
            this.setScale(dynamicScale);
        } else {
            // Keep others fixed
            this.setScale(this.baseScale);
        }
        
        const bodyWidth = 30, bodyHeight = 70;
        const unscaledW = bodyWidth / this.baseScale, unscaledH = bodyHeight / this.baseScale;
        
        // Standardize the body size relative to the current texture frame
        this.body.setSize(unscaledW, unscaledH, false);
        
        // Dynamic Offset: This keeps the feet locked to the bottom of the image.
        const offsetX = (this.frame.realWidth - unscaledW) / 2;
        const offsetY = this.frame.realHeight - unscaledH;
        this.body.setOffset(offsetX, offsetY);
    }

    handleAnimUpdate(anim, frame) {
        // Recalculate offset every frame to handle inconsistent image sizes and padding
        this.recalculateOffset();

        if ((anim.key.includes('shoot') || anim.key.includes('blast') || anim.key.includes('jump_atk')) && !this.hasFired) {
            let fireFrame = 2;
            if (this.prefix === 'lordsoul') {
                if (anim.key.includes('blast3')) fireFrame = 5;
                else if (anim.key.includes('blast1')) fireFrame = 2;
                else if (anim.key.includes('blast2')) fireFrame = 2;
                else if (anim.key.includes('jump_atk')) fireFrame = 4;
            }
            if (frame.index >= fireFrame) { this.hasFired = true; if (this.scene.doFire) this.scene.doFire(this); }
        }
        if (!this.isAtk || !this.hitArea || !this.hitArea.body) return;
        let hitConfig = null;
        if (anim.key.includes('kick')) hitConfig = this.kickData[this.prefix]?.[this.combo];
        else if (anim.key.includes('sw')) hitConfig = this.swordData[this.prefix]?.[this.combo];
        else if (anim.key.includes('blast')) hitConfig = this.blastData[this.prefix]?.[this.combo];
        else if (this.comboType === 'air_punch') hitConfig = this.airPunchData[this.prefix]?.[this.combo];
        else hitConfig = this.comboData[this.prefix]?.[this.combo];

        const activeIndex = hitConfig ? hitConfig.activeIndex : 1;
        if (frame.index >= activeIndex) this.inComboWindow = true;
        if (frame.index === activeIndex) {
            this.hitArea.body.enable = true;
            const reach = hitConfig ? hitConfig.hitArea.x : 80, w = hitConfig ? hitConfig.hitArea.w : 100, h = hitConfig ? hitConfig.hitArea.h : 100, offY = hitConfig ? hitConfig.hitArea.y : -20;
            const offX = this.flipX ? -reach : reach;
            this.hitArea.setPosition(this.x + offX, this.y + offY); this.hitArea.body.setSize(w, h);
        } else if (frame.index > activeIndex) {
            if (this.hitArea.body.enable) { this.hitArea.body.enable = false; this.activeFrameEndTime = this.scene.time.now; }
        }
    }

    checkDash(dir) {
        const now = this.scene.time.now;
        if (this.lastTapKey === dir && now - this.lastTapTime < 300) { this.isDashing = true; this.dashBuffer = now + 400; }
        this.lastTapTime = now; this.lastTapKey = dir;
    }
}