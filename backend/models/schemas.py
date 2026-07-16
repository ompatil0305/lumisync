from pydantic import BaseModel
from typing import List, Optional

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    university_id: str = "ttu"

class Citation(BaseModel):
    id: str
    title: str
    url: str
    source: str
    content: str

class ChatResponse(BaseModel):
    message: str
    citations: List[Citation] = []

class DocumentChunk(BaseModel):
    id: str
    content: str
    metadata: dict
