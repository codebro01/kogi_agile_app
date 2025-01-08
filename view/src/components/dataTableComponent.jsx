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
import { useAuth } from "../scenes/auth/authContext";




export const DataTable = ({showTotalStudentsRegistered = false, editInfo = true, url, data, fetchDataLoading, handleToggle, handleDelete, editNav, handleResetPassword, registerLink, tableHeader }) => {

const navigate = useNavigate();

    const { userPermissions } = useAuth();

    // ! Handle events 

   

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
                    {tableHeader}
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
                    onClick={() => navigate(registerLink)}
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
                            {showTotalStudentsRegistered && <TableCell>Total Registered Students</TableCell>} 
                            {editInfo && <TableCell>Edit</TableCell>} 
                            <TableCell>Reset Password</TableCell>
                            <TableCell>Active/Deactivate</TableCell>
                            {/* <TableCell>Delete</TableCell> */}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row) => (
                            <TableRow key={row.randomId}>
                                <TableCell>{row.randomId}</TableCell>
                                <TableCell>{row.fullName}</TableCell>
                                <TableCell>{row.email}</TableCell>
                                {showTotalStudentsRegistered && <TableCell>0</TableCell>} 
                                {editInfo && <TableCell>
                                    <IconButton
                                        color="primary"
                                        onClick={() => navigate(`${editNav}/${row._id}`)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                </TableCell>} 
                                <TableCell>
                                    <IconButton
                                        color="secondary"
                                        onClick={() => handleResetPassword(row._id)}
                                    >
                                        <LockIcon />
                                    </IconButton>
                                </TableCell>
                                <TableCell>
                                    <Switch
                                        checked={row.isActive}
                                        onChange={() => handleToggle(row._id, row.isActive )}
                                        color="secondary"
                                    />
                                </TableCell>
                                {/* <TableCell>
                                    <IconButton
                                        color="error"
                                        onClick={() => handleDelete(row.id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell> */}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};
