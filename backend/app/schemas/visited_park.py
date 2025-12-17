from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from uuid import UUID


class VisitedParkCreate(BaseModel):
    park_id: str
    rating: Optional[int] = Field(None, ge=1, le=5)
    review: Optional[str]

class VisitedParkUpdate(BaseModel):
    rating: Optional[int] = Field(None, ge=1, le=5)
    review: Optional[str]

class VisitedParkOut(BaseModel):
    id: UUID
    park_id: UUID
    rating: Optional[int]
    review: Optional[str]
    visited_at: datetime

    class Config:
        from_attributes = True
