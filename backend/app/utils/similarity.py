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
    "multipurpose_field",
    "museum",
    "community_center",
    "outdoor_basketball",
    "parking_lot",
    "performance_space",
    "picnic_tables",
    "shelter",
    "playground",
    "pool",
    "restrooms",
    "restrooms",
    "sand_volleyball",
    "shelter",
    "skate_park",
    "soccer",
    "ball_fields",
    "sprayground",
    "swings",
    "teen",
    "tennis_courts",
    "tennis_courts",
    "tennis_courts",
    "theater",
    "track",
    "walking_trails",
    "walking_trails",
    "water_fountain",
    "ball_fields"
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

    print("vectorizing...")
    size_location_list = [(park.size_acres or 0), (park.lat or 0), (park.lon or 0)]
    type_list = [1 if park.type == t else 0 for t in TYPE_LIST]
    amenity_list = [1 if a in (park.amenities or []) else 0 for a in AMENITY_LIST]

    print("TYPE", len(type_list))
    print("AMENITY", len(amenity_list))

    d = size_location_list + type_list + amenity_list
    i = ["size_acres", "lat", "lon"] + TYPE_LIST + AMENITY_LIST

    print("d", len(d))
    print("i", len(i))



    park_series = pd.Series(data=(size_location_list + type_list + amenity_list), index=(["size_acres", "lat", "lon"] + TYPE_LIST + AMENITY_LIST))

    return park_series


def scale_size_location(df: pd.DataFrame):
    scaler = MinMaxScaler()
    df[["size_acres", "lat", "lon"]] = scaler.fit_transform(df[["size_acres", "lat", "lon"]])
    return df



def get_cosine_similarities(all_parks, target_park, limit: int = 5):
    
    df_rows = [vectorize_park(park) for park in all_parks]

    print("DF ROWS", df_rows)
    # df = pd.DataFrame(data=df_rows, index=[park.id for park in all_parks])

    # scaled_df = scale_size_location(df)

    # print(scaled_df)





