from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import json
from models.schemas import ChatRequest

from rag.pipeline import RAGPipeline

router = APIRouter()
rag_pipeline = RAGPipeline()

@router.get("/health")
async def health_check():
    return {"status": "ok", "version": "1.0.0"}

@router.post("/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        messages = [{"role": m.role, "content": m.content} for m in request.messages]
        
        # In a real app we might want to return citations alongside the stream.
        # For simplicity, we just stream the text. A robust implementation would use Server-Sent Events (SSE)
        # yielding JSON objects containing both chunks and metadata.
        stream, citations = await rag_pipeline.chat(messages, request.university_id)
        
        return StreamingResponse(stream, media_type="text/event-stream")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

