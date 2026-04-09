import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import addressReducer from "./slices/addressSlice";
import serviceReducer from "./slices/serviceSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    address: addressReducer,
    service: serviceReducer
  },
});