from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from app.core.config import settings
from app.core.limiter import limiter
from app.api import health
from app.api.endpoints import topic, citation, plagiarism, writing

app = FastAPI(title=settings.PROJECT_NAME)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(health.router, prefix="/api", tags=["health"])
app.include_router(topic.router, prefix="/api/chat", tags=["chat"])
app.include_router(citation.router, prefix="/api/tools", tags=["tools"])
app.include_router(plagiarism.router, prefix="/api/tools", tags=["tools"])
app.include_router(writing.router, prefix="/api/tools", tags=["tools"])


@app.get("/")
async def root():
    return {"message": "Welcome to FPTU ResMap API. Visit /docs for Swagger UI."}


if __name__ == "__main__":
    import os
    import uvicorn

    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True)
