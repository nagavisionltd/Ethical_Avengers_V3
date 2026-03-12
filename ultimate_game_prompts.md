# Ultimate AI Game Generation Prompts (NagaVision Standard)

Below are two highly detailed one-shot prompt templates designed to instruct an AI coding assistant (like Claude, or a similar agent) to generate a fully playable, component-based HTML5/Phaser game matching the standard of *Ethical Avengers V3*, *Neon Ninja*, and *Rebourne26*. 

There are two versions:
1. **The "Generate Everything" Version** (Instructs the AI to proactively generate visual and audio assets using connected API tools).
2. **The "Placeholder" Version** (Instructs the AI to use solid colors and basic shapes, allowing you to drop in your own art later).

---

## 1. The "Generate Everything" Version (Media + Code)

**Prompt:**

> "I want you to build an entire retro 16-bit style action-platformer game from scratch. It must match the elite structural standard, architecture, and visual polish of games like 'Ethical Avengers V3' and 'Neon Ninja'. 
>
> You are to act as a Senior Game Architect, Lead Programmer, and Art Director. 
> 
> **Step 1: Asset Generation (MANDATORY FIRST STEP)**
> Before writing any code, you MUST use your available image generation tools (e.g., generate_image, dall-e, or similar) to create the following assets and save them in an `assets/` folder structure:
> 1. A highly atmospheric, cinematic 16:9 Main Menu Background (`assets/ui/main_menu_bg.png`).
> 2. A 32x32 pixel art protagonist sprite sheet containing [Idle, Run, Jump, Attack] frames (`assets/sprites/player.png`).
> 3. A 32x32 pixel art enemy sprite sheet containing [Idle, Walk, Hurt] frames (`assets/sprites/enemy.png`).
> 4. A dark, gritty sci-fi background parallax layer (`assets/environments/bg_layer.png`).
> 5. A 32x32 tileset containing a concrete floor and a metal crate platform (`assets/environments/tileset.png`).
> *(If you have audio generation tools, also synthesize a short mp3 sound effect for 'jump' and 'hit').*
>
> **Step 2: Technical Architecture**
> The game must be built using Phaser 3 (via a CDN link in an `index.html` file) utilizing object-oriented ES6 JavaScript classes. Split the codebase into the following logical files inside a `src/` folder:
> 
> *   `index.html`: The HTML wrapper, loading Phaser and all your JS scripts.
> *   `BootScene.js`: Handles all asset preloading and displays a sleek loading bar.
> *   `MenuScene.js`: Shows the generated background, rendering an animated "Press Start" text.
> *   `GameScene.js`: The core gameplay loop. It must load the tileset, generate a basic level layout dynamically using arrays, and handle camera follow.
> *   `Player.js`: A custom class extending `Phaser.Physics.Arcade.Sprite`. It must include a finite state machine handling velocity, jump count (double jump enabled), attack frame timings, and animation playing. Must include a hard maxVelocity to prevent tunneling.
> *   `Enemy.js`: A custom class with basic patrol logic, health tracking, and a stun/knockback response when hit.
>
> **Step 3: Physics & Combat Feel**
> - The game MUST use Phaser Arcade Physics. Gravity should be heavy (at least 1000) for a snappy, fast-falling retro feel. 
> - Create a dedicated invisible weapon hitbox attached to the player that only enables during specific frames of the attack animation.
> - When an enemy is hit, pause them for 200ms (hit-stop), flash them red using `setTint(0xff0000)`, and apply an impulse knockback physics velocity based on the direction the player is facing. Add a camera shake (`this.cameras.main.shake`) for maximum impact.
>
> Implement the entire project now, ensuring all file paths line up securely."

---

## 2. The "Placeholder Engine" Version (Code Only, Ready for Art)

**Prompt:**

> "I want you to build an entire retro 16-bit style action-platformer game base from scratch. It must match the elite structural standard, architecture, and modularity of games like 'Ethical Avengers V3' and 'Neon Ninja'. 
> 
> You are to act as a Senior Game Architect and Lead Programmer. We will focus purely on world-class code architecture today. You will use Phaser's built-in shape generators (Graphics, Rectangles) as placeholders instead of external image files.
>
> **Step 1: Technical Architecture**
> The game must be built using Phaser 3 (via a CDN link in an `index.html` file) utilizing object-oriented ES6 JavaScript classes. Split the codebase into the following logical files inside a `src/` folder:
> 
> *   `index.html`: The HTML wrapper, loading Phaser and all your JS scripts.
> *   `BootScene.js`: Generates base64 data URIs of colored rectangles (e.g., a blue square for the player, red square for enemies, grey for tiles) so the engine treats them as real textures.
> *   `MenuScene.js`: A clean, dark UI with a pulsing 'Press Any Key To Start' text prompt.
> *   `GameScene.js`: The core gameplay loop. It must build a level layout dynamically using arrays and map the generated placeholder textures to static physics bodies. The camera must follow the player with a slight lerp (0.1) for smoothness.
> *   `Player.js`: A custom class extending `Phaser.Physics.Arcade.Sprite`. It requires:
>     - Responsive input handling (Arrows to move, Space to jump, Z to attack).
>     - A finite state machine to manage movement rules (can't attack while dashing, can double jump, etc).
>     - A strict terminal velocity (`setMaxVelocity(800, 800)`) to prevent physics-tunneling through platforms.
> *   `Enemy.js`: A custom physics sprite class with basic pacing AI (walks left until hitting a wall, then turns right).
>
> **Step 2: World-Class Combat Feel**
> Even though we are using placeholder squares, the "juice" must be perfect. 
> - **Gravity:** Should be heavy (y: 1200) so jumps feel sharp and not floaty.
> - **Hitboxes:** Create a dedicated invisible weapon hitbox attached to the player. It should cleanly overlap with enemy physics bodies.
> - **Game Feel:** When the player's weapon overlap triggers an enemy, do NOT just destroy the enemy instantly. You must:
>   1. Flash the enemy white.
>   2. Trigger a 100ms camera shake.
>   3. Freeze the enemy's AI movement.
>   4. Apply a massive physics impulse (velocity) to knock the enemy backward.
>   5. Destroy the enemy only after its health variable hits 0.
>
> Please generate the full project folder structure and the raw code for all these files."
