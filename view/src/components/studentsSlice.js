import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for fetching students
export const fetchStudents = createAsyncThunk('students/fetchStudents', async ({ page, limit }, thunkAPI) => {
    const API_URL = `${import.meta.env.VITE_API_URL}/api/v1/student`;
    const token = localStorage.getItem('token') || '';

    try {
        const response = await axios.get(API_URL, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            params: { page, limit },
            withCredentials: true,
        });
        return {
            students: response.data,
            total: response.data.total,
            totalRows: response.data.totalRows,
            currentPage: page,
            rowsPerPage: limit,
        };
    } catch (error) {
        console.log(error)

        return thunkAPI.rejectWithValue(error.response?.data || error.response.message || 'Failed to fetch students');
    }
});
// export const fetchAllStudents = createAsyncThunk('students/fetchAllStudents', async (_, thunkAPI) => {
//     const API_URL = `${import.meta.env.VITE_API_URL}/api/v1/student`;
//     const token = localStorage.getItem('token') || '';

//     try {
//         const response = await axios.get(API_URL, {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//                 'Content-Type': 'application/json',
//             },
//             params: { page, limit },
//             withCredentials: true,
//         });
//         return {
//             students: response.data,
//             total: response.data.total,
//             totalRows: response.data.totalRows,
//             currentPage: page,
//             rowsPerPage: limit,
//         };
//     } catch (error) {
//         console.log(error)

//         return thunkAPI.rejectWithValue(error.response?.data || error.response.message || 'Failed to fetch students');
//     }
// });



// Async thunk for deleting a student
export const deleteStudent = createAsyncThunk(
    'students/deleteStudent',
    async (studentId, thunkAPI) => {
        const API_URL = `${import.meta.env.VITE_API_URL}/api/v1/student`;
        const token = localStorage.getItem('token') || '';

        try {
            const response = await axios.delete(`${API_URL}/${studentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });
            console.log(response)
            return studentId; // returning the new students data after deletion
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.response?.message || 'Failed to delete student');
        }
    }
);

export const fetchStudentsFromComponent = createAsyncThunk(
    'students/fetchStudentsFromComponent',
    async ({ filteredParams, sortParam }, thunkAPI) => {
        const API_URL = `${import.meta.env.VITE_API_URL}/api/v1/student/admin-view-all-students`;
        const token = localStorage.getItem('token') || '';

        try {

            const response = await axios.get(API_URL, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: { ...filteredParams, ...sortParam },
                withCredentials: true,
            });
            console.log(response.data)
            return response.data;  // Optionally return data if needed elsewhere
        } catch (error) {
            console.error('Error fetching students from component:', error);
            thunkAPI.rejectWithValue('error occured')
            throw error;  // Optionally return an error
        }
    }
);


const studentsSlice = createSlice({
    name: 'students',
    initialState: {
        data: [],
        loading: false,
        total: 0,
        error: null,
        currentPage: 1,
        totalRows: 0,
        rowsPerPage: 10,
        searchQuery: '', // Search query state
        filteredStudents: [],
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;

            if (!state.data || state.data.length === 0) {
                state.filteredStudents = [];
            }
            if (!action.payload.trim() || state.searchQuery === '') {
                // If the query is empty, show all students
                state.filteredStudents = state.data.students || [];
            } else {
                // Perform filtering
                state.filteredStudents = state.data.students.filter((item) => {
                    const valuesToSearch = [
                        item.randomId,
                        item.surname,
                        item.firstname,
                        item.middlename,
                        item.schoolId?.schoolName, // Handle possible null/undefined
                        item.lgaOfEnrollment,
                        item.presentClass,
                        item.bankName,
                        item.yearOfEnrollment,
                    ];
                    // console.log(item.bankName);
                    console.log(item.firstname)
                    return valuesToSearch.some(
                        (value) =>
                            value &&
                            String(value)
                                .toLowerCase()
                                .includes(action.payload.toLowerCase())
                    );
                });
            }
        },
        setStudents: (state, action) => {
            console.log(action.payload)
            state.data.students = action.payload;
            // state.filteredStudents = action.payload;
            // state.searchQuery = '';
        },
        resetStudentsData: (state, action) => {
            state.data.students = action.payload;
        },
        setPage: (state, action) => {
            state.currentPage = action.payload;
        },

        setRowsPerPage: (state, action) => {
            state.rowsPerPage = action.payload;
            state.currentPage = 1; // Reset to the first page
        },
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchStudents.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStudents.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload.students;
                state.filteredStudents = state.data.students; // Initialize filtered data

                state.total = action.payload.total; // Set total count
                state.totalRows = action.payload.total;
                state.currentPage = action.payload.currentPage;  // Update currentPage from API response

                console.log(state.filteredStudents)
            })
            .addCase(fetchStudents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteStudent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteStudent.fulfilled, (state, action) => {
                state.loading = false;
                // Remove the deleted student from both data and filteredStudents
                const updatedStudents = state.data.students.filter(
                    (student) => student.randomId !== action.payload
                );

                // Update the state with new student data and reset filtered students if search query is empty
                state.data.students = updatedStudents;

                if (!state.searchQuery.trim()) {
                    state.filteredStudents = updatedStudents; // Reset filtered students when search is empty
                } else {
                    state.filteredStudents = updatedStudents.filter((item) => {
                        const valuesToSearch = [
                            item.randomId,
                            item.surname,
                            item.firstname,
                            item.middlename,
                            item.schoolId?.schoolName,
                            item.lgaOfEnrollment,
                            item.presentClass,
                            item.bankName,
                            item.yearOfEnrollment,
                        ];

                        return valuesToSearch.some(
                            (value) =>
                                value &&
                                String(value).toLowerCase().includes(state.searchQuery.toLowerCase())
                        );
                    });
                }
            })

            .addCase(deleteStudent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchStudentsFromComponent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStudentsFromComponent.fulfilled, (state, action) => {
                state.loading = false;
                state.filteredStudents = action.payload
                console.log('Fetched students:', action.payload);  // Verify fetched data
            })
            .addCase(fetchStudentsFromComponent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError, filterStudents, resetStudentsData, setRowsPerPage, setPage, setCurrentPage, setStudents, setSearchQuery } = studentsSlice.actions;
export default studentsSlice.reducer;
