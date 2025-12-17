from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.controllers import user as user_controller
from app.db import get_db
from fastapi import HTTPException


router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/token")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    try:
        return user_controller.login_user(
            db=db,
            email=form_data.username,
            password=form_data.password
        )
    except HTTPException:
        raise HTTPException(status_code=401, detail="Incorrect email or password.")