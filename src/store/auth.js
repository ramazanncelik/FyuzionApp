import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    user: false,
}

const auth = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        user: (state, action) => {
            state.user = action.payload
        },
        logout: state => {
            state.user = false
        }
    }
});

export const { user, logout } = auth.actions
export default auth.reducer;