import re
import os

boot_file = "/Users/nagavision/Ethical_Avengers_V3/src/scenes/Boot_v16.js"
base_dir = "/Users/nagavision/Ethical_Avengers_V3/"

with open(boot_file, 'r') as f:
    content = f.read()

# Match this.load.image('key', 'path') etc.
pattern = re.compile(r"this\.load\.(?:image|audio|video|spritesheet|tilemapTiledJSON|atlas)\(.*?'([^']+)'\)", re.IGNORECASE)
matches = pattern.findall(content)

missing = []
for path in matches:
    # Handle paths with query strings like ?v=1.0
    clean_path = path.split('?')[0]
    full_path = os.path.join(base_dir, clean_path)
    if not os.path.exists(full_path):
        missing.append(clean_path)

if missing:
    print("MISSING ASSETS:")
    for m in missing:
        print(f" - {m}")
else:
    print("All assets exist.")
