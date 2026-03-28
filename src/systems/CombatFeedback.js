/**
 * CombatFeedback.js
 * Global utility for Hit Stop (Freeze Frames), Screen Shake, and Particle Bursts.
 * Centralizes combat feel mechanics for consistency across all scenes.
 */
class CombatFeedback {
    /**
     * Triggers a "Hit Stop" effect by pausing physics and animations.
     * @param {Phaser.Scene} scene The current active scene
     * @param {number} duration Duration in milliseconds
     */
    static hitStop(scene, duration = 80) {
        if (!scene || scene.isHitStopping) return;

        scene.isHitStopping = true;
        
        // Pause physics world
        if (scene.physics && scene.physics.world) {
            scene.physics.world.pause = true;
        }

        // Gather all objects that should have their animations paused
        const animatedObjects = [];
        
        if (scene.player && scene.player.active) {
            animatedObjects.push(scene.player);
        }
        
        if (scene.enemies) {
            scene.enemies.getChildren().forEach(enemy => {
                if (enemy.active) animatedObjects.push(enemy);
            });
        }

        // Pause animations
        animatedObjects.forEach(obj => {
            if (obj && obj.anims && obj.anims.isPlaying) {
                obj.anims.pause();
            }
        });

        // Resume after the specified duration
        scene.time.delayedCall(duration, () => {
            if (!scene || !scene.sys) return;
            
            if (scene.physics && scene.physics.world) {
                scene.physics.world.pause = false;
            }
            
            animatedObjects.forEach(obj => {
                if (obj && obj.active && obj.anims) {
                    obj.anims.resume();
                }
            });
            
            scene.isHitStopping = false;
        });
    }

    /**
     * Triggers a screen shake on the main camera.
     * @param {Phaser.Scene} scene 
     * @param {number} intensity Shake intensity (e.g., 0.01 to 0.05)
     * @param {number} duration Duration in milliseconds
     */
    static screenShake(scene, intensity = 0.02, duration = 150) {
        if (!scene || !scene.cameras || !scene.cameras.main) return;
        scene.cameras.main.shake(duration, intensity);
    }

    /**
     * Creates a burst of "impact" particles at a location.
     * @param {Phaser.Scene} scene 
     * @param {number} x 
     * @param {number} y 
     * @param {number} color Hex color (e.g., 0xffffff)
     * @param {number} count Number of particles
     */
    static particleBurst(scene, x, y, color = 0xffffff, count = 12) {
        if (!scene) return;

        // Use 'white_pixel' or fallback to a small rectangle if not found
        const texture = scene.textures.exists('white_pixel') ? 'white_pixel' : null;
        
        if (texture) {
            const emitter = scene.add.particles(x, y, texture, {
                speed: { min: 100, max: 250 },
                angle: { min: 0, max: 360 },
                scale: { start: 1.5, end: 0 },
                alpha: { start: 1, end: 0 },
                lifespan: { min: 300, max: 600 },
                quantity: count,
                tint: color,
                blendMode: 'ADD',
                emitting: false
            });
            emitter.explode();
            scene.time.delayedCall(1000, () => emitter.destroy());
        } else {
            // Fallback: manually create small rectangles as particles
            for (let i = 0; i < count; i++) {
                const p = scene.add.rectangle(x, y, 4, 4, color);
                scene.physics.add.existing(p);
                if (p.body) {
                    const angle = Math.random() * Math.PI * 2;
                    const speed = 100 + Math.random() * 150;
                    p.body.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
                    p.body.setGravityY(500);
                }
                scene.time.delayedCall(300 + Math.random() * 300, () => p.destroy());
            }
        }
    }
    
    /**
     * Combined impact feedback call for convenience.
     * @param {Phaser.Scene} scene 
     * @param {number} x 
     * @param {number} y 
     * @param {number} kbPower Influences shake and stop duration
     */
    static triggerImpact(scene, x, y, kbPower = 1) {
        // 1. Hit Stop
        let stopTime = 40;
        if (kbPower >= 2.0) stopTime = 120;
        else if (kbPower >= 1.0) stopTime = 80;
        this.hitStop(scene, stopTime);

        // 2. Screen Shake
        const shakeIntensity = 0.005 * kbPower;
        this.screenShake(scene, shakeIntensity, 100);

        // 3. Particles
        const pColor = kbPower >= 2.0 ? 0xff0000 : 0xffffff;
        this.particleBurst(scene, x, y, pColor, 8 * kbPower);
    }
}
