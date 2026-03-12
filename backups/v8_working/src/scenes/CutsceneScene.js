class CutsceneScene extends Phaser.Scene {
    constructor() { super('Cutscene'); }
    create() {
        this.sound.play('mc', { loop: true, volume: 0.5 });
        this.bg = this.add.tileSprite(480, 270, 960, 540, 'bg_wall').setTileScale(2);
        this.p = this.add.sprite(480, 270, 'p_i', 'f0').setScale(1.5);
        this.p.anims.play('jump_v');
        this.cameras.main.shake(4000, 0.01);
        this.time.delayedCall(4000, () => this.scene.start('BossFight'));
    }
    update() { 
        this.bg.tilePositionY += 15; 
    }
}
