from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    PROJECT_NAME: str = "FPTU ResMap API"
    API_V1_STR: str = "/api/v1"
    # Allow Vercel frontend and localhost
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "https://resmap.vercel.app",
        "https://res-map.vercel.app",
        "https://www.res-map.vercel.app",
        "https://resmap.io.vn",
        "https://www.resmap.io.vn",
    ]

    # Placeholder for AI Keys
    OPENAI_API_KEY: str = ""
    GEMINI_API_KEY: str = ""

    SUPABASE_URL: str = ""
    SUPABASE_ANON_KEY: str = ""
    SUPABASE_JWT_SECRET: str = ""
    SUPABASE_JWT_ALGORITHM: str = "HS256"
    AUTH_REQUIRED: bool = False

    PORT: int = 8000

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
