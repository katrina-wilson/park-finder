from typing import List
from sqlalchemy.orm import Session
from app.models.park import Park
from app.schemas.park import ParkBase, ParkSimilarityResponse
from fastapi import HTTPException
from app.utils.similarity import get_cosine_similarities
from uuid import UUID

def get_all_parks(db: Session) -> List[ParkBase]:
    return db.query(Park).all()

def get_similar_parks(park_id: UUID, limit: int, db: Session) -> List[ParkSimilarityResponse]:
    target_park = db.query(Park).filter(Park.id == park_id).first()
    if not target_park: 
        raise HTTPException(status_code=404, detail="Park not found")

    all_parks = db.query(Park).all()
    if not all_parks:
        return []
    
    similar_parks_df = get_cosine_similarities(all_parks=all_parks, target_park=target_park, limit=limit)
    
    similar_parks_ids = [UUID(top_park_id) for top_park_id in similar_parks_df['park_id'].tolist()]
    similar_parks = db.query(Park).filter(Park.id.in_(similar_parks_ids)).all()

    id_to_park = {p.id: p for p in similar_parks}
    
    print("id to park", id_to_park)
    print("similarity", similar_parks_df)


    result = []
    for id, val in id_to_park.items():
        park_col = similar_parks_df.loc[similar_parks_df["park_id"] == str(id)]
        park_similarity_score = float(park_col['similarity_score'].values[0])

        print("PARK COLL sim\n", park_col)
        print("similarity score\n", park_similarity_score)

        park_similarity = ParkSimilarityResponse.model_validate(val)
        park_similarity.similarity_score = park_similarity_score

        print("PARK SIMILARITY\n", park_similarity)

        result.append(park_similarity)

    return result


    
