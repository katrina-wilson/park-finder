import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAllParksApi } from "../api/parksApi";

export const fetchAllParks = createAsyncThunk(
    'parks/fetchAllParks',
    async () => {
        try {
            const parks = await fetchAllParksApi();
            return parks;
        } catch (e) {
            console.error("Failed to fetch parks.", e);
        }      
    }
)

export const parksSlice = createSlice({
    name: 'parks',
    initialState: {
        parks: [],
        status: 'idle',
        error: null,
    },
    reducers: {
    },
    extraReducers: (builder) => {

        builder
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

export default parksSlice.reducer;