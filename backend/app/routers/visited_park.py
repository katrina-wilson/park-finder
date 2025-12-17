from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import get_db
from app.schemas.visited_park import VisitedParkCreate, VisitedParkUpdate, VisitedParkOut
from app.controllers import visited_park as visited_park_controller
from app.controllers.user import get_current_user


router = APIRouter(prefix="/visited-parks", tags=["Visited Parks"])

@router.post("/", response_model=VisitedParkOut)
def visit_park(
    payload: VisitedParkCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    return visited_park_controller.mark_park_visited(
        db=db,
        user_id=current_user.id,
        park_id=payload.park_id,
        rating=payload.rating,
        review=payload.review,
    )


@router.put("/{park_id}", response_model=VisitedParkOut)
def update_visit(
    park_id: str,
    payload: VisitedParkUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    return visited_park_controller.mark_park_visited(
        db=db,
        user_id=str(current_user.id),
        park_id=str(park_id),
        rating=payload.rating,
        review=payload.review,
    )
