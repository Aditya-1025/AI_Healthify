import os
from pathlib import Path
from fastapi import APIRouter, HTTPException
from dotenv import load_dotenv
from google import genai
from ..schemas import ChatRequest

# Load environment variables from the Backend directory
backend_dir = Path(__file__).parent.parent.parent
env_path = backend_dir / ".env"
load_dotenv(dotenv_path=env_path)

router = APIRouter(prefix="/ai", tags=["AI"])

# Get API Key
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError(f"GEMINI_API_KEY not found in .env file at {env_path}")

# Initialize Gemini Client
client = genai.Client(api_key=api_key)

# Medical safety system prompt
SYSTEM_PROMPT = """
You are Healthify AI, a healthcare assistant.

Rules:
- Provide only general medical guidance.
- Do NOT provide prescriptions or exact dosages.
- Do NOT diagnose diseases.
- Always end response with:
  'Consult a certified doctor for proper diagnosis.'
"""

@router.post("/chat")
def chat(request: ChatRequest):
    try:
        full_prompt = f"{SYSTEM_PROMPT}\n\nUser: {request.message}"

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=full_prompt,
        )

        return {
            "response": response.text
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))