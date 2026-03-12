# Ethical Avengers V3 — Project Brain

## Architecture
- **Engine**: Phaser 3 (loaded from `phaser.min.js` in root)
- **Entry**: `index.html` → loads all scripts with cache-busting `?v=` params
- **Boot**: `src/scenes/Boot_v16.js` — loads ALL assets (images, spritesheets, tilemaps, audio), creates ALL animations
- **Scenes**: `src/scenes/` — each level is a scene extending `BaseScene`
- **Entities**: `src/entities/NeoPlayer_v16.js` — unified player class
- **Base Class**: `BaseScene` handles player init, combat, enemies, projectiles

## Game Modes
- **Story Mode**: 2.5D side-scroller (existing, future work)
- **Arcade Mode**: Platformer with tilemap levels (current focus)

## Character Prefixes
| Character | Prefix | Assets Path |
|-----------|--------|-------------|
| Chibi Soul | `default` | `assets/images/characters/soul/` (spritesheet) + `CHIBI_SOUL/` (individual frames) |
| Cherry | `cherry` | `assets/images/characters/cherry/` (individual frames) |
| Cro | `cro` | `assets/images/characters/cro/` (spritesheets) |
| Adam | `adam` | `assets/images/characters/adam/` |
| Big Z | `bigz` | Various |
| Ignite | `ignite` | `assets/images/characters/ignite/` |

## Combo System
- `NeoPlayer_v16.js` → `doAttack()` method
- Auto-detects `maxCombo` by checking if `prefix_atkN+1` animation exists
- Each hit increments `this.combo`, plays `prefix_atkN`
- Combo resets after 500ms of no attack
- Variable knockback per hit level (configurable per character)
- Cherry-specific KB values at lines 418-427, everyone else uses generic scaling

## Tilemap Pipeline
- Boot loads JSON maps with `this.load.tilemapTiledJSON(key, path)`
- JunkPlainsScene (and other level scenes) create tilemap + layers
- **CRITICAL**: Do NOT use `layerData.type === 'tilelayer'` check — Phaser 3 `map.layers` only contains tile layers, and `.type` is undefined
- Tilesets mapped via `tilesetMap` object: JSON name → Phaser image key
- All tileset images loaded in Boot as `this.load.image(key, path)`

## Asset Loading Pattern
Cherry uses individual PNGs loaded as multi-atlas:
```javascript
// Boot_v16.js loads individual images into a shared texture
this.load.image('cherry_233', cherryPath + 'cherry_0233.png');
```
Then animations reference frame indices:
```javascript
createModernAnim('cherry_atk1', 'cherry', [233, 235, 237], 0);
```

## Key Lessons Learned
1. **Tilemap layers**: Never filter by `layerData.type` — just iterate `map.layers` directly
2. **Cache busting**: Always add `?v=X.Y.Z` to ALL loaded files (JS, JSON, images)
3. **Image dimensions**: Tileset images must be divisible by tile size (16x16, 32x32)
4. **Duplicate `create()` methods**: JavaScript uses the LAST definition — check for dupes in BaseScene
5. **Tileset name collisions**: Multiple maps may use `tileset` as a name — use per-map overrides
