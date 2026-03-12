from PIL import Image
import os

def check_sprite(name, path):
    if not os.path.exists(path):
        print(f"MISSING: {name} at {path}")
        return
    img = Image.open(path)
    img = img.convert("RGBA")
    width, height = img.size
    print(f"SPRITE: {name} | Size: {width}x{height}")
    
    col_has_pixels = []
    for x in range(width):
        has_pixel = False
        for y in range(height):
            if img.getpixel((x, y))[3] > 0:
                has_pixel = True
                break
        col_has_pixels.append(has_pixel)
    
    row_has_pixels = []
    for y in range(height):
        has_pixel = False
        for x in range(width):
            if img.getpixel((x, y))[3] > 0:
                has_pixel = True
                break
        row_has_pixels.append(has_pixel)

    def get_ranges(has_pixels):
        ranges = []
        in_range = False
        start = 0
        for i, val in enumerate(has_pixels):
            if val:
                if not in_range:
                    in_range = True
                    start = i
            else:
                if in_range:
                    in_range = False
                    ranges.append((start, i - start))
        if in_range:
            ranges.append((start, len(has_pixels) - start))
        return ranges

    cols = get_ranges(col_has_pixels)
    rows = get_ranges(row_has_pixels)
    
    print(f"  Detected Columns: {len(cols)}")
    # for i, (x, w) in enumerate(cols):
    #    print(f"    Col {i}: x={x}, w={w}")
    print(f"  Detected Rows: {len(rows)}")
    for i, (y, h) in enumerate(rows):
        print(f"    Row {i}: y={y}, h={h}")

check_sprite("cyborg", "Ethical_Avengers_V3/assets/images/enemies/enemy-cyborg.png")
