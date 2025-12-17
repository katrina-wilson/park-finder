from sqlalchemy import Column, String, Float
from sqlalchemy.dialects.postgresql import UUID, ARRAY
import uuid
from sqlalchemy.orm import relationship
from app.models.base import Base


class Park(Base):
    __tablename__ = "parks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    cover_image = Column(String, nullable=True)
    description = Column(String, nullable=True)
    type = Column(String, nullable=True)
    address = Column(String, nullable=True)
    lat = Column(Float, nullable=True)
    lon = Column(Float, nullable=True)
    website = Column(String, nullable=True)
    size_acres = Column(Float, nullable=True)
    amenities = Column(ARRAY(String), default=list)

    visited_by = relationship(
        "VisitedPark",
        back_populates="park",
        cascade="all, delete-orphan"
    )