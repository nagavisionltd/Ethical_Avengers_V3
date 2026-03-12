class WorldSelectScene extends Phaser.Scene {
    constructor() {
        super({ key: 'WorldSelectScene' });
    }

    preload() {
        this.load.html('worldMapHTML', 'assets/ui/eight_worlds_map.html');
    }

    create(data) {
        this.selectionData = data;
        const { width, height } = this.scale;

        this.cameras.main.setBackgroundColor('#000000');

        // Load the HTML DOM Element
        this.domElement = this.add.dom(width / 2, height / 2).createFromCache('worldMapHTML');

        const unlocked = this.registry.get('unlockedLevels') || ['IceWall', 'Khemra', 'ShippingDocks'];

        // Define stage routing logic
        const stageRoutes = {
            'IceWall': 'Cutscene_IceWall',
            'Aurelion': 'AurelionScene',       // Placeholder for future
            'Noktara': 'NoktaraScene',         // Placeholder for future
            'Virella': 'VirellaScene',         // Placeholder for future
            'Khemra': 'IntroScene',            // Khemra's intro scene
            'Aetherion': 'AetherionScene',
            'Thalassa': 'ThalassaScene',       // Placeholder for future
            'UmbraPrime': 'UmbraPrimeScene',
            'TerraPrima': 'TerraPrimeScene'    // Placeholder for future
        };

        // Initialize state for each button based on unlocked tier
        for (const [key, sceneName] of Object.entries(stageRoutes)) {
            const btn = this.domElement.getChildByID(`stage-${key}`);
            if (btn) {
                if (unlocked.includes(key)) {
                    btn.classList.remove('locked');
                    btn.classList.add('unlocked');

                    btn.onclick = () => {
                        this.sound.play('sa');
                        this.cameras.main.fadeOut(500, 0, 0, 0);
                        this.time.delayedCall(500, () => {
                            this.scene.start(sceneName, this.selectionData);
                        });
                    };
                } else {
                    btn.classList.add('locked');
                    btn.classList.remove('unlocked');
                    btn.onclick = () => {
                        // Flashing red effect for locked nodes
                        btn.style.borderColor = 'red';
                        setTimeout(() => btn.style.borderColor = '', 200);
                    };
                }
            }
        }

        // Back Button overlay outside the DOM element just in case
        const backBtn = this.add.text(50, 40, '< BACK', {
            fontSize: '16px', fontFamily: '"Press Start 2P"', color: '#ffffff'
        }).setInteractive({ cursor: 'pointer' });

        backBtn.on('pointerdown', () => this.scene.start('CharacterSelect'));
        backBtn.on('pointerover', () => backBtn.setColor('#00ffaa'));
        backBtn.on('pointerout', () => backBtn.setColor('#ffffff'));

        // Header Title
        this.add.text(width / 2, 40, 'THE EIGHT WORLDS', {
            fontSize: '24px', fontFamily: '"Press Start 2P"', color: '#00ffaa',
            stroke: '#000', strokeThickness: 4
        }).setOrigin(0.5);

        this.cameras.main.fadeIn(500);
    }
}