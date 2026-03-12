class NeoPlayer extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texturePrefix, customControls = null) {
        // --- SAFE START KEY ---
        // Determine correct starting texture and frame based on character type
        let startKey;
        let startFrame = null;
        if (texturePrefix === 'bigz') {
            startKey = 'bigz_idle_sheet';
            startFrame = 0;
        } else if (texturePrefix === 'ignite') {
            startKey = 'ignite_idle_01';
        } else if (texturePrefix === 'default') {
            startKey = 'cs_idle'; // Chibi Soul
        } else if (texturePrefix === 'adam') {
            startKey = 'adam_0000';
        } else if (texturePrefix === 'ninja') {
            startKey = 'cn_idle_0';
        } else { // Fallback for cherry
            startKey = `${texturePrefix}_0003`; // Many Cherry animations start at 0003
            if (!scene.textures.exists(startKey)) startKey = `${texturePrefix}_0001`;
            if (!scene.textures.exists(startKey)) startKey = `${texturePrefix}_0000`;
        }

        // Final fallback if the intended texture is missing
        if (!scene.textures.exists(startKey)) {
            console.error(`Texture ${startKey} not found! Defaulting to cs_idle.`);
            startKey = 'cs_idle';
            startFrame = null;
        }

        super(scene, x, y, startKey, startFrame);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.prefix = texturePrefix;

        // --- FETCH UPGRADED STATS ---
        // Defaults to 1.0 multiplier for all stats if not in registry
        const hpMult = scene.registry.get('maxHP') || 1.0;
        const atkMult = scene.registry.get('atkDmg') || 1.0;
        const regenMult = scene.registry.get('energyRegen') || 1.0;

        // Base character stats from registry (set in CharacterSelect or similar)
        const charStats = scene.registry.get('charStats') || { 'default': { health: 5, speed: 5, power: 5 } };
        const myStats = charStats[this.prefix] || charStats['default'];

        const healthBonus = (myStats.health - 5) * 10;
        const speedBonus = (myStats.speed - 5) * 20;
        this.powerMultiplier = (1.0 + ((myStats.power - 5) * 0.1)) * atkMult;
        this.energyRegenRate = 1.0 * regenMult;

        this.maxHP = (100 + healthBonus) * hpMult;
        this.setData('hp', this.maxHP);
        this.setData('maxHP', this.maxHP);

        // --- CHARACTER CALIBRATION ---
        this.runSpeed = 450 + speedBonus; // Default
        if (this.prefix === 'adam') {
            this.setScale(0.35); this.setOrigin(0.5, 0.95);
            this.runSpeed = 380 + speedBonus;
        } else if (this.prefix === 'bigz') {
            this.setScale(0.7); this.setOrigin(0.5, 0.95);
            this.runSpeed = 400 + speedBonus;
        } else if (this.prefix === 'ignite') {
            this.setScale(0.35); this.setOrigin(0.5, 0.95);
            this.runSpeed = 420 + speedBonus;
        } else if (this.prefix === 'default') { // Chibi Soul (idle: 85x183, run: 238x402)
            this.setScale(0.45); this.setOrigin(0.5, 1);
            this.runSpeed = 450 + speedBonus;
        } else if (this.prefix === 'ninja') { // Neon Ninja (Cyborg Ninja)
            this.setScale(1.2); this.setOrigin(0.5, 0.95);
            this.runSpeed = 480 + speedBonus;
        } else { // Cherry and others
            this.setScale(0.35); this.setOrigin(0.5, 0.95);
        }

        // Lock the display height so character size never changes even if frames have different bounds
        let fH = this.frame ? this.frame.realHeight : 0;

        if (this.prefix === 'default') {
            // Chibi Soul custom height - he is small, but 1.0 scale of his assets looks right natively
            this.targetDisplayHeight = 250 * this.scaleY; // Force a consistent visual height for chibi
        } else {
            if (fH <= 0) fH = 500;
            this.targetDisplayHeight = fH * this.scaleY;
        }

        this.setCollideWorldBounds(true);
        this.setGravityY(0); // World gravity (1600) is enough — extra gravity causes tunneling!
        this.setPushable(false);
        // At 120fps (fixedStep), 700px/s = 5.8px per step → safely within any 32px+ collision box
        this.setMaxVelocity(1000, 700);

        // --- STATE & TIMERS ---
        this.isAtk = false; this.combo = 0; this.atkID = 0; this.jumpCount = 0;
        this.hasFired = false; this.canHover = false; this.hoverTime = 0; this.maxHoverTime = 2000;
        this.lastTapTime = 0; this.lastTapKey = null; this.isDashing = false;

        // --- GROUNDED GRACE (Coyote Time for Animations) ---
        // Prevents idle/jump flicker caused by onFloor() jittering at 120fps
        this.lastGroundedTime = 0;
        this.GROUND_GRACE_MS = 100; // 100ms grace window

        // --- CONTROLS SETUP ---
        if (customControls) {
            this.cursors = customControls;
            this.keyZ = customControls.attack || scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
            this.keyC = customControls.special || scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
        } else {
            this.cursors = scene.input.keyboard.createCursorKeys();
            this.keyZ = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
            this.keyC = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
        }
        this.keySpace = customControls?.jump || scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.mobileInput = { up: false, down: false, left: false, right: false, attack: false, shoot: false };
        if (!customControls) {
            scene.game.events.on('mobile-input', (data) => { this.mobileInput[data.action] = data.isDown; });
        }

        // --- HITBOX ---
        this.hitArea = scene.add.rectangle(0, 0, 1, 1, 0x00ff00, 0);
        scene.physics.add.existing(this.hitArea);
        this.hitArea.body.setAllowGravity(false);

        // --- NEW COMBO FRAME DATA (Ignite Odyssey Style) ---
        // Defines exactly which animation frame triggers the hitbox, dimensions, and when the combo inputs open
        this.comboData = {
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
            'default': { // Chibi Soul
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

        this.on('animationcomplete', this.handleAnimComplete, this);
        this.on('animationupdate', this.handleAnimUpdate, this);
        this.on('animationstart', this.handleAnimStart, this);

        // 2.5D State
        this.is25D = false;
        this.baseLaneY = y;
        this.isJumping25D = false;
        this.jumpVelocityZ = 0;
        this.jumpZ = 0;
    }

    enable25DMode() {
        this.is25D = true;
        this.body.setAllowGravity(false);
        this.baseLaneY = this.y;
    }

    // --- UTILITY ---
    safePlay(key, ignoreIfPlaying = false) {
        if (!this.anims) return false;

        const exists = this.scene.anims.exists(key);
        console.log(`[NeoPlayer] Play Request: ${key} (Exists: ${exists}, Ignore if playing: ${ignoreIfPlaying})`);

        if (exists) {
            this.play(key, ignoreIfPlaying);
            return true;
        } else {
            console.warn(`[NeoPlayer] Animation ${key} NOT FOUND in Global Manager.`);

            // Fallback to prevent getting stuck
            let fallbackIdle = `${this.prefix}_idle`;
            if (!this.scene.anims.exists(fallbackIdle)) {
                fallbackIdle = 'default_idle';
            }

            if (key !== fallbackIdle && this.scene.anims.exists(fallbackIdle)) {
                console.log(`[NeoPlayer] Falling back to: ${fallbackIdle}`);
                this.play(fallbackIdle, true);
            }

            // If we were trying to attack but the animation is missing, reset state immediately
            if (key.includes('atk') || key.includes('shoot') || key.includes('special')) {
                this.resetControl();
            }
            return false;
        }
    }

    resetControl(comboReset = true) {
        this.isAtk = false;
        if (comboReset) this.combo = 0;
        // Disable hitbox
        if (this.hitArea && this.hitArea.body) {
            this.hitArea.body.enable = false;
        }
        console.log(`Control Reset for ${this.prefix}. Combo: ${this.combo}`);
    }

    update() {
        if (!this.body) return;

        // --- NORMALIZATION FOR AI FRAMES ---
        // Keeps visual size and physics body constant even if frame dimensions vary wildly
        if (this.frame && this.targetDisplayHeight && this.frame.realHeight > 0) {
            const currentFrameName = this.frame.name;

            if (this._lastFrameName !== currentFrameName) {
                this._lastFrameName = currentFrameName;

                // Always update scale and offset to ensure sprite aligns, but snap Y to preserve floor touching
                const newScale = this.targetDisplayHeight / this.frame.realHeight;
                this.setScale(newScale);

                // Universal world-space body dimensions (standardized to fit perfectly on floor)
                const worldBodyWidth = 40;
                const worldBodyHeight = 85;

                const unscaledW = worldBodyWidth / newScale;
                const unscaledH = worldBodyHeight / newScale;

                // Perfectly align bottom of body to the sprite's anchor feet (originY)
                let offsetX = (this.frame.realWidth / 2) - (unscaledW / 2);
                let offsetY = (this.frame.realHeight * this.originY) - unscaledH;

                // Minor visual tweak for Chibi Soul's forward frame specifically if there's dead space
                if (this.prefix === 'default' && this.frame.name === 'cs_forward') {
                    offsetY -= (15 / newScale); // Shift hitbox down slightly to compensate for hover gap
                }

                this.body.setSize(unscaledW, unscaledH, false);
                this.body.setOffset(offsetX, offsetY);
            }
        }

        // Optimization: Disable hitbox instead of moving it far away
        if (!this.isAtk && this.hitArea && this.hitArea.body) {
            this.hitArea.body.enable = false;
        }

        if (this.is25D) {
            this.update25D();
            return;
        }

        const rawOnG = this.body.onFloor();
        if (rawOnG) {
            this.lastGroundedTime = this.scene.time.now;
            this.jumpCount = 0;
        }
        // Use grace period for ANIMATION decisions (not physics) to prevent idle/jump flicker
        const onG = rawOnG || (this.scene.time.now - this.lastGroundedTime < this.GROUND_GRACE_MS);

        if (Math.abs(this.body.velocity.x) < 50 && (!this.dashBuffer || this.scene.time.now > this.dashBuffer)) {
            this.isDashing = false;
        }

        const leftDown = this.cursors.left.isDown || this.mobileInput.left;
        const rightDown = this.cursors.right.isDown || this.mobileInput.right;
        const upDown = this.cursors.up.isDown || this.mobileInput.up;
        const attackPressed = Phaser.Input.Keyboard.JustDown(this.keyZ) || (this.mobileInput.attack && !this.prevMobileAttack);
        const shootPressed = Phaser.Input.Keyboard.JustDown(this.keyC) || (this.mobileInput.shoot && !this.prevMobileShoot);

        this.prevMobileAttack = this.mobileInput.attack;
        this.prevMobileShoot = this.mobileInput.shoot;

        if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) this.checkDash('left');
        if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) this.checkDash('right');

        if (!this.isAtk) {
            if (leftDown) {
                const speed = this.isDashing ? this.runSpeed * 1.5 : this.runSpeed;
                this.setVelocityX(-speed);
                this.setFlipX(true);
                if (onG || this.body.velocity.y >= -10) this.safePlay(`${this.prefix}_run`, true);
                else if (!this.canHover && this.scene.anims.exists(`${this.prefix}_jump_forward`)) this.safePlay(`${this.prefix}_jump_forward`, true);
            } else if (rightDown) {
                const speed = this.isDashing ? this.runSpeed * 1.5 : this.runSpeed;
                this.setVelocityX(speed);
                this.setFlipX(false);
                if (onG || this.body.velocity.y >= -10) this.safePlay(`${this.prefix}_run`, true);
                else if (!this.canHover && this.scene.anims.exists(`${this.prefix}_jump_forward`)) this.safePlay(`${this.prefix}_jump_forward`, true);
            } else if (this.cursors.down.isDown && onG && this.scene.anims.exists(`${this.prefix}_crouch`)) {
                // Crouch mechanic (Cherry and any character with crouch anim)
                this.setVelocityX(0);
                this.safePlay(`${this.prefix}_crouch`, true);
            } else {
                this.setVelocityX(0);
                if (onG) {
                    this.safePlay(`${this.prefix}_idle`, true);
                } else if (!this.canHover) {
                    // Only play jump if actually moving upwards significantly
                    if (this.body.velocity.y < -10) {
                        this.safePlay(`${this.prefix}_jump`, true);
                    } else {
                        // Falling or micro-jittering: try fall anim, else stick to idle
                        if (this.scene.anims.exists(`${this.prefix}_fall`)) {
                            this.safePlay(`${this.prefix}_fall`, true);
                        } else {
                            this.safePlay(`${this.prefix}_idle`, true);
                        }
                    }
                }
            }

            const jumpTrigger = Phaser.Input.Keyboard.JustDown(this.cursors.up) || (this.mobileInput.up && !this.lastUpState);
            this.lastUpState = this.mobileInput.up;

            if (jumpTrigger) {
                if (rawOnG || this.jumpCount === 0) {
                    this.setVelocityY(-800); this.jumpCount = 1; this.canHover = true; this.hoverTime = 0;
                    this.lastGroundedTime = 0; // Clear grace immediately on jump so we don't flicker back to idle
                    if ((leftDown || rightDown) && this.scene.anims.exists(`${this.prefix}_jump_forward`)) {
                        this.safePlay(`${this.prefix}_jump_forward`, true);
                    } else {
                        this.safePlay(`${this.prefix}_jump`, true);
                    }
                } else if (this.jumpCount < 2) {
                    this.setVelocityY(-700); this.jumpCount = 2;
                    // Play double-jump anim if available (Cherry, Ninja have unique ones)
                    const hasDoubleJump = ['cherry', 'ninja'].includes(this.prefix);
                    if (hasDoubleJump) {
                        this.safePlay(`${this.prefix}_jump_double`, true);
                    } else {
                        if ((leftDown || rightDown) && this.scene.anims.exists(`${this.prefix}_jump_forward`)) {
                            this.safePlay(`${this.prefix}_jump_forward`, true);
                        } else {
                            this.safePlay(`${this.prefix}_jump`, true);
                        }
                    }
                }
            }

            if (upDown && !onG && this.canHover && this.body.velocity.y > 50) {
                if (this.hoverTime < this.maxHoverTime) {
                    this.body.setVelocityY(this.body.velocity.y * 0.6);
                    this.hoverTime += this.scene.game.loop.delta;
                    // Use character-specific hover anim if available
                    if (this.scene.anims.exists(`${this.prefix}_hover`)) {
                        this.safePlay(`${this.prefix}_hover`, true);
                    }
                } else { this.canHover = false; }
            }
            if (!upDown) this.canHover = false;

            // Manual falling cap: don't exceed 800 downward speed so we don't drop through floors
            if (!onG && this.body.velocity.y > 800) {
                this.body.setVelocityY(800);
            }

        } else {
            this.setVelocityX(this.body.velocity.x * 0.9);
        }

        if (attackPressed) {
            if (!onG && Math.abs(this.body.velocity.y) > 50) this.doAirAttack();
            else this.doAttack();
        }
        if (shootPressed) this.doShoot();

        // fixBodyAlign removed — was overriding per-character calibrations
    }

    // --- 2.5D MODE ---
    update25D() {
        const leftDown = this.cursors.left.isDown || this.mobileInput.left;
        const rightDown = this.cursors.right.isDown || this.mobileInput.right;
        const upDown = this.cursors.up.isDown || this.mobileInput.up;
        const downDown = this.cursors.down.isDown || this.mobileInput.down;

        const attackPressed = Phaser.Input.Keyboard.JustDown(this.keyZ) || (this.mobileInput.attack && !this.prevMobileAttack);
        const shootPressed = Phaser.Input.Keyboard.JustDown(this.keyC) || (this.mobileInput.shoot && !this.prevMobileShoot);
        const jumpPressed = Phaser.Input.Keyboard.JustDown(this.keySpace) || (this.mobileInput.jump && !this.prevMobileJump);

        this.prevMobileAttack = this.mobileInput.attack;
        this.prevMobileShoot = this.mobileInput.shoot;
        this.prevMobileJump = this.mobileInput.jump;

        if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) this.checkDash('left');
        if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) this.checkDash('right');

        if (!this.isAtk) {
            // X Movement
            if (leftDown) {
                const speed = this.isDashing ? this.runSpeed * 1.5 : this.runSpeed;
                this.setVelocityX(-speed);
                this.setFlipX(true);
            } else if (rightDown) {
                const speed = this.isDashing ? this.runSpeed * 1.5 : this.runSpeed;
                this.setVelocityX(speed);
                this.setFlipX(false);
            } else {
                this.setVelocityX(0);
            }

            // Y (Lane) Movement - Only if not jumping
            if (!this.isJumping25D) {
                if (upDown) {
                    this.setVelocityY(-this.runSpeed * 0.7);
                } else if (downDown) {
                    this.setVelocityY(this.runSpeed * 0.7);
                } else {
                    this.setVelocityY(0);
                }
                this.baseLaneY = this.y; // Update lane when grounded
            } else {
                this.setVelocityY(0); // Cannot change depth intentionally while in air
            }

            // Jump Sequence
            if (jumpPressed && !this.isJumping25D) {
                this.isJumping25D = true;
                this.jumpVelocityZ = -12; // Initial upward burst
                this.jumpZ = 0;
                this.safePlay(`${this.prefix}_jump`, true);
            }

            if (this.isJumping25D) {
                this.jumpZ += this.jumpVelocityZ;
                this.jumpVelocityZ += 0.6; // Gravity

                // Actual visual position is lane + jumpZ
                this.y = this.baseLaneY + this.jumpZ;

                if (this.jumpZ >= 0) {
                    this.jumpZ = 0;
                    this.y = this.baseLaneY;
                    this.isJumping25D = false;
                }
            }

            // Animations
            if (!this.isJumping25D) {
                if (leftDown || rightDown || upDown || downDown) {
                    this.safePlay(`${this.prefix}_run`, true);
                } else {
                    this.safePlay(`${this.prefix}_idle`, true);
                }
            }

            // Allow actions
            if (attackPressed) this.doAttack();
            if (shootPressed) this.doShoot();

        } else {
            this.setVelocityX(this.body.velocity.x * 0.9);
            this.setVelocityY(this.body.velocity.y * 0.9);
            // Lock Y to baseLaneY + jumpZ during attack so animation completes in place
            this.y = this.baseLaneY + this.jumpZ;

            // Prevent getting stuck in a jumping attack combo forever by forcing landing if gravity passed 0
            if (this.isJumping25D) {
                this.jumpZ += this.jumpVelocityZ;
                this.jumpVelocityZ += 0.6;
                this.y = this.baseLaneY + this.jumpZ;
                if (this.jumpZ >= 0) {
                    this.jumpZ = 0;
                    this.y = this.baseLaneY;
                    this.isJumping25D = false;
                }
            }
        }
    }

    // --- ATTACKS & ACTIONS ---
    doShoot() {
        if (this.isAtk) return;
        if (this.prefix === 'adam' || this.prefix === 'bigz' || this.prefix === 'cherry') return; // Cherry: no guitar
        this.isAtk = true; this.atkID++; this.hasFired = false;
        this.safePlay(`${this.prefix}_shoot`);
        this.setVelocityX(0);
        this.scene.time.delayedCall(1000, () => this.resetControl());
    }

    doAirAttack() {
        if (this.isAtk) return;
        this.isAtk = true; this.atkID++; this.combo = 0;

        if (this.prefix === 'cherry') {
            const movingHoriz = Math.abs(this.body.velocity.x) > 50;
            const pressingHoriz = this.cursors.left.isDown || this.cursors.right.isDown;
            if ((pressingHoriz || movingHoriz) && this.scene.anims.exists(`${this.prefix}_atk_air_horiz`)) {
                this.currentKB = 0.6; this.safePlay(`${this.prefix}_atk_air_horiz`);
            } else if (this.scene.anims.exists(`${this.prefix}_atk_air_spin`)) {
                this.currentKB = 0.4; this.safePlay(`${this.prefix}_atk_air_spin`);
            } else {
                this.currentKB = 0.5; this.safePlay(`${this.prefix}_atk1`);
            }
        } else {
            this.currentKB = 0.5; this.safePlay(`${this.prefix}_atk1`);
        }
        this.scene.time.delayedCall(800, () => this.resetControl());
    }

    doAttack() {
        // STRICT INPUT BUFFERING: Ignite Odyssey style
        if (this.isAtk) {
            // Only buffer the next hit if the window has opened (rhythmic timing)
            if (this.inComboWindow) {
                this.comboBuffered = true;
            }
            return;
        }
        if (this.comboResetTimer) {
            this.comboResetTimer.remove();
            this.comboResetTimer = null;
        }
        this.isAtk = true; this.atkID++; this.comboBuffered = false;

        // Safety timeout — prevents getting stuck if animation fails
        if (this.safetyTimer) this.safetyTimer.remove();
        this.safetyTimer = this.scene.time.delayedCall(600, () => this.resetControl(false));

        if (this.prefix === 'ignite' && this.isDashing) {
            if (this.safePlay('ignite_special')) {
                this.currentKB = 2.0; this.isDashing = false;
                this.setVelocityX(this.flipX ? -100 : 100);
            } else {
                this.resetControl();
            }
            return;
        }

        // Dynamic Combo Limit based on preloaded animations
        let maxCombo = 1;
        while (this.scene.anims.exists(`${this.prefix}_atk${maxCombo + 1}`)) {
            maxCombo++;
        }

        this.inComboWindow = false;

        this.combo = (this.combo % maxCombo) + 1;

        // Custom Tuning for Adam (Heavier Hits)
        if (this.prefix === 'adam') {
            if (this.combo === 5) {
                this.currentKB = 3.5; // Massive finisher
                this.setVelocityX(this.flipX ? -350 : 350);
            } else if (this.combo === 4) {
                this.currentKB = 1.8;
                this.setVelocityX(this.flipX ? -150 : 150);
            } else if (this.combo === 3) {
                this.currentKB = 1.2;
            } else {
                this.currentKB = 0.4; // Stronger base jabs
            }
        } else {
            // General Escalating knockback
            if (this.combo === maxCombo) {
                this.currentKB = 2.5;
                this.setVelocityX(this.flipX ? -200 : 200);
            } else if (this.combo >= maxCombo - 2) {
                this.currentKB = 1.0;
            } else if (this.combo >= 3) {
                this.currentKB = 0.5;
            } else {
                this.currentKB = 0.1;
            }
        }

        console.log(`Trying attack: ${this.prefix}_atk${this.combo} (Max: ${maxCombo}, KB: ${this.currentKB})`);
        this.safePlay(`${this.prefix}_atk${this.combo}`);
    }

    // --- EVENT HANDLERS ---
    handleAnimComplete(anim) {
        if (anim.key.includes('atk') || anim.key.includes('shoot') || anim.key.includes('special')) {
            // Clear safety timer
            if (this.safetyTimer) { this.safetyTimer.remove(); this.safetyTimer = null; }

            // Ensure hitbox is fully disabled
            if (this.hitArea && this.hitArea.body) this.hitArea.body.enable = false;

            this.resetControl(false); // Don't reset combo counter yet

            // STRICT INPUT BUFFER CHECK: If player pressed Z during the window, fire next hit seamlessly
            if (this.comboBuffered && !anim.key.includes('shoot') && !anim.key.includes('special')) {
                this.comboBuffered = false;
                this.doAttack();
                return;
            }
            this.comboBuffered = false;
            this.inComboWindow = false;

            // Tight rhythmic window (200ms instead of 400ms) to continue combo if they hit Z slightly late
            this.comboResetTimer = this.scene.time.delayedCall(200, () => {
                this.combo = 0;
                this.comboResetTimer = null;
            });
        }
    }

    handleAnimStart(anim, frame) {
        // For 1-frame animations, animationupdate never fires because the frame never changes.
        // We manually trigger the logic here for the first frame.
        this.handleAnimUpdate(anim, frame);
    }

    handleAnimUpdate(anim, frame) {
        // Fire projectile on frame 3 (0-indexed) for expanded shoot animations
        if (anim.key.includes('shoot') && !this.hasFired) {
            let fireFrame = 1; // Default
            if (this.prefix === 'cherry') fireFrame = 2; // Cherry 3rd frame
            else if (this.prefix === 'default') fireFrame = 4; // Chibi Soul specific blast (frame 5 out of 8)

            if (frame.index >= fireFrame) {
                this.hasFired = true;
                if (this.scene.doFire) this.scene.doFire(this);
            }
        }
        // Also fire projectile for Ignite's blast attack
        if (anim.key === 'ignite_blast' && !this.hasFired && frame.index >= 1) {
            this.hasFired = true;
            if (this.scene.doFire) this.scene.doFire(this);
        }

        if (!this.isAtk || !this.hitArea || !this.hitArea.body) return;

        // --- NEW COMBO HITBOX LOGIC (Ignite Odyssey Frame Data) ---
        let hitConfig = null;
        if (this.comboData && this.comboData[this.prefix] && this.comboData[this.prefix][this.combo]) {
            hitConfig = this.comboData[this.prefix][this.combo];
        }

        const activeIndex = hitConfig ? hitConfig.activeIndex : 1;

        // Open the input buffer window once we reach the active frame
        if (frame.index >= activeIndex) {
            this.inComboWindow = true;
        }

        // Extremely precise hitbox toggling based on frame
        if (frame.index === activeIndex) {
            this.hitArea.body.enable = true;

            // Adjust to the specific move's dimensions
            const reach = hitConfig ? hitConfig.hitArea.x : 80;
            const w = hitConfig ? hitConfig.hitArea.w : 100;
            const h = hitConfig ? hitConfig.hitArea.h : 100;
            const offY = hitConfig ? hitConfig.hitArea.y : -20;

            const offX = this.flipX ? -reach : reach;
            this.hitArea.setPosition(this.x + offX, this.y + offY);
            this.hitArea.body.setSize(w, h);

        } else if (frame.index > activeIndex) {
            // Disable the hitbox quickly so it doesn't linger unfairly
            this.hitArea.body.enable = false;
        }
    }

    refreshHitbox(kbValue = 1) {
        // Helper to manually trigger hitbox update if needed
        if (this.anims.currentAnim && this.anims.currentFrame) {
            this.handleAnimUpdate(this.anims.currentAnim, this.anims.currentFrame);
        }
    }
    checkDash(dir) {
        const now = this.scene.time.now;
        if (this.lastTapKey === dir && now - this.lastTapTime < 300) {
            this.isDashing = true;
            this.dashBuffer = now + 400;
        }
        this.lastTapTime = now;
        this.lastTapKey = dir;
    }
    fixBodyAlign() {
        if (!this.body || !this.frame || !this.frame.realHeight || this.frame.realHeight <= 0) return;
        const ox = (this.frame.realWidth * this.originX) - (this.body.width / 2 / this.scaleX);
        const oy = (this.frame.realHeight * this.originY) - (this.body.height / this.scaleY);
        this.body.setOffset(ox, oy);
    }
}