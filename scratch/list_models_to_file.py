import os
from google import genai
from dotenv import load_dotenv
from pathlib import Path

env_path = Path("/home/shan/projects/kosmiq/apps/astro-engine/.env")
load_dotenv(dotenv_path=env_path)

api_key = os.environ.get("GEMINI_API_KEY")

with open("/home/shan/projects/kosmiq/scratch/models_list.txt", "w") as f:
    f.write(f"API Key: {api_key[:10]}...\n")
    try:
        client = genai.Client(api_key=api_key)
        f.write("Listing models:\n")
        for m in client.models.list():
            f.write(f"- {m.name}\n")
    except Exception as e:
        f.write(f"Error listing models: {str(e)}\n")
