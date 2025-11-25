import os
import pandas
import pickle

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # backend/app -> backend
CLEANED_DIR = os.path.join(BASE_DIR, "data", "cleaned")

def load_cleaned_parks():
    parks_path = os.path.join(CLEANED_DIR, "parks.parquet")
    similarity_path = os.path.join(CLEANED_DIR, "similarity.pkl")

    parks = pandas.read_parquet(parks_path)

    with open(similarity_path, "rb") as f:
        similarity_matrix = pickle.load(f)
    
    return parks, similarity_matrix


def get_similar_parks(park_id, parks, similarity_matrix, top_n=5):
    if park_id not in parks["id"].values:
        raise ValueError("Park ID not found")
    
    idx = parks.index[parks["id"] == park_id][0]
    similarities = similarity_matrix[idx]
    similar_idx = similarities.argsort()[::-1][1:top_n+1]
    return parks.iloc[similar_idx]
