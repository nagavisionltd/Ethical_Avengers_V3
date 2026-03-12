import os
import sys
import google.generativeai as genai

# Set up the API key from environment
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("Error: GEMINI_API_KEY not found in environment.")
    sys.exit(1)

genai.configure(api_key=api_key)

def generate_image(prompt, output_file):
    print(f"Generating image for: '{prompt}'...")
    try:
        # Using Imagen 3 via the Gemini API
        # Note: Model name might vary based on API access (e.g., 'imagen-3.0-generate-001' or 'models/imagen-3.0-generate-001')
        model = genai.GenerativeModel('imagen-3.0-generate-001')
        
        # Simple generation call
        response = model.generate_content(prompt)
        
        # For Imagen, responses are usually handled differently than chat
        # Checking if this specific model/SDK version supports direct generation here
        # or if we need to use a different method. 
        # Standard Imagen 3 API via AI Studio often uses this pattern:
        if response.images:
            for i, image in enumerate(response.images):
                image.save(output_file)
                print(f"Image saved to {output_file}")
                return True
        else:
            print("No images were generated.")
            print(f"Response: {response}")
            return False
            
    except Exception as e:
        print(f"An error occurred: {e}")
        return False

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python generate_paid.py '<prompt>' <output_path>")
        sys.exit(1)
        
    prompt = sys.argv[1]
    output_path = sys.argv[2]
    generate_image(prompt, output_path)
