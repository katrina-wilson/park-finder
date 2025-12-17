import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createNewUserApi, loginUserApi, fetchCurrentLoggedInUser } from "../api/authApi";

export const fetchCurrentUser = createAsyncThunk(
    'users/current',
    async (_, { rejectWithValue }) => {
        const token = localStorage.getItem("token");
        if (!token) return rejectWithValue("No token");

        try {
            const data = await fetchCurrentLoggedInUser(token);
            return data;
        } catch (err) {
            return rejectWithValue("Failed to fetch user");
        }
    }
);

export const createNewUser = createAsyncThunk(
    'users/create',
    async (userData, { rejectWithValue }) => {
        try {
            const user = await createNewUserApi(userData);
            if (user.error) {
                return rejectWithValue(user);
            }
            return user;
        } catch (e) {
            console.error("Failed to create user.", e);
            return rejectWithValue(e.response?.data || { detail: "Failed to create account." });
        }      
    }
);

export const loginUser = createAsyncThunk(
    'auth/token',
    async (userData, { rejectWithValue }) => {
        try {
            const user = await loginUserApi(userData);
            if (user.error) {
                return rejectWithValue(user);
            }
            return user;
        } catch (e) {
            console.error("Failed to login user.", e);
            return rejectWithValue(e.response?.data || { detail: "Incorrect email or password." });
        }      
    }
);

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        currentUser: null,
        token: localStorage.getItem("token") || null,
        status: 'idle',
        error: null,
    },
    reducers: {
        setCurrentUser: (state, action) => {
            state.currentUser = action.payload;
            state.token = action.payload.token || state.token;
        },
        clearCurrentUser: (state) => {
            state.currentUser = null;
            state.token = null;
            localStorage.removeItem("token");
        }
    },
    extraReducers: (builder) => {
        builder
            // current user
            .addCase(fetchCurrentUser.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                state.status = "idle";
                state.currentUser = action.payload.user ?? action.payload;
                if (action.payload?.token) {
                    state.token = action.payload.token;
                }
            })
            .addCase(fetchCurrentUser.rejected, (state, action) => {
                state.status = "failed";
                state.currentUser = null;
                state.token = null;
                state.error = action.payload;
            })

            // login
            .addCase(loginUser.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = "idle";
                state.currentUser = action.payload;
                if (action.payload?.token) {
                    localStorage.setItem("token", action.payload.token);
                }
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

            // create user
            .addCase(createNewUser.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(createNewUser.fulfilled, (state, action) => {
                state.status = "idle";
                state.currentUser = action.payload;
                localStorage.setItem("token", action.payload.token);
            })
            .addCase(createNewUser.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
    }
});

export const { setCurrentUser, clearCurrentUser } = authSlice.actions;
export default authSlice.reducer;