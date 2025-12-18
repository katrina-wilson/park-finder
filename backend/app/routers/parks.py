from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.park import ParkBase, ParkSimilarityResponse, ParkUserInfoOut
from app.controllers import park as park_controller
from app.db import get_db
from typing import List
from uuid import UUID


router = APIRouter(prefix="/parks", tags=["parks"])


@router.get("/", response_model=List[ParkBase])
def get_all_parks(db: Session = Depends(get_db)):
    return park_controller.get_all_parks(db)


@router.get("/with-user-info/{user_id}", response_model=List[ParkUserInfoOut])
def get_all_parks_with_user_info(user_id: UUID, db: Session = Depends(get_db)):
    return park_controller.get_all_parks_with_user_info(user_id, db)


@router.get("/{park_id}", response_model=ParkBase)
def get_park_by_id_with_user_info(park_id: UUID, db: Session = Depends(get_db)):
    return park_controller.get_park_by_id(park_id, db)


@router.get("/{park_id}/with-user-info/{user_id}", response_model=ParkUserInfoOut)
def get_park_by_id_with_user_info(park_id: UUID, user_id: UUID, db: Session = Depends(get_db)):
    return park_controller.get_park_by_id_with_user_info(park_id, user_id, db)


@router.get("/{park_id}/similar", response_model=List[ParkSimilarityResponse])
def get_similar_parks(park_id: UUID, limit: int = 5, db: Session = Depends(get_db)):
    return park_controller.get_similar_parks(park_id, limit, db)