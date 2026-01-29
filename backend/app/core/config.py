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
    ]

    # Placeholder for AI Keys
    OPENAI_API_KEY: str = ""
    GEMINI_API_KEY: str = ""

    class Config:
        env_file = ".env"


settings = Settings()
