// A scene for pausing the game.
class PauseScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PauseScene' });
    }

    create() {
        // Create a semi-transparent background
        const overlay = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.7).setOrigin(0);

        // Add "PAUSED" text
        this.add.text(this.scale.width / 2, this.scale.height / 2 - 100, 'PAUSED', {
            fontFamily: '"Press Start 2P"',
            fontSize: '48px',
            color: '#00ffaa'
        }).setOrigin(0.5);

        // Resume Button
        const resumeBtn = this.add.text(this.scale.width / 2, this.scale.height / 2, 'Resume', {
            fontFamily: '"Press Start 2P"',
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5).setInteractive();

        resumeBtn.on('pointerover', () => resumeBtn.setStyle({ fill: '#00ffaa' }));
        resumeBtn.on('pointerout', () => resumeBtn.setStyle({ fill: '#ffffff' }));
        resumeBtn.on('pointerdown', () => this.resumeGame());

        // Quit Button
        const quitBtn = this.add.text(this.scale.width / 2, this.scale.height / 2 + 60, 'Quit', {
            fontFamily: '"Press Start 2P"',
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5).setInteractive();

        quitBtn.on('pointerover', () => quitBtn.setStyle({ fill: '#ff0044' }));
        quitBtn.on('pointerout', () => quitBtn.setStyle({ fill: '#ffffff' }));
        quitBtn.on('pointerdown', () => {
            // Stop the scenes that are running
            this.scene.stop('CyberCity');
            this.scene.stop('UIScene');
            // Go back to the main menu
            this.scene.start('ModeSelectScene');
        });

        // Listen for Enter key to resume
        this.input.keyboard.on('keydown-ENTER', this.resumeGame, this);
    }

    resumeGame() {
        this.scene.stop();
        this.scene.resume('CyberCity');
    }
}
