import { createSlice } from "@reduxjs/toolkit";

export const participantsSlice = createSlice({
    name:"participants",
    initialState:{
        value:[],
    },
    reducers:{
        addParticipants: (state, action) => {
            state.value.push(action.payload);
        },
        clearParticpants: (state) => {
            state.value = [];
        }
    }
})

export const { addParticipants, clearParticpants } = participantsSlice.actions;
export const participantsSelector = state => state.participants.value;
export default participantsSlice.reducer;
