from typing import List
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserOut, UserCreate, UserCreateOut
from fastapi.security import OAuth2PasswordBearer
import jwt
from pwdlib import PasswordHash
from datetime import datetime, timedelta, timezone

SECRET_KEY = "d2ce1a0050768b6bbe1447f06ae482b6c42b1c2ccdfa547302b542041f021e88"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pw_hash = PasswordHash.recommended()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Helpers
def verify_password(plain_password, hashed_password):
    return pw_hash.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pw_hash.hash(password)


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


# Controllers
def get_all_users(db: Session) -> List[UserOut]:
    return db.query(User).all()


def create_new_user(user: UserCreate, db: Session) -> UserCreateOut:
    hashed_password = get_password_hash(user.password)
    new_user = User(name=user.name, email=user.email, password_hash=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token({"id": str(new_user.id)})
    return UserCreateOut(
        id=str(new_user.id),
        name=new_user.name,
        email=new_user.email,
        token=token
    )
