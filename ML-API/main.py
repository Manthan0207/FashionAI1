from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.detect import router as detect_router 
from routes.virtual_tryon import router as viton_router
from routes.cloth_seg import router as cloth_seg

app = FastAPI()

origins = [
    "http://localhost:5173",  # your React dev server
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # restrict to React app origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(detect_router, prefix="/api")
app.include_router(viton_router , prefix="/api")
app.include_router(cloth_seg , prefix="/api")
