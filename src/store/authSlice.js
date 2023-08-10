import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
    name:"authentication",
    initialState:{
        value:null,
    },
    reducers:{
        authorizeUser: (state, action) => {
            state.value = action.payload;
        },
        clearUser: state => {
            state.value = null;
        }
    }
})

export const {authorizeUser, clearUser} = authSlice.actions;
export const authSelector = state => state.userAuth.value;
export default authSlice.reducer;
