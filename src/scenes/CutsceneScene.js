class CutsceneScene extends Phaser.Scene {
    constructor() { super('Cutscene'); }
    create(data) {
        this.charKey = data && data.char ? data.char : 'cherry';
        this.sound.play('mc', { loop: true, volume: 0.5 });
        this.bg = this.add.tileSprite(480, 270, 960, 540, 'bg_wall').setTileScale(2);
        
        // Show correct character in cutscene
        let frameKey = 'p_i';
        let frame = 'f0';
        if (this.charKey === 'drjack') { frameKey = 'dj_i'; frame = 'f0'; }
        else if (this.charKey === 'bigz') { frameKey = 'bigz_idle'; frame = 0; }
        else if (this.charKey === 'adam') { frameKey = 'adam_jump'; frame = 'adam_0134'; } // Just using a frame for now
        else if (this.charKey === 'cherry') { frameKey = 'cherry_jump'; frame = 'cherry_0130'; }
        
        // For spritesheets/images loaded differently, this might be tricky.
        // Simplified fallback for now:
        try {
            this.p = this.add.sprite(480, 270, frameKey, frame).setScale(1.5);
        } catch(e) {
            this.p = this.add.sprite(480, 270, 'p_i', 'f0').setScale(1.5);
        }

        // Play animation if available, otherwise just spin/shake
        if (this.charKey === 'default') this.p.anims.play('jump_v');
        // else we just let it sit there falling
        
        this.cameras.main.shake(4000, 0.01);
        this.time.delayedCall(4000, () => this.scene.start('BossFight', { char: this.charKey }));
    }
    update() { 
        this.bg.tilePositionY += 15; 
    }
}
