import os
from typing import List
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import fitz
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY  = os.getenv("GEMINI_API_KEY")
EMBEDDING_MODEL = os.getenv(
    "EMBEDDING_MODEL", "text-embedding-004")
CHUNK_SIZE      = int(os.getenv("CHUNK_SIZE", "500"))
CHUNK_OVERLAP   = int(os.getenv("CHUNK_OVERLAP", "50"))

# initialise new client
client = genai.Client(api_key=GEMINI_API_KEY)

app = FastAPI(title="ContractIQ Embedding Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── models ─────────────────────────────────────────────────────
class EmbeddingRequest(BaseModel):
    text: str

class EmbeddingResponse(BaseModel):
    embedding: List[float]

class ChunkData(BaseModel):
    chunkIndex: int
    text: str
    embedding: List[float]

class ChunkEmbeddingResponse(BaseModel):
    chunks: List[ChunkData]
    totalChunks: int

# ── helpers ────────────────────────────────────────────────────
def extract_text_from_pdf(file_bytes: bytes) -> str:
    try:
        doc  = fitz.open(stream=file_bytes, filetype="pdf")
        text = ""
        for page in doc:
            text += page.get_text()
        doc.close()
        return text.strip()
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to extract PDF text: {str(e)}"
        )

def chunk_text(text: str,
               chunk_size: int = CHUNK_SIZE,
               overlap: int = CHUNK_OVERLAP) -> List[str]:
    if not text.strip():
        return []
    words  = text.split()
    chunks = []
    start  = 0
    while start < len(words):
        end   = min(start + chunk_size, len(words))
        chunk = " ".join(words[start:end])
        if chunk.strip():
            chunks.append(chunk)
        start += chunk_size - overlap
        if start >= len(words):
            break
    return chunks

def embed_single(text: str) -> List[float]:
    try:
        result = client.models.embed_content(
            model=EMBEDDING_MODEL,
            contents=text,
        )
        return result.embeddings[0].values
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Embedding failed: {str(e)}"
        )

# ── routes ──────────────────────────────────────────────────────
@app.get("/health")
def health():
    return {
        "status": "UP",
        "service": "embedding-service",
        "model": EMBEDDING_MODEL
    }

@app.get("/list-models")
def list_models():
    try:
        models = []
        for model in client.models.list():
            models.append(model.name)
        return {"models": models}
    except Exception as e:
        return {"error": str(e)}

@app.post("/embed", response_model=EmbeddingResponse)
def embed_text(request: EmbeddingRequest):
    if not request.text.strip():
        raise HTTPException(
            status_code=400,
            detail="Text cannot be empty"
        )
    embedding = embed_single(request.text)
    return EmbeddingResponse(embedding=embedding)

@app.post("/process-document",
          response_model=ChunkEmbeddingResponse)
async def process_document(
        file: UploadFile = File(...)):

    if not file.filename.endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are supported"
        )

    file_bytes = await file.read()

    if len(file_bytes) == 0:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is empty"
        )

    text = extract_text_from_pdf(file_bytes)

    if not text:
        raise HTTPException(
            status_code=400,
            detail="No text extracted. May be a scanned PDF."
        )

    chunks = chunk_text(text)

    if not chunks:
        raise HTTPException(
            status_code=400,
            detail="Document too short to process."
        )

    result_chunks = []
    for index, chunk in enumerate(chunks):
        embedding = embed_single(chunk)
        result_chunks.append(ChunkData(
            chunkIndex=index,
            text=chunk,
            embedding=embedding
        ))

    return ChunkEmbeddingResponse(
        chunks=result_chunks,
        totalChunks=len(result_chunks)
    )