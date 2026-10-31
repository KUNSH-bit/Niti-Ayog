from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

app = FastAPI(
    title="Policy & Rights Explainer API",
    description="Python backend service handling schemes, eligibility, translation, and assistant features.",
    version="1.0.0",
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production to match your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Pydantic Data Models for Request Bodies ---
class EligibilityRequest(BaseModel):
    user_age: int
    income: float
    category: str
    state: str


class TranslateRequest(BaseModel):
    text: str
    target_language: str


class AssistantQuery(BaseModel):
    prompt: str
    context: str | None = None


# --- API Endpoints ---


@app.get("/")
def read_root():
    return {
        "status": "online",
        "message": "Python FastAPI backend is running successfully!",
    }


@app.get("/api/schemes")
def get_schemes():
    """Retrieve available government schemes or welfare items."""
    return [
        {
            "id": "1",
            "title": "National Education Scholarship",
            "category": "Education",
            "description": "Financial assistance for meritorious students.",
        },
        {
            "id": "2",
            "title": "Rural Healthcare Support Initiative",
            "category": "Health",
            "description": "Subsidized medical checkups and treatments.",
        },
    ]


@app.post("/api/eligibility")
def check_eligibility(data: EligibilityRequest):
    """Evaluate user eligibility based on demographic and financial criteria."""
    is_eligible = data.income < 300000 and data.user_age >= 18
    return {
        "eligible": is_eligible,
        "message": (
            "User meets the criteria for standard schemes."
            if is_eligible
            else "Income or age criteria not met."
        ),
    }


@app.post("/api/translate")
def translate_text(data: TranslateRequest):
    """Translate policy text or explanations into regional languages."""
    return {
        "original_text": data.text,
        "target_language": data.target_language,
        "translated_text": f"[{data.target_language.upper()} translation]: {data.text}",
    }


@app.post("/api/assistant")
def assistant_chat(query: AssistantQuery):
    """Handle conversational policy and rights explanations."""
    return {
        "response": f"Processed query regarding: '{query.prompt}'. Here is the plain-language summary."
    }


@app.post("/api/upload")
async def upload_document(file: UploadFile = File(...)):
    """Handle document uploads (PDFs, images) for parsing notifications."""
    if not file.filename.endswith((".pdf", ".png", ".jpg", ".jpeg", ".txt")):
        raise HTTPException(status_code=400, detail="Unsupported file format.")

    contents = await file.read()
    return {
        "filename": file.filename,
        "size_bytes": len(contents),
        "status": "Successfully uploaded and queued for text extraction.",
    }


if __name__ == "__main__":
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)
