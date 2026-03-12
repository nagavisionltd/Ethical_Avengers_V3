class VideoIntroScene extends Phaser.Scene {
    constructor() {
        super({ key: 'VideoIntroScene' });
    }

    create() {
        console.log("VIDEO_INTRO: Initializing v1.0");
        this.cameras.main.setBackgroundColor('#000000');

        // Sequence of video keys
        this.videoSequence = ['logo_intro', 'intro_clip_1', 'intro_clip_2'];
        this.currentVideoIndex = 0;

        // Setup the intro music but wait to play it until the first video actually starts
        this.introMusic = this.sound.add('intro_music', { volume: 0.8, loop: false });

        this.playNextVideo();

        // Skip logic: click or any key
        this.input.on('pointerdown', () => this.skipIntro());
        this.input.keyboard.on('keydown', () => this.skipIntro());
    }

    playNextVideo() {
        if (this.currentVideoIndex >= this.videoSequence.length) {
            this.finishIntro();
            return;
        }

        const videoKey = this.videoSequence[this.currentVideoIndex];
        console.log(`VIDEO_INTRO: Playing ${videoKey}`);

        const video = this.add.video(480, 270, videoKey);

        video.play();

        // Scale to fit inside 960x540 while preserving aspect ratio once it's playing
        video.once('play', () => {
            const width = video.videoData ? video.videoData.videoWidth : video.width;
            const height = video.videoData ? video.videoData.videoHeight : video.height;

            if (width > 0 && height > 0) {
                const scaleX = 960 / width;
                const scaleY = 540 / height;
                // Use Math.min to scale down to fit entirely inside the screen (letterbox if needed)
                const scale = Math.min(scaleX, scaleY);
                video.setScale(scale);
            }
        });

        video.on('complete', () => {
            video.destroy();
            this.currentVideoIndex++;
            this.playNextVideo();
        });

        // Error handling
        video.on('error', (err) => {
            console.error(`VIDEO_INTRO: Error playing ${videoKey}:`, err);
            video.destroy();
            this.currentVideoIndex++;
            this.playNextVideo();
        });
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
