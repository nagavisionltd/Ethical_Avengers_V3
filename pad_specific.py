import json
import os
import glob
from PIL import Image

targets = [
    'new_tilesets/warped_city_files/ENVIRONMENT/background/buildings-bg.png',
    'new_tilesets/warped_city_files/ENVIRONMENT/background/near-buildings-bg.png',
    'new_tilesets/warped_city_files/ENVIRONMENT/background/skyline-a.png',
    'new_tilesets/warped_city_files/ENVIRONMENT/background/skyline-b.png',
    'new_tilesets/warped_city_files/ENVIRONMENT/tileset.png',
    'assets/images/tilesets/mars/mars_floor_001.png',
    'assets/images/tilesets/mars/mars_floor_003.png',
    'assets/images/tilesets/mars/mars_floor_005.png',
    'assets/images/tilesets/cyberpunk/cyberpunk_strip.png',
    'assets/images/tilesets/junk/junk_back.png',
    'assets/images/tilesets/junk/junk_middle.png',
    'assets/images/tilesets/junk/junk_near.png',
    'assets/images/tilesets/warped/warped_back2.png',
]

tw = 16
th = 16

for img_path in targets:
    if os.path.exists(img_path):
        with Image.open(img_path) as img:
            iw, ih = img.size
            if iw % tw != 0 or ih % th != 0:
                new_w = iw + (tw - (iw % tw)) if iw % tw != 0 else iw
                new_h = ih + (th - (ih % th)) if ih % th != 0 else ih
                print(f"Padding {img_path}: {iw}x{ih} -> {new_w}x{new_h}")
                new_img = Image.new("RGBA", (new_w, new_h), (0,0,0,0))
                new_img.paste(img, (0,0))
                new_img.save(img_path)
    else:
        print(f"File not found: {img_path}")
