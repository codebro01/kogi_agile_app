import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Grid, Container, Typography, Box, IconButton, InputAdornment } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from 'axios';

const SignInForm = () => {
    const theme = useTheme();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [validationError, setValidationError] = useState('')




    const [showPassword, setShowPassword] = useState(false);
    const API_URL = import.meta.env.VITE_API_URL / api / v1;
    const navigate = useNavigate();
    const handleClickShowPassword = () => setShowPassword(!showPassword);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const [errors, setErrors] = useState({
        email: false,
        password: false,
    });


    // Handle input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Handle form submit
    const handleSubmit = (e) => {
        e.preventDefault();

        // Simple validation
        const newErrors = {
            email: !formData.email || !/\S+@\S+\.\S+/.test(formData.email),
            password: !formData.password,
        };
        setErrors(newErrors);



        if (!Object.values(newErrors).includes(true)) {
            // Submit form if no errors
            console.log('Form Submitted:', formData);
        }

        (async () => {
            try {
                const response = await axios.post(`${API_URL}/admin-admin/login`, formData, { withCredentials: true });
                const { tokenUser } = response.data;
                localStorage.setItem('userData', JSON.stringify(tokenUser));
                navigate('/admin-dashboard')

            }
            catch (err) {
                navigate('/sign-in')
                console.log(err.response?.data?.message);
                setValidationError(err.response?.data?.message);
                setTimeout(() => {
                    setValidationError('');
                }, 3000)
            }
        })();


    };

    return (
        <Container maxWidth="100w" sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            width: "100%",
            backgroundImage: "url('./landing-agile.jpg')", // Add your image URL here
            backgroundSize: "cover", // Makes the background image cover the entire container
            backgroundPosition: "center",
        }}>
            <Box sx={{
                marginTop: theme.spacing(4),
                boxShadow: 3, // Material-UI's shadow scale (1 to 24)
                padding: 3,
                borderRadius: 2,
                backgroundColor: "white", // Optional: Ensure a background color for visibility
                maxWidth: 350, // Optional: Set a maximum width for the form
                margin: "0 auto",
            }}>
                <Typography variant="h4" gutterBottom align="center">
                    Sign In
                </Typography>
                <form onSubmit={handleSubmit} >
                    <Grid container spacing={2}>


                        <Grid item xs={12}>
                            <TextField
                                label="Email"
                                name="email"
                                variant="outlined"
                                fullWidth
                                value={formData.email}
                                onChange={handleChange}
                                error={errors.email}
                                helperText={errors.email ? 'Valid email is required' : ''}

                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                variant="outlined"
                                fullWidth
                                value={formData.password}
                                onChange={handleChange}
                                error={errors.password}
                                helperText={errors.password ? "Password is required" : ""}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Box textAlign="center">
                                <Button type="submit" variant="contained" color="primary" size="large">
                                    Submit
                                </Button>
                            </Box>
                        </Grid>
                        <Typography variant='p'>
                            {validationError && validationError}
                        </Typography>
                    </Grid>
                </form>
            </Box>
        </Container>
    );
};

export default SignInForm;
