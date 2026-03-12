class MainScene extends BaseScene {
    constructor() { super('Main'); }
    create() {
        const W = 5000; this.physics.world.setBounds(0, 0, W, 540);
        this.add.image(0, 0, 'bg1').setOrigin(0).setDisplaySize(W, 540);
        this.add.tileSprite(0, 500, W, 40, 'floor').setOrigin(0);
        
        const g = this.physics.add.staticGroup(); 
        g.create(W/2, 530, null).setDisplaySize(W, 20).refreshBody();
        
        this.initPlayer(100, 400, W);
        this.physics.add.collider(this.player, g);
        
        this.enemies = this.physics.add.group();
        for(let i=0; i<3; i++) this.spawnWalker(800 + i*1000, 400);

        const b = this.enemies.create(4500, 400, 'boss_tex', 'b0_0').setOrigin(0.5, 1).setScale(0.3).setCollideWorldBounds(true);
        b.setData('hp', 200).anims.play('b_i');
        
        this.physics.add.collider(this.enemies, g);
        this.physics.add.overlap(this.player.hitArea, this.enemies, (h, e) => this.onEnemyHit(e, 10, this.player.atkID));
        this.physics.add.overlap(this.projs, this.enemies, (p, e) => { this.onEnemyHit(e, 20, p.getData('atkID')); p.destroy(); });
        
        this.portal = this.physics.add.staticImage(4800, 400, 'portal').setScale(0.5);
        this.physics.add.overlap(this.player, this.portal, () => { 
            this.sound.stopAll(); 
            this.scene.start('Level2'); 
        });
        
        this.sound.play('m1', { loop: true, volume: 0.4 });
    }
    update() { 
        this.player.update(); 
        this.enemies.getChildren().forEach(e => { if (e.update) e.update(); });
    }
}
