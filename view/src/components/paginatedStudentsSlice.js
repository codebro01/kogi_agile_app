// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// export const fetchStudents = createAsyncThunk(
//     'students/fetchStudents',
//     async ({ page, limit }, thunkAPI) => {
//         const API_URL = `${import.meta.env.VITE_API_URL}/api/v1/student`;
//         const token = localStorage.getItem('token') || '';

//         try {
//             const response = await axios.get(API_URL, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     'Content-Type': 'application/json',
//                 },
//                 params: { page, limit }, // Pass pagination params
//                 withCredentials: true,
//             });
//             return {
//                 students: response.data.students,
//                 total: response.data.total,
//             };
//         } catch (error) {
//             return thunkAPI.rejectWithValue(
//                 error.response?.data || error.response.message || 'Failed to fetch students'
//             );
//         }
//     }
// );


// const paginatedStudentsSlice = createSlice({
//     name: 'paginatedStudents',
//     initialState: {
//         data: [], 
//         loading: false,
//         error: null
//     }
// })


