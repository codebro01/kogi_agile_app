import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme, TextField, Divider, Button, Grid, Container, Typography, Box, IconButton, InputAdornment, Paper } from '@mui/material';
// import { useTheme } from '@mui/material/styles';
import { tokens } from "../../theme";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from 'axios';
import { useAuth } from './authContext'; // Import useAuth
import { SpinnerLoader } from '../../components/spinnerLoader';


export const SignInForm = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode)
    const [validationError, setValidationError] = useState('');
    const [isLoading, setIsLoading] = useState(false)

    const { login, userPermissions } = useAuth(); // Access login function from context



    const [showPassword, setShowPassword] = useState(false);
    const API_URL = `${import.meta.env.VITE_API_URL}/api/v1`
    const navigate = useNavigate();
    const handleClickShowPassword = () => setShowPassword(!showPassword);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

 




    // Handle form submit
    const handleSubmit = (e) => {
        e.preventDefault();

     
        const formData = new FormData(e.currentTarget);
        const email = formData.get('email');
        const password = formData.get('password');





            (async () => {
                try {
                    setIsLoading(true)
                    const response = await axios.post(`${API_URL}/admin-admin/login`, {email, password}, { withCredentials: true });
                    const { token, tokenUser, allPermissionNames } = response.data;

                    login(token, tokenUser, allPermissionNames); // Set token globally using context
                    if (userPermissions.includes('handle_registrars')) {
                        navigate('/admin-dashboard');
                    } else {
                        navigate('/dashboard/sign-in');
                    }
                    setIsLoading(false)
                    console.log(response)

                }
                catch (err) {
                    navigate('/dashboard/sign-in')
                    setIsLoading(false)
                    console.log(err);
                    setValidationError(err.response?.message);
                    setTimeout(() => {
                        setValidationError('');
                    }, 3000)
                }
            })();
        



    };

    return (
        <Box
            sx={{
                backgroundImage: `url("/landing-agile.jpg")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: "column",
                gap: "2rem"
            }}
        >



            <Container maxWidth="xs">
                <Paper
                    elevation={6}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 4,
                        borderRadius: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.85)',
                    }}
                >

                    <Box
                        component="img"
                        src="/portal-landing-logo.png" // Replace with your logo path
                        alt="Logo"
                        sx={{

                            // position: "absolute",
                            // top: 16, // Distance from the top of the form
                            // left: 16, // Distance from the left of the form
                            width: 200, // Adjust logo size
                            height: "auto",
                        }}
                    />

                    <Divider
                        sx={{
                            marginY: 2,
                            "&::before, &::after": {
                                borderColor: colors.main["darkGreen"], // Line color
                            },
                            fontSize: "1.2rem",
                            color: colors.main["darkGreen"], // Text color
                            fontWeight: "bold", // Text weight
                            width: "100%"
                        }}
                    >
                        ADMIN SIGN IN
                    </Divider>


                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                        sx={{ mt: 2 }}
                    >
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            sx={{
                                borderColor: colors.main["lightGreen"],
                            }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                mt: 3,
                                mb: 2,
                                fontSize: "1.2rem",
                                background: validationError
                                    ? "red" // Highlight button if there's a validation error
                                    : isLoading
                                        ? "white"
                                        : colors.main["darkGreen"],
                                color: validationError ? "white" : "inherit", // Adjust text color for error state
                                "&:hover": {
                                    background: validationError
                                        ? "darkred"
                                        : colors.main["lightGreen"],
                                    opacity: 0.9, // Slightly transparent on hover
                                },
                            }}
                            disabled={isLoading || !!validationError} // Disable butt   on if loading or error exists
                        >
                            {isLoading ? <SpinnerLoader /> : "Submit"}
                        </Button>

                        {/* Render validation error message */}
                        {validationError && (
                            <Typography
                                sx={{
                                    color: "red",
                                    fontSize: "0.9rem",
                                    mt: 1, // Add spacing between button and error message
                                    textAlign: "center",
                                }}
                            >
                                {validationError}
                            </Typography>
                        )}




                        <Box textAlign="center" sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                            <Typography fontWeight="600">
                                POWERED BY
                            </Typography>

                            <Typography fontWeight="600" sx={{
                                color: colors.main["darkGreen"]
                            }}>
                                KOGI STATE MINISTRY OF EDUCATION
                            </Typography>
                        </Box>

                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export const EnumeratorSignInForm = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode)
    const { login, userPermissions } = useAuth(); // Access login function from context
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate();
    const API_URL = `${import.meta.env.VITE_API_URL}/api/v1`;

    const [validationError, setValidationError] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const email = formData.get('email');
        const password = formData.get('password');

        (async () => {
            try {
                setIsLoading(true)
                const response = await axios.post(`${API_URL}/admin-enumerator/login`, { email, password }, { withCredentials: true });

                const { token, tokenUser, allPermissionNames } = response.data;

                // Update context or state
                await login(token, tokenUser, allPermissionNames);
                setIsLoading(false)
                // Check permissions and navigate
                if (allPermissionNames.includes('handle_students')) {
                    navigate('/enumerator-dashboard');
                } else {
                    navigate('/sign-in');
                }
            } catch (err) {
                setIsLoading(false)
                console.error('Login Error:', err.response?.data?.message);
                setValidationError(err.response?.data?.message);
                formData.password = "";
                setTimeout(() => {
                    setValidationError('');
                }, 10000);
            } finally {
                setIsLoading(false)
            }
        })();


    };


    return (
        <Box
            sx={{
                backgroundImage: `url("/landing-agile.jpg")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: "column",
                gap: "2rem"
            }}
        >



            <Container maxWidth="xs">
                <Paper
                    elevation={6}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 4,
                        borderRadius: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.85)',
                    }}
                >

                    <Box
                        component="img"
                        src="/portal-landing-logo.png" // Replace with your logo path
                        alt="Logo"
                        sx={{

                            // position: "absolute",
                            // top: 16, // Distance from the top of the form
                            // left: 16, // Distance from the left of the form
                            width: 200, // Adjust logo size
                            height: "auto",
                        }}
                    />

                    <Divider
                        sx={{
                            marginY: 2,
                            "&::before, &::after": {
                                borderColor: colors.main["darkGreen"], // Line color
                            },
                            fontSize: "1.2rem",
                            color: colors.main["darkGreen"], // Text color
                            fontWeight: "bold", // Text weight
                            width: "100%"
                        }}
                    >
                        SIGN IN
                    </Divider>


                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                        sx={{ mt: 2 }}
                    >
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            sx={{
                                borderColor: colors.main["lightGreen"],
                            }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                mt: 3,
                                mb: 2,
                                fontSize: "1.2rem",
                                background: validationError
                                    ? "red" // Highlight button if there's a validation error
                                    : isLoading
                                        ? "white"
                                        : colors.main["darkGreen"],
                                color: validationError ? "white" : "inherit", // Adjust text color for error state
                                "&:hover": {
                                    background: validationError
                                        ? "darkred"
                                        : colors.main["lightGreen"],
                                    opacity: 0.9, // Slightly transparent on hover
                                },
                            }}
                            disabled={isLoading || !!validationError} // Disable butt   on if loading or error exists
                        >
                            {isLoading ? <SpinnerLoader /> : "Submit"}
                        </Button>

                        {/* Render validation error message */}
                        {validationError && (
                            <Typography
                                sx={{
                                    color: "red",
                                    fontSize: "0.9rem",
                                    mt: 1, // Add spacing between button and error message
                                    textAlign: "center",
                                }}
                            >
                                {validationError}
                            </Typography>
                        )}


                       

                        <Box textAlign="center" sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                            <Typography  fontWeight="600">
                                POWERED BY
                            </Typography>
                        
                            <Typography  fontWeight="600" sx = {{
                                color: colors.main["darkGreen"]
                            }}>
                                KOGI STATE MINISTRY OF EDUCATION
                            </Typography>
                        </Box>

                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};


export const PayrollSpecialistSignInForm = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode)
    const { login, userPermissions } = useAuth(); // Access login function from context
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate();
    const API_URL = `${import.meta.env.VITE_API_URL}/api/v1`;

    const [validationError, setValidationError] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const email = formData.get('email');
        const password = formData.get('password');

        (async () => {
            try {
                setIsLoading(true)
                const response = await axios.post(`${API_URL}/payroll-specialists/login`, { email, password }, { withCredentials: true });

                const { token, tokenUser, allPermissionNames } = response.data;

                // Update context or state
                await login(token, tokenUser, allPermissionNames);
                setIsLoading(false)
                // Check permissions and navigate
                if (allPermissionNames.includes('handle_students')) {
                    navigate('/enumerator-dashboard');
                } else {
                    navigate('/sign-in');
                }
            } catch (err) {
                setIsLoading(false)
                console.error('Login Error:', err.response?.data?.message);
                setValidationError(err.response?.data?.message);
                formData.password = "";
                setTimeout(() => {
                    setValidationError('');
                }, 10000);
            } finally {
                setIsLoading(false)
            }
        })();


    };


    return (
        <Box
            sx={{
                backgroundImage: `url("/landing-agile.jpg")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: "column",
                gap: "2rem"
            }}
        >



            <Container maxWidth="xs">
                <Paper
                    elevation={6}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 4,
                        borderRadius: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.85)',
                    }}
                >

                    <Box
                        component="img"
                        src="/portal-landing-logo.png" // Replace with your logo path
                        alt="Logo"
                        sx={{

                            // position: "absolute",
                            // top: 16, // Distance from the top of the form
                            // left: 16, // Distance from the left of the form
                            width: 200, // Adjust logo size
                            height: "auto",
                        }}
                    />

                    <Divider
                        sx={{
                            marginY: 2,
                            "&::before, &::after": {
                                borderColor: colors.main["darkGreen"], // Line color
                            },
                            fontSize: "1.2rem",
                            color: colors.main["darkGreen"], // Text color
                            fontWeight: "bold", // Text weight
                            width: "100%"
                        }}
                    >
                        PAYROLL SPECIALIST SIGN IN
                    </Divider>


                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                        sx={{ mt: 2 }}
                    >
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            sx={{
                                borderColor: colors.main["lightGreen"],
                            }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                mt: 3,
                                mb: 2,
                                fontSize: "1.2rem",
                                background: validationError
                                    ? "red" // Highlight button if there's a validation error
                                    : isLoading
                                        ? "white"
                                        : colors.main["darkGreen"],
                                color: validationError ? "white" : "inherit", // Adjust text color for error state
                                "&:hover": {
                                    background: validationError
                                        ? "darkred"
                                        : colors.main["lightGreen"],
                                    opacity: 0.9, // Slightly transparent on hover
                                },
                            }}
                            disabled={isLoading || !!validationError} // Disable butt   on if loading or error exists
                        >
                            {isLoading ? <SpinnerLoader /> : "Submit"}
                        </Button>

                        {/* Render validation error message */}
                        {validationError && (
                            <Typography
                                sx={{
                                    color: "red",
                                    fontSize: "0.9rem",
                                    mt: 1, // Add spacing between button and error message
                                    textAlign: "center",
                                }}
                            >
                                {validationError}
                            </Typography>
                        )}




                        <Box textAlign="center" sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                            <Typography fontWeight="600">
                                POWERED BY
                            </Typography>

                            <Typography fontWeight="600" sx={{
                                color: colors.main["darkGreen"]
                            }}>
                                KOGI STATE MINISTRY OF EDUCATION
                            </Typography>
                        </Box>

                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};
