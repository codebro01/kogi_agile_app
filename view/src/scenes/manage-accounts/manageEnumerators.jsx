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

export const ManageEnumerators = () => {
    const [enumeratorId, setEnumeratorId] = useState('');
    const [startDate, setStartDate] = useState('');
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

    const handleResetPassword = async (id) => {
        try {
            const response = await axios.patch(
                `${API_URL}/admin-enumerator/reset-password`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    params: { id },
                    withCredentials: true,
                }
            );
            setMessage('Password reset successful!');
            setShowModal(true);
        } catch (error) {
            setMessage(error.response?.data?.message);
            setShowModal(true);
            console.error('Error resetting password:', error.response?.data || error.message);
        }
    }

    const handleToggle = useCallback(async (id, currentStatus) => {
        try {
            const response = await axios.patch(
                `${API_URL}/admin-enumerator/toggle-status`,
                {}, // Body is empty for this request
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    params: { id }, // Query parameter with id
                    withCredentials: true,
                }
            );

            // Update the status in the parent state
            setData((prevData) =>
                prevData.map((item) =>
                    item._id === id ? { ...item, isActive: !currentStatus } : item
                )
            );

            setMessage(response.data?.message);
            setShowModal(true);
        } catch (err) {
            setMessage(err.response?.data?.message);
            setShowModal(true);
        }
    }, []);  // No data in the dependency array


    const handleDelete = useCallback((id) => {
        setData((prevData) => prevData.filter((row) => row.id !== id));
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setDataFetchLoading(true);
                const response = await axios.get(`${API_URL}/admin-enumerator`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                });
                setData(response.data.registrars);
                setDataFetchLoading(false);
            } catch (err) {
                setDataFetchLoading(false);
            }
        };
        fetchData();
    }, [handleToggle, handleDelete]);



// ! Here handle filters 
    const handleFilter = async () => {
        try {
            const response = await axios.get(`${API_URL}/student/from-to`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    startDate,
                    endDate,
                },
                withCredentials: true,
            });
            setStudents(response.data.students);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

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
                component={Paper}
                elevation={2}
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
                        label="Start Date"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        sx={{ flex: 1 }}
                    />
                    <TextField
                        label="End Date"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        sx={{ flex: 1 }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleFilter}
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
                        <Table sx={{  overflowX:"scroll", maxHeight: "700px" }} aria-label="student table">
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
                handleToggle={handleToggle}
                handleDelete={handleDelete}
                editNav={'edit-enumerator'}
                handleResetPassword={handleResetPassword}
                registerLink={'/admin-dashboard/create-accounts/register-enumerator'}
                tableHeader={'MANAGE ENUMERATORS'}
                showTotalStudentsRegistered = {true}
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
