import uuid
from fastapi import APIRouter, HTTPException, Query, Request
from fastapi.responses import StreamingResponse
from typing import List, Optional
from sqlalchemy import text
from models.schemas import (
    ChatRequest, 
    BuildingResponse, 
    FacultyResponse, 
    IssueReportRequest
)
from services.vector_service import VectorService
from rag.pipeline import RAGPipeline

router = APIRouter()
rag_pipeline = RAGPipeline()
vector_service = VectorService()

@router.get("/health")
async def health_check():
    # Check database and vector service connection
    db_status = "disconnected"
    vector_status = "unknown"
    try:
        db = vector_service.SessionLocal()
        db.execute(text("SELECT 1"))
        db.close()
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"
        
    return {
        "status": "ok" if "error" not in db_status else "error",
        "version": "1.0.0",
        "database": db_status,
        "environment": "production"
    }

import logging
import time
logger = logging.getLogger(__name__)

# Simple in-memory rate limiting (30 messages per IP per hour)
chat_ip_cache = {}  # ip -> list of timestamps
RATE_LIMIT_WINDOW = 3600  # 1 hour in seconds
MAX_LIMIT = 30

def is_chat_rate_limited(ip: str) -> bool:
    now = time.time()
    timestamps = chat_ip_cache.get(ip, [])
    # Filter timestamps within the active 1-hour window
    active_timestamps = [t for t in timestamps if now - t < RATE_LIMIT_WINDOW]
    if len(active_timestamps) >= MAX_LIMIT:
        chat_ip_cache[ip] = active_timestamps
        return True
    active_timestamps.append(now)
    chat_ip_cache[ip] = active_timestamps
    return False

@router.post("/chat")
async def chat_endpoint(chat_req: ChatRequest, request: Request):
    # Get client IP from headers or connection
    forwarded = request.headers.get("x-forwarded-for")
    client_ip = forwarded.split(",")[0].strip() if forwarded else (request.headers.get("x-real-ip") or (request.client.host if request.client else "127.0.0.1"))

    if is_chat_rate_limited(client_ip):
        raise HTTPException(
            status_code=429,
            detail="Too many requests. Please try again in an hour."
        )

    try:
        messages = [{"role": m.role, "content": m.content} for m in chat_req.messages]
        stream, citations = await rag_pipeline.chat(messages, chat_req.university_id)
        return StreamingResponse(
            stream,
            media_type="text/plain",
            headers={
                "Cache-Control": "no-cache",
                "X-Accel-Buffering": "no",
            }
        )
    except Exception as e:
        logger.error(f"Chat endpoint error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# --- Buildings Endpoints ---

@router.get("/buildings", response_model=List[BuildingResponse])
async def get_buildings(category: Optional[str] = None):
    db = vector_service.SessionLocal()
    try:
        query = """
            SELECT id, slug, official_number, name, aliases, category, latitude, longitude, 
                   footprint, entrances, hours, wheelchair_entrance, elevator_available, photos, 
                   needs_verification 
            FROM buildings
        """
        params = {}
        if category:
            query += " WHERE category = :category"
            params["category"] = category
            
        result = db.execute(text(query), params)
        buildings_list = []
        for r in result:
            buildings_list.append(BuildingResponse(
                id=str(r[0]),
                slug=r[1],
                official_number=r[2],
                name=r[3],
                aliases=r[4] or [],
                category=r[5],
                latitude=r[6],
                longitude=r[7],
                footprint=r[8] if r[8] else None,
                entrances=r[9] if r[9] else [],
                hours=r[10] if r[10] else {},
                wheelchair_entrance=bool(r[11]),
                elevator_available=bool(r[12]),
                photos=r[13] or [],
                needs_verification=bool(r[14])
            ))
        return buildings_list
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()

@router.get("/buildings/{id}", response_model=BuildingResponse)
async def get_building(id: str):
    db = vector_service.SessionLocal()
    try:
        # Check if ID is UUID or slug
        is_uuid = False
        try:
            uuid.UUID(id)
            is_uuid = True
        except ValueError:
            pass
            
        if is_uuid:
            query = """
                SELECT id, slug, official_number, name, aliases, category, latitude, longitude, 
                       footprint, entrances, hours, wheelchair_entrance, elevator_available, photos, 
                       needs_verification 
                FROM buildings WHERE id = :id
            """
        else:
            query = """
                SELECT id, slug, official_number, name, aliases, category, latitude, longitude, 
                       footprint, entrances, hours, wheelchair_entrance, elevator_available, photos, 
                       needs_verification 
                FROM buildings WHERE slug = :id
            """
            
        result = db.execute(text(query), {"id": id}).first()
        if not result:
            raise HTTPException(status_code=404, detail="Building not found")
            
        return BuildingResponse(
            id=str(result[0]),
            slug=result[1],
            official_number=result[2],
            name=result[3],
            aliases=result[4] or [],
            category=result[5],
            latitude=result[6],
            longitude=result[7],
            footprint=result[8] if result[8] else None,
            entrances=result[9] if result[9] else [],
            hours=result[10] if result[10] else {},
            wheelchair_entrance=bool(result[11]),
            elevator_available=bool(result[12]),
            photos=result[13] or [],
            needs_verification=bool(result[14])
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()

# --- Faculty Endpoints ---

@router.get("/faculty", response_model=List[FacultyResponse])
async def get_faculty(department: Optional[str] = None, search: Optional[str] = None):
    db = vector_service.SessionLocal()
    try:
        query = """
            SELECT id, full_name, title, department, college, email, phone, 
                   office_building_id, office_room, office_hours, profile_url, needs_verification 
            FROM faculty
        """
        conditions = []
        params = {}
        
        if department:
            conditions.append("department = :department")
            params["department"] = department
            
        if search:
            conditions.append("(full_name ILIKE :search OR department ILIKE :search OR title ILIKE :search)")
            params["search"] = f"%{search}%"
            
        if conditions:
            query += " WHERE " + " AND ".join(conditions)
            
        result = db.execute(text(query), params)
        faculty_list = []
        for r in result:
            faculty_list.append(FacultyResponse(
                id=str(r[0]),
                full_name=r[1],
                title=r[2],
                department=r[3],
                college=r[4],
                email=r[5],
                phone=r[6],
                office_building_id=str(r[7]) if r[7] else None,
                office_room=r[8],
                office_hours=r[9],
                profile_url=r[10],
                needs_verification=bool(r[11])
            ))
        return faculty_list
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()

@router.get("/faculty/{id}", response_model=FacultyResponse)
async def get_faculty_member(id: str):
    db = vector_service.SessionLocal()
    try:
        query = """
            SELECT id, full_name, title, department, college, email, phone, 
                   office_building_id, office_room, office_hours, profile_url, needs_verification 
            FROM faculty WHERE id = :id
        """
        result = db.execute(text(query), {"id": id}).first()
        if not result:
            raise HTTPException(status_code=404, detail="Faculty member not found")
            
        return FacultyResponse(
            id=str(result[0]),
            full_name=result[1],
            title=result[2],
            department=result[3],
            college=result[4],
            email=result[5],
            phone=result[6],
            office_building_id=str(result[7]) if result[7] else None,
            office_room=result[8],
            office_hours=result[9],
            profile_url=result[10],
            needs_verification=bool(result[11])
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()

# --- Issue Reporting Endpoints ---

@router.post("/issues")
async def report_issue(request: IssueReportRequest):
    db = vector_service.SessionLocal()
    try:
        entity_uuid = None
        if request.entity_type == "building":
            # Check UUID
            is_uuid = False
            try:
                uuid.UUID(request.entity_id)
                is_uuid = True
            except ValueError:
                pass
                
            if is_uuid:
                chk = db.execute(text("SELECT id FROM buildings WHERE id = :id"), {"id": request.entity_id}).first()
                if chk:
                    entity_uuid = chk[0]
            else:
                chk = db.execute(text("SELECT id FROM buildings WHERE slug = :id"), {"id": request.entity_id}).first()
                if chk:
                    entity_uuid = chk[0]
        elif request.entity_type == "faculty":
            chk = db.execute(text("SELECT id FROM faculty WHERE id = :id"), {"id": request.entity_id}).first()
            if chk:
                entity_uuid = chk[0]
                
        if not entity_uuid:
            raise HTTPException(status_code=404, detail=f"{request.entity_type} not found with ID {request.entity_id}")
            
        insert_query = text("""
            INSERT INTO issue_reports (entity_type, entity_id, issue_description, reporter_contact)
            VALUES (:entity_type, :entity_id, :issue_description, :reporter_contact)
            RETURNING id
        """)
        
        res = db.execute(insert_query, {
            "entity_type": request.entity_type,
            "entity_id": entity_uuid,
            "issue_description": request.issue_description,
            "reporter_contact": request.reporter_contact
        })
        new_id = res.scalar()
        db.commit()
        return {"status": "success", "issue_id": str(new_id)}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()
