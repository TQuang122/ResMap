from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
import base64
import httpx
import jwt

from app.core.config import settings


security = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    if not settings.AUTH_REQUIRED:
        return {"role": "anon"}

    if not settings.SUPABASE_JWT_SECRET:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="SUPABASE_JWT_SECRET is not configured",
        )

    if not credentials or credentials.scheme.lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid authorization header",
        )

    token = credentials.credentials
    raw_secret = settings.SUPABASE_JWT_SECRET
    payload = None
    try:
        payload = jwt.decode(
            token,
            raw_secret,
            algorithms=[settings.SUPABASE_JWT_ALGORITHM],
            options={"verify_aud": False},
        )
    except jwt.PyJWTError:
        try:
            decoded_secret = base64.b64decode(raw_secret, validate=True)
            payload = jwt.decode(
                token,
                decoded_secret,
                algorithms=[settings.SUPABASE_JWT_ALGORITHM],
                options={"verify_aud": False},
            )
        except Exception:
            payload = None

    if payload is None:
        if not settings.SUPABASE_URL or not settings.SUPABASE_ANON_KEY:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token",
            )

        url = f"{settings.SUPABASE_URL.rstrip('/')}/auth/v1/user"
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(
                url,
                headers={
                    "Authorization": f"Bearer {token}",
                    "apikey": settings.SUPABASE_ANON_KEY,
                },
            )

        if resp.status_code != 200:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token",
            )

        payload = resp.json()

    return payload
