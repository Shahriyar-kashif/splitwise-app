import { configureStore } from "@reduxjs/toolkit";
import authReducer from './authSlice';
import participantsReducer from "./participantsSlice";

const appStore = configureStore({
    reducer:{
        userAuth: authReducer,
        participants: participantsReducer,
    }
})

export const store = appStore;
