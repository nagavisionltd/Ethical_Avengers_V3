import json
import glob
import os

path_map = {
    'GAMES/2D/2d_games/rebourne26/level-assets/Junk Wastelands Files/layers/back.png': 'assets/images/tilesets/junk/junk_back.png',
    'GAMES/2D/2d_games/rebourne26/level-assets/Junk Wastelands Files/layers/middle.png': 'assets/images/tilesets/junk/junk_middle.png',
    'GAMES/2D/2d_games/rebourne26/level-assets/Junk Wastelands Files/layers/near.png': 'assets/images/tilesets/junk/junk_near.png',
    'GAMES/2D/2d_games/rebourne26/level-assets/Junk Wastelands Files/layers/tileset.png': 'assets/images/tilesets/junk/junk_tileset.png',
    'GAMES/2D/2d_games/rebourne26/level-assets/cyberpunk-corridor-files/PNG/cyberpunk-corridor-strip.png': 'assets/images/tilesets/cyberpunk/cyberpunk_strip.png',
    'GAMES/2D/2d_games/rebourne26/level-assets/Warped Zone 202/back-2.png': 'assets/images/tilesets/warped/warped_back2.png',
    'GAMES/2D/2d_games/rebourne26/level-assets/Warped Zone 202/back.png': 'assets/images/tilesets/warped/warped_back_alt.png',
    'GAMES/2D/2d_games/rebourne26/level-assets/Warped Zone 202/tileset.png': 'assets/images/tilesets/warped/warped_tileset_alt.png',
    'GAMES/2D/2d_games/rebourne26/level-assets/Mars-level/PNG/back.png': 'assets/images/tilesets/mars/mars_back.png',
    'GAMES/2D/2d_games/rebourne26/level-assets/Mars-level/PNG/middle.png': 'assets/images/tilesets/mars/mars_middle.png',
    'GAMES/2D/2d_games/rebourne26/level-assets/Mars-level/PNG/near.png': 'assets/images/tilesets/mars/mars_near.png',
    'GAMES/2D/2d_games/rebourne26/level-assets/Mars-level/PNG/tileset.png': 'assets/images/tilesets/mars/mars_tileset.png',
    'GAMES/2D/2d_games/rebourne26/level-assets/Mars-level/PNG/mars_floor_001.png': 'assets/images/tilesets/mars/mars_floor_001.png',
    'GAMES/2D/2d_games/rebourne26/level-assets/Mars-level/PNG/mars_floor_002.png': 'assets/images/tilesets/mars/mars_floor_002.png',
    'GAMES/2D/2d_games/rebourne26/level-assets/Mars-level/PNG/mars_floor_003.png': 'assets/images/tilesets/mars/mars_floor_003.png',
    'GAMES/2D/2d_games/rebourne26/level-assets/Mars-level/PNG/mars_floor_004.png': 'assets/images/tilesets/mars/mars_floor_004.png',
    'GAMES/2D/2d_games/rebourne26/level-assets/Mars-level/PNG/mars_floor_005.png': 'assets/images/tilesets/mars/mars_floor_005.png',
    'GAMES/2D/2d_games/rebourne26/level-assets/Mars-level/PNG/mars_floor_006.png': 'assets/images/tilesets/mars/mars_floor_006.png'
}

for filepath in glob.glob('./assets/tilemaps/*.json'):
    with open(filepath, 'r') as f:
        data = json.load(f)
    
    changed = False
    if 'tilesets' in data:
        for tileset in data['tilesets']:
            if 'image' in tileset:
                for bad_path, good_path in path_map.items():
                    if bad_path in tileset['image']:
                        print(f"Fixing {tileset['image']} in {filepath}")
                        tileset['image'] = good_path
                        changed = True
    
    if changed:
        with open(filepath, 'w') as f:
            json.dump(data, f, indent=2)
            print(f"Saved {filepath}")

