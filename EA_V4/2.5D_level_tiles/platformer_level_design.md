# Level Design Document
## **NEON SHOGUN — Stage 1: "The Aura-Nympha Slums"**

**Document Version:** 1.0  
**Author:** Manus AI  
**Engine Target:** Phaser 3  
**Genre:** 2D Side-Scrolling Platformer Beat-Em-Up  
**Core Mechanics:** Double Jump, Wall Slide

---

## 1. LEVEL OVERVIEW

### Theme and Setting

The Aura-Nympha Slums is a vertical labyrinth of corrugated iron walkways, neon-drenched market stalls, and rusted maintenance scaffolding that clings to the base of the Omni-Corp Arcology Tower like barnacles on a ship's hull. Rain falls constantly, pooling in gutters and cascading off broken awnings. Holographic advertisements flicker in the fog. The architecture is a collision of feudal Japanese aesthetics — torii gates, paper lanterns, sliding shoji panels — and brutal industrial cyberpunk infrastructure. Steam pipes burst through wooden floors. Electrical conduits run alongside bamboo gutters.

The colour palette is dominated by deep indigo and charcoal, punctuated by aggressive neon pinks, electric blues, and the amber glow of lanterns. The visual language signals danger through red and yellow hazard markings and the pulsing red eyes of enemy units.

### Narrative Context

The player controls **Kage**, a cybernetically enhanced shinobi whose clan was massacred by Omni-Corp's private military force, the **Tetsukai**. Kage has tracked the Tetsukai's commander, **Director Mori**, to the Omni-Corp Arcology Tower. Stage 1 is Kage's approach through the slums district at the tower's base — a territory now fully occupied and patrolled by Tetsukai units. The level ends with Kage defeating the Tetsukai's district enforcer, a heavily armed combat mech known as the **Arachno-Rig**, and gaining access to the tower's lower maintenance elevator.

### Level Statistics

| Attribute | Value |
| :--- | :--- |
| **Total Horizontal Length** | ~6,400 pixels (200 tiles × 32px) |
| **Maximum Vertical Height** | ~1,600 pixels (50 tiles × 32px) |
| **Estimated Play Time** | 10–15 minutes (skilled player), 20–25 minutes (first-time player) |
| **Number of Combat Arenas** | 3 locked arenas + 1 boss arena |
| **Number of Platforming Sections** | 6 distinct sections |
| **Number of Hazard Sections** | 2 dedicated hazard gauntlets |
| **Secrets** | 2 hidden areas |
| **Difficulty Curve** | Gentle introduction → escalating complexity → high-intensity boss |

### Difficulty Curve Summary

The level is structured in three acts. **Act I** (Sections P1 through C1) is a controlled introduction that teaches double jump and wall slide in safe, low-stakes environments before presenting the first combat encounter with only basic enemies. **Act II** (Sections P2 through C2) introduces environmental hazards, vertical traversal, and more dangerous enemy compositions. **Act III** (Sections P3 through the Boss) combines all mechanics under pressure, culminating in a multi-phase boss fight that demands fluent use of both movement abilities.

The design philosophy follows the **Teach → Test → Twist** model: each mechanic is introduced in a safe context (Teach), then required in a slightly more demanding context (Test), then combined with other mechanics or hazards in an unexpected way (Twist). Double jump is taught in P1, tested in P3, and twisted in the boss arena where platforms are destroyed progressively. Wall slide is taught in P2, tested in P4, and twisted in the final ascent where the walls themselves are electrified on a timer.

---

## 2. FULL LEVEL MAP/LAYOUT

### Top-Level Flow Diagram

```
[START]──P1──►[C1]──P2──►[H1]──P3──►[C2]──P4──►P5──►[H2]──►[C3]──P6──►[BOSS]
                                              │                        │
                                             [S1]                    [S2]
```

**Legend:**
- `P#` — Platforming Section
- `[C#]` — Locked Combat Arena
- `[H#]` — Hazard Gauntlet Section
- `[S#]` — Secret Area (accessible from adjacent platforming section)
- `[BOSS]` — Boss Arena

---

### Section-by-Section Breakdown

---

#### P1 — "Rooftop Run" (Introductory Platforming)

**Length:** ~800px (25 tiles wide, 10 tiles tall)  
**Mechanics Introduced:** Double Jump  
**Tone:** Brisk, confident, cinematic opening

The level opens with a brief cutscene of Kage landing on a rain-slicked rooftop from off-screen, his silhouette lit by a neon sign. The player is immediately given control. The first section is a wide, mostly flat rooftop with three progressively larger gaps. The first gap is narrow enough to clear with a single jump. The second gap requires a double jump, and a small visual cue — a flickering neon arrow — points upward to suggest the mechanic. The third gap is the widest and requires a full double jump at the peak of the first jump. A collectible (a small **Spirit Orb**, the level's currency) is placed at the apex of the ideal double-jump arc to reward correct execution and teach the player to jump at the right moment.

**Environmental Storytelling:** Overturned food stalls, scattered belongings, and a smashed paper lantern tell the story of a community that fled in a hurry. A Tetsukai patrol drone can be seen flying in the background, establishing the threat.

**ASCII Layout (P1):**

```
  ___________   ___   _________   ______   ___________
 |           | |   | |         | |      | |           |
 |   START   | |   | |         | |      | |           |
 |___________| |___| |_________| |______| |___________|
                 ^                  ^
             [1st gap]          [2nd gap — double jump]
                                              ^
                                         [3rd gap — wide double jump]
```

---

#### C1 — "The Watchtower Roof" (First Combat Arena)

**Length:** ~640px (20 tiles wide, 8 tiles tall)  
**Arena Type:** Flat rooftop with two low crates as cover  
**Lock Trigger:** Kage crosses a cracked neon sign on the ground; a red energy barrier drops across both sides of the screen

This is the player's first locked combat encounter. The arena is deliberately wide and flat to allow the player to focus entirely on learning the combat system without platforming pressure. Two low crates provide minor cover and can be used to jump over enemies. The waves escalate gently.

**Environmental Storytelling:** A dead Tetsukai soldier slumped against a ventilation unit suggests that someone else was here before Kage — a mystery seeded for later in the game.

**Wave Design:**

| Wave | Enemies | Spawn Positions | Special Conditions |
| :--- | :--- | :--- | :--- |
| 1 | 2× Ronin-Bot | Left edge, Right edge | None. Simple introduction. |
| 2 | 3× Ronin-Bot | Left edge (×2), Right edge (×1) | None. Player must manage two enemies at once. |
| 3 | 2× Ronin-Bot + 1× Kunoichi-Drone | Left edge, Right edge, Top-center platform | The Kunoichi-Drone spawns on a high crate and fires shurikens. Player must prioritize the ranged threat. |

**Completion Reward:** The energy barrier drops, a **Health Shard** (small health restore) spawns in the center, and a door to the next section slides open.

---

#### P2 — "The Descent Shaft" (Wall Slide Introduction)

**Length:** ~320px wide, ~800px tall (10 tiles wide, 25 tiles tall)  
**Mechanics Introduced:** Wall Slide  
**Tone:** Tense, deliberate, slightly claustrophobic

The player drops into a vertical maintenance shaft. The shaft is too narrow to fall freely — the walls are close enough that the player will naturally make contact with them. A glowing tutorial prompt appears: **[Hold ↓ against wall to slide]**. The shaft has three "landing ledges" at intervals, allowing the player to rest and plan. Between the second and third ledge, a pair of electrified walls forces the player to slide down one wall, push off to the other, and slide again — a controlled introduction to chained wall slides. The bottom of the shaft opens into a wider corridor.

**Hazard:** Two electrified wall segments (marked with yellow-and-black hazard stripes) are active on a 3-second on/off cycle. The player must time their wall slide to avoid them.

**ASCII Layout (P2 — vertical cross-section):**

```
   |  |
   |  |  ← Shaft entrance (top)
   |  |
   |██|  ← Ledge 1 (safe rest point)
   |  |
  ⚡|  |  ← Electrified wall segment (left, timed)
   |  |
   |  |⚡ ← Electrified wall segment (right, timed)
   |  |
   |██|  ← Ledge 2 (safe rest point)
   |  |
   |  |
   |  |  ← Exit (bottom, opens to H1)
```

---

#### H1 — "The Steam Pipe Corridor" (Hazard Gauntlet 1)

**Length:** ~640px (20 tiles wide, 6 tiles tall)  
**Mechanics Tested:** Double Jump (to clear steam blasts)  
**Tone:** Rhythmic, punishing but fair

A horizontal corridor lined with industrial steam pipes. Pipes burst at regular intervals, sending a column of scalding steam upward that deals damage and knocks the player back. The pipes fire in a staggered left-to-right pattern, creating a rhythm the player must learn. The first two pipes fire slowly enough to walk between. The third and fourth pipes fire faster and are spaced closer together, requiring a double jump to clear the gap between their blast zones. A **Spirit Orb** is placed directly above the fourth pipe's blast zone — collectible only by a player who times their double jump perfectly through the steam.

**Hazard Properties:**
- Steam blast: 1 tile wide, 3 tiles tall, 1.5 seconds active, 2-second cooldown
- Damage: 10 HP per second of contact
- Knockback: Moderate horizontal push in the direction the player is facing

---

#### P3 — "The Ascending Shaft" (Vertical Traversal + Moving Platforms)

**Length:** ~320px wide, ~960px tall (10 tiles wide, 30 tiles tall)  
**Mechanics Tested:** Wall Slide + Double Jump (combined)  
**New Element:** Moving Platforms  
**Tone:** Energetic, vertical, exciting

A tall vertical shaft that the player must ascend. Unlike P2, which was about controlled descent, P3 is about rapid upward movement. The shaft alternates between sections with moving platforms and sections requiring wall jumps. Moving platforms travel horizontally across the shaft on a 2-second cycle. The player must use a wall slide on one side to build momentum, then double jump to land on a moving platform, then wall jump from the opposite wall to reach the next platform. The sequence is designed to feel like a rhythm game when executed correctly.

**Moving Platform Types:**
- **Standard Platform:** 3 tiles wide, moves left-right across a 6-tile span, 2-second cycle
- **Short Platform:** 2 tiles wide, moves left-right across a 4-tile span, 1.5-second cycle (introduced in the upper half of the shaft)

**Environmental Storytelling:** Through a cracked wall, the player can see into an adjacent room where two Tetsukai soldiers are playing cards, oblivious to Kage's presence. This is a moment of levity and world-building.

---

#### C2 — "The Bridge Ambush" (Combat Arena 2)

**Length:** ~480px (15 tiles wide, 10 tiles tall)  
**Arena Type:** Narrow suspended bridge with two lower platforms accessible by dropping down  
**Lock Trigger:** Kage steps onto the bridge's center; searchlights pin him from both ends

The bridge is the level's most tactically interesting combat arena. It is narrow — only 3 tiles wide — which limits the player's horizontal movement and makes crowd control critical. However, two lower platforms (accessible by dropping off the bridge's edge) provide escape routes and flanking opportunities. Enemies that are knocked off the bridge's edge fall to a lower platform rather than dying, adding a layer of persistence. The arena rewards aggressive, mobile play.

**Wave Design:**

| Wave | Enemies | Spawn Positions | Special Conditions |
| :--- | :--- | :--- | :--- |
| 1 | 2× Kunoichi-Drone | Far left platform, Far right platform (above bridge) | Drones hover above and fire down. Player must jump to engage them. |
| 2 | 1× Sumo-Brute | Center of bridge (drops from above) | The bridge shakes on impact. The Sumo-Brute's ground slam can knock the player off the bridge. |
| 3 | 2× Ronin-Bot + 2× Kunoichi-Drone | Ronin-Bots from both ends; Drones from above | Maximum pressure. Player must use the lower platforms to avoid the Drones while fighting the Ronin-Bots. |

**Environmental Hazard:** The bridge has two sections of broken railing (marked with a different tile). If the player is knocked back into these sections, they fall to the lower platform. This is not lethal but costs time.

---

#### P4 — "Neon Alley" (Dense Platforming + Secret 1)

**Length:** ~960px (30 tiles wide, 12 tiles tall)  
**Mechanics Tested:** Wall Slide (precision), Double Jump (precision)  
**Tone:** Exploratory, visually rich, slightly slower

A dense urban alleyway with multi-level platforms — fire escapes, market awnings, hanging signs, and protruding air conditioning units. The path forward is not immediately obvious, encouraging the player to explore. The main path runs along the middle level. The upper path is faster but requires more precise platforming. The lower path is slower but safer.

**Secret Area S1 — "The Herbalist's Cache":** On the upper path, a section of wall appears slightly different (a subtle colour variation — a cracked brick texture). A wall slide against this wall causes it to crumble, revealing a hidden alcove containing a **Full Health Restore** and a **Spirit Orb ×5**. Reaching this alcove requires a double jump from a hanging sign, followed by a wall slide down the crumbling wall. This secret is designed to reward players who are actively exploring the upper path and paying attention to environmental details.

---

#### P5 — "The Conveyor Floor" (Mechanical Hazard Platforming)

**Length:** ~640px (20 tiles wide, 8 tiles tall)  
**New Element:** Conveyor Belts  
**Tone:** Frantic, momentum-based

An industrial loading floor with conveyor belts moving in alternating directions. The player must use the conveyor belts' momentum to their advantage — running with a belt to build speed for a long jump, or fighting against a belt to hold position. Three conveyor segments move rightward (helpful), two move leftward (hazardous), and one moves rightward at double speed (launching the player into a long jump over a gap). A **Spirit Orb** is placed at the apex of the launch-pad conveyor's trajectory.

**Conveyor Belt Properties:**
- Speed: 1.5 tiles/second (standard), 3 tiles/second (fast)
- Direction: Indicated by animated arrows on the belt surface
- Effect: Adds velocity to the player's horizontal movement; does not affect vertical movement

---

#### H2 — "The Piston Chamber" (Hazard Gauntlet 2)

**Length:** ~320px (10 tiles wide, 8 tiles tall)  
**Tone:** Short, brutal, high-stakes

A short but extremely dangerous section with four large industrial pistons that extend downward from the ceiling on a staggered timing cycle. Each piston occupies a 2-tile-wide column. The gaps between pistons are 1 tile wide — just enough to stand in. The player must sprint through the chamber, timing their movement to pass under each piston as it retracts. A double jump is required to clear a small raised platform in the middle of the chamber, which means the player must time both the jump and the piston above the platform simultaneously.

**Piston Properties:**
- Cycle: 1 second extended, 1 second retracted
- Stagger: Each piston is offset by 0.5 seconds from the previous
- Damage: Instant kill (the piston crushes the player against the floor)

---

#### C3 — "The Inner Courtyard" (Combat Arena 3)

**Length:** ~800px (25 tiles wide, 14 tiles tall)  
**Arena Type:** Multi-level courtyard with three platform tiers, destructible barrels, and a central hazard  
**Lock Trigger:** Kage drops through a skylight into the courtyard; the skylight seals behind him

This is the level's largest and most complex combat arena. The courtyard has three tiers: a ground floor, a mid-level walkway, and a high rooftop platform. A large **Plasma Conduit** runs across the ground floor — touching it deals continuous damage. The player must use the upper tiers to avoid the conduit while fighting enemies. Destructible barrels are scattered across all tiers; when destroyed, they explode and deal area damage to both the player and enemies.

**Wave Design:**

| Wave | Enemies | Spawn Positions | Special Conditions |
| :--- | :--- | :--- | :--- |
| 1 | 3× Ronin-Bot + 1× Geisha-Bot | Ronin-Bots on ground floor; Geisha-Bot on mid-level walkway | The Geisha-Bot's shield makes the Ronin-Bots immune to damage. Player must reach and destroy the Geisha-Bot first. |
| 2 | 2× Sumo-Brute | One on ground floor, one on mid-level walkway | The ground-floor Sumo-Brute's ground slam activates the Plasma Conduit (it sparks and expands for 3 seconds). |
| 3 | 2× Corrupted Shinobi + 2× Kunoichi-Drone | Corrupted Shinobi drop from the skylight; Drones fly in from the sides | The most dangerous wave. Corrupted Shinobi can wall-slide and will pursue the player aggressively across all tiers. |

**Completion Reward:** The Plasma Conduit powers down, a **Full Health Restore** spawns on the mid-level walkway, and a large door on the right side of the courtyard opens.

---

#### P6 — "The Final Ascent" (Culminating Platforming + Secret 2)

**Length:** ~640px wide, ~1,280px tall (20 tiles wide, 40 tiles tall)  
**Mechanics Tested:** All mechanics combined under time pressure  
**Tone:** Climactic, urgent, fast-paced

A tall exterior wall of the Omni-Corp tower's base. The player must ascend rapidly. The section combines moving platforms, timed electrified wall segments, and conveyor-belt ledges. The design is intentionally demanding — this is the final test before the boss. The electrified walls fire on a 2-second on/2-second off cycle, requiring the player to wall-slide in short bursts between safe windows.

**Secret Area S2 — "The Smuggler's Cache":** Approximately two-thirds of the way up the ascent, a section of the wall has a faint outline of a door (a subtle environmental cue — slightly different brick pattern). The player must perform a wall slide against this section for 1 full second (longer than a normal wall slide) to trigger the door. Inside is a **Weapon Power-Up** (Kage's shurikens are upgraded to deal double damage for the remainder of the level, including the boss fight) and a **Spirit Orb ×10**. This secret is designed to reward patient, observant players who notice the subtle environmental cue.

---

#### BOSS ARENA — "The Loading Dock" (Boss Encounter)

**Length:** ~960px (30 tiles wide, 16 tiles tall)  
**Arena Type:** Large industrial loading dock with four platform tiers and destructible cover  
**Lock Trigger:** Kage enters the loading dock; the entrance gate slams shut behind him

The arena is wide and tall, with four platform tiers of varying heights. Several large metal crates provide destructible cover on the ground floor. The boss, the **Arachno-Rig**, enters from the right side of the screen.

---

## 3. ENEMY WAVE DESIGN (DETAILED)

### C1 — "The Watchtower Roof" (Detailed)

**Arena Dimensions:** 20 tiles wide × 8 tiles tall  
**Environmental Hazards:** None (intentionally clean for learning)  
**Platform Layout:** Flat ground with two low crates (1 tile tall × 2 tiles wide) at positions x=6 and x=14

**Wave 1 — "First Contact"**

Two Ronin-Bots spawn simultaneously: one at the left edge (x=1), one at the right edge (x=19). They walk toward the player at medium speed. Their attack pattern is a simple 2-hit combo with a 0.5-second telegraph (they raise their cyber-katana before striking). This wave is designed to be trivially easy — its purpose is to let the player feel the combat system's responsiveness.

**Wave 2 — "Pressure Test"**

Three Ronin-Bots spawn: two at the left edge (x=1, x=2) and one at the right edge (x=19). The two left-side spawns create a minor crowd-management challenge. Players who have learned to juggle enemies with the combat system will handle this comfortably; players who have been button-mashing will feel the first hint of pressure.

**Wave 3 — "Aerial Threat Introduction"**

Two Ronin-Bots spawn at the left and right edges. A Kunoichi-Drone spawns on top of the right crate (x=14, y=2) and immediately begins firing shurikens at the player. The shuriken fires at a 1-second interval and travels at medium speed. The drone is the priority target — it will continue firing while the Ronin-Bots close in. Players who ignore the drone will be hit repeatedly. Players who jump to attack the drone will expose themselves to the Ronin-Bots. The correct approach is to bait the Ronin-Bots close, then use a jumping attack to hit the drone while also striking the Ronin-Bots below.

**Escalation Logic:** Wave 1 teaches basic combat. Wave 2 introduces crowd management. Wave 3 introduces the concept of priority targeting and multi-axis threats (ground + air).

---

### C2 — "The Bridge Ambush" (Detailed)

**Arena Dimensions:** 15 tiles wide × 10 tiles tall  
**Environmental Hazards:** Broken railing sections at x=4–5 and x=10–11 (fall to lower platform, not lethal)  
**Platform Layout:** Main bridge at y=5 (3 tiles wide), lower-left platform at y=8 (4 tiles wide), lower-right platform at y=8 (4 tiles wide)

**Wave 1 — "Aerial Suppression"**

Two Kunoichi-Drones spawn above the bridge: one at the far left (x=2, y=2), one at the far right (x=13, y=2). They hover in place and fire shurikens downward at the player. The player cannot reach them with ground attacks — a jump or double jump is required. The narrow bridge makes dodging the shurikens difficult without jumping. This wave teaches the player that the lower platforms are safe zones (drones do not descend below the bridge level).

**Wave 2 — "The Brute Drops In"**

A Sumo-Brute drops from above, landing in the center of the bridge (x=7, y=5) with a shockwave that knocks the player back 2 tiles. The Sumo-Brute's ground slam attack, if used on the bridge, has a 30% chance of causing the bridge to shake (camera shake effect, 0.3 seconds). The narrow bridge makes the Sumo-Brute extremely dangerous — the player must use the lower platforms to create distance and find openings to attack.

**Wave 3 — "Full Assault"**

Two Ronin-Bots spawn from both ends of the bridge (x=1 and x=14). Two Kunoichi-Drones spawn above (x=4, y=2 and x=11, y=2). This is the most chaotic wave of the first half of the level. The player is pressured from all directions. The lower platforms become essential escape routes. The correct strategy is to drop to a lower platform to avoid the Drones, then jump back up to engage the Ronin-Bots when they approach the broken railing sections.

**Escalation Logic:** Wave 1 establishes the vertical threat and teaches the lower platforms as safe zones. Wave 2 introduces a powerful ground threat that makes the bridge itself dangerous. Wave 3 combines both threats simultaneously, forcing the player to use the full arena.

---

### C3 — "The Inner Courtyard" (Detailed)

**Arena Dimensions:** 25 tiles wide × 14 tiles tall  
**Environmental Hazards:** Plasma Conduit along ground floor (x=5 to x=20, y=13); Destructible Barrels at x=3, x=8, x=17, x=22 (all tiers)  
**Platform Layout:** Ground floor (y=13), mid-level walkway (y=8, x=3 to x=22), high rooftop (y=3, x=8 to x=17)

**Wave 1 — "Shield Wall"**

Three Ronin-Bots spawn on the ground floor (x=3, x=12, x=22). A Geisha-Bot spawns on the mid-level walkway (x=12, y=8) and immediately activates its energy shield, projecting a dome that covers the ground floor below it. While the shield is active, the Ronin-Bots within its radius are immune to all damage. The shield has a 5-second duration and a 3-second cooldown. The player must reach the mid-level walkway and destroy the Geisha-Bot before the Ronin-Bots can be damaged. This wave teaches the concept of priority targeting in a more demanding context than Wave 3 of C1.

**Wave 2 — "Ground Shakers"**

Two Sumo-Brutes spawn: one on the ground floor (x=5, y=13), one on the mid-level walkway (x=18, y=8). The ground-floor Sumo-Brute's ground slam attack has a special interaction with the Plasma Conduit: each slam causes the conduit to spark and expand its damage radius by 1 tile for 3 seconds. After three slams, the conduit is fully expanded and covers the entire ground floor, forcing the player to stay on the upper tiers. This creates a dynamic hazard escalation within the wave itself.

**Wave 3 — "The Shinobi Hunters"**

Two Corrupted Shinobi drop from the skylight (x=8 and x=17, y=0). Two Kunoichi-Drones fly in from the left and right sides (x=1, y=5 and x=24, y=5). The Corrupted Shinobi are the most dangerous enemies in the level — they can wall-slide and will actively pursue the player across all tiers. They will use wall slides to reach the high rooftop platform if the player retreats there. The player cannot simply hide on the upper tiers; they must engage aggressively. The Kunoichi-Drones add constant ranged pressure. The correct strategy is to use the destructible barrels as area-damage tools, detonating them near clusters of enemies.

**Escalation Logic:** Wave 1 introduces a support-unit mechanic that forces a change in priority. Wave 2 introduces a dynamic environmental hazard that escalates within the wave. Wave 3 introduces enemies that can match the player's movement abilities, eliminating safe zones.

---

## 4. ENEMY ROSTER

### 4.1 Ronin-Bot

**Description:** The standard infantry unit of the Tetsukai. A humanoid robot chassis clad in worn samurai armour plating, with a glowing red visor and a crackling cyber-katana. Ronin-Bots are individually manageable but dangerous in groups.

**Behaviour Pattern:** The Ronin-Bot walks toward the player at a steady pace. When within melee range (1.5 tiles), it performs a 2-hit or 3-hit combo. After completing a combo, it pauses for 0.8 seconds — this is its primary vulnerability window. It will not chase the player off a platform edge; it will stop at the edge and wait for the player to return.

**Attack Types:**
- **Cyber-Katana Combo (2-hit):** Two quick horizontal slashes. Telegraph: visor flashes white 0.3 seconds before the first hit. Damage: 8 HP per hit.
- **Cyber-Katana Combo (3-hit):** Three slashes, the third being a downward overhead strike with a slightly longer range. Telegraph: visor flashes white, then the bot raises its sword overhead. Damage: 8 HP per hit.

**Interaction with Player Mechanics:** The Ronin-Bot does not react to the player being airborne — it will not adjust its attack timing based on the player's jump. This means a double jump over a Ronin-Bot mid-combo is a reliable escape. A wall slide is not directly useful against a Ronin-Bot in open combat, but can be used to reposition quickly in shaft-like arenas.

| Attribute | Value |
| :--- | :--- |
| **Health** | 30 HP |
| **Speed** | 2.5 tiles/second |
| **Aggression** | Medium — will pursue player across the arena |
| **Damage** | 8 HP per hit |

---

### 4.2 Kunoichi-Drone

**Description:** A small, hovering combat drone modelled after a stylised female ninja. It has two blade-arms folded against its chassis and a shuriken launcher mounted on its chest. Its body is painted matte black with pink neon trim.

**Behaviour Pattern:** The Kunoichi-Drone hovers at a fixed height (approximately 3 tiles above the nearest platform) and fires shurikens at the player at 1.5-second intervals. After firing 3 shurikens, it repositions to a new hover point (moves 3–5 tiles horizontally). It will not descend to ground level. If the player is directly below it, it will drop a single bomb (area-of-effect, 2-tile radius) before repositioning.

**Attack Types:**
- **Shuriken:** Travels in a straight line at medium speed. Damage: 6 HP. Can be deflected by the player's melee attack.
- **Proximity Bomb:** Dropped directly below the drone. Explodes after 1 second. Damage: 15 HP. Area of effect: 2-tile radius.

**Interaction with Player Mechanics:** The Kunoichi-Drone is specifically designed to punish players who stay on the ground. A double jump is the primary tool for reaching and attacking it. A wall slide can be used to ascend a wall quickly and reach the drone's height, then push off for a jumping attack. The drone's repositioning behaviour means the player must anticipate its next position rather than simply chasing it.

| Attribute | Value |
| :--- | :--- |
| **Health** | 20 HP |
| **Speed** | 3 tiles/second (repositioning) |
| **Aggression** | Medium — fires continuously but does not pursue aggressively |
| **Damage** | 6 HP (shuriken), 15 HP (bomb) |

---

### 4.3 Sumo-Brute

**Description:** A massively built humanoid robot with a sumo wrestler's body type — wide, low to the ground, and heavily armoured. Its chassis is painted in the red-and-white colours of a traditional sumo mawashi. Its fists are oversized hydraulic rams.

**Behaviour Pattern:** The Sumo-Brute moves slowly but relentlessly toward the player. It has a large hitbox and will push the player back on contact even without attacking. Its primary attack, the Ground Slam, has a long wind-up but enormous area of effect. It will not stop moving until it reaches the player or is staggered by a heavy attack.

**Attack Types:**
- **Shoulder Charge:** Moves at double speed for 2 tiles in the player's direction. Damage: 20 HP. Telegraph: leans back and snorts steam from its exhaust vents 0.5 seconds before charging.
- **Ground Slam:** Raises both fists and slams the ground, creating a shockwave that travels 4 tiles in each direction. Damage: 25 HP. Telegraph: raises both fists overhead for 1 full second (a very long, readable wind-up). The shockwave travels along the ground only — a jump clears it entirely.

**Interaction with Player Mechanics:** The Ground Slam is specifically designed to be countered by a jump. The long telegraph is intentional — the player has ample time to react. A double jump is useful for clearing the shockwave and immediately counter-attacking from above. The Sumo-Brute's slow speed means a wall slide is rarely necessary against it directly, but can be used to reposition quickly in multi-enemy scenarios.

| Attribute | Value |
| :--- | :--- |
| **Health** | 80 HP |
| **Speed** | 1.5 tiles/second |
| **Aggression** | High — will not stop pursuing the player |
| **Damage** | 20 HP (charge), 25 HP (ground slam) |

---

### 4.4 Geisha-Bot

**Description:** A slender, elegant robot with a traditional geisha's white face paint and elaborate hair ornaments — all rendered in chrome and neon. It moves gracefully and does not engage in direct combat. Its purpose is to support and protect other units.

**Behaviour Pattern:** The Geisha-Bot identifies the nearest group of allied enemies and positions itself 2–3 tiles above them (on a platform or elevated position). It then activates its energy shield, which projects a dome covering a 4-tile radius below it. While the shield is active, all enemies within the dome are immune to damage. The shield has a 5-second active duration and a 3-second cooldown. The Geisha-Bot will attempt to reposition if the player approaches it directly.

**Attack Types:**
- **Energy Shield:** Passive protection for nearby allies. Not a direct attack. The shield itself does not damage the player on contact.
- **Escape Dash:** If the player comes within 2 tiles, the Geisha-Bot performs a quick dash 4 tiles in the opposite direction. Cooldown: 3 seconds.

**Interaction with Player Mechanics:** The Geisha-Bot is always positioned on an elevated surface, making it a target that requires a jump or double jump to reach. A wall slide can be used to ascend to its position quickly. The Geisha-Bot's Escape Dash means the player must commit to a fast, aggressive approach rather than a slow, cautious one.

| Attribute | Value |
| :--- | :--- |
| **Health** | 40 HP |
| **Speed** | 2 tiles/second (repositioning) |
| **Aggression** | Low — avoids direct combat |
| **Damage** | 0 (no direct attacks) |

---

### 4.5 Corrupted Shinobi

**Description:** A former human shinobi who has been forcibly cybernetically augmented by Omni-Corp. Their body is a disturbing fusion of organic tissue and exposed mechanical components. They move with the fluid, unpredictable grace of a trained ninja. Their eyes glow a sickly green.

**Behaviour Pattern:** The Corrupted Shinobi is the most sophisticated enemy in the level. It mirrors many of the player's own movement capabilities. It will wall-slide to pursue the player vertically, use its own dash to close distance rapidly, and will attempt to flank the player by approaching from an unexpected direction. It reads the player's position and attempts to attack from the player's blind side.

**Attack Types:**
- **Dash Strike:** Closes distance instantly (3 tiles) and delivers a single powerful strike. Damage: 18 HP. Telegraph: crouches slightly and its eyes flash green 0.4 seconds before dashing.
- **Aerial Kick:** If the player is airborne, the Corrupted Shinobi will jump and deliver a kick. Damage: 15 HP. This attack specifically punishes players who over-rely on jumping as an escape.
- **Smoke Bomb:** Throws a smoke bomb at its feet, becoming invisible for 1.5 seconds before reappearing behind the player. Cooldown: 8 seconds.

**Interaction with Player Mechanics:** The Corrupted Shinobi is specifically designed to challenge both of the player's core movement abilities. Its Aerial Kick punishes double jumps used as an escape. Its wall-slide ability means the player cannot escape to a wall and slide away safely. The player must use their movement abilities offensively — double jumping to attack from above, or wall-sliding to reposition faster than the Shinobi can track.

| Attribute | Value |
| :--- | :--- |
| **Health** | 50 HP |
| **Speed** | 4 tiles/second |
| **Aggression** | Very High — actively pursues and flanks the player |
| **Damage** | 18 HP (dash strike), 15 HP (aerial kick) |

---

### 4.6 Tetsukai Rifleman

**Description:** A standard Tetsukai foot soldier in full tactical armour, armed with a plasma rifle. Unlike the Ronin-Bot, the Rifleman is a human soldier. It appears only in the later sections of the level (P4 onwards) as a background threat and in C3's environmental storytelling.

**Behaviour Pattern:** The Rifleman maintains distance from the player (4–6 tiles) and fires plasma bolts at regular intervals. It will retreat if the player closes the distance. It is not a primary combat threat but adds consistent ranged pressure.

**Attack Types:**
- **Plasma Bolt:** Fires a slow-moving plasma projectile. Damage: 10 HP. Can be deflected by the player's melee attack.
- **Retreat:** If the player comes within 3 tiles, the Rifleman backs away and attempts to maintain distance.

| Attribute | Value |
| :--- | :--- |
| **Health** | 25 HP |
| **Speed** | 2 tiles/second |
| **Aggression** | Low — prefers to maintain distance |
| **Damage** | 10 HP (plasma bolt) |

---

### 4.7 Shield-Samurai

**Description:** An elite Tetsukai unit clad in heavy samurai armour with a large energy shield mounted on its left arm. It appears only in the final combat arena (C3, Wave 3) as a rare, high-value threat. It is slow but nearly impervious to frontal attacks.

**Behaviour Pattern:** The Shield-Samurai walks slowly toward the player with its shield raised, blocking all frontal attacks. It attacks with a powerful shield bash when the player is within range. Its back and top are unprotected — the player must get behind it or attack from above to deal damage.

**Attack Types:**
- **Shield Bash:** Slams its shield forward, dealing high damage and significant knockback. Damage: 22 HP. Telegraph: shield glows bright white 0.5 seconds before the bash.
- **Overhead Slam:** If the player is directly above it, it raises its sword and slams downward. Damage: 20 HP. Telegraph: looks upward for 0.3 seconds.

**Interaction with Player Mechanics:** The Shield-Samurai is a direct test of the double jump. The player must double jump over the Shield-Samurai to attack its back, or use a wall slide to get above it and drop down onto it. The Overhead Slam punishes players who hover directly above it for too long.

| Attribute | Value |
| :--- | :--- |
| **Health** | 60 HP (front is immune; back/top take normal damage) |
| **Speed** | 1.5 tiles/second |
| **Aggression** | Medium — slow but relentless |
| **Damage** | 22 HP (shield bash), 20 HP (overhead slam) |

---

## 5. PACING CHART

The following chart maps the level's intensity on a scale of 1 (minimal engagement, breather) to 10 (maximum intensity, full focus required) against elapsed time. The chart follows the classic action-game "heartbeat" pattern: peaks of high intensity followed by valleys of recovery.

```
Intensity
  10 |                                                              ████
   9 |                                                         ████████
   8 |                                              ████  ████████████
   7 |                                         ████████████████████████
   6 |                              ████  ████████████████████████████
   5 |                         ████████████████████████████████████████
   4 |              ████  ████████████████████████████████████████████
   3 |         ████████████████████████████████████████████████████████
   2 |    ████████████████████████████████████████████████████████████
   1 | ████████████████████████████████████████████████████████████████
     +----------------------------------------------------------------->
     P1  C1  P2  H1  P3  C2  P4  P5  H2  C3  P6  BOSS
     0s  30s 90s 135s 165s 225s 300s 360s 405s 425s 515s 575s
```

**Beat-by-Beat Breakdown:**

| Beat | Section | Type | Intensity | Est. Duration | Design Purpose |
| :--- | :--- | :--- | :---: | :--- | :--- |
| 1 | P1 — Rooftop Run | Platforming | 2 | 30 sec | Teach double jump; establish tone and setting |
| 2 | C1 — Watchtower Roof | Combat | 4 → 5 | 60 sec | First combat encounter; introduce basic enemies |
| 3 | P2 — Descent Shaft | Platforming | 3 | 45 sec | Teach wall slide; controlled, deliberate pacing |
| 4 | H1 — Steam Corridor | Hazard | 4 | 30 sec | Test double jump under mild pressure |
| 5 | P3 — Ascending Shaft | Platforming | 5 | 60 sec | Combine wall slide + double jump; introduce moving platforms |
| 6 | C2 — Bridge Ambush | Combat | 6 → 7 | 75 sec | Multi-axis combat; test spatial awareness |
| 7 | P4 — Neon Alley | Platforming | 4 | 60 sec | Breather; exploration; Secret 1 |
| 8 | P5 — Conveyor Floor | Platforming | 5 | 45 sec | Momentum-based challenge; test timing |
| 9 | H2 — Piston Chamber | Hazard | 7 | 20 sec | High-stakes, short, punishing gauntlet |
| 10 | C3 — Inner Courtyard | Combat | 8 → 9 | 90 sec | Complex multi-wave arena; all mechanics under pressure |
| 11 | P6 — Final Ascent | Platforming | 6 | 60 sec | Culminating platforming challenge; Secret 2 |
| 12 | BOSS — Arachno-Rig | Boss | 9 → 10 | 120 sec | Final test of all mechanics; climactic encounter |

**Pacing Notes:**

The level deliberately places a lower-intensity platforming section (P4 — Neon Alley) immediately after the demanding C2 combat arena. This is a conscious recovery beat — the player's heart rate drops, they have time to explore, and the discovery of Secret 1 provides a positive emotional reward before the difficulty ramps back up. Similarly, P5 and H2 serve as a two-beat escalation ramp leading into C3, the level's most demanding combat arena.

The boss fight begins at intensity 9 and escalates to 10 in its second phase. There is no recovery beat after C3 — P6 maintains a 6/10 intensity to keep the player in a heightened state before the boss. This is intentional: the player should arrive at the boss arena already feeling the pressure.

---

## 6. BOSS: THE ARACHNO-RIG

### Overview

The **Arachno-Rig** is a spider-shaped combat mech approximately 6 tiles wide and 5 tiles tall. It is piloted by **Tetsukai District Commander Yashida**, visible through a reinforced glass cockpit in the mech's thorax. The mech has eight articulated legs, a rotary cannon mounted on its abdomen, and two missile pods on its back. Its design is a fusion of a mechanical spider and a feudal Japanese war machine — its armour plating is lacquered black with gold trim, and its legs end in curved blades.

The boss arena is a large industrial loading dock (30 tiles wide × 16 tiles tall) with four platform tiers:
- **Ground Floor** (y=15): Wide, with two large metal crates as destructible cover (x=5 and x=20)
- **Mid Platform A** (y=10, x=2 to x=10): Left side of the arena
- **Mid Platform B** (y=10, x=20 to x=28): Right side of the arena
- **High Platform** (y=5, x=10 to x=20): Center of the arena, accessible only by double jump from the mid platforms

The Arachno-Rig begins the fight on the right side of the arena and moves left to engage the player.

---

### Phase 1 (100% → 50% HP)

**HP:** 400  
**Behaviour:** The Arachno-Rig moves slowly across the ground floor, occasionally climbing to the mid platforms. It attacks with its rotary cannon and leg strikes.

**Attack Patterns:**

**Rotary Cannon Sweep:** The cannon rotates from left to right, firing a continuous stream of bullets across the ground floor. The sweep takes 2 seconds to complete. The player must jump to avoid it — a single jump is sufficient to clear the bullet stream, but a double jump is needed to reach the mid platforms and counter-attack the cannon's mounting point (its weak spot during this phase). The cannon's mounting point glows orange when vulnerable.

**Leg Stab:** The Arachno-Rig raises one of its front legs and stabs it down at the player's position. Damage: 25 HP. Telegraph: the leg rises and the mech leans slightly in the player's direction for 0.7 seconds. The stab creates a small shockwave (1-tile radius) on impact. The player can dodge by moving away from the mech or by jumping over the leg.

**Missile Barrage:** Fires three missiles in an arc. The missiles travel slowly and home weakly on the player's position. Damage: 20 HP each. The player can outrun the missiles by moving quickly, or destroy them with melee attacks. Cooldown: 8 seconds.

**Weak Point (Phase 1):** The rotary cannon's mounting point on the abdomen. Accessible only from above (mid platform or high platform level) while the cannon is in its sweep animation. The cannon is invulnerable at all other times.

**Phase 1 Transition:** At 50% HP, the Arachno-Rig rears up on its hind legs, roars (Commander Yashida's voice crackles through a speaker: *"Impressive. But you haven't seen what this machine can really do."*), and slams back down, destroying both metal crates on the ground floor and cracking the floor surface (purely visual). The rotary cannon detaches and falls to the ground (destroyed), and two new weapon systems activate.

---

### Phase 2 (50% → 0% HP)

**HP:** 200 (continuing from Phase 1 transition)  
**Behaviour:** The Arachno-Rig becomes more aggressive and faster. It now uses the full arena, including the high platform. The cockpit (Commander Yashida) becomes the new weak point.

**Attack Patterns:**

**Laser Beam:** A high-powered laser fires from the mech's eyes, sweeping horizontally across the arena at a fixed height (y=12 — mid-platform level). The sweep takes 3 seconds. The player must either drop to the ground floor (below the beam) or jump to the high platform (above the beam). A double jump is required to reach the high platform from the ground floor. The laser cannot be deflected or destroyed.

**Shockwave Slam:** The Arachno-Rig raises all eight legs and slams them down simultaneously, creating a massive shockwave that travels across the entire ground floor. Damage: 30 HP. The shockwave also destroys any remaining cover on the ground floor. The player must be on a mid or high platform to avoid it. Telegraph: the mech rises slowly for 1.5 seconds before slamming down — a very readable wind-up. Cooldown: 10 seconds.

**Leg Swipe:** A faster, wider version of the Phase 1 Leg Stab. The mech sweeps one leg horizontally across the ground floor, covering 5 tiles. Damage: 20 HP. The player must jump over the sweeping leg. A double jump is not required but can be used to counter-attack from above.

**Cockpit Charge:** The Arachno-Rig charges directly at the player, attempting to ram them with its cockpit. Damage: 35 HP. Telegraph: the cockpit glows red for 0.5 seconds before the charge. The player must jump over the mech entirely — a double jump is required to clear its full height.

**Weak Point (Phase 2):** The cockpit glass. Accessible only from the high platform (direct line of sight) or by jumping over the mech during its Cockpit Charge and attacking from above. The cockpit is vulnerable for 2 seconds after each Cockpit Charge attempt.

**Platform Destruction:** During Phase 2, the Shockwave Slam has a 25% chance per slam of destroying one of the mid platforms (chosen randomly). This progressively reduces the player's safe zones and forces more reliance on the high platform and double jumps.

**Defeat:** At 0 HP, the Arachno-Rig's legs buckle and it collapses. Commander Yashida ejects from the cockpit and escapes through a vent in the ceiling (setting up a future encounter). The loading dock's elevator activates, and the level ends.

---

## 7. ENVIRONMENTAL HAZARDS

### 7.1 Electrified Walls

**Locations:** P2 (Descent Shaft), P6 (Final Ascent)  
**Behaviour:** Wall segments marked with yellow-and-black hazard stripes and a crackling electrical effect. Active on a timed cycle (2 seconds on, 2 seconds off in P6; 3 seconds on, 3 seconds off in P2). Contact while active deals 15 HP per second and prevents wall sliding. Contact while inactive allows normal wall sliding.  
**Visual Cue:** The hazard stripes pulse brighter as the activation cycle approaches. A 0.3-second warning flash precedes activation.  
**Design Purpose:** Forces the player to time their wall slides carefully rather than holding the wall indefinitely. In P6, the timing is tighter and the player must plan multiple wall slides in sequence.

### 7.2 Steam Vents

**Locations:** H1 (Steam Pipe Corridor)  
**Behaviour:** Vertical columns of scalding steam that burst upward from floor-mounted vents. Active on a staggered left-to-right cycle (1.5 seconds active, 2 seconds inactive). Contact deals 10 HP per second and applies moderate upward knockback.  
**Visual Cue:** The vent shakes and emits a small puff of steam 0.5 seconds before full activation.  
**Design Purpose:** Teaches the player to read environmental rhythms and time movement accordingly. The upward knockback can be used intentionally — a player who times a jump into a steam vent at the moment of activation will be launched higher than a normal double jump, allowing access to a hidden collectible.

### 7.3 Crushing Pistons

**Locations:** H2 (Piston Chamber)  
**Behaviour:** Large industrial pistons that extend downward from the ceiling on a staggered cycle (1 second extended, 1 second retracted, 0.5-second offset between each piston). Contact with the piston while it is extended and the player is on the ground results in instant death (the player is crushed). Contact with the piston while it is moving (transitioning between states) deals 30 HP and knockback.  
**Visual Cue:** The piston emits a hydraulic hiss 0.3 seconds before extending. A red warning light above each piston illuminates during the extension phase.  
**Design Purpose:** Creates a high-stakes, rhythmic movement challenge. The instant-kill mechanic is the level's only one-hit-kill hazard (outside of bottomless pits), and it is telegraphed clearly enough to be fair.

### 7.4 Plasma Conduit

**Locations:** C3 (Inner Courtyard)  
**Behaviour:** A large energy conduit running along the ground floor of C3. In its base state, it deals 8 HP per second to any player standing on it. When activated by the Sumo-Brute's ground slam, it expands its damage radius by 1 tile per slam (up to 3 tiles total) and increases its damage to 15 HP per second for 3 seconds before returning to base state.  
**Visual Cue:** The conduit glows a steady blue in its base state. When activated, it pulses bright white and emits sparks.  
**Design Purpose:** Creates a dynamic hazard that escalates based on enemy behaviour, forcing the player to manage both the enemy threat and the environmental threat simultaneously. The conduit's expansion mechanic rewards players who quickly defeat the Sumo-Brute before it can trigger multiple slams.

### 7.5 Destructible Barrels

**Locations:** C3 (Inner Courtyard), Boss Arena  
**Behaviour:** Large metal barrels filled with pressurised fuel. When struck by any attack (player or enemy), they explode after a 0.5-second delay. The explosion deals 20 HP to any character within a 2-tile radius. The explosion can chain to adjacent barrels.  
**Visual Cue:** The barrel flashes red when struck, indicating the imminent explosion.  
**Design Purpose:** Provides the player with a tactical tool for area-of-effect damage. A skilled player can lure groups of enemies near a barrel and then detonate it. However, the player must be careful not to be caught in the explosion radius themselves.

### 7.6 Bottomless Pits

**Locations:** P1 (Rooftop Run), C2 (Bridge Ambush — sides of bridge), P3 (Ascending Shaft — falling off a platform)  
**Behaviour:** Falling into a bottomless pit results in instant death and respawn at the last checkpoint.  
**Visual Cue:** The pit edges are marked with a subtle darker tile variant and a faint downward-moving particle effect (falling debris) to indicate depth.  
**Design Purpose:** Standard platformer hazard. The double jump is the primary tool for avoiding pit deaths. In C2, the bridge's broken railing sections lead to a lower platform rather than a pit, making the bridge safer than it initially appears.

---

## 8. COLLECTIBLES & SECRETS

### 8.1 Spirit Orbs (Standard Collectible)

**Description:** Small, glowing cyan orbs that serve as the level's primary currency. Collected automatically on contact. Used to purchase upgrades between levels.  
**Placement Philosophy:** Spirit Orbs are placed along the ideal movement path to reward correct execution of platforming challenges. An orb placed at the apex of a double-jump arc teaches the player the optimal jump timing. An orb placed on a wall-slide path teaches the player to hold the wall longer.  
**Total in Level:** 47 orbs (32 on the main path, 15 in secret areas).

### 8.2 Health Shards (Minor Restore)

**Description:** Small red crystals that restore 20 HP on contact. Placed after difficult sections as a reward and recovery tool.  
**Placement:** One Health Shard after C1, one after C2, one on the mid-level walkway in C3 (awarded on completion).

### 8.3 Full Health Restore

**Description:** A large glowing vial that restores the player to full health. Rare and valuable.  
**Placement:** One in Secret Area S1 (P4), one awarded on completion of C3.

---

### Secret Area S1 — "The Herbalist's Cache"

**Location:** P4 — Neon Alley, upper path  
**Access Method:** On the upper path of P4, a section of wall (approximately x=18, y=3) has a subtly different tile texture — slightly cracked brickwork with a faint green glow at its base. The player must perform a wall slide against this specific section and hold it for 0.8 seconds (longer than a typical wall slide). The wall crumbles and reveals a hidden alcove.

**Contents:**
- 1× Full Health Restore
- 5× Spirit Orbs
- 1× Lore Fragment: A holographic note from a slum resident describing the Tetsukai occupation

**Design Rationale:** This secret is designed for players who are actively exploring the upper path and paying attention to environmental details. The cracked wall texture is a subtle but consistent visual language — the same texture appears on destructible walls throughout the level. Players who have noticed and experimented with destructible walls earlier will be primed to recognise this cue. The 0.8-second hold requirement filters out accidental discoveries — the player must intentionally commit to the wall slide.

---

### Secret Area S2 — "The Smuggler's Cache"

**Location:** P6 — Final Ascent, approximately two-thirds of the way up  
**Access Method:** At a specific point in the ascent (approximately y=20 from the bottom of the shaft), a section of the wall has a faint door outline — a rectangular seam in the brick, barely visible. The player must perform a wall slide against this section and hold it for 1.2 seconds. A mechanical click is heard, and the door swings inward.

**Contents:**
- 1× Weapon Power-Up (Shurikens deal double damage for the remainder of the level, including the boss fight)
- 10× Spirit Orbs
- 1× Lore Fragment: A smuggler's manifest listing contraband items, hinting at the underground resistance network

**Design Rationale:** This secret is the level's most significant reward and is intentionally harder to find. The door outline is subtler than S1's cracked wall, and the 1.2-second hold requirement is longer. The Weapon Power-Up is a meaningful mechanical reward that makes the boss fight significantly easier — it is a direct incentive for thorough exploration. Players who find this secret will feel genuinely rewarded, and the boss fight will feel more manageable as a result.

---

## 9. TECHNICAL NOTES (PHASER 3 IMPLEMENTATION)

### 9.1 Tile Dimensions and Grid

| Property | Value |
| :--- | :--- |
| **Tile Size** | 32 × 32 pixels |
| **Level Width** | 200 tiles (6,400 pixels) |
| **Level Height** | 50 tiles (1,600 pixels) |
| **Viewport Size** | 800 × 450 pixels (25 × 14 tiles visible at once) |
| **Pixel Scale** | 1× (no scaling; designed for 800×450 native) |

### 9.2 Tilemap Layer Structure

The tilemap should be structured in Phaser 3 using **Tiled Map Editor** (`.tmx` format) with the following layers, rendered in order from bottom to top:

| Layer Index | Layer Name | Type | Purpose |
| :--- | :--- | :--- | :--- |
| 0 | `bg_sky` | Tile Layer | Static background sky/fog (no parallax) |
| 1 | `bg_far` | Tile Layer | Distant city skyline (parallax factor: 0.2) |
| 2 | `bg_mid` | Tile Layer | Mid-distance buildings (parallax factor: 0.5) |
| 3 | `bg_near` | Tile Layer | Near-background details (parallax factor: 0.8) |
| 4 | `hazards` | Tile Layer | Hazard tiles (steam vents, plasma conduit); collision checked separately |
| 5 | `platforms` | Tile Layer | **Primary collision layer** — all solid ground, walls, platforms |
| 6 | `decorations_back` | Tile Layer | Non-collidable background decorations (signs, pipes behind player) |
| 7 | `decorations_front` | Tile Layer | Non-collidable foreground decorations (rain, foreground pipes) |
| 8 | `objects` | Object Layer | Enemy spawns, collectibles, triggers, camera zones, secrets |

### 9.3 Camera Behaviour and Scroll

**Standard Scrolling:** The camera follows the player using Phaser 3's built-in `camera.startFollow()` with a lerp factor of `0.1` on the X axis and `0.15` on the Y axis. This creates a slight lag that feels cinematic without being disorienting.

```javascript
// Standard camera follow setup
this.cameras.main.startFollow(player, true, 0.1, 0.15);
this.cameras.main.setDeadzone(80, 60); // Dead zone prevents micro-jitter
```

**Camera Bounds:** The camera is bounded to the level dimensions to prevent showing beyond the tilemap edges.

```javascript
this.cameras.main.setBounds(0, 0, 6400, 1600);
```

### 9.4 Camera Lock Zones (Combat Arenas)

Each combat arena uses a **trigger zone** (defined as a rectangle in the `objects` layer in Tiled) that, when the player enters it, activates a camera lock sequence. The lock is implemented as follows:

1. The player enters the trigger zone (detected via `Phaser.Geom.Rectangle.Contains`).
2. The camera lerp is set to `1.0` (instant snap) and the camera moves to the arena's centre position over 0.3 seconds using a tween.
3. Two energy barrier sprites are spawned at the left and right edges of the arena.
4. The `ArenaManager` class begins the wave sequence.
5. On wave completion, the barriers are destroyed with a particle effect, and the camera lerp returns to `0.1`.

```javascript
// Simplified arena lock trigger
class ArenaManager {
  constructor(scene, arenaRect, waves) {
    this.scene = scene;
    this.arenaRect = arenaRect;
    this.waves = waves;
    this.currentWave = 0;
    this.locked = false;
  }

  checkTrigger(playerX, playerY) {
    if (!this.locked && Phaser.Geom.Rectangle.Contains(this.arenaRect, playerX, playerY)) {
      this.lockArena();
    }
  }

  lockArena() {
    this.locked = true;
    // Tween camera to arena centre
    this.scene.cameras.main.pan(
      this.arenaRect.centerX,
      this.arenaRect.centerY,
      300, 'Power2'
    );
    // Spawn barriers
    this.spawnBarriers();
    // Start first wave
    this.spawnWave(this.currentWave);
  }

  onWaveComplete() {
    this.currentWave++;
    if (this.currentWave >= this.waves.length) {
      this.unlockArena();
    } else {
      // Brief delay between waves
      this.scene.time.delayedCall(1500, () => this.spawnWave(this.currentWave));
    }
  }

  unlockArena() {
    this.destroyBarriers();
    this.scene.cameras.main.startFollow(this.scene.player, true, 0.1, 0.15);
    this.spawnReward();
  }
}
```

### 9.5 Wall Slide Implementation

Wall sliding is detected by checking if the player is in contact with a wall tile (left or right collision) while airborne and the player is holding the directional input toward the wall. When wall sliding, the player's vertical velocity is clamped to a maximum downward speed (e.g., `maxWallSlideVelocity = 60` pixels/second, compared to normal fall speed of `300` pixels/second).

```javascript
// Wall slide velocity clamping (in player update loop)
if (this.isWallSliding) {
  if (this.body.velocity.y > this.maxWallSlideVelocity) {
    this.body.setVelocityY(this.maxWallSlideVelocity);
  }
  // Reset double jump when wall sliding
  this.canDoubleJump = true;
  // Emit wall slide particles
  this.wallSlideParticles.emitParticleAt(this.x, this.y);
}
```

**Wall Jump:** When the player presses jump while wall sliding, they are launched away from the wall with a horizontal velocity boost and a full vertical jump velocity. The wall jump resets the double jump counter.

### 9.6 Double Jump Implementation

The double jump is tracked with a boolean `canDoubleJump` that is set to `true` on landing and reset to `false` after the second jump is used. It is also reset to `true` when the player begins a wall slide (allowing infinite wall-jump chains on parallel walls, which is the intended behaviour for the vertical shaft sections).

```javascript
// Double jump logic (in player jump handler)
onJumpPressed() {
  if (this.body.blocked.down) {
    // Normal ground jump
    this.body.setVelocityY(-this.jumpVelocity);
    this.canDoubleJump = true;
    this.hasDoubleJumped = false;
  } else if (this.canDoubleJump && !this.hasDoubleJumped) {
    // Double jump
    this.body.setVelocityY(-this.jumpVelocity * 0.85); // Slightly weaker than ground jump
    this.hasDoubleJumped = true;
    this.canDoubleJump = false;
    // Emit double jump visual effect
    this.doubleJumpEffect.play();
  }
}
```

### 9.7 Electrified Wall Tile Behaviour

Electrified wall tiles use a custom tile property `electrified: true` and a `cycleTime` property defining the on/off duration. A `HazardManager` class iterates over all electrified tiles each frame and toggles their collision and visual state based on the cycle timer.

```javascript
// Electrified tile cycle management
class HazardManager {
  update(time, delta) {
    this.electrifiedTiles.forEach(tile => {
      const cyclePosition = (time % (tile.onDuration + tile.offDuration));
      const isActive = cyclePosition < tile.onDuration;
      
      // Toggle collision
      tile.setCollision(isActive);
      
      // Toggle visual (swap tile index to electrified variant)
      tile.index = isActive ? tile.activeIndex : tile.inactiveIndex;
      
      // Warning flash 300ms before activation
      if (!isActive && cyclePosition > tile.offDuration - 300) {
        tile.alpha = 0.5 + Math.sin(time * 0.02) * 0.5; // Flicker effect
      }
    });
  }
}
```

### 9.8 Suggested Tileset Structure

The level uses a single tileset image (`aura_nympha_tileset.png`) with the following tile categories:

| Category | Tile Count | Description |
| :--- | :--- | :--- |
| Ground/Platform | 24 | Solid ground, platform tops, platform undersides, corners |
| Wall | 16 | Left walls, right walls, wall corners, wall tops |
| Hazard | 12 | Steam vent (active/inactive), electrified wall (active/inactive/warning), plasma conduit (base/active), piston (extended/retracted) |
| Decoration | 48 | Neon signs, pipes, crates, barrels, lanterns, market stalls, graffiti |
| Background | 32 | Sky, distant buildings, mid-distance buildings, fog layers |
| Destructible | 8 | Barrel (intact/damaged/destroyed), cracked wall (intact/crumbling/open) |

### 9.9 Checkpoint System

Checkpoints are placed at the following positions and are implemented as invisible trigger zones that save the player's position and health state:

| Checkpoint | Location | Notes |
| :--- | :--- | :--- |
| CP1 | Start of P1 | Default start |
| CP2 | After C1 | Post-first-arena save |
| CP3 | After H1 | Post-hazard gauntlet save |
| CP4 | After C2 | Post-bridge-arena save |
| CP5 | After H2 | Post-piston-chamber save |
| CP6 | After C3 | Post-courtyard save |
| CP7 | Boss Arena entrance | Pre-boss save |

On death, the player respawns at the last activated checkpoint with 50% of their maximum health (to prevent trivial grinding through checkpoints).

### 9.10 Performance Considerations

Given the level's length (200 tiles wide), the tilemap should be rendered using Phaser 3's built-in **culling** system, which automatically skips rendering of off-screen tiles. Enemy objects should be managed with an **object pool** to avoid garbage collection spikes during wave spawning. Particle effects (wall slide sparks, double jump burst, explosion debris) should use Phaser 3's `ParticleEmitterManager` with pre-allocated particle pools.

The background parallax layers (`bg_far`, `bg_mid`, `bg_near`) should use `TileSprite` objects rather than full tilemaps for performance, as they repeat horizontally and do not require individual tile collision.

---

*End of Level Design Document — NEON SHOGUN: Stage 1 "The Aura-Nympha Slums"*

---

*Document authored by Manus AI. All design elements are original and intended for implementation reference.*
