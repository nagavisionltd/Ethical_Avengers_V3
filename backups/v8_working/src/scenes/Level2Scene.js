class Level2Scene extends BaseScene {
    constructor() { super('Level2'); }
    create() {
        this.sound.play('m2', { loop: true, volume: 0.4 });
        const W = 3360; this.physics.world.setBounds(0, 0, W, 1500);
        
        this.add.tileSprite(0, 0, W, 540, 'sky').setOrigin(0).setTileScale(3.1).setScrollFactor(0.1);
        this.add.tileSprite(0, 0, W, 540, 'towers').setOrigin(0).setTileScale(3.1).setScrollFactor(0.4);
        this.bg = this.add.tileSprite(0, 0, W, 540, 'bg2').setOrigin(0).setTileScale(3.1).setScrollFactor(0.7);
        
        const g = this.physics.add.staticGroup();
        g.create(720, 530, null).setDisplaySize(1440, 20).refreshBody();
        g.create(2500, 530, null).setDisplaySize(1700, 20).refreshBody();
        
        this.add.tileSprite(0, 500, 1440, 40, 'floor').setOrigin(0).setTileScale(2);
        this.add.tileSprite(1632, 500, 1728, 40, 'floor').setOrigin(0).setTileScale(2);
        
        this.initPlayer(100, 100, W);
        this.physics.add.collider(this.player, g);
    }
    update() { 
        this.player.update(); 
        if (this.player.y > 650) { 
            this.sound.stopAll(); 
            this.scene.start('Cutscene'); 
        } 
    }
}
