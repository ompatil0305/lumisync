import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    # App Config
    APP_NAME: str = "Lumi AI API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    # OpenAI Config
    OPENAI_API_KEY: str = ""
    
    # DB Config
    DATABASE_URL: str = "postgresql://lumisync:lumisync_pass@localhost:5432/lumisync_db"
    
    # CORS
    ALLOWED_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000"]
    
    # RAG Config
    EMBEDDING_MODEL: str = "text-embedding-3-small"
    CHAT_MODEL: str = "gpt-4o-mini"
    
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

settings = Settings()
