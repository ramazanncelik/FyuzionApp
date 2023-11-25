import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    myPosts: [],
}

const myPosts = createSlice({
    name: 'myPosts',
    initialState,
    reducers: {
        setMyPosts: (state, action) => {
            state.myPosts = action.payload
        },
        appendMyPosts: (state, action) => {
            state.myPosts = [...state.myPosts, action.payload]
        },
    }
});

export const { setMyPosts, appendMyPosts } = myPosts.actions
export default myPosts.reducer;