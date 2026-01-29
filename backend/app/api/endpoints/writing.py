from fastapi import APIRouter, HTTPException
import traceback

from app.schemas.writing import WritingAssistRequest, WritingAssistResponse
from app.services.writing_service import writing_service


router = APIRouter()


@router.post("/writing", response_model=WritingAssistResponse)
async def writing_assistant(request: WritingAssistRequest) -> WritingAssistResponse:
    """Summarize or rewrite text for academic use."""
    try:
        result = await writing_service.assist(
            text=request.text,
            task=request.task,
            tone=request.tone,
            output_language=request.output_language,
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
