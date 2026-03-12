import json

WIDTH = 60
HEIGHT = 30
TILE_SIZE = 32

def create_layer(name, id, depth=0):
    return {
        "data": [0] * (WIDTH * HEIGHT),
        "height": HEIGHT,
        "id": id,
        "name": name,
        "opacity": 1,
        "type": "tilelayer",
        "visible": True,
        "width": WIDTH,
        "x": 0,
        "y": 0
    }

def fill_rect(layer, x, y, w, h, tile_id):
    for r in range(y, y + h):
        for c in range(x, x + w):
            if 0 <= r < HEIGHT and 0 <= c < WIDTH:
                layer['data'][r * WIDTH + c] = tile_id

def create_platform(layer, x, y, length, left_tile, mid_tile, right_tile):
    fill_rect(layer, x, y, 1, 1, left_tile)
    fill_rect(layer, x + 1, y, length - 2, 1, mid_tile)
    fill_rect(layer, x + length - 1, y, 1, 1, right_tile)

background = create_layer("background", 1)
# fill background (alien_bg uses tiles 1-30)
fill_rect(background, 0, 0, WIDTH, HEIGHT, 1) # Just fill with dark sky

back_structures = create_layer("back-structures", 2)
# alien_back_structures (73-137)

platforms = create_layer("platforms", 3)
# Base alien platform tiles typically: left=32, mid=33, right=34 (check tileset)
# Let's say: 55, 56, 57

# Floor 1 (bottom)
create_platform(platforms, 0, 28, WIDTH, 55, 56, 57)
# Fill below
fill_rect(platforms, 0, 29, WIDTH, 1, 62)

# Floor 2
create_platform(platforms, 20, 22, 35, 55, 56, 57)

# Floor 3
create_platform(platforms, 5, 16, 25, 55, 56, 57)

# Floor 4 (Top)
create_platform(platforms, 30, 10, 25, 55, 56, 57)

# Objects
collisions = {
    "draworder": "topdown",
    "id": 4,
    "name": "Collisions",
    "objects": [
        {"height": 64, "id": 1, "name": "f1", "type": "", "visible": True, "width": WIDTH * TILE_SIZE, "x": 0, "y": 28 * TILE_SIZE},
        {"height": 32, "id": 2, "name": "f2", "type": "", "visible": True, "width": 35 * TILE_SIZE, "x": 20 * TILE_SIZE, "y": 22 * TILE_SIZE},
        {"height": 32, "id": 3, "name": "f3", "type": "", "visible": True, "width": 25 * TILE_SIZE, "x": 5 * TILE_SIZE, "y": 16 * TILE_SIZE},
        {"height": 32, "id": 4, "name": "f4", "type": "", "visible": True, "width": 25 * TILE_SIZE, "x": 30 * TILE_SIZE, "y": 10 * TILE_SIZE}
    ],
    "opacity": 1,
    "type": "objectgroup",
    "visible": True,
    "x": 0, "y": 0
}

spawns = {
    "draworder": "topdown",
    "id": 5,
    "name": "Object Layer 1",
    "objects": [
        {
            "height": 32, "id": 5, "name": "start", "type": "", "visible": True, 
            "width": 32, "x": 35 * TILE_SIZE, "y": 8 * TILE_SIZE
        },
        # Enemies
        {"height": 32, "id": 6, "name": "enemy1", "type": "", "visible": True, "width": 32, "x": 45 * TILE_SIZE, "y": 8 * TILE_SIZE},
        {"height": 32, "id": 7, "name": "enemy2", "type": "", "visible": True, "width": 32, "x": 20 * TILE_SIZE, "y": 14 * TILE_SIZE},
        {"height": 32, "id": 8, "name": "enemy3", "type": "", "visible": True, "width": 32, "x": 40 * TILE_SIZE, "y": 20 * TILE_SIZE},
        {"height": 32, "id": 9, "name": "enemy4", "type": "", "visible": True, "width": 32, "x": 10 * TILE_SIZE, "y": 26 * TILE_SIZE},
        # Exit
        {"height": 64, "id": 10, "name": "exit", "type": "", "visible": True, "width": 64, "x": 55 * TILE_SIZE, "y": 26 * TILE_SIZE}
    ],
    "opacity": 1,
    "type": "objectgroup",
    "visible": True,
    "x": 0, "y": 0
}

# The goal layer needs the properties so it works as an exit
goal_layer = {
    "draworder": "topdown",
    "id": 6,
    "name": "goal",
    "objects": [
        {
            "height": 64, "id": 11, "name": "exit", "type": "exit", "visible": True, 
            "width": 64, "x": 55 * TILE_SIZE, "y": 26 * TILE_SIZE,
            "properties": [
                {"name": "isExit", "type": "bool", "value": True}
            ]
        }
    ],
    "opacity": 1,
    "type": "objectgroup",
    "visible": True,
    "x": 0, "y": 0
}

tilemap = {
    "compressionlevel": -1,
    "height": HEIGHT,
    "infinite": False,
    "layers": [background, back_structures, platforms, collisions, spawns, goal_layer],
    "nextlayerid": 7,
    "nextobjectid": 12,
    "orientation": "orthogonal",
    "renderorder": "right-down",
    "tiledversion": "1.11.2",
    "tileheight": TILE_SIZE,
    "tilesets": [
        {
            "columns": 6, "firstgid": 1, 
            "image": "../../../../Ethical_Avengers_V3/assets/images/Environments/alien-environment/PNG/layers/background.png",
            "imageheight": 176, "imagewidth": 192, "name": "background",
            "tilecount": 30, "tileheight": 32, "tilewidth": 32
        },
        {
            "columns": 7, "firstgid": 31, 
            "image": "../../../../Ethical_Avengers_V3/assets/images/Environments/alien-environment/PNG/layers/tileset.png",
            "imageheight": 192, "imagewidth": 224, "name": "tileset",
            "tilecount": 42, "tileheight": 32, "tilewidth": 32
        },
        {
            "columns": 13, "firstgid": 73, 
            "image": "../../../../Ethical_Avengers_V3/assets/images/Environments/alien-environment/PNG/layers/back-structures.png",
            "imageheight": 176, "imagewidth": 416, "name": "back-structures",
            "tilecount": 65, "tileheight": 32, "tilewidth": 32
        }
    ],
    "tilewidth": TILE_SIZE,
    "type": "map",
    "version": "1.10",
    "width": WIDTH
}

with open('/Users/nagavision/Ethical_Avengers_V3/tilemaps26/4_floor_arcade.tmj', 'w') as f:
    json.dump(tilemap, f)
print("Created 4_floor_arcade.tmj successfully.")
