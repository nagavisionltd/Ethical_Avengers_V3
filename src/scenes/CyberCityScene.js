class CyberCityScene extends BaseScene {
    constructor() { super('CyberCity'); }
    
    create(data) {
        const W = 6000; // Level width
        const H = 540;  // Level height
        this.physics.world.setBounds(0, 0, W, H);
        
        // 1. SKY LAYER (Far)
        this.add.tileSprite(0, 0, W, H, 'warped_sky_a').setOrigin(0).setTileScale(4).setScrollFactor(0.05);
        this.add.tileSprite(0, 0, W, H, 'warped_sky_b').setOrigin(0).setTileScale(4).setScrollFactor(0.1);
        
        // 2. BUILDINGS LAYER (Mid-Far)
        this.add.tileSprite(0, 50, W, H, 'warped_far_bg').setOrigin(0).setTileScale(4).setScrollFactor(0.2);
        
        // 3. NEAR BUILDINGS LAYER (Mid)
        this.add.tileSprite(0, 100, W, H, 'warped_near_bg').setOrigin(0).setTileScale(4).setScrollFactor(0.4);
        
        // 4. ANIMATED PROPS (Neon Signs, Monitors)
        for(let i=0; i<15; i++) {
            let px = 300 + i * 450 + Math.random() * 100;
            let py = 150 + Math.random() * 100;
            
            // Randomly pick neon or monitor
            if (Math.random() > 0.5) {
                // Ensure 'wc_neon_1' is loaded before using it
                this.add.sprite(px, py, 'wc_neon_1').setScale(4).play('wc_neon_anim').setScrollFactor(0.4);
            } else {
                this.add.sprite(px, py, 'wc_monitor_1').setScale(4).play('wc_monitor_anim').setScrollFactor(0.4);
            }
            
            // Add some antennas on top of "buildings"
            if (Math.random() > 0.7) {
                this.add.image(px, py - 80, 'warped_prop_antenna').setScale(4).setScrollFactor(0.4);
            }
        }

        // 5. FLOOR / GROUND
        // Using the tileset for the floor
        this.add.tileSprite(0, 480, W, 64, 'warped_tileset').setOrigin(0).setTileScale(4).setScrollFactor(1.0).setDepth(1);
        
        // Static ground for physics
        const ground = this.physics.add.staticGroup();
        ground.create(W/2, 530, null).setDisplaySize(W, 20).refreshBody();

        // 5b. AIR TRAFFIC (Background)
        // Add a few small, flying vehicles in the distant background
        for (let i = 0; i < 5; i++) {
            const y = 100 + Math.random() * 200; // Random height in the sky
            const speed = (15 + Math.random() * 10) * 1000; // Random duration
            const vehicleKey = Math.random() > 0.5 ? 'warped_vehicle_police' : 'warped_vehicle_truck';
            
            const traffic = this.add.image(-200, y, vehicleKey)
                .setScale(0.5 + Math.random() * 0.5) // Random small scale
                .setAlpha(0.4)
                .setDepth(-1); // Behind everything

            this.tweens.add({
                targets: traffic,
                x: W + 200,
                duration: speed,
                ease: 'Linear',
                loop: -1,
                delay: i * 3000 // Stagger start times
            });
        }
        
        // Launch the UI in parallel to this scene
        const charKey = data && data.char ? data.char : 'cherry';
        this.scene.launch('UIScene', { char: charKey });
        
        // 6. PLAYER INITIALIZATION
        this.initPlayer(150, 400, W, charKey);
        this.player.setDepth(10); // Ensure player is in front
        
        // Add Colliders
        this.physics.add.collider(this.player, ground);
        this.physics.add.collider(this.enemies, ground);
        
        // 7. DESTRUCTIBLES & ENEMIES
        for(let i=0; i<10; i++) {
            const bx = 1200 + i * 550;
            const b1 = this.spawnDestructible(bx, 500, 'barrel1');
            const b2 = this.spawnDestructible(bx + 120, 500, 'box');
            if (b1) b1.setDepth(9); // Props slightly behind player
            if (b2) b2.setDepth(9);
            
            // Spawn enemies
            if (i > 0) {
                const w = this.spawnWalker(bx + 300, 400);
                if (w) w.setDepth(10);
                
                if (i % 2 === 0) {
                    const d = this.spawnDrone(bx + 400, 200);
                    if (d) d.setDepth(10);
                }
            }
        }

        // 8. FOREGROUND LAYER (Removed intrusive overlay vehicles)
        
        // 9. OVERLAP LOGIC (Combat)
        this.physics.add.overlap(this.player.hitArea, this.enemies, (h, e) => this.onEnemyHit(e, 10, this.player.atkID));
        this.physics.add.overlap(this.projs, this.enemies, (p, e) => { 
            this.onEnemyHit(e, 20, p.getData('atkID')); 
            p.destroy(); 
        });
        
        // 10. MUSIC
        this.sound.stopAll();
        this.sound.play('m1', { loop: true, volume: 0.4 });
        
        // Welcome text
        const txt = this.add.text(480, 200, 'CYBER CITY DISTRICT', { 
            fontFamily: '"Press Start 2P"', fontSize: '32px', color: '#00ffaa', stroke: '#000', strokeThickness: 6 
        }).setOrigin(0.5).setScrollFactor(0).setAlpha(0);
        
        this.tweens.add({
            targets: txt,
            alpha: 1,
            y: 150,
            duration: 1000,
            ease: 'Power2',
            yoyo: true,
            hold: 2000,
            onComplete: () => txt.destroy()
        });
    }

    update() {
        if (this.player && this.player.update) this.player.update();
        this.enemies.getChildren().forEach(e => { if (e.update) e.update(); });
        
        if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER))) {
            this.scene.pause();
            this.scene.launch('PauseScene');
        }
    }
}
