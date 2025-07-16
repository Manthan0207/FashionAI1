# routes/recommend.py  (FastAPI)
from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import List
import google.generativeai as genai
import os
from dotenv import load_dotenv
import json

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
router = APIRouter()
genai.configure(api_key=api_key)
model = genai.GenerativeModel("gemini-pro")


class Product(BaseModel):
    id: str
    name: str
    styleTags: List[str] = Field(default_factory=list)
    colors: List[str] = Field(default_factory=list)
    fitType: str
    gender: str
    ageRange: str
    material: str
    price: float


class UserData(BaseModel):
    gender: str
    ageRange: str
    preferredStyle: List[str]
    favoriteColors: List[str]
    fitType: str
    bodyType: str
    positiveProductIds: List[str] = Field(default_factory=list)


class RecRequest(BaseModel):
    userData: UserData
    prodData: List[Product]


@router.post("/recommend")
async def recommend_cloth(payload: RecRequest):
    user = payload.userData
    prods = payload.prodData

    # ---------- Build prompt ----------
    prod_lines = "\n".join(
        f"{p.id}: {p.name} | tags={','.join(p.styleTags)} | colors={','.join(p.colors)} "
        f"| fit={p.fitType} | gender={p.gender} | age={p.ageRange} | price={p.price}"
        for p in prods
    )

    prompt = f"""
You are a fashion recommendation engine.

User profile:
- Gender: {user.gender}
- Age range: {user.ageRange}
- Preferred styles: {', '.join(user.preferredStyle)}
- Favourite colours: {', '.join(user.favoriteColors)}
- Fit type: {user.fitType}
- Body type: {user.bodyType}
- Already liked/bought product IDs: {', '.join(user.positiveProductIds)}

Available products:
{prod_lines}

TASK: Return a JSON array (max 5 items) ordered best‑to‑least, each object:
{{"id": "<productId>", "reason": "<one short sentence>"}}

Respond ONLY with valid JSON.
"""

    # ---------- Gemini call ----------
    gemini_resp = model.generate_content(prompt)
    # guard against stray markdown
    raw = gemini_resp.text.strip().lstrip("```json").rstrip("```")
    recommendations = json.loads(raw)

    # ---------- Sort prod list in same order ----------
    order_map = {rec["id"]: i for i, rec in enumerate(recommendations)}
    sorted_prods = sorted(
        prods, key=lambda p: order_map.get(p.id, 999)
    )

    return {"recommendations": sorted_prods, "explanations": recommendations}
