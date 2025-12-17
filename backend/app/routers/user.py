from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate, UserCreateLoginOut, UserOut
from app.controllers import user as user_controller
from app.db import get_db
from fastapi import HTTPException


router = APIRouter(prefix="/users", tags=["users"])

@router.get("/current", response_model=UserOut)
def read_current_user(current_user = Depends(user_controller.get_current_user)):
    return current_user

@router.post('/create', response_model=UserCreateLoginOut)
def create_new_user(user: UserCreate, db: Session = Depends(get_db)):
    is_existing = db.query(User).filter(User.email == user.email).first()
    if is_existing:
        raise HTTPException(status_code=400, detail="Email already exists")
    
    return user_controller.create_new_user(user, db)

