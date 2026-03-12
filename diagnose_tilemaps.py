#!/usr/bin/env python3
"""
COMPREHENSIVE TILEMAP PIPELINE DIAGNOSTIC
Traces: Boot_v16.js → JSON map files → tileset images → disk
"""
import json
import re
import os
from pathlib import Path

ROOT = Path(".")
BOOT = ROOT / "src/scenes/Boot_v16.js"
SCENE = ROOT / "src/scenes/JunkPlainsScene.js"

print("=" * 80)
print("ETHICAL AVENGERS V3 - TILEMAP PIPELINE DIAGNOSTIC")
print("=" * 80)

# Step 1: Parse Boot_v16.js for all tilemapTiledJSON calls
print("\n--- STEP 1: Map keys loaded in Boot_v16.js ---")
boot_text = BOOT.read_text()

# Find all tilemap loads
tilemap_loads = re.findall(r"this\.load\.tilemapTiledJSON\(['\"](\w+)['\"],\s*['\"]([^'\"]+)['\"]\)", boot_text)
print(f"Found {len(tilemap_loads)} tilemap loads:")
for key, path in tilemap_loads:
    exists = os.path.exists(path)
    print(f"  Key: {key:30s} → {path:50s} {'✅' if exists else '❌ FILE MISSING'}")

# Find all image loads
image_loads = re.findall(r"this\.load\.image\(['\"](\w+)['\"],\s*['\"]([^'\"]+)['\"]\)", boot_text)
image_keys = {key: path for key, path in image_loads}
print(f"\nFound {len(image_loads)} image loads total")

# Step 2: For each tilemap, check its tilesets
print("\n--- STEP 2: Tileset analysis per map file ---")
for map_key, map_path in tilemap_loads:
    if not os.path.exists(map_path):
        print(f"\n❌ SKIPPING {map_key}: file {map_path} does not exist")
        continue
    
    with open(map_path) as f:
        map_data = json.load(f)
    
    map_tw = map_data.get('tilewidth', '?')
    map_th = map_data.get('tileheight', '?')
    map_w = map_data.get('width', '?')
    map_h = map_data.get('height', '?')
    
    print(f"\n{'='*60}")
    print(f"MAP: {map_key} → {map_path}")
    print(f"  Size: {map_w}x{map_h} tiles, Tile size: {map_tw}x{map_th}px")
    
    tilesets = map_data.get('tilesets', [])
    print(f"  Tilesets ({len(tilesets)}):")
    
    for ts in tilesets:
        name = ts.get('name', 'UNNAMED')
        img = ts.get('image', 'NO_IMAGE')
        firstgid = ts.get('firstgid', '?')
        tilecount = ts.get('tilecount', '?')
        ts_tw = ts.get('tilewidth', '?')
        ts_th = ts.get('tileheight', '?')
        iw = ts.get('imagewidth', 0)
        ih = ts.get('imageheight', 0)
        
        # Check if image exists
        img_exists = os.path.exists(img) if img != 'NO_IMAGE' else False
        
        # Check if a Boot image key matches this tileset name
        boot_key = None
        for k, v in image_keys.items():
            if k == name:
                boot_key = k
                break
        
        dim_ok = True
        if iw and ih and ts_tw and ts_th:
            if isinstance(ts_tw, int) and isinstance(ts_th, int):
                if iw % ts_tw != 0 or ih % ts_th != 0:
                    dim_ok = False
        
        status = '✅' if img_exists else '❌'
        boot_status = f'Boot key: {boot_key}' if boot_key else '⚠️  NO BOOT KEY MATCH'
        dim_status = '✅' if dim_ok else f'❌ DIM MISMATCH ({iw}x{ih} / {ts_tw}x{ts_th})'
        
        print(f"    {status} {name:25s} GID:{firstgid:>5} tiles:{tilecount:>4} | {img:50s} | {boot_status} | {dim_status}")

    # Check layers
    layers = map_data.get('layers', [])
    tile_layers = [l for l in layers if l.get('type') == 'tilelayer']
    obj_layers = [l for l in layers if l.get('type') == 'objectgroup']
    
    print(f"  Layers: {len(tile_layers)} tile, {len(obj_layers)} object")
    
    for layer in tile_layers:
        lname = layer.get('name', 'UNNAMED')
        data = layer.get('data', [])
        non_zero = sum(1 for d in data if d > 0)
        if data:
            used_gids = set(d for d in data if d > 0)
            min_gid = min(used_gids) if used_gids else 0
            max_gid = max(used_gids) if used_gids else 0
        else:
            min_gid = max_gid = 0
            
        # Check if GIDs fall within any tileset range
        covered = True
        uncovered_gids = set()
        for gid in used_gids:
            found = False
            for ts in tilesets:
                fg = ts.get('firstgid', 0)
                tc = ts.get('tilecount', 0)
                if fg <= gid < fg + tc:
                    found = True
                    break
            if not found:
                covered = False
                uncovered_gids.add(gid)
        
        gid_status = '✅' if covered else f'❌ {len(uncovered_gids)} uncovered GIDs'
        print(f"    Layer: {lname:20s} | {non_zero:>5} tiles | GID range: {min_gid}-{max_gid} | {gid_status}")
        if uncovered_gids and len(uncovered_gids) <= 10:
            print(f"      Uncovered GIDs: {sorted(uncovered_gids)}")

# Step 3: Check the JunkPlainsScene tilesetMap
print("\n--- STEP 3: JunkPlainsScene.js tilesetMap coverage ---")
scene_text = SCENE.read_text()

# Extract tilesetMap entries
ts_map_entries = re.findall(r"'([^']+)':\s*'([^']+)'", scene_text)
ts_map = dict(ts_map_entries)
print(f"Found {len(ts_map)} entries in tilesetMap")

# For each map, check if ALL its tileset names have a mapping
for map_key, map_path in tilemap_loads:
    if not os.path.exists(map_path):
        continue
    with open(map_path) as f:
        map_data = json.load(f)
    
    print(f"\n  Checking {map_key}:")
    for ts in map_data.get('tilesets', []):
        name = ts.get('name', '')
        if name in ts_map:
            target_key = ts_map[name]
            if target_key in image_keys:
                img_path = image_keys[target_key]
                exists = os.path.exists(img_path)
                print(f"    ✅ '{name}' → tilesetMap['{name}'] = '{target_key}' → Boot loads '{img_path}' {'✅' if exists else '❌ FILE MISSING'}")
            else:
                print(f"    ❌ '{name}' → tilesetMap maps to '{target_key}' but NO BOOT IMAGE KEY '{target_key}' EXISTS!")
        elif name in image_keys:
            # Fallback: ts.name matches a Boot key directly
            print(f"    ⚠️  '{name}' → No tilesetMap entry, but falls back to Boot key '{name}' ✅")
        else:
            print(f"    ❌ '{name}' → No tilesetMap entry AND no Boot key match! WILL FAIL!")

print("\n" + "=" * 80)
print("DIAGNOSTIC COMPLETE")
print("=" * 80)
