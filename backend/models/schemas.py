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

class BuildingResponse(BaseModel):
    id: str
    slug: str
    official_number: Optional[str] = "N/A"
    name: str
    aliases: List[str] = []
    category: str
    latitude: float
    longitude: float
    footprint: Optional[dict] = None
    entrances: List[dict] = []
    hours: dict = {}
    wheelchair_entrance: bool = False
    elevator_available: bool = False
    photos: List[str] = []
    needs_verification: bool = False

class FacultyResponse(BaseModel):
    id: str
    full_name: str
    title: Optional[str] = None
    department: str
    college: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    office_building_id: Optional[str] = None
    office_room: Optional[str] = None
    office_hours: Optional[str] = None
    profile_url: Optional[str] = None
    needs_verification: bool = False

class IssueReportRequest(BaseModel):
    entity_type: str # 'building' or 'faculty'
    entity_id: str   # UUID or Slug
    issue_description: str
    reporter_contact: Optional[str] = None

