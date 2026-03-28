import os
from PIL import Image

root = "/Users/nagavision/Ethical_Avengers_V3/assets/images/characters/naga-soul-26/animation_frames/punches_Z"

for subdir, dirs, files in os.walk(root):
    for file in files:
        if file.endswith(".png"):
            path = os.path.join(subdir, file)
            with Image.open(path) as img:
                w, h = img.size
                print(f"{w}x{h} : {file} in {os.path.basename(subdir)}")
