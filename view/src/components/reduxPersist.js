import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage
import studentsReducer from './studentsSlice';
import schoolsReducer from './schoolsSlice'


const rootReducer = {
    students: studentsReducer,
    schools: schoolsReducer, // Include other slices if needed
};


const persistConfig = {
    key: 'root',
    storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export  {persistedReducer};
