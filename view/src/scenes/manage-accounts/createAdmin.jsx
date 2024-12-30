import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import {
    Box,
    Button,
    TextField,
    Typography,
    Input,
    FormControl,
    InputLabel,
} from "@mui/material";

export const CreateAdmin = () => {
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        image: null,
    });
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const API_URL = 'http://localhost:3100/api/v1';
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Log the form data to verify
        console.log(formData);
        (async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.post(`${API_URL}/admin-admin/register`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                    withCredentials: true,
                });
                setSuccess('Admin successfully created')
                console.log(response)
            } catch (err) {

                if (err.response.status === 401) return navigate('/sign-in')
                setError(err.response?.data?.message || 'An error occurred');
                setTimeout(() => setError(''), 3000); console.log(err)
            }
        })()

        // Form submission logic goes here
    };

    return (
        <Box
            sx={{
                maxWidth: 500,
                mx: "auto",
                mt: 5,
                p: 3,
                border: "1px solid #ddd",
                borderRadius: 2,
                boxShadow: 1,
            }}
        >
            <Typography variant="h5" gutterBottom>
                Register Admin
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    margin="normal"
                    label="First Name"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleChange}
                    required
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Last Name"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    required
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <FormControl fullWidth margin="normal">
                    <InputLabel shrink>Upload Image</InputLabel>
                    <Input
                        type="file"
                        name="image"
                        inputProps={{ accept: "image/*" }}
                        onChange={handleImageChange}
                    />
                </FormControl>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                >
                    Register
                </Button>
                {success && <Typography>{success}</Typography>}
                {error && <Typography>{error}</Typography>}
            </form>
        </Box>
    );
};

