import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAllParksApi, fetchAllParksByUserIdApi } from "../api/parksApi";
import { fetchCurrentLoggedInUser } from "../api/authApi";


export const fetchAllParks = createAsyncThunk(
    'parks/fetchAllParks',
    async () => {
        try {
            const token = localStorage.getItem("token");
            let parks;

            if (!token) {
                parks = await fetchAllParksApi();
                return parks;
            }
            const currentUser = await fetchCurrentLoggedInUser(token);
            if (currentUser?.id) {
                parks = await fetchAllParksByUserIdApi(currentUser.id);
            } else {
                parks = await fetchAllParksApi();
            }
            return parks;
        } catch (e) {
            console.error("Failed to fetch parks.", e);
        }      
    }
);

export const parksSlice = createSlice({
    name: 'parks',
    initialState: {
        parks: [],
        mapCenter: null,
        status: 'idle',
        error: null,
    },
    reducers: {
        setMapCenter: (state, action) => {
            state.mapCenter = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder

            // Fetch All Parks
            .addCase(fetchAllParks.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchAllParks.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.parks = action.payload;
            })
            .addCase(fetchAllParks.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || "Failed to fetch parks.";
            });
    }
});

export const { setMapCenter } = parksSlice.actions;
export default parksSlice.reducer;