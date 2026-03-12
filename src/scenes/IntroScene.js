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
        this.selectionData = data; // Store data from world select

        this.sound.stopAll();
        this.sound.play('music_drama', { loop: true, volume: 0.6 });

        const cx = this.cameras.main.width / 2;
        const cy = this.cameras.main.height / 2;

        const boxWidth = 600;
        const boxX = cx - (boxWidth / 2);

        // --- TOP HALF: VISUALS ---
        // Cinematic black backdrop
        this.cameras.main.setBackgroundColor('#050510');

        // Apply a mask to the visual top so its width exactly matches the 600px box width below it
        const videoMaskShape = this.add.graphics();
        videoMaskShape.fillStyle(0xffffff);
        // Box is centered, leaving some empty space on the sides
        videoMaskShape.fillRect(boxX, 0, boxWidth, 270); // Crop horizontally to boxWidth, vertically to mid-screen
        videoMaskShape.setVisible(false); // <--- FIX: Hide the mask shape so it doesn't render as a solid white box!

        const videoMask = videoMaskShape.createGeometryMask();

        // Intro Image Sequence
        this.introImages = [];
        for (let i = 1; i <= 4; i++) {
            const img = this.add.image(cx, 135, 'intro_img_' + i);
            // The generated images are usually 1024x1024. Display at 600x600 so they fit the box width and pan vertically
            img.setDisplaySize(600, 600);
            img.setAlpha(i === 1 ? 1 : 0);
            img.setMask(videoMask);
            this.introImages.push(img);

            // Give each image a slow, cinematic pan effect 
            this.tweens.add({
                targets: img,
                y: 165,
                duration: 20000,
                ease: 'Sine.easeInOut',
                yoyo: true,
                repeat: -1
            });
        }

        this.currentIntroImageIndex = 0;

        // Timer events to crossfade images as the text scrolls
        // Text takes about 33 seconds to scroll completely.
        this.time.delayedCall(8500, () => this.fadeToNextImage());
        this.time.delayedCall(17000, () => this.fadeToNextImage());
        this.time.delayedCall(25500, () => this.fadeToNextImage());

        // Add a sleek border separating top visual and bottom text
        const separator = this.add.graphics();
        separator.lineStyle(2, 0x00ffaa, 0.8);
        separator.beginPath();
        separator.moveTo(boxX, 270);
        separator.lineTo(boxX + boxWidth, 270);
        separator.strokePath();

        // Add subtle shadow drop below the separator
        const dropShadow = this.add.graphics();
        dropShadow.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0.8, 0.8, 0, 0);
        dropShadow.fillRect(boxX, 270, boxWidth, 20);

        // --- BOTTOM HALF: NARROW TEXT BOX ---
        // Semi-transparent UI box
        const textBg = this.add.graphics();
        textBg.fillStyle(0x000000, 0.95); // Deep pure black
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
            "Long ago, balance reigned between these realms.",
            "That balance was broken.",
            "",
            "A shadow organization now siphons resources,",
            "draining life, memory, emotion, and time itself.",
            "",
            "The Ethical Avengers have awakened.",
            "Their mission: Restore Equilibrium.",
            "",
            "First Target: KHEMRA - The Forge World.",
            "",
            "",
            "Press ENTER to continue"
        ];

        this.textObjects = [];

        // Start text just below the visible box area so it scrolls up
        let startY = boxY + boxHeight + 20;

        // Use a container/mask to clip text only inside the bottom box
        const textMaskShape = this.add.graphics();
        textMaskShape.fillStyle(0xffffff);
        textMaskShape.fillRect(boxX, boxY, boxWidth, boxHeight);
        textMaskShape.setVisible(false); // <--- FIX: Hide the mask shape here too!

        const textMask = textMaskShape.createGeometryMask();

        loreText.forEach(line => {
            const text = this.add.text(cx, startY, line, {
                fontFamily: '"Press Start 2P"',
                fontSize: '12px', // Slightly smaller to fit the box nicely
                color: '#00ffaa',
                align: 'center',
                wordWrap: { width: boxWidth - 40 }
            }).setOrigin(0.5, 0);

            text.setMask(textMask);
            this.textObjects.push(text);

            // Increment Y by the actual height of the rendered text + some padding
            // This prevents overlapping if a line wraps or is empty
            startY += text.height + 15;
        });

        this.scrollSpeed = 0.4; // Slower cinematic scroll
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    }

    fadeToNextImage() {
        if (this.currentIntroImageIndex >= this.introImages.length - 1) return;

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
        let allOffScreen = true;

        // The text is completely gone once it goes above the box
        const topLimit = 290;

        this.textObjects.forEach(text => {
            text.y -= this.scrollSpeed;
            // If the very bottom of the text is still below the upper limit of the box
            if (text.y + text.height > topLimit) {
                allOffScreen = false;
            }
        });

        // Ensure we don't accidentally skip the scene before the images fade
        if (this.currentIntroImageIndex < this.introImages.length) {
            allOffScreen = false;
        }

        if (Phaser.Input.Keyboard.JustDown(this.enterKey) || allOffScreen) {
            const isArcade = this.selectionData && this.selectionData.gameMode === 'arcade';
            if (isArcade) {
                // Arcade: go straight to first arcade level
                this.scene.start('StageTitleScene', {
                    title: 'Stage 1: Rocky Mountains',
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
}
