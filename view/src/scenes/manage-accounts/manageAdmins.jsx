import React, { useCallback, useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Switch,
    IconButton,
    Typography,
    Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import LockIcon from "@mui/icons-material/Lock";
import AddIcon from "@mui/icons-material/Add";
import axios from 'axios';
import { useNavigate } from "react-router-dom";




const DataTable = () => {
    const [data, setData] = useState([]);
    const [fetchDataLoading, setDataFetchLoading] = useState(false);
    const API_URL = `${import.meta.env.VITE_API_URL}/api/v1`;
    const token = localStorage.getItem('token');
    const navigate = useNavigate()

    // ! Handle events 

    const handleToggle = useCallback(async (id) => {
        
             try {
                 const response = await axios.patch(`${API_URL}/admin-admin/update`, {
                     headers: {
                         Authorization: `Bearer ${token}`,
                         'Content-Type': 'application/json',
                     },
                     withCredentials: true,
                 });

                 console.log(response)
            }
             catch (err) {
                 console.log(err)
             }

    }, []);

    const handleDelete = useCallback((id) => {
        setData((prevData) => prevData.filter((row) => row.id !== id));
    }, []);

    useEffect(() => {

           const fetchData = async () => {
            try {
                setDataFetchLoading(true);

                const response = await axios.get(`${API_URL}/admin-admin`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                });

                console.log(response);
                setData(response.data.admins)
                setDataFetchLoading(false);
            }
            catch(err) {
                console.log(err)
                setDataFetchLoading(false);

            }
            finally {
                setDataFetchLoading(false)
            }
           }

           fetchData()




    }, [handleToggle, handleDelete]);
    

    if (fetchDataLoading) return (<p>Loading data.....</p>)

    return (
        <Paper elevation={3} sx={{ padding: "16px" }}>
            {/* Table Header */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "16px",
                }}
            >
                <Typography
                    variant="h5"
                    sx={{ fontWeight: "bold", color: "#196b57" }}
                >
                    User Management
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{
                        bgcolor: "#196b57",
                        "&:hover": { bgcolor: "#145a46" },
                        color: "#fff",
                        fontWeight: "bold",
                        textTransform: "none",
                    }}
                    onClick={() => console.log("Add new entry")}
                >
                    Add New User
                </Button>
            </Box>

            {/* Table */}
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Edit</TableCell>
                            <TableCell>Reset Password</TableCell>
                            <TableCell>Active/Deactivate</TableCell>
                            <TableCell>Delete</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row) => (
                            <TableRow key={row.randomId}>
                                <TableCell>{row.randomId}</TableCell>
                                <TableCell>{row.fullName}</TableCell>
                                <TableCell>{row.email}</TableCell>
                                <TableCell>
                                    <IconButton
                                        color="primary"
                                        onClick={() => navigate(`edit-admin/${row._id}`)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        color="secondary"
                                        onClick={() =>
                                            console.log(`Edit Password for ID ${row._id}`)
                                        }
                                    >
                                        <LockIcon />
                                    </IconButton>
                                </TableCell>
                                <TableCell>
                                    <Switch
                                        checked={row.active}
                                        onChange={() => handleToggle(row._id)}
                                        color="primary"
                                    />
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        color="error"
                                        onClick={() => handleDelete(row.id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );  
};

export default DataTable;
