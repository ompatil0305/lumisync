from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging

from config import settings
from api.routes import router as api_router

# Setup Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
)

@app.on_event("startup")
def startup_event():
    import asyncio
    from sqlalchemy import text
    from services.vector_service import VectorService
    from scripts.migrate_data import migrate
    try:
        vector_service = VectorService()
        vector_service.init_db()
        logger.info("Startup database initialization completed successfully.")
        
        logger.info("Starting database migration/seeding...")
        migrate()
        logger.info("Database migration/seeding completed successfully.")
        
        # Check if RAG knowledge chunks need to be seeded
        try:
            db = vector_service.SessionLocal()
            count_chunks = db.execute(text("SELECT COUNT(*) FROM ttu_knowledge_chunks")).scalar() or 0
            db.close()
            
            if count_chunks == 0:
                logger.info("ttu_knowledge_chunks is empty, triggering automatic knowledge base ingestion...")
                from rag.ingest import ingest_data
                asyncio.run(ingest_data())
                logger.info("Knowledge base ingestion completed successfully.")
            else:
                logger.info(f"Knowledge base already has {count_chunks} chunks. Skipping ingestion.")
        except Exception as ingest_err:
            logger.error(f"Failed to auto-ingest RAG knowledge base: {ingest_err}")
            
    except Exception as e:
        logger.error(f"Startup database initialization/migration failed: {e}")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.parsed_allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={"message": "Internal server error occurred."},
    )

@app.get("/health")
async def root_health_check():
    from api.routes import health_check as hc
    return await hc()

app.include_router(api_router, prefix="/api/v1")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
