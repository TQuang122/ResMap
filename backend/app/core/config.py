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

    # OpenAlex API (no key needed, email for polite pool)
    OPENALEX_EMAIL: str = "resmap.researchteam@gmail.com"
    CORE_API_KEY: str = ""
    NCBI_TOOL: str = "resmap"
    NCBI_EMAIL: str = "resmap.researchteam@gmail.com"
    NCBI_API_KEY: str = ""

    SEMANTIC_SCORING_ENABLED: bool = False
    SEMANTIC_PROVIDER: str = "gemini"
    SEMANTIC_QUOTA_LIMIT: int = 30000
    SEMANTIC_TIMEOUT_SECONDS: float = 8.0
    SEMANTIC_MAX_CHECKS_PER_REQUEST: int = 30
    SEMANTIC_QUOTA_PERSISTENCE_ENABLED: bool = False
    SEMANTIC_QUOTA_FALLBACK_ENABLED: bool = True
    SEMANTIC_QUOTA_BACKEND_MODE: str = "memory"
    SEMANTIC_QUOTA_UNIT: str = "semantic_checks"
    SEMANTIC_QUOTA_WINDOW_DAYS: int = 30

    PLAGIARISM_SOURCE_DUCKDUCKGO_ENABLED: bool = True
    PLAGIARISM_SOURCE_CROSSREF_ENABLED: bool = True
    PLAGIARISM_SOURCE_ARXIV_ENABLED: bool = True
    PLAGIARISM_SOURCE_CORE_ENABLED: bool = False
    PLAGIARISM_SOURCE_PUBMED_ENABLED: bool = True
    PLAGIARISM_SOURCE_VIETNAMESE_ENABLED: bool = True
    PLAGIARISM_SOURCE_DUCKDUCKGO_MAX_CANDIDATES: int = 8
    PLAGIARISM_SOURCE_CROSSREF_MAX_CANDIDATES: int = 5
    PLAGIARISM_SOURCE_ARXIV_MAX_CANDIDATES: int = 5
    PLAGIARISM_SOURCE_CORE_MAX_CANDIDATES: int = 5
    PLAGIARISM_SOURCE_PUBMED_MAX_CANDIDATES: int = 5
    PLAGIARISM_SOURCE_VIETNAMESE_MAX_CANDIDATES: int = 8
    PLAGIARISM_SOURCE_GLOBAL_MAX_CANDIDATES: int = 10
    PLAGIARISM_SOURCE_TIMEOUT_SECONDS: float = 10.0
    PLAGIARISM_SOURCE_CORE_AUTH_MODE: str = "bearer"

    SUPABASE_URL: str = ""
    SUPABASE_ANON_KEY: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""
    SUPABASE_JWT_SECRET: str = ""
    SUPABASE_JWT_ALGORITHM: str = "HS256"
    AUTH_REQUIRED: bool = False

    PORT: int = 8000

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
