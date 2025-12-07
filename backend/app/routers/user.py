from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserOut, UserCreate, UserCreateOut
from app.controllers import user as user_controller
from app.db import get_db
from typing import List
from uuid import UUID
from fastapi import HTTPException


router = APIRouter(prefix="/users", tags=["users"])


@router.post('/create', response_model=UserCreateOut)
def create_new_user(user: UserCreate, db: Session = Depends(get_db)):
    is_existing = db.query(User).filter(User.email == user.email).first()
    if is_existing:
        raise HTTPException(status_code=400, detail="Email already exists")
    
    user = user_controller.create_new_user(user)
    return