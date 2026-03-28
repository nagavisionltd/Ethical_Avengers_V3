# Ethical Avengers V3 - Item Asset Generation Prompt

**Use this prompt with AI image generators** (Midjourney, DALL-E 3, Stable Diffusion) to create consistent item assets for the game.

---

## 🎨 MASTER PROMPT TEMPLATE

```
Generate a 2D game item sprite sheet for a retro SEGA-style action platformer. 
Art style: Pixel art, 16-bit aesthetic, vibrant colors, clean edges. 
Base resolution: 32x32 pixels per item, scaled up 4x for visibility. 
Background: Transparent or solid black for easy extraction.

Items to generate:
[INSERT ITEM LIST FROM BELOW]

Additional notes:
- Each item should have a subtle glow effect
- Consistent art style across all items
- Clear silhouette for instant recognition during gameplay
- 3-4 animation frames for floating/bobbing effect where applicable
```

---

## 💎 SOUL SHARDS (End-of-World Reward)

### Item Description
**Name:** Sophia Soul Fragment  
**Purpose:** Awarded after defeating each world boss. Collecting all 8 unlocks the final realm.  
**Lore:** Fragments of the original cosmic consciousness that once balanced all worlds.

### Visual Specifications
| Property | Value |
|----------|-------|
| Size | 48x48 pixels (larger than pickups) |
| Colors | World-specific + golden core |
| Animation | 4-frame rotation + pulse glow |
| Effect | Particle trail, subtle chime sound |

### World-Specific Shard Variants

| World | Shard Name | Primary Color | Secondary | Core | Visual Theme |
|-------|------------|---------------|-----------|------|--------------|
| **Aurelion** | Sun Shard | Radiant Gold | Orange | White | Sun rays, flame-like edges |
| **Noktara** | Shadow Shard | Deep Purple | Black | Silver | Shadow wisps, crescent shapes |
| **Virella** | Life Shard | Emerald Green | Teal | Light Green | Leaf patterns, vine swirls |
| **Khemra** | Forge Shard | Molten Orange | Red | Yellow | Cracked metal, ember glow |
| **Aetherion** | Knowledge Shard | Sky Blue | White | Cyan | Geometric patterns, rune-like |
| **Thalassa** | Empathy Shard | Ocean Blue | Aqua | Pearl | Wave patterns, droplet shapes |
| **Umbra Prime** | Void Shard | Dark Gray | Black | Purple | Fractured, unstable edges |
| **Terra Prima** | Origin Shard | Pure White | Rainbow | Gold | Perfect crystal, all colors refracted |

### Generation Prompt (Per Shard)
```
Generate a 48x48 pixel art crystal shard for a 16-bit action RPG. 
The shard is a [COLOR] crystalline fragment with a [CORE_COLOR] glowing core. 
Visual theme: [THEME DESCRIPTION]. 
The shard has an irregular geometric shape with 3-4 sharp points. 
Add a subtle outer glow in [COLOR]. 
Include 4 animation frames showing slow rotation and pulsing glow. 
Style: SEGA Genesis / SNES era pixel art, clean edges, vibrant colors. 
Background: Transparent.
```

### Example: Noktara Shadow Shard
```
Generate a 48x48 pixel art crystal shard for a 16-bit action RPG. 
The shard is a deep purple crystalline fragment with a silver glowing core. 
Visual theme: Shadow wisps and crescent moon shapes swirling around the crystal. 
The shard has an irregular geometric shape with 3-4 sharp points. 
Add a subtle outer glow in deep purple. 
Include 4 animation frames showing slow rotation and pulsing glow. 
Style: SEGA Genesis / SNES era pixel art, clean edges, vibrant colors. 
Background: Transparent.
```

---

## ❤️ HEALTH ITEMS

### 1. Health Shard (Small Restore)

| Property | Value |
|----------|-------|
| Restore | +30% HP |
| Size | 24x24 pixels |
| Color | Pink/Rose with white glow |
| Drop Rate | Common (30% from enemies) |
| Animation | 2-frame gentle bob |

**Generation Prompt:**
```
Generate a 24x24 pixel art health pickup item. 
A small rose-pink crystal shard with a soft white inner glow. 
The crystal has 2-3 facets that catch light. 
Add a subtle pink aura around the edges. 
Include 2 animation frames showing gentle up-down bobbing motion. 
Style: 16-bit pixel art, clean readable silhouette. 
Background: Transparent.
```

---

### 2. Health Crystal (Full Restore)

| Property | Value |
|----------|-------|
| Restore | +100% HP |
| Size | 32x32 pixels |
| Color | Bright red with golden core |
| Drop Rate | Rare (5% from elites, boss drops) |
| Animation | 4-frame rotation + bright pulse |

**Generation Prompt:**
```
Generate a 32x32 pixel art full-health pickup item. 
A large bright red crystal with a golden glowing core. 
The crystal is well-formed with multiple facets reflecting light. 
Add a strong red-orange aura with sparkles. 
Include 4 animation frames showing slow rotation and bright pulsing glow. 
Style: 16-bit pixel art, premium/rare item appearance. 
Background: Transparent.
```

---

### 3. Life Essence (Max HP Increase)

| Property | Value |
|----------|-------|
| Effect | +10 Max HP (permanent) |
| Size | 40x40 pixels |
| Color | Deep green with life-energy swirl |
| Drop Rate | Very Rare (secrets, 1 per level) |
| Animation | 6-frame swirl + leaf particles |

**Generation Prompt:**
```
Generate a 40x40 pixel art permanent HP upgrade item. 
A deep emerald green orb with swirling life-energy patterns inside. 
Small leaf-shaped particles orbit around the orb. 
The core pulses with vital green light. 
Include 6 animation frames showing swirling energy and orbiting particles. 
Style: 16-bit pixel art, mystical/precious appearance. 
Background: Transparent.
```

---

## 💰 CURRENCY (Ethics Credits - EC)

### 1. Credit Chip (Common)

| Property | Value |
|----------|-------|
| Value | 5 EC |
| Size | 16x16 pixels |
| Color | Copper/bronze |
| Drop Rate | Very Common (enemies, breakables) |
| Animation | 2-frame spin |

**Generation Prompt:**
```
Generate a 16x16 pixel art currency item. 
A small copper-colored credit chip, rectangular with rounded corners. 
Simple geometric design with a small etched symbol in the center. 
Add a subtle metallic sheen. 
Include 2 animation frames showing slight left-right spin. 
Style: 16-bit pixel art, simple readable shape. 
Background: Transparent.
```

---

### 2. Credit Module (Uncommon)

| Property | Value |
|----------|-------|
| Value | 25 EC |
| Size | 20x20 pixels |
| Color | Silver/blue |
| Drop Rate | Uncommon (elite enemies, chests) |
| Animation | 4-frame rotation + glow pulse |

**Generation Prompt:**
```
Generate a 20x20 pixel art currency item. 
A medium silver credit module with blue glowing accents. 
Rectangular shape with tech-like details and circuit patterns. 
The blue glow pulses gently. 
Include 4 animation frames showing rotation and pulsing glow. 
Style: 16-bit pixel art, futuristic tech aesthetic. 
Background: Transparent.
```

---

### 3. Credit Core (Rare)

| Property | Value |
|----------|-------|
| Value | 100 EC |
| Size | 28x28 pixels |
| Color | Gold with rainbow shimmer |
| Drop Rate | Rare (mini-bosses, secret areas) |
| Animation | 8-frame rotation + rainbow trail |

**Generation Prompt:**
```
Generate a 28x28 pixel art currency item. 
A large golden credit core with rainbow shimmer effects. 
Hexagonal shape with intricate geometric patterns. 
The core emits a golden aura with rainbow-colored sparkles trailing behind. 
Include 8 animation frames showing smooth rotation and shimmering rainbow effects. 
Style: 16-bit pixel art, premium/valuable appearance. 
Background: Transparent.
```

---

## ⚡ UTILITY ITEMS

### 1. Energy Cell (Ability Cooldown Reset)

| Property | Value |
|----------|-------|
| Effect | Resets V/E special move cooldown |
| Size | 24x24 pixels |
| Color | Electric blue with lightning |
| Drop Rate | Uncommon (specific enemies) |
| Animation | 4-frame lightning crackle |

**Generation Prompt:**
```
Generate a 24x24 pixel art utility item. 
A cylindrical energy cell glowing with electric blue power. 
Small lightning bolts crackle around the surface. 
The interior shows swirling energy. 
Include 4 animation frames showing crackling lightning and energy swirl. 
Style: 16-bit pixel art, tech/magical hybrid aesthetic. 
Background: Transparent.
```

---

### 2. Memory Echo (Temporary Power Boost)

| Property | Value |
|----------|-------|
| Effect | +50% damage for 30 seconds |
| Size | 32x32 pixels |
| Color | Ethereal white/blue with ghost trail |
| Drop Rate | Rare (specific events) |
| Animation | 6-frame ghostly drift + fade |

**Generation Prompt:**
```
Generate a 32x32 pixel art temporary buff item. 
An ethereal orb of white-blue energy with a ghostly appearance. 
The orb has a trailing mist effect, like a memory fading. 
Subtle face-like patterns form and dissolve in the mist. 
Include 6 animation frames showing drifting motion and fade effects. 
Style: 16-bit pixel art, mystical/haunted aesthetic. 
Background: Transparent.
```

---

### 3. Time Fragment (Slow Motion for 10 seconds)

| Property | Value |
|----------|-------|
| Effect | Time slows for 10 seconds |
| Size | 28x28 pixels |
| Color | Purple with clock-face patterns |
| Drop Rate | Very Rare (puzzle rewards) |
| Animation | 4-frame tick-tock pulse |

**Generation Prompt:**
```
Generate a 28x28 pixel art utility item. 
A purple crystalline fragment with clock-face patterns etched into its surface. 
Roman numerals or clock hands visible inside the crystal. 
The fragment pulses with a rhythmic tick-tock glow pattern. 
Include 4 animation frames showing pulsing glow in rhythm. 
Style: 16-bit pixel art, time-magic aesthetic. 
Background: Transparent.
```

---

## 🗝️ KEY ITEMS (Progression)

### 1. Memory Shard (Noktara Key)

| Property | Value |
|----------|-------|
| Purpose | Opens Memory Gates in Noktara |
| Size | 36x36 pixels |
| Color | Deep blue with shadow wisps |
| Animation | 4-frame shadow swirl |

**Generation Prompt:**
```
Generate a 36x36 pixel art key item. 
A deep blue crystal shard with shadow wisps swirling around it. 
The shard has an almost key-like shape with notches. 
Shadow tendrils extend and retract from the edges. 
Include 4 animation frames showing swirling shadows and pulse. 
Style: 16-bit pixel art, mysterious/magical aesthetic. 
Background: Transparent.
```

---

### 2. Forge Key (Khemra Key)

| Property | Value |
|----------|-------|
| Purpose | Opens forge gates in Khemra |
| Size | 36x36 pixels |
| Color | Molten orange with heat shimmer |
| Animation | 4-frame heat wave distortion |

**Generation Prompt:**
```
Generate a 36x36 pixel art key item. 
A molten orange key made of living metal and fire. 
Heat shimmer distorts the air around the key. 
Glowing cracks run through the surface like cooling lava. 
Include 4 animation frames showing heat distortion and glowing cracks. 
Style: 16-bit pixel art, industrial/magical aesthetic. 
Background: Transparent.
```

---

## 📦 COMBINED SPRITE SHEET LAYOUT

For efficient generation, request items arranged like this:

```
┌─────────────────────────────────────────────────────────┐
│  ROW 1: Soul Shards (8 worlds)                          │
│  [48x48 each, 4 frames each = 384x48 total]             │
│                                                         │
│  ROW 2: Health Items (3 types)                          │
│  [24x24, 32x32, 40x40 with frames = 288x48 total]       │
│                                                         │
│  ROW 3: Currency (3 types)                              │
│  [16x16, 20x20, 28x28 with frames = 256x48 total]       │
│                                                         │
│  ROW 4: Utility Items (3 types)                         │
│  [24x24, 32x32, 28x28 with frames = 336x48 total]       │
│                                                         │
│  ROW 5: Key Items (2 types)                             │
│  [36x36 each, 4 frames each = 288x48 total]             │
└─────────────────────────────────────────────────────────┘
```

---

## 🎨 ART STYLE REFERENCE IMAGES

Include these references when generating:

```
Style references:
- Streets of Rage 2 item pickups (clean, readable)
- Hollow Knight geo/crystal items (glowing, faceted)
- Celeste strawberry/crystal collectibles (simple shapes)
- SNES Final Fantasy crystal shards (multi-faceted)
- Don't: Overly detailed, hard to read at small sizes
- Do: Strong silhouette, 3-5 color palette per item
```

---

## 🔧 TECHNICAL SPECIFICATIONS

### File Format
- **Source:** PNG with transparency
- **Sprite Sheet:** Individual sheets per category OR combined sheet
- **Scale:** Generate at 4x (128x128 for 32px items) then scale down

### Animation Frames
| Item Type | Frames | Frame Rate | Loop |
|-----------|--------|------------|------|
| Soul Shards | 4 | 4 FPS | Yes |
| Health (small) | 2 | 3 FPS | Yes |
| Health (large) | 4 | 4 FPS | Yes |
| Currency | 2-4 | 6 FPS | Yes |
| Utility | 4-6 | 6 FPS | Yes |
| Key Items | 4 | 4 FPS | Yes |

### Color Palette Guidelines
```
Health:    Pink, Red, Green (warm = healing)
Currency:  Copper, Silver, Gold (metallic = value)
Utility:   Blue, Purple, White (cool = magical)
Keys:      World-specific colors (ties to lore)
```

---

## 📝 QUICK COPY-PASTE PROMPTS

### All Health Items
```
Generate pixel art health pickup items for a 16-bit action platformer.
Style: SEGA Genesis era, clean edges, vibrant colors, transparent background.

Items:
1. Small Health Shard (24x24): Rose-pink crystal, white glow, 2-frame bob animation
2. Full Health Crystal (32x32): Bright red crystal, golden core, 4-frame rotation
3. Life Essence Orb (40x40): Emerald green orb, leaf particles, 6-frame swirl

All items should have consistent art style, subtle glow effects, and clear silhouettes.
```

### All Currency Items
```
Generate pixel art currency items for a 16-bit sci-fi action game.
Style: 16-bit pixel art, tech aesthetic, transparent background.

Items:
1. Credit Chip (16x16): Copper rectangle, simple design, 2-frame spin
2. Credit Module (20x20): Silver with blue glow, circuit patterns, 4-frame rotation
3. Credit Core (28x28): Gold hexagon, rainbow shimmer, 8-frame rotation with trail

All items should look like they belong to the same currency system.
```

### All Soul Shards
```
Generate 8 pixel art crystal shards for a fantasy action RPG end-game rewards.
Style: 16-bit SEGA style, vibrant, mystical, transparent background.
Size: 48x48 pixels each, 4-frame rotation animation.

Shards (each with unique color/theme):
1. Aurelion: Gold/orange, sun rays
2. Noktara: Purple/silver, shadow wisps
3. Virella: Green/teal, leaf patterns
4. Khemra: Orange/red, molten cracks
5. Aetherion: Blue/white, geometric runes
6. Thalassa: Aqua/pearl, wave patterns
7. Umbra Prime: Dark gray/purple, fractured
8. Terra Prima: White/rainbow, perfect crystal

All shards should have glowing cores and look like fragments of a greater whole.
```

---

## 🎵 SOUND EFFECT PROMPTS (For Audio AI)

### Item Pickup Sounds
```
Generate short pickup sound effects for a 16-bit action game.
Style: Chiptune/SEGA Genesis, 0.2-0.5 seconds each.

Sounds:
1. Health pickup: Soft pleasant chime, rising pitch (C-E-G)
2. Currency pickup: Metallic "ching" with coin-like ring
3. Soul shard pickup: Ethereal choir swell, 0.5 seconds, magical
4. Power-up pickup: Rising arpeggio, energetic, 0.3 seconds
5. Key item pickup: Deep resonant tone, important/significant feel

Format: WAV or MP3, 44.1kHz, mono.
```

---

**Document Version:** 1.0  
**Ready for:** AI image/audio generation tools  
**Next Step:** Generate assets, import to `assets/images/items/` and `assets/audio/sfx/`
