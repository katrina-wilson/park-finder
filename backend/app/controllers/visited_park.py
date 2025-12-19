from sqlalchemy.orm import Session
from app.models.visited_park import VisitedPark
from datetime import datetime, timezone

def mark_park_visited(
    db: Session,
    user_id: str,
    park_id: str,
    rating: int | None = None,
    review: str | None = None,
    visited_date: datetime | None = None,
):
    visit = (
        db.query(VisitedPark)
        .filter_by(user_id=user_id, park_id=park_id)
        .first()
    )

    if not visit:
        visit = VisitedPark(
            user_id=user_id,
            park_id=park_id,
        )
        db.add(visit)

    if visited_date:
        visit.visited_date = visited_date

    if rating is not None:
        visit.rating = rating

    if review is not None:
        visit.review = review

    visit.updated_date = datetime.now(timezone.utc)

    db.commit()
    db.refresh(visit)
    return visit
