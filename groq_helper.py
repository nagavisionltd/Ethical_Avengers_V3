import os
import sys
import json
from groq import Groq

def query_groq(prompt, model="llama-3.3-70b-versatile"):
    key = os.environ.get("GROQ_API_KEY")
    if not key:
        print("Error: GROQ_API_KEY environment variable not set.")
        sys.exit(1)
        
    client = Groq(api_key=key)
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a specialized game design assistant for a 2.5D beat-em-up game named 'Ethical Avengers'. You generate technical data (JSON), dialogue, and lore."
                },
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model=model,
        )
        return chat_completion.choices[0].message.content
    except Exception as e:
        return f"Error querying Groq: {str(e)}"

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python groq_helper.py 'your prompt'")
        sys.exit(1)
    
    user_prompt = sys.argv[1]
    result = query_groq(user_prompt)
    print(result)
