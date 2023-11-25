import { configureStore } from '@reduxjs/toolkit'
import auth from './auth'
import myPosts from './myPosts'
import messageInfoForEdit from './messageInfoForEdit'

const store = configureStore({
    reducer: {
        auth,
        myPosts,
        messageInfoForEdit
    }
})

export default store;