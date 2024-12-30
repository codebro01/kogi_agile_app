import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Grid, Container, Typography, Box, IconButton, InputAdornment, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from 'axios';
import { useAuth } from './authContext'; // Import useAuth


 export const SignInForm = () => {
    const theme = useTheme();
    const { login, userPermissions } = useAuth(); // Access login function from context
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [validationError, setValidationError] = useState('')



    const [showPassword, setShowPassword] = useState(false);
    const API_URL = 'http://localhost:3100/api/v1';
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
        
            console.log('Form Submitted:', formData);

            
        (async () => {
            try {
                const response = await axios.post(`${API_URL}/admin-admin/login`, formData, {withCredentials: true});
                console.log(response) 
                const {token, tokenUser, allPermissionNames} = response.data;
                console.log('allPermissionNames:', allPermissionNames);

                login(token, tokenUser, allPermissionNames); // Set token globally using context
if (userPermissions.includes('handle_registrars')) {
    navigate('/admin-dashboard');
}  else {
    navigate('/dashboard/sign-in');
}

            }
            catch (err) {
                navigate('/dashboard/sign-in')
                console.log(err.response?.message);
                setValidationError(err.response?.message);
                setTimeout(()=> {
                    setValidationError('');
                }, 3000)
            }
        })();
        }


      
    };

    return (
        <Container maxWidth="100w" sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh", 
            width: "100%",
            backgroundImage: "url('/landing-agile.jpg')", // Add your image URL here
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
                <Typography variant="h4" gutterBottom align = "center">
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
                        <Typography variant = 'p'>
                                {validationError && validationError}
                        </Typography>
                    </Grid>
                </form>
            </Box>
        </Container>
    );
};

export const EnumeratorSignInForm = () => {

    const { login, userPermissions } = useAuth(); // Access login function from context
    const navigate = useNavigate();
        const API_URL = 'http://localhost:3100/api/v1';

const [validationError, setValidationError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');

    console.log({ email, password });
        (async () => {
            try {
                const response = await axios.post(`${API_URL}/admin-enumerator/login`, {email, password}, {withCredentials: true});
                console.log(response) 
                const {token, tokenUser, allPermissionNames} = response.data;
                console.log('allPermissionNames:', allPermissionNames);

                login(token, tokenUser, allPermissionNames); // Set token globally using context

if (userPermissions.includes('handle_students')) {
    navigate('/enumerator-dashboard');
} else {
    navigate('/sign-in');
}

            }
            catch (err) {
                console.log(err.response?.data?.message);
                formData.password = "";
                // navigate('/dashboard/sign-in')
                console.log(err.response?.message);
                setValidationError(err.response?.data?.message);
                setTimeout(()=> {
                    setValidationError('');
                }, 10000)
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
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={6}
          sx={{
            padding: 4,
            borderRadius: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
          }}
        >
          <Typography variant="h5" align="center" gutterBottom>
            Sign In
          </Typography>
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
                backgroundColor: '#1976d2',
                ':hover': { backgroundColor: '#1565c0' },
              }}
            >
              Sign In
            </Button>

            {validationError && (
  <Box textAlign="center">
    <Typography color="red" fontWeight="600">
      {validationError}
    </Typography>
  </Box>
)}
            
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

