# Ethical Avengers V3: 2D Platformer Tiled Workflow Handover

This document is the source of truth for creating and implementing strictly **2D side-scrolling platformer** levels in Ethical Avengers V3. Note that this workflow diverges from the 2.5D beat-'em-up architecture (which relies on `boundary` polygons and simulated Z-depth).

---

## 1. Tiled Editor (.tmj) Structure

### Visual Tile Layers
*   Stack your visual tiles (backgrounds, midgrounds, platforms, decorations) using standard **Tile Layers**.
*   **Do not** manually declare layer constants in Phaser. The game engine dynamically reads the array of `map.layers` and automatically applies sequential depth sorting (1, 2, 3...) from bottom to top, scaled by the scene's `SCALE` constant.

### Object Layer: `Collisions`
Instead of relying on tile-based collisions (`setCollisionByExclusion`), we use an invisible, scalable, geometry-based collision system.
*   Create an Object Layer strictly named **`Collisions`**.
*   Draw rectangles or polygons over walkable grounds, walls, and ceilings. 
*   **Anti-Tunneling Mechanism:** The engine applies a minimum thickness of 30px to all floor collision boxes (`Math.max(obj.height * SCALE, 30)`). This prevents high-velocity or high-fps rendering physics errors where the player phases through thin platforms.
*   **Jump-Through / One-Way Platforms:** To create platforms the player can jump upward through but land on:
    *   Select the rectangular object in Tiled.
    *   Add a Custom Property.
    *   Name: `type`, Type: `string`, Value: `jumpthrough`.

### Object Layer: `Object Layer 1` (Spawns)
*   Create an Object Layer named **`Object Layer 1`**.
*   **Player Spawn:** Create an object (point/rectangle) and name it precisely **`start`**. The engine uses this coordinate (`obj.x * SCALE`) to spawn the hero.
*   **Enemy Spawns:** Any other objects placed on this layer will act as trigger coordinates to initialize enemy patrols/spawns.

---

## 2. Standard Engine Boilerplate

When building a new Level Scene for the platformer, use this verified setup pattern for perfect synchronization with the game physics:

```javascript
// 1. Map & Tileset Load (Dynamic mapping)
const map = this.make.tilemap({ key: 'your_map_key' });
const allTiles = [];
// push your addTilesetImage mappings into allTiles...

const SCALE = 2; // Usually 2 or 3 depending on desired pixel chunkiness

// 2. Dynamic Visual Layer Stacking
let currentDepth = 1;
map.layers.forEach((layerData) => {
    if (layerData.type === 'tilelayer') {
        const layer = map.createLayer(layerData.name, allTiles, 0, 0);
        if (layer) {
            layer.setScale(SCALE);
            layer.setDepth(currentDepth++); 
        }
    }
});

// 3. Object-based Collisions Processing
this.collisionBoxes = this.physics.add.staticGroup();
const collisionLayerData = map.getObjectLayer('Collisions');

if (collisionLayerData && collisionLayerData.objects) {
    collisionLayerData.objects.forEach(obj => {
        let boxX, boxY, boxW, boxH;

        if (obj.polygon) {
            let minX = 0, minY = 0, maxX = 0, maxY = 0;
            obj.polygon.forEach(p => {
                if (p.x < minX) minX = p.x;
                if (p.x > maxX) maxX = p.x;
                if (p.y < minY) minY = p.y;
                if (p.y > maxY) maxY = p.y;
            });
            boxW = (maxX - minX) * SCALE;
            boxH = Math.max((maxY - minY) * SCALE, 30); // Prevent tunneling
            boxX = (obj.x + minX) * SCALE;
            boxY = (obj.y + minY) * SCALE;
        } else {
            boxX = obj.x * SCALE;
            boxY = obj.y * SCALE;
            boxW = obj.width * SCALE;
            boxH = Math.max(obj.height * SCALE, 30);
        }

        // Invisible static physics body (set alpha to 0 for production, 0.4 red for debug)
        const zone = this.add.rectangle(boxX + (boxW / 2), boxY + (boxH / 2), boxW, boxH, 0xff0000, 0);
        this.physics.add.existing(zone, true); 

        // Handle Jumpthrough property
        if (obj.type && obj.type.toLowerCase() === 'jumpthrough') {
            zone.body.checkCollision.down = false;
            zone.body.checkCollision.left = false;
            zone.body.checkCollision.right = false;
        }

        this.collisionBoxes.add(zone);
    });
}

// 4. World & Camera Bounds (Platformer Style)
let levelW = map.widthInPixels * SCALE;
let levelH = map.heightInPixels * SCALE;

this.physics.world.setBounds(0, 0, levelW, levelH);
this.cameras.main.setBounds(0, 0, levelW, levelH);

// Collider application
this.physics.add.collider(this.player, this.collisionBoxes);
this.physics.add.collider(this.enemies, this.collisionBoxes);
```

### Key Differences from 2.5D Workflow
*   **Depth Sorting:** In 2D, the player is forced to a high depth (`Z=100`) to render over all layers, rather than sorting dynamically against their current `y` coordinate lane.
*   **Collision Processing:** 2D relies on the invisible rectangles for actual hard `x/y/down/up` collision boundaries, whereas 2.5D ignores ceiling collisions and relies heavily on custom mathematical `walkablePolygon.contains()` checks for the "Floor".
*   **Camera:** 2D platformer camera natively scopes horizontally AND vertically to the `map.heightInPixels`, following the player freely as they jump between tiers (no vertical clamping or strict zone tweening necessary).
