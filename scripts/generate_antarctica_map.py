import json

def generate_antarctica_map():
    width = 120  # 3840px
    height = 15  # 480px
    
    # Layer 1: Ground
    # 0 = air, 1 = snow surface, 2 = deep ice, 3 = floating ice platform
    data = [0] * (width * height)
    
    # Surface floor (0 to 60)
    for x in range(0, 60):
        # Floor starts at y=11
        data[11 * width + x] = 1
        data[12 * width + x] = 2
        data[13 * width + x] = 2
        data[14 * width + x] = 2
        
    # Floating platforms on surface
    # Plat 1
    for x in range(10, 15): data[8 * width + x] = 3
    # Plat 2
    for x in range(25, 32): data[6 * width + x] = 3
    # Plat 3 (High)
    for x in range(45, 50): data[5 * width + x] = 3
    
    # Cave Entrance transition (60 to 70)
    # Floor goes down
    for x in range(60, 120):
        # Deeper floor at y=13
        data[13 * width + x] = 1
        data[14 * width + x] = 2
        
    # Cave entrance walls/ceiling
    for x in range(65, 120):
        # Ceiling at y=0-4
        for y in range(0, 4):
            data[y * width + x] = 2
        data[4 * width + x] = 1 # Interior ceiling texture
        
    # Cave platforms
    for x in range(75, 85): data[10 * width + x] = 3
    for x in range(95, 105): data[8 * width + x] = 3
    
    # THE CRYSTAL PEDESTAL (at the end)
    for x in range(115, 120):
        data[12 * width + x] = 1
        
    layers = [
        {
            "data": data,
            "height": height,
            "id": 1,
            "name": "ground",
            "opacity": 1,
            "type": "tilelayer",
            "visible": True,
            "width": width,
            "x": 0,
            "y": 0
        },
        {
            "draworder": "topdown",
            "id": 2,
            "name": "collisions",
            "objects": [
                # Main Surface
                {"height": 128, "width": 1920, "x": 0, "y": 352, "name": "surface_floor", "rotation": 0, "visible": True, "type": ""},
                # Cave Floor
                {"height": 64, "width": 1920, "x": 1920, "y": 416, "name": "cave_floor", "rotation": 0, "visible": True, "type": ""},
                # Ceiling
                {"height": 160, "width": 1760, "x": 2080, "y": 0, "name": "cave_ceiling", "rotation": 0, "visible": True, "type": ""},
                # One-way Plat 1
                {"height": 32, "width": 160, "x": 320, "y": 256, "name": "p1", "type": "jumpthrough", "visible": True},
                # One-way Plat 2
                {"height": 32, "width": 224, "x": 800, "y": 192, "name": "p2", "type": "jumpthrough", "visible": True},
                # One-way Plat 3
                {"height": 32, "width": 160, "x": 1440, "y": 160, "name": "p3", "type": "jumpthrough", "visible": True},
            ],
            "opacity": 1,
            "type": "objectgroup",
            "visible": True,
            "x": 0,
            "y": 0
        },
        {
            "draworder": "topdown",
            "id": 3,
            "name": "spawns",
            "objects": [
                {"height": 32, "width": 32, "x": 100, "y": 300, "name": "start", "type": "player_spawn", "visible": True},
                {"height": 32, "width": 32, "x": 1000, "y": 300, "name": "drone_1", "type": "enemy", "properties": [{"name": "enemyType", "type": "string", "value": "drone"}], "visible": True},
                {"height": 32, "width": 32, "x": 2500, "y": 300, "name": "guard_1", "type": "enemy", "properties": [{"name": "enemyType", "type": "string", "value": "walker"}], "visible": True}
            ],
            "opacity": 1,
            "type": "objectgroup",
            "visible": True
        },
        {
            "draworder": "topdown",
            "id": 4,
            "name": "triggers",
            "objects": [
                # Cave entrance trigger to swap background logic if needed, or dialogue
                {"height": 480, "width": 64, "x": 1920, "y": 0, "name": "cave_entrance", "properties": [{"name": "dialogueKey", "value": "tm_antarctica_cave_reveal"}], "visible": True},
                # Final Goal
                {"height": 64, "width": 64, "x": 3700, "y": 352, "name": "crystal", "properties": [{"name": "isExit", "type": "bool", "value": True}, {"name": "dialogueKey", "value": "tm_antarctica_crystal_found"}], "visible": True}
            ],
            "opacity": 1,
            "type": "objectgroup",
            "visible": True
        }
    ]
    
    tilemap = {
        "compressionlevel": -1,
        "height": height,
        "infinite": False,
        "layers": layers,
        "nextlayerid": 5,
        "nextobjectid": 10,
        "orientation": "orthogonal",
        "renderorder": "right-down",
        "tiledversion": "1.10.1",
        "tileheight": 32,
        "tilesets": [
            {
                "columns": 8,
                "firstgid": 1,
                "image": "antarctica_tileset.png",
                "imageheight": 256,
                "imagewidth": 256,
                "margin": 0,
                "name": "antarctica_tiles",
                "spacing": 0,
                "tilecount": 64,
                "tileheight": 32,
                "tilewidth": 32
            }
        ],
        "tilewidth": 32,
        "type": "map",
        "version": "1.10",
        "width": width
    }
    
    with open("/Users/nagavision/Ethical_Avengers_V3/assets/tilemaps/antarctica_stage.json", "w") as f:
        json.dump(tilemap, f, indent=4)
    print("Complex Antarctica Tilemap Generated.")

generate_antarctica_map()
