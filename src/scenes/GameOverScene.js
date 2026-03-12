class GameOverScene extends BaseScene {
    constructor() {
        super('GameOverScene');
    }

    create(data) {
        super.create(data);
        const { width, height } = this.scale;

        this.add.rectangle(0, 0, width, height, 0x000000, 0.7).setOrigin(0);

        this.add.text(width / 2, height / 2 - 50, 'GAME OVER', {
            fontFamily: '"Press Start 2P"',
            fontSize: '64px',
            fill: '#ff0000',
            stroke: '#000000',
            strokeThickness: 8
        }).setOrigin(0.5);

        const score = data.score || 0;
        this.add.text(width / 2, height / 2 + 50, `FINAL SCORE: ${score.toString().padStart(6, '0')}`, {
            fontFamily: '"Press Start 2P"',
            fontSize: '24px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(width / 2, height / 2 + 150, 'PRESS ANY KEY TO RESTART', {
            fontFamily: '"Press Start 2P"',
            fontSize: '18px',
            fill: '#00ffaa'
        }).setOrigin(0.5);

        this.input.keyboard.on('keydown', () => {
            this.cameras.main.fadeOut(1000);
            this.time.delayedCall(1000, () => {
                this.scene.start('ModeSelectScene');
            });
        });
    }
}
