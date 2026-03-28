class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type = 'walker') {
        // Use the white_pixel texture as a placeholder
        super(scene, x, y, 'white_pixel');
        
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.type = type;
        this.setData('hp', 50);
        this.setData('maxHP', 50);
        this.setData('isStunned', false);
        this.setData('lastHit', 0);

        // Simple placeholder styling based on type
        if (type === 'drone') {
            this.setTint(0x0000ff); // Blue for drones
            this.body.setAllowGravity(false);
            this.setDisplaySize(80, 80); // Enlarged drone size
        } else {
            this.setTint(0xff0000); // Red for walkers
            this.setOrigin(0.5, 1);
            this.setDisplaySize(100, 160); // Enlarged walker size (larger than player)
            this.body.setGravityY(2500);
        }

        this.body.setCollideWorldBounds(true);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        
        if (!this.active || !this.scene || !this.scene.player || this.getData('dying')) return;
        if (this.getData('isStunned')) return;

        const player = this.scene.player;
        const dist = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
        const speed = this.getData('speed') || 100;

        // Simple pursuit AI: only move if within range
        if (dist < 600 && dist > 50) {
            const dx = player.x - this.x;
            this.setVelocityX(dx > 0 ? speed : -speed);
            
            if (this.type === 'drone') {
                const dy = player.y - this.y;
                this.setVelocityY(dy > 0 ? speed : -speed);
            }
        } else {
            this.setVelocityX(0);
            if (this.type === 'drone') {
                this.setVelocityY(0);
            }
        }
    }

    takeHit(dmg, kbPower, playerX) {
        if (!this.active || !this.scene || this.getData('dying')) return;

        const currentHP = this.getData('hp') - dmg;
        this.setData('hp', currentHP);

        // Simple stagger
        this.setData('isStunned', true);
        if (this.stunTimer) this.stunTimer.remove();

        this.stunTimer = this.scene.time.delayedCall(300, () => {
            if (this.active) this.setData('isStunned', false);
        });

        // Flash effect
        const originalTint = this.type === 'drone' ? 0x0000ff : 0xff0000;
        this.setTint(0xffffff);
        this.scene.time.delayedCall(60, () => {
            if (this.active) this.setTint(originalTint);
        });

        // Knockback
        const kbDir = playerX < this.x ? 1 : -1;
        this.setVelocityX(kbDir * (100 * kbPower));
        this.setVelocityY(-100);

        if (currentHP <= 0) {
            this.die();
        }
    }

    die() {
        if (this.getData('dying') || !this.scene) return;
        this.setData('dying', true);

        if (this.scene.onEnemyDeath) this.scene.onEnemyDeath(this);

        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            scale: 0.1,
            duration: 200,
            onComplete: () => this.destroy()
        });
    }

    destroy(fromScene) {
        if (this.stunTimer) this.stunTimer.remove();
        super.destroy(fromScene);
    }
}