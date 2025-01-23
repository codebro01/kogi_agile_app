import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { TextField, MenuItem, Button, Box, Typography } from '@mui/material';
import lgaAndWards from '../../Lga&wards.json';
import axios from 'axios';

export const CreateSchool = () => {
    const validationSchema = yup.object().shape({
        schoolName: yup.string().required('School Name is required'),
        schoolCategory: yup.string().required('School Category is required'),
        schoolCode: yup
            .string()
            .matches(/^\d{8}$/, 'School Code must be exactly 8 digits')
            .required('School Code is required'),
        LGA: yup.string().required('LGA is required'),
        schoolType: yup.string(),
    });

    const handleSubmit = async (values, resetForm) => {
        const token = localStorage.getItem('token');
        const API_URL = `${import.meta.env.VITE_API_URL}/api/v1`;


     try {
         const response = await axios.post(`${API_URL}/schools`, {...values }, {
             headers: {
                 Authorization: `Bearer ${token}`,
                 'Content-Type': 'application/json',
             },
             withCredentials: true,
         });    

         resetForm();
     }
     catch(err) {
        console.log(err)
     }
    
    
    };

    return (
        <Box
            sx={{
                padding: 1,
            }}
        >
            <Formik
                initialValues={{
                    schoolName: '',
                    schoolCategory: '',
                    schoolCode: '',
                    LGA: '',
                    schoolType: '',
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { resetForm }) => handleSubmit(values, resetForm)}
            >
                {({ values, handleChange, handleBlur }) => (
                    <Form>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2,
                                maxWidth: 400,
                                margin: '0 auto',
                                padding: 4,
                                border: '1px solid #ccc',
                                borderRadius: 2,
                                backgroundColor: '#f9f9f9',
                                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                            }}
                        >
                            <Typography variant="h4" component="h1" textAlign="center" mb={2}>
                                Add School
                            </Typography>

                            {/* School Name */}
                            <Field name="schoolName">
                                {({ field, form }) => (
                                    <TextField
                                        {...field}
                                        label="School Name"
                                        variant="outlined"
                                        fullWidth
                                        error={!!values.schoolName && !field.value}
                                        helperText={<ErrorMessage name="schoolName" />}
                                        onChange={(event) => {
                                            const uppercaseValue = event.target.value.toUpperCase();
                                            form.setFieldValue("schoolName", uppercaseValue); // Update form state
                                        }}                                        
                                        onBlur={handleBlur}
                                    />
                                )}
                            </Field>

                            {/* School Category */}
                            <Field name="schoolCategory">
                                {({ field }) => (
                                    <TextField
                                        {...field}
                                        select
                                        label="School Category"
                                        variant="outlined"
                                        fullWidth
                                        error={!!values.schoolCategory && !field.value}
                                        helperText={<ErrorMessage name="schoolCategory" />}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    >
                                        <em value = "">Select School Category</em>
                                        <MenuItem value="ECCDE">ECCDE</MenuItem>
                                        <MenuItem value="ECCDE AND PRIMARY">ECCDE AND PRIMARY</MenuItem>
                                        <MenuItem value="PRIMARY">PRIMARY</MenuItem>
                                        <MenuItem value="Public JSS">Public JSS</MenuItem>
                                        <MenuItem value="Public JSS/SSS">Public JSS/SSS</MenuItem>
                                        <MenuItem value="Science & Vocational">Science & Vocational</MenuItem>
                                    </TextField>
                                )}
                            </Field>

                            {/* School Code */}
                            <Field name="schoolCode">
                                {({ field }) => (
                                    <TextField
                                        {...field}
                                        label="School Code"
                                        type="number"
                                        variant="outlined"
                                        fullWidth
                                        error={!!values.schoolCode && !field.value}
                                        helperText={<ErrorMessage name="schoolCode" />}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                )}
                            </Field>

                            {/* LGA */}
                            <Field name="LGA">
                                {({ field }) => (
                                    <TextField
                                        {...field}
                                        select
                                        label="LGA"
                                        variant="outlined"
                                        fullWidth
                                        error={!!field.value && !field.value}
                                        helperText={<ErrorMessage name="LGA" />}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    >
                                        {lgaAndWards.map((lga, index) => (
                                            <MenuItem key={index} value={lga.name}>
                                                {lga.name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                )}
                            </Field>


                            {/* School Type */}
                            <Field name="schoolType">
                                {({ field }) => (
                                    <TextField
                                        {...field}
                                        label="School Type (Optional)"
                                        variant="outlined"
                                        fullWidth
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                )}
                            </Field>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                sx={{
                                    mt: 2,
                                    background: "#196b57",
                                    "&:hover": {
                                        background: "#145a47", // Optional: Change background color on hover
                                        color: "#ffffff", // Change text color on hover
                                    },
                                }}
                            >
                                Add School
                            </Button>

                        </Box>
                    </Form>
                )}
            </Formik>
        </Box>
    );
};
