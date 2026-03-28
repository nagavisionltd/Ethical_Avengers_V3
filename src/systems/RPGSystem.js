class RPGSystem {
    constructor(scene) {
        this.scene = scene;
        this.registry = scene.registry;

        // Initialize registry values if not present
        if (!this.registry.has('xp')) this.registry.set('xp', 0);
        if (!this.registry.has('level')) this.registry.set('level', 1);
        if (!this.registry.has('ethicsCredits')) this.registry.set('ethicsCredits', 0);
        if (!this.registry.has('statPoints')) this.registry.set('statPoints', 0);
        if (!this.registry.has('unlockedMoves')) {
            this.registry.set('unlockedMoves', [
                'z_combo_1', 'z_combo_2', 'z_combo_3',
                'c_kick_combo', 'x_sword_combo', 'v_blast_1', 
                'double_jump', 'v_blast_2', 'e_beam', 'full_z_combo'
            ]);
        }
        
        // Stats: 1-10
        if (!this.registry.has('stats')) {
            this.registry.set('stats', {
                power: 1,
                speed: 1,
                will: 1
            });
        }
    }

    get xp() { return this.registry.get('xp'); }
    get level() { return this.registry.get('level'); }
    get credits() { return this.registry.get('ethicsCredits'); }
    get xpToNext() { return this.level * 100; }

    addXP(amount) {
        let xp = this.xp + amount;
        let level = this.level;
        let leveledUp = false;

        while (xp >= level * 100) {
            xp -= level * 100;
            level++;
            leveledUp = true;
            this.onLevelUp(level);
        }

        this.registry.set('xp', xp);
        this.registry.set('level', level);
        
        if (leveledUp) {
            this.scene.events.emit('level-up', level);
        }
    }

    onLevelUp(newLevel) {
        const currentPoints = this.registry.get('statPoints') || 0;
        this.registry.set('statPoints', currentPoints + 1);
        
        // Visual/Audio Feedback
        this.showFloatingText('LEVEL UP!', this.scene.cameras.main.centerX, this.scene.cameras.main.centerY, '#00ffff');
        this.scene.sound.play('sa', { volume: 1.0, detune: 500 }); // High pitched select sound
        
        // Auto-unlock moves based on level
        this.checkMoveUnlocks(newLevel);
        
        console.log(`LEVEL UP! Now Level ${newLevel}. Points awarded.`);
    }

    addCredits(amount, x, y) {
        const credits = this.credits + amount;
        this.registry.set('ethicsCredits', credits);
        
        if (x !== undefined && y !== undefined) {
            this.showFloatingText(`+${amount} EC`, x, y, '#FFD700');
        }
    }

    checkMoveUnlocks(level) {
        const unlocked = this.registry.get('unlockedMoves') || [];
        const unlocks = [
            { level: 2, id: 'c_kick_combo' },
            { level: 3, id: 'x_sword_combo' },
            { level: 4, id: 'v_blast_1' },
            { level: 5, id: 'double_jump' },
            { level: 6, id: 'v_blast_2' },
            { level: 7, id: 'e_beam' },
            { level: 8, id: 'full_z_combo' }
        ];

        unlocks.forEach(u => {
            if (level >= u.level && !unlocked.includes(u.id)) {
                unlocked.push(u.id);
                this.showFloatingText(`UNLOCKED: ${u.id.toUpperCase().replace(/_/g, ' ')}`, this.scene.cameras.main.centerX, 150, '#00ffaa');
            }
        });

        this.registry.set('unlockedMoves', unlocked);
    }

    allocateStat(stat) {
        const points = this.registry.get('statPoints') || 0;
        const stats = this.registry.get('stats');
        
        if (points > 0 && stats[stat] < 10) {
            stats[stat]++;
            this.registry.set('statPoints', points - 1);
            this.registry.set('stats', stats);
            return true;
        }
        return false;
    }

    showFloatingText(text, x, y, color) {
        const txt = this.scene.add.text(x, y, text, {
            fontFamily: '"Press Start 2P"',
            fontSize: '12px',
            fill: color,
            stroke: '#000',
            strokeThickness: 2
        }).setOrigin(0.5).setDepth(2000);

        this.scene.tweens.add({
            targets: txt,
            y: y - 100,
            alpha: 0,
            duration: 2000,
            onComplete: () => txt.destroy()
        });
    }
}