from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.detect import router as detect_router 
from routes.virtual_tryon import router as viton_router
from routes.cloth_seg import router as cloth_seg

app = FastAPI()

origins = [
     "http://localhost:5173",
    "http://127.0.0.1:5173",
]

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or "*" for all
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(detect_router, prefix="/api")
app.include_router(viton_router , prefix="/api")
app.include_router(cloth_seg , prefix="/api")
