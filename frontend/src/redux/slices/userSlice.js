import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name:'user',
    initialState:{
        value:null
    },
    reducers:{
        login:(state, actions)=>{
            state.value = actions.payload
        },
        logout:(state)=>{
            state.value = null
        },
        // checkAuth:(state)=>{
        //     state.
        // }
    }
})

export const {login, logout} = userSlice.actions
export default userSlice.reducer