from sqlalchemy import Column, String, Float
from sqlalchemy.dialects.postgresql import UUID, ARRAY
import uuid
from app.models.base import Base


class Park(Base):
    __tablename__ = "parks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    type = Column(String, nullable=True)
    address = Column(String, nullable=True)
    lat = Column(Float, nullable=True)
    lon = Column(Float, nullable=True)
    website = Column(String, nullable=True)
    size_acres = Column(Float, nullable=True)
    amenities = Column(ARRAY(String), default=list)
