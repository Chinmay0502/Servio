import { createSlice } from "@reduxjs/toolkit";

const addressSlice = createSlice({
  name: "address",
  initialState: {
    list: [],
    loading: false,
  },
  reducers: {
    setAddresses: (state, action) => {
      state.list = action.payload;
      state.loading = false;
    },
    addAddress: (state, action) => {
      state.list.push(action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setAddresses, addAddress, setLoading } = addressSlice.actions;
export default addressSlice.reducer;