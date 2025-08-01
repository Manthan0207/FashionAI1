from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import List
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

router = APIRouter()

# --------------- Models ----------------
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
    skintone: str

class RecRequest(BaseModel):
    userData: UserData
    prodData: List[Product]

# --------------- Color Mappings ----------------
color_to_group = {
    "black": "dark", "charcoal": "dark", "white": "light", "beige": "light",
    "navy": "cool", "skyblue": "cool", "mustard": "warm", "coral": "warm",
    "red": "warm", "emerald": "cool", "burgundy": "dark", "lavender": "cool",
    "yellow": "bright", "orange": "bright", "pastel pink": "bright", "denim": "cool"
}

skintone_to_color_group = {
    "light": ["dark", "cool"],
    "mid-light": ["warm", "neutral"],
    "mid-dark": ["light", "warm"],
    "dark": ["light", "bright"]
}

def get_color_group(colors: List[str]) -> str:
    if not colors:
        return "neutral"
    color = colors[0].lower()
    return color_to_group.get(color, "neutral")

def build_text_representation(prod: Product) -> str:
    color_group = get_color_group(prod.colors)
    return f"{prod.name} {color_group} {prod.fitType} {prod.gender} {prod.ageRange} {prod.material} {' '.join(prod.styleTags)}"

@router.post("/recommend")
async def recommend_clothes(request: RecRequest):
    user = request.userData
    products = request.prodData

    if not products:
        return {"success": False, "recommendations": [], "explanations": ["No products available."]}

    # Step 1: Vectorize product descriptions
    product_texts = [build_text_representation(p) for p in products]
    vectorizer = TfidfVectorizer()
    product_vectors = vectorizer.fit_transform(product_texts)

    # Step 2: Build user profile vector
    liked_products = [p for p in products if p.id in user.positiveProductIds]
    if liked_products:
        liked_texts = [build_text_representation(p) for p in liked_products]
        user_vector = vectorizer.transform([" ".join(liked_texts)])
        explanation = ["Used liked products for personalization."]
    else:
        preferred_groups = skintone_to_color_group.get(user.skintone.lower(), [])
        fallback_texts = [f"{grp} {user.fitType} {user.gender} {user.ageRange} {' '.join(user.preferredStyle)}" for grp in preferred_groups]
        user_vector = vectorizer.transform([" ".join(fallback_texts)])
        explanation = ["Used skintone and preferences due to no liked products."]

    # Step 3: Similarity calculation
    similarity_scores = cosine_similarity(user_vector, product_vectors).flatten()

    # Step 4: Top-N recommendations
    top_indices = similarity_scores.argsort()[::-1][:10]
    recommendations = [products[i] for i in top_indices]

    return {
        "success": True,
        "recommendations": recommendations,
        "explanations": explanation
    }
