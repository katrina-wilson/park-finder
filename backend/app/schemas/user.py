from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr

    class Config:
        orm_mode = True

class UserCreateOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    token: str

    class Config:
        orm_mode = True

class LoginSchema(BaseModel):
    email: EmailStr
    password: str
