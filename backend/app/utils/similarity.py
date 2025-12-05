import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics.pairwise import cosine_similarity


AMENITY_LIST = [
    "active_adult",
    "ada_comply",
    "ada_parking",
    "amusement_train",
    "arts_center",
    "ball_fields",
    "outdoor_basketball",
    "biking",
    "bmx_track",
    "bocce",
    "boating",
    "boat_ride",
    "boat_rental",
    "camping",
    "canoe",
    "carousel",
    "community_center",
    "computer_lab",
    "dance_studio",
    "disc_golf",
    "docks",
    "dog_park",
    "environmental_center",
    "equestrian",
    "fishing",
    "fitness",
    "gardens",
    "greenway_access",
    "grill",
    "gym",
    "handball",
    "horseshoe",
    "inline_skating",
    "kitchen",
    "library",
    "lights",
    "live_animals",
    "mountain_bike_trails",
    "meeting_room",
    "multipurpose_field",
    "museum",
    "parking_lot",
    "performance_space",
    "picnic_tables",
    "shelter",
    "playground",
    "pool",
    "restrooms",
    "sand_volleyball",
    "skate_park",
    "soccer",
    "sprayground",
    "swings",
    "teen",
    "tennis_courts",
    "theater",
    "track",
    "walking_trails",
    "water_fountain"
]

TYPE_LIST = [
    "Neighborhood",
    "Open Space",
    "Nature Preserve",
    "Mini",
    "Community",
    "Metro",
    "Special",
    "Greenway"
]

FEATURE_WEIGHTS = {
    "size_acres": 0.2,
    "type": 0.3,
    "amenities": 0.3,
    "location": 0.2
}


def vectorize_park(park):
    size_location_list = [(park.size_acres or 0), (park.lat or 0), (park.lon or 0)]
    type_list = [1 if park.type == t else 0 for t in TYPE_LIST]
    amenity_list = [1 if a in (park.amenities or []) else 0 for a in AMENITY_LIST]

    park_series = pd.Series(data=(size_location_list + type_list + amenity_list), index=(["size_acres", "lat", "lon"] + TYPE_LIST + AMENITY_LIST))

    return park_series


def scale_size_location(df: pd.DataFrame, scaler: MinMaxScaler = None):
    if scaler is None:
        scaler = MinMaxScaler()
        df[["size_acres", "lat", "lon"]] = scaler.fit_transform(df[["size_acres", "lat", "lon"]])
        return df, scaler
    else:
        df[["size_acres", "lat", "lon"]] = scaler.transform(df[["size_acres", "lat", "lon"]])
        return df


def apply_weights(df: pd.DataFrame):
    weight_map = {
        "size_acres": FEATURE_WEIGHTS["size_acres"],
        "lat": FEATURE_WEIGHTS["location"],
        "lon": FEATURE_WEIGHTS["location"],
    }

    for type in TYPE_LIST:
        weight_map[type] = FEATURE_WEIGHTS["type"]
    for amenity in AMENITY_LIST:
        weight_map[amenity] = FEATURE_WEIGHTS["amenities"]

    weighted_df = df.mul(weight_map)
    return weighted_df


def get_cosine_similarities(all_parks, target_park, limit: int = 5):
    
    series_rows = [vectorize_park(park) for park in all_parks]
    series_target = [vectorize_park(target_park)]

    df = pd.DataFrame(data=series_rows, index=[str(park.id) for park in all_parks])
    df_target = pd.DataFrame(data=series_target, index=[str(target_park.id)])

    # Scale numerical columns for better comparison   
    scaled_df, scaler = scale_size_location(df)
    scaled_df_target = scale_size_location(df_target.copy(), scaler)

    weighted_scaled_df = apply_weights(scaled_df)
    weighted_scaled_df_target = apply_weights(scaled_df_target)

    weighted_scaled_df.index = weighted_scaled_df.index.astype(str)
    weighted_scaled_df_target.index = weighted_scaled_df_target.index.astype(str)

    target_park_row = weighted_scaled_df_target.loc[str(target_park.id)].values.reshape(1, -1)
    
    similarity = cosine_similarity(X=weighted_scaled_df.values, Y=target_park_row).ravel()

    result = pd.DataFrame({
        "park_id": [str(p.id) for p in all_parks],
        "similarity_score": similarity
    }).sort_values("similarity_score", ascending=False).head(limit)

    return result
