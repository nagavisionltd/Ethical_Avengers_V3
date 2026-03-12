class BaseScene extends Phaser.Scene {
    constructor(key) {
        super(key);
    }

    initPlayer(x, y, levelW) {
        this.cameras.main.setBounds(0, 0, levelW, 540);
        this.player = new Player(this, x, y);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        
        this.projs = this.physics.add.group();
    }

    doFire(player) {
        const p = this.projs.create(player.x + (player.flipX ? -60 : 60), player.y - 60, 'orb', 'f0');
        p.body.setAllowGravity(false).setVelocityX(player.flipX ? -800 : 800);
        p.setFlipX(player.flipX).anims.play('orb_f');
        p.setData('atkID', ++player.atkID);
        this.time.delayedCall(2000, () => p.destroy());
    }

    onEnemyHit(enemy, dmg, sourceAtkID) {
        if (enemy.getData('lastHit') === sourceAtkID) return;
        enemy.setData('lastHit', sourceAtkID);
        enemy.setData('hp', enemy.getData('hp') - dmg);
        enemy.setTint(0xff0000); 
        this.sound.play('sh');
        
        const kb = this.player.x < enemy.x ? 100 : -100;
        enemy.setVelocityX(kb);
        
        this.time.delayedCall(60, () => { 
            if(enemy.active) enemy.clearTint(); 
        });

        if (enemy.getData('hp') <= 0) {
            const ex = this.add.sprite(enemy.x, enemy.y - 40, 'exp').setScale(2).anims.play('explode');
            ex.once('animationcomplete', () => ex.destroy());
            enemy.destroy();
            this.onEnemyDeath(enemy);
        }
    }

    onEnemyDeath(enemy) {
        // Optional override in child scenes
    }

    spawnWalker(x, y) {
        const w = this.enemies.create(x, y, 'walker_i', 'f0').setOrigin(0.5, 1).setScale(2).setCollideWorldBounds(true).setGravityY(1600);
        w.setData('hp', 50);
        w.anims.play('walker_idle');
        w.update = () => {
            if (!w.body) return;
            const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, w.x, w.y);
            if (dist < 400 && dist > 50) {
                w.setVelocityX(this.player.x < w.x ? -100 : 100);
                w.setFlipX(this.player.x < w.x);
                w.anims.play('walker_walk', true);
            } else {
                w.setVelocityX(0);
                w.anims.play('walker_idle', true);
            }
        };
        return w;
    }

    spawnDrone(x, y) {
        const d = this.enemies.create(x, y, 'drone1').setOrigin(0.5, 0.5).setScale(2).setCollideWorldBounds(true);
        d.body.setAllowGravity(false);
        d.setData('hp', 30);
        d.anims.play('drone_fly');
        d.update = () => {
            if (!d.body) return;
            const angle = Phaser.Math.Angle.Between(d.x, d.y, this.player.x, this.player.y - 60);
            this.physics.velocityFromRotation(angle, 150, d.body.velocity);
            d.setFlipX(this.player.x < d.x);
        };
        return d;
    }
}
