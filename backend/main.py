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
        
        # RAG Knowledge Base is now ingested via one-off manual script run
        logger.info("Database startup check completed.")
    except Exception as e:
        logger.error(f"Startup database initialization/migration failed: {e}")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.parsed_allowed_origins,
    allow_origin_regex=r"https://lumisync(-website)?(-git-.*)?\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Enforce HTTPS behind reverse proxies in production
@app.middleware("http")
async def enforce_https_middleware(request: Request, call_next):
    if not settings.DEBUG:
        proto = request.headers.get("x-forwarded-proto")
        if proto == "http":
            from fastapi.responses import RedirectResponse
            url = request.url.replace(scheme="https")
            return RedirectResponse(url, status_code=301)
    return await call_next(request)

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
