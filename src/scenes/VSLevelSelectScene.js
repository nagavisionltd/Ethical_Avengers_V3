class VSLevelSelectScene extends Phaser.Scene {
    constructor() {
        super('VSLevelSelectScene');
    }

    preload() {
        // Reuse celestial background for consistency
        // Video thumbnail could be a static grab, or we play the video small
    }

    create(data) {
        this.vsData = data; // Contains { p1, p2, isVS }

        // --- Background ---
        const bg = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'celestial_bg');
        const scaleX = this.cameras.main.width / bg.width;
        const scaleY = this.cameras.main.height / bg.height;
        bg.setScale(Math.max(scaleX, scaleY)).setTint(0x888888); // Dim it slightly

        // --- Title ---
        this.add.text(480, 50, 'SELECT ARENA', { 
            fontSize: '32px', fontFamily: '"Press Start 2P"', color: '#ffffff' 
        }).setOrigin(0.5);

        // --- Arena Options ---
        // For now, just one option: "Neon Circus" (Piccadilly)
        
        const arenaContainer = this.add.container(480, 270);
        
        // Arena Preview (Video or Image)
        let vidPreview;
        
        vidPreview = this.add.video(0, 0, 'vid_vs_bg_1');
        
        const safeResize = () => {
            if (vidPreview && vidPreview.active && vidPreview.texture && vidPreview.texture.key !== '__MISSING' && vidPreview.width > 0) {
                try {
                    vidPreview.setDisplaySize(400, 225);
                } catch (e) {
                    console.warn('Failed to resize vidPreview:', e);
                }
            }
        };

        vidPreview.on('playing', safeResize);
        vidPreview.on('locked', () => {
            vidPreview.setMute(true);
            vidPreview.play(true);
        });

        if (this.cache.video.exists('vid_vs_bg_1')) {
            vidPreview.setMute(true);
            vidPreview.play(true);
            
            // Immediate check if already ready
            if (vidPreview.width > 0) safeResize();
            
            this.time.delayedCall(200, safeResize);
        } else {
             vidPreview = this.add.rectangle(0, 0, 400, 225, 0x000000);
             this.add.text(0, 0, 'ARENA DATA MISSING', { fontSize: '10px' }).setOrigin(0.5);
        }

        const border = this.add.rectangle(0, 0, 410, 235).setStrokeStyle(4, 0x00ffaa);
        
        const nameText = this.add.text(0, 140, 'NEON CIRCUS', { 
            fontSize: '20px', fontFamily: '"Press Start 2P"', color: '#00ffaa' 
        }).setOrigin(0.5);

        arenaContainer.add([border, vidPreview, nameText]);
        
        // Interactive Zone
        const zone = this.add.zone(480, 270, 410, 235).setInteractive({ cursor: 'pointer' });
        
        zone.on('pointerover', () => {
            border.setStrokeStyle(4, 0xffffff);
            nameText.setColor('#ffffff');
        });
        
        zone.on('pointerout', () => {
            border.setStrokeStyle(4, 0x00ffaa);
            nameText.setColor('#00ffaa');
        });
        
        zone.on('pointerdown', () => {
            this.sound.play('sa');
            this.selectArena('vid_vs_bg_1');
        });

        // Back Button
        const backBtn = this.add.text(50, 50, '< BACK', {
            fontFamily: '"Press Start 2P"', fontSize: '16px', color: '#ffffff'
        }).setInteractive({ cursor: 'pointer' });
        
        backBtn.on('pointerdown', () => this.scene.start('VSCharacterSelectScene'));
    }

    selectArena(videoKey) {
        this.vsData.arenaVideo = videoKey;
        
        this.sound.stopAll();
        this.cameras.main.fadeOut(500);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('VSArenaScene', this.vsData);
        });
    }
}