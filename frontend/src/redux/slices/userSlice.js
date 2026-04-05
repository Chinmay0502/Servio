import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        value: null,
        loading: true // 🔥 important
    },
    reducers: {
        login: (state, action) => {
            state.value = action.payload;
            state.loading = false;
        },
        logout: (state) => {
            state.value = null;
            state.loading = false;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        }
    }
});

export const { login, logout, setLoading } = userSlice.actions;
export default userSlice.reducer;