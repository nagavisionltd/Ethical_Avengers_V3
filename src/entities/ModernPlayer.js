class ModernPlayer extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texturePrefix) {
        let startKey = `${texturePrefix}_0000`;
        let startFrame = null;
        if (texturePrefix === 'bigz') { startKey = 'bigz_idle_sheet'; startFrame = 0; }
        else if (texturePrefix === 'ignite') { startKey = 'ignite_idle_01'; }
        else if (texturePrefix === 'default' || texturePrefix === 'drjack') { startKey = 'p_i'; startFrame = 'f0'; }
        if (!scene.textures.exists(startKey)) { startKey = 'p_i'; startFrame = 'f0'; }

        super(scene, x, y, startKey, startFrame);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.prefix = texturePrefix; 
        
        if (this.prefix === 'adam') { this.setScale(0.35); this.setOrigin(0.5, 0.95); this.body.setSize(120, 260).setOffset(140, 80); this.runSpeed = 380; }
        else if (this.prefix === 'bigz') { this.setScale(1.2); this.setOrigin(0.5, 0.95); this.body.setSize(50, 80).setOffset(30, 20); this.runSpeed = 400; }
        else { this.setScale(0.35); this.setOrigin(0.5, 0.95); this.body.setSize(100, 240).setOffset(150, 100); this.runSpeed = 450; }
        
        this.setCollideWorldBounds(true);
        this.setGravityY(1000); this.setPushable(false);

        this.isAtk = false; this.combo = 0; this.atkID = 0; this.jumpCount = 0;
        
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.keyZ = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        this.keyC = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);

        this.hitArea = scene.add.rectangle(0, 0, 1, 1, 0x00ff00, 0); 
        scene.physics.add.existing(this.hitArea);
        this.hitArea.body.setAllowGravity(false);

        this.on('animationcomplete', this.handleAnimComplete, this);
    }
    
    safePlay(key, ignoreIfPlaying = false) {
        if (this.anims && this.anims.exists(key)) { this.play(key, ignoreIfPlaying); }
        else { console.warn(`ModernPlayer: Anim ${key} missing for ${this.prefix}`); }
    }

    update() {
        if (!this.body) return;
        
        if (!this.isAtk && this.hitArea && this.hitArea.body) { this.hitArea.setPosition(this.x, this.y - 100); }

        const onG = this.body.onFloor();
        if (onG) this.jumpCount = 0;

        if (!this.isAtk) {
            if (this.cursors.left.isDown) {
                this.setVelocityX(-this.runSpeed); this.setFlipX(true);
                if (onG) this.safePlay(`${this.prefix}_run`, true);
            } else if (this.cursors.right.isDown) {
                this.setVelocityX(this.runSpeed); this.setFlipX(false);
                if (onG) this.safePlay(`${this.prefix}_run`, true);
            } else {
                this.setVelocityX(0);
                if (onG) this.safePlay(`${this.prefix}_idle`, true);
            }

            if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
                if (onG) {
                    this.setVelocityY(-1000); this.jumpCount = 1;
                    this.safePlay(`${this.prefix}_jump`, true);
                } else if (this.jumpCount < 2) {
                    this.setVelocityY(-1100); this.jumpCount = 2;
                    this.prefix === 'cherry' ? this.safePlay(`${this.prefix}_jump_double`, true) : this.safePlay(`${this.prefix}_jump`, true);
                }
            }
        } else {
            this.setVelocityX(this.body.velocity.x * 0.9);
        }

        if (Phaser.Input.Keyboard.JustDown(this.keyZ)) {
            if (!this.body.onFloor() && Math.abs(this.body.velocity.y) > 50) this.doAirAttack();
            else this.doAttack();
        }
    }
    
    doAttack() { /* ... */ }
    doAirAttack() { /* ... */ }
    handleAnimComplete(anim) { /* ... */ }
}