import os
import google.generativeai as genai

api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)

print("Listing supported models for your API key...")
for m in genai.list_models():
    if 'generateContent' in m.supported_generation_methods or 'image' in m.name:
        print(f"Model: {m.name}, Methods: {m.supported_generation_methods}")
