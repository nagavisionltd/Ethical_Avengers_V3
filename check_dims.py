import json

file = './assets/tilemaps/warped_city.tmj'
with open(file, 'r') as fp:
    data = json.load(fp)
    for ts in data.get('tilesets', []):
        name = ts.get('name')
        iw = ts.get('imagewidth')
        ih = ts.get('imageheight')
        tw = ts.get('tilewidth')
        th = ts.get('tileheight')
        
        if iw and ih and tw and th:
            if iw % tw != 0 or ih % th != 0:
                print(f"MISMATCH: {name} | Image: {iw}x{ih} | Tile: {tw}x{th} | Remainder: {iw%tw}x{ih%th}")
            else:
                print(f"OK: {name} | Image: {iw}x{ih} | Tile: {tw}x{th}")
