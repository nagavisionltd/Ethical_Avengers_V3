class Cutscene_IceWall extends BaseScene {
    constructor() {
        super('Cutscene_IceWall');
    }

    create(data) {
        // Data contains the selected character (e.g. { char: 'cherry' })
        this.selectedHero = data.char || 'cherry';

        // Define display names dynamically based on the sprite key
        const heroNames = {
            'cherry': 'Cherry',
            'adam': 'Adam',
            'bigz': 'Big Zeeko',
            'ignite': 'Dr. Ignite',
            'cro': 'Cro CEO',
            'default': 'Naga Soul'
        };
        const heroName = heroNames[this.selectedHero] || 'Avenger';

        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        this.add.rectangle(0, 0, width, height, 0x001a33).setOrigin(0); // Deep icy blue background
        this.add.rectangle(0, height - 100, width, 100, 0x003366).setOrigin(0); // Ice floor

        // Draw a massive glowing ice wall
        for (let i = 0; i < (width / 64); i++) {
            this.add.rectangle(i * 64, height - 200, 60, 200, 0x66ccff).setOrigin(0);
        }

        // Display the selected character sprite
        try {
            // Check if it's the 'default' curtsoul sprite which uses 'p_idle'
            const animKey = this.selectedHero === 'default' ? 'p_idle' : `${this.selectedHero}_idle`;
            const spriteKey = this.selectedHero === 'default' ? 'p_i' : `${this.selectedHero}_idle_sheet`;
            this.heroSprite = this.add.sprite(width / 2, height - 100, spriteKey).setScale(2).setOrigin(0.5, 1);
            if (this.anims.exists(animKey)) {
                this.heroSprite.play(animKey);
            }
        } catch (e) {
            console.warn("Could not load character sprite for cutscene", e);
            this.add.rectangle(width / 2, height - 100, 32, 64, 0x00ffaa).setOrigin(0.5, 1); // fallback
        }

        let dialogueBox = this.add.rectangle(width / 2, height - 50, width - 100, 60, 0x000000, 0.8).setOrigin(0.5);
        this.dialogueText = this.add.text(width / 2, height - 50, '', {
            fontFamily: '"Press Start 2P"', fontSize: '14px', fill: '#fff', wordWrap: { width: width - 120 }, align: 'center'
        }).setOrigin(0.5);

        this.dialogueSequence = [
            { speaker: 'Shadow Guard', text: "You cannot pass. The firmament protects you from the truth." },
            { speaker: heroName, text: "Protection looks a lot like a cage. We're breaking out." },
            { speaker: 'System', text: "PRESS ENTER TO BREACH THE ICE WALL" }
        ];
        this.currentLine = 0;
        this.showNextLine();

        this.input.keyboard.on('keydown-ENTER', () => {
            if (this.currentLine < this.dialogueSequence.length) {
                this.showNextLine();
            } else {
                this.cameras.main.fadeOut(500, 0, 0, 0);
                this.time.delayedCall(500, () => {
                    this.scene.start('Level1_IceWall', { char: this.selectedHero });
                });
            }
        });
    }

    showNextLine() {
        let d = this.dialogueSequence[this.currentLine];
        let color = d.speaker === 'System' ? '#00ffaa' : (d.speaker === 'Shadow Guard' ? '#ff0055' : '#ffffff');
        this.dialogueText.setText(`${d.speaker}: ${d.text}`);
        this.dialogueText.setColor(color);
        this.currentLine++;
    }
}
