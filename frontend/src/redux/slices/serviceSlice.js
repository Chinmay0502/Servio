import { createSlice } from "@reduxjs/toolkit";

const serviceSlice = createSlice({
  name: "service",
  initialState: {
    services: [],
    loading: false,
  },
  reducers: {
    setServices: (state, action) => {
      state.services = action.payload;
      state.loading = false;
    },
    addService: (state, action) => {
      state.services.push(action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setServices, addService, setLoading } = serviceSlice.actions;
export default serviceSlice.reducer;