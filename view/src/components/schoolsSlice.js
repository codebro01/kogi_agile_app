import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchSchools = createAsyncThunk('schools/fetchSchools', async (_, thunkAPI) => {
    const API_URL = `${import.meta.env.VITE_API_URL}/api/v1/all-schools`;

    try {
        const response = await axios.get(API_URL);
        return response.data.allSchools;
    } catch (error) {
        console.log(error)
        if (error.response.status === 500 || error.status === 500 || error.response.statusText === "Internal Server Error") return thunkAPI.rejectWithValue('An error has occued, please try again ')
        return thunkAPI.rejectWithValue(error.response?.data || error.response?.message || 'Failed to fetch schools');
    }
});
export const deleteSchool = createAsyncThunk('school/deleteSchool', async (id, thunkAPI) => {
    const API_URL = `${import.meta.env.VITE_API_URL}/api/v1/schools`;
    const token = localStorage.getItem('token');
    try {
        const response = await axios.delete(`${API_URL}/${id}`, {
            headers: {  
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        });
        return response.data;
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
        selectedSchool: null,
    },
    reducers: {
        setSelectedSchool: (state, action) => {
            state.selectedSchool = action.payload
        }
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
            })
            .addCase(deleteSchool.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteSchool.fulfilled, (state, action) => {
                state.loading = false;
                state.data = state.data.filter(school => school._id !== action.payload.id);
            })
            .addCase(deleteSchool.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

    },
});

export const { setSelectedSchool } = schoolsSlice.actions;
export default schoolsSlice.reducer;
