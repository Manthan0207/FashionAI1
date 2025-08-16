# from fastapi import APIRouter
# from pydantic import BaseModel, Field
# from typing import List
# from sklearn.feature_extraction.text import TfidfVectorizer
# from sklearn.metrics.pairwise import cosine_similarity
# import numpy as np

# router = APIRouter()

# # --------------- Models ----------------
# class Product(BaseModel):
#     id: str
#     name: str
#     styleTags: List[str] = Field(default_factory=list)
#     colors: List[str] = Field(default_factory=list)
#     fitType: str
#     gender: str
#     ageRange: str
#     material: str
#     price: float

# class UserData(BaseModel):
#     gender: str
#     ageRange: str
#     preferredStyle: List[str]
#     favoriteColors: List[str]
#     fitType: str
#     bodyType: str
#     positiveProductIds: List[str] = Field(default_factory=list)
#     skintone: str

# class RecRequest(BaseModel):
#     userData: UserData
#     prodData: List[Product]

# # --------------- Color Mappings ----------------
# color_to_group = {
#     "black": "dark", "charcoal": "dark", "white": "light", "beige": "light",
#     "navy": "cool", "skyblue": "cool", "mustard": "warm", "coral": "warm",
#     "red": "warm", "emerald": "cool", "burgundy": "dark", "lavender": "cool",
#     "yellow": "bright", "orange": "bright", "pastel pink": "bright", "denim": "cool"
# }

# skintone_to_color_group = {
#     "light": ["dark", "cool"],
#     "mid-light": ["warm", "neutral"],
#     "mid-dark": ["light", "warm"],
#     "dark": ["light", "bright"]
# }

# def get_color_group(colors: List[str]) -> str:
#     if not colors:
#         return "neutral"
#     color = colors[0].lower()
#     return color_to_group.get(color, "neutral")

# def build_text_representation(prod: Product) -> str:
#     color_group = get_color_group(prod.colors)
#     return f"{prod.name} {color_group} {prod.fitType} {prod.gender} {prod.ageRange} {prod.material} {' '.join(prod.styleTags)}"

# @router.post("/recommend")
# async def recommend_clothes(request: RecRequest):
#     user = request.userData
#     products = request.prodData

#     if not products:
#         return {"success": False, "recommendations": [], "explanations": ["No products available."]}

#     # Step 1: Vectorize product descriptions
#     product_texts = [build_text_representation(p) for p in products]
#     vectorizer = TfidfVectorizer()
#     product_vectors = vectorizer.fit_transform(product_texts)

#     # Step 2: Build user profile vector
#     liked_products = [p for p in products if p.id in user.positiveProductIds]
#     if liked_products:
#         liked_texts = [build_text_representation(p) for p in liked_products]
#         user_vector = vectorizer.transform([" ".join(liked_texts)])
#         explanation = ["Used liked products for personalization."]
#     else:
#         preferred_groups = skintone_to_color_group.get(user.skintone.lower(), [])
#         fallback_texts = [f"{grp} {user.fitType} {user.gender} {user.ageRange} {' '.join(user.preferredStyle)}" for grp in preferred_groups]
#         user_vector = vectorizer.transform([" ".join(fallback_texts)])
#         explanation = ["Used skintone and preferences due to no liked products."]

#     # Step 3: Similarity calculation
#     similarity_scores = cosine_similarity(user_vector, product_vectors).flatten()

#     # Step 4: Top-N recommendations
#     top_indices = similarity_scores.argsort()[::-1][:10]
#     recommendations = [products[i] for i in top_indices]

#     return {
#         "success": True,
#         "recommendations": recommendations,
#         "explanations": explanation
#     }

from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import List
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from datetime import datetime
import math

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
    totalSales: int = 0
    reviews: List[dict] = Field(default_factory=list)

class UserData(BaseModel):
    gender: str
    ageRange: str
    preferredStyle: List[str]
    favoriteColors: List[str]
    fitType: str
    bodyType: str
    positiveProductIds: List[str] = Field(default_factory=list)
    skintone: str
    wishlist: List[str] = Field(default_factory=list)

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

# --------------- Core Functions ----------------
def get_color_groups(colors: List[str]) -> List[str]:
    groups = set()
    for color in colors:
        group = color_to_group.get(color.lower(), "neutral")
        groups.add(group)
    return list(groups)

def build_text_representation(prod: Product) -> str:
    color_groups = get_color_groups(prod.colors)
    return f"{prod.name} {' '.join(color_groups)} {prod.fitType} {prod.gender} {prod.ageRange} {prod.material} {' '.join(prod.styleTags)}"

def calculate_popularity(prod: Product) -> float:
    """Calculate popularity score (0-1) based on sales and reviews"""
    sales_score = math.log1p(prod.totalSales) / 10.0
    
    if prod.reviews:
        avg_rating = sum(r['rating'] for r in prod.reviews) / len(prod.reviews)
        review_score = avg_rating / 5.0
    else:
        review_score = 0.5
        
    return min(1.0, sales_score + review_score)

@router.post("/recommend")
async def recommend_clothes(request: RecRequest):
    user = request.userData
    products = request.prodData

    if not products:
        return {"success": False, "recommendations": [], "message": "No products available"}

    try:
        product_texts = [build_text_representation(p) for p in products]
        
        vectorizer = TfidfVectorizer()
        product_vectors = vectorizer.fit_transform(product_texts)
        
        profile_parts = [
            user.bodyType,
            user.fitType,
            user.gender,
            user.ageRange,
            *skintone_to_color_group.get(user.skintone.lower(), []),
            *user.preferredStyle,
            *user.favoriteColors
        ]
        
        liked_products = [p for p in products if p.id in user.positiveProductIds]
        if liked_products:
            profile_parts.extend([build_text_representation(p) for p in liked_products])
        
        wishlist_products = [p for p in products if p.id in user.wishlist]
        if wishlist_products:
            profile_parts.extend([build_text_representation(p) for p in wishlist_products])
        
        user_text = " ".join(profile_parts)
        user_vector = vectorizer.transform([user_text])
        
        similarity_scores = cosine_similarity(user_vector, product_vectors).flatten()
        
       
        combined_scores = []
        for i, score in enumerate(similarity_scores):
            popularity = calculate_popularity(products[i])
            combined = (0.8 * score) + (0.2 * popularity)
            combined_scores.append(combined)
        
        
        top_indices = np.argsort(combined_scores)[::-1][:10]
        recommendations = [products[i] for i in top_indices]
        
        return {
            "success": True,
            "recommendations": recommendations,
            "message": f"Found {len(recommendations)} recommendations"
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "message": "Recommendation failed"
        }