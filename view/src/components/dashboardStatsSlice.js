import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchDashboardStat = createAsyncThunk('dashboardStat/fetchDashboardStat', async (_, thunkAPI) => {
    const API_URL = `${import.meta.env.VITE_API_URL}/api/v1/student/get-students-stats`;
    const token = localStorage.getItem('token') || '';

    try {
        const response = await axios.get(API_URL, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        });
        return {
            results: response.data.results,
            schoolCategory: response.data.schoolCategory,
            recentTwentyStudents: response.data.recentTwentyStudents
        }
    } catch (error) {
        console.log(error)

        return thunkAPI.rejectWithValue(error.response?.data || error.response.message || 'Failed to fetch stats');
    }
});



const dashboardStat = createSlice({
    name: 'dashboardStat',
    initialState: {
        data: [],
        loading: false,
        error: null,

    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardStat.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDashboardStat.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                // console.log(action.payload) 

            })
            .addCase(fetchDashboardStat.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error || action.payload?.message || 'An error occurred';
            })
    },
});

// export const {  } = dashboardStat.actions;
export default dashboardStat.reducer;
