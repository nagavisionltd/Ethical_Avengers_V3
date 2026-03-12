from PIL import Image
import os

def crop_box(input_path, output_path, box=(768, 768, 1024, 1024)):
    try:
        img = Image.open(input_path)
        img_cropped = img.crop(box)
        img_cropped.save(output_path)
        print(f"Cropped {input_path} to {output_path}")
    except Exception as e:
        print(f"Error cropping {input_path}: {e}")

# Mappings
sheets = {
    "leon": "/Users/nagavision/Ethical_Avengers_V3/lore/character_sheets/Leon_G_Reference_Sheet_V2.png",
    "verona": "/Users/nagavision/Ethical_Avengers_V3/lore/character_sheets/Purple_Heroine_Reference_Sheet.png",
    "naga": "/Users/nagavision/Ethical_Avengers_V3/lore/character_sheets/Naga_Soul_Reference_Sheet.png",
    "jack": "/Users/nagavision/Ethical_Avengers_V3/lore/character_sheets/Tactical_Fighter_Reference_Sheet.png"
}

# The box in those specific AI sheets is usually standard. 
# For Leon, Verona, Naga it looks like a bottom-right square.
# Let's try 576, 576, 976, 976 (400x400) or similar.
# Actually, I'll do a few test crops for Leon to see.

test_box = (576, 576, 1024, 1024)

os.makedirs("/Users/nagavision/Ethical_Avengers_V3/assets/ui/portraits/fixed/", exist_ok=True)

crop_box(sheets["leon"], "/Users/nagavision/Ethical_Avengers_V3/assets/ui/portraits/fixed/hud_leon_v2.png", (576, 576, 992, 992))
crop_box(sheets["verona"], "/Users/nagavision/Ethical_Avengers_V3/assets/ui/portraits/fixed/hud_verona_v2.png", (768, 768, 1008, 1008)) # Verona box looks smaller/further right
crop_box(sheets["naga"], "/Users/nagavision/Ethical_Avengers_V3/assets/ui/portraits/fixed/hud_naga_v2.png", (768, 768, 1008, 1008))
crop_box(sheets["jack"], "/Users/nagavision/Ethical_Avengers_V3/assets/ui/portraits/fixed/hud_jack_v2.png", (600, 600, 1000, 1000))
