import json
import glob
import os

for filepath in glob.glob('./assets/tilemaps/*.json'):
    try:
        with open(filepath, 'r') as f:
            data = json.load(f)
        
        changed = False
        if 'tilesets' in data:
            for i, tileset in enumerate(data['tilesets']):
                if 'image' in tileset:
                    # Extract the filename without extension to use as a unique, matching name
                    filename = os.path.basename(tileset['image']).replace('.png', '')
                    if tileset.get('name') != filename:
                        print(f"Renaming tileset '{tileset.get('name')}' -> '{filename}' in {filepath}")
                        tileset['name'] = filename
                        changed = True
        
        if changed:
            with open(filepath, 'w') as f:
                json.dump(data, f, indent=2)
                print(f"Saved {filepath}")
    except Exception as e:
        print(f"Error processing {filepath}: {e}")

