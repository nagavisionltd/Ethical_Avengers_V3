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

def generate_image(prompt, output_file):
    print(f"Generating image with Imagen 4.0 for: '{prompt}'...")
    try:
        # Falling back to a model known to support generate_content for images in some contexts
        # or at least test if we can hit ANY model
        response = client.models.generate_content(
            model='gemini-2.5-flash-image', 
            contents=prompt
        )
        
        if response.candidates and response.candidates[0].content.parts:
            for i, part in enumerate(response.candidates[0].content.parts):
                if part.inline_data:
                    # Save the first image part found
                    with open(output_file, "wb") as f:
                        f.write(part.inline_data.data)
                    print(f"Image saved to {output_file}")
                    return True
        print(f"No inline data found in response: {response}")
        return False
            
    except Exception as e:
        print(f"An error occurred: {e}")
        return False

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python generate_paid_v2.py '<prompt>' <output_path>")
        sys.exit(1)
        
    prompt = sys.argv[1]
    output_path = sys.argv[2]
    # Check if prompt contains the desired styles
    full_prompt = f"{prompt}, 90s anime style, Akira Toriyama and Yoshiaki Kawajiri aesthetic, detailed cel-shading, high fidelity, 16:9 cinematic"
    generate_image(full_prompt, output_path)
