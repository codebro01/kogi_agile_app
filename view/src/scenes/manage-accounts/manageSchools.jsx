import React, {useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSchools, deleteSchool} from '../../components/schoolsSlice.js';
import { SpinnerLoader } from '../../components/spinnerLoader.jsx';
import DataTable from 'react-data-table-component';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Typography } from '@mui/material';

export const ManageSchools = () => {
    const dispatch = useDispatch();
    const schoolsState = useSelector((state) => state.schools);
    const { data: schoolsData, loading: schoolsLoading, error: schoolsError } = schoolsState;

        useEffect(() => {
            dispatch(fetchSchools());
        }, [dispatch]);




if(schoolsLoading) {
    return (
        <Box
            sx={{
                display: "flex", // Corrected from 'dispflex'
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "50vh",
                width: "90vw"
            }}
        >
            <SpinnerLoader />
        </Box>
    )
}

if(schoolsError) {
    return (
        <Box
                    sx={{
                        display: "flex", // Corrected from 'dispflex'
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "50vh",
                        width: "90vw"
                    }}
                >
                    Error: An error occured getting schools info, please reload the page
                </Box>
    )
}

// console.log(schoolsData)
 const handleDelete = (row) => {

        const confirmDelete = window.confirm(`Are you sure you want to delete ${row.schoolName}?`);

        if (confirmDelete) {
            try {
                (async () => {
                    try {
                        dispatch(deleteSchool(row._id)).unwrap();
                    }
                    catch (err) {
                        console.log(err)
                    }

                })()

                // Optionally, you can refresh or re-fetch the data here
            } catch (error) {
                console.error("Error deleting student:", error);
            }
        }
    };

    const columns = [
        {
            name: 'S/N',
            selector: (row, index) => index + 1, // Calculate serial number (starting from 1)
            sortable: true,
        },

        {
            name: 'School Name',
            selector: row => row.schoolName,
            sortable: true,
        },
        {
            name: 'School Code',
            selector: row => row.schoolCode,
            sortable: true,
        },
        {
            name: 'School Category',
            selector: row => row.schoolCategory,
            sortable: true,
        },
        {
            name: 'LGA',
            selector: row => row.LGA,
            sortable: true,
        },
        {
            name: 'Delete School',
            cell: (row) => (
                <button
                    onClick={() => handleDelete(row)}
                    style={{
                        padding: '5px 10px',
                        backgroundColor: 'transparent', // Optional: color for the delete button
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <DeleteIcon style={{ marginRight: '8px', color: "red" }} />
                </button>
            ),
        },
    ];






    return (
      <Box sx = {{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        padding: 2,
      }}> 
            <Box sx = {{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}> <Typography variant = 'h3'>All Registered School</Typography></Box>
            <DataTable
                columns={columns}
                data={schoolsData || []}
                pagination
                highlightOnHover
                pointerOnHover
                paginationPerPage={200} // Set the default number of rows to 200
                paginationRowsPerPageOptions={[100, 200, 500, 1000]} // Customize options for rows per page
                responsive

            />
      </Box>

            
    )
}
