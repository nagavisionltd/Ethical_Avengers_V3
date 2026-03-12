class StageTitleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StageTitleScene' });
    }

    create(data) {
        const { title = 'Stage 1', nextScene = 'Main', sceneData = {}, videoKey = null } = data;
        console.log('StageTitleScene Create - VideoKey:', videoKey);

        this.cameras.main.setBackgroundColor('#000000');
        
        let duration = 3000;

        if (videoKey && this.cache.video.exists(videoKey)) {
            // Play Video
            const vid = this.add.video(this.cameras.main.width / 2, this.cameras.main.height / 2, videoKey);
            
            // Force fit to screen (Safe Resize)
            const safeResize = () => {
                if (vid && vid.active && vid.texture && vid.texture.key !== '__MISSING' && vid.width > 0) {
                    try {
                        vid.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
                    } catch (e) {
                        console.warn('Failed to resize StageTitle video:', e);
                    }
                }
            };

            vid.on('playing', safeResize);
            
            vid.play();
            vid.setVolume(1.0); 
            
            if (vid.width > 0) safeResize();
            
            // Fallback resize attempt
            this.time.delayedCall(200, safeResize);
            
            // Allow skipping
            const skipText = this.add.text(this.cameras.main.width - 20, this.cameras.main.height - 20, 'PRESS ANY KEY TO SKIP', {
                fontFamily: '"Press Start 2P"', fontSize: '10px', color: '#ffffff'
            }).setOrigin(1);
            
            this.input.keyboard.on('keydown', () => {
                vid.stop();
                this.finishScene(nextScene, sceneData);
            });
            
            vid.on('complete', () => {
                this.finishScene(nextScene, sceneData);
            });

        } else {
            // Standard Text Intro
            this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, title, {
                fontFamily: '"Press Start 2P"',
                fontSize: '28px',
                color: '#ffffff',
                align: 'center',
                padding: { x: 10, y: 10 }
            }).setOrigin(0.5);
            
            this.time.delayedCall(duration, () => {
                this.finishScene(nextScene, sceneData);
            });
        }
    }

    finishScene(nextScene, sceneData) {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            this.scene.start(nextScene, sceneData);
        });
    }
}