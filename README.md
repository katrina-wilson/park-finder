# Triangle Park Finder

> ⚠️ This project is still a work in progress — more datasets, features, and map interactions will be added over time.

ParkFinder is an interactive web application for discovering parks in Raleigh, Durham, and Wake County. Users can explore parks on a dynamic Leaflet map and view key information such as park type, size, and amenities. The application also recommends similar parks using **cosine similarity**, with features weighted to prioritize key attributes: location (latitude and longitude) contributes 4.8%, park size and trail length contribute 11.9% each, amenities have the highest impact at 47.6%, and park type contributes 23.8%.

This weighting ensures the app suggests parks that are geographically close, similar in size, have comparable trail lengths, and share amenities or park types.

---

## 🔧 Built With

**Backend:** FastAPI, SQLAlchemy, PostgreSQL, Alembic, Pydantic   
**Frontend:** React, TypeScript, Material UI, Tailwind CSS, React-Leaflet, Redux, Axios, Vite  
**Data & Analysis:** Pandas, GeoPandas, NumPy, scikit-learn  
**Visualization:** Leaflet.js  


## 🚀 Features

- Interactive **Leaflet map** to explore parks in Raleigh, Durham, and Wake County  
- View key park information such as **type**, **size**, and **amenities**  
- **User accounts** to manage personal preferences or favorites  
- **Backend API** serving park data and similarity recommendations  
- **Cosine similarity-based recommendations**, ranking parks by location, size, trail length, amenities, and type  
- Supports **PostgreSQL database** with geospatial coordinates   

### Planned Features
- Advanced **filtering** options for parks by type, amenities, and other characteristics  
- Ability to **track and manage visited parks**  
- Personalized **park recommendations** based on user interactions and ratings  
- Integration with an **AI assistant** to provide additional park insights  
- Aggregation of **external park information** through automated data collection  
- Enhanced **mobile experience** and responsiveness  


## 💻 Getting Started

To run this project locally:

### Backend
```bash
# Navigate to backend
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run FastAPI server
uvicorn app.main:app --reload
```

### Frontend
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

```
