import os
from google import genai
from dotenv import load_dotenv

from pathlib import Path
load_dotenv(dotenv_path=Path(__file__).parent.parent / "apps/astro-engine/.env")

api_key = os.environ.get("GEMINI_API_KEY")
print(f"Using API Key: {api_key[:10]}...")

try:
    client = genai.Client(api_key=api_key)
    print("Listing models...")
    for m in client.models.list():
        print(f"Model: {m.name}")
    
    response = client.models.generate_content(
        model="gemini-1.5-flash",
        contents="Say hello"
    )
    print("Response:", response.text)
except Exception as e:
    print("Error:", str(e))
