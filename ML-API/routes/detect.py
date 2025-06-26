from fastapi import APIRouter, File, UploadFile, HTTPException
from Services.detection import detect_faces_and_bodies

router = APIRouter()

@router.post("/detect")
async def detect(file: UploadFile = File(...)):
    print("hi1")
    if not file.content_type.startswith("image/"):
        raise HTTPException(400, "Invalid file type")
    print("hi2")
    return detect_faces_and_bodies(file)
