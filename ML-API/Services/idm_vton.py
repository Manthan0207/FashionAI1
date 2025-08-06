from gradio_client import Client, file
from PIL import Image
import tempfile
import os
from typing import Union
import base64

# Global client (only initialized once)
client = Client("yisol/IDM-VTON")

# Helper to save PIL image to temporary file
def save_image_to_temp(img: Image.Image) -> str:
    tmp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".png")
    img.save(tmp_file, format="PNG")
    tmp_file.close()
    return tmp_file.name

# Helper to safely remove file if it exists
def safe_remove(path: Union[str, None]):
    if path and isinstance(path, str) and os.path.exists(path):
        try:
            os.remove(path)
        except Exception as e:
            print(f"Warning: could not remove {path}: {e}")

async def handle_virtual_tryon(vton_img: str, temp_upload: str) -> str:
    """
    vton_path and garm_path must be string paths to image files
    """
    try:
        result = client.predict(
            dict={"background": file(vton_img), "layers": [], "composite": None},
            garm_img=file(temp_upload),
            garment_des="Uploaded via API",
            is_checked=True,
            is_checked_crop=False,
            # denoise_steps=30,
            denoise_steps=20,
            seed=42,
            api_name="/tryon"
        )
        # return result  # usually a URL
        processed_results = []
        for item in result:
            if item.get('image'):
                with open(item['image'], "rb") as img_file:
                    encoded = base64.b64encode(img_file.read()).decode('utf-8')
                    processed_results.append({
                        'image': f"data:image/webp;base64,{encoded}",
                        'caption': item.get('caption')
                    })

        return {"result": processed_results}
    except Exception as e:
        raise RuntimeError(f"IDM-VTON API call failed: {str(e)}")
    finally:
        safe_remove(vton_img)
        safe_remove(temp_upload)
