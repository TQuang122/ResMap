from fastapi import APIRouter, HTTPException, Request, Depends
import traceback

from app.schemas.writing import WritingAssistRequest, WritingAssistResponse
from app.services.writing_service import writing_service
from app.core.limiter import limiter
from app.api.deps import get_current_user


router = APIRouter()


@router.post("/writing", response_model=WritingAssistResponse)
@limiter.limit("5/minute")
async def writing_assistant(
    request: Request,
    payload: WritingAssistRequest,
    current_user: dict = Depends(get_current_user),
) -> WritingAssistResponse:
    """Summarize or rewrite text for academic use."""
    try:
        result = await writing_service.assist(
            text=payload.text,
            task=payload.task,
            tone=payload.tone,
            output_language=payload.output_language,
        )
        return WritingAssistResponse(result=result)
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        print("Writing assistant error:")
        print(traceback.format_exc())
        raise HTTPException(
            status_code=500, detail=f"Writing assistant failed: {str(e)}"
        )
