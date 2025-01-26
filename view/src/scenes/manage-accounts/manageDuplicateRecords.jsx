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
    Paper, Table, TableHead, TableRow, TableCell, TableBody, Typography, Checkbox
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
    // const dashboardStatState = useSelector(state => state.dashboardStat);
    // const { data: dashboardData, loading: dashboardStatLoading, error: dashboardStatError } = dashboardStatState
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
    const [selectedStudents, setSelectedStudents] = useState([]);


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

    const handleCheckboxChange = (id) => {
        setSelectedStudents((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((studentId) => studentId !== id) // Remove if already selected
                : [...prevSelected, id] // Add if not selected
        );
    };


    // const handleSelectAll = (event) => {
    //     if (event.target.checked) {
    //         setSelectedStudents(students.map((student) => student.randomId)); // Select all
    //     } else {
    //         setSelectedStudents([]); // Deselect all
    //     }
    // };
    const handleBulkDelete = async () => {
        try {
            const confirmDelete = window.confirm(`Are you sure you want to delete ${selectedStudents.length} students `)
            if (!confirmDelete) return;
            setDeleteLoading(true)
            const ids = selectedStudents.join(',');
            const response = await axios.delete(`${API_URL}/student/delete/delete-many/?ids=${ids}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                withCredentials: true,

            });

            setSelectedStudents([]);
            setMessage(response.data.messaage)

            setDeleteLoading(false)
            setTimeout(() => {
                setMessage('')
            }, 5000);
            const updatedStudents = students
                .map(student => {
                    return {
                        ...student,
                        similarRecords: student.similarRecords.filter(
                            similarStudent => !selectedStudents.includes(similarStudent.randomId)
                        ),
                    };
                })
                .filter(student => student.similarRecords.length > 0); // Remove students with no similarRecords

            setStudents(updatedStudents);
            //     return {
            //         ...student,
            //         similarRecords: student.similarRecords.filter(similarStudent => similarStudent.randomId !== id),
            //     };
            // }).filter(student => student.similarRecords.length > 0); // Remove students with no similarRecords    
            // setStudents(updatedStudents);
        } catch (err) {
            setDeleteLoading(false)
            console.log(err);
            if (err.response.statusText === '"Unauthorized"' || err.status === 401) return navigate('/');
            setMessage(err.response?.message || err.response?.data?.message || err?.message || 'an error occured, please try again')
            setTimeout(() => {
                setMessage('')
            }, 5000);
        }
    };


    const handleDelete = async (id, surname, firstname) => {
        try {
            const confirmDelete = window.confirm(`Are you sure you want to delete ${surname} ${firstname} `)
            if (!confirmDelete) return;
            setDeleteLoading(true)
            const response = await axios.delete(`${API_URL}/student/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });
            setDeleteLoading(false)
            setTimeout(() => {
                setMessage('')
            }, 5000);
            const updatedStudents = students.map(student => {
                return {
                    ...student,
                    similarRecords: student.similarRecords.filter(similarStudent => similarStudent.randomId !== id),
                };
            }).filter(student => student.similarRecords.length > 0); // Remove students with no similarRecords    
            setStudents(updatedStudents);
        } catch (err) {
            if (err.response.statusText === '"Unauthorized"' || err.status === 401) return navigate('/');
            setDeleteLoading(false)
            console.log(err);
            setMessage(err.response?.message || err.response?.data?.message || err?.message || 'an error occured, please try again')
            setTimeout(() => {
                setMessage('')
            }, 5000);
        }
    }


    const fetchDuplicate = async () => {
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
            if (response.data.students.length < 1) return setMessage("No Similar students Found")
        } catch (err) {
            console.log(err);
            if (err.response.statusText === '"Unauthorized"' || err.status === 401) return navigate('/');
            if (err.response?.code === "ERR_NETWORK" || err.code === "ERR_NETWORK") {
                setMessage('Network Error, please try again');
                setDataFetchLoading(false);
                return;
            }
            setMessage(err.response?.message || err.response.data.message || 'an error occured, please try again')
            setDataFetchLoading(false);
        }
    }

    useEffect(() => {
        fetchDuplicate();
    }, [])

    return (
        <Box

            sx={{
                padding: "20px"
            }}>
            <Box
                elevation={2}
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
                    MANAGE DUPLICATE STUDENTS
                </Typography>


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

                <Button
                    variant="contained"
                    color="error"
                    onClick={handleBulkDelete}
                    disabled={selectedStudents.length === 0}
                >
                    Delete Selected
                </Button>

                {fetchDataLoading ? (<Box
                    sx={{
                        display: "flex",
                        width: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%"
                    }}
                ><SpinnerLoader /></Box>) : (
                    <Box sx={{ overflowX: "scroll", maxHeight: "700px", width: "100%" }}>
                            
                        {students.length > 0 ? (
                            <Table sx={{ overflowX: "scroll", maxHeight: "700px" }} aria-label="student table">
                                <TableHead>
                                    <TableRow>
                                          
                                        <TableCell style={{ fontWeight: 'bold' }}>Select</TableCell>
                                        <TableCell style={{ fontWeight: 'bold' }}>S/N</TableCell>
                                        <TableCell style={{ fontWeight: 'bold' }}>Passport</TableCell>
                                        <TableCell style={{ fontWeight: 'bold' }}>Surname</TableCell>
                                        <TableCell style={{ fontWeight: 'bold' }}>Firstname</TableCell>
                                        <TableCell style={{ fontWeight: 'bold' }}>Middlename</TableCell>
                                        <TableCell style={{ fontWeight: 'bold' }}>School Name</TableCell>
                                        <TableCell style={{ fontWeight: 'bold' }}>LGA of Enrollment</TableCell>
                                        <TableCell style={{ fontWeight: 'bold' }}>Present Class</TableCell>
                                        <TableCell style={{ fontWeight: 'bold' }}>Parent Phone</TableCell>
                                        <TableCell style={{ fontWeight: 'bold' }}>Delete Student</TableCell>
                                    </TableRow>


                                </TableHead>
                                <TableBody>
                                    {students.map((student, index) => (
                                        student?.similarRecords?.map((similarStudent, subIndex) => (
                                            <TableRow key={similarStudent._id}>
                                               
                                                <TableCell>
                                                    <Checkbox
                                                        checked={selectedStudents.includes(similarStudent.randomId)}
                                                        onChange={() => handleCheckboxChange(similarStudent.randomId)}
                                                        sx={{
                                                            // '& .MuiSvgIcon-root': {
                                                            //     backgroundColor: '#196b57', // Default background
                                                            //     borderRadius: '4px',       // Optional rounded corners
                                                            // },
                                                            '&.Mui-checked .MuiSvgIcon-root': {
                                                                // backgroundColor: '#0e4d38', // Background when checked
                                                                color: '#d32f2f',             // Checkmark color
                                                            },
                                                            '&:hover .MuiSvgIcon-root': {
                                                                color: '#d32f2f', // Background on hover
                                                            },
                                                            color: "#196b57"
                                                        }}
                                                    />
                                                </TableCell>
 {/* Main index and sub-index */}
                                                <TableCell>{index + 1}.{subIndex + 1}</TableCell> {/* Main index and sub-index */}
                                                <TableCell><Box sx={{ width: "70px", height: "70px" }}><img style={{ width: "100%" }} src={similarStudent.passport} /></Box></TableCell>
                                                <TableCell>{similarStudent.surname}</TableCell>
                                                <TableCell>{similarStudent.firstname}</TableCell>
                                                <TableCell>{similarStudent.middlename}</TableCell>
                                                <TableCell>{similarStudent.schoolName || 'N/A'}</TableCell> {/* Nested data check */}
                                                <TableCell>{similarStudent.lgaOfEnrollment || 'N/A'}</TableCell>
                                                <TableCell>{similarStudent.presentClass || 'N/A'}</TableCell>
                                                <TableCell>{similarStudent.parentPhone || 'N/A'}</TableCell>
                                                <TableCell
                                                    onClick={() => handleDelete(similarStudent.randomId, similarStudent.surname, similarStudent.firstname)}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <DeleteIcon sx={{ color: "red" }} />
                                                </TableCell>
                                            </TableRow>
                                        ))
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
