class CharacterSelectScene extends Phaser.Scene {
    constructor() {
        super('CharacterSelect');
    }

    preload() {
        this.load.image('select_bg', 'assets/ui/select_character_screen.png');
    }

    create(data) {
        const gameMode = data.gameMode || 'arcade';
        this.scene.stop('UIScene');

        const width = this.scale.width;
        const height = this.scale.height;

        // --- Animated Space Background (SVG) ---
        // We create an SVG element and append it to the body, strictly behind the #game-container
        if (!document.getElementById('space-bg')) {
            const svgContainer = document.createElement('div');
            svgContainer.id = 'space-bg';
            svgContainer.style.position = 'absolute';
            svgContainer.style.top = '0';
            svgContainer.style.left = '0';
            svgContainer.style.width = '100vw';
            svgContainer.style.height = '100vh';
            svgContainer.style.zIndex = '-1'; // strictly behind the canvas
            svgContainer.style.background = 'radial-gradient(circle at center, #1b2735 0%, #090a0f 100%)';
            svgContainer.style.overflow = 'hidden';

            // Add CSS animations
            if (!document.getElementById('space-styles')) {
                const style = document.createElement('style');
                style.id = 'space-styles';
                style.innerHTML = `
                    @keyframes twinkle {
                        0% { opacity: 0.1; transform: scale(0.8); }
                        50% { opacity: 1; transform: scale(1.2); }
                        100% { opacity: 0.1; transform: scale(0.8); }
                    }
                    @keyframes floatLeft {
                        0% { transform: translateX(100vw); }
                        100% { transform: translateX(-100vw); }
                    }
                    .star {
                        animation: twinkle 3s infinite ease-in-out;
                    }
                    .nebula {
                        animation: floatLeft 60s infinite linear;
                    }
                `;
                document.head.appendChild(style);
            }

            let svgHTML = '<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">';

            // Defs for gradients
            svgHTML += `
                <defs>
                    <radialGradient id="nebulaGrad1">
                        <stop offset="0%" stop-color="rgba(100, 0, 255, 0.3)" />
                        <stop offset="100%" stop-color="rgba(100, 0, 255, 0)" />
                    </radialGradient>
                    <radialGradient id="nebulaGrad2">
                        <stop offset="0%" stop-color="rgba(0, 255, 200, 0.2)" />
                        <stop offset="100%" stop-color="rgba(0, 150, 255, 0)" />
                    </radialGradient>
                </defs>
            `;

            // Draw drifting nebulas
            svgHTML += `<ellipse class="nebula" cx="40%" cy="30%" rx="35%" ry="25%" fill="url(#nebulaGrad1)" style="animation-duration: 80s" />`;
            svgHTML += `<ellipse class="nebula" cx="160%" cy="70%" rx="45%" ry="30%" fill="url(#nebulaGrad2)" style="animation-duration: 110s" />`;

            // Draw 200 twinkling stars
            for (let i = 0; i < 200; i++) {
                const cx = Math.random() * 100;
                const cy = Math.random() * 100;
                const r = Math.random() * 1.5 + 0.5;
                const delay = Math.random() * 5;
                const duration = Math.random() * 3 + 2;
                svgHTML += `<circle class="star" cx="${cx}%" cy="${cy}%" r="${r}" fill="#ffffff" style="animation-delay: ${delay}s; animation-duration: ${duration}s;" />`;
            }

            svgHTML += '</svg>';
            svgContainer.innerHTML = svgHTML;
            document.body.appendChild(svgContainer);
        } else {
            document.getElementById('space-bg').style.display = 'block';
        }

        // Hide space background when leaving the scene
        this.events.on('shutdown', () => {
            const spaceBg = document.getElementById('space-bg');
            if (spaceBg) spaceBg.style.display = 'none';
        });

        // --- Character Data ---
        const chars = [
            {
                key: 'cherry', name: 'Verona Rose', thumb: 'hud_portrait_verona',
                stats: { health: 7, power: 6, speed: 10 },
                bio: "VERONA ROSE\n\nA martial artist with lightning-fast kicks.\nSpecialty: Speed & Air Combos."
            },
            {
                key: 'adam', name: 'Leon G', thumb: 'hud_portrait_leon',
                stats: { health: 8, power: 8, speed: 6 },
                bio: "LEON G\n\nA balanced fighter with a mysterious past.\nSpecialty: Versatile Combat."
            },
            {
                key: 'bigz', name: 'Big Zeeko', thumb: 'hud_portrait_zeeko',
                stats: { health: 10, power: 10, speed: 3 },
                bio: "BIG ZEEKO\n\nA powerhouse brawler.\nSpecialty: Grappling & Heavy Hits."
            },
            {
                key: 'ignite', name: 'Dr. Jack', thumb: 'hud_portrait_jack',
                stats: { health: 6, power: 9, speed: 8 },
                bio: "DR. JACK\n\nUses experimental tech to control the battlefield.\nSpecialty: Gadgets & Range."
            },
            {
                key: 'ninja', name: 'Naga Soul', thumb: 'hud_portrait_naga',
                stats: { health: 6, power: 8, speed: 10 },
                bio: "NAGA SOUL\n\nA cybernetic warrior with lethal precision.\nSpecialty: Speed & Combos."
            },
            {
                key: 'cro', name: 'Sophia', thumb: 'hud_portrait_sophia',
                stats: { health: 9, power: 8, speed: 7 },
                bio: "SOPHIA\n\nThe awakened Mother Goddess.\nSpecialty: Cosmic Balance."
            },
            {
                key: 'default', name: 'Chibi Soul', thumb: 'chibi_soul_thumb',
                stats: { health: 7, power: 7, speed: 7 },
                bio: "CHIBI SOUL\n\nThe original avenger with a 9-hit melee combo.\nSpecialty: Relentless Combos."
            }
        ];

        let selectedIndex = 0;

        // --- UI Elements ---

        // 1. Stats Bars (Left) - Approximate positions based on layout
        // Assuming labels are part of the BG image, but we'll add text just in case or overlay bars on them.
        // If the BG has empty slots for bars, we draw rectangles there.
        // Positions estimated: Left side, ~bottom-ish

        const createStatBar = (x, y, label, value, color) => {
            this.add.text(x, y, label, { fontFamily: '"Press Start 2P"', fontSize: '14px', color: '#fff' }).setOrigin(0, 0.5);
            // Background bar
            this.add.rectangle(x + 100, y, 150, 15, 0x333333).setOrigin(0, 0.5);
            // Fill bar (starts at width 0)
            const fill = this.add.rectangle(x + 100, y, 0, 15, color).setOrigin(0, 0.5);

            // Animate to full width
            this.tweens.add({
                targets: fill,
                width: 150 * (value / 10),
                duration: 400,
                ease: 'Power2'
            });
            return fill;
        };

        const statGroup = this.add.group();
        // Add a persistent dimmer background for stats (approximate area)
        this.add.rectangle(40, 360, 350, 130, 0x000000, 0.6).setOrigin(0);

        const updateStats = (index) => {
            statGroup.clear(true, true);
            const s = chars[index].stats;
            // Layout: Bottom Left area
            const sx = 50;
            const sy = 380;
            const gap = 30;

            statGroup.add(createStatBar(sx, sy, 'HEALTH', s.health, 0x00ffaa));
            statGroup.add(createStatBar(sx, sy + gap, 'POWER', s.power, 0xff0055));
            statGroup.add(createStatBar(sx, sy + gap * 2, 'SPEED', s.speed, 0x00aaff));
        };

        // 2. Bio Box (Right)
        // Position: Top Right area
        // Add dimmer for bio
        this.add.rectangle(690, 140, 240, 200, 0x000000, 0.6).setOrigin(0);

        const bioText = this.add.text(700, 150, '', {
            fontFamily: '"Press Start 2P"',
            fontSize: '12px',
            color: '#00ffaa',
            wordWrap: { width: 220 },
            lineSpacing: 6
        }).setOrigin(0, 0);

        // 3. Central Character Preview
        const previewContainer = this.add.container(width / 2, height / 2 - 50);
        let currentSprite = null;

        const updatePreview = (index) => {
            if (currentSprite) currentSprite.destroy();
            const key = chars[index].key;

            // Determine animation key
            let animKey = 'idle'; // Fallback
            if (key === 'cherry') animKey = 'cherry_idle';
            else if (key === 'adam') animKey = 'adam_idle';
            else if (key === 'bigz') animKey = 'bigz_idle';
            else if (key === 'ignite') animKey = 'ignite_idle';
            else if (key === 'default') animKey = 'default_idle';
            else animKey = `${key}_idle`;

            let textureKey = chars[index].thumb;
            if (key === 'bigz') textureKey = 'bigz_idle_sheet';
            if (key === 'default') textureKey = 'cs_idle';
            if (key === 'ninja') textureKey = 'cn_idle_0';

            try {
                let finalScale = 2;
                // Scale down specific characters
                if (key === 'cherry' || key === 'adam' || key === 'ignite') finalScale = 0.5;

                currentSprite = this.add.sprite(0, 0, textureKey).setScale(0);
                currentSprite.play(animKey);

                // Pop animation juice
                this.tweens.add({
                    targets: currentSprite,
                    scale: finalScale,
                    duration: 300,
                    ease: 'Back.easeOut'
                });
            } catch (e) {
                // Fallback if animation fails
                currentSprite = this.add.image(0, 0, chars[index].thumb).setScale(0);
                this.tweens.add({
                    targets: currentSprite,
                    scale: 2,
                    duration: 300,
                    ease: 'Back.easeOut'
                });
            }
            previewContainer.add(currentSprite);
        };

        // 4. Selection Grid (Bottom Center)
        const thumbGroup = this.add.container(width / 2, 450);
        const thumbGap = 100;
        const totalW = (chars.length - 1) * thumbGap;
        const startX = -totalW / 2;

        chars.forEach((char, i) => {
            const x = startX + (i * thumbGap);
            const bg = this.add.rectangle(x, 0, 80, 80, 0x222222).setStrokeStyle(2, 0x444444);

            let img;
            // Handle different thumbnail types safely
            if (char.key === 'bigz') img = this.add.image(x, 0, 'hud_portrait_zeeko');
            else if (char.key === 'ignite') img = this.add.image(x, 0, 'hud_portrait_jack');
            else if (char.key === 'cherry') img = this.add.image(x, 0, 'hud_portrait_verona');
            else if (char.key === 'adam') img = this.add.image(x, 0, 'hud_portrait_leon');
            else if (char.key === 'ninja') img = this.add.image(x, 0, 'hud_portrait_naga');
            else if (char.key === 'cro') img = this.add.image(x, 0, 'hud_portrait_sophia');
            else if (char.key === 'default') img = this.add.image(x, 0, 'chibi_soul_thumb');
            else img = this.add.image(x, 0, char.thumb); // Generic fallback

            // Fit image in box
            const maxDim = 70;
            if (img.width > maxDim || img.height > maxDim) {
                const s = Math.min(maxDim / img.width, maxDim / img.height);
                img.setScale(s);
            }

            const zone = this.add.zone(x, 0, 80, 80).setInteractive({ cursor: 'pointer' });

            thumbGroup.add([bg, img, zone]);

            // Selection Logic
            zone.on('pointerdown', () => {
                this.sound.play('sa');
                selectCharacter(i);
            });
        });

        const selectCharacter = (index) => {
            selectedIndex = index;
            updateStats(index);
            updatePreview(index);
            bioText.setText(chars[index].bio);

            // Highlight active thumbnail
            thumbGroup.list.forEach((child, idx) => {
                if (child instanceof Phaser.GameObjects.Rectangle) {
                    // Check strict index match. Each item has 3 parts (bg, img, zone)
                    // The rects are at indices 0, 3, 6, 9, 12...
                    // Easier method: Store reference? No, simple math.
                    const itemIndex = Math.floor(idx / 3);
                    if (itemIndex === index) child.setStrokeStyle(4, 0x00ffaa);
                    else child.setStrokeStyle(2, 0x444444);
                }
            });
        };

        // 5. Buttons (Bottom)
        const createBtn = (x, text, color, callback) => {
            const btn = this.add.text(x, 500, text, {
                fontFamily: '"Press Start 2P"',
                fontSize: '20px',
                color: '#fff',
                backgroundColor: color,
                padding: { x: 20, y: 10 }
            }).setOrigin(0.5).setInteractive({ cursor: 'pointer' });

            btn.on('pointerover', () => btn.setScale(1.1));
            btn.on('pointerout', () => btn.setScale(1));
            btn.on('pointerdown', callback);
            return btn;
        };

        // Back Button
        createBtn(width / 2 - 150, 'BACK', '#555555', () => {
            this.scene.start('ModeSelectScene');
        });

        // Confirm Button
        createBtn(width / 2 + 150, 'CONFIRM', '#00aa55', () => {
            // Capcom juice: Punchy sound + camera shake + flash to white
            this.sound.play('sh'); // Punchy hit sound
            this.cameras.main.shake(300, 0.02); // 300ms small shake
            this.cameras.main.flash(500, 255, 255, 255); // Flash white

            // Particle Burst - one-shot explode from character preview
            try {
                const particles = this.add.particles(width / 2, height / 2 - 50, 'exp', {
                    speed: { min: 200, max: 600 },
                    angle: { min: 0, max: 360 },
                    frame: { frames: [0, 1, 2, 3], cycle: true },
                    scale: { start: 0.3, end: 0 },
                    alpha: { start: 1, end: 0 },
                    tint: 0x00ffaa,
                    lifespan: 700,
                    blendMode: 'ADD'
                });
                particles.explode(20);
            } catch (e) { } // silently skip if particles fail

            // Delay scene transition slightly so FX have time to play
            this.time.delayedCall(600, () => {
                this.sound.stopAll();
                const selectionData = { char: chars[selectedIndex].key, gameMode: gameMode };
                if (gameMode === 'arcade') {
                    // Arcade: lore intro → first tilemap level
                    this.scene.start('IntroScene', selectionData);
                } else {
                    // Story: 2.5D world/node map
                    this.scene.start('WorldSelectScene', selectionData);
                }
            });
        }); // end Confirm button

        // Initialize with first character
        selectCharacter(0);
    }
}
