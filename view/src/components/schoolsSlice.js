import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchSchools = createAsyncThunk('schools/fetchSchools', async (_, thunkAPI) => {
    const API_URL = `${import.meta.env.VITE_API_URL}/api/v1/all-schools`;

    try {
        const response = await axios.get(API_URL);
        return response.data.allSchools;
    } catch (error) {
        console.log(error)
        return thunkAPI.rejectWithValue(error.response?.data || error.response?.message || 'Failed to fetch students');
    }
});

const schoolsSlice = createSlice({
    name: 'schools',
    initialState: {
        data: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchSchools.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSchools.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchSchools.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError } = schoolsSlice.actions;
export default schoolsSlice.reducer;
