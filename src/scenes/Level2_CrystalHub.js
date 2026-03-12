class Level2_CrystalHub extends Phaser.Scene {
    constructor() {
        super('Level2_CrystalHub');
    }

    create(data) {
        this.charKey = data.char || 'cherry';
        this.isTransitioning = false;
        const { width, height } = this.scale;

        // --- Cinematic Background ---
        this.add.image(0, 0, 'bg1').setOrigin(0).setDisplaySize(width, height).setAlpha(0.4);
        this.cameras.main.setBackgroundColor('#000022');

        // Add a pulsing glow in the center
        this.glow = this.add.circle(width / 2, height / 2, 200, 0x00ccff, 0.1);
        this.tweens.add({
            targets: this.glow,
            scale: 1.5,
            alpha: 0.05,
            duration: 2000,
            yoyo: true,
            repeat: -1
        });

        this.add.text(width / 2, 50, 'CRYSTAL HUB - NEXUS CONTROL', {
            fontSize: '32px', fontFamily: '"Press Start 2P"', color: '#00ffaa', stroke: '#000', strokeThickness: 4
        }).setOrigin(0.5);

        // --- Node Data ---
        this.nodes = [
            { id: 'SHOP', name: 'NEXUS SHOP', x: 100, y: height / 2, scene: 'SHOP', desc: 'Upgrade your systems here.', isShop: true },
            { id: 'JUNK', name: 'JUNK PLAINS', x: 280, y: 350, scene: 'JunkPlainsScene', desc: 'Wasteland of forgotten tech. Gritty.' },
            { id: 'KHEMRA', name: 'KHEMRA', x: 460, y: 250, scene: 'KhemraScene', desc: 'The Forge World. Initial breach point.' },
            { id: 'UMBRA', name: 'UMBRA PRIME', x: 640, y: 350, scene: 'UmbraPrimeScene', desc: 'Dark energy sector. High risk.' },
            { id: 'TERRA', name: 'TERRA PRIME', x: 820, y: 250, scene: 'TerraPrimeScene', desc: 'Resource rich zone. Balanced.' },
            { id: 'AETHER', name: 'AETHERION', x: 1100, y: 350, scene: 'AetherionScene', desc: 'Ancient skies. Esoteric anomalies.' }
        ];

        this.nodeGraphics = this.add.graphics();
        this.nodeObjects = [];
        this.selectedIndex = 0; // Start at Shop

        // Draw connections (SMW Style dashed lines)
        this.nodeGraphics.lineStyle(4, 0x00ffaa, 0.4);
        this.drawDashedLine(this.nodes[0], this.nodes[1]);
        this.drawDashedLine(this.nodes[1], this.nodes[2]);
        this.drawDashedLine(this.nodes[2], this.nodes[3]);
        this.drawDashedLine(this.nodes[3], this.nodes[4]);
        this.drawDashedLine(this.nodes[4], this.nodes[5]);

        // Create node icons
        this.nodes.forEach((node, i) => {
            const container = this.add.container(node.x, node.y);
            const tint = node.isShop ? 0xffd700 : 0x00ffaa;

            const outer = this.add.circle(0, 0, 45, tint, 0.1).setStrokeStyle(2, tint, 0.5);
            const inner = this.add.circle(0, 0, 30, 0xffffff, 0.8).setStrokeStyle(4, tint);
            const label = this.add.text(0, 60, node.name, {
                fontSize: '12px', fontFamily: '"Press Start 2P"', color: '#ffffff'
            }).setOrigin(0.5).setStroke('#000', 4);

            container.add([outer, inner, label]);

            // Interaction
            const zone = this.add.circle(node.x, node.y, 50).setInteractive({ cursor: 'pointer' });
            zone.on('pointerover', () => this.selectNode(i));
            zone.on('pointerdown', () => this.enterNode(i));

            this.nodeObjects.push({ container, outer, inner, label, node });
        });

        // --- Selection UI ---
        this.infoPanel = this.add.container(width / 2, height - 80);
        const infoBg = this.add.rectangle(0, 0, 800, 80, 0x000000, 0.8).setStrokeStyle(2, 0x00ffaa);
        this.infoTitle = this.add.text(0, -15, '', { fontSize: '18px', fontFamily: '"Press Start 2P"', color: '#00ffaa' }).setOrigin(0.5);
        this.infoDesc = this.add.text(0, 15, '', { fontSize: '12px', fontFamily: '"Press Start 2P"', color: '#ffffff' }).setOrigin(0.5);
        this.infoPanel.add([infoBg, this.infoTitle, this.infoDesc]);

        // Selection Cursor (Lylat Wars style - Arrow pointing down)
        this.cursor = this.add.triangle(0, 0, -15, -40, 15, -40, 0, -10, 0xff00ff).setDepth(100);
        this.tweens.add({ targets: this.cursor, y: '-=10', duration: 500, yoyo: true, repeat: -1 });

        // --- Shop Overlay ---
        this.createShopUI();

        // --- Controls ---
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keyZ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        this.keyX = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
        this.keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        this.selectNode(this.selectedIndex);
        this.cameras.main.fadeIn(500);
    }

    drawDashedLine(p1, p2) {
        const dist = Phaser.Math.Distance.Between(p1.x, p1.y, p2.x, p2.y);
        const steps = dist / 20;
        for (let i = 0; i < steps; i++) {
            if (i % 2 === 0) {
                const x = Phaser.Math.Linear(p1.x, p2.x, i / steps);
                const y = Phaser.Math.Linear(p1.y, p2.y, i / steps);
                const x2 = Phaser.Math.Linear(p1.x, p2.x, (i + 1) / steps);
                const y2 = Phaser.Math.Linear(p1.y, p2.y, (i + 1) / steps);
                this.nodeGraphics.lineBetween(x, y, x2, y2);
            }
        }
    }

    createShopUI() {
        const { width, height } = this.scale;
        this.shopOverlay = this.add.container(0, 0).setDepth(200).setVisible(false);
        const bg = this.add.rectangle(0, 0, width, height, 0x000000, 0.9).setOrigin(0);
        this.shopOverlay.add(bg);

        this.add.text(width / 2, 80, 'NEXUS UPGRADE SYSTEM', {
            fontSize: '28px', fontFamily: '"Press Start 2P"', color: '#ffd700'
        }).setOrigin(0.5).setParentContainer(this.shopOverlay);

        this.pointsText = this.add.text(width / 2, 130, '', {
            fontSize: '16px', fontFamily: '"Press Start 2P"', color: '#ffffff'
        }).setOrigin(0.5).setParentContainer(this.shopOverlay);

        const upgrades = [
            { key: 'maxHP', name: 'CORE INTEGRITY (HP)', cost: 5, icon: '❤️' },
            { key: 'atkDmg', name: 'QUANTUM BLADES (ATK)', cost: 8, icon: '⚔️' },
            { key: 'energyRegen', name: 'FLUX CAPACITOR (NRG)', cost: 10, icon: '⚡' }
        ];

        upgrades.forEach((u, i) => {
            const btn = this.add.container(width / 2, 250 + (i * 100));
            const rect = this.add.rectangle(0, 0, 500, 80, 0x222222).setStrokeStyle(2, 0x00ffaa).setInteractive({ cursor: 'pointer' });
            const txt = this.add.text(-230, 0, `${u.icon} ${u.name}`, { fontSize: '14px', fontFamily: '"Press Start 2P"' }).setOrigin(0, 0.5);
            const cost = this.add.text(230, 0, `${u.cost} PTS`, { fontSize: '14px', fontFamily: '"Press Start 2P"', color: '#ffd700' }).setOrigin(1, 0.5);

            rect.on('pointerover', () => rect.setStrokeStyle(4, 0xffffff));
            rect.on('pointerout', () => rect.setStrokeStyle(2, 0x00ffaa));
            rect.on('pointerdown', () => this.buyUpgrade(u));

            btn.add([rect, txt, cost]);
            this.shopOverlay.add(btn);
        });

        const closeTxt = this.add.text(width / 2, height - 80, '[X] RETURN TO OVERWORLD', {
            fontSize: '14px', fontFamily: '"Press Start 2P"', color: '#888888'
        }).setOrigin(0.5).setParentContainer(this.shopOverlay);
    }

    buyUpgrade(u) {
        let pts = this.registry.get('upgradePoints') || 0;
        if (pts >= u.cost) {
            this.registry.set('upgradePoints', pts - u.cost);
            const currentVal = this.registry.get(u.key) || 1;
            this.registry.set(u.key, currentVal + 0.1); // Incremental upgrade
            this.updateShopPoints();
            this.sound.play('sa', { volume: 0.8 });
            this.cameras.main.flash(200, 255, 215, 0);
        } else {
            this.sound.play('sh', { volume: 0.5 });
            this.cameras.main.shake(100, 0.005);
        }
    }

    updateShopPoints() {
        const pts = this.registry.get('upgradePoints') || 0;
        this.pointsText.setText(`AVAILABLE AUGMENT POINTS: ${pts}`);
    }

    selectNode(index) {
        if (this.isTransitioning || this.shopOverlay.visible) return;
        this.selectedIndex = index;
        const target = this.nodeObjects[index];

        // Reset others
        this.nodeObjects.forEach(obj => {
            obj.container.setScale(1);
            obj.inner.setFillStyle(0xffffff, 0.8);
            obj.label.setColor('#ffffff');
        });

        // Focus current
        target.container.setScale(1.2);
        target.inner.setFillStyle(target.node.isShop ? 0xffd700 : 0x00ffaa, 1);
        target.label.setColor(target.node.isShop ? '#ffd700' : '#00ffaa');

        // Move cursor
        this.cursor.setPosition(target.node.x, target.node.y);

        // Update Info
        this.infoTitle.setText(target.node.name);
        this.infoDesc.setText(target.node.desc);

        this.sound.play('sa', { volume: 0.3 });
    }

    enterNode(index) {
        if (this.isTransitioning) return;
        const node = this.nodes[index];

        this.sound.play('sa', { volume: 0.5 });

        if (node.isShop) {
            this.openShop();
            return;
        }

        this.isTransitioning = true;
        this.cameras.main.flash(500, 0, 255, 170);

        this.time.delayedCall(500, () => {
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start(node.scene, { char: this.charKey });
            });
        });
    }

    openShop() {
        this.updateShopPoints();
        this.shopOverlay.setVisible(true);
        this.cursor.setVisible(false);
    }

    closeShop() {
        this.shopOverlay.setVisible(false);
        this.cursor.setVisible(true);
    }

    update() {
        if (this.isTransitioning) return;

        if (this.shopOverlay.visible) {
            if (Phaser.Input.Keyboard.JustDown(this.keyX)) {
                this.closeShop();
            }
            return;
        }

        if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
            let next = this.selectedIndex - 1;
            if (next < 0) next = this.nodes.length - 1;
            this.selectNode(next);
        } else if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
            let next = this.selectedIndex + 1;
            if (next >= this.nodes.length) next = 0;
            this.selectNode(next);
        }

        if (Phaser.Input.Keyboard.JustDown(this.keyZ) || Phaser.Input.Keyboard.JustDown(this.keyEnter)) {
            this.enterNode(this.selectedIndex);
        }
    }
}
