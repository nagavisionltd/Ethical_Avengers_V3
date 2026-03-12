import os
import sys
from google import genai
from google.genai import types

# Set up the API key
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("Error: GEMINI_API_KEY not found.")
    sys.exit(1)

client = genai.Client(api_key=api_key)

def generate_image(prompt, output_file, image_paths=None, focus_char=None):
    print(f"Generating image for: '{prompt}'...")
    if image_paths:
        print(f"Using reference images: {image_paths}")
        if focus_char:
            print(f"Focusing on: {focus_char}")
    
    try:
        final_prompt = prompt
        if image_paths:
            content_parts = []
            focus_instr = f"Focus on the character: {focus_char}. " if focus_char else ""
            content_parts.append(f"{focus_instr}Analyze these character designs in extreme detail for a 90s anime adaptation. Focus on armor colors, symbols (LOOK CLOSELY: it is an 'EA' logo for Ethical Avengers in a shield), facial features, skin tone, and unique gear. Be precise so a painter can recreate them perfectly in a collective shot.")
            
            for path in image_paths:
                if not os.path.exists(path):
                    print(f"Warning: Image path {path} does not exist. Skipping.")
                    continue
                with open(path, "rb") as f:
                    img_data = f.read()
                content_parts.append(types.Part.from_bytes(data=img_data, mime_type="image/png"))
            
            # Use Gemini 2.0 Flash to describe the characters in extreme detail for Imagen
            print(f"Analyzing {len(image_paths)} reference images for 10/10 detailed prompt...")
            vision_response = client.models.generate_content(
                model='gemini-2.0-flash',
                contents=content_parts
            )
            detailed_description = vision_response.text
            print(f"Vision Analysis Result: {detailed_description}")
            final_prompt = f"{prompt}. Character Details from references: {detailed_description}. MUST maintain original colors and logo."

        # Signature 90s Anime Style
        style_suffix = ", hand-drawn 90s anime style, detailed cel-shading, rich colors, aesthetic like Akira and Ninja Scroll, high-fidelity production art, 16:9 cinematic, 4k"
        full_prompt = f"{final_prompt}{style_suffix}"
        print(f"Final Combined Prompt: {full_prompt}")

        response = client.models.generate_images(
            model='imagen-4.0-generate-001',
            prompt=full_prompt,
            config=types.GenerateImagesConfig(
                number_of_images=1,
                aspect_ratio="16:9"
            )
        )
        
        if response.generated_images:
            image_data = response.generated_images[0].image.image_bytes
            with open(output_file, "wb") as f:
                f.write(image_data)
            print(f"Image successfully saved to {output_file}")
            return True
        else:
            print("No images were generated.")
            return False
            
    except Exception as e:
        print(f"An error occurred: {e}")
        return False

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("prompt", help="The text prompt")
    parser.add_argument("output", help="Output file path")
    parser.add_argument("--images", help="Comma-separated list of reference image paths", default=None)
    parser.add_argument("--focus", help="Description of which character to focus on", default=None)
    args = parser.parse_args()
    
    image_list = args.images.split(",") if args.images else None
    generate_image(args.prompt, args.output, image_list, args.focus)
