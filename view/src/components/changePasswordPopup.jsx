import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, TextField, Typography, Modal, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { SpinnerLoader } from './spinnerLoader';
import axios from 'axios';

export const ChangePasswordForm = ({ open, handleOpen, handleClose }) => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [message, setMessage] = useState(false);

    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: ''
    })
    const token = localStorage.getItem('token')
    const API_URL = `${import.meta.env.VITE_API_URL}/api/v1`

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prev) => (
            {
                ...prev,
                [name]: value
            }
        ))
    }, [])


    const handleSubmit = (e) => {
        e.preventDefault();
        (async () => {
            try {
                setLoading(true)
                const response = await axios.patch(`${API_URL}/admin-enumerator/change-password`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                });
                setLoading(false);
                setSuccess(true);
                setMessage(response?.data?.message);
                setFormData({
                    newPassword: "",
                    currentPassword: "",
                })
                setTimeout(() => {
                    setSuccess('');
                }, 8000)
            }
            catch (err) {
                console.log(err)
                setError(true)
                setLoading(false)
                setMessage(err.response?.data?.message)
                setTimeout(() => {
                    setError('');
                }, 8000)
            }
            finally {
                setLoading(false)
            }
        })()
    }






    return (
        <div>
            {/* Button to open the form */}
            <Button
                variant="contained"
                color="primary"
                onClick={handleOpen}
                sx={{
                    background: "#546e13"
                }}
            >
                Change Password
            </Button>

            {/* Popup Modal */}
            <Modal open={open} onClose={handleClose}>
                <Box
                    sx={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: { xs: '90%', sm: '400px' },
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    {/* Cancel Icon */}
                    <IconButton
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            color: 'grey.500',
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                    <Typography
                        variant="h6"
                        component="h2"
                        textAlign="center"
                        marginBottom={2}

                    >
                        Change Password
                    </Typography>

                    {/* Form Fields */}
                    <Box
                        onSubmit={handleSubmit}
                        component="form"
                        noValidate
                        autoComplete="off"
                        display="flex"
                        flexDirection="column"
                        gap={2}
                    >
                        <TextField
                            onChange={handleChange}
                            name={"currentPassword"}
                            value={formData.currentPassword}
                            label="Current Password"
                            type="password"
                            fullWidth
                            required
                        />
                        <TextField
                            onChange={handleChange}
                            name={"newPassword"}
                            value={formData.newPassword}
                            label="New Password"
                            type="password"
                            fullWidth
                            required
                        />

                        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
                            {loading && <SpinnerLoader />}
                            {!loading && error && <Typography color='red' fontWeight={600}>{message}</Typography>}
                            {!loading && success && <Typography color='green' fontWeight={600}>{message}</Typography>}

                        </Box>

                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ bgcolor: '#546e13', '&:hover': { bgcolor: '#43540f' } }}
                        >
                            Submit
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
};


