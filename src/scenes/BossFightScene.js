class BossFightScene extends BaseScene {
    constructor() { super('BossFight'); }
    create(data) {
        const W = 960;
        
        // Animated Video Background (Robust Loading)
        if (this.cache.video.exists('vid_boss_bg')) {
            const vid = this.add.video(W/2, 270, 'vid_boss_bg');
            vid.on('playing', () => {
                vid.setDisplaySize(W, 540);
            });
            vid.play(true);
            vid.setVolume(0); 
            
            // Fallback resize
            this.time.delayedCall(100, () => {
                if (vid.displayHeight === 0 && vid.width > 0) vid.setDisplaySize(W, 540);
            });
        } else {
            this.add.image(0, 0, 'bg_boss').setOrigin(0).setDisplaySize(W, 540);
        }

        const g = this.physics.add.staticGroup();  
        g.create(W/2, 530, null).setDisplaySize(W, 20).refreshBody();
        
        const charKey = data && data.char ? data.char : 'cherry';
        this.charKey = charKey;
        this.initPlayer(100, 400, W, charKey);
        this.physics.add.collider(this.player, g);
        this.physics.add.collider(this.enemies, g);
        
        // --- CYBORG BOSS ---
        const b = this.enemies.create(750, 400, 'boss_tex', 'b0_0').setOrigin(0.5, 1).setScale(1.5).setCollideWorldBounds(true);
        b.setData({ hp: 200, maxHP: 200, isBoss: true });
        b.anims.play('b_i'); // Cyborg Idle
        
        b.update = () => {
            if (!b.body || !this.player.active) return;
            const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, b.x, b.y);
            b.setFlipX(this.player.x < b.x);
            
            if (dist < 180) {
                b.setVelocityX(0); 
                if (b.anims.currentAnim && b.anims.currentAnim.key !== 'boss_atk') b.anims.play('boss_atk', true);
            } else if (dist < 600) {
                b.setVelocityX(this.player.x < b.x ? -180 : 180);
                b.anims.play('boss_walk', true);
            } else {
                b.setVelocityX(0); b.anims.play('b_i', true);
            }
        };

        this.physics.add.overlap(this.player.hitArea, this.enemies, (h, e) => this.onEnemyHit(e, 10, this.player.atkID));
        this.physics.add.overlap(this.projs, this.enemies, (p, e) => { this.onEnemyHit(e, 20, p.getData('atkID')); p.destroy(); });

        this.scene.launch('UIScene', { char: this.charKey });
        const ui = this.scene.get('UIScene');
        if (ui) ui.showBossBar('CYBORG EXECUTOR', true);
    }

    update() { 
        this.player.update(); 
        this.enemies.getChildren().forEach(e => { if (e.update) e.update(); });
    }

    onEnemyDeath(enemy) {
        const ui = this.scene.get('UIScene');
        if (ui) ui.showBossBar('', false);
        this.time.delayedCall(2000, () => {
            this.sound.stopAll();
            this.scene.start('UmbraPrimeScene', { char: this.charKey });
        });
    }
}
