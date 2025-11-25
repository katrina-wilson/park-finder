from fastapi import FastAPI, HTTPException
from fastapi.encoders import jsonable_encoder
from .utils import load_cleaned_parks, get_similar_parks
import pandas as pd

app = FastAPI()
parks, similarity_matrix = load_cleaned_parks()

@app.get("/")  # Root endpoint
def root():
    return {"message": "Park Finder API is running!"}

def _decode_bytes_in_df(df: pd.DataFrame) -> pd.DataFrame:
    if df.empty:
        return df

    def _decode(v):
        if isinstance(v, (bytes, bytearray)):
            return v.decode("utf-8", errors="replace")
        return v

    out = df.copy()
    for col in out.select_dtypes(include=[object]).columns:
        out[col] = out[col].apply(_decode)
    return out


def _sanitize_value(v):
    try:
        if pd.isna(v):
            return None
    except Exception:
        pass

    if isinstance(v, (bytes, bytearray)):
        return v.decode("utf-8", errors="replace")

    if isinstance(v, (str, bool, int, float)):
        return v

    try:
        import numpy as _np

        if isinstance(v, _np.generic):
            return v.item()
    except Exception:
        pass

    if isinstance(v, pd.Series):
        return {str(k): _sanitize_value(val) for k, val in v.to_dict().items()}
    if isinstance(v, pd.DataFrame):
        return [_sanitize_value(r) for r in v.to_dict(orient="records")]

    if isinstance(v, (list, tuple)):
        return [_sanitize_value(x) for x in v]
    if isinstance(v, dict):
        return {str(k): _sanitize_value(val) for k, val in v.items()}

    try:
        return v if isinstance(v, (str, int, float, bool)) else str(v)
    except Exception:
        return str(type(v))


@app.get("/parks")
def list_parks():
    safe = _decode_bytes_in_df(parks)
    records = safe.to_dict(orient="records")
    sanitized = [{str(k): _sanitize_value(v) for k, v in rec.items()} for rec in records]
    return jsonable_encoder(sanitized)


@app.get("/parks/{park_id}")
def park_detail(park_id: str):
    park = parks[parks["id"] == park_id]
    if park.empty:
        raise HTTPException(status_code=404, detail="Park not found")
    safe = _decode_bytes_in_df(park)
    rec = safe.to_dict(orient="records")[0]
    sanitized = {str(k): _sanitize_value(v) for k, v in rec.items()}
    return jsonable_encoder(sanitized)

@app.get("/parks/{park_id}/recommendations")
def park_recommendations(park_id: str, top_n: int = 5):
    try:
        similar = get_similar_parks(park_id, parks, similarity_matrix, top_n)
        safe = _decode_bytes_in_df(similar)
        records = safe.to_dict(orient="records")
        sanitized = [{str(k): _sanitize_value(v) for k, v in rec.items()} for rec in records]
        return jsonable_encoder(sanitized)
    except ValueError:
        raise HTTPException(status_code=404, detail="Park not found")
