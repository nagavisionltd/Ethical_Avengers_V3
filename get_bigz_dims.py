from PIL import Image
import os

files = [
    'bigz_idle.png',
    'bigz_jump.png',
    'bigz_run.png',
    'bigz_special.png',
    'bigz_attacks.png'
]

path = 'assets/images/characters/big-z/'

for f in files:
    img = Image.open(os.path.join(path, f))
    print(f"{f}: {img.size[0]}x{img.size[1]}")
