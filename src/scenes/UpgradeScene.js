class UpgradeScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UpgradeScene' });
    }

    create(data) {
        this.selectionData = data;
        const charKey = data.char || 'cherry';
        const { width, height } = this.scale;

        // --- Background ---
        this.add.image(width / 2, height / 2, 'celestial_bg').setAlpha(0.5);
        this.add.rectangle(width / 2, height / 2, width - 100, height - 100, 0x000000, 0.8).setStrokeStyle(2, 0x00ffaa);

        // --- Title ---
        this.add.text(width / 2, 80, 'CHARACTER AUGMENTATION', {
            fontSize: '24px', fontFamily: '"Press Start 2P"', color: '#00ffaa'
        }).setOrigin(0.5);

        // --- Character Info ---
        const charStats = this.registry.get('charStats');
        this.stats = charStats[charKey];
        this.points = this.registry.get('upgradePoints') || 0;

        this.pointsText = this.add.text(width / 2, 130, `AVAILABLE POINTS: ${this.points}`, {
            fontSize: '16px', fontFamily: '"Press Start 2P"', color: '#ffd700'
        }).setOrigin(0.5);

        // --- Stat Rows ---
        this.rows = [];
        this.createStatRow(300, 220, 'HEALTH', 'health', 0x00ffaa);
        this.createStatRow(300, 300, 'POWER', 'power', 0xff0055);
        this.createStatRow(300, 380, 'SPEED', 'speed', 0x00aaff);

        // --- Character Preview ---
        const previewX = 750;
        const previewY = 300;
        let animKey = `${charKey}_idle`;
        if (charKey === 'default') animKey = 'idle';
        if (charKey === 'bigz') animKey = 'bigz_idle';

        const sprite = this.add.sprite(previewX, previewY, charKey).setScale(charKey === 'bigz' ? 1.5 : 0.8);
        if (this.anims.exists(animKey)) sprite.play(animKey);

        this.add.text(previewX, previewY + 100, charKey.toUpperCase(), {
            fontSize: '18px', fontFamily: '"Press Start 2P"', color: '#fff'
        }).setOrigin(0.5);

        // --- Back Button ---
        const backBtn = this.add.text(width / 2, 480, 'RETURN TO SECTOR MAP', {
            fontSize: '16px', fontFamily: '"Press Start 2P"', color: '#ffffff', backgroundColor: '#333', padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive({ cursor: 'pointer' });

        backBtn.on('pointerdown', () => {
            this.sound.play('sa');
            this.scene.start('WorldSelectScene', this.selectionData);
        });
    }

    createStatRow(x, y, label, statKey, color) {
        this.add.text(x, y, label, { fontSize: '14px', fontFamily: '"Press Start 2P"', color: '#fff' }).setOrigin(1, 0.5);
        
        // Bar Background
        this.add.rectangle(x + 20, y, 200, 20, 0x333333).setOrigin(0, 0.5);
        
        // Bar Fill
        const fill = this.add.rectangle(x + 20, y, 20 * this.stats[statKey], 20, color).setOrigin(0, 0.5);
        
        // Level Text
        const levelText = this.add.text(x + 230, y, `LVL ${this.stats[statKey]}`, {
            fontSize: '12px', fontFamily: '"Press Start 2P"'
        }).setOrigin(0, 0.5);

        // Upgrade Button
        const upBtn = this.add.text(x + 320, y, '[ + ]', {
            fontSize: '14px', fontFamily: '"Press Start 2P"', color: '#ffd700'
        }).setOrigin(0, 0.5).setInteractive({ cursor: 'pointer' });

        upBtn.on('pointerdown', () => {
            if (this.points > 0 && this.stats[statKey] < 10) {
                this.sound.play('sa');
                this.points--;
                this.stats[statKey]++;
                
                // Update Registry
                const allStats = this.registry.get('charStats');
                allStats[this.selectionData.char] = this.stats;
                this.registry.set('charStats', allStats);
                this.registry.set('upgradePoints', this.points);

                // Update UI
                fill.width = 20 * this.stats[statKey];
                levelText.setText(`LVL ${this.stats[statKey]}`);
                this.pointsText.setText(`AVAILABLE POINTS: ${this.points}`);
                
                if (this.points === 0) {
                    // Visual cue that points are gone
                    this.pointsText.setColor('#ff0000');
                }
            }
        });

        upBtn.on('pointerover', () => upBtn.setColor('#fff'));
        upBtn.on('pointerout', () => upBtn.setColor('#ffd700'));
    }
}