from app.db import engine, SessionLocal
from app.models.base import Base
from sqlalchemy.orm import Session
import pandas as pd
from app.models.park import Park
import numpy as np


CLEANED_DATA = "data/cleaned/parks.parquet"

def sanitize_row(row_dict):
    for k, v in row_dict.items():
        if isinstance(v, float) and np.isnan(v):
            row_dict[k] = None
            print("NOT A NUM", v, row_dict[k])
    return row_dict


def load_parks_to_db():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    # db.query(Park).delete()
    # db.commit()

    df = pd.read_parquet(CLEANED_DATA)

    for idx, row in df.iterrows():
        clean_row = sanitize_row(row.to_dict())
        if clean_row['name'] == 'American Tobacco Trail - New Hill Entrance':
            print("clean row::", clean_row)
        park = Park(**clean_row)
        db.add(park)

    db.commit()


if __name__ == "__main__":
    load_parks_to_db()