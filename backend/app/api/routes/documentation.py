from fastapi import APIRouter

router = APIRouter(prefix="/documentation", tags=["documentation"])

@router.get("")
async def documentation():
    return {
        "message": "Documentation endpoint reached",
        "status": "dummy",
        "docs": {
            "upload": "/upload",
            "analyze": "/analyze",
            "chat": "/chat",
            "documentation": "/documentation"
        }
    }
