# Lord Soul - Ethical Avengers V3

## Character Overview
**Lord Soul** (codename: `cro`) is the Ethical Overlord, a tactical fighter specializing in strategic strikes and speed.

## Controls

| Key | Action | Animation | Frames |
|-----|--------|-----------|--------|
| **Z** | Punches/Attacks | 8-Hit Combo | `punches_Z/` |
| **C** | Kicks | 2-Hit Kick Combo | `kicks/` |
| **X** | Sword Attacks | 4-Hit Sword Combo | `sword_attacks_X/` |
| **V** | Energy Blast | 3-Stage Blast Combo | `projectiles/blast_combo_C/` |
| **E** | Energy Beam | Powerful Energy Blast | `projectiles/blast_E/` |

### Movement
- **Arrow Keys** - Move/Hover
- **Space** - Jump (with double jump capability)
- **Up (air)** - Hover ability

## Asset Structure

```
assets/images/characters/naga-soul-26/animation_frames/
├── idle/                    # Idle animation
├── hover/                   # Hovering animation
├── flying_soul_sprites/     # Run/flying animation
├── jump/                    # Jump animations
├── jump_attack/             # Jump attack animations
├── punches_Z/               # Z key punch combos (8 attacks)
│   ├── punch1/             # Jab combo 1
│   ├── punch2/             # Jab combo 2
│   ├── punch3/             # Heavy punch
│   ├── punch4/             # Body blow
│   ├── punch5/             # Uppercut 1
│   ├── punch6/             # Uppercut 2
│   ├── punch7/             # Power jab
│   └── punch8/             # Heavy punch finisher
├── kicks/                   # C key kick combos
│   ├── kick1/              # Kick combo 1
│   ├── kick2/              # Kick combo 2
│   └── movement+kick/      # Moving kick
├── sword_attacks_X/         # X key sword combos
│   ├── strike1/            # Sword strike 1
│   ├── strike2/            # Sword strike 2
│   ├── strike3/            # Sword strike 3
│   └── strike4/            # Sword strike 4 (finisher)
├── projectiles/             # V & E key projectiles
│   ├── blast_combo_C/      # V key blast combo
│   │   ├── blast1/         # Small blast stage 1
│   │   └── blast2/         # Small blast stage 2
│   └── blast_E/            # E key energy beam
├── power_up/                # Power up animation
└── shield/                  # Shield animation
```

## Animation Keys (Boot_v16.js)

### Movement Animations
- `cro_idle` - Standing idle
- `cro_move` - Walking/moving
- `cro_run` - Running/flying (6 frames)
- `cro_hover` - Hovering in air
- `cro_jump` - Jumping
- `cro_fall` - Falling
- `cro_hurt` - Hit reaction

### Attack Animations

#### Z - Punch Combo (8 hits)
- `cro_atk1` - Jab 1 (2 frames)
- `cro_atk2` - Jab 2 (5 frames)
- `cro_atk3` - Heavy punch (3 frames)
- `cro_atk4` - Body blow (2 frames)
- `cro_atk5` - Uppercut (2 frames)
- `cro_atk6` - Heavy uppercut (6 frames)
- `cro_atk7` - Power jab (5 frames)
- `cro_atk8` - Final blow (3 frames)

#### C - Kicks (2 hits)
- `cro_kick1` - Kick combo 1 (3 frames)
- `cro_kick2` - Kick combo 2 (3 frames)

#### X - Sword Attacks (4 hits)
- `cro_sw1` - Sword strike 1 (2 frames)
- `cro_sw2` - Sword strike 2 (2 frames)
- `cro_sw3` - Sword strike 3 (1 frame)
- `cro_sw4` - Sword strike 4 (2 frames)

#### V - Energy Blast Combo
- `cro_blast1` - Energy blast 1 (3 frames)
- `cro_blast2` - Energy blast 2 (3 frames)
- `cro_blast3` - Energy blast 3 (6 frames)

#### E - Energy Beam
- Uses `cro_blast3` animation

### Projectiles
- `cro_blast1_proj` - Blast projectile 1
- `cro_blast2_proj` - Blast projectile 2
- `cro_blast3_proj` - Blast projectile 3 (E key)

### Special
- `cro_powerup` - Power up sequence (6 frames)

## Character Stats (CharacterSelectScene.js)

```javascript
{
    key: 'cro',
    name: 'Lord Soul',
    stats: {
        health: 9,  // High durability
        power: 8,   // Strong attacks
        speed: 7    // Good mobility
    },
    bio: "LORD SOUL\n\nThe Ethical Overlord.\nSpecialty: Tactical Strikes & Speed."
}
```

## Player Configuration (NeoPlayer_v16.js)

### Scale & Origin
```javascript
case 'cro': // Lord Soul (naga-soul-26)
    this.setScale(0.55);
    this.setOrigin(0.5, 1);
    this.runSpeed = 460 + speedBonus;
```

### Combo Data
Lord Soul has an extensive 8-hit melee combo with precise hitbox timing:
- Hits 1-5: Standard punch combo
- Hits 6-7: Heavy attacks
- Hit 8: Finisher

### Kick Data
2-hit kick combo with active hitbox frames configured.

### Sword Data
4-hit sword combo with increasing range and damage.

### Blast Data
3-stage energy blast projectile combo.

## Implementation Status

✅ **Fully Implemented**
- All movement animations
- All attack animations (Z, C, X, V, E)
- Character selection screen
- Stats and bio
- Hitbox configurations
- Projectile systems
- Hover ability
- Asset loading in Boot_v16.js

## Files Modified for Lord Soul

1. **src/scenes/Boot_v16.js**
   - Asset loading (lines 377-454)
   - Animation definitions (lines 669-707)

2. **src/entities/NeoPlayer_v16.js**
   - Character calibration (scale, origin, speed)
   - Combo data for all attack types
   - Control handling

3. **src/scenes/CharacterSelectScene.js**
   - Character roster entry
   - Stats configuration
   - Bio text
   - Thumbnail display

## Testing

To test Lord Soul:
1. Run the game: `python start_server.py` or `npm start`
2. Select "Lord Soul" from character selection
3. Test all controls:
   - Z: 8-hit punch combo
   - C: 2-hit kick combo
   - X: 4-hit sword combo
   - V: Energy blast projectiles
   - E: Powerful energy beam
   - Space + Up: Jump and hover

## Notes

- Lord Soul uses the `cro` prefix throughout the codebase
- Character has unique hover ability when holding Up in air
- All animations are properly configured with hitbox timing
- Projectile system uses character-specific blast animations
- Scale is set to 0.55 to match other characters' visual size
