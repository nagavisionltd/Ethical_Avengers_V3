class DebugWalkerScene extends Phaser.Scene {
    constructor() {
        super({ key: 'DebugWalkerScene' });
    }

    preload() {
        console.log('[DEBUG_WALKER] Preloading...');
        // 1. Load ONLY the problematic texture.
        this.load.image('walker_i', 'assets/images/enemies/alien-walking-enemy/PNG/alien-enemy-idle.png');
        
        this.load.on('loaderror', (file) => console.error(`[DEBUG_WALKER] FAILED TO LOAD: ${file.key}`));
        this.load.on('complete', () => console.log('[DEBUG_WALKER] Preload Complete. Textures in cache:', this.textures.getTextureKeys()));
    }

    create() {
        console.log('[DEBUG_WALKER] Creating scene...');
        this.cameras.main.setBackgroundColor('#4d4d4d');

        // 2. Check if the texture exists after preload.
        if (!this.textures.exists('walker_i')) {
            this.add.text(100, 100, 'TEST FAILED: Texture "walker_i" does not exist in cache.', { color: '#ff0000', fontSize: '16px' });
            return;
        }
        
        const tex = this.textures.get('walker_i');
        if (tex.key === '__MISSING__') {
            this.add.text(100, 100, 'TEST FAILED: Texture "walker_i" is the MISSING texture.', { color: '#ff0000', fontSize: '16px' });
            return;
        }

        console.log('[DEBUG_WALKER] Texture "walker_i" found. Slicing...');

        // 3. Slice the texture into frames.
        const walkerIdleFrames = Array.from({length: 4}, (v, i) => ({ x: i * 48, w: 48 }));
        walkerIdleFrames.forEach((d, i) => tex.add(`f${i}`, 0, d.x, 0, d.w, 48));
        
        console.log('[DEBUG_WALKER] Slicing complete. Creating animation...');
        
        // 4. Create the animation.
        this.anims.create({ 
            key: 'walker_idle_debug', 
            frames: this.anims.generateFrameNames('walker_i', { prefix: 'f', end: 3 }), 
            frameRate: 8, 
            repeat: -1 
        });

        console.log('[DEBUG_WALKER] Animation created. Spawning sprite...');

        // 5. Create and play the sprite.
        try {
            const w = this.add.sprite(480, 270, 'walker_i', 'f0').setScale(4);
            w.play('walker_idle_debug');
            this.add.text(100, 100, 'TEST SUCCEEDED: Walker is animating.', { color: '#00ff00', fontSize: '16px' });
        } catch (e) {
            this.add.text(100, 100, 'TEST FAILED: Crashed on sprite creation/playback.', { color: '#ff0000', fontSize: '16px' });
            console.error('[DEBUG_WALKER] Crash during sprite playback.', e);
        }
    }
}