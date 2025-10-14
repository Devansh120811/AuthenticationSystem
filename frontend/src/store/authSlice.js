import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios';
const initialState = {
    userData: null,
    status: false,
}
export const fetchUserData = createAsyncThunk('auth/fetchUserData', async (_, { dispatch }) => {
    try {
        const accessToken = window.localStorage.getItem('accessToken');
        // console.log(accessToken)
        const tokenExpiry = window.localStorage.getItem('tokenExpiry');
        if (!accessToken || Date.now() > tokenExpiry) {
            dispatch(logout()); // Token expired, logout user
            return;
        }

        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };

        // Fetch user data
        const userResponse = await axios.get('http://localhost:8000/get-user-data', config);
        const userData = userResponse.data.userData;
        //  console.log(userData)
        // Check authentication
        const authResponse = await axios.get('http://localhost:8000/is-auth', config);
// console.log(authResponse.data.success)
        if (authResponse.data.success === true) {
            dispatch(login(userData)); // Store user data in Redux if authenticated
        }
    } catch (error) {
        console.error('Authentication failed:', error);

        if (error.response?.status === 401) {
            dispatch(logout());
        }
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        signup:(state,action)=>{
          state.status = false,
          state.userData = action.payload
        },
        login: (state, action) => {
            state.status = true
            state.userData = action.payload
        },
        logout: (state) => {
            state.status = false
            state.userData = null
            window.localStorage.removeItem('accessToken');
            window.localStorage.removeItem('tokenExpiry');  
        }
    }
})
export const { login, logout,signup } = authSlice.actions
export default authSlice.reducer