import geopandas as gpd
import pandas as pd

RAW_FILES = [
    "data/raw/raleigh_parks.geojson",
    "data/raw/wake_county_parks.geojson",
    "data/raw/durham_parks.geojson",
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


def prepare_data():
    gdf_list = []
    for file in RAW_FILES:
        gdf = gpd.read_file(file)

        gdf = gdf.rename(columns=FIELD_RENAME_MAP)

        amenities_cols = [col for col in gdf.columns if col in AMENITY_RENAME_MAP]
        gdf['amenities'] = gdf.apply(
            lambda row: [AMENITY_RENAME_MAP[col] for col in amenities_cols if str(row.get(col)).strip().upper() == "YES"],
            axis=1
        )

        # Project -- is this the right projection?
        if gdf.crs is None or gdf.crs.to_string() != "EPSG:4326":
            gdf = gdf.to_crs("EPSG:4326")

        # get lat/lon from centroid
        gdf["lat"] = gdf.geometry.centroid.y
        gdf["lon"] = gdf.geometry.centroid.x

        allowed_columns = list(FIELD_RENAME_MAP.values()) + list(AMENITY_RENAME_MAP.values())
        gdf = gdf[[col for col in gdf.columns if col in allowed_columns]]

        # None if no lat, lon, size_acres
        for col in ["lat", "lon", "size_acres"]:
            if col in gdf.columns:
                gdf[col] = gdf[col].apply(lambda x: None if pd.isna(x) else x)

        if 'amenities' in gdf.columns:
            gdf['amenities'] = gdf['amenities'].apply(lambda x: x if isinstance(x, list) else [])


        gdf_list.append(gdf)

    all_gdf = gpd.GeoDataFrame(pd.concat(gdf_list, ignore_index=True))

    all_gdf = all_gdf.drop_duplicates(
        subset=["name", "lat", "lon"],
        keep="first"  # keep the first occurrence
    )

    all_gdf.to_parquet("data/cleaned/parks.parquet", index=False)


    # TEST read parquet
    # p = gpd.read_parquet("data/cleaned/parks.parquet")
    # print(p.head())
    # print(p.columns)
    # print(p.crs)          # check coordinate reference system
    # print(p.geometry.head())  # view geometries


if __name__ == "__main__":
    prepare_data()
