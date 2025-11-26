from sqlalchemy.orm import Session
from app.models.park import Park

def get_all_parks(db: Session):
    return db.query(Park).all()

