# GAME PROMPT TEMPLATES: The Eight Worlds (Ethical Avengers)

The following two prompt templates are designed to be copied and pasted directly into generative AI coding tools (like Claude, ChatGPT, or Cursor) to output a complete HTML5/Phaser 3 game in a single shot. Both are styled around the `Ethical_Avengers_V3/lore/9_STAGES_STORYLINE.md` and the master rules in `GAME-DESIGN-2026-SEGA-LISA.md`.

---

## Template A: "The Placeholder Method" (Bring Your Own Assets)
*Use this template when you intend to insert your own sprite sheets and images later. The AI will output colored rectangles or simple shapes that match your intended hitboxes and environment logic, allowing you to easily swap in `scene.load.image` paths afterward.*

**Copy & Paste Below:**

```text
You are a senior 2D game designer and gameplay programmer specializing in retro pixel-art action games inspired by classics like Streets of Rage 2 (2.5D brawlers) and Gunstar Heroes (run 'n gun). Your task is to generate a fully playable, single-file HTML5 game using Phaser 3 (`<script src="https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.js"></script>`).

PROJECT CONSTRAINTS:
- Concept: "Ethical Avengers: The Eight Worlds"
- 9 distinct stages loosely mapped out (Stage 1: Antarctic Ice Wall, Stage 2: Aurelion, Stage 3: Noktara, Stage 4: Virella, Stage 5: Khemra, Stage 6: Aetherion, Stage 7: Thalassa, Stage 8: Umbra Prime, Stage 9: Terra Prima).
- Include 5 playable characters (Naga Soul, Leon G, Verona, Big Zeeko, Dr Jack) selectable from a character select screen.
- Tile size: 32x32 pixels, Base resolution: 320x180 (scaled up smoothly using pixelArt: true).
- Camera relies on a 2.5D lane system (y-axis movement for depth, x-axis for progression).
- Provide a starting menu screen, level progression logic, and a game over/victory screen.

ASSET REQUIREMENTS:
DO NOT generate complex base64 images or write external files. Use Phaser's built-in Graphics engine or single-color 1x1 base64 pixel sprites stretched to size. 
- Player characters are 32x64 solid blocks (Naga Soul: Cyan, Leon G: Yellow, Verona: Purple, Big Zeeko: Blue, Dr Jack: Blond/White).
- Enemies are 32x64 red blocks.
- Bosses are massive 128x128 purple blocks.
- Backgrounds should just be solid color clears indicating the theme of the level (e.g., icy blue for Stage 1, glowing yellow for Stage 2, monochrome dark gray for Stage 3).

GAMEPLAY LOGIC:
- Implement a basic beat 'em up state machine for the player (idle, walk, jump, punch combo).
- Implement basic enemy wave spawners that halt camera progression until defeated (arena lock), using Streets of Rage 2 pacing.
- The 9 stages should be built as a sequence of scenes (or a single scene that dynamically loads new waves/background colors). Include brief text-based cutscene/dialogue boxes before each boss based on the "Eight Worlds" lore. The dialogue should randomly feature the active player character speaking to the boss.

Produce the completely runnable `index.html` file combining HTML, CSS, and JS logic into one block. Code must be robust and error-free.
```

---

## Template B: "The Gen-Art Method" (AI Generated Data URIs)
*Use this template if you want the prompt to try and generate rudimentary 16-bit pixel art variations inline as base64 data URIs. This will result in a much larger generation but gives you immediate visual context without needing to hunt down sprites.*

**Copy & Paste Below:**

```text
You are a senior 2D game designer and gameplay programmer specializing in retro pixel-art side-scrolling games. Your task is to write a single, self-contained HTML5 file that uses Phaser 3 to create an epic 9-stage 16-bit action game: "Ethical Avengers: The Eight Worlds". 

PROJECT CONSTRAINTS & LORE:
- Resolution: Base game resolution of 320x180, scaled up via CSS with crisp rendering (`pixelArt: true`).
- Core Loop: Beat 'em up pacing mixed with horizontal Run 'n Gun progression.
- Include 5 playable characters (Naga Soul, Leon G, Verona, Big Zeeko, Dr Jack) selectable from a character select screen.
- The player navigates 9 specific levels:
  1) The Ice Wall / 2) Aurelion (Sun Garden) / 3) Noktara (Memory Shadows) / 4) Virella (Jungle Ocean) / 5) Khemra (Forge) / 6) Aetherion (Sky Libraries) / 7) Thalassa (Sentient Ocean) / 8) Umbra Prime (Dystopian tech) / 9) Terra Prima (The Origin).
- Write a short cutscene text engine at the start of each stage that overlays brief conversational dialogue between the active player character and the stage boss.

ASSET GENERATION (CRITICAL):
You must generate small, hardcoded base64 PNG images directly inside the `preload()` function. DO NOT use placeholders like colored rectangles. You must construct basic patterned textures pixel by pixel (e.g., drawing 8x8 or 16x16 pixel art arrays and transforming them to data URIs) to use for:
- 5 Player sprite sheets (include idle, run, attack frames for Naga Soul, Leon G, Verona, Big Zeeko, Dr Jack).
- 1 Basic Enemy sprite sheet (idle, run, attack frames).
- 9 distinct background tile textures (Ice, Glowing Vines, Monochrome shadow, Overgrown Tech, Molten Metal, Floating Books, Mirrors/Water, Dystopian Wires, Pristine Earth).
- 1 Boss sprite structure.

GAMEPLAY IMPLEMENTATION:
- Give the player dynamic controls: Arrow keys to move in 2.5D space (X and Y), Z to jump, X to attack.
- Create an intelligent wave manager: Spawn groups of 3 enemies, lock the camera to the arena boundaries until they are defeated, then allow progression right. Every 3 waves triggers that stage's boss.
- Incorporate simple hitboxes and frame logic (Startup, Active, Recovery frames) on the player's attack to ensure combat feels punchy.
- Build the final code block as a complete `index.html` containing styling, DOM, and the full Phaser script block. Output the entire working file ensuring no code is truncated.
```
