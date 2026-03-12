class TravelCutscene extends Phaser.Scene {
    constructor() {
        super('TravelCutscene');
    }

    create(data) {
        this.charKey = data.char || 'cherry';

        this.sound.stopAll();
        this.sound.play('music_drama', { loop: true, volume: 0.6 });

        // Background
        this.bg = this.add.tileSprite(0, 0, this.cameras.main.width, this.cameras.main.height, 'bg_boss').setOrigin(0);

        // Destination (Crystal City placeholder - kept invisible as requested)
        const city = this.add.sprite(this.cameras.main.width + 200, this.cameras.main.height / 2, 'white_pixel').setScale(100).setAlpha(0);

        // Player on hoverboard (using player sprite as placeholder)
        const player = this.add.sprite(-100, this.cameras.main.height / 2, 'p_i', 'f0').setScale(1.5);

        // Tween for the City to move into view
        this.tweens.add({
            targets: city,
            x: this.cameras.main.width - 150,
            ease: 'Power1',
            duration: 4000
        });

        // Tween for the Player to fly across the screen
        this.tweens.add({
            targets: player,
            x: this.cameras.main.width - 120,
            ease: 'Power2',
            duration: 5000,
            onComplete: () => {
                // When player reaches the city, fade out
                this.cameras.main.fadeOut(1000, 0, 0, 0);
            }
        });

        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            this.sound.stopAll();
            this.scene.start('Level2_CrystalHub', { char: this.charKey });
        });
    }

    update() {
        // Scroll the background for a sense of speed
        this.bg.tilePositionX += 4;
    }
}
