class CityScene extends BaseScene {
    constructor() { super('City'); }
    create() {
        const W = 5000; this.physics.world.setBounds(0, 0, W, 540);
        
        // Parallax Layers
        this.add.image(0, 0, 'bg1').setOrigin(0).setDisplaySize(W, 540).setScrollFactor(0.2);
        this.add.tileSprite(0, 0, W, 540, 'bg_wall').setOrigin(0).setTileScale(2.4).setScrollFactor(0.5);
        
        // Background Effects
        for(let i=0; i<10; i++) {
            let nx = 400 + i * 500;
            this.add.sprite(nx, 200, 'neon_on').setScale(0.15).anims.play('neon_flicker').setScrollFactor(0.5);
            this.add.sprite(nx + 200, 480, 'steam1').setScale(0.1).anims.play('steam_anim').setScrollFactor(1.0);
        }

        this.add.tileSprite(0, 0, W, 540, 'bg_wall_supports').setOrigin(0).setTileScale(2.4).setScrollFactor(0.7);
        this.add.tileSprite(0, 500, W, 40, 'floor').setOrigin(0).setTileScale(2);
        
        const g = this.physics.add.staticGroup(); 
        g.create(W/2, 530, null).setDisplaySize(W, 20).refreshBody();
        
        this.initPlayer(100, 400, W);
        this.physics.add.collider(this.player, g);
        
        this.enemies = this.physics.add.group();
        for(let i=0; i<5; i++) {
            this.spawnWalker(800 + i*800, 400);
            this.spawnDrone(1200 + i*800, 200);
        }

        this.physics.add.collider(this.enemies, g);
        this.physics.add.overlap(this.player.hitArea, this.enemies, (h, e) => this.onEnemyHit(e, 10, this.player.atkID));
        this.physics.add.overlap(this.projs, this.enemies, (p, e) => { this.onEnemyHit(e, 20, p.getData('atkID')); p.destroy(); });
        
        this.add.tileSprite(0, 450, W, 98, 'fg_decor').setOrigin(0).setScrollFactor(1.2).setAlpha(0.8);
        
        this.sound.play('m1', { loop: true, volume: 0.4 });
    }
    update() { 
        this.player.update(); 
        this.enemies.getChildren().forEach(e => { if (e.update) e.update(); });
    }
}
