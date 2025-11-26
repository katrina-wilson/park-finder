from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.park import ParkBase
from app.controllers import park as park_controller
from app.db import get_db
from typing import List


router = APIRouter(prefix="/parks", tags=["parks"])


@router.get("/", response_model=List[ParkBase])
def get_all_parks(db: Session = Depends(get_db)):
    return park_controller.get_all_parks(db)