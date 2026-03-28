# Lord Soul - Move Set Audit & Implementation Status

**Character:** Lord Soul (codename: `lordsoul` / `cro`)  
**World:** The Ethical Overlord - Tactical Fighter  
**Audit Date:** March 20, 2026  
**Source Files:** `Boot_v16.js`, `NeoPlayer_v16.js`

---

## ✅ IMPLEMENTED MOVES & ANIMATIONS

### 🏃 MOVEMENT ANIMATIONS

| Animation | Key | Frames | Status | Notes |
|-----------|-----|--------|--------|-------|
| **Idle** | `lordsoul_idle` | 1 (static) | ✅ | Single frame, loops |
| **Walk** | `lordsoul_walk` | 6 frames | ✅ | Frames: ls_walk_1-6 |
| **Move** | `lordsoul_move` | 1 (static) | ✅ | Fallback movement |
| **Run** | `lordsoul_run` | 8 frames | ✅ | Frames: ls_run_7-14 |
| **Dash Aura** | `lordsoul_dash_aura` | 8 frames | ✅ | Flying soul sprites |
| **Fly** | `lordsoul_fly` | 6 frames | ✅ | Flying soul sprites |
| **Hover** | `lordsoul_hover` | 5 frames | ✅ | Frames: ls_hover_1-5 |
| **Jump** | `lordsoul_jump` | 1 frame | ✅ | ls_jump_up |
| **Jump Forward** | `lordsoul_jump_forward` | 5 frames | ✅ | ls_jump_m_1-5 |
| **Fall** | `lordsoul_fall` | 1 frame | ✅ | ls_jump_m_5 (loop) |
| **Hurt** | `lordsoul_hurt` | 2 frames | ✅ | ls_hit1_1, ls_hit1_2 |

**Movement Mechanics:**
- ✅ Basic left/right movement
- ✅ Running (triggers at >300 velocity)
- ✅ Flying (triggers at >600 velocity / dashing)
- ✅ Hover ability (hold UP in air, unique to Lord Soul)
- ✅ Double jump: **NOT IMPLEMENTED** (no `lordsoul_jump_double` animation)

---

### 👊 Z KEY - 8-HIT PUNCH COMBO

| Hit | Animation | Frames | Frame Rate | Duration | Status |
|-----|-----------|--------|------------|----------|--------|
| **1** | `lordsoul_atk1` | 2 | 18 fps | 111ms | ✅ |
| **2** | `lordsoul_atk2` | 5 | 20 fps | 250ms | ✅ |
| **3** | `lordsoul_atk3` | 3 | 16 fps | 188ms | ✅ |
| **4** | `lordsoul_atk4` | 2 | 14 fps | 143ms | ✅ |
| **5** | `lordsoul_atk5` | 2 | 14 fps | 143ms | ✅ |
| **6** | `lordsoul_atk6` | 6 | 20 fps | 300ms | ✅ |
| **7** | `lordsoul_atk7` | 5 | 20 fps | 250ms | ✅ |
| **8** | `lordsoul_atk8` | 3 | 16 fps | 188ms | ✅ |

**Hitbox Data (NeoPlayer_v16.js):**
```javascript
'lordsoul': {
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

**Status:** ✅ **FULLY IMPLEMENTED**
- All 8 hits have animations
- All hitboxes configured
- Combo window: 280ms (generous for fluid combos)

---

### 🦶 C KEY - 2-HIT KICK COMBO

| Hit | Animation | Frames | Frame Rate | Duration | Status |
|-----|-----------|--------|------------|----------|--------|
| **1** | `lordsoul_kick1` | 3 | 18 fps | 167ms | ✅ |
| **2** | `lordsoul_kick2` | 3 | 18 fps | 167ms | ✅ |

**Hitbox Data:**
```javascript
'lordsoul': {
    1: { activeIndex: 2, hitArea: { w: 140, h: 100, x: 90, y: -20 } },
    2: { activeIndex: 2, hitArea: { w: 140, h: 100, x: 90, y: -20 } }
}
```

**Status:** ✅ **FULLY IMPLEMENTED**
- Both kicks have animations
- Hitboxes configured
- Movement kick exists (`lordsoul_mkick`) but **NOT mapped to controls**

---

### ⚔️ X KEY - 4-HIT SWORD COMBO

| Hit | Animation | Frames | Frame Rate | Duration | Status |
|-----|-----------|--------|------------|----------|--------|
| **1** | `lordsoul_sw1` | 2 | 14 fps | 143ms | ✅ |
| **2** | `lordsoul_sw2` | 2 | 14 fps | 143ms | ✅ |
| **3** | `lordsoul_sw3` | 1 | 10 fps | 100ms | ✅ |
| **4** | `lordsoul_sw4` | 2 | 12 fps | 167ms | ✅ |

**Hitbox Data:**
```javascript
'lordsoul': {
    1: { activeIndex: 1, hitArea: { w: 160, h: 120, x: 100, y: -30 } },
    2: { activeIndex: 1, hitArea: { w: 160, h: 120, x: 100, y: -30 } },
    3: { activeIndex: 0, hitArea: { w: 170, h: 130, x: 110, y: -30 } },
    4: { activeIndex: 1, hitArea: { w: 200, h: 150, x: 130, y: -40 } }
}
```

**Status:** ✅ **FULLY IMPLEMENTED**
- All 4 sword strikes have animations
- Hitboxes configured (increasing range)
- Finisher has largest hitbox (200x150)

---

### 🔫 V KEY - ENERGY BLAST COMBO

| Stage | Animation | Frames | Frame Rate | Duration | Status |
|-------|-----------|--------|------------|----------|--------|
| **Blast 1** | `lordsoul_blast1` | 3 | 18 fps | 167ms | ✅ |
| **Blast 2** | `lordsoul_blast2` | 3 | 16 fps | 188ms | ✅ |

**Projectile Animations:**
| Projectile | Animation | Frames | Frame Rate | Status |
|------------|-----------|--------|------------|--------|
| **Blast 1** | `lordsoul_blast1_proj` | 5 | 20 fps | ✅ |
| **Blast 2** | `lordsoul_blast2_proj` | 4 | 18 fps | ✅ |

**Hitbox Data:**
```javascript
'lordsoul': {
    1: { activeIndex: 2, hitArea: { w: 100, h: 80, x: 70, y: -20 } },
    2: { activeIndex: 2, hitArea: { w: 100, h: 80, x: 70, y: -20 } }
}
```

**Status:** ⚠️ **PARTIALLY IMPLEMENTED**
- ✅ Blast 1 & 2 animations exist
- ✅ Projectile animations exist
- ❌ **Blast 3 missing** (planned 3-stage combo per design docs)
- ❌ Projectile firing logic exists but needs `doFire` callback in scene

---

### 🌊 E KEY - BIG ENERGY BEAM

| Animation | Frames | Frame Rate | Duration | Status |
|-----------|--------|------------|----------|--------|
| `lordsoul_blast3` | 6 | 18 fps | 333ms | ✅ |

**Projectile Animation:**
| Projectile | Animation | Frames | Frame Rate | Status |
|------------|-----------|--------|------------|--------|
| **Big Beam** | `lordsoul_blast3_proj` | 7 | 16 fps | ✅ |

**Status:** ✅ **IMPLEMENTED**
- Beam animation exists (ls_blast_0 to ls_blast_5)
- Projectile animation exists (charged1-6 + sci-fi swirl)
- Fire frame set to frame 5 (delayed release for charge effect)

---

### 🛡️ SPECIAL ANIMATIONS

| Animation | Frames | Frame Rate | Status | Notes |
|-----------|--------|------------|--------|-------|
| **Power Up** | `lordsoul_powerup` | 6 | 12 fps | ✅ | Loops |
| **Shield** | `lordsoul_shield` | 4 | 12 fps | ✅ | Loops |
| **Movement Kick** | `lordsoul_mkick` | 3 | 12 fps | ✅ | **NOT mapped to controls** |
| **Big Beam (Moving)** | `lordsoul_bigbeam` | 3 | 10 fps | ✅ | **NOT mapped to controls** |
| **Jump Attack** | `lordsoul_jump_atk` | 3 | 12 fps | ⚠️ | **Referenced but frames missing** (ls_jk_1-3 not loaded) |

---

## ❌ MISSING ANIMATIONS & MOVES

### 1. **Crouch Animation**
**Status:** ❌ **NOT LOADED**
- Asset path should be: `assets/images/characters/naga-soul-26/animation_frames/crouch/`
- Referenced in code: `lordsoul_crouch`
- **Fix:** Load crouch frames and create animation

---

### 2. **Double Jump Animation**
**Status:** ❌ **NOT IMPLEMENTED**
- Other characters have: `ninja_jump_double` (somersault)
- Lord Soul needs unique double jump (hover takeoff?)
- **Fix:** Create 4-frame double jump animation

---

### 3. **Air Attack**
**Status:** ❌ **NOT IMPLEMENTED**
- Function `doAirAttack()` exists in NeoPlayer_v16.js
- No `lordsoul_atk_air` animation
- **Fix:** Create air attack animation (2-3 frames)

---

### 4. **Jump Attack Frames**
**Status:** ⚠️ **BROKEN**
- Animation `lordsoul_jump_atk` references `ls_jk_1`, `ls_jk_2`, `ls_jk_3`
- These frames are **NOT loaded** in Boot_v16.js
- **Fix:** Either load missing frames or remove animation reference

---

### 5. **V-Blast Stage 3**
**Status:** ❌ **NOT IMPLEMENTED**
- Design docs mention 3-stage blast combo
- Only blast1 and blast2 exist
- **Fix:** Create blast3 animation + projectile (charged blast)

---

### 6. **Movement Kick Mapping**
**Status:** ⚠️ **ANIMATION EXISTS, NOT MAPPED**
- `lordsoul_mkick` animation exists (3 frames)
- No control input triggers it
- **Fix:** Map to input (perhaps dash + C?)

---

### 7. **Big Beam (Moving) Mapping**
**Status:** ⚠️ **ANIMATION EXISTS, NOT MAPPED**
- `lordsoul_bigbeam` animation exists
- No control input triggers it
- **Fix:** Map to input (perhaps moving + E?)

---

## 🔧 MOVE UNLOCK SYSTEM STATUS

Current code in NeoPlayer_v16.js:
```javascript
isMoveUnlocked(moveId) {
    return true; // Move gating disabled for animation testing
}
```

**Planned Unlocks (from design docs):**
| Level | Unlock | Currently Available? |
|-------|--------|---------------------|
| 1 | Z Combo (3 hits) | ✅ All 8 hits available |
| 2 | C Kick Combo | ✅ Available |
| 3 | X Sword Combo | ✅ Available |
| 4 | V Blast (Stage 1) | ✅ Available |
| 5 | Double Jump | ❌ Animation missing |
| 6 | V Blast (Stage 2+) | ✅ Available |
| 7 | E Energy Beam | ✅ Available |
| 8 | Full Z Combo (8 hits) | ✅ All available |
| 9 | Air Combos | ❌ Animation missing |
| 10 | Special Cancel | ⚠️ Partially implemented |

---

## 📊 ASSET CHECKLIST

### Loaded Assets (Boot_v16.js)
```
✅ ls_idle
✅ ls_move
✅ ls_walk_1-6
✅ ls_run_7-14
✅ ls_fly_1-6
✅ ls_dash_aura_1-8
✅ ls_hover_1-5 (plus ls_hover_4 duplicate load)
✅ ls_hit1_1-2 (hurt frames)
✅ ls_hit2_1-2 (unused?)

✅ ls_p1_1-2 through ls_p8_1-3 (all Z punches)
✅ ls_x1_1-2 through ls_x4_1-2 (all X swords)
✅ ls_c1_1-3, ls_c2_1-3 (all C kicks)
✅ ls_v1_1-3, ls_v2_1-3 (V blasts)
✅ ls_blast_0-5 (E beam)

✅ ls_blast1_proj_1-5 (V1 projectile)
✅ ls_blast2_proj_1-4 (V2 projectile)
✅ ls_blast3_proj_1-7 (E projectile)

✅ ls_power_1-6 (powerup)
✅ ls_shield_1-4 (shield)
✅ ls_jump_up (jump)
✅ ls_jump_m_1-5 (jump forward)
✅ ls_jump_kick (unused?)
✅ ls_mkick_1-3 (movement kick)
✅ ls_bigbeam_1-3 (moving beam)
```

### Missing Assets
```
❌ ls_crouch_* (crouch frames)
❌ ls_jump_double_* (double jump frames)
❌ ls_atk_air_* (air attack frames)
❌ ls_jk_1-3 (jump attack - referenced but not loaded)
❌ ls_blast_v3_* (3rd blast stage)
```

---

## 🎯 PRIORITY FIXES

### **HIGH PRIORITY** (Core Functionality)
1. **Fix Jump Attack** - Either load `ls_jk_1-3` frames or remove broken animation reference
2. **Add Crouch** - Load crouch frames, create `lordsoul_crouch` animation
3. **Add Double Jump** - Create 4-frame somersault/hover animation
4. **Add Air Attack** - Create 2-3 frame air attack animation

### **MEDIUM PRIORITY** (Completeness)
5. **Map Movement Kick** - Add input handler for dash + C
6. **Map Moving Big Beam** - Add input handler for moving + E
7. **Add V-Blast Stage 3** - Complete the 3-stage projectile combo

### **LOW PRIORITY** (Polish)
8. **Clean up duplicate loads** - `ls_hover_4` loaded twice
9. **Organize asset paths** - Some inconsistent naming (ls_hit1 vs ls_hit2)

---

## 📝 RECOMMENDED ASSET GENERATION PROMPTS

### For Missing Animations

**Crouch (2-3 frames):**
```
Generate 2-3 frames of Lord Soul crouching down. Character is a 
tactical fighter in ethical overlord attire. Crouch should be 
defensive but ready to spring. 320x400 pixels per frame, 
pixel art style, SEGA Genesis era. Side view, facing right.
```

**Double Jump (4 frames):**
```
Generate 4 frames of Lord Soul performing a double jump. 
Character hovers upward with energy aura around feet. 
Frames should show: 1) initiation, 2) lift-off, 3) apex hover, 
4) descent begin. 320x400 pixels, pixel art, side view.
```

**Air Attack (3 frames):**
```
Generate 3 frames of Lord Soul attacking in mid-air. 
Character performs a diagonal punch or kick while airborne. 
Frames: 1) windup, 2) strike extension, 3) recovery. 
320x400 pixels, pixel art, side view.
```

**V-Blast Stage 3 (3 character frames + 6 projectile frames):**
```
Generate Lord Soul firing a charged energy blast (stage 3 of combo).
Character frames (3): Charging pose, release, recovery.
Projectile frames (6): Energy ball growing larger, more intense 
than blast1/blast2. Bright purple/blue with glow effects.
320x400 pixels for character, 64x64 for projectile.
```

---

## 🎮 COMBO TESTING COMMANDS

To test Lord Soul in-game:
1. Select Lord Soul from character select
2. Test combos:
   - **Z Z Z Z Z Z Z Z** - Full 8-hit punch combo
   - **C C** - 2-hit kick combo
   - **X X X X** - 4-hit sword combo
   - **V V** - 2-stage blast (stage 3 missing)
   - **E** - Big energy beam
   - **Space + UP (in air)** - Hover ability
   - **Left/Right (holding)** - Run → Fly transition

---

## 📈 IMPLEMENTATION PROGRESS

| Category | Progress | Notes |
|----------|----------|-------|
| **Movement** | 85% | Missing crouch, double jump |
| **Z Combo** | 100% | All 8 hits complete |
| **C Kicks** | 100% | Both kicks complete |
| **X Sword** | 100% | All 4 strikes complete |
| **V Blast** | 67% | Missing stage 3 |
| **E Beam** | 100% | Complete |
| **Special** | 60% | Powerup/shield done, jump attack broken |
| **Overall** | **88%** | 5 major items missing |

---

**Document Version:** 1.0  
**Last Updated:** March 20, 2026  
**Next Steps:** Fix HIGH PRIORITY items, then test all combos in-game
