class CharacterSelectScene extends Phaser.Scene {
    constructor() {
        super('CharacterSelect');
    }

    preload() {
        this.load.image('select_bg', 'assets/ui/select_character_screen.png');
        this.load.image('leon_g_360_001', 'lore/character_sheets/leon_g_360_sprites/leon_g_360_001.png');
        this.load.image('leon_g_360_002', 'lore/character_sheets/leon_g_360_sprites/leon_g_360_002.png');
        this.load.image('leon_g_360_003', 'lore/character_sheets/leon_g_360_sprites/leon_g_360_003.png');
        this.load.image('leon_g_360_004', 'lore/character_sheets/leon_g_360_sprites/leon_g_360_004.png');
        
        this.load.image('lord_soul_360_001', 'lore/character_sheets/lord_soul_360_sprites/lord_soul_360_001.png');
        this.load.image('lord_soul_360_002', 'lore/character_sheets/lord_soul_360_sprites/lord_soul_360_002.png');
        this.load.image('lord_soul_360_003', 'lore/character_sheets/lord_soul_360_sprites/lord_soul_360_003.png');

        this.load.image('verona_360_001', 'lore/character_sheets/verona_360_sprites/verona_360_001.png');
        this.load.image('verona_360_002', 'lore/character_sheets/verona_360_sprites/verona_360_002.png');
        this.load.image('verona_360_003', 'lore/character_sheets/verona_360_sprites/verona_360_003.png');
    }

    create(data) {
        const gameMode = data.gameMode || 'arcade';
        this.scene.stop('UIScene');

        this.sound.stopAll();
        this.sound.play('music_drama', { loop: true, volume: 0.5 });

        const width = this.scale.width;
        const height = this.scale.height;

        if (!document.getElementById('space-bg')) {
            const svgContainer = document.createElement('div');
            svgContainer.id = 'space-bg';
            svgContainer.style.position = 'absolute';
            svgContainer.style.top = '0';
            svgContainer.style.left = '0';
            svgContainer.style.width = '100vw';
            svgContainer.style.height = '100vh';
            svgContainer.style.zIndex = '-1';
            svgContainer.style.background = 'radial-gradient(circle at center, #0a0e14 0%, #020305 100%)';
            svgContainer.style.overflow = 'hidden';

            if (!document.getElementById('space-styles')) {
                const style = document.createElement('style');
                style.id = 'space-styles';
                style.innerHTML = `
                    @keyframes twinkle { 0% { opacity: 0.1; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.2); } 100% { opacity: 0.1; transform: scale(0.8); } }
                    @keyframes floatLeft { 0% { transform: translateX(100vw); } 100% { transform: translateX(-100vw); } }
                    .star { animation: twinkle 3s infinite ease-in-out; }
                    .nebula { animation: floatLeft 60s infinite linear; }
                `;
                document.head.appendChild(style);
            }

            let svgHTML = '<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">';
            svgHTML += `<defs><radialGradient id="nebulaGrad1"><stop offset="0%" stop-color="rgba(100, 0, 255, 0.3)" /><stop offset="100%" stop-color="rgba(100, 0, 255, 0)" /></radialGradient><radialGradient id="nebulaGrad2"><stop offset="0%" stop-color="rgba(0, 255, 200, 0.2)" /><stop offset="100%" stop-color="rgba(0, 150, 255, 0)" /></radialGradient></defs>`;
            svgHTML += `<ellipse class="nebula" cx="40%" cy="30%" rx="35%" ry="25%" fill="url(#nebulaGrad1)" style="animation-duration: 80s" />`;
            svgHTML += `<ellipse class="nebula" cx="160%" cy="70%" rx="45%" ry="30%" fill="url(#nebulaGrad2)" style="animation-duration: 110s" />`;
            for (let i = 0; i < 200; i++) {
                const cx = Math.random() * 100, cy = Math.random() * 100, r = Math.random() * 1.5 + 0.5, delay = Math.random() * 5, duration = Math.random() * 3 + 2;
                svgHTML += `<circle class="star" cx="${cx}%" cy="${cy}%" r="${r}" fill="#ffffff" style="animation-delay: ${delay}s; animation-duration: ${duration}s;" />`;
            }
            svgHTML += '</svg>';
            svgContainer.innerHTML = svgHTML;
            document.body.appendChild(svgContainer);
        } else {
            document.getElementById('space-bg').style.display = 'block';
        }

        this.events.on('shutdown', () => {
            const spaceBg = document.getElementById('space-bg');
            if (spaceBg) spaceBg.style.display = 'none';
        });

        this.add.text(width / 2, 40, 'SELECT PLAYER', { 
            fontFamily: '"Press Start 2P"', 
            fontSize: '28px', 
            color: '#00ffaa' 
        }).setOrigin(0.5).setStroke('#000000', 6);

        const chars = [
            {
                key: 'lordsoul', name: 'Lord Soul', thumb: 'hud_portrait_naga', playable: true,
                stats: { health: 9, power: 8, speed: 7 },
                bio: "LORD SOUL\n\nThe Ethical Overlord.\nSpecialty: Tactical Strikes & Speed."
            },
            {
                key: 'cherry', name: 'Verona Rose', thumb: 'hud_portrait_verona', playable: true,
                stats: { health: 7, power: 6, speed: 10 },
                bio: "VERONA ROSE\n\nA martial artist with lightning-fast kicks.\nSpecialty: Speed & Air Combos."
            },
            {
                key: 'adam', name: 'Leon G', thumb: 'hud_portrait_leon', playable: false,
                stats: { health: 8, power: 8, speed: 6 },
                bio: "LEON G\n\nA powerful strategist.\nStatus: UNAVAILABLE."
            },
            {
                key: 'bigz', name: 'Big Zeeko', thumb: 'hud_portrait_zeeko', playable: true,
                stats: { health: 10, power: 10, speed: 3 },
                bio: "BIG ZEEKO\n\nA powerhouse brawler.\nSpecialty: Grappling & Heavy Hits."
            },
            {
                key: 'ignite', name: 'Dr. Jack', thumb: 'hud_portrait_jack', playable: true,
                stats: { health: 6, power: 9, speed: 8 },
                bio: "DR. JACK\n\nUses experimental tech to control the battlefield.\nSpecialty: Gadgets & Range."
            },
            {
                key: 'ninja', name: 'Neelo-X', thumb: 'cn_thumb', playable: true,
                stats: { health: 6, power: 8, speed: 10 },
                bio: "NEELO-X\n\nA cybernetic warrior with lethal precision.\nSpecialty: Speed & Combos."
            }
        ];

        let selectedIndex = 0;

        const createStatBar = (x, y, label, value, color) => {
            this.add.text(x, y, label, { fontFamily: '"Press Start 2P"', fontSize: '12px', color: '#fff' }).setOrigin(0, 0.5);
            this.add.rectangle(x + 100, y, 120, 10, 0x333333).setOrigin(0, 0.5);
            const fill = this.add.rectangle(x + 100, y, 0, 10, color).setOrigin(0, 0.5);
            this.tweens.add({ targets: fill, width: 120 * (value / 10), duration: 400, ease: 'Power2' });
            return fill;
        };

        const statGroup = this.add.group();
        const statBg = this.add.rectangle(640, 480, 280, 110, 0x000000, 0.6).setOrigin(0);

        const updateStats = (index) => {
            statGroup.clear(true, true);
            const s = chars[index].stats, sx = 660, sy = 500, gap = 25;
            statGroup.add(createStatBar(sx, sy, 'HEALTH', s.health, 0x00ffaa));
            statGroup.add(createStatBar(sx, sy + gap, 'POWER', s.power, 0xff0055));
            statGroup.add(createStatBar(sx, sy + gap * 2, 'SPEED', s.speed, 0x00aaff));
        };

        this.add.rectangle(640, 80, 280, 180, 0x000000, 0.6).setOrigin(0);
        const bioText = this.add.text(655, 100, '', { fontFamily: '"Press Start 2P"', fontSize: '11px', color: '#00ffaa', wordWrap: { width: 250 }, lineSpacing: 5 }).setOrigin(0, 0);

        const previewContainer = this.add.container(780, 360);
        let currentSprite = null;

        const updatePreview = (index) => {
            if (currentSprite) currentSprite.destroy();
            if (this.previewTween) this.previewTween.stop();
            if (this.previewAnimTimer) this.previewAnimTimer.destroy();

            const char = chars[index];
            const key = char.key;

            if (key === 'adam' || key === 'lordsoul' || key === 'cherry') {
                // 360 Looping Animation for EA Main Roster
                let prefix = (key === 'adam') ? 'leon_g_360' : (key === 'lordsoul' ? 'lord_soul_360' : 'verona_360');
                currentSprite = this.add.image(0, 0, `${prefix}_001`).setScale(0);
                
                // Refined scale and speed based on user feedback
                const finalScale = (key === 'lordsoul') ? 0.35 : 0.45;
                const rotationDelay = (key === 'lordsoul') ? 1200 : 800; // Slower for Lord Soul
                
                this.tweens.add({ targets: currentSprite, scale: finalScale, duration: 300, ease: 'Back.easeOut' });
                
                let curFrame = 1;
                this.previewAnimTimer = this.time.addEvent({
                    delay: rotationDelay,
                    loop: true,
                    callback: () => {
                        curFrame = (curFrame % 4) + 1;
                        if (curFrame === 4 && key !== 'adam') {
                            currentSprite.setTexture(`${prefix}_002`);
                            currentSprite.setFlipX(true);
                        } else {
                            currentSprite.setTexture(`${prefix}_00${curFrame}`);
                            currentSprite.setFlipX(false);
                        }
                    }
                });
            } else {
                let animKey = `${key}_idle`;
                let textureKey = char.thumb;
                if (key === 'bigz') textureKey = 'bigz_idle_sheet';
                if (key === 'ninja') textureKey = 'cn_idle_0';
                if (key === 'lordsoul') textureKey = 'ls_idle';

                try {
                    let finalScale = (key === 'lordsoul') ? 0.7 : 0.65;
                    currentSprite = this.add.sprite(0, 0, textureKey).setScale(0);
                    currentSprite.play(animKey);
                    this.tweens.add({ targets: currentSprite, scale: finalScale, duration: 300, ease: 'Back.easeOut' });
                } catch (e) {
                    currentSprite = this.add.image(0, 0, char.thumb).setScale(0);
                    this.tweens.add({ targets: currentSprite, scale: 2.5, duration: 300, ease: 'Back.easeOut' });
                }
            }
            previewContainer.add(currentSprite);
        };

        // --- GRID LAYOUT (Left Side) ---
        const thumbGroup = this.add.container(60, 100);
        const colWidth = 140, rowHeight = 140;

        chars.forEach((char, i) => {
            const col = i % 2, row = Math.floor(i / 2);
            const x = col * colWidth, y = row * rowHeight;
            
            const bg = this.add.rectangle(x, y, 120, 120, 0x000000, 0.4).setStrokeStyle(3, 0x00ffaa, 0.3).setOrigin(0);
            const glow = this.add.circle(x + 60, y + 60, 55, 0x00ffaa, 0).setDepth(-1).setAlpha(0);
            
            let img = this.add.image(x + 60, y + 60, char.thumb);
            const maxDim = 100; if (img.width > maxDim || img.height > maxDim) img.setScale(Math.min(maxDim / img.width, maxDim / img.height));
            
            const zone = this.add.zone(x, y, 120, 120).setOrigin(0).setInteractive({ cursor: 'pointer' });
            thumbGroup.add([bg, glow, img, zone]);
            
            zone.on('pointerdown', () => { this.sound.play('sa'); selectCharacter(i); });
        });

        const selectCharacter = (index) => {
            selectedIndex = index; updateStats(index); updatePreview(index); bioText.setText(chars[index].bio);
            
            // Highlight current selection in the grid (each char has 4 parts: bg, glow, img, zone)
            thumbGroup.list.forEach((child, idx) => {
                const itemIndex = Math.floor(idx / 4);
                const partType = idx % 4;
                
                if (partType === 0) { // Background/Rect
                    if (itemIndex === index) child.setStrokeStyle(5, 0x00ffaa, 1);
                    else child.setStrokeStyle(3, 0x00ffaa, 0.2);
                }
                if (partType === 1) { // Glow/Circle
                    if (itemIndex === index) child.setAlpha(0.2);
                    else child.setAlpha(0);
                }
            });

            // Update confirm button visual state
            if (!chars[index].playable) {
                confirmBtn.setAlpha(0.3).setBackgroundColor('#555555');
            } else {
                confirmBtn.setAlpha(1).setBackgroundColor('#00aa55');
            }
        };

        const createBtn = (x, y, text, color, callback) => {
            const btn = this.add.text(x, y, text, { fontFamily: '"Press Start 2P"', fontSize: '16px', color: '#fff', backgroundColor: color, padding: { x: 20, y: 10 } }).setOrigin(0.5).setInteractive({ cursor: 'pointer' });
            btn.on('pointerover', () => btn.setScale(1.1)); btn.on('pointerout', () => btn.setScale(1)); btn.on('pointerdown', callback);
            return btn;
        };

        const confirmBtn = createBtn(width - 120, height - 120, 'CONFIRM', '#00aa55', () => {
            if (!chars[selectedIndex].playable) {
                this.sound.play('sa');
                this.cameras.main.shake(100, 0.005);
                return;
            }
            this.sound.play('sh'); this.cameras.main.shake(300, 0.02); this.cameras.main.flash(500, 255, 255, 255);
            try { const p = this.add.particles(width / 2, height / 2 - 50, 'exp', { speed: { min: 200, max: 600 }, angle: { min: 0, max: 360 }, frame: { frames: [0, 1, 2, 3], cycle: true }, scale: { start: 0.3, end: 0 }, alpha: { start: 1, end: 0 }, tint: 0x00ffaa, lifespan: 700, blendMode: 'ADD' }); p.explode(20); } catch (e) { }
            this.time.delayedCall(600, () => { this.sound.stopAll(); this.scene.start(gameMode === 'arcade' ? 'IntroScene' : 'WorldSelectScene', { char: chars[selectedIndex].key, gameMode: gameMode, arcadeStageIndex: 0 }); });
        });
        createBtn(width - 120, height - 60, 'BACK', '#555555', () => this.scene.start('ModeSelectScene'));

        selectCharacter(0);
    }
}