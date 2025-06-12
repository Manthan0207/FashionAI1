# routes/detect.py

from fastapi import APIRouter, UploadFile, File
from Services.cloth_seg_service import preprocess_image, predict_mask, mask_to_rgb
from io import BytesIO

router = APIRouter()

@router.post("/segment-cloth")
async def segment_cloth(file: UploadFile = File(...)):
    image_tensor, original_size = preprocess_image(file)
    mask = predict_mask(image_tensor)
    color_mask = mask_to_rgb(mask).resize(original_size)

    buffer = BytesIO()
    color_mask.save(buffer, format="PNG")  # Stored in memory only
    buffer.seek(0)

    return {
        "filename": file.filename,
        "result": f"data:image/png;base64,{buffer.getvalue().hex()}"
    }
