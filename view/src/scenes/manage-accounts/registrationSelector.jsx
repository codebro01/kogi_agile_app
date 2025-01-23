import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Typography,
    Autocomplete,
    TextField, Grid, FormControl, MenuItem, InputLabel, Select,
    colors
} from "@mui/material";
import { useAuth } from '../auth/authContext.jsx';
import { SchoolsContext } from "../../components/dataContext.jsx"; // Import context
import { SpinnerLoader } from "../../components/spinnerLoader.jsx";
import { useDispatch, useSelector } from 'react-redux'
import { fetchSchools, setSelectedSchool } from '../../components/schoolsSlice.js';


const RegistrationSelector = () => {

    const dispatch = useDispatch();
    const schoolState = useSelector(state => state.schools);
    const { data: schoolsData, selectedSchool, loading } = schoolState;

    const schools = schoolsData;
    const [selectedSchoolState, setSelectedSchoolState] = useState(null); // State to hold the selected school object
    const [schoolOptions, setSchoolOptions] = useState([]); // Start with an empty array
    const [hasMore, setHasMore] = useState(true); // To check if more data is available
    const [loadingSchools, setLoadingSchools] = useState(false); // Loading state for schools
    const [page, setPage] = useState(1); // Keep track of the current page

    // Fetch schools once the component mounts or the schools array changes

    useEffect(() => {
        dispatch(fetchSchools());
    }, [dispatch])

    useEffect(() => {
        if (schools && schools.length > 0) {
            setSchoolOptions(schools); // Set schools if available
        }
    }, [schools]); // Re-run whenever schools change



    // Function to load more schools when the user scrolls to the end
    const loadMoreSchools = async () => {
        if (loadingSchools || !hasMore) return;

        setLoadingSchools(true);

        // Fetch the next batch of schools here (this is just a mock-up)
        const nextSchools = await fetchMoreSchools(page);

        if (nextSchools.length > 0) {
            setSchoolOptions((prev) => [...prev, ...nextSchools]); // Append new schools to the list
            setPage((prev) => prev + 1); // Increment the page
        } else {
            setHasMore(false); // No more schools to load
        }

        setLoadingSchools(false);
    };

    // Mock function to simulate fetching more schools from a backend
    const fetchMoreSchools = async (page) => {
        // Simulate network request to fetch schools for the current page
        return new Promise((resolve) => {
            setTimeout(() => {
                const startIndex = (page - 1) * 20;
                resolve(schools.slice(startIndex, startIndex + 20)); // Return a slice of the schools array
            }, 1000);
        });
    };

    // Handle form submission (navigate to the next page)
    const handleSchoolSubmit = () => {
        if (!selectedSchoolState) {
            alert('Please select a school.');
            return;
        }
        sessionStorage.setItem('selectedSchool', JSON.stringify(selectedSchool));
        window.location.href = '/enumerator-dashboard/create-accounts/register-student' // Reload the page after navigation

    };


    if (loading) {
        return <Box sx={{
            display: "flex", // Corrected from 'dispflex'
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
            width: "90vw"
        }}
        >
            <SpinnerLoader />
        </Box>
    }


    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                gap: 3,
                maxWidth: "100%",
                backgroundImage: `url('/landing-agile.jpg')`,
                backgroundSize: "cover",
                backgroundPosition: "center"
            }}
        >
            <>
                <Grid
                    container
                    justifyContent="center"
                    alignItems="center"
                    sx={{
                        backgroundColor: 'rgba(245, 245, 245, 0.7)', // Light gray background
                        padding: 3,
                        borderRadius: 2, // Rounded corners
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
                        maxWidth: 500, // Centered and limited width
                        margin: '0 auto', // Center horizontally
                        width: {
                            xs: 300,
                            sm: 500
                        }
                    }}
                    component="form" // Make the entire grid a form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSchoolSubmit(); // Trigger the submit function
                    }}
                >
                    {/* Header */}
                    <Typography
                        variant="h4"
                        gutterBottom
                        align="center"
                        sx={{
                            marginBottom: 3, // Space below the header
                            fontWeight: 'bold',
                        }}
                    >
                        Select a School
                    </Typography>

                    {/* Dropdown */}
                    {schoolOptions.length > 0 ? (
                        <Autocomplete
                            sx={{
                                width: '100%',
                            }}
                            id="school-select"
                            value={selectedSchoolState}
                            onChange={(event, value) => {
                                dispatch(setSelectedSchool(value))
                                setSelectedSchoolState(value);

                            }}
                            options={schoolOptions}
                            getOptionLabel={(option) => option?.schoolName || ''}
                            isOptionEqualToValue={(option, value) => option?._id === value?._id}
                            getOptionKey={(option) => option?._id || `${option.schoolName}-${Math.random()}`}
                            onScroll={(event) => {
                                const bottom = event.target.scrollHeight === event.target.scrollTop + event.target.clientHeight;
                                if (bottom && hasMore) {
                                    loadMoreSchools();
                                }
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="School"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: 'green', // Green outline
                                            },
                                            '&:hover fieldset': {
                                                borderColor: 'darkgreen', // Darker green on hover
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: 'green', // Maintain green on focus
                                                borderWidth: 2, // Slightly thicker border
                                            },
                                        },
                                        width: '100%',
                                    }}
                                />
                            )}
                            loading={loadingSchools}
                            noOptionsText="No schools found"
                        />
                    ) : (
                        <Typography
                            variant="body1"
                            color="textSecondary"
                            sx={{ textAlign: 'center', marginTop: 2 }}
                        >
                            No schools available
                        </Typography>
                    )}

                    {/* Button */}
                    <Grid container justifyContent="center" sx={{ marginTop: 3 }}>
                        <Button
                            type="submit" // Submit button
                            variant="contained"
                            sx={{
                                backgroundColor: "#196b57",
                                color: "#ffffff",
                                "&:hover": {
                                    backgroundColor: "#40550f", // Slightly darker green on hover
                                },
                            }}
                        >
                            Next
                        </Button>
                    </Grid>
                </Grid>
            </>
        </Box>
    );
};

export default RegistrationSelector;
