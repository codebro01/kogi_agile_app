import { configureStore } from '@reduxjs/toolkit';
import studentsReducer from './studentsSlice';
import schoolsReducer from './schoolsSlice';
import allStudentsReducer from './allStudentsSlice';
import dashboardStat from './dashboardStatsSlice';



export const store = configureStore({
    reducer: {
        students: studentsReducer,
        schools: schoolsReducer,
        allStudents: allStudentsReducer,
        dashboardStat
    },
    devTools: import.meta.env.MODE !== 'production', // Enable DevTools only in development mode
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Disable serializable checks if needed
        }),
});