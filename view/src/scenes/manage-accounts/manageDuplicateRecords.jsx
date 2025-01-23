import {
    Box,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    Paper, Table, TableHead, TableRow, TableCell, TableBody, Typography
} from '@mui/material';


import axios from "axios";
import React, { useState, useCallback, useEffect } from "react";
import { DataTable } from "../../components/dataTableComponent";
import { useLocation, useNavigate } from "react-router-dom";

export const ManageDuplicateRecords = () => {
    const [enumeratorId, setEnumeratorId] = useState('');
    const [endDate, setEndDate] = useState('');
    const [students, setStudents] = useState([]);
    const [data, setData] = useState([]);
    const [fetchDataLoading, setDataFetchLoading] = useState(false);
    const [showModal, setShowModal] = useState(false); // Control modal visibility
    const [message, setMessage] = useState('');
    const API_URL = `${import.meta.env.VITE_API_URL}/api/v1`;
    const token = localStorage.getItem('token');
    const location = useLocation();
    const navigate = useNavigate();
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
        schoolId: filters.firstname,
        lgaOfEnrollment: filters.lgaOfEnrollment,
        presentClass: filters.presentClass,
        parentPhone: filters.parentPhone,
    }


    const filteredParams = Object.entries(params)
        .filter(([_, value]) => value != null && value !== '') // Filter out empty values
        .reduce((acc, [key, value]) => {
            acc[key] = value;  // Directly add each key-value pair to the accumulator
            return acc;
        }, {})


        ;  // No data in the dependency array


    const handleDelete = useCallback((id) => {
        setData((prevData) => prevData.filter((row) => row.id !== id));
    }, []);

    // useEffect(() => {
    //     const fetchData = async () => {
    //        
    //     };
    //     fetchData();
    // }, [handleToggle, handleDelete]);

    const handleInputChange = (e) => {
        const {name, value} = e.target;

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
                params: {...filteredParams},
                withCredentials: true,
            });
            // setData(response.data.countStudentsByEnumerators);
            console.log(response)
            setDataFetchLoading(false);
        } catch (err) {
            setDataFetchLoading(false);
        }
    }



    // ! Here handle filters 


    return (
        <>
            <Box
                sx={{
                    width: '100%', // Adjusts to parent width
                    // maxWidth: '600px', // Caps the width for compact design
                    margin: '30px auto', // Centers the box with spacing
                    padding: 2,
                    backgroundColor: '#f9f9f9', // Subtle background
                    borderRadius: 2, // Rounded corners
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', // Light shadow
                }}
                component={'form'}
                elevation={2}
                onSubmit={handleSubmit}

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

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 2, // Space between fields
                        justifyContent: 'space-between',
                        marginBottom: 2,
                    }}
                >
                    <TextField
                        label="surname"
                        type="text"
                        name='surname'
                        InputLabelProps={{ shrink: true }}
                        value={filters.surname}
                        onChange={(e) => handleInputChange(e)}
                        sx={{ flex: 1 }}
                    />
                    <TextField
                        label="firstname"
                        type="text"
                        name='firstname'
                        InputLabelProps={{ shrink: true }}
                        value={filters.firstname}
                        onChange={(e) => handleInputChange(e)}
                        sx={{ flex: 1 }}
                    />
                    <br></br>
                    <TextField
                        label="lastname"
                        type="text"
                        name='lastname'
                        InputLabelProps={{ shrink: true }}
                        value={filters.lastname}
                        onChange={(e) => handleInputChange(e)}
                        sx={{ flex: 1 }}
                    />
                    <TextField
                        label="lastname"
                        type="text"
                        name='lastname'
                        InputLabelProps={{ shrink: true }}
                        value={filters.lastname}
                        onChange={(e) => handleInputChange(e)}
                        sx={{ flex: 1 }}
                    />
                  
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ height: '56px', alignSelf: 'stretch' }} // Aligns with input height
                    >
                        Filter
                    </Button>
                </Box>

                <Typography variant="subtitle1" component="h2" align="center" gutterBottom>
                    Results
                </Typography>

                <Box sx={{ overflowX: "scroll", maxHeight: "700px" }}>
                    {students.length > 0 ? (
                        <Table sx={{ overflowX: "scroll", maxHeight: "700px" }} aria-label="student table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Full Name</TableCell>
                                    <TableCell>Surname</TableCell>
                                    <TableCell>Ward</TableCell> {/* Replace with actual field */}
                                    <TableCell>Enumerator's Name</TableCell> {/* Replace with actual field */}
                                    {/* Add more headers as per your requirement */}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {students.map((student) => (
                                    <TableRow key={student._id}>
                                        <TableCell>{student.surname + student.firstname}</TableCell>
                                        <TableCell>{student.lga}</TableCell>
                                        <TableCell>{student.ward}</TableCell> {/* Replace with actual field */}
                                        <TableCell>{student.createdBy.fullName}</TableCell> {/* Replace with actual field */}
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
            </Box>

            <DataTable
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
            )}
        </>
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
