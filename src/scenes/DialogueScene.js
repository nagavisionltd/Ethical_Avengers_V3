class DialogueScene extends Phaser.Scene {
    constructor() {
        super({ key: 'DialogueScene' });
        this.padding = 20;
        this.lineHeight = 24;
        this.dialogueBoxHeight = 150;
    }

    create(data) {
        this.sound.stopAll();
        this.sound.play('music_drama', { loop: true, volume: 0.6 });

        this.scriptKey = data.script;
        this.nextScene = data.nextScene || 'Main';
        this.sceneData = data.sceneData || {}; // Data to pass to the next scene
        this.script = DIALOGUE[this.scriptKey];

        if (!this.script) {
            console.error(`Dialogue script not found: ${this.scriptKey}`);
            this.scene.start(this.nextScene, this.sceneData);
            return;
        }

        this.createUI();

        this.dialogueIndex = 0;
        this.displayLine();

        this.input.keyboard.on('keydown-Z', this.advanceDialogue, this);
        this.input.keyboard.on('keydown-ENTER', this.advanceDialogue, this);
        this.input.on('pointerdown', this.advanceDialogue, this);
    }

    createUI() {
        // Add a looping background
        this.bg = this.add.tileSprite(0, 0, this.cameras.main.width, this.cameras.main.height, 'bg_boss').setOrigin(0);

        // Dialogue Box
        this.dialogueBox = this.add.nineslice(
            this.padding,
            this.cameras.main.height - this.dialogueBoxHeight - this.padding,
            this.cameras.main.width - (this.padding * 2),
            this.dialogueBoxHeight,
            'dialogue_box',
            24 // Corner slice size
        ).setOrigin(0);

        // Character Name Text
        this.nameText = this.add.text(
            this.padding * 2,
            this.cameras.main.height - this.dialogueBoxHeight,
            '',
            { fontFamily: '"Press Start 2P"', fontSize: '20px', color: '#00ffaa' }
        );

        // Dialogue Text with typewriter effect
        this.dialogueText = this.add.text(
            this.padding * 2,
            this.cameras.main.height - this.dialogueBoxHeight + 40,
            '',
            { fontFamily: '"Press Start 2P"', fontSize: '16px', color: '#ffffff', wordWrap: { width: this.cameras.main.width - (this.padding * 4) } }
        );

        // Character Portrait — use selected character's thumb
        const charThumbMap = {
            'default': 'chibi_soul_thumb', 'cherry': 'cherry_0000', 'adam': 'adam_0000',
            'bigz': 'bigz_thumb', 'ignite': 'ignite_portrait', 'ninja': 'cn_thumb'
        };
        const chosenChar = (this.sceneData && this.sceneData.char) || 'default';
        const portraitKey = charThumbMap[chosenChar] || 'chibi_soul_thumb';
        const actualPortrait = this.textures.exists(portraitKey) ? portraitKey : 'chibi_soul_thumb';
        this.portrait = this.add.sprite(this.cameras.main.width - this.padding, this.cameras.main.height - this.padding, actualPortrait).setOrigin(1, 1);
        // Auto-fit portrait to 120px box (cap at 3x)
        const maxPSize = 120;
        const pScale = Math.min(maxPSize / (this.portrait.width || 64), maxPSize / (this.portrait.height || 64), 3);
        this.portrait.setScale(pScale);
        this.portrait.setVisible(false);
    }

    displayLine() {
        if (this.dialogueIndex >= this.script.length) {
            this.endDialogue();
            return;
        }

        this.currentLine = this.script[this.dialogueIndex];

        // --- DYNAMIC CHARACTER NAME ---
        // Character name map for display
        const charNameMap = {
            'default': 'CHIBI SOUL', 'cherry': 'CHERRY', 'adam': 'ADAM',
            'bigz': 'BIG Z', 'ignite': 'DR. IGNITE', 'ninja': 'NEON NINJA'
        };
        const chosenChar = (this.sceneData && this.sceneData.char) || 'default';

        // If the dialogue line is a player char (not handler/npc), replace with selected char
        let displayName = this.currentLine.char.toUpperCase();
        if (this.currentLine.char !== 'handler') {
            displayName = charNameMap[chosenChar] || displayName;
        }
        this.nameText.setText(displayName);

        // Update portrait — for player lines, use selected character's thumb
        const charThumbForLine = {
            'default': 'chibi_soul_thumb', 'cherry': 'cherry_0000', 'adam': 'adam_0000',
            'bigz': 'bigz_thumb', 'ignite': 'ignite_portrait', 'ninja': 'cn_thumb'
        };
        if (this.currentLine.char !== 'handler') {
            // Player line — use selected character's portrait
            const playerThumb = charThumbForLine[chosenChar] || 'chibi_soul_thumb';
            if (this.textures.exists(playerThumb)) {
                this.portrait.setTexture(playerThumb);
                this.portrait.setVisible(true);
            } else {
                this.portrait.setVisible(false);
            }
        } else if (this.currentLine.portrait) {
            // Handler/NPC line — use script-defined portrait
            const pKey = this.currentLine.portrait;
            if (this.textures.exists(pKey)) {
                this.portrait.setTexture(pKey);
                this.portrait.setVisible(true);
            } else {
                this.portrait.setVisible(false);
            }
        } else {
            this.portrait.setVisible(false);
        }

        // Reset text and start typewriter
        this.dialogueText.setText('');
        this.isTyping = true;

        if (this.typewriterEvent) this.typewriterEvent.remove();

        let letterIndex = 0;
        this.typewriterEvent = this.time.addEvent({
            delay: 30, // Speed of typing
            callback: () => {
                if (this.dialogueText.active) {
                    this.dialogueText.setText(this.dialogueText.text + this.currentLine.text[letterIndex]);
                    letterIndex++;
                    if (letterIndex === this.currentLine.text.length) {
                        this.isTyping = false;
                        this.typewriterEvent.remove();
                    }
                }
            },
            repeat: this.currentLine.text.length - 1
        });

        this.dialogueIndex++;
    }

    advanceDialogue() {
        if (this.isTyping) {
            // If typing, insta-finish the line
            if (this.typewriterEvent) this.typewriterEvent.remove();
            this.dialogueText.setText(this.currentLine.text);
            this.isTyping = false;
        } else {
            // If not typing, display the next line
            this.displayLine();
        }
    }

    endDialogue() {
        if (this.scene.isActive()) {
            let video = null;
            let titleText = 'Stage 1: Beyond The Gate';

            // Check destination to determine title and video
            if (this.nextScene === 'KhemraScene' || this.nextScene === 'Level1_Hoverboard') {
                video = 'vid_intro_l1';
                titleText = 'Stage 1: The Forge World';
            } else if (this.nextScene === 'Level1_Antarctica') {
                titleText = 'Stage 1: Antarctica - Beyond The Ice';
            }

            this.scene.start('StageTitleScene', {
                title: titleText,
                nextScene: this.nextScene,
                sceneData: this.sceneData,
                videoKey: video
            });
        }
    }

    update() {
        if (this.bg) {
            this.bg.tilePositionX += 1; // Speed of the scroll
        }
    }
}
