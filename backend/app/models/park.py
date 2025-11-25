from pydantic import BaseModel
from typing import List, Optional

class Park(BaseModel):
    id: str
    name: str
    address: Optional[str]
    lat: float
    lon: float
    website: Optional[str]
    size_acres: float
    trail_length: float
    amenities: List[str]