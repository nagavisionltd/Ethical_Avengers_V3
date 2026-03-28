# Game Design Standards 2026 - Sega Beat-Em-Up Framework
## Ethical Avengers V3 - Animation & Combat System

**Inspired by:** Streets of Rage 2, Streets of Rage 3, Gunstar Heroes, Golden Axe  
**Engine:** Phaser 3.55+  
**Resolution:** 320x180 base (scaled), 32px tile grid  
**Target Framerate:** 60 FPS (16.67ms per frame)

---

## 📐 1. SPRITE & ANIMATION STANDARDS

### 1.1 Character Sprite Dimensions

| Character Type | Width (px) | Height (px) | Origin Point | Scale |
|---------------|------------|-------------|--------------|-------|
| **Small (Chibi)** | 32-48 | 48-64 | (0.5, 1.0) | 0.45-0.55 |
| **Medium (Human)** | 48-64 | 80-100 | (0.5, 0.95) | 0.35-0.45 |
| **Large (Big Z)** | 64-96 | 100-140 | (0.5, 0.95) | 0.6-0.8 |
| **Lord Soul** | 48-64 | 85-100 | (0.5, 1.0) | 0.55 |

### 1.2 Frame Normalization Rule

**CRITICAL:** All character sprites must maintain consistent visual size regardless of individual frame dimensions.

```javascript
// NeoPlayer_v16.js - Normalization System
if (this.prefix === 'cro') {
    // Lord Soul - normalize all frames to consistent size
    this.targetDisplayHeight = 350; // Fixed pixel height
} else if (this.prefix === 'default') {
    // Chibi Soul
    this.targetDisplayHeight = 250;
}

// In update() loop:
if (this.frame && this.targetDisplayHeight && this.frame.realHeight > 0) {
    if (this._lastFrameName !== currentFrameName) {
        const newScale = this.targetDisplayHeight / this.frame.realHeight;
        this.setScale(newScale);
        // Recalculate body dimensions...
    }
}
```

### 1.3 Animation Frame Requirements

| Animation Type | Minimum Frames | Optimal Frames | Notes |
|---------------|----------------|----------------|-------|
| Idle | 4 | 6-8 | Breathing motion, blink |
| Walk/Run | 6 | 8-10 | Full stride cycle |
| Jump | 3 | 4-5 | Crouch, launch, apex, fall |
| Light Attack | 2 | 3-4 | Fast startup (2-3f) |
| Heavy Attack | 3 | 5-6 | Clear windup |
| Combo Finisher | 4 | 6-8 | Maximum impact frames |
| Hurt | 2 | 3-4 | Stagger, recovery |
| Knockdown | 3 | 4 | Fall, ground, rise |

---

## ⚔️ 2. COMBAT FRAME DATA STANDARDS

### 2.1 Attack Phase Definitions

```
┌─────────────────────────────────────────────────────────┐
│                    ATTACK ANATOMY                        │
├─────────────┬──────────────┬────────────────────────────┤
│  STARTUP    │   ACTIVE     │      RECOVERY              │
│  (Windup)   │   (Hit)      │      (Commitment)          │
├─────────────┼──────────────┼────────────────────────────┤
│  3-6 frames │  2-4 frames  │      8-15 frames           │
│  No hitbox  │  Hitbox ON   │      No input              │
└─────────────┴──────────────┴────────────────────────────┘
```

### 2.2 Frame Data by Attack Type

#### Light Attacks (Jabs, Quick Kicks)
| Phase | Frames | Duration (ms) @60fps |
|-------|--------|---------------------|
| Startup | 3-4 | 50-67ms |
| Active | 2-3 | 33-50ms |
| Recovery | 6-8 | 100-133ms |
| **Total** | **11-15** | **183-250ms** |

#### Medium Attacks (Straights, Body Blows)
| Phase | Frames | Duration (ms) @60fps |
|-------|--------|---------------------|
| Startup | 5-7 | 83-117ms |
| Active | 3-4 | 50-67ms |
| Recovery | 10-12 | 167-200ms |
| **Total** | **18-23** | **300-383ms** |

#### Heavy Attacks (Uppercuts, Finishers)
| Phase | Frames | Duration (ms) @60fps |
|-------|--------|---------------------|
| Startup | 8-10 | 133-167ms |
| Active | 4-6 | 67-100ms |
| Recovery | 15-20 | 250-333ms |
| **Total** | **27-36** | **450-600ms** |

### 2.3 Lord Soul Specific Frame Data

```javascript
// Boot_v16.js - Animation Timing
// 8-Hit Z Punch Combo
cro_atk1: 2 frames @18fps = 111ms (Light jab - fast)
cro_atk2: 5 frames @20fps = 250ms (Combo builder)
cro_atk3: 3 frames @16fps = 188ms (Medium strike)
cro_atk4: 2 frames @14fps = 143ms (Body blow)
cro_atk5: 2 frames @14fps = 143ms (Uppercut launch)
cro_atk6: 6 frames @20fps = 300ms (Heavy uppercut)
cro_atk7: 5 frames @20fps = 250ms (Power flurry)
cro_atk8: 3 frames @16fps = 188ms (Finisher - max impact)

// 4-Hit X Sword Combo
cro_sw1:  2 frames @14fps = 143ms (Quick slash)
cro_sw2:  2 frames @14fps = 143ms (Return strike)
cro_sw3:  1 frame  @10fps = 100ms (Thrust - instant)
cro_sw4:  2 frames @12fps = 167ms (Finisher - wide arc)

// 2-Hit C Kick Combo
cro_kick1: 3 frames @18fps = 167ms (Front kick)
cro_kick2: 3 frames @18fps = 167ms (Follow-up)

// 3-Hit V Blast Combo
cro_blast1: 3 frames @18fps = 167ms (Quick shot)
cro_blast2: 3 frames @16fps = 188ms (Charged)
cro_blast3: 6 frames @18fps = 333ms (Full power)
```

---

## 🎮 3. INPUT BUFFER & COMBO WINDOWS

### 3.1 Combo Input Timing (Streets of Rage 2 Style)

```javascript
// NeoPlayer_v16.js - handleAnimComplete()

// Character-specific combo windows
let comboWindow = 250; // Default: 250ms (balanced)

if (this.prefix === 'cherry' || this.prefix === 'ninja') {
    comboWindow = 200; // Fast characters: strict timing
} else if (this.prefix === 'bigz') {
    comboWindow = 350; // Heavy characters: lenient timing
} else if (this.prefix === 'cro') {
    comboWindow = 280; // Lord Soul: medium-wide for fluid combos
} else if (this.prefix === 'ignite') {
    comboWindow = 240; // Dr. Ignite: tight technical timing
}

// Input buffer opens during active frames
this.inComboWindow = true; // When frame.index >= activeIndex

// Check buffered input
if (this.comboBuffered) {
    this.comboBuffered = false;
    // Continue combo...
}
```

### 3.2 Input Buffer States

| State | Duration | Description |
|-------|----------|-------------|
| **Startup** | 0ms | Input registered, animation begins |
| **Active Window** | 280ms | Player can buffer next hit |
| **Recovery** | 200ms | Combo resets if no input |
| **Cancel** | Instant | Special moves cancel recovery |

---

## 💥 4. HITBOX & KNOCKBACK STANDARDS

### 4.1 Hitbox Activation

```javascript
// NeoPlayer_v16.js - handleAnimUpdate()

// Hitbox toggles ON at active frame, OFF after
if (frame.index === activeIndex) {
    this.hitArea.body.enable = true;
    
    // Set hitbox dimensions per move
    const reach = hitConfig.hitArea.x;     // Forward range
    const w = hitConfig.hitConfig.w;       // Width
    const h = hitConfig.hitArea.h;         // Height
    const y = hitConfig.hitArea.y;         // Y offset
}
```

### 4.2 Lord Soul Hitbox Configurations

```javascript
// NeoPlayer_v16.js - comboData

'cro': {
    // 8-Hit Punch Combo
    1: { activeIndex: 1, hitArea: { w: 120, h: 100, x: 80, y: -20 } },
    2: { activeIndex: 3, hitArea: { w: 120, h: 100, x: 80, y: -20 } },
    3: { activeIndex: 2, hitArea: { w: 130, h: 110, x: 90, y: -20 } },
    4: { activeIndex: 1, hitArea: { w: 130, h: 110, x: 90, y: -20 } },
    5: { activeIndex: 1, hitArea: { w: 140, h: 120, x: 100, y: -20 } },
    6: { activeIndex: 4, hitArea: { w: 150, h: 130, x: 110, y: -30 } },
    7: { activeIndex: 3, hitArea: { w: 150, h: 130, x: 110, y: -30 } },
    8: { activeIndex: 2, hitArea: { w: 180, h: 150, x: 120, y: -40 } }
}
```

### 4.3 Knockback Scaling

```javascript
// NeoPlayer_v16.js - doAttack()

// Escalating knockback per combo hit
if (this.combo === maxCombo) {
    this.currentKB = 2.5;  // Finisher: maximum knockback
    this.setVelocityX(this.flipX ? -200 : 200);
} else if (this.combo >= maxCombo - 2) {
    this.currentKB = 1.0;  // Late combo: medium knockback
} else if (this.combo >= 3) {
    this.currentKB = 0.5;  // Mid combo: light knockback
} else {
    this.currentKB = 0.1;  // Early combo: minimal knockback
}
```

| Combo Position | Knockback Multiplier | Enemy Stun |
|---------------|---------------------|------------|
| Hit 1-2 | 0.1x | 200ms |
| Hit 3-4 | 0.5x | 300ms |
| Hit 5-6 | 1.0x | 400ms |
| Hit 7+ / Finisher | 2.5x | 600ms |

---

## 🔫 5. PROJECTILE STANDARDS

### 5.1 Projectile Frame Data

| Projectile Type | Startup | Active | Recovery | Speed (px/s) |
|----------------|---------|--------|----------|--------------|
| **Light Blast (V1)** | 2f (33ms) | 3f (50ms) | 3f (50ms) | 800 |
| **Charged Blast (V2)** | 3f (50ms) | 4f (67ms) | 4f (67ms) | 900 |
| **Full Power (V3)** | 4f (67ms) | 6f (100ms) | 6f (100ms) | 1000 |
| **Big Beam (E)** | 6f (100ms) | 8f (133ms) | 8f (133ms) | 600 |

### 5.2 Projectile Spawn Timing

```javascript
// NeoPlayer_v16.js - handleAnimUpdate()

if ((anim.key.includes('shoot') || anim.key.includes('blast')) && !this.hasFired) {
    let fireFrame = 1;
    
    // Lord Soul projectile release frames
    if (this.prefix === 'cro' && anim.key.includes('blast1')) fireFrame = 2;
    else if (this.prefix === 'cro' && anim.key.includes('blast2')) fireFrame = 2;
    else if (this.prefix === 'cro' && anim.key.includes('blast3')) fireFrame = 5;
    
    if (frame.index >= fireFrame) {
        this.hasFired = true;
        if (this.scene.doFire) this.scene.doFire(this);
    }
}
```

### 5.3 Lord Soul Projectile Animations

```javascript
// Boot_v16.js - Projectile Animations

// V Key - 3-Hit Blast Combo
cro_blast1_proj: 4 frames (Bolt) @16fps = 250ms loop
cro_blast2_proj: 6 frames (Crossed) @18fps = 333ms loop
cro_blast3_proj: 6 frames (Charged) @16fps = 375ms loop

// E Key - Big Beam
cro_bigbeam_proj: 6 frames (Waveform) @14fps = 429ms loop

// Impact Effects
cro_hits2_impact: 7 frames @20fps = 350ms (one-shot)
cro_hits5_impact: 8 frames @20fps = 400ms (one-shot)
cro_spark_hit: 4 frames @24fps = 167ms (one-shot)
```

---

## 🎬 6. ANIMATION PRIORITY & CANCELLATION

### 6.1 State Priority Order

```
┌─────────────────────────────────────────┐
│          ANIMATION PRIORITY              │
├─────────────────────────────────────────┤
│  1. Hit Reaction (HIGHEST)              │
│  2. Knockdown                           │
│  3. Special / Super                     │
│  4. Heavy Attack                        │
│  5. Medium Attack                       │
│  6. Light Attack                        │
│  7. Jump                                │
│  8. Crouch                              │
│  9. Run                                 │
│ 10. Idle (LOWEST)                       │
└─────────────────────────────────────────┘
```

### 6.2 Cancel Rules

| From Animation | Can Cancel To | Window |
|---------------|---------------|--------|
| Light Attack | Medium Attack | Last 2 frames |
| Medium Attack | Heavy Attack | Last 3 frames |
| Any Attack | Special Move | Active frames only |
| Run/Walk | Jump | Anytime |
| Jump | Air Attack | Once per jump |

---

## 📊 7. PERFORMANCE STANDARDS

### 7.1 Frame Budget @60 FPS

| Operation | Time Budget | Notes |
|-----------|-------------|-------|
| **Update Loop** | 16.67ms | Total frame time |
| **Physics** | 4ms | Arcade physics only |
| **Animation** | 2ms | Frame updates |
| **Rendering** | 8ms | Sprite batching |
| **Logic** | 2.67ms | AI, input, etc. |

### 7.2 Sprite Optimization

```javascript
// CRITICAL: Disable hitboxes when not active
if (!this.isAtk && this.hitArea && this.hitArea.body) {
    this.hitArea.body.enable = false;
}

// Use frame-based normalization, not per-physics-step
if (this._lastFrameName !== currentFrameName) {
    // Update scale and body ONCE per frame change
    const newScale = this.targetDisplayHeight / this.frame.realHeight;
    this.setScale(newScale);
}
```

---

## ✅ 8. ANIMATION CHECKLIST

### 8.1 Required Animations Per Character

- [ ] **idle** (4-8 frames, loop)
- [ ] **move/walk** (6-8 frames, loop)
- [ ] **run** (6-10 frames, loop)
- [ ] **jump** (3-5 frames, one-shot)
- [ ] **fall** (1-2 frames, loop or one-shot)
- [ ] **hurt** (2-4 frames, one-shot)
- [ ] **atk1-5** (2-6 frames each, one-shot)
- [ ] **kick1-2** (2-4 frames each, one-shot)
- [ ] **sw1-4** (2-4 frames each, one-shot)
- [ ] **blast1-3** (3-6 frames each, one-shot)
- [ ] **hover** (optional, 4 frames, loop)
- [ ] **powerup** (optional, 6 frames, loop)

### 8.2 Quality Assurance Tests

- [ ] All frames display at consistent size (no popping)
- [ ] Hitboxes activate on correct frames
- [ ] Combo input window feels responsive (not too strict/lenient)
- [ ] Projectiles spawn at correct position
- [ ] Knockback scales properly through combos
- [ ] Animation cancels work as intended
- [ ] 60 FPS maintained during 4+ enemy fights

---

## 🛠️ 9. TROUBLESHOOTING

### 9.1 Common Animation Issues

**Problem:** Sprites change size during animation  
**Solution:** Implement `targetDisplayHeight` normalization

**Problem:** Hits don't register  
**Solution:** Check `activeIndex` matches actual frame count (0-indexed!)

**Problem:** Combos feel clunky  
**Solution:** Increase `comboWindow` from 200ms to 280-300ms

**Problem:** Projectiles spawn in wrong position  
**Solution:** Adjust `fireY` offset per character height

**Problem:** Animation gets stuck  
**Solution:** Add `safetyTimer` fallback (600-1000ms)

### 9.2 Debug Commands

```javascript
// Add to NeoPlayer_v16.js update() for debugging
console.log(`Frame: ${this.frame.name}, Index: ${this.anims.currentFrame?.index}`);
console.log(`Hitbox Active: ${this.hitArea.body.enable}`);
console.log(`Combo: ${this.combo}, Window: ${this.inComboWindow}`);
```

---

## 📝 10. IMPLEMENTATION NOTES

### 10.1 File Structure

```
Ethical_Avengers_V3/
├── src/
│   ├── entities/
│   │   └── NeoPlayer_v16.js    # Player controller
│   ├── scenes/
│   │   ├── Boot_v16.js         # Asset loading & anims
│   │   ├── BaseScene.js        # Scene base class
│   │   └── CharacterSelectScene.js
│   └── assets/
│       └── images/
│           └── characters/
│               └── naga-soul-26/
│                   └── animation_frames/
```

### 10.2 Key Files to Modify

1. **Boot_v16.js** - Add asset loads and animation definitions
2. **NeoPlayer_v16.js** - Add character config, combo data, hitboxes
3. **CharacterSelectScene.js** - Add character to roster
4. **BaseScene.js** - Add character to allowed types list

---

**Document Version:** 1.0  
**Last Updated:** March 19, 2026  
**Maintained By:** Ethical Avengers Dev Team
