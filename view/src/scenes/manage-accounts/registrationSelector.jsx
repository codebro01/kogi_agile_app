import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Typography,
    Autocomplete,
    TextField,
} from "@mui/material";
import { useAuth } from '../auth/authContext.jsx';
import { SchoolsContext } from "../../components/dataContext.jsx"; // Import context
import { SpinnerLoader } from "../../components/spinnerLoader.jsx";

const RegistrationSelector = ({ schools }) => {
    const { setSelectedSchool, loading, selectedSchool } = useContext(SchoolsContext); // Access context
    const [role, setRole] = useState("");
    const { userPermissions } = useAuth();
    const [selectedSchoolState, setSelectedSchoolState] = useState(null); // State to hold the selected school object
    const [schoolOptions, setSchoolOptions] = useState([]); // Start with an empty array
    const [hasMore, setHasMore] = useState(true); // To check if more data is available
    const [loadingSchools, setLoadingSchools] = useState(false); // Loading state for schools
    const [page, setPage] = useState(1); // Keep track of the current page
    const navigate = useNavigate();

    // Fetch schools once the component mounts or the schools array changes
    useEffect(() => {
        if (schools && schools.length > 0) {
            setSchoolOptions(schools); // Set schools if available
        }
    }, [schools]); // Re-run whenever schools change

    // Handle change in school selection
    const handleSchoolChange = (event, value) => {
        setSelectedSchoolState(value); // Set the full school object
        setSelectedSchool(value); // Store the school in context

    };

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
        window.location.href = '/admin-dashboard/create-accounts/register-student' // Reload the page after navigation

    };

    const handleChange = (event) => {
        setRole(event.target.value); // Update role state
    };

    const handleSubmit = () => {
        if (!role) {
            alert("Please select a role to register.");
            return;
        }

        // Navigate based on the selected role
        if (role === "admin") navigate("/admin-dashboard/create-accounts/register-admin");
        if (role === "enumerator") navigate("/admin-dashboard/create-accounts/register-enumerator");
        if (role === "student") navigate("/admin-dashboard/create-accounts/register-student");
        if (role === "school") navigate("/select-school"); // Added for the second condition
    };

    // Loading state while the schools are being fetched
    if (loading)
        return (
            <Box
                sx={{
                    display: "flex", // Corrected from 'dispflex'
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "80vh",
                    width: "90vw",
                    position: "relative",
                }}
            >
                <SpinnerLoader />
            </Box>
        );


    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                gap: 3,
            }}
        >
            {userPermissions.includes('handle_registrar') ? (
                <>
                    <Typography variant="h4" gutterBottom>
                        Select Role to Register
                    </Typography>
                    {/* Your role selection code here */}
                </>
            ) : (
                <>
                    <Typography variant="h4" gutterBottom>
                        Select a School
                    </Typography>
                    {/* Only render Autocomplete if schoolOptions are available */}
                    {schoolOptions.length > 0 ? (
                        <Autocomplete
                            id="school-select"
                            value={selectedSchoolState} // Now using the whole school object
                            onChange={(event, value) => {
                                setSelectedSchool(value)
                                setSelectedSchoolState(value)
                                console.log(selectedSchool)

                            }}
                            options={schoolOptions} // Ensure it's always an array
                            getOptionLabel={(option) => option?.schoolName || ''} // Safely access the name
                            isOptionEqualToValue={(option, value) => option?._id === value?._id} // Safely compare objects
                            onScroll={(event) => {
                                const bottom = event.target.scrollHeight === event.target.scrollTop + event.target.clientHeight;
                                if (bottom && hasMore) {
                                    loadMoreSchools(); // Load more schools when the user scrolls to the bottom
                                }
                            }}
                            renderInput={(params) => <TextField {...params} label="School" 
                                sx={{ width: 400 }} // Change the width here

                             />}
                            loading={loadingSchools}
                            noOptionsText="No schools found"
                            // Use a unique key for each option to prevent key collision warning
                            getOptionKey={(option) => option?._id} // Unique key for each option
                        />
                    ) : (
                        <Typography variant="body1" color="textSecondary">
                            No schools available
                        </Typography>
                    )}
                        <Button
                            variant="contained"
                            onClick={handleSchoolSubmit}
                            sx={{
                                backgroundColor: "#546e13",
                                color: "#ffffff",
                                "&:hover": {
                                    backgroundColor: "#40550f", // Slightly darker green on hover
                                },
                            }}
                        >
                            Next
                        </Button>
                </>
            )}
        </Box>
    );
};

export default RegistrationSelector;
