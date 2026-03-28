class IntroScene extends Phaser.Scene {
    constructor() {
        super({ key: 'IntroScene' });
    }

    preload() {
        // Ensure assets are loaded
        this.load.image('cosmic_background', 'assets/ui/cosmic_background.png');
        this.load.image('intro_img_1', 'assets/ui/intro/intro_firmament_1772397073446.png');
        this.load.image('intro_img_2', 'assets/ui/intro/intro_siphoning_1772397087624.png');
        this.load.image('intro_img_3', 'assets/ui/intro/intro_avengers_v2_1772397232364.png');
        this.load.image('intro_img_4', 'assets/ui/intro/intro_avengers_space_1772397307636.png');
    }

    create(data) {
        this.selectionData = data;
        const isArcade = data && data.gameMode === 'arcade';

        this.sound.stopAll();
        if (isArcade) {
            // Arcade Mode: Cinematic Video Intro
            this.sound.play('intro_music', { volume: 0.8 }); // Use intro music for cinematic feel
            
            this.video = this.add.video(480, 270, 'arcade_intro_video');
            this.video.play();
            
            // Scale to fit
            this.video.once('play', () => {
                const width = this.video.videoData ? this.video.videoData.videoWidth : this.video.width;
                const height = this.video.videoData ? this.video.videoData.videoHeight : this.video.height;
                if (width > 0 && height > 0) {
                    const scale = Math.min(this.scale.width / width, this.scale.height / height);
                    this.video.setScale(scale);
                }
            });

            this.video.on('complete', () => this.nextScene());

            // 2-Line White Text Overlay
            const textStyle = {
                fontFamily: '"Press Start 2P"',
                fontSize: '14px',
                color: '#ffffff',
                align: 'center',
                stroke: '#000000',
                strokeThickness: 4,
                shadow: { offsetX: 2, offsetY: 2, color: '#000', blur: 2, fill: true }
            };

            // this.introText1 = this.add.text(480, 440, "SOPHIA HAS BEEN SHATTERED. HER SOUL DISTILLED INTO P.O.G. SHARDS.", textStyle).setOrigin(0.5).setAlpha(0).setDepth(10);
            // this.introText2 = this.add.text(480, 470, "THE ETHICAL AVENGERS HAVE AWAKENED TO RESTORE THE COSMIC BALANCE.", textStyle).setOrigin(0.5).setAlpha(0).setDepth(10);

            // Fade in text sequentially (Disabled as requested)
            /*
            this.time.delayedCall(2000, () => {
                this.tweens.add({ targets: this.introText1, alpha: 1, duration: 1000 });
            });
            this.time.delayedCall(5000, () => {
                this.tweens.add({ targets: this.introText2, alpha: 1, duration: 1000 });
            });
            */

        } else {
            // Story Mode: Scrolling Lore Text & Image Sequence
            this.sound.play('cutscene_bgm', { loop: true, volume: 0.6 });

            const cx = this.cameras.main.width / 2;
            const cy = this.cameras.main.height / 2;
            const boxWidth = 600;
            const boxX = cx - (boxWidth / 2);

            this.cameras.main.setBackgroundColor('#050510');

            const videoMaskShape = this.add.graphics();
            videoMaskShape.fillStyle(0xffffff);
            videoMaskShape.fillRect(boxX, 0, boxWidth, 270);
            videoMaskShape.setVisible(false);

            const videoMask = videoMaskShape.createGeometryMask();

            this.introImages = [];
            for (let i = 1; i <= 4; i++) {
                const img = this.add.image(cx, 135, 'intro_img_' + i);
                img.setDisplaySize(600, 600);
                img.setAlpha(i === 1 ? 1 : 0);
                img.setMask(videoMask);
                this.introImages.push(img);

                this.tweens.add({
                    targets: img, y: 165, duration: 20000, ease: 'Sine.easeInOut', yoyo: true, repeat: -1
                });
            }

            this.currentIntroImageIndex = 0;
            this.time.delayedCall(8500, () => this.fadeToNextImage());
            this.time.delayedCall(17000, () => this.fadeToNextImage());
            this.time.delayedCall(25500, () => this.fadeToNextImage());

            const separator = this.add.graphics();
            separator.lineStyle(2, 0x00ffaa, 0.8);
            separator.beginPath();
            separator.moveTo(boxX, 270);
            separator.lineTo(boxX + boxWidth, 270);
            separator.strokePath();

            const textBg = this.add.graphics();
            textBg.fillStyle(0x000000, 0.95);
            textBg.lineStyle(2, 0x008855, 1);
            const boxHeight = 220;
            const boxY = 290;
            textBg.fillRoundedRect(boxX, boxY, boxWidth, boxHeight, 10);
            textBg.strokeRoundedRect(boxX, boxY, boxWidth, boxHeight, 10);

            const loreText = [
                "A long time ago, in a digital realm far, far away...",
                "",
                "Earth is not a planet drifting freely through space.",
                "It is a sealed realm—encased within a firmament.",
                "Beyond this shell exist other enclosed worlds.",
                "",
                "The Goddess SOPHIA has been shattered.",
                "Her essence distilled into P.O.G. soul shards.",
                "",
                "A shadow organization now siphons these shards,",
                "draining the creative fire and memory of the cosmos.",
                "",
                "The Ethical Avengers have awakened.",
                "Their mission: Retrieve the Shards, Restore Sophia.",
                "",
                "First Target: KHEMRA - The Forge World.",
                "",
                "",
                "Press ENTER to continue"
            ];

            this.textObjects = [];
            let startY = boxY + boxHeight + 20;

            const textMaskShape = this.add.graphics();
            textMaskShape.fillStyle(0xffffff);
            textMaskShape.fillRect(boxX, boxY, boxWidth, boxHeight);
            textMaskShape.setVisible(false);

            const textMask = textMaskShape.createGeometryMask();

            loreText.forEach(line => {
                const text = this.add.text(cx, startY, line, {
                    fontFamily: '"Press Start 2P"',
                    fontSize: '12px',
                    color: '#00ffaa',
                    align: 'center',
                    wordWrap: { width: boxWidth - 40 }
                }).setOrigin(0.5, 0);

                text.setMask(textMask);
                this.textObjects.push(text);
                startY += text.height + 15;
            });

            this.scrollSpeed = 0.4;
        }

        // Press Enter or Space to skip keyboard fallback
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // --- INTERACTIVE SKIP BUTTON ---
        const skipBtnGroup = this.add.container(920, 510).setDepth(101).setAlpha(0);
        
        const btnBg = this.add.rectangle(0, 0, 100, 40, 0x000000, 0.7)
            .setStrokeStyle(2, 0x00ffaa, 0.8)
            .setInteractive({ useHandCursor: true });
            
        const btnText = this.add.text(0, 0, 'SKIP', {
            fontFamily: '"Press Start 2P"',
            fontSize: '14px',
            fill: '#00ffaa'
        }).setOrigin(0.5);

        skipBtnGroup.add([btnBg, btnText]);

        btnBg.on('pointerover', () => {
            btnBg.setFillStyle(0x00ffaa, 0.3);
            btnText.setFillStyle(0xffffff);
        });

        btnBg.on('pointerout', () => {
            btnBg.setFillStyle(0x000000, 0.7);
            btnText.setFillStyle(0x00ffaa);
        });

        btnBg.on('pointerdown', () => this.nextScene());

        // Fade in SKIP button after 2 seconds
        this.time.delayedCall(2000, () => {
            if (this.scene.isActive()) {
                this.tweens.add({ targets: skipBtnGroup, alpha: 1, duration: 800 });
            }
        });
    }

    fadeToNextImage() {
        if (!this.introImages || this.currentIntroImageIndex >= this.introImages.length - 1) return;

        const currentImg = this.introImages[this.currentIntroImageIndex];
        this.currentIntroImageIndex++;
        const nextImg = this.introImages[this.currentIntroImageIndex];

        this.tweens.add({
            targets: currentImg,
            alpha: 0,
            duration: 2500,
            ease: 'Power2'
        });

        this.tweens.add({
            targets: nextImg,
            alpha: 1,
            duration: 2500,
            ease: 'Power2'
        });
    }

    update() {
        if (this.textObjects) {
            let allOffScreen = true;
            const topLimit = 290;

            this.textObjects.forEach(text => {
                text.y -= this.scrollSpeed;
                if (text.y + text.height > topLimit) {
                    allOffScreen = false;
                }
            });

            if (this.currentIntroImageIndex < (this.introImages ? this.introImages.length : 0)) {
                allOffScreen = false;
            }

            if (Phaser.Input.Keyboard.JustDown(this.enterKey) || Phaser.Input.Keyboard.JustDown(this.spaceKey) || allOffScreen) {
                this.nextScene();
            }
        } else if (Phaser.Input.Keyboard.JustDown(this.enterKey) || Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.nextScene();
        }
    }

    nextScene() {
        if (this.isTransitioning) return;
        this.isTransitioning = true;
        this.sound.stopAll();

        const isArcade = this.selectionData && this.selectionData.gameMode === 'arcade';
        if (isArcade) {
            // Arcade: go straight to first arcade level
            const firstLevel = (typeof ARCADE_LEVELS !== 'undefined') ? ARCADE_LEVELS[0] : { title: 'Stage 1' };
            this.scene.start('StageTitleScene', {
                title: firstLevel.title,
                nextScene: 'GenericTilemapScene',
                sceneData: { ...this.selectionData, arcadeStageIndex: 0 }
            });
        } else {
            // Story: go through dialogue, then to Antarctica
            this.scene.start('DialogueScene', {
                script: 'level1_intro',
                nextScene: 'Level1_Antarctica',
                sceneData: this.selectionData
            });
        }
    }
}
