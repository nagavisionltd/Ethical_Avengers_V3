---
description: Phaser 3 & JSON development rules for Ethical Avengers project
---

# 🕹️ Phaser 3 & JSON Development Rules

## 1. The Phaser 3 Lifecycle
- **Strict Function Roles:** Do NOT instantiate game objects in `preload()`. Do NOT load assets in `create()`.
- **The Loop:** Always respect: `init()` → `preload()` → `create()` → `update()`.

## 2. JavaScript Scope & `this`
- **Arrow Functions:** Use arrow functions for callbacks to keep `this` bound to the Scene.
- **Reference Consistency:** Never mix `self`, `that`, and `this`. Stick to `this` within class-based scenes.

## 3. JSON & Data Integrity
- **Key Matching:** Asset keys in `preload()` MUST match keys used in `create()` and external JSON files **exactly**.
- **Strict JSON Formatting:** No trailing commas. All keys double-quoted. No comments inside `.json` files.
- **Loading Logic:** Always check if data is loaded before iterating.

## 4. Phaser-Specific Syntax
- **Physics:** Check `this.physics` is enabled in config before calling `this.physics.add`.
- **Positioning:** Use `game.config.width` / `this.cameras.main.centerX` — no hardcoded magic numbers.
- **Clean-up:** Remove associated listeners when destroying objects.

---

# 🛠️ The AI Game-Dev Code Manifesto

## 1. Formatting & Integrity
- **No Placeholders:** Never use `// ... rest of code here`. Always provide **full, functional code**.
- **Indentation:** 4 spaces, never mix tabs and spaces.
- **Closing Tags:** Every `{`, `[`, `(` must have a matching close. No trailing off.
- **Mental Lint:** Before outputting, verify every bracket pair closes correctly.

## 2. Nomenclature & Spelling
- **Classes/Methods:** PascalCase (e.g., `CalculateDamage`).
- **Variables:** camelCase (e.g., `currentHealth`).
- **Constants:** UPPER_SNAKE_CASE (e.g., `MAX_SPEED`).
- **Spell Check:** Variable names spelled consistently across entire script. No abbreviating `inventory` to `inv` five lines later.
- **Descriptive Names:** No single-letter variables except standard loop counters.

## 3. Game Logic Basics
- **Frame Independence:** Use `delta` / `Time.deltaTime` for movement and timers.
- **Null Checks:** Always check if a reference exists before calling it.
- **Decoupling:** Don't put five systems in one `update()`. Use separate components.
- **Comments:** Explain *why*, not *what*.

## 4. Self-Verification
- Before outputting code, mentally verify variable names against class definitions.
- If a typo is found, correct it before writing the final response.

---

# 🚀 Pre-Delivery Checklist

- [ ] No stray text/URLs at start of any file
- [ ] Every `{`, `[`, `(` has a matching close
- [ ] Asset keys match between `preload()`, `create()`, and JSON
- [ ] New scene files have BOTH a `<script>` tag AND scene array entry in `index.html`
- [ ] Server verified live (curl HTTP 200) before presenting to user
- [ ] Variable names consistent across the entire file
- [ ] No placeholder comments — full working code only
