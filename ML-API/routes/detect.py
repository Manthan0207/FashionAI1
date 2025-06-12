from fastapi import APIRouter, File, UploadFile, HTTPException
from Services.detection import detect_faces_and_bodies

router = APIRouter()

@router.post("/detect")
async def detect(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type")
    
    result = detect_faces_and_bodies(file)
    return result
