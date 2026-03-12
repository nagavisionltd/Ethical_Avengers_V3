class VSCharacterSelectScene extends Phaser.Scene {
    constructor() {
        super('VSCharacterSelectScene');
    }

    preload() {
        // Assets should already be loaded by Boot.js, but ensure we have what we need
        // Re-using 'select_bg' from CharacterSelectScene if loaded there, or 'celestial_bg' directly
    }

    create() {
        this.scene.stop('UIScene');

        // --- Animated Space Background (SVG) ---
        if (!document.getElementById('space-bg')) {
            const svgContainer = document.createElement('div');
            svgContainer.id = 'space-bg';
            svgContainer.style.position = 'absolute';
            svgContainer.style.top = '0';
            svgContainer.style.left = '0';
            svgContainer.style.width = '100vw';
            svgContainer.style.height = '100vh';
            svgContainer.style.zIndex = '-1';
            svgContainer.style.background = 'radial-gradient(circle at center, #1b2735 0%, #090a0f 100%)';
            svgContainer.style.overflow = 'hidden';

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
                    .star { animation: twinkle 3s infinite ease-in-out; }
                    .nebula { animation: floatLeft 60s infinite linear; }
                `;
                document.head.appendChild(style);
            }

            let svgHTML = '<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">';
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
                <ellipse class="nebula" cx="40%" cy="30%" rx="35%" ry="25%" fill="url(#nebulaGrad1)" style="animation-duration: 80s" />
                <ellipse class="nebula" cx="160%" cy="70%" rx="45%" ry="30%" fill="url(#nebulaGrad2)" style="animation-duration: 110s" />
            `;
            for (let i = 0; i < 200; i++) {
                const cx = Math.random() * 100, cy = Math.random() * 100, r = Math.random() * 1.5 + 0.5;
                const delay = Math.random() * 5, duration = Math.random() * 3 + 2;
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

        // --- State ---
        this.turn = 1; // 1 for Player 1, 2 for Player 2
        this.p1Data = null;
        this.p2Data = null;

        // --- Title Text ---
        this.titleText = this.add.text(this.cameras.main.width / 2, 50, 'PLAYER 1 SELECT', {
            fontFamily: '"Press Start 2P"',
            fontSize: '32px',
            color: '#00ffaa',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // --- Character Data (Same as main select) ---
        const chars = [
            { key: 'cherry', name: 'Cherry', thumb: 'cherry_0000' },
            { key: 'adam', name: 'Adam', thumb: 'adam_0000' },
            { key: 'bigz', name: 'Big Z', thumb: 'bigz_thumb' },
            { key: 'ignite', name: 'Dr. Ignite', thumb: 'ignite_portrait' },
            { key: 'default', name: 'Curt Soul', thumb: 'p_i' }
        ];

        // --- VS Previews ---
        // Left Side (P1)
        this.p1Container = this.add.container(200, 300);
        this.add.text(200, 450, 'P1', { fontFamily: '"Press Start 2P"', fontSize: '24px', color: '#00ffaa' }).setOrigin(0.5);

        // Right Side (P2)
        this.p2Container = this.add.container(760, 300);
        this.add.text(760, 450, 'P2', { fontFamily: '"Press Start 2P"', fontSize: '24px', color: '#ff0055' }).setOrigin(0.5);

        // VS Graphic (Center)
        this.add.text(480, 300, 'VS', {
            fontFamily: '"Press Start 2P"',
            fontSize: '64px',
            color: '#ffffff',
            fontStyle: 'italic'
        }).setOrigin(0.5).setAlpha(0.5);


        // --- Selection Grid (Bottom) ---
        const thumbGroup = this.add.container(this.cameras.main.width / 2, 500); // Lower position
        const thumbGap = 90;
        const startX = -((chars.length - 1) * thumbGap) / 2;

        chars.forEach((char, i) => {
            const x = startX + (i * thumbGap);

            // Box
            const box = this.add.rectangle(x, 0, 70, 70, 0x222222).setStrokeStyle(2, 0x555555);

            // Thumbnail
            let imgKey = char.thumb;
            if (char.key === 'default') imgKey = 'p_i'; // Fix for sprite sheet ref

            let img = this.add.image(x, 0, imgKey);

            // Thumbnail Scaling
            const maxDim = 60;
            if (img.width > maxDim || img.height > maxDim) {
                const s = Math.min(maxDim / img.width, maxDim / img.height);
                img.setScale(s);
            }

            // Interactive Zone
            const zone = this.add.zone(x, 0, 70, 70).setInteractive({ cursor: 'pointer' });

            thumbGroup.add([box, img, zone]);

            zone.on('pointerdown', () => {
                this.selectCharacter(char);
            });

            // Hover effect
            zone.on('pointerover', () => box.setStrokeStyle(2, 0xffffff));
            zone.on('pointerout', () => box.setStrokeStyle(2, 0x555555));
        });

        // Back Button
        const backBtn = this.add.text(50, 50, '< BACK', {
            fontFamily: '"Press Start 2P"', fontSize: '16px', color: '#ffffff'
        }).setInteractive({ cursor: 'pointer' });

        backBtn.on('pointerdown', () => this.scene.start('ModeSelectScene'));
    }

    selectCharacter(char) {
        this.sound.play('sa');

        if (this.turn === 1) {
            // Player 1 Selected
            this.p1Data = char;
            this.showPreview(this.p1Container, char.key, true);

            // Switch to Turn 2
            this.turn = 2;
            this.titleText.setText('PLAYER 2 SELECT');
            this.titleText.setColor('#ff0055');

        } else if (this.turn === 2) {
            // Player 2 Selected
            this.p2Data = char;
            this.showPreview(this.p2Container, char.key, false); // false = flipX for P2

            // Finish Selection
            this.turn = 3; // Locked
            this.titleText.setText('READY?');
            this.titleText.setColor('#ffffff');

            this.time.delayedCall(1000, () => {
                this.startGame();
            });
        }
    }

    showPreview(container, key, isP1) {
        container.removeAll(true);

        let animKey = `${key}_idle`;
        if (key === 'default') animKey = 'idle';
        if (key === 'bigz') animKey = 'bigz_idle'; // Specific naming fix

        let scale = 2;
        // Scale down specific HD characters
        if (key === 'cherry' || key === 'adam' || key === 'ignite') scale = 0.6;
        if (key === 'bigz') scale = 1.0;

        // Check if animation exists, else fallback to image
        if (this.anims.exists(animKey)) {
            const sprite = this.add.sprite(0, 0, key).setScale(scale);
            sprite.play(animKey);
            if (!isP1) sprite.setFlipX(true); // P2 faces left
            container.add(sprite);
        } else {
            // Fallback image
            let imgKey = key === 'default' ? 'p_i' : key;
            if (key === 'ignite') imgKey = 'ignite_portrait';
            if (key === 'bigz') imgKey = 'bigz_thumb';

            const img = this.add.image(0, 0, imgKey).setScale(2);
            if (!isP1) img.setFlipX(true);
            container.add(img);
        }
    }

    startGame() {
        this.sound.stopAll();
        this.cameras.main.fadeOut(500);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('VSLevelSelectScene', {
                p1: this.p1Data.key,
                p2: this.p2Data.key,
                isVS: true
            });
        });
    }
}