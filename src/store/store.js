import authReducer from "./authSlice";
import participantsReducer from "./participantsSlice";
import { configureStore } from "@reduxjs/toolkit";

const appStore = configureStore({
  reducer: {
    userAuth: authReducer,
    participants: participantsReducer,
  },
});

export const store = appStore;
