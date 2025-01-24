import {
    Box,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    Grid,
    InputLabel,
    Select,
    MenuItem,
    Paper, Table, TableHead, TableRow, TableCell, TableBody, Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchDashboardStat } from "../../components/dashboardStatsSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import React, { useState, useCallback, useEffect } from "react";
import { DataTable } from "../../components/dataTableComponent";
import { useLocation, useNavigate } from "react-router-dom";
import { SpinnerLoader } from '../../components/spinnerLoader';

export const ManageDuplicateRecords = () => {
    const dashboardStatState = useSelector(state => state.dashboardStat);
    const { data: dashboardData, loading: dashboardStatLoading, error: dashboardStatError } = dashboardStatState
    const [enumeratorId, setEnumeratorId] = useState('');
    const [endDate, setEndDate] = useState('');
    const [students, setStudents] = useState([]);
    const [data, setData] = useState([]);
    const [fetchDataLoading, setDataFetchLoading] = useState(false);
    const [showModal, setShowModal] = useState(false); // Control modal visibility
    const [message, setMessage] = useState('');
    const [deletedLoading, setDeleteLoading] = useState(false);
    const API_URL = `${import.meta.env.VITE_API_URL}/api/v1`;
    const token = localStorage.getItem('token');
    const location = useLocation();
    const navigate = useNavigate();

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchDashboardStat());
    }, [dispatch])


    const [filters, setFilters] = useState({
        firstname: '',
        surname: '',
        middlename: '',
        schoolId: '',
        lgaOfEnrollment: '',
        presentClass: '',
        parentPhone: '',
    })



    const params = {
        firstname: filters.firstname,
        surname: filters.surname,
        middlename: filters.middlename,
        schoolId: filters.schoolId,
        lgaOfEnrollment: filters.lgaOfEnrollment,
        presentClass: filters.presentClass,
        parentPhone: filters.parentPhone,
    }

    const classOptions = [
        { class: "Primary 6", id: 1 },
        { class: "JSS 1", id: 2 },
        { class: "JSS 3", id: 3 },
        { class: "SSS 1", id: 4 },
    ];


    const filteredParams = Object.entries(params)
        .filter(([_, value]) => value != null && value !== '') // Filter out empty values
        .reduce((acc, [key, value]) => {
            acc[key] = value;  // Directly add each key-value pair to the accumulator
            return acc;
        }, {})


        ;  // No data in the dependency array


    const handleDelete = async (id, surname, firstname) => {
        try {
            setDeleteLoading(true)
            const confirmDelete = window.confirm(`Are you sure you want to delete ${surname} ${firstname} `)
            if (!confirmDelete) return;
            const response = await axios.delete(`${API_URL}/student/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });
            setDeleteLoading(false)

            const remainingStudents = students.filter(student => student.randomId !== id);
            setMessage('Delete successful')
            setStudents(remainingStudents);
            setTimeout(() => {
                setMessage('')
            }, 5000);
        } catch (err) {
            setDeleteLoading(false)
            console.log(err);
            setMessage(err.response?.message || err.response?.data?.message || err?.message || 'an error occured, please try again')
            setTimeout(() => {
                setMessage('')
            }, 5000);
        }
    }

    // useEffect(() => {
    //     const fetchData = async () => {
    //        
    //     };
    //     fetchData();
    // }, [handleToggle, handleDelete]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFilters((prev) => ({
            ...prev,
            [name]: value
        }))
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setDataFetchLoading(true);
            const response = await axios.get(`${API_URL}/student/manage-duplicate-records`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                params: { ...filteredParams },
                withCredentials: true,
            });
            setStudents(response.data.students);
            setDataFetchLoading(false);
            if(response.data.students.length < 1) return setMessage("No Similar students Found")
                setMessage('Request Successful')
        } catch (err) {
            console.log(err);
            setMessage(err.response?.message || err.response.data.message || 'an error occured, please try again')
            setDataFetchLoading(false);
        }
    }

    if (dashboardStatLoading) {
        return <Box
            sx={{
                display: "flex",
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                height: "100%"
            }}
        ><SpinnerLoader /></Box>
    }
    if (dashboardStatError) {
        return <Box
            sx={{
                display: "flex",
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                height: "100%"
            }}
        >Error: An error happened, please reload to try again</Box>
    }

    const uniqueSchools = dashboardData?.results?.[0]?.distinctSchoolsDetails || []


    // ! Here handle filters 



    return (
        <Box

            sx={{
                padding: "20px"
            }}>
            <Box
                component={'form'}
                elevation={2}
                onSubmit={handleSubmit}
                sx={{
                    width: '100%', // Adjusts to parent width
                    // maxWidth: '600px', // Caps the width for compact design
                    margin: '30px auto', // Centers the box with spacing
                    padding: 2,
                    backgroundColor: '#f9f9f9', // Subtle background
                    borderRadius: 2, // Rounded corners
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', // Light shadow
                }}

            >
                <Typography
                    variant="h6"
                    component="h1"
                    align="center"
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                >
                    Filter Students
                </Typography>

                {/* <Grid
                    container
                    spacing={2}
                >

                    <Grid item xs={12} sm={6} md={4}>

                        <TextField
                            fullWidth
                            label="surname"
                            type="text"
                            name='surname'
                            InputLabelProps={{ shrink: true }}
                            value={filters.surname}
                            onChange={(e) => handleInputChange(e)}
                            sx={{ flex: 1 }}
                           inputProps={{
                            height: "3opx"
                           }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>

                        <TextField
                            fullWidth

                            label="firstname"
                            type="text"
                            name='firstname'
                            InputLabelProps={{ shrink: true }}
                            value={filters.firstname}
                            onChange={(e) => handleInputChange(e)}
                            sx={{ flex: 1 }}
                        />
                    </Grid>


                    <Grid item xs={12} sm={6} md={4}>

                        <TextField

                            fullWidth
                            label="lastname"
                            type="text"
                            name='lastname'
                            InputLabelProps={{ shrink: true }}
                            value={filters.lastname}
                            onChange={(e) => handleInputChange(e)}
                            sx={{ flex: 1 }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                        fullWidth
                            label="lastname"
                            type="text"
                            name='lastname'
                            InputLabelProps={{ shrink: true }}
                            value={filters.lastname}
                            onChange={(e) => handleInputChange(e)}
                            sx={{ flex: 1 }}
                        />
                    </Grid>


                    <Grid item xs={12} sm={6} md={4}>

                    <Button
                    fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ height: '56px', alignSelf: 'stretch' }} // Aligns with input height
                    >
                        Filter
                    </Button>

                    </Grid>
                </Grid> */}

                <Grid
                    container
                    spacing={2}
                    sx={{
                        '& .MuiTextField-root': {
                            height: '40px', // Set consistent height
                        },
                        '& .MuiInputBase-root': {
                            height: '40px', // Control input field height
                        },
                        '& .MuiOutlinedInput-root': {
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#196b57', // Custom focus outline color
                            },
                        },
                    }}
                >
                    {[
                        { label: 'Surname', name: 'surname', value: filters.surname },
                        { label: 'Firstname', name: 'firstname', value: filters.firstname },
                        { label: 'Middlename', name: 'middlename', value: filters.middlename },
                        { label: 'Parent Phone', name: 'parentPhone', value: filters.parentPhone },
                    ].map((field, index) => (
                        <Grid key={index} item xs={12} sm={6} md={3}>
                            {/* 4 columns on wide screens (md), fallback to smaller screens */}
                            <TextField
                                fullWidth
                                label={field.label}
                                type="text"
                                name={field.name}
                                InputLabelProps={{ shrink: true }}
                                value={field.value}
                                onChange={(e) => handleInputChange(e)}
                                sx={{
                                    '& .MuiInputBase-root': {
                                        height: '40px', // Match with other inputs
                                    },
                                }}
                            />
                        </Grid>
                    ))}

                    <Grid item xs={12} sm={6} md={4}>
                        <Select
                            name="schoolId"
                            value={filters.schoolId}
                            onChange={handleInputChange}
                            displayEmpty
                            fullWidth
                            size="medium"
                            labelId="schoolId-label"
                            sx={{
                                borderRadius: 2,
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': { borderColor: '#4caf50' },
                                    '&:hover fieldset': { borderColor: '#2e7d32' },
                                    '&.Mui-focused fieldset': { borderColor: '#1b5e20', borderWidth: 2 },
                                },
                            }}
                        >
                            <MenuItem value="">
                                <em>All Schools</em>
                            </MenuItem>
                            {uniqueSchools.map((school, index) => (
                                <MenuItem key={index} value={school.schoolId}>
                                    {school.schoolName}
                                </MenuItem>
                            ))}
                        </Select>
                    </Grid>


                    <Grid item xs={12} sm={6} md={4}>
                        <Select
                            name="presentClass"
                            value={filters.presentClass}
                            onChange={handleInputChange}
                            displayEmpty
                            fullWidth
                            size="small"
                            labelId="class-label"
                        >
                            <MenuItem value="">
                                <em>All Class</em>
                            </MenuItem>
                            {classOptions?.map((option) => (
                                <MenuItem key={option.id} value={option.class}>
                                    {option.class}
                                </MenuItem>
                            ))}
                        </Select>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Button
                            fullWidth
                            variant="contained"
                            type='submit'
                            sx={{
                                height: '40px', // Match input height for a clean look
                                textTransform: 'none', // Modern look (optional)
                                color: "white",
                                backgroundColor: "#196b57",
                                '&:hover': {
                                    backgroundColor: "#145847", // Darker shade for hover
                                },
                            }}
                        >
                            Filter
                        </Button>
                    </Grid>

                </Grid>


                {deletedLoading ? <Typography color={'secondary'}
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        paddingTop: "10px"
                    }}
                >Deleting...</Typography> : ''} {/* Replace with actual field */}
                {<Typography color={'secondary'} sx={{
                    display: "flex",
                    justifyContent: "center", 
                    alignItems: "center",
                    padding: "50px"
                }}>{message}</Typography>} {/* Replace with actual field */}
           


                {fetchDataLoading ? (<Box
                    sx={{
                        display: "flex",
                        width: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%"
                    }}
                ><SpinnerLoader /></Box>)  : (
                    <Box sx={{ overflowX: "scroll", maxHeight: "700px", width: "100%" }}>
                        {students.length > 0 ? (
                            <Table sx={{ overflowX: "scroll", maxHeight: "700px" }} aria-label="student table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>S/N</TableCell>
                                        <TableCell>Surname</TableCell>
                                        <TableCell>Firstname</TableCell>
                                        <TableCell>Middlename</TableCell>
                                        <TableCell>School Name</TableCell>
                                        <TableCell>lga Of Enrollment</TableCell> {/* Replace with actual field */}
                                        <TableCell>Present Class</TableCell> {/* Replace with actual field */}
                                        <TableCell>parentPhone</TableCell> {/* Replace with actual field */}
                                        <TableCell>Delete Student</TableCell> {/* Replace with actual field */}
                                        {/* Add more headers as per your requirement */}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {students.map((student, index) => (
                                        <TableRow key={student._id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{student.surname}</TableCell>
                                            <TableCell>{student.firstname}</TableCell>
                                            <TableCell>{student.middlename}</TableCell> {/* Replace with actual field */}
                                            <TableCell>{student.schoolId.schoolName}</TableCell> {/* Replace with actual field */}
                                            <TableCell>{student.lgaOfEnrollment}</TableCell> {/* Replace with actual field */}
                                            <TableCell>{student.presentClass}</TableCell> {/* Replace with actual field */}
                                            <TableCell>{student.parentPhone}</TableCell> {/* Replace with actual field */}
                                            <TableCell onClick={() => handleDelete(student.randomId, student.surname, student.firstname)}>{<DeleteIcon sx={{ color: "red", cursor: "pointer" }} />}</TableCell>
                                            {/* Add more table cells based on your schema */}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <Typography
                                variant="body2"
                                align="center"
                                color="textSecondary"
                                sx={{ padding: 2 }}
                            >
                                No students found
                            </Typography>
                        )}
                    </Box>
                )}


            </Box>

            {/* <DataTable
                url={'admin-enumerator'}
                data={data}
                fetchDataLoading={fetchDataLoading}
                handleDelete={handleDelete}
                editNav={'edit-enumerator'}
                registerLink={'/admin-dashboard/create-accounts/register-enumerator'}
                tableHeader={'MANAGE DUPLICATES'}
                showTotalStudentsRegistered={true}
            />
            {showModal && (
                <div style={overlayStyle}>
                    <div style={modalContentStyle}>
                        <h3>{message}</h3>
                        <button style={closeButtonStyle} onClick={() => setShowModal(false)}>Close</button>
                    </div>
                </div>
            )} */}
        </Box>
    );
}

const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    transition: 'all 0.3s ease',
};

const modalContentStyle = {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    width: '400px',
    maxWidth: '90%',
    animation: 'fadeIn 0.5s',
};

const closeButtonStyle = {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '20px',
    transition: 'background-color 0.3s',
};
