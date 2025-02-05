import authSlice from './authSlice.js'
import { configureStore } from '@reduxjs/toolkit'

const store = configureStore({
    reducer:{
        auth: authSlice
    }
})

export default store