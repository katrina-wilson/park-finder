import { configureStore } from "@reduxjs/toolkit";
import parksReducer from "./parksSlice";

export const stores = configureStore({
  reducer: {
    parks: parksReducer,
  },
});