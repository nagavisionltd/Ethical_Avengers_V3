// A dedicated Boot scene for the Warped City template
// to isolate asset loading and prevent conflicts with the full game's assets.
class BootWarped extends Phaser.Scene {
    constructor() { super('Boot'); } // MUST use 'Boot' key as it's the first scene in the list
    
    preload() {
        console.log('BootWarped: Preloading assets...');
        
        this.load.on('loaderror', (file) => {
            console.error('Asset failed to load:', file.key, file.url);
        });
        
        // --- WARPED CITY ASSETS ---
        const wcPath = 'new_tilesets/warped_city_files/';
        this.load.image('warped_tileset', wcPath + 'ENVIRONMENT/tileset.png');
        this.load.image('warped_sky_a', wcPath + 'ENVIRONMENT/background/skyline-a.png');
        this.load.image('warped_sky_b', wcPath + 'ENVIRONMENT/background/skyline-b.png');
        this.load.image('warped_near_bg', wcPath + 'ENVIRONMENT/background/near-buildings-bg.png');
        this.load.image('warped_far_bg', wcPath + 'ENVIRONMENT/background/buildings-bg.png');
        this.load.image('warped_prop_antenna', wcPath + 'ENVIRONMENT/props/antenna.png');
        this.load.image('warped_vehicle_police', wcPath + 'SPRITES/vehicles/v-police.png');
        this.load.image('warped_vehicle_truck', wcPath + 'SPRITES/vehicles/v-truck.png');
        for(let i=1; i<=4; i++) this.load.image(`wc_neon_${i}`, wcPath + `ENVIRONMENT/props/banner-neon/banner-neon-${i}.png`);
        for(let i=1; i<=4; i++) this.load.image(`wc_monitor_${i}`, wcPath + `ENVIRONMENT/props/monitorface/monitor-face-${i}.png`);
        
        // --- PLAYER & ENEMY ASSETS NEEDED FOR CYBERCITY ---
        this.load.image('dialogue_box', 'assets/ui/dialogue_box.png');

        // Cherry (Default Player)
        const loadFrames = (prefix, frames, path = 'assets/images/characters/cherry/') => {
            frames.forEach(n => {
                const num = n.toString().padStart(4, '0');
                this.load.image(`${prefix}_${num}`, `${path}${prefix}_${num}.png`);
            });
        };
        const f_idle = [0, 3, 6, 9, 12, 15, 18]; 
        const f_run = [24, 26, 28, 29, 31, 33, 35, 37, 38, 40, 42];
        const f_jump = [130, 132, 134, 138, 140, 143, 146, 150, 153, 156, 158];
        const f_atk1 = [235, 237, 239];
        const f_atk2 = [235, 237, 239];
        const f_atk3 = [240, 242, 243];
        const f_atk4 = [247, 249, 251, 253, 254];
        const f_atk5 = [274, 276, 278, 280, 281, 282];
        loadFrames('cherry', [...f_idle, ...f_run, ...f_jump, ...f_atk1, ...f_atk2, ...f_atk3, ...f_atk4, ...f_atk5]);

        // Enemies
        this.load.image('walker_i', 'assets/images/enemies/alien-walking-enemy/PNG/alien-enemy-idle.png');
        this.load.image('walker_w', 'assets/images/enemies/alien-walking-enemy/PNG/alien-enemy-walk.png');
        for(let i=1; i<=8; i++) this.load.image(`drone${i}`, `assets/images/enemies/alien-flying-enemy/sprites/alien-enemy-flying${i}.png`);

        // Destructibles & VFX
        this.load.image('exp', 'assets/images/Explosion/spritesheet/explosion-animation.png');
        this.load.image('barrel1', 'assets/images/Objects/Barrel (1).png');
        this.load.image('box', 'assets/images/Objects/Box.png');
        this.load.image('orb', 'assets/images/characters/curt-soul/attack_projectile_blasts.png');

        // Audio
        this.load.audio('m1', 'assets/music/Neon Shadows - LEVEL 1.mp3');
        this.load.audio('sh', 'assets/sfx/snd_hurt.ogg');
    }

    create() {
        console.log('BootWarped: Creating animations...');

        // --- ANIMATION CREATION ---
        const createModernAnim = (key, prefix, frameNumbers, fps = 24, repeat = 0) => {
            const validFrames = frameNumbers.map(n => `${prefix}_${n.toString().padStart(4, '0')}`).filter(k => this.textures.exists(k));
            if (validFrames.length > 0) {
                this.anims.create({ key: key, frames: validFrames.map(k => ({ key: k })), frameRate: fps, repeat: repeat });
            }
        };

        const createAnim = (name, texKey, frameCount, loop = false, fps = 12) => {
            if (!this.textures.exists(texKey)) return;
            this.anims.create({
                key: name,
                frames: this.anims.generateFrameNumbers(texKey, { start: 0, end: frameCount - 1 }),
                frameRate: fps,
                repeat: loop ? -1 : 0
            });
        };

        // Player
        createModernAnim('cherry_idle', 'cherry', [0, 3, 6, 9, 12, 15, 18], 12, -1);
        createModernAnim('cherry_run', 'cherry', [24, 26, 28, 29, 31, 33, 35, 37, 38, 40, 42], 12, -1);
        createModernAnim('cherry_jump', 'cherry', [130, 132, 134, 138, 140, 143, 146, 153, 156, 158], 12, 0);
        createModernAnim('cherry_atk1', 'cherry', [235, 237, 239], 16, 0);
        createModernAnim('cherry_atk2', 'cherry', [235, 237, 239], 16, 0);
        createModernAnim('cherry_atk3', 'cherry', [240, 242, 243], 16, 0);
        createModernAnim('cherry_atk4', 'cherry', [247, 249, 251, 253, 254], 16, 0);
        createModernAnim('cherry_atk5', 'cherry', [274, 276, 278, 280, 281, 282], 24, 0);

        // Enemies
        createAnim('walker_idle', 'walker_i', 4, true, 8);
        createAnim('walker_walk', 'walker_w', 6, true, 10);
        const droneFrames = [];
        for(let i=1; i<=8; i++) if (this.textures.exists(`drone${i}`)) droneFrames.push({ key: `drone${i}` });
        if (droneFrames.length > 0) this.anims.create({ key: 'drone_fly', frames: droneFrames, frameRate: 12, repeat: -1 });

        // Warped City Props
        const neonFrames = [];
        for(let i=1; i<=4; i++) if (this.textures.exists(`wc_neon_${i}`)) neonFrames.push({ key: `wc_neon_${i}` });
        if (neonFrames.length > 0) this.anims.create({ key: 'wc_neon_anim', frames: neonFrames, frameRate: 6, repeat: -1 });
        
        const monitorFrames = [];
        for(let i=1; i<=4; i++) if (this.textures.exists(`wc_monitor_${i}`)) monitorFrames.push({ key: `wc_monitor_${i}` });
        if (monitorFrames.length > 0) this.anims.create({ key: 'wc_monitor_anim', frames: monitorFrames, frameRate: 4, repeat: -1 });
        
        // VFX
        createAnim('explode', 'exp', 9, false, 15);
        
        // --- START GAME ---
        console.log('BootWarped: Starting CyberCity scene...');
        this.scene.start('CyberCity');
    }
}
