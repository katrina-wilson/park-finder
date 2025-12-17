from sqlalchemy.orm import Session
from app.models.visited_park import VisitedPark

def mark_park_visited(
    db: Session,
    user_id: int,
    park_id: int,
    rating: int | None = None,
    review: str | None = None,
):
    visited = (
        db.query(VisitedPark)
        .filter_by(user_id=user_id, park_id=park_id)
        .first()
    )

    if visited:
        visited.rating = rating
        visited.review = review
    else:
        visited = VisitedPark(
            user_id=user_id,
            park_id=park_id,
            rating=rating,
            review=review,
        )
        db.add(visited)

    db.commit()
    db.refresh(visited)
    return visited
