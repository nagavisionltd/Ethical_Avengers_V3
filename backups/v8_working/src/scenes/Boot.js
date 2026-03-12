class Boot extends Phaser.Scene {
    constructor() { super('Boot'); }
    preload() {
        const b = 'assets/images/characters/curt-soul/';
        this.load.image('p_i', b+'idle.png'); 
        this.load.image('p_r', b+'run.png');
        this.load.image('p_jv', b+'jump_vertical.png'); 
        this.load.image('p_jh', b+'jump_horizontal.png');
        this.load.image('p_cr', b+'crouch.png'); 
        this.load.image('p_a', b+'attack.png');
        this.load.image('p_s', b+'attack_blast.png'); 
        this.load.image('orb', b+'attack_projectile_blasts.png');
        
        this.load.image('boss_tex', 'assets/images/enemies/enemy-cyborg.png');
        this.load.image('walker_i', 'assets/images/enemies/alien-walking-enemy/PNG/alien-enemy-idle.png');
        this.load.image('walker_w', 'assets/images/enemies/alien-walking-enemy/PNG/alien-enemy-walk.png');
        for(let i=1; i<=8; i++) this.load.image(`drone${i}`, `assets/images/enemies/alien-flying-enemy/sprites/alien-enemy-flying${i}.png`);
        
        const dj = 'assets/images/characters/dr-jack/';
        this.load.image('dj_i', dj+'rebourne_idle.png');
        this.load.image('dj_r', dj+'rebourne_run.png');
        this.load.image('dj_a', dj+'rebourne_attack.png');
        
        this.load.image('exp', 'assets/images/Explosion/spritesheet/explosion-animation.png');
        this.load.image('bg1', 'assets/images/backgrounds/level1bgwide.png');
        this.load.image('bg_wall', 'assets/images/Environments/bulkhead-walls/PNG/bg-wall.png');
        this.load.image('bg_wall_supports', 'assets/images/Environments/bulkhead-walls/PNG/bg-wall-with-supports.png');
        this.load.image('fg_decor', 'assets/images/Environments/bulkhead-walls/PNG/foreground.png');
        this.load.image('floor', 'assets/images/Environments/bulkhead-walls/PNG/floor.png');
        this.load.image('sky', 'assets/images/Environments/another-world/PNG/layered/sky.png');
        this.load.image('towers', 'assets/images/Environments/another-world/PNG/layered/back-towers.png');
        this.load.image('bg2', 'assets/images/Environments/another-world/PNG/layered/composed-bg.png');
        this.load.image('neon_on', 'assets/images/tiles/neon_on_v1.png');
        this.load.image('neon_off', 'assets/images/tiles/neon_off_v1.png');
        for(let i=1; i<=3; i++) this.load.image(`steam${i}`, `assets/images/tiles/vent_steam_${i}.png`);
        this.load.image('bg_boss', 'assets/images/backgrounds/boss-fight-2.png');
        this.load.image('portal', 'assets/images/Objects/DoorOpen.png');
        
        this.load.audio('m1', 'assets/music/Neon Shadows - LEVEL 1.mp3');
        this.load.audio('m2', 'assets/music/Neon Shadows PART 2 LEVEL 2.mp3');
        this.load.audio('mc', 'assets/music/Shadows in the Alley - CUT SCENES.mp3');
        this.load.audio('sj', 'assets/sfx/snd_jump.ogg'); 
        this.load.audio('sa', 'assets/sfx/snd_snap.ogg'); 
        this.load.audio('sh', 'assets/sfx/snd_hurt.ogg');
    }

    create() {
        const t = this.textures;
        const slice = (k, f, h=106) => {
            const tex = t.get(k);
            f.forEach((v, i) => tex.add(`f${i}`, 0, v.x, 0, v.w, h));
        };
        
        slice('p_i', D.p.idle); slice('p_r', D.p.run); slice('p_jv', D.p.jv);
        slice('p_jh', D.p.jh); slice('p_cr', D.p.cr); slice('p_a', D.p.atk);
        slice('p_s', D.p.sh); slice('orb', D.orb);
        
        const wIT = t.get('walker_i'); for(let i=0; i<4; i++) wIT.add(`f${i}`, 0, i*48, 0, 48, 48);
        const wWT = t.get('walker_w'); for(let i=0; i<6; i++) wWT.add(`f${i}`, 0, i*57, 0, 57, 42);
        const djI = t.get('dj_i'); for(let i=0; i<10; i++) djI.add(`f${i}`, 0, i*53, 0, 53, 100);
        const djR = t.get('dj_r'); for(let i=0; i<6; i++) djR.add(`f${i}`, 0, i*110, 0, 110, 101);
        const djA = t.get('dj_a'); for(let i=0; i<9; i++) djA.add(`f${i}`, 0, i*100, 0, 100, 106);
        const exT = t.get('exp'); for(let i=0; i<9; i++) exT.add(`f${i}`, 0, i*112, 0, 112, 128);
        
        const bT = t.get('boss_tex');
        D.boss.forEach((y, r) => { for(let c=0; c<11; c++) bT.add(`b${c}_${r}`, 0, c*256, y, 256, 400); });

        const createAnim = (name, texKey, dataArray, loop = false, fps = 12) => {
            this.anims.create({
                key: name,
                frames: dataArray.map((v, i) => ({ key: texKey, frame: `f${i}`, duration: v.d || undefined })),
                frameRate: fps,
                repeat: loop ? -1 : 0
            });
        };

        createAnim('idle', 'p_i', D.p.idle, true);
        createAnim('run', 'p_r', D.p.run, true);
        createAnim('jump_v', 'p_jv', D.p.jv);
        createAnim('jump_h', 'p_jh', D.p.jh);
        createAnim('crouch', 'p_cr', D.p.cr);
        createAnim('shoot', 'p_s', D.p.sh);
        createAnim('orb_f', 'orb', D.orb, true);
        
        // Correct combo mapping: Use the actual sheet indices from D.p.atk
        const createCombo = (n, indices) => {
            this.anims.create({
                key: `atk${n}`,
                frames: indices.map(idx => ({ key: 'p_a', frame: `f${idx}`, duration: D.p.atk[idx].d || undefined })),
                frameRate: 15
            });
        };

        createCombo(1, [0]); 
        createCombo(2, [1]); 
        createCombo(3, [2]); 
        createCombo(4, [3, 4]); 
        createCombo(5, [5]); 
        createCombo(6, [6]);

        createAnim('walker_idle', 'walker_i', [{},{},{},{}], true, 8);
        createAnim('walker_walk', 'walker_w', [{},{},{},{},{},{}], true, 10);
        this.anims.create({ key: 'drone_fly', frames: Array.from({length:8}, (_,i) => ({key: `drone${i+1}`})), frameRate: 12, repeat: -1 });
        createAnim('dj_idle', 'dj_i', Array(10).fill({}), true, 10);
        createAnim('dj_run', 'dj_r', Array(6).fill({}), true, 12);
        createAnim('dj_atk', 'dj_a', Array(9).fill({}), false, 12);
        this.anims.create({ key: 'neon_flicker', frames: [ {key:'neon_on'}, {key:'neon_off'}, {key:'neon_on'}, {key:'neon_on'}, {key:'neon_off'} ], frameRate: 4, repeat: -1 });
        this.anims.create({ key: 'steam_anim', frames: [ {key:'steam1'}, {key:'steam2'}, {key:'steam3'} ], frameRate: 6, repeat: -1 });
        createAnim('explode', 'exp', Array(9).fill({}), false, 15);
        this.anims.create({ key: 'b_i', frames: [ {key:'boss_tex', frame:'b0_0'}, {key:'boss_tex', frame:'b1_0'} ], frameRate: 8, repeat: -1 });

        this.scene.start('Main');
    }
}