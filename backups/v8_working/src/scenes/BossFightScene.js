class BossFightScene extends BaseScene {
    constructor() { super('BossFight'); }
    create() {
        const W = 960;
        this.add.image(0, 0, 'bg_boss').setOrigin(0).setDisplaySize(W, 540);
        const g = this.physics.add.staticGroup(); 
        g.create(W/2, 530, null).setDisplaySize(W, 20).refreshBody();
        
        this.initPlayer(100, 400, W);
        this.physics.add.collider(this.player, g);
        
        this.enemies = this.physics.add.group();
        const b = this.enemies.create(750, 400, 'dj_i', 'f0').setOrigin(0.5, 1).setScale(2).setCollideWorldBounds(true);
        b.setData('hp', 500).anims.play('dj_idle');
        
        b.update = () => {
            if (!b.body) return;
            const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, b.x, b.y);
            b.setFlipX(this.player.x < b.x);
            if (dist < 150) {
                b.setVelocityX(0); 
                if (b.anims.currentAnim && b.anims.currentAnim.key !== 'dj_atk') b.anims.play('dj_atk');
            } else if (dist < 500) {
                b.setVelocityX(this.player.x < b.x ? -150 : 150);
                b.anims.play('dj_run', true);
            } else {
                b.setVelocityX(0); b.anims.play('dj_idle', true);
            }
        };

        this.physics.add.collider(this.enemies, g);
        this.physics.add.overlap(this.player.hitArea, this.enemies, (h, e) => this.onEnemyHit(e, 10, this.player.atkID));
        this.physics.add.overlap(this.projs, this.enemies, (p, e) => { this.onEnemyHit(e, 20, p.getData('atkID')); p.destroy(); });
    }

    update() { 
        this.player.update(); 
        this.enemies.getChildren().forEach(e => { if (e.update) e.update(); });
    }

    onEnemyDeath(enemy) {
        this.time.delayedCall(2000, () => {
            this.sound.stopAll();
            this.scene.start('City');
        });
    }
}
