class AnimationCreatorScene extends Phaser.Scene {
    constructor() {
        super('AnimationCreatorScene');
    }

    create() {
        console.log("--- AnimationCreatorScene: Starting animation creation... ---");

        // --- TEXTURE SLICING ---
        const slice = (key, frameData, frameHeight = 106) => {
            const tex = this.textures.get(key);
            if (tex && tex.key !== '__MISSING__') {
                frameData.forEach((d, i) => tex.add(`f${i}`, 0, d.x, 0, d.w, frameHeight));
            }
        };

        // Slice sheets that need it
        slice('p_i', [ {x:0, w:51}, {x:108, w:53} ]);
        slice('p_r', [ {x:0, w:79}, {x:107, w:79}, {x:216, w:79}, {x:319, w:89} ]);
        slice('p_jv', [ {x:0, w:59}, {x:102, w:62}, {x:201, w:63} ]);
        slice('p_a', [ {x:0, w:80}, {x:108, w:104}, {x:214, w:101} ]);

        const walkerIdleFrames = Array.from({length: 4}, (v, i) => ({ x: i * 48, w: 48 }));
        slice('walker_i', walkerIdleFrames, 48);
        const walkerWalkFrames = Array.from({length: 6}, (v, i) => ({ x: i * 57, w: 57 }));
        slice('walker_w', walkerWalkFrames, 42);

        // --- MODERN ANIM HELPER ---
        const createModernAnim = (key, prefix, frameNumbers, fps = 15, repeat = -1) => {
            const frames = frameNumbers.map(n => ({ key: `${prefix}_${n.toString().padStart(4, '0')}` }));
            this.anims.create({ key, frames, frameRate: fps, repeat });
        };
        
        // --- CREATE ALL ANIMS ---
        createModernAnim('cherry_idle', 'cherry', [0, 3, 6, 9, 12, 15, 18]);
        createModernAnim('adam_idle', 'adam', [0, 3, 6, 9, 11, 14, 17, 20, 23]);
        
        this.anims.create({ key: 'ignite_idle', frames: [{key: 'ignite_idle_01'}, {key: 'ignite_idle_02'}], frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'bigz_idle', frames: this.anims.generateFrameNumbers('bigz_idle_sheet'), frameRate: 8, repeat: -1 });
        this.anims.create({ key: 'default_idle', frames: [{ key: 'p_i', frame: 'f0' }, { key: 'p_i', frame: 'f1' }], frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'walker_idle', frames: this.anims.generateFrameNames('walker_i', { prefix: 'f', end: 3 }), frameRate: 8, repeat: -1 });
        this.anims.create({ key: 'walker_walk', frames: this.anims.generateFrameNames('walker_w', { prefix: 'f', end: 5 }), frameRate: 10, repeat: -1 });

        // --- BIG Z ---
        this.anims.create({ key: 'bigz_idle', frames: this.anims.generateFrameNumbers('bigz_idle_sheet'), frameRate: 8, repeat: -1 });
        this.anims.create({ key: 'bigz_run', frames: this.anims.generateFrameNumbers('bigz_run_sheet'), frameRate: 10, repeat: -1 });
        
        // Boss & other enemies
        const cyborgFrames = ['001', '002', '004', '005', '006', '007', '008', '009', '010', '011', '012', '013', '014', '015', '017', '020'];
        this.anims.create({ key: 'b_i', frames: cyborgFrames.slice(0,2).map(f => ({key: `cyborg_${f}`})) , frameRate: 4, repeat: -1 });
        this.anims.create({ key: 'boss_walk', frames: cyborgFrames.slice(2,7).map(f => ({key: `cyborg_${f}`})) , frameRate: 8, repeat: -1 });
        this.anims.create({ key: 'boss_atk', frames: cyborgFrames.slice(7,14).map(f => ({key: `cyborg_${f}`})) , frameRate: 10, repeat: 0 });

        console.log("--- All animations created. Initializing registry and starting game. ---");

        // --- REGISTRY ---
        this.registry.set('unlockedLevels', ['Khemra']);
        this.registry.set('upgradePoints', 10);
        this.registry.set('charStats', {
            'cherry': { health: 7, power: 6, speed: 10 },
            'adam':   { health: 8, power: 8, speed: 6 },
            'bigz':   { health: 10, power: 10, speed: 3 },
            'ignite': { health: 6, power: 9, speed: 8 },
            'default': { health: 7, power: 7, speed: 7 }
        });

        this.scene.start('ModeSelectScene');
    }
}