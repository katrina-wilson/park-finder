import os
import uuid
import pickle
import pandas as pd
import geopandas as gpd
from sklearn.metrics.pairwise import cosine_similarity


OUT_GEOJSON = "backend/data/cleaned/parks_cleaned.geojson"
OUT_CSV = "backend/data/cleaned/parks_cleaned.csv"
OUT_PARQUET = "backend/data/cleaned/parks.parquet"
OUT_SIMILARITY = "backend/data/cleaned/similarity.pkl"

RAW_FILES = [
    "backend/data/raw/raleigh_parks.geojson",
    "backend/data/raw/wake_county_parks.geojson",
    "backend/data/raw/durham_parks.geojson",
]

FIELD_RENAME_MAP = {
    "NAME": "name",
    "PARK_TYPE": "type",
    "ADDRESS": "address",
    "FULLADDR": "address",
    "LAT": "lat",
    "Lat": "lat",
    "LON": "lon",
    "Lon": "lon",
    "WEBSITE": "website",
    "URL": "website",
    "PARKURL": "website",
    "MAP_ACRES": "size_acres",
    "PARKACRES": "size_acres",
    "amenities": "amenities",
}

AMENITY_RENAME_MAP = {
    "ACTIVE_ADULT": "active_adult",
    "ADACOMPLY": "ada_comply",
    "ADAPARKING": "ada_parking",
    "AMUSEMENTTRAIN": "amusement_train",
    "ARTSCENTER": "arts_center",
    "BALLFIELDS": "ball_fields",
    "BASEBALL": "ball_fields",
    "BASKETBALL": "outdoor_basketball",
    "BIKING": "biking",
    "BMXTRACK": "bmx_track",
    "BOCCE": "bocce",
    "BOATING": "boating",
    "BOATRIDE": "boat_ride",
    "BOATRENTAL": "boat_rental",
    "CAMPING": "camping",
    "CANOE": "canoe",
    "CAROUSEL": "carousel",
    "COMMUNITYCENTER": "community_center",
    "COMPULAB": "computer_lab",
    "DANCESTUD": "dance_studio",
    "DISCGOLF": "disc_golf",
    "DOCKS": "docks",
    "DOGPARK": "dog_park",
    "ENVCTR": "environmental_center",
    "EQUESTRIAN": "equestrian",
    "FISHING": "fishing",
    "FITNESS": "fitness",
    "GARDENS": "gardens",
    "GREENWAYACCESS": "greenway_access",
    "GRILL": "grill",
    "GYM": "gym",
    "GYMNASIUM": "gym",
    "HANDBALL": "handball",
    "HORSESHOE": "horseshoe",
    "INLINESKATING": "inline_skating",
    "KITCHEN": "kitchen",
    "LIBRARY": "library",
    "LIGHTS": "lights",
    "LIVEANIMALS": "live_animals",
    "MTBCYCLE": "mountain_bike_trails",
    "MTGROOM": "meeting_room",
    "MULTIPURPOSEFIELD": "multipurpose_field",
    "MULITPURPOSE": "multipurpose_field",
    "MUSEUM": "museum",
    "NEIGHBORHOODCENTER": "community_center",
    "OUTDOORBASKETBALL": "outdoor_basketball",
    "PARKINGLOT": "parking_lot",
    "PERFSPACE": "performance_space",
    "PICNICTABLES": "picnic_tables",
    "PICNICSHELTER": "shelter",
    "PLAYGROUND": "playground",
    "POOL": "pool",
    "RESTROOM": "restrooms",
    "RESTROOMS": "restrooms",
    "SANDVOLLEYBALL": "sand_volleyball",
    "SHELTER": "shelter",
    "SKATEPARK": "skate_park",
    "SOCCER": "soccer",
    "SOFTBALL": "ball_fields",
    "SPRAYGROUND": "sprayground",
    "SWINGS": "swings",
    "TEEN": "teen",
    "TENNIS": "tennis_courts",
    "TENNISCENTER": "tennis_courts",
    "TENNISCOURTS": "tennis_courts",
    "THEATER": "theater",
    "TRACK": "track",
    "TRAIL": "walking_trails",
    "WALKINGTRAILS": "walking_trails",
    "WATERFTN": "water_fountain",
    "YOUTBASEB": "ball_fields",
}

WEIGHTS = {
    "lat": 0.1,
    "lon": 0.1,
    "size_acres": 0.5,
    "trail_length": 0.5,
    "amenity": 2.0,
    "type": 1.0
}


def process_data(files):
    all_gdfs = []

    for file in files:
        gdf = gpd.read_file(file)
        gdf = gdf.rename(columns=FIELD_RENAME_MAP)

        amenities_cols = [col for col in gdf.columns if col in AMENITY_RENAME_MAP]
        gdf['amenities'] = gdf.apply(
            lambda row: [AMENITY_RENAME_MAP[col] for col in amenities_cols if str(row.get(col)).strip().upper() == "YES"],
            axis=1
        )

        allowed_columns = list(FIELD_RENAME_MAP.values()) + ['geometry']
        gdf = gdf[[col for col in gdf.columns if col in allowed_columns]]

        all_gdfs.append(gdf)

    if all_gdfs:
        return pd.concat(all_gdfs, ignore_index=True)
    return gpd.GeoDataFrame()


def prepare_cosine_similarity(processed):
    all_amenities = sorted({amenity for row in processed["amenities"] for amenity in row})
    for amenity in all_amenities:
        processed[f"amenity_{amenity}"] = processed["amenities"].apply(lambda x: 1 if amenity in x else 0)

    processed = pd.get_dummies(processed, columns=["type"], prefix="type")

    processed["size_acres"] = processed["size_acres"].fillna(0)
    processed["lat"] = processed["lat"].fillna(0)
    processed["lon"] = processed["lon"].fillna(0)
    if "trail_length" not in processed.columns:
        processed["trail_length"] = 0
    else:
        processed["trail_length"] = processed["trail_length"].fillna(0)

    return processed


def compute_similarity(processed):
    lat_lon_cols = ["lat", "lon"]
    numeric_cols = ["size_acres", "trail_length"]
    amenity_cols = [col for col in processed.columns if col.startswith("amenity_")]
    type_cols = [col for col in processed.columns if col.startswith("type_")]

    similarity_df = processed[lat_lon_cols + numeric_cols + amenity_cols + type_cols].copy()

    for col in lat_lon_cols:
        similarity_df[col] *= WEIGHTS["lat"]
    for col in numeric_cols:
        similarity_df[col] *= WEIGHTS["size_acres"]
    for col in amenity_cols:
        similarity_df[col] *= WEIGHTS["amenity"]
    for col in type_cols:
        similarity_df[col] *= WEIGHTS["type"]

    similarity_df = similarity_df.values
    similarity_matrix = cosine_similarity(similarity_df)
    return similarity_matrix


def elt_data():
    processed = process_data(RAW_FILES)

    # Add UUID and remove duplicate parks
    processed["id"] = processed.apply(lambda _: str(uuid.uuid4()), axis=1)
    processed = processed.drop_duplicates(subset=["name", "lat", "lon"], keep="last")

    processed = prepare_cosine_similarity(processed)

    os.makedirs(os.path.dirname(OUT_GEOJSON), exist_ok=True)
    processed.to_file(OUT_GEOJSON, driver="GeoJSON")
    processed.drop(columns="geometry", errors="ignore").to_csv(OUT_CSV, index=False)
    processed.to_parquet(OUT_PARQUET, index=False)

    print(f"Saved cleaned data to {OUT_GEOJSON}, {OUT_CSV}, and {OUT_PARQUET}")

    similarity_matrix = compute_similarity(processed)

    os.makedirs(os.path.dirname(OUT_SIMILARITY), exist_ok=True)
    with open(OUT_SIMILARITY, "wb") as f:
        pickle.dump(similarity_matrix, f)

    print(f"ETL complete. Cosine similarity saved to {OUT_SIMILARITY}")


if __name__ == "__main__":
    elt_data()
