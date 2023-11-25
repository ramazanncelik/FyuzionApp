import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    message: false,
}

const messageInfoForEdit = createSlice({
    name: 'messageInfoForEdit',
    initialState,
    reducers: {
        setMessage: (state, action) => {
            state.message = action.payload
        },
    }
});

export const { setMessage } = messageInfoForEdit.actions
export default messageInfoForEdit.reducer;