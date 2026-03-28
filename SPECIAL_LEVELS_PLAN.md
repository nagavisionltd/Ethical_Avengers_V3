# Ethical Avengers V3 - Special Levels Plan

**Document Type:** Level Design Specification  
**Created:** March 20, 2026  
**Purpose:** Two unique gameplay variations - spaceship chase & auto-runner obstacle course

---

## 🚀 LEVEL 1: SPACESHIP CHASE

### "Aetherion - The Sky Archive Escape"

**World:** Aetherion (The Sky Archive - floating libraries of living thought)  
**Position:** Mid-game (after completing 3-4 worlds)  
**Gameplay Type:** Horizontal scrolling shooter / chase sequence  
**Duration:** 2-3 minutes  

---

### 📖 LORE CONTEXT

The Ethical Avengers have infiltrated Aetherion to recover stolen knowledge. After obtaining the **Knowledge Shard**, the Archive's defense systems activate. The player must escape on a stolen sky-skiff while being pursued by autonomous guardian drones.

**Story Beat:** Knowledge defends itself — the Archive doesn't want to be raided.

---

### 🎮 GAMEPLAY OVERVIEW

| Property | Value |
|----------|-------|
| **Perspective** | Side-scrolling (player faces right) |
| **Movement** | Auto-scrolling background, player controls vertical movement |
| **Controls** | Arrow Up/Down to move, Z to shoot, X to special |
| **Health** | Skiff has 5 HP (separate from player HP) |
| **Goal** | Survive for 2 minutes, defeat boss at end |
| **Failure** | Skiff destroyed = restart from checkpoint |

---

### 🕹️ CONTROLS

| Input | Action | Notes |
|-------|--------|-------|
| **Arrow Up** | Move skiff up | Smooth acceleration |
| **Arrow Down** | Move skiff down | Smooth deceleration |
| **Z** | Fire forward | Rapid fire, no cooldown |
| **X** | Energy blast | Charged shot, 2s cooldown |
| **Space** | Barrel roll (dodge) | 0.5s invincibility, 3s cooldown |

---

### 🗺️ LEVEL LAYOUT

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  AETHERION ESCAPE - Horizontal Scrolling Chase                              │
│  (Background scrolls left, player moves up/down)                            │
│                                                                              │
│  START                                                                       │
│    │                                                                         │
│    ▼                                                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ SECTION 1: Library Spires (0:00-0:30)                               │    │
│  │ - Floating book towers as obstacles                                 │    │
│  │ - Basic drones spawn (3 waves)                                      │    │
│  │ - Collectible: Knowledge Orbs (bonus XP)                            │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│    │                                                                         │
│    ▼ Auto-scroll                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ SECTION 2: Thought Storms (0:30-1:00)                               │    │
│  │ - Lightning hazards (touch = damage)                                │    │
│  │ - Medium drones with projectiles                                    │    │
│  │ - Narrow corridors between floating ruins                           │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│    │                                                                         │
│    ▼ Auto-scroll                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ SECTION 3: Guardian Pursuit (1:00-1:45)                             │    │
│  │ - Elite hunter-killer drones                                        │    │
│  │ - Missile barrages (telegraphed)                                    │    │
│  │ - Debris fields from destroyed archives                             │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│    │                                                                         │
│    ▼ Auto-scroll                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ BOSS: Archive Guardian (1:45-2:30)                                  │    │
│  │ - Large mechanical eye with 3 phases                                │    │
│  │ - Phase 1: Laser beams (dodge up/down)                              │    │
│  │ - Phase 2: Spawn minions + shoot core                               │    │
│  │ - Phase 3: Desperate barrage, pattern memorization                  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ESCAPE! → Transition to next world hub                                     │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

### 👾 ENEMY TYPES

#### 1. Basic Drone
| Property | Value |
|----------|-------|
| **HP** | 2 |
| **Attack** | Ramming (contact damage) |
| **Spawn Pattern** | Waves of 3-5 |
| **XP Reward** | 5 XP |
| **Visual** | Small mechanical sphere with red eye |

**Behavior:**
```javascript
// Flies in from right, moves toward player Y position slowly
update() {
    if (player.y < this.y) {
        this.y -= 50; // Move up
    } else {
        this.y += 50; // Move down
    }
    this.x -= 100; // Move left (toward player)
}
```

---

#### 2. Cannon Drone
| Property | Value |
|----------|-------|
| **HP** | 5 |
| **Attack** | Fires slow projectile every 2s |
| **Spawn Pattern** | 1-2 per wave, behind basic drones |
| **XP Reward** | 15 XP |
| **Visual** | Larger sphere with cannon arm |

**Behavior:**
```javascript
// Maintains distance, fires every 2 seconds
fireTimer = 0;
update() {
    fireTimer += dt;
    if (fireTimer >= 2.0) {
        this.fireProjectile();
        fireTimer = 0;
    }
    // Stay at range, adjust Y to match player
}
```

---

#### 3. Hunter-Killer Elite
| Property | Value |
|----------|-------|
| **HP** | 15 |
| **Attack** | Fires 3-shot spread + missiles |
| **Spawn Pattern** | Mini-boss in Section 3 |
| **XP Reward** | 100 XP |
| **Visual** | Angular fighter with glowing wings |

**Behavior:**
```javascript
// Aggressive pursuit, telegraphs missile barrage
attackPattern = ['spread', 'chase', 'missiles'];
update() {
    // Cycles through attack patterns
    // Missiles have 2s telegraph (red line) before firing
}
```

---

### 🎯 BOSS: ARCHIVE GUARDIAN

**Visual:** Massive mechanical eye (128x128 pixels) with rotating rings  
**HP:** 100  
**Phases:** 3

#### Phase 1: Laser Sweep (HP: 100-70)
```
Pattern:
- Eye opens, charges for 1s (glows bright)
- Fires horizontal laser beam
- Laser moves UP or DOWN (random)
- Player must move to opposite side
- Repeat every 2s

Telegraph: Eye glows brighter before firing
Safe Strategy: Stay opposite of laser direction
```

#### Phase 2: Minion Spawn (HP: 70-30)
```
Pattern:
- Eye closes, spawns 4 Basic Drones + 2 Cannon Drones
- Eye fires slow projectiles while minions attack
- Core exposed for 3s every 10s (deal 2x damage)

Telegraph: Rings rotate counter-clockwise
Safe Strategy: Kill minions quickly, focus core when exposed
```

#### Phase 3: Desperation (HP: 30-0)
```
Pattern:
- All previous attacks combined
- Faster fire rate
- Laser sweeps twice in a row
- Missile barrages more frequent
- Pattern becomes memorizable after 2-3 cycles

Telegraph: Eye flashes red before each attack
Safe Strategy: Learn pattern, stay calm, dodge methodically
```

---

### 📦 COLLECTIBLES

#### Knowledge Orb
| Property | Value |
|----------|-------|
| **Value** | 25 XP each |
| **Spawn** | Floating in paths, 15-20 per run |
| **Visual** | Blue glowing orb with rune inside |
| **Collection** | Auto-collect on touch |

**Placement Strategy:**
- Some in safe paths (easy pickup)
- Some near hazards (risk vs reward)
- Some require precise movement (skill reward)

---

### ⚠️ HAZARDS

#### 1. Floating Debris
| Property | Value |
|----------|-------|
| **Damage** | 1 HP |
| **Visual** | Broken book pages, stone fragments |
| **Pattern** | Drifts slowly, predictable |

---

#### 2. Lightning Storms
| Property | Value |
|----------|-------|
| **Damage** | 2 HP |
| **Visual** | Yellow-white lightning bolts |
| **Pattern** | Strikes every 3s, telegraphed 1s |

**Telegraph:** Area glows yellow 1s before strike

---

#### 3. Archive Turrets
| Property | Value |
|----------|-------|
| **Damage** | 1 HP |
| **Visual** | Stationary guns on floating platforms |
| **Pattern** | Fires every 1.5s, aim at player |

---

### 💻 IMPLEMENTATION PLAN

#### New Files to Create
```
src/scenes/
└── AetherionChaseScene.js    # Main chase gameplay

src/entities/
├── SkySkiff.js               # Player vehicle
├── enemies/
│   ├── BasicDrone.js
│   ├── CannonDrone.js
│   └── HunterKiller.js
└── bosses/
    └── ArchiveGuardian.js

src/objects/
├── KnowledgeOrb.js
├── Debris.js
└── LightningZone.js
```

#### Key Mechanics Code
```javascript
// AetherionChaseScene.js - Auto-scroll implementation
create() {
    // Background layers for parallax
    this.bgLayer1 = this.add.tileSprite(0, 0, 320, 180, 'aetherion_bg_far');
    this.bgLayer2 = this.add.tileSprite(0, 0, 320, 180, 'aetherion_bg_mid');
    
    // Scroll speed increases over time
    this.scrollSpeed = 80; // pixels per second
    this.maxScrollSpeed = 150;
}

update(time, delta) {
    // Scroll background
    this.bgLayer1.tilePositionX += (this.scrollSpeed * 0.5) * delta;
    this.bgLayer2.tilePositionX += (this.scrollSpeed * 1.0) * delta;
    
    // Gradually increase difficulty
    this.scrollSpeed = Math.min(
        this.scrollSpeed + (0.5 * delta),
        this.maxScrollSpeed
    );
    
    // Spawn enemies based on distance traveled
    this.spawnEnemies();
}
```

```javascript
// SkySkiff.js - Player vehicle
class SkySkiff extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene, x, y);
        
        // Skiff sprite
        this.sprite = scene.physics.add.sprite(0, 0, 'sky_skiff');
        this.add(this.sprite);
        
        // Hitbox
        this.scene.physics.add.existing(this);
        this.body.setSize(40, 20);
        this.body.setCollideWorldBounds(true);
        
        // Health
        this.hp = 5;
        this.maxHP = 5;
        
        // Invincibility frames
        this.invincible = false;
        this.invincibleTime = 0;
    }
    
    takeDamage(amount) {
        if (this.invincible) return;
        
        this.hp -= amount;
        this.invincible = true;
        this.invincibleTime = 1000; // 1s invincibility
        
        // Flash effect
        this.sprite.setTint(0xff0000);
        this.scene.time.addEvent({
            delay: 100,
            repeat: 5,
            callback: () => {
                this.sprite.clearTint();
                this.scene.time.addEvent({
                    delay: 100,
                    callback: () => this.sprite.setTint(0xff0000)
                });
            }
        });
        
        if (this.hp <= 0) {
            this.onDestroy();
        }
    }
    
    barrelRoll() {
        if (this.invincible) return; // Cooldown check
        
        this.invincible = true;
        this.sprite.angle = 360;
        
        // Rotate animation
        this.scene.tweens.add({
            targets: this.sprite,
            angle: 0,
            duration: 500,
            onComplete: () => {
                this.scene.time.addEvent({
                    delay: 2500, // 2.5s cooldown
                    callback: () => { this.invincible = false; }
                });
            }
        });
    }
}
```

---

### 🎨 ASSETS NEEDED

```
assets/images/levels/aetherion_chase/
├── sky_skiff.png           # Player vehicle (48x24)
├── sky_skiff_roll.png      # Barrel roll frames (4 frames)
├── bg_aetherion_far.png    # Distant floating libraries (parallax)
├── bg_aetherion_mid.png    # Mid-ground ruins (parallax)
├── bg_aetherion_near.png   # Close debris (scrolls fastest)
├── knowledge_orb.png       # Collectible (16x16, 2 frames)
└── explosion.png           # Hit effect (8 frames)

assets/images/enemies/aetherion/
├── basic_drone.png         # 16x16, 2 frames
├── cannon_drone.png        # 24x24, 4 frames
├── hunter_killer.png       # 48x32, 4 frames
└── archive_guardian.png    # Boss 128x128, 8 frames + phases

assets/audio/sfx/
├── skiff_engine.mp3        # Looping engine hum
├── skiff_shoot.mp3         # Rapid fire sound
├── skiff_special.mp3       # Charged shot
├── explosion_large.mp3     # Enemy death
└── boss_alarm.mp3          # Guardian alert sound
```

---

## 🏃 LEVEL 2: AUTO-RUNNER OBSTACLE COURSE

### "Umbra Prime - Shadow Engine Run"

**World:** Umbra Prime (The Shadow Engine - built from stolen matter)  
**Position:** Late-game (after completing 5-6 worlds)  
**Gameplay Type:** Auto-runner / rhythm-based jumping  
**Duration:** 90 seconds - 2 minutes  

---

### 📖 LORE CONTEXT

The Shadow Engine is collapsing. The player must escape through a disintegrating corridor while the reality around them crumbles. The ground moves, obstacles appear in rhythmic patterns, and hesitation means death.

**Story Beat:** Umbra Prime's destruction begins — escape before the engine consumes you.

---

### 🎮 GAMEPLAY OVERVIEW

| Property | Value |
|----------|-------|
| **Perspective** | Side-scrolling platformer |
| **Movement** | Auto-run right (constant speed) |
| **Controls** | Space to jump, hold for higher jump |
| **Special** | Double jump available |
| **Goal** | Reach the end without falling/dying |
| **Death** = Instant restart from checkpoint |

---

### 🕹️ CONTROLS

| Input | Action | Notes |
|-------|--------|-------|
| **Space (tap)** | Jump | Standard height |
| **Space (hold)** | High Jump | 1.5x height, 0.3s charge |
| **Space (air)** | Double Jump | Once per gap |
| **Down (air)** | Fast Fall | Drop quickly |

---

### 🗺️ LEVEL LAYOUT

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  UMBRA PRIME ESCAPE - Auto-Runner Obstacle Course                           │
│  (Player auto-runs right, player only controls jumping)                     │
│                                                                              │
│  START                                                                       │
│    │                                                                         │
│    ▼ Auto-run begins (constant speed)                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ SECTION 1: Warming Up (0:00-0:20)                                   │    │
│  │ - Simple gaps (single jump)                                         │    │
│  │ - Low obstacles (jump over)                                         │    │
│  │ - Rhythm: Jump... jump... jump... (establishes pace)                │    │
│  │ - Safe platforms between obstacles                                  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│    │                                                                         │
│    ▼ Speed increases 10%                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ SECTION 2: Double Jump Intro (0:20-0:40)                            │    │
│  │ - Wide gaps (require double jump)                                   │    │
│  │ - Platform + obstacle combos                                        │    │
│  │ - Rhythm: Jump-jump... jump... jump-jump...                         │    │
│  │ - Falling platforms (crumble after 0.5s)                            │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│    │                                                                         │
│    ▼ Speed increases 15%                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ SECTION 3: Moving Hazards (0:40-1:00)                               │    │
│  │ - Rising/falling platforms (timing based)                           │    │
│  │ - Spikes that extend/retract                                        │    │
│  │ - Shadow hands that grab (must jump over)                           │    │
│  │ - Rhythm becomes complex: jump-jump... jump... jump-jump-jump       │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│    │                                                                         │
│    ▼ Speed increases 20%                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ SECTION 4: Precision Gauntlet (1:00-1:30)                           │    │
│  │ - Narrow platforms (1-tile wide)                                    │    │
│  │ - Consecutive double jumps                                          │    │
│  │ - Moving obstacles + gaps combined                                  │    │
│  │ - No safe zones, constant action                                    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│    │                                                                         │
│    ▼ Max speed                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ FINAL: The Last Stretch (1:30-1:50)                                 │    │
│  │ - Longest gap (perfect double jump timing)                          │    │
│  │ - Final obstacle wall (must have momentum)                          │    │
│  │ - Escape portal closes (timer pressure)                             │    │
│  │ - SUCCESS: Leap through portal as it closes                         │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ESCAPE! → Transition to final boss area                                    │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

### ⚠️ OBSTACLE TYPES

#### 1. Gaps
| Type | Width | Required Skill |
|------|-------|----------------|
| Small Gap | 40px | Single jump |
| Medium Gap | 70px | Single jump (edge) |
| Large Gap | 100px | Double jump |
| Extreme Gap | 130px | Double jump (perfect timing) |

**Visual:** Black void below, shadow particles rising

---

#### 2. Static Obstacles
| Type | Height | Required Jump |
|------|--------|---------------|
| Low Block | 20px | Small hop |
| Medium Block | 40px | Full jump |
| High Wall | 60px | Double jump |
| Spike Strip | 30px | Timed jump |

**Visual:** Dark crystalline structures, glowing purple edges

---

#### 3. Moving Platforms
| Type | Pattern | Timing |
|------|---------|--------|
| Rising/Falling | Vertical 50px | Wait for high position |
| Left/Right | Horizontal 30px | Jump when aligned |
| Crumbling | Falls 0.5s after landing | Quick successive jumps |
| Disappearing | Vanishes 1s after landing | Don't stop |

**Visual:** Fragmented reality, glitching in/out

---

#### 4. Active Hazards
| Type | Pattern | Counter |
|------|---------|---------|
| Extending Spikes | Out 1s, In 1s | Jump when retracted |
| Shadow Hands | Grab upward from below | Jump over |
| Energy Beams | Sweep floor every 2s | Jump at right time |
| Falling Debris | Random overhead | Keep moving |

**Visual:** Purple/black energy, shadow tendrils

---

### 🎵 RHYTHM DESIGN

The auto-runner should feel like a rhythm game. Obstacles sync to background music.

**BPM:** 140 (driving, urgent)

**Pattern Examples:**
```
Beat:     1    2    3    4    1    2    3    4
Section 1: JUMP ... JUMP ... JUMP ... (simple)
Section 2: JUMP-jump ... JUMP ... JUMP-jump (double intro)
Section 3: JUMP ... JUMP-jump ... JUMP-jump-jump (complex)
Section 4: JUMP-jump-JUMP-jump-JUMP (intense finale)

Legend:
- JUMP = obstacle requiring jump
- jump = secondary jump (double jump)
- ... = safe running space
```

**Music Cues:**
- Bass drum = obstacle incoming
- Snare = double jump section
- Hi-hat = rapid obstacle sequence
- Music swell = major hazard ahead

---

### 💻 IMPLEMENTATION PLAN

#### New Files to Create
```
src/scenes/
└── UmbraPrimeRunScene.js     # Auto-runner gameplay

src/entities/
└── AutoRunnerPlayer.js       # Simplified player (jump only)

src/objects/
├── Gap.js                    # Death zone
├── Obstacle.js               # Jump-over objects
├── MovingPlatform.js         # Timed platforms
└── ActiveHazard.js           # Spikes, hands, beams
```

#### Key Mechanics Code
```javascript
// UmbraPrimeRunScene.js - Auto-run implementation
create() {
    // Player auto-runs at constant speed
    this.runSpeed = 200; // pixels per second
    this.maxSpeed = 280; // Final speed
    
    // Generate level procedurally or from data
    this.levelData = this.generateLevelPattern();
    this.nextObstacleIndex = 0;
    
    // Background parallax
    this.bgLayer1 = this.add.tileSprite(0, 0, 320, 180, 'umbra_bg_far');
    this.bgLayer2 = this.add.tileSprite(0, 0, 320, 180, 'umbra_bg_mid');
}

update(time, delta) {
    // Auto-move player right
    this.player.x += this.runSpeed * delta;
    
    // Camera follows player
    this.cameras.main.scrollX = this.player.x - 160;
    
    // Scroll background (parallax)
    this.bgLayer1.tilePositionX = this.player.x * 0.3;
    this.bgLayer2.tilePositionX = this.player.x * 0.6;
    
    // Spawn obstacles ahead of player
    this.spawnObstacles();
    
    // Increase speed over time
    this.runSpeed = Math.min(
        this.runSpeed + (0.3 * delta),
        this.maxSpeed
    );
    
    // Check if player fell
    if (this.player.y > 200) {
        this.onPlayerDeath();
    }
    
    // Check if reached end
    if (this.player.x >= this.levelEndPosition) {
        this.onLevelComplete();
    }
}
```

```javascript
// UmbraPrimeRunScene.js - Obstacle spawning
spawnObstacles() {
    const spawnAhead = this.player.x + 400; // Spawn 400px ahead
    
    while (this.nextObstacleIndex < this.levelData.length) {
        const obstacle = this.levelData[this.nextObstacleIndex];
        
        if (obstacle.x <= spawnAhead) {
            this.createObstacle(obstacle);
            this.nextObstacleIndex++;
        } else {
            break;
        }
    }
}

createObstacle(data) {
    switch (data.type) {
        case 'gap':
            this.createGap(data.x, data.width);
            break;
        case 'obstacle':
            this.createStaticObstacle(data.x, data.height);
            break;
        case 'platform':
            this.createMovingPlatform(data.x, data.pattern);
            break;
        case 'hazard':
            this.createActiveHazard(data.x, data.hazardType);
            break;
    }
}
```

```javascript
// AutoRunnerPlayer.js - Simplified controls
class AutoRunnerPlayer extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene, x, y);
        
        // Player sprite (use existing character)
        this.sprite = scene.physics.add.sprite(0, 0, 'player_texture');
        this.add(this.sprite);
        
        this.scene.physics.add.existing(this);
        this.body.setGravityY(1500); // Heavy gravity for tight controls
        this.body.setCollideWorldBounds(false); // Can fall off
        
        // Jump state
        this.canDoubleJump = true;
        this.isHoldingJump = false;
        this.jumpChargeTime = 0;
    }
    
    handleInput() {
        // Jump pressed
        if (Phaser.Input.Keyboard.JustDown(space)) {
            this.jump();
            this.isHoldingJump = true;
            this.jumpChargeTime = 0;
        }
        
        // Jump held (charge for higher jump)
        if (this.isHoldingJump && this.scene.input.keyboard.keys[Phaser.Input.Keyboard.KeyCodes.SPACE].isDown) {
            this.jumpChargeTime += 16; // ms
            if (this.jumpChargeTime >= 300) {
                this.jumpChargeTime = 300; // Max charge
            }
        }
        
        // Jump released
        if (this.isHoldingJump && Phaser.Input.Keyboard.JustUp(space)) {
            this.isHoldingJump = false;
            // Cut jump short if not fully charged
            if (this.body.velocity.y < -200 && this.jumpChargeTime < 300) {
                this.body.setVelocityY(this.body.velocity.y * 0.5);
            }
        }
        
        // Double jump
        if (Phaser.Input.Keyboard.JustDown(space) && !this.body.touching.down && this.canDoubleJump) {
            this.doubleJump();
        }
        
        // Fast fall
        if (Phaser.Input.Keyboard.JustDown(down) && !this.body.touching.down) {
            this.body.setVelocityY(500);
        }
    }
    
    jump() {
        const jumpPower = -700 - (this.jumpChargeTime * 0.67); // -700 to -900
        this.body.setVelocityY(jumpPower);
        this.playJumpAnimation();
    }
    
    doubleJump() {
        this.canDoubleJump = false;
        this.body.setVelocityY(-600);
        this.playDoubleJumpAnimation();
        
        // Reset on ground
        this.scene.time.addEvent({
            delay: 100,
            loop: true,
            callback: () => {
                if (this.body.touching.down) {
                    this.canDoubleJump = true;
                }
            }
        });
    }
}
```

---

### 📊 LEVEL DATA STRUCTURE

```javascript
// Define level as data array (easier to tune than manual placement)
const levelData = [
    // Section 1: Warming Up (0:00-0:20)
    { type: 'obstacle', x: 300, height: 'low' },
    { type: 'gap', x: 500, width: 'small' },
    { type: 'obstacle', x: 700, height: 'low' },
    { type: 'gap', x: 900, width: 'small' },
    { type: 'obstacle', x: 1100, height: 'medium' },
    
    // Section 2: Double Jump Intro (0:20-0:40)
    { type: 'gap', x: 1400, width: 'large' }, // Requires double jump
    { type: 'platform', x: 1700, pattern: 'crumbling' },
    { type: 'gap', x: 2000, width: 'large' },
    { type: 'obstacle', x: 2300, height: 'high' }, // Requires double jump
    
    // Section 3: Moving Hazards (0:40-1:00)
    { type: 'platform', x: 2700, pattern: 'rising_falling' },
    { type: 'hazard', x: 3000, hazardType: 'extending_spikes' },
    { type: 'gap', x: 3300, width: 'medium' },
    { type: 'hazard', x: 3500, hazardType: 'shadow_hands' },
    { type: 'platform', x: 3800, pattern: 'disappearing' },
    
    // Section 4: Precision Gauntlet (1:00-1:30)
    { type: 'platform', x: 4200, width: 'narrow' },
    { type: 'gap', x: 4500, width: 'large' },
    { type: 'obstacle', x: 4800, height: 'high' },
    { type: 'gap', x: 5100, width: 'large' },
    { type: 'hazard', x: 5400, hazardType: 'energy_beam' },
    
    // Final: The Last Stretch (1:30-1:50)
    { type: 'gap', x: 5800, width: 'extreme' }, // Perfect double jump
    { type: 'obstacle', x: 6200, height: 'high' },
    { type: 'portal', x: 6500 } // Goal
];
```

---

### 🎨 ASSETS NEEDED

```
assets/images/levels/umbra_run/
├── bg_umbra_far.png          # Distant shadow structures (parallax)
├── bg_umbra_mid.png          # Mid-ground engine parts (parallax)
├── bg_umbra_near.png         # Close debris (scrolls fastest)
├── ground_umbra.png          # Running surface (tiled)
├── platform_crumbling.png    # 4 frames of crumbling
├── platform_rising.png       # Rising/falling platform (4 frames)
├── obstacle_spike.png        # Static spike obstacle
├── obstacle_crystal.png      # Crystalline block
├── hazard_shadow_hand.png    # 6 frames of hand emerging
├── hazard_energy_beam.png    # 4 frames of beam sweep
├── portal_escape.png         # 8 frames of closing portal
└── death_void.png            # Falling death effect

assets/audio/music/
└── umbra_run_theme.mp3       # 140 BPM, driving electronic

assets/audio/sfx/
├── player_jump.mp3           # Jump sound
├── player_double_jump.mp3    # Second jump
├── player_land.mp3           # Landing
├── obstacle_hit.mp3          # Damage sound
├── crumble.mp3               # Platform breaking
└── portal_close.mp3          # Escape success
```

---

## 📋 COMPARISON TABLE

| Feature | Spaceship Chase | Auto-Runner |
|---------|-----------------|-------------|
| **Duration** | 2-3 min | 90 sec - 2 min |
| **Controls** | Up/Down + Shoot | Jump only |
| **Skill** | Multitasking (move + shoot) | Timing + rhythm |
| **Death** | Skiff HP (5 hits) | Instant (falling/hits) |
| **Checkpoints** | 3 (per section) | 5 (per section) |
| **Collectibles** | Knowledge Orbs (XP) | None (pure survival) |
| **Boss** | Yes (Archive Guardian) | No (escape finale) |
| **Replay Value** | Farm XP, speedrun | Perfect run, no damage |

---

## 🎯 IMPLEMENTATION PRIORITY

### Phase 1: Auto-Runner (8-10 hours)
**Why first:** Simpler mechanics, tests core jumping feel

1. **Core System** (3 hours)
   - Auto-run movement
   - Camera follow
   - Basic obstacles (gaps, blocks)

2. **Level Design** (3 hours)
   - Create level data array
   - Tune obstacle spacing
   - Playtest rhythm

3. **Polish** (2-4 hours)
   - Moving platforms
   - Active hazards
   - Death/respawn system
   - Victory portal

---

### Phase 2: Spaceship Chase (10-12 hours)
**Why second:** More complex, requires enemy AI

1. **Core System** (3 hours)
   - Sky skiff controller
   - Auto-scroll background
   - Shooting mechanics

2. **Enemy AI** (3 hours)
   - Basic drone behavior
   - Cannon drone projectiles
   - Hunter-killer patterns

3. **Boss Fight** (3 hours)
   - Archive Guardian 3 phases
   - Phase transitions
   - Victory condition

4. **Polish** (2-3 hours)
   - Collectibles (Knowledge Orbs)
   - Particle effects
   - Sound integration
   - Difficulty tuning

---

## 🧪 TESTING CHECKLIST

### Spaceship Chase
- [ ] Skiff controls feel responsive (no input lag)
- [ ] Barrel roll grants invincibility correctly
- [ ] All 3 enemy types spawn in correct sections
- [ ] Boss phases transition at correct HP thresholds
- [ ] Knowledge Orbs are collectible and give XP
- [ ] Lightning telegraphs clearly before strike
- [ ] Difficulty ramps appropriately (not frustrating)
- [ ] 60 FPS maintained with all enemies/particles

### Auto-Runner
- [ ] Auto-run speed feels right (not too fast/slow)
- [ ] Jump height is consistent and predictable
- [ ] Double jump resets on ground contact
- [ ] All obstacle types are readable (clear silhouettes)
- [ ] Moving platforms have consistent timing
- [ ] Death respawns quickly (no long delays)
- [ ] Rhythm matches background music BPM
- [ ] Final gap is challenging but fair
- [ ] 60 FPS maintained throughout

---

## 🎵 MUSIC RECOMMENDATIONS

### Spaceship Chase (Aetherion)
**Style:** Orchestral electronic hybrid  
**Tempo:** 120-130 BPM  
**Instruments:** Strings, brass, synth arpeggios  
**Reference:** "Escape sequences" from Sonic games, Mass Effect chase music

**Structure:**
- 0:00-0:30: Tense buildup (Section 1)
- 0:30-1:00: Intensity increases (Section 2)
- 1:00-1:45: Full action (Section 3)
- 1:45-2:30: Boss theme (separate track or swell)

---

### Auto-Runner (Umbra Prime)
**Style:** Dark electronic, industrial  
**Tempo:** 140 BPM (driving)  
**Instruments:** Heavy bass, percussion, distorted synths  
**Reference:** Hotline Miami, FTL soundtrack, drum & bass

**Structure:**
- Consistent energy throughout (no quiet sections)
- Percussion hits sync to obstacle placements
- Bass drops signal major hazards
- Final 20 seconds: tempo increases to 150 BPM (escape urgency)

---

**Document Version:** 1.0  
**Status:** Ready for implementation  
**Next Step:** Choose which level to build first, begin Phase 1
