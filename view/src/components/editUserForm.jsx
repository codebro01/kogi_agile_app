import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Grid, Container, Typography, Box, IconButton, InputAdornment, MenuItem } from '@mui/material';
// import { useTheme } from '@mui/material/styles';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from 'axios';
import lgasAndWards from '../Lga&wards.json';
import { useParams } from 'react-router-dom';
import { SpinnerLoader } from './spinnerLoader';
axios.defaults.withCredentials = true;


export const EditUserForm = ({ formHeader, lga = true, gender = true, phone = true, passport = true, address = true, bankName = true, bvn = true, nin = true, accountNumber = true, pwd = true,   link, getPrevDataLink}) => {
    // const theme = useTheme();
    const navigate = useNavigate();
    const [validationError, setValidationError] = useState('');
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState('');
    const [fetchingPrevData, setFetchingPrevData] = useState(false)
    const [prevData, setPrevData] = useState([]);
    const API_URL = `${import.meta.env.VITE_API_URL}/api/v1`;

    const {id} = useParams()





    const [formData, setFormData] = useState({
        fullName: '',
        gender: '',
        phone: '',
        email: '',
        password: '',
        address: '',
        bankName: '',
        accountNumber: '',
        lga: '',
        bvn: '',
        nin: "",
        image: null,
    });

    const [showPassword, setShowPassword] = useState(false);


    


    const handleChange = useCallback((e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value,
        });

    }, [formData]);



    

    const handleSubmit = (e) => {
        console.log('submitting')
        e.preventDefault();
        (async () => {
            try {

                const token = localStorage.getItem('token');
                
                const response = await axios.patch(`${API_URL}/${link}`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                });
                console.log(formData)
                console.log(response)
                setSuccess('User updated Successfully');
                const success = true;
                // if (success) {
                //     setFormData({
                //         fullName: '',
                //         gender: '',
                //         phone: '',
                //         email: '',
                //         password: '',
                //         address: '',
                //         bankName: '',
                //         accountNumber: '',
                //         lga: '',
                //         bvn: '',
                //         nin: "",
                //         image: null,
                //     })
                // }
            } catch (err) {
                console.log(err)
                if (err.response.data.status === 401) return navigate('/sign-in')
                setValidationError(err.response?.data?.message || 'An error occurred');
                setTimeout(() => setValidationError(''), 3000);
            }
        })();

    };


    useEffect(() => {
        (async () => {
            setFetchingPrevData(true)
            try {

                const token = localStorage.getItem('token');

                const response = await axios.get(`${API_URL}/${getPrevDataLink}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                });
                console.log(response.data)
                 const role = response.data;
                setFetchingPrevData(false)

                setFormData({
                    fullName: role.fullName || '',
                    gender: role.gender || '',
                    phone: role.phone || '',
                    email: role.email || '',
                    address: role.address || '',
                    bankName: role.bankName || '',
                    accountNumber: role.accountNumber || '',
                    lga: role.lga || '',
                    bvn: role.bvn || '',
                    nin: role.nin || '',
                    image: null,
                })



            } catch (err) {
                console.log(err)
                if (err.response.data.status === 401) return navigate('/sign-in')
                setValidationError(err.response?.data?.message || 'An error occurred');
                setTimeout(() => setValidationError(''), 3000);
                setFetchingPrevData(false)
            }
        })()
    }, [id, navigate]);

    if (fetchingPrevData) return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "80vh",
                width: "100%"
            }}
        >
            <SpinnerLoader />
        </Box>
    )
 


    return (
        <Container maxWidth="sm" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', paddingTop: '16px', paddingBottom: '16px', marginTop: '32px', marginBottom: '50px' }}>
            <Box sx={{ p: 4, borderRadius: 2, boxShadow: 3, backgroundColor: 'white', width: '100%' }}>
                <Typography variant="h4" gutterBottom align="center" textTransform="uppercase" fontWeight="bolder" marginBottom="20px">
                    {formHeader}
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>


                        <Grid item xs={12}>
                            <TextField
                                label={'Full Name'}
                                name={'fullName'}
                                variant="outlined"
                                fullWidth
                                value={formData.fullName}
                                onChange={handleChange}
                                
                            />
                        </Grid>

                        {bvn && <Grid item xs={12}>
                            <TextField
                                label={'BVN'}
                                name={'bvn'}
                                variant="outlined"
                                fullWidth
                                value={formData.bvn}
                                onChange={handleChange}
                                
                            />
                        </Grid>}
                        
                        {nin && <Grid item xs={12}>
                            <TextField
                                label={'NIN'}
                                name={'nin'}
                                variant="outlined"
                                fullWidth
                                value={formData.nin}
                                onChange={handleChange}
                                
                            />
                        </Grid>}

                        {phone && <Grid item xs={12}>
                            <TextField
                                label={'Phone'}
                                name={'phone'}
                                variant="outlined"
                                fullWidth
                                value={formData.phone}
                                onChange={handleChange}
                                
                            />
                        </Grid>}

                        {accountNumber && <Grid item xs={12}>
                            <TextField
                                label={'Account Number'}
                                name={'accountNumber'}
                                variant="outlined"
                                fullWidth
                                value={formData.accountNumber}
                                onChange={handleChange}
                                
                            />
                        </Grid>}


                        {bankName && <Grid item xs={12}>
                            <TextField
                                select
                                label="Bank Name"
                                name="bankName"
                                variant="outlined"
                                fullWidth
                                value={formData.bankName}
                                onChange={handleChange}
                                
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
                        </Grid>}


                        {gender && <Grid item xs={12}>
                            <TextField
                                select
                                label="Gender"
                                name="gender"
                                variant="outlined"
                                fullWidth
                                value={formData.gender}
                                onChange={handleChange}
                                
                            >
                                {['Male', 'Female', 'Other'].map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        }
                       {lga &&  <Grid item xs={12}>
                            <TextField
                                select
                                label="LGA of PPA"
                                name="lga"
                                variant="outlined"
                                fullWidth
                                value={formData.lga}
                                onChange={handleChange}

                            >
                                {lgasAndWards.map((lga, index) => (
                                    <MenuItem key={index} value={lga.name}>
                                        {lga.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>}
                    

                        {passport && <Grid item xs={12}>
                            <Button
                                variant="contained"
                                component="label"
                                fullWidth
                                
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
                        </Grid>}

                        <Grid item xs={12}>
                            <Box textAlign="center">
                                <Button type="submit" variant="contained" color="primary" size="large">
                                    Submit
                                </Button>
                            </Box>
                        </Grid>

                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        >
                            {validationError && (
                                <Grid item xs={12}>
                                    {validationError && <Typography color="red" align="center">
                                        {validationError}
                                    </Typography>}

                                </Grid>
                            )}
                            {success && <Typography color="green" align="center">
                                {success}
                            </Typography>}
                        </Box>
                    </Grid>
                </form>
            </Box>
        </Container>
    );
};

