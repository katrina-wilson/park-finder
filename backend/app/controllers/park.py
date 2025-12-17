from typing import List
from sqlalchemy.orm import Session
from app.models.park import Park
from app.models.visited_park import VisitedPark
from app.schemas.park import ParkBase, ParkSimilarityResponse, ParkUserInfoOut
from fastapi import HTTPException
from app.utils.similarity import get_cosine_similarities
from uuid import UUID

def get_all_parks(db: Session) -> List[ParkBase]:
    return db.query(Park).all()


def get_all_parks_with_user_info(user_id: UUID, db: Session) -> List[ParkUserInfoOut]:
    parks = db.query(Park).all()
    
    visited_parks = db.query(VisitedPark).filter(VisitedPark.user_id == user_id).all()
    visited_parks_dict = {vp.park_id: vp for vp in visited_parks}

    result = []
    for park in parks:
        park_out = ParkUserInfoOut.model_validate(park)
        vp = visited_parks_dict.get(park.id)
        
        park_out.visited_at = getattr(vp, "visited_at", None)
        park_out.updated_at = getattr(vp, "updated_at", None)
        park_out.rating = getattr(vp, "rating", None)
        park_out.review = getattr(vp, "review", None)

        result.append(park_out)

    return result

def get_similar_parks(park_id: UUID, limit: int, db: Session) -> List[ParkSimilarityResponse]:
    target_park = db.query(Park).filter(Park.id == park_id).first()
    if not target_park: 
        raise HTTPException(status_code=404, detail="Park not found")

    all_parks = db.query(Park).filter(Park.id != park_id).all()
    if not all_parks:
        return []
    
    similar_parks_df = get_cosine_similarities(all_parks=all_parks, target_park=target_park, limit=limit)
    
    similar_parks_ids = [UUID(top_park_id) for top_park_id in similar_parks_df['park_id'].tolist()]
    similar_parks = db.query(Park).filter(Park.id.in_(similar_parks_ids)).all()

    id_to_park = {p.id: p for p in similar_parks}

    result = []
    for id, val in id_to_park.items():
        park_col = similar_parks_df.loc[similar_parks_df["park_id"] == str(id)]
        park_similarity_score = float(park_col['similarity_score'].values[0])

        park_similarity = ParkSimilarityResponse.model_validate(val)
        park_similarity.similarity_score = park_similarity_score

        result.append(park_similarity)

    

    return result


    
