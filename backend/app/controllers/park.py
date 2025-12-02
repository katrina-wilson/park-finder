from sqlalchemy.orm import Session
from app.models.park import Park
from fastapi import HTTPException
from app.utils.similarity import get_cosine_similarities
from uuid import UUID

def get_all_parks(db: Session):
    return db.query(Park).all()

def get_similar_parks(park_id: UUID, limit: int, db: Session):
    target_park = db.query(Park).filter(Park.id == park_id).first()
    if not target_park: 
        raise HTTPException(status_code=404, detail="Park not found")

    all_parks = db.query(Park).filter(Park.id != park_id).all()
    if not all_parks:
        return []
    
    similar_parks_df = get_cosine_similarities(all_parks=all_parks, target_park=target_park, limit=limit)
    
    return

    
