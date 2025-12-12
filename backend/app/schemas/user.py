from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserOut(BaseModel):
    id: str
    name: str
    email: EmailStr

    class Config:
        orm_mode = True

class UserCreateLoginOut(BaseModel):
    id: str
    name: str
    email: EmailStr
    token: str

    class Config:
        orm_mode = True
