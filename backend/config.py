import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    # App Config
    APP_NAME: str = "Lumi AI API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    # Gemini Config
    GEMINI_API_KEY: str = ""
    
    # DB Config
    DATABASE_URL: str = "postgresql://lumisync:lumisync_pass@localhost:5432/lumisync_db"
    
    # CORS
    ALLOWED_ORIGINS: str = "http://localhost:5173,http://localhost:3000,https://lumisync.vercel.app"

    @property
    def parsed_allowed_origins(self) -> List[str]:
        # Support both comma-separated and environment override ALLOWED_ORIGIN
        import os
        env_origin = os.environ.get("ALLOWED_ORIGIN")
        if env_origin:
            return [env_origin.strip()]
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",")]
    
    # RAG Config
    EMBEDDING_MODEL: str = "text-embedding-004"
    CHAT_MODEL: str = "gemini-2.0-flash-lite"
    
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

settings = Settings()
