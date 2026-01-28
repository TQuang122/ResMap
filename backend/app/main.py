from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api import health
from app.api.endpoints import topic, citation

app = FastAPI(title=settings.PROJECT_NAME)

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


@app.get("/")
async def root():
    return {"message": "Welcome to FPTU ResMap API. Visit /docs for Swagger UI."}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
