import json
import os
import glob
from PIL import Image

files = ['./assets/tilemaps/mountain_new.json', './assets/tilemaps/junk-plains.json', './assets/tilemaps/warped_city.tmj']

for f in files:
    print(f"--- Checking {f} ---")
    if not os.path.exists(f): continue
    
    with open(f, 'r') as fp:
        data = json.load(fp)
    
    changed_json = False
    
    for ts in data.get('tilesets', []):
        img_path = ts.get('image')
        tw = ts.get('tilewidth')
        th = ts.get('tileheight')
        
        if not img_path or not tw or not th: continue
        
        if not os.path.exists(img_path):
            print(f"Warning: {img_path} not found on disk.")
            continue
            
        with Image.open(img_path) as img:
            iw, ih = img.size
            if iw % tw != 0 or ih % th != 0:
                new_w = iw + (tw - (iw % tw)) if iw % tw != 0 else iw
                new_h = ih + (th - (ih % th)) if ih % th != 0 else ih
                
                print(f"Padding {img_path} from {iw}x{ih} -> {new_w}x{new_h} to fit {tw}x{th}")
                new_img = Image.new("RGBA", (new_w, new_h), (0, 0, 0, 0))
                # Paste top-left so existing tile coordinates don't break
                new_img.paste(img, (0, 0))
                new_img.save(img_path)
                
                # Update JSON dimensions to match the newly padded image
                ts['imagewidth'] = new_w
                ts['imageheight'] = new_h
                
                # We need to update column count in JSON too so the map engine doesn't break
                ts['columns'] = new_w // tw
                ts['tilecount'] = (new_w // tw) * (new_h // th)
                changed_json = True
                print(f"-> Succesfully padded and mapped {img_path}")

    if changed_json:
        with open(f, 'w') as fp:
            json.dump(data, fp, indent=2)
            print(f"Updated metadata inside {f} to match new padded images.")

