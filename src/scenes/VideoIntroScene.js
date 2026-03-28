class VideoIntroScene extends Phaser.Scene {
    constructor() {
        super({ key: 'VideoIntroScene' });
    }

    create() {
        console.log("VIDEO_INTRO: Initializing v1.1 - Single Cinema Mode");
        this.cameras.main.setBackgroundColor('#000000');

        // Setup the intro music
        this.introMusic = this.sound.add('intro_music', { volume: 0.8, loop: false });
        if (this.introMusic) this.introMusic.play();

        // Single cinematic video instead of sequence
        const videoKey = 'intro_video';
        console.log(`VIDEO_INTRO: Playing ${videoKey}`);

        const video = this.add.video(480, 270, videoKey);
        video.play();

        // Scale to fit once playing
        video.once('play', () => {
            const width = video.videoData ? video.videoData.videoWidth : video.width;
            const height = video.videoData ? video.videoData.videoHeight : video.height;
            if (width > 0 && height > 0) {
                const scale = Math.min(960 / width, 540 / height);
                video.setScale(scale);
            }
        });

        video.on('complete', () => this.finishIntro());
        video.on('error', (err) => {
            console.error(`VIDEO_INTRO: Error playing ${videoKey}:`, err);
            this.finishIntro();
        });

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

        btnBg.on('pointerdown', () => this.skipIntro());

        // Fade in SKIP button after 2 seconds
        this.time.delayedCall(2000, () => {
            if (this.scene.isActive()) {
                this.tweens.add({ targets: skipBtnGroup, alpha: 1, duration: 800 });
            }
        });
    }

    playNextVideo() {
        // Obsolete in single video mode
    }

    skipIntro() {
        console.log("VIDEO_INTRO: Skipping intro");
        this.finishIntro();
    }

    finishIntro() {
        if (this.introMusic) {
            this.tweens.add({
                targets: this.introMusic,
                volume: 0,
                duration: 500,
                onComplete: () => {
                    this.introMusic.stop();
                    this.scene.start('ModeSelectScene');
                }
            });
        } else {
            this.scene.start('ModeSelectScene');
        }
    }
}
