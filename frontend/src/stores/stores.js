import { configureStore } from "@reduxjs/toolkit";
import parksReducer from "./parksSlice";
import authReducer from "./authSlice";

export const stores = configureStore({
  reducer: {
    parks: parksReducer,
    auth: authReducer,
  },
});