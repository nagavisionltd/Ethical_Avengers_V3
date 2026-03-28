import os
import glob
from rembg import remove
from PIL import Image

def process_folder(input_folder):
    print(f"Processing folder: {input_folder}")
    
    # Get all PNG files in the folder
    search_pattern = os.path.join(input_folder, "*.png")
    files = glob.glob(search_pattern)
    
    if not files:
        print("No PNG files found.")
        return
        
    for filepath in files:
        # Skip files that are already processed
        if "_nobg.png" in filepath:
            continue
            
        print(f"Removing background from: {os.path.basename(filepath)}")
        
        try:
            # Read image
            with open(filepath, "rb") as i:
                input_data = i.read()
                
            # Remove background using rembg
            output_data = remove(input_data)
            
            # Create output filename
            base, ext = os.path.splitext(filepath)
            out_filepath = f"{base}_nobg.png"
            
            # Save the processed image
            with open(out_filepath, "wb") as o:
                o.write(output_data)
                
            print(f"  -> Saved as: {os.path.basename(out_filepath)}")
        except Exception as e:
            print(f"  -> Error processing {os.path.basename(filepath)}: {e}")

if __name__ == "__main__":
    folder_path = "/Users/nagavision/Ethical_Avengers_V3/assets/images/characters/naga-soul-26/untitled folder"
    process_folder(folder_path)
