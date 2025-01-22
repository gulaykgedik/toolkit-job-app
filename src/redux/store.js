import { configureStore } from "@reduxjs/toolkit";
import jobReducer from "./slices/jopSlice";

const store = configureStore({ reducer: { jobReducer } });

export default store;
