class DialogueScene extends Phaser.Scene {
    constructor() {
        super({ key: 'DialogueScene' });
        this.padding = 20;
        this.lineHeight = 24;
        this.dialogueBoxHeight = 150;
    }

    create(data) {
        this.sound.stopAll();
        this.sound.play('cutscene_bgm', { loop: true, volume: 0.6 });

        this.scriptKey = data.script;
        this.nextScene = data.nextScene || 'Main';
        this.sceneData = data.sceneData || {}; 
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
        this.bg = this.add.tileSprite(0, 0, this.cameras.main.width, this.cameras.main.height, 'bg_boss').setOrigin(0);
        this.dialogueBox = this.add.nineslice(this.padding, this.cameras.main.height - this.dialogueBoxHeight - this.padding, this.cameras.main.width - (this.padding * 2), this.dialogueBoxHeight, 'dialogue_box', 24).setOrigin(0);
        this.nameText = this.add.text(this.padding * 2, this.cameras.main.height - this.dialogueBoxHeight, '', { fontFamily: '"Press Start 2P"', fontSize: '20px', color: '#00ffaa' });
        this.dialogueText = this.add.text(this.padding * 2, this.cameras.main.height - this.dialogueBoxHeight + 40, '', { fontFamily: '"Press Start 2P"', fontSize: '16px', color: '#ffffff', wordWrap: { width: this.cameras.main.width - (this.padding * 4) } });

        const charThumbMap = {
            'default': 'hud_portrait_naga', 'cherry': 'hud_portrait_verona', 'adam': 'hud_portrait_leon',
            'bigz': 'hud_portrait_zeeko', 'ignite': 'hud_portrait_jack', 'ninja': 'cn_thumb', 'lordsoul': 'hud_portrait_naga'
        };
        const chosenChar = (this.sceneData && this.sceneData.char) || 'default';
        const portraitKey = charThumbMap[chosenChar] || 'hud_portrait_naga';
        const actualPortrait = this.textures.exists(portraitKey) ? portraitKey : 'hud_portrait_naga';
        this.portrait = this.add.sprite(this.cameras.main.width - this.padding, this.cameras.main.height - this.padding, actualPortrait).setOrigin(1, 1);
        const maxPSize = 120;
        const pScale = Math.min(maxPSize / (this.portrait.width || 64), maxPSize / (this.portrait.height || 64), 3);
        this.portrait.setScale(pScale);
        this.portrait.setVisible(false);
    }

    displayLine() {
        if (this.dialogueIndex >= this.script.length) { this.endDialogue(); return; }
        this.currentLine = this.script[this.dialogueIndex];

        const charNameMap = {
            'default': 'LORD SOUL', 'cherry': 'VERONA ROSE', 'adam': 'LEON G',
            'bigz': 'BIG ZEEKO', 'ignite': 'DR. JACK', 'ninja': 'NEELO-X', 'lordsoul': 'LORD SOUL'
        };
        const chosenChar = (this.sceneData && this.sceneData.char) || 'default';
        const playableChars = ['default', 'cherry', 'adam', 'bigz', 'ignite', 'ninja', 'lordsoul', 'player', 'lordsoul', 'leong', 'verona', 'zeeko', 'drjack'];
        
        const isPlayerLine = playableChars.includes(this.currentLine.char);
        let displayName = this.currentLine.char.toUpperCase();
        if (isPlayerLine) { displayName = charNameMap[chosenChar] || displayName; }
        this.nameText.setText(displayName);

        const charThumbForLine = {
            'default': 'hud_portrait_naga', 'cherry': 'hud_portrait_verona', 'adam': 'hud_portrait_leon',
            'bigz': 'hud_portrait_zeeko', 'ignite': 'hud_portrait_jack', 'ninja': 'cn_thumb', 'lordsoul': 'hud_portrait_naga'
        };
        if (isPlayerLine) {
            const playerThumb = charThumbForLine[chosenChar] || 'hud_portrait_naga';
            if (this.textures.exists(playerThumb)) { this.portrait.setTexture(playerThumb); this.portrait.setVisible(true); } 
            else this.portrait.setVisible(false);
        } else if (this.currentLine.portrait) {
            const pKey = this.currentLine.portrait;
            if (this.textures.exists(pKey)) { this.portrait.setTexture(pKey); this.portrait.setVisible(true); } 
            else this.portrait.setVisible(false);
        } else this.portrait.setVisible(false);

        this.dialogueText.setText('');
        this.isTyping = true;
        if (this.typewriterEvent) this.typewriterEvent.remove();
        let letterIndex = 0;
        this.typewriterEvent = this.time.addEvent({
            delay: 30,
            callback: () => {
                if (this.dialogueText.active) {
                    this.dialogueText.setText(this.dialogueText.text + this.currentLine.text[letterIndex]);
                    letterIndex++;
                    if (letterIndex === this.currentLine.text.length) { this.isTyping = false; this.typewriterEvent.remove(); }
                }
            },
            repeat: this.currentLine.text.length - 1
        });
        this.dialogueIndex++;
    }

    advanceDialogue() {
        if (this.isTyping) { if (this.typewriterEvent) this.typewriterEvent.remove(); this.dialogueText.setText(this.currentLine.text); this.isTyping = false; } 
        else this.displayLine();
    }

    endDialogue() {
        if (this.scene.isActive()) {
            if (this.sceneData && this.sceneData.isInternal) { this.scene.stop(); this.scene.resume(this.nextScene); return; }
            let video = null; let titleText = 'Stage 1: Beyond The Gate';
            if (this.nextScene === 'KhemraScene' || this.nextScene === 'Level1_Hoverboard') { video = 'vid_intro_l1'; titleText = 'Stage 1: The Forge World'; } 
            else if (this.nextScene === 'Level1_Antarctica') { titleText = 'Stage 1: Antarctica - Beyond The Ice'; }
            this.scene.start('StageTitleScene', { title: titleText, nextScene: this.nextScene, sceneData: this.sceneData, videoKey: video });
        }
    }

    update() { if (this.bg) this.bg.tilePositionX += 1; }
}