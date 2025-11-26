from pydantic import BaseModel
from uuid import UUID
from typing import List, Optional

class ParkBase(BaseModel):
    id: UUID
    name: str
    type: Optional[str] = None
    address: Optional[str] = None
    lat: Optional[float] = None
    lon: Optional[float] = None
    website: Optional[str] = None
    size_acres: Optional[float] = None
    amenities: List[str] = []

    class Config:
        orm_mode = True