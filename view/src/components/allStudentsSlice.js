import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for fetching students
export const fetchAllStudents = createAsyncThunk('allStudents/fetchAllStudents', async (_, thunkAPI) => {
    const API_URL = `${import.meta.env.VITE_API_URL}/api/v1/student`;
    const token = localStorage.getItem('token') || '';

    try {
        const response = await axios.get(API_URL, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        });
        return response.data;
    } catch (error) {

        return thunkAPI.rejectWithValue(error.response?.data || error.response.message || 'Failed to fetch students');
    }
});



const allStudentsSlice = createSlice({
    name: 'allStudents',
    initialState: {
        data: [],
        loading: false,
        error: null,

    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        filterStudents: (state, action) => {
            // Update the state with filtered data
            state.data = action.payload;
        },
        resetStudentsData: (state, action) => {
            state.data = action.payload;
        },

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllStudents.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllStudents.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload?.students;



            })
            .addCase(fetchAllStudents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error || action.payload?.message || 'An error occurred';
            })
    },
});

export const { clearError, filterStudents } = allStudentsSlice.actions;
export default allStudentsSlice.reducer;
