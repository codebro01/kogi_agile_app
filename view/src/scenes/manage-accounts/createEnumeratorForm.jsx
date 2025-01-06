import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Grid, Container, Typography, Box, IconButton, InputAdornment, MenuItem } from '@mui/material';
// import { useTheme } from '@mui/material/styles';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from 'axios';
axios.defaults.withCredentials = true;

export const CreateEnumerator = () => {
    // const theme = useTheme();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        gender: '',
        phone: '',
        email: '',
        password: '',
        address: '',
        bank: '',
        accountNumber: '',
        image: null,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [validationError, setValidationError] = useState('');
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState('');
    const API_URL = `${import.meta.env.VITE_API_URL}/api/v1`;

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = (event) => event.preventDefault();

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value,
        });

    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = {
            firstname: !formData.firstname,
            lastname: !formData.lastname,
            gender: !formData.gender,
            phone: !formData.phone,
            email: !formData.email || !/\S+@\S+\.\S+/.test(formData.email),
            password: !formData.password,
            address: !formData.address,
            bank: !formData.bank,
            accountNumber: !formData.accountNumber,
            image: !formData.image,
        };
        setErrors(newErrors);

        if (!Object.values(newErrors).includes(true)) {
            (async () => {
                try {

                    const token = localStorage.getItem('token');

                    const response = await axios.post(`${API_URL}/admin-enumerator/register`, formData, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data",
                        },
                        withCredentials: true,
                    });
                    setSuccess('Enumerator Created Successfully');
                } catch (err) {
                    console.log(err)
                    if (err.response.data.status === 401) return navigate('/sign-in')
                    setValidationError(err.response?.data?.message || 'An error occurred');
                    setTimeout(() => setValidationError(''), 3000);
                }
            })();
        }
    };

    return (
        <Container maxWidth="sm" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', paddingTop: '16px', paddingBottom: '16px', marginTop: '32px', marginBottom: '50px' }}>
            <Box sx={{ p: 4, borderRadius: 2, boxShadow: 3, backgroundColor: 'white', width: '100%' }}>
                <Typography variant="h4" gutterBottom align="center" textTransform="uppercase" fontWeight="bolder" marginBottom="20px">
                    Create Enumerator
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {[
                            { label: 'First Name', name: 'firstname' },
                            { label: 'Last Name', name: 'lastname' },
                            { label: 'Phone', name: 'phone' },
                            { label: 'Address', name: 'address' },
                            { label: 'Account Number', name: 'accountNumber' },
                        ].map(({ label, name }) => (
                            <Grid item xs={12} key={name}>
                                <TextField
                                    label={label}
                                    name={name}
                                    variant="outlined"
                                    fullWidth
                                    value={formData[name]}
                                    onChange={handleChange}
                                    error={errors[name]}
                                    helperText={errors[name] && `${label} is required`}
                                />
                            </Grid>
                        ))}

                        <Grid item xs={12}>
                            <TextField
                                select
                                label="Bank Name"
                                name="bank"
                                variant="outlined"
                                fullWidth
                                value={formData.bank}
                                onChange={handleChange}
                                error={errors.bank}
                                helperText={errors.bank && 'Bank Name is required'}
                            >
                                {[
                                    'Access Bank', 'Citibank Nigeria', 'Diamond Bank', 'Ecobank Nigeria', 'Fidelity Bank',
                                    'First Bank of Nigeria', 'Guaranty Trust Bank', 'Heritage Bank', 'Jaiz Bank', 'Keystone Bank',
                                    'Lapo Microfinance Bank', 'Mainstreet Bank', 'Polaris Bank', 'Stanbic IBTC Bank', 'Sterling Bank',
                                    'Union Bank', 'United Bank for Africa (UBA)', 'Wema Bank', 'Zenith Bank'
                                ].map((bank) => (
                                    <MenuItem key={bank} value={bank}>
                                        {bank}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>


                        <Grid item xs={12}>
                            <TextField
                                select
                                label="Gender"
                                name="gender"
                                variant="outlined"
                                fullWidth
                                value={formData.gender}
                                onChange={handleChange}
                                error={errors.gender}
                                helperText={errors.gender && 'Gender is required'}
                            >
                                {['Male', 'Female', 'Other'].map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Email"
                                name="email"
                                variant="outlined"
                                fullWidth
                                value={formData.email}
                                onChange={handleChange}
                                error={errors.email}
                                helperText={errors.email && 'Valid email is required'}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                variant="outlined"
                                fullWidth
                                value={formData.password}
                                onChange={handleChange}
                                error={errors.password}
                                helperText={errors.password && 'Password is required'}
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
                            <Button
                                variant="contained"
                                component="label"
                                fullWidth
                                error={errors.image}
                                helperText={errors.image && 'image is required'}
                            >
                                Upload image
                                <input
                                    type="file"
                                    name="image"
                                    hidden
                                    accept="image/*"
                                    onChange={handleChange}
                                />
                            </Button>
                        </Grid>

                        <Grid item xs={12}>
                            <Box textAlign="center">
                                <Button type="submit" variant="contained" color="primary" size="large">
                                    Submit
                                </Button>
                            </Box>
                        </Grid>

                        {validationError && (
                            <Grid item xs={12}>
                                {validationError && <Typography color="error" align="center">
                                    {validationError}
                                </Typography>}

                            </Grid>
                        )}
                        {success && <Typography color="success" align="center">
                            {success}
                        </Typography>}
                    </Grid>
                </form>
            </Box>
        </Container>
    );
};

export default CreateEnumerator;
