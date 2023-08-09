import { configureStore } from "@reduxjs/toolkit";
import authReducer from './authSlice';
const appStore = configureStore({
    reducer:{
        userAuth: authReducer,
    }
})

export const store = appStore;
