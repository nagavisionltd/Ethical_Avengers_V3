class ModeSelectScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ModeSelectScene' });
    }

    preload() {
        this.load.image('title_bg_v17', 'assets/images/backgrounds/ethical_avengers_title_screen.jpeg');
    }

    create() {
        console.log("MODE_SELECT: Initializing v17.0 (New Space Branding)");

        // Add background and scale proportionally to cover the screen (like CSS cover)
        const bg = this.add.image(480, 270, 'title_bg_v17');
        const scaleX = this.cameras.main.width / bg.width;
        const scaleY = this.cameras.main.height / bg.height;
        const scale = Math.max(scaleX, scaleY);
        bg.setScale(scale).setScrollFactor(0);

        // Add a subtle pulsing animation to the background to make it feel "active"
        this.tweens.add({
            targets: bg,
            scale: scale * 1.05,
            duration: 10000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        const btnStyle = {
            fontSize: '22px',
            fontFamily: '"Press Start 2P"',
            color: '#00ffaa',
            stroke: '#000000',
            strokeThickness: 4
        };

        // Story Mode Button
        const storyBtn = this.add.text(480, 320, 'STORY MODE', btnStyle).setOrigin(0.5).setInteractive();
        storyBtn.on('pointerover', () => storyBtn.setStyle({ fill: '#ffffff' }));
        storyBtn.on('pointerout', () => storyBtn.setStyle({ fill: '#00ffaa' }));
        storyBtn.on('pointerdown', () => {
            this.sound.stopAll();
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.scene.start('CharacterSelect', { gameMode: 'story' });
            });
        });

        // Arcade Mode Button
        const arcadeBtn = this.add.text(480, 380, 'ARCADE MODE', btnStyle).setOrigin(0.5).setInteractive();
        arcadeBtn.on('pointerover', () => arcadeBtn.setStyle({ fill: '#ffffff' }));
        arcadeBtn.on('pointerout', () => arcadeBtn.setStyle({ fill: '#00ffaa' }));
        arcadeBtn.on('pointerdown', () => {
            this.sound.stopAll();
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.scene.start('CharacterSelect', { gameMode: 'arcade' });
            });
        });

        // VS Mode Button
        const vsBtn = this.add.text(480, 440, 'VS MODE', { ...btnStyle, color: '#ff0055' }).setOrigin(0.5).setInteractive();
        vsBtn.on('pointerover', () => vsBtn.setStyle({ fill: '#ffffff' }));
        vsBtn.on('pointerout', () => vsBtn.setStyle({ fill: '#ff0055' }));
        vsBtn.on('pointerdown', () => {
            this.sound.stopAll();
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.scene.start('VSCharacterSelectScene');
            });
        });

        // --- DEBUG WARP BUTTONS (More subtle) ---
        const createWarp = (x, y, text, mapKey) => {
            const btn = this.add.text(x, y, text, {
                fontSize: '10px',
                fontFamily: '"Press Start 2P"',
                color: '#444'
            }).setOrigin(0.5).setInteractive().setDepth(100);

            btn.on('pointerover', () => btn.setStyle({ fill: '#00ffaa' }));
            btn.on('pointerout', () => btn.setStyle({ fill: '#444' }));
            btn.on('pointerdown', () => {
                this.cameras.main.fadeOut(500, 0, 0, 0);
                this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                    this.scene.start('Level1_Antarctica', { char: 'cherry' });
                });
            });
        };

        createWarp(150, 520, '[ DEBUG: ANTARCTICA ]', 'antarctica');

        console.log("MODE_SELECT: Fading in cameras");
        this.cameras.main.fadeIn(1000);
    }
}
