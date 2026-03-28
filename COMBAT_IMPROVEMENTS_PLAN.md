# Ethical Avengers V3 - Combat & Systems Improvement Plan

**Generated:** March 20, 2026  
**Purpose:** Comprehensive plan for improving combat feel, level design, and RPG systems  
**Reference:** Based on game lore, existing design docs, and action platformer best practices

---

## 📖 GAME LORE REFERENCE

### The Eight Worlds Beyond The Ice Wall

| # | World | Theme | Resource Drained | Trial |
|---|-------|-------|------------------|-------|
| 1 | **Aurelion** | Sun Garden | Vital Energy | Reignite Heart Engine |
| 2 | **Noktara** | Shadow Memory | Collective Memory | Navigate lies that reshape reality |
| 3 | **Virella** | Verdant Deep | Life Essence | Earn trust of sentient biosphere |
| 4 | **Khemra** | Forge World | Creative Fire | Outcreate machine god |
| 5 | **Aetherion** | Sky Archive | Knowledge | Survive knowledge that defends itself |
| 6 | **Thalassa** | Deep Mirror | Empathy | Face true self beneath waves |
| 7 | **Umbra Prime** | Shadow Engine | All others | Disrupt engine without collapsing reality |
| 8 | **Terra Prima** | Origin World | — | Restore or reshape cosmic order |

### The Ethical Avengers
Chosen by alignment with cosmic principles: **Truth, Balance, Memory, Fire, Will, Time, Compassion, Return**

### Current Characters
- **Lord Soul (cro)** - The Ethical Overlord, tactical fighter
- **Neelo-X (ninja)** - Cyborg ninja
- **Cherry, Big Z, Dr. Ignite** - Additional roster

---

## ⚔️ COMBAT IMPROVEMENTS (Priority: HIGH)

### 1. Hit Stop / Freeze Frames

**Purpose:** Add impact weight to heavy attacks. When a hit connects, freeze the game for 50-100ms.

**Implementation:**
```javascript
// NeoPlayer_v16.js - In doAttack() when hit connects
if (this.currentKB >= 1.0) {
    // Freeze physics and animations
    this.scene.physics.world.pause = true;
    this.scene.anims.pause = true;
    
    // Resume after delay
    this.scene.time.addEvent({
        delay: 80, // 80ms freeze
        callback: () => {
            this.scene.physics.world.pause = false;
            this.scene.anims.pause = false;
        },
        callbackScope: this
    });
}
```

**When to Trigger:**
- Combo hits 5+ (medium hits)
- All finisher attacks
- Heavy attacks (E key projectiles)
- NOT on light jabs (hits 1-2)

**Expected Feel:** Attacks feel like they *matter*, enemies feel impact weight

---

### 2. Screen Shake

**Purpose:** Visual feedback for powerful hits and explosions.

**Implementation:**
```javascript
// BaseScene.js - onEnemyHit()
onEnemyHit(enemy, knockbackMultiplier) {
    // Scale shake intensity by knockback
    const intensity = 0.003 * knockbackMultiplier;
    const duration = 100 * knockbackMultiplier;
    
    this.cameras.main.shake(duration, intensity);
}
```

**Shake Values by Event:**
| Event | Duration | Intensity |
|-------|----------|-----------|
| Light hit | 80ms | 0.002 |
| Medium hit | 120ms | 0.004 |
| Heavy hit/Finisher | 200ms | 0.006 |
| Enemy explosion | 300ms | 0.008 |
| Player hurt | 150ms | 0.003 |

---

### 3. Enemy Stagger States

**Purpose:** Visual feedback showing hit severity, creates combat flow.

**Stagger Tiers:**
```javascript
// Enemy.js - takeHit()
takeHit(damage, knockback) {
    if (knockback >= 2.0) {
        this.playStagger('launch');    // Fully airborne
        this.setInvulnerable(800);
    } else if (knockback >= 1.0) {
        this.playStagger('hard');      // Big flinch, can't act
        this.setInvulnerable(400);
    } else if (knockback >= 0.5) {
        this.playStagger('medium');    // Stagger back, can still attack
        this.setInvulnerable(200);
    } else {
        this.playStagger('light');     // Tiny flinch, no interrupt
        this.setInvulnerable(100);
    }
}
```

**Animation Requirements per Enemy:**
- `stagger_light` - 2 frames, quick recovery
- `stagger_medium` - 3 frames, pushed back
- `stagger_hard` - 4 frames, stunned animation
- `launch` - 5 frames, airborne + fall

---

### 4. Particle Bursts on Impact

**Purpose:** Visual satisfaction, shows hit direction and power.

**Implementation:**
```javascript
// BaseScene.js - createImpactParticles(x, y, knockback)
createImpactParticles(x, y, knockback, attackDirection) {
    const particleCount = Math.floor(knockback * 5);
    
    const particles = this.add.particles(x, y, 'spark_particle', {
        speed: { min: 50, max: 150 * knockback },
        angle: { min: attackDirection - 45, max: attackDirection + 45 },
        scale: { start: 0.5, end: 0 },
        lifespan: 300,
        quantity: particleCount,
        blendMode: 'ADD',
        tint: this.getHitTint(knockback) // Orange → Yellow → White
    });
    
    particles.explode();
    setTimeout(() => particles.destroy(), 400);
}
```

**Particle Types:**
| Hit Type | Particle | Color | Count |
|----------|----------|-------|-------|
| Light | Small spark | Orange | 3-5 |
| Medium | Spark + dust | Yellow | 6-10 |
| Heavy | Large spark + debris | White/Yellow | 12-20 |
| Energy blast | Energy orb | Blue/Purple | 15-25 |

**Asset Needed:** `assets/images/particles/spark_particle.png` (simple 8x8 white pixel, tinted via code)

---

### 5. Sound Layering

**Purpose:** Audio feedback reinforces hit weight.

**Sound Layers:**
```javascript
// BaseScene.js - playHitSound(knockback, attackType)
playHitSound(knockback, attackType) {
    if (knockback < 0.5) {
        // Light hit - soft thud
        this.sound.play('hit_light', { volume: 0.4 });
    } else if (knockback < 1.5) {
        // Medium hit - crack + bass
        this.sound.play('hit_medium_crack', { volume: 0.6 });
        this.sound.play('hit_medium_bass', { volume: 0.3 });
    } else {
        // Heavy hit - boom + spark + bass drop
        this.sound.play('hit_heavy_boom', { volume: 0.8 });
        this.sound.play('hit_heavy_spark', { volume: 0.5 });
        this.sound.play('hit_heavy_bass', { volume: 0.7 });
    }
}
```

**Required Sound Assets:**
```
assets/audio/sfx/
├── hit_light.mp3         (soft "thud")
├── hit_medium_crack.mp3  (sharp impact)
├── hit_medium_bass.mp3   (low frequency)
├── hit_heavy_boom.mp3    (explosive hit)
├── hit_heavy_spark.mp3   (high-frequency crackle)
├── hit_heavy_bass.mp3    (deep bass drop)
├── combo_whoosh.mp3      (attack windup)
└── finisher_charge.mp3   (final hit charge-up)
```

---

### 6. Animation Cancel Windows

**Purpose:** Reward player mastery, create combat flow.

**Cancel Rules:**
```javascript
// NeoPlayer_v16.js - handleInput()
handleInput() {
    // Can cancel recovery frames into:
    
    // 1. Jump (anytime during recovery)
    if (this.isInRecovery && Phaser.Input.Keyboard.JustDown(space)) {
        this.cancelRecovery();
        this.jump();
        return;
    }
    
    // 2. Special Move (only during active frames)
    if (this.isActiveFrames && (Phaser.Input.Keyboard.JustDown(v) || Phaser.Input.Keyboard.JustDown(e))) {
        this.cancelRecovery();
        this.fireSpecial();
        return;
    }
    
    // 3. Dodge Roll (if implemented) - any attack phase
    if (this.isAttacking && Phaser.Input.Keyboard.JustDown(shift)) {
        this.cancelRecovery();
        this.dodgeRoll();
        return;
    }
}
```

**Cancel Window Timing:**
| From Animation | Can Cancel To | Window |
|---------------|---------------|--------|
| Light Attack | Medium Attack | Last 2 frames of recovery |
| Medium Attack | Heavy Attack | Last 3 frames of recovery |
| Any Attack | Special (V/E) | Active frames only |
| Any Attack | Jump | Anytime |
| Run/Walk | Jump | Anytime |

---

### 7. "Just Frame" Bonuses

**Purpose:** Reward precise timing, add skill ceiling.

**Implementation:**
```javascript
// NeoPlayer_v16.js - handleAnimComplete()
handleAnimComplete() {
    const inputTiming = this.lastInputTime - this.activeFrameTime;
    
    // Just Frame: Input within 50ms of active frame ending
    if (inputTiming >= 0 && inputTiming <= 50) {
        this.isJustFrame = true;
        this.damageMultiplier = 1.1; // +10% damage
        this.recoveryTime *= 0.8;    // 20% faster recovery
        this.showJustFrameFlash();   // Visual feedback
    } else {
        this.isJustFrame = false;
        this.damageMultiplier = 1.0;
    }
}

showJustFrameFlash() {
    // Flash character white for 3 frames
    this.setTint(0xffffff);
    this.scene.time.addEvent({
        delay: 50,
        callback: () => this.clearTint()
    });
}
```

**Visual Feedback:**
- Character flashes white for 3 frames
- Floating text: "JUST!" appears briefly
- Sound: High-pitched "ching!"

---

## 🗺️ LEVEL DESIGN IDEAS

### Level 1: "Noktara - The Memory Maze"

**World:** Realm of Shadow Memory (memories manifest as living shadows)  
**Theme:** Psychological horror, shifting reality  
**Mechanic:** Level changes based on collected "Memory Shards"

#### Shard Types
| Shard | Color | Effect |
|-------|-------|--------|
| Truth Shard | Blue | Platforms appear, enemies weaken |
| False Shard | Red | Illusion walls, trap enemies spawn |

#### Level Layout
```
┌─────────────────────────────────────────────────────────┐
│  START                                                  │
│    │                                                    │
│    ▼                                                    │
│  ┌─────┐  Memory Gate (requires 3 shards)              │
│  │ Hub │───────────────────────┐                        │
│  └─────┘                       ▼                        │
│     │              ┌─────────────────────┐              │
│     ▼              │  Shadow Arena       │              │
│  ┌─────┐          │  (Mini-boss:        │              │
│  │Left │          │   Memory Wraith)    │              │
│  │Path │          └─────────────────────┘              │
│  │(2   │                       │                       │
│  │shards)                      ▼                       │
│  └─────┘              ┌─────────────────────┐          │
│                       │  Truth Vault        │          │
│                       │  (Final shard +     │          │
│                       │   boss gateway)     │          │
│                       └─────────────────────┘          │
└─────────────────────────────────────────────────────────┘
```

#### Unique Features
- **Moving Shadows:** Shadows on walls move independently (creepy atmosphere)
- **Memory Echoes:** Walking through certain areas shows ghost replays of past battles
- **Shard Detection:** Shards glow when player is near (subtle particle effect)
- **Final Gate:** Opens only when all 5 shards collected

#### Combat Arena: "Shadow Colosseum"
- Circular platform with shadow enemies spawning from walls
- Waves: 3 → 5 → 8 → Mini-boss (Memory Wraith)
- Arena darkens as waves progress
- Victory rewards: 500 XP + 200 EC + Truth Shard

#### Enemy Types
| Enemy | Behavior | Weakness |
|-------|----------|----------|
| Shadow Stalker | Teleports behind player | Light attacks (fast) |
| Memory Leech | Drains XP on contact | Area attacks |
| Illusion Knight | Creates 2 fake copies | Hit real one (glows differently) |
| Memory Wraith (Boss) | Steals player moves temporarily | Hit during attack recovery |

#### Assets Needed
```
assets/images/levels/noktara/
├── tileset_noktara.png       (dark purple/blue tiles)
├── bg_noktara.png            (parallax shadow background)
├── memory_shard_blue.png     (collectible)
├── memory_shard_red.png      (collectible)
├── shadow_portal.png         (enemy spawn point)
└── memory_gate.png           (progression gate)
```

---

### Level 2: "Khemra - The Forge Descent"

**World:** Molten realm of living metal (creative fire drained)  
**Theme:** Industrial hazard, rising danger  
**Mechanic:** Rising lava forces upward progression

#### Lava Mechanics
- Lava rises continuously (slow pace)
- Standing in lava: 3 seconds until death
- Visual warning: Screen tint orange, rumble controller
- Safe zones: Designated platforms (marked with green glow)

#### Level Layout
```
┌─────────────────────────────────────────────────────────┐
│                    BOSS: Forge Guardian                 │
│                    ┌───────────────┐                    │
│                    │   TOP PLATFORM │                   │
│                    └───────────────┘                    │
│                           ▲                             │
│                    ┌──────┴──────┐                      │
│              ┌─────┤ Moving Crane │─────┐              │
│              │     └─────────────┘     │                │
│         ┌────┴────┐              ┌─────┴────┐           │
│         │ Platform│              │ Conveyor │           │
│         │  (breaks)│             │  Belt    │           │
│         └─────────┘              └──────────┘           │
│              │                          │               │
│    ┌─────────┴──────┐          ┌────────┴────┐          │
│    │  Starting Zone │          │  Side Route │          │
│    │  (safe zone)   │          │  (extra XP) │          │
│    └────────────────┘          └─────────────┘          │
│                                                         │
│  ~~~ LAVA RISING ~~~ (kills in 3 seconds if touched)   │
└─────────────────────────────────────────────────────────┘
```

#### Unique Features
- **Conveyor Belts:** Push player left/right (affects combat positioning)
- **Breaking Platforms:** Collapse after 2 seconds of standing
- **Moving Cranes:** Timed platforming sections (ride to upper areas)
- **Heat Zones:** Certain areas deal damage over time (dodge quickly)

#### Enemy Types
| Enemy | Behavior | Counter-Strategy |
|-------|----------|------------------|
| Molten Drone | Walks through lava, immune to fire | Use X sword attacks |
| Shield Bot | Front shield blocks attacks | Hit from behind or use V-blast |
| Flying Forger | Drops molten bombs | Anti-air attacks (jump + Z) |
| Forge Guardian (Boss) | Summons adds, lava slam attack | Knock into lava with high KB |

#### Combat Twist: "Lava Execution"
Some enemies can only be killed by knocking them into lava:
- Requires high knockback moves (combo finishers, E blast)
- Rewards: +50% XP, +20 EC bonus
- Visual: Enemy melts dramatically

#### Assets Needed
```
assets/images/levels/khemra/
├── tileset_khemra.png        (orange/red metal tiles)
├── bg_khemra.png             (industrial background with flames)
├── lava.png                  (animated lava surface)
├── lava_bubble.png           (particle effect)
├── conveyor_belt.png         (animated belt)
├── breaking_platform.png     (cracked texture)
├── moving_crane.png          (animated crane)
└── heat_zone.png             (shimmer effect)
```

---

## 🎮 LIGHTWEIGHT RPG SYSTEMS

### 1. XP System

**Core Formula:**
```javascript
// RPGSystem.js
class RPGSystem {
    constructor() {
        this.level = 1;
        this.xp = 0;
        this.xpToNext = 100; // level * 100
    }

    addXP(amount) {
        this.xp += amount;
        
        if (this.xp >= this.xpToNext) {
            this.xp -= this.xpToNext;
            this.level++;
            this.xpToNext = this.level * 100;
            this.onLevelUp();
        }
    }
}
```

**XP Values:**
| Enemy Type | XP Reward |
|------------|-----------|
| Basic Enemy | 10 XP |
| Elite Enemy | 25 XP |
| Mini-Boss | 100 XP |
| Boss | 500 XP |
| Memory Shard (collectible) | 50 XP |

**Visual:** Small XP bar under character portrait during gameplay.

---

### 2. Currency: "Ethics Credits" (EC)

**Purpose:** In-game currency for purchases and unlocks.

**Earning:**
| Source | Amount |
|--------|--------|
| Enemy kill | 5-15 EC |
| Breakable object | 10-30 EC |
| Secret area | 50-100 EC |
| Lava execution | 20 EC (bonus) |
| Level completion | 200-500 EC |

**Spending:**
| Item | Cost | Effect |
|------|------|--------|
| Health Shard | 50 EC | Restore 30% HP (in-level) |
| Move Unlock | 500 EC | New combo branch |
| Stat Boost | 300 EC | +1 to any stat |
| Character Skin | 1000 EC | Alternate appearance |
| Continue (on death) | 100 EC | Resume from checkpoint |

**Implementation:**
```javascript
// RPGSystem.js
addCredits(amount) {
    this.credits += amount;
    this.scene.showFloatingText(`+${amount} EC`, x, y, '#FFD700');
}

purchase(item) {
    if (this.credits >= item.cost) {
        this.credits -= item.cost;
        this.applyItemEffect(item);
        return true;
    }
    return false;
}
```

---

### 3. Stat System (3 Core Stats)

**Stats:**
| Stat | Effect Per Point |
|------|------------------|
| **Power** | +5% damage |
| **Speed** | +10 move speed, +2% attack speed |
| **Will** | +10 HP, +5% XP gain |

**Progression:**
- Start: Power 1, Speed 1, Will 1
- Gain: 1 stat point per level
- Max: 10 points per stat (level 30 cap)

**UI (Pause Menu):**
```
┌─────────────────────────────────┐
│  STATS (3 points available)     │
│                                 │
│  Power: 3  [+] [-]              │
│  Speed: 2  [+] [-]              │
│  Will:  1  [+] [-]              │
│                                 │
│  [Confirm]  [Cancel]            │
└─────────────────────────────────┘
```

**Implementation:**
```javascript
// RPGSystem.js
allocateStat(stat, points) {
    if (this.statPoints >= points && this[stat] + points <= 10) {
        this[stat] += points;
        this.statPoints -= points;
        this.applyStatEffects();
    }
}

applyStatEffects() {
    player.damageMultiplier = 1 + (this.power * 0.05);
    player.runSpeed = 400 + (this.speed * 10);
    player.attackSpeed = 1 + (this.speed * 0.02);
    player.maxHP = 100 + (this.will * 10);
    player.xpMultiplier = 1 + (this.will * 0.05);
}
```

---

### 4. Move Unlock System

**Philosophy:** Instead of having all moves from start, unlock through gameplay progression.

**Unlock Tree:**
| Level | Unlock | Description |
|-------|--------|-------------|
| 1 | Z Combo (3 hits) | Basic punch combo |
| 2 | C Kick Combo | 2-hit kick sequence |
| 3 | X Sword Attacks | 4-hit sword combo |
| 4 | V Blast (Stage 1) | Basic energy projectile |
| 5 | Double Jump | Second jump in air |
| 6 | V Blast (Stage 2+3) | Charged blasts |
| 7 | E Energy Beam | Powerful beam attack |
| 8 | Full Z Combo (8 hits) | Complete punch combo |
| 9 | Air Combos | Attack while jumping |
| 10 | Special Cancel | Cancel attack → special move |

**Alternative: Lore-Based Unlocks**
Instead of level-based, unlock via "Memory Shards" found in levels:
- Noktara Level 1 shards → Unlock V Blast
- Khemra Level 2 shards → Unlock E Beam
- etc.

**Implementation:**
```javascript
// RPGSystem.js
unlockMove(moveId) {
    if (!this.unlockedMoves.includes(moveId)) {
        this.unlockedMoves.push(moveId);
        player.enableMove(moveId);
        this.scene.showUnlockNotification(moveId);
    }
}

// NeoPlayer_v16.js - handleInput()
handleInput() {
    if (Phaser.Input.Keyboard.JustDown(x)) {
        if (this.scene.rpg.unlockedMoves.includes('x_sword')) {
            this.startSwordCombo();
        } else {
            this.showLockedFeedback(); // "Locked - Unlock at Level 3"
        }
    }
}
```

---

## 📋 IMPLEMENTATION PRIORITY

### Phase 1: Combat Feel (4-6 hours)
1. **Hit Stop** (1 hour) - Immediate impact improvement
2. **Screen Shake** (1 hour) - Visual feedback
3. **Particle Impacts** (2 hours) - Requires particle asset
4. **Sound Layering** (2-3 hours) - Requires sound assets

### Phase 2: Enemy Reactions (3-4 hours)
1. **Stagger States** (2 hours) - 4 stagger animations per enemy
2. **Knockback Scaling** (1 hour) - Already partially implemented
3. **Lava Execution** (1 hour) - Khemra-specific

### Phase 3: RPG Systems (6-8 hours)
1. **XP System** (2 hours) - Core tracking + level up
2. **Credits System** (2 hours) - Currency + floating text
3. **Stat System** (2 hours) - UI + stat effects
4. **Move Unlocks** (2-3 hours) - Progression gating

### Phase 4: Level Design (12-16 hours)
1. **Noktara Tileset** (4 hours) - Tiles + background
2. **Noktara Layout** (4 hours) - Platform placement + shards
3. **Khemra Tileset** (4 hours) - Tiles + lava animation
4. **Khemra Layout** (4 hours) - Rising lava mechanic

---

## 🎯 SUCCESS METRICS

### Combat Feel
- [ ] Players report attacks feel "weighty"
- [ ] Hit stop triggers on heavy hits (visual confirmation)
- [ ] Screen shake noticeable but not overwhelming
- [ ] Particles spawn on every hit
- [ ] Sound layers play correctly per hit type

### RPG Systems
- [ ] XP bar visible and updates in real-time
- [ ] Level up screen appears with stats
- [ ] Credits display in HUD
- [ ] Shop/purchase system functional
- [ ] Stat allocation UI works
- [ ] Move unlocks gate abilities correctly

### Level Design
- [ ] Noktara: All 5 shards collectible
- [ ] Noktara: Memory Gate opens with all shards
- [ ] Khemra: Lava rises continuously
- [ ] Khemra: Conveyor belts affect movement
- [ ] Both levels: Playable start to finish

---

## 📁 FILES TO CREATE/MODIFY

### New Files
```
src/systems/
├── RPGSystem.js          # XP, credits, stats, unlocks
└── CombatFeedback.js     # Hit stop, shake, particles

assets/images/particles/
├── spark_particle.png    # 8x8 white pixel
└── dust_puff.png         # 16x16 gray cloud

assets/audio/sfx/
├── hit_light.mp3
├── hit_medium_crack.mp3
├── hit_medium_bass.mp3
├── hit_heavy_boom.mp3
├── hit_heavy_spark.mp3
├── hit_heavy_bass.mp3
├── combo_whoosh.mp3
└── finisher_charge.mp3

assets/images/levels/
├── noktara/              # Memory realm assets
└── khemra/               # Forge realm assets
```

### Modified Files
```
src/entities/
└── NeoPlayer_v16.js      # Combat feedback hooks, move unlocks

src/scenes/
├── BaseScene.js          # Hit stop, shake, particles
├── Boot_v16.js           # Load new assets
└── HUDScene.js           # XP bar, credits display

src/ui/
└── StatMenu.js           # Stat allocation UI
```

---

## 🧪 TESTING CHECKLIST

### Combat
- [ ] Hit stop triggers on finisher attacks
- [ ] Screen shake intensity scales with knockback
- [ ] Particles spawn in correct direction
- [ ] All 3 sound layers play for heavy hits
- [ ] Animation cancels work (attack → jump, attack → special)
- [ ] Just Frame bonus triggers at 50ms window
- [ ] Just Frame flash visible

### RPG
- [ ] XP gained on enemy kill
- [ ] Level up at 100, 200, 300 XP, etc.
- [ ] Stat points awarded on level up
- [ ] Stat effects apply (damage, speed, HP)
- [ ] Credits drop from enemies
- [ ] Floating text shows credit gain
- [ ] Move unlocks gate abilities

### Levels
- [ ] Noktara shards glow when near
- [ ] Noktara gate opens with 5 shards
- [ ] Khemra lava rises continuously
- [ ] Khemra conveyor belts push player
- [ ] Khemra breaking platforms collapse
- [ ] Both levels completable

---

## 📝 NOTES FOR GEMINI-CLI

1. **Start with combat feel** — It's the highest impact/lowest effort
2. **Use existing frame data** — Don't change existing combo timings
3. **Preserve Lord Soul identity** — He's tactical/speed, not brute force
4. **Lore integration** — Tie move unlocks to world progression if possible
5. **Test on multiple enemies** — Combat feel should work vs 1-4 enemies
6. **Performance budget** — Keep 60 FPS, particle counts should scale
7. **Accessibility** — Hit stop should have optional toggle (some players dislike it)

---

**Document Version:** 1.0  
**Status:** Ready for implementation planning  
**Next Step:** Review with team, prioritize features, begin Phase 1
