from sqlalchemy import Column, Integer, ForeignKey, Text, DateTime, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.models.base import Base
import uuid


class VisitedPark(Base):
    __tablename__ = "visited_parks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    park_id = Column(UUID(as_uuid=True), ForeignKey("parks.id", ondelete="CASCADE"), nullable=False)

    rating = Column(Integer, nullable=True)
    review = Column(Text, nullable=True)

    visited_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="visited_parks")
    park = relationship("Park", back_populates="visited_by")

    __table_args__ = (
        UniqueConstraint("user_id", "park_id", name="uq_user_park_visit"),
    )
