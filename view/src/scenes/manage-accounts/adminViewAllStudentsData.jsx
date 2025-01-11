import React, { useState, useContext, useEffect, useCallback } from 'react';
import {
    Container, useTheme, Typography, Table, Button, TableBody, TableCell,
    Select, MenuItem, TableContainer, TableHead, TableRow, Paper, Box, TextField, IconButton, Grid, InputLabel, Autocomplete,
} from '@mui/material';
import { StudentsContext, WardsContext } from '../../components/dataContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import EditIcon from "@mui/icons-material/Edit";
import { tokens } from "../../theme";
import { PersonLoader } from '../../components/personLoader';
import { useAuth } from '../auth/authContext';
import { getNigeriaStates } from 'geo-ng';
import lgasAndWards from '../../Lga&wards.json';
import { SchoolsContext } from "../../components/dataContext.jsx";
// Import context




export const AdminViewAllStudentsData = () => {
    const { userPermissions } = useAuth();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode)
    const navigate = useNavigate();
    // const [filterLoading, setFilterLoading] = useState(false);
    const { studentsData, setStudentsData } = useContext(StudentsContext);
    const { setSelectedSchool, loading, selectedSchool, schoolsData } = useContext(SchoolsContext); // Access context
    const schools = schoolsData;
    const [selectedSchoolState, setSelectedSchoolState] = useState(null); // State to hold the selected school object
    const [schoolOptions, setSchoolOptions] = useState([]); // Start with an empty array
    const [hasMore, setHasMore] = useState(true); // To check if more data is available
    const [loadingSchools, setLoadingSchools] = useState(false); // Loading state for schools
    const [page, setPage] = useState(1); // Kee
    const { wardsData } = useContext(WardsContext);
    const [yearsOfAdmissionData, setYearsOfAdmissionData] = useState([]);
    const [filterError, setFilterError] = useState(null);
    const [statesData, setStatesData] = useState([]);
    const [countriesData, SetCountriesData] = useState([]);
    const [yearsData, setYearData] = useState([]);
    const [lgasData, setLgasData] = useState([]);
    const [enumeratorsData, setEnumeratorsData] = useState([]);
    const [fetchLoading, setFetchLoading] = useState(false)
    const [enumeratorsLoading, setEnumeratorsLoading] = useState(false);

    const API_URL = `${import.meta.env.VITE_API_URL}/api/v1`
    const token = localStorage.getItem('token') || '';
    const [filters, setFilters] = useState({
        ward: '',
        presentClass: '',
        sortBy: '',
        sortOrder: "",
        lga: '',
        schoolId: '',
        nationality: "",
        stateOfOrigin: "",
        enumerator: "",
        dateFrom: "",
        dateTo: "",
        yearOfEnrollment: "",
        yearOfAdmission: "",
    });

    useEffect(() => {
        if (schools && schools.length > 0) {
            setSchoolOptions(schools); // Set schools if available
        }
    }, [schools]); // Re-run whenever schools change
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

    const fetchMoreSchools = async (page) => {
        // Simulate network request to fetch schools for the current page
        return new Promise((resolve) => {
            setTimeout(() => {
                const startIndex = (page - 1) * 20;
                resolve(schools.slice(startIndex, startIndex + 20)); // Return a slice of the schools array
            }, 1000);
        });
    };







    const params = {
        stateOfOrigin: filters.stateOfOrigin,
        ward: filters.ward,
        presentClass: filters.presentClass,
        lga: filters.lga,
        schoolId: filters.schoolId,
        nationality: filters.nationality,
        state: filters.state,
        enumerator: filters.enumerator,
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo,
        yearOfEnrollment: filters.yearOfEnrollment,
        yearOfAdmission: filters.yearOfAdmission,
        classAtEnrollment: filters.classAtEnrollment,
    }
    const filteredParams = Object.entries(params)
        .filter(([_, value]) => value != null && value !== '') // Filter out empty values
        .reduce((acc, [key, value]) => {
            acc[key] = value;  // Directly add each key-value pair to the accumulator
            return acc;
        }, {})


    const sortParam = {
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
    };


    const yearOfAdmissionOptions = [{ year: '2020' }, { year: '2021' }, { year: '2022' }, { year: '2023' }, { year: '2024' }, { year: '2025' }];

    const registrationYearOptions = [{ year: '2024' }, { year: '2025' }, { year: '2026' }, { year: '2027' }, { year: '2028' }, { year: '2029' },]

    useEffect(() => {
        (async () => {
            try {
                const token = localStorage.getItem('token');
                setEnumeratorsLoading(true);
                const response = await axios.get(`${API_URL}/admin-enumerator`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                });
                const { registrars } = response.data;
                setEnumeratorsData(registrars);
            }
            catch (err) {
                console.log(err)
            }

        })()
    }, [])
    // ! Nationality state and local government data set up
    const nationalityOptions = [
        { value: 'Nigeria', label: 'Nigeria' },
        { value: 'Others', label: 'Others' }
    ];
    const getLGAs = (stateName) => {
        const state = getNigeriaStates().find((s) => s.name === stateName);
        return state ? state.lgas : [];
    };

    useEffect(() => {
        if (filters.nationality === 'Nigeria') {
            const statesObjects = getNigeriaStates();
            const newStates = statesObjects.map((state) => state.name);
            setStatesData(newStates);
        } else {
            setStatesData([]);
            setLgasData([]);
        }
    }, [filters.nationality]);

    useEffect(() => {
        if (filters.state && filters.nationality === 'Nigeria') {
            const lgas = getLGAs(filters.state);
            setLgasData(lgas);
        } else {
            setLgasData([]);
        }
    }, [filters.state, filters.nationality]);

    const clearFilters = () => {
        setFilters({
            ward: '',
            presentClass: '',
            sortBy: '',
            lga: '',
            schoolId: '',
        });
        setStudentsData(studentsData);
    };

    const classOptions = [
        { class: "Primary 6", id: 1 },
        { class: "JSS 1", id: 2 },
        { class: "JSS 3", id: 3 },
        { class: "SSS 1", id: 4 },
    ];


    const fetchStudents = async () => {


        try {
            setFetchLoading(true);
            const response = await axios.get(`${API_URL}/student/download`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: { ...filteredParams, ...sortParam },
                responseType: "blob",
                withCredentials: true,
            })

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'students.xlsx'); // Filename
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.log(error?.response?.statusText)
            setFilterError(error?.response?.statusText)
        }
    }


    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => {
            const updatedFilters = {
                ...prevFilters,
                [name]: value,
            };
            return updatedFilters;
        });
    }, []);


    const handleSubmit = (e) => {
        e.preventDefault();
        fetchStudents();
    };

    // const handleEdit = (student) => {
    //     navigate(`/admin-dashboard/update-student/${student._id}`, { state: student })
    // };

    console.log(statesData);
    console.log(filters)


    if (loading)
        return (
            <Box
                sx={{
                    display: "flex", // Corrected from 'dispflex'
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "50vh",
                    width: "90vw"
                }}
            >
                <PersonLoader />
            </Box>
        );

    return (
        <>
            {userPermissions.includes('handle_registrars') ? (
                <Container maxWidth="lg" sx={{ marginTop: 4, marginBottom: "50px" }}>
                    <Typography
                        variant="h3"
                        component="h1"
                        gutterBottom
                        textAlign="center"
                        sx={{ fontWeight: 'bold' }}
                    >
                        Manage All Students
                    </Typography>

                    {/* Filter Form */}
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        display="flex"
                        flexDirection="column"
                        gap={2}
                        p={3}
                        sx={{
                            backgroundColor: "#f9f9f9",
                            borderRadius: 2,
                            boxShadow: 2,
                        }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            Filter Students
                        </Typography>
                        <Grid container spacing={2} alignItems="center">
                            {/* Existing Fields */}

                            <Grid item xs={12} sm={6} md={4}>
                                <InputLabel id="lga-label" sx={{ marginBottom: 1 }}>All Schools</InputLabel>
                                {schoolOptions.length > 0 ? (
                                    <Autocomplete
                                        sx={{
                                            width: '100%',
                                            '& .MuiAutocomplete-input': {
                                                height: '5px', // Adjust input field height
                                                borderRadius: '4px',
                                                padding: '10px',


                                            },
                                        }}
                                        id="school-select"
                                        value={schoolOptions.find((option) => option._id === filters.schoolId) || null
                                        }
                                        onChange={(event, newValue) => {
                                            setFilters((prevFilters) => ({
                                                ...prevFilters,
                                                schoolId: newValue?._id || null,
                                            }));
                                        }}
                                        options={schoolOptions}
                                        getOptionLabel={(option) => option?.schoolName || ''}
                                        isOptionEqualToValue={(option, value) => option?._id === value?._id}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="School"
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        '& fieldset': {
                                                            borderColor: 'green',
                                                        },
                                                        '&:hover fieldset': {
                                                            borderColor: 'darkgreen',
                                                        },
                                                        '&.Mui-focused fieldset': {
                                                            borderColor: 'green',
                                                            borderWidth: 2,
                                                        },
                                                    },
                                                }}
                                            />
                                        )}
                                        loading={loadingSchools}
                                        noOptionsText="No schools found"
                                        getOptionKey={(option, index) => option?._id || `${option.schoolName}-${index}`} // Unique key
                                    />


                                ) : (
                                    <Typography
                                        variant="body1"
                                        color="textSecondary"
                                        sx={{ textAlign: 'center', marginTop: 2 }}
                                    >
                                        No schools available
                                    </Typography>
                                )

                                }
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <InputLabel id="lga-label" sx={{ marginBottom: 1 }}>All LGA</InputLabel>
                                <Select
                                    name="lga"
                                    value={filters.lga}
                                    onChange={handleInputChange}
                                    displayEmpty
                                    fullWidth
                                    size="small"
                                    labelId="lga-label"
                                >
                                    <MenuItem value="">
                                        <em>All LGA</em>
                                    </MenuItem>
                                    {lgasAndWards.map((lga) => (
                                        <MenuItem key={lga.name} value={lga.name}>
                                            {lga.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Grid>

                            <Grid item xs={12} sm={6} md={4}>
                                <InputLabel id="ward-label" sx={{ marginBottom: 1 }}>Select Ward</InputLabel>
                                <Select
                                    name="ward"
                                    value={filters.ward}
                                    onChange={handleInputChange}
                                    displayEmpty
                                    fullWidth
                                    size="small"
                                    labelId="ward-label"
                                >
                                    <MenuItem value="">
                                        <em>All Wards</em>
                                    </MenuItem>
                                    {lgasAndWards
                                        ?.flatMap((lga) => lga.wards) // Flatten all wards into a single array
                                        .sort((a, b) => a.localeCompare(b)) // Sort the array alphabetically
                                        .map((ward, index) => (
                                            <MenuItem key={index} value={ward}>
                                                {ward}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </Grid>


                            <Grid item xs={12} sm={6} md={4}>
                                <InputLabel id="class-label" sx={{ marginBottom: 1 }}>Present Class</InputLabel>
                                <Select
                                    name="presentClass"
                                    value={filters.presentClass}
                                    onChange={handleInputChange}
                                    displayEmpty
                                    fullWidth
                                    size="small"
                                    labelId="class-label"
                                >
                                    <MenuItem value="">
                                        <em>All Class</em>
                                    </MenuItem>
                                    {classOptions?.map((option) => (
                                        <MenuItem key={option.id} value={option.class}>
                                            {option.class}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Grid>


                            {/* New Fields */}
                            <Grid item xs={12} sm={6} md={4}>
                                <InputLabel id="nationality-label" sx={{ marginBottom: 1 }}>Nationality</InputLabel>
                                <Select
                                    name="nationality"
                                    value={filters.nationality}
                                    onChange={handleInputChange}
                                    displayEmpty
                                    fullWidth
                                    size="small"
                                    labelId="nationality-label"
                                >
                                    <MenuItem value="">
                                        <em>Nationality</em>
                                    </MenuItem>
                                    {nationalityOptions?.map((nationality, index) => (
                                        <MenuItem key={index} value={nationality.value}>
                                            {nationality.value}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Grid>

                            <Grid item xs={12} sm={6} md={4}>
                                <InputLabel id="lga-label" sx={{ marginBottom: 1 }}>All states</InputLabel>
                                <Select
                                    name="stateOfOrigin"
                                    value={filters.stateOfOrigin || ''}
                                    onChange={handleInputChange}
                                    fullWidth
                                    size="small"
                                    labelId="state-label"
                                >
                                    <MenuItem value="">
                                        <em>All States</em>
                                    </MenuItem>
                                    {statesData.map((state) => (
                                        <MenuItem key={state} value={state}>
                                            {state}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Grid>

                            <Grid item xs={12} sm={6} md={4}>
                                <InputLabel id="enumerator-label" sx={{ marginBottom: 1 }}>All Enumerator</InputLabel>
                                <Select
                                    name="enumerator"
                                    value={filters.enumerator}
                                    onChange={handleInputChange}
                                    displayEmpty
                                    fullWidth
                                    size="small"
                                    labelId="enumerator-label"
                                >
                                    <MenuItem value="">
                                        <em>All Enumerators</em>
                                    </MenuItem>
                                    {enumeratorsData?.map((enumerator) => (
                                        <MenuItem key={enumerator._id} value={enumerator._id}>
                                            {enumerator.fullName}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Grid>

                            <Grid item xs={12} sm={6} md={4}>
                                <InputLabel id="year-label" sx={{ marginBottom: 1 }}>Year of Enrollment</InputLabel>
                                <Select
                                    name="yearOfEnrollment"
                                    value={filters.yearOfEnrollment}
                                    onChange={handleInputChange}
                                    displayEmpty
                                    fullWidth
                                    size="small"
                                    labelId="yearOfEnrollment-label"
                                >
                                    <MenuItem value="">
                                        <em>All Year</em>
                                    </MenuItem>
                                    {registrationYearOptions?.map((yearOfEnrollment, index) => (
                                        <MenuItem key={index} value={yearOfEnrollment.year}>
                                            {yearOfEnrollment.year}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Grid>

                            {/* <Grid item xs={12} sm={6} md={4}>
                                <InputLabel id="yearOfAdmission-label" sx={{ marginBottom: 1 }}>Year of Admission</InputLabel>
                                <Select
                                    name="yearOfAdmission"
                                    value={filters.yearOfAdmission}
                                    onChange={handleInputChange}
                                    displayEmpty
                                    fullWidth
                                    size="small"
                                    labelId="yearOfAdmission-label"
                                >
                                    <MenuItem value="">
                                        <em>All Year</em>
                                    </MenuItem>
                                    {yearOfAdmissionOptions?.map((yearOfAdmission, index) => (
                                        <MenuItem key={index} value={yearOfAdmission.year}>
                                            {yearOfAdmission.year}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Grid> */}

                            {/* Existing Fields */}
                            <Grid item xs={12} sm={6} md={4}>
                                <InputLabel id="sortBy-label" sx={{ marginBottom: 1 }}>Sort By</InputLabel>
                                <Select
                                    name="sortBy"
                                    value={filters.sortBy}
                                    onChange={handleInputChange}
                                    displayEmpty
                                    fullWidth
                                    size="small"
                                    labelId="sortBy-label"
                                >
                                    <MenuItem value="">
                                        <em>Sort Criteria</em>
                                    </MenuItem>
                                    {['ward', 'lga', 'createdAt', 'presentClass'].map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Grid>

                            {filters.sortBy && (
                                <Grid item xs={12} sm={6} md={4}>
                                    <InputLabel id="sortOrder-label" sx={{ marginBottom: 1 }}>Sort Order</InputLabel>
                                    <Select
                                        name="sortOrder"
                                        value={filters.sortOrder}
                                        onChange={handleInputChange}
                                        displayEmpty
                                        fullWidth
                                        size="small"
                                        labelId="sortOrder-label"
                                    >
                                        <MenuItem value="">
                                            <em>Sort Order</em>
                                        </MenuItem>
                                        <MenuItem value="asc">asc</MenuItem>

                                    </Select>
                                </Grid>
                            )}

                            {/* Date Filter */}
                            <Grid item xs={12} sm={6} md={4}>
                                <InputLabel sx={{ marginBottom: 1 }}>From</InputLabel>
                                <TextField
                                    type="date"
                                    name="dateFrom"
                                    value={filters.dateFrom}
                                    onChange={handleInputChange}
                                    InputLabelProps={{ shrink: true }}
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                />
                            </Grid>

                            <Grid item xs={12} sm={6} md={4}>
                                <InputLabel sx={{ marginBottom: 1 }}>To</InputLabel>
                                <TextField
                                    type="date"
                                    name="dateTo"
                                    value={filters.dateTo}
                                    onChange={handleInputChange}
                                    InputLabelProps={{ shrink: true }}
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                />
                            </Grid>
                        </Grid>


                        <Box display="flex" justifyContent="space-between" gap={2} mt={2}>
                            <Button
                                variant="outlined"
                                color="secondary"
                                size="large"
                                sx={{ textTransform: "none", width: '48%' }}
                                onClick={clearFilters}
                            >
                                Reset Filters
                            </Button>

                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                sx={{
                                    textTransform: "none",
                                    width: '48%',
                                    color: "#fff",
                                    background: colors.main['darkGreen'],
                                }}
                            >
                                Export Data
                            </Button>
                        </Box>

                        {filterError && (
                            <Typography>
                                {filterError}
                            </Typography>
                        )}
                    </Box>


                    {/* Table Container */}
                    {/* <TableContainer component={Paper} sx={{ boxShadow: 3, marginTop: 5 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Surname</TableCell>
                                    <TableCell>Present Class</TableCell>
                                    <TableCell>State of Origin</TableCell>
                                    <TableCell>LGA</TableCell>
                                    <TableCell>Ward</TableCell>
                                    <TableCell>Date of Admission</TableCell>
                                    <TableCell>Edit</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {studentsData && studentsData.length > 0 ? (
                                    studentsData.map((student, index) => (
                                        <TableRow key={student._id || index}>
                                            <TableCell>{student.surname}</TableCell>
                                            <TableCell>{student.presentClass}</TableCell>
                                            <TableCell>{student.stateOfOrigin}</TableCell>
                                            <TableCell>{student.lga}</TableCell>
                                            <TableCell>{student.ward.name}</TableCell>
                                            <TableCell>{new Date(student.dateOfAdmission).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                <IconButton onClick={() => handleEdit(student)} color="primary">
                                                    <EditIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center">
                                            No Students Data Found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer> */}
                </Container>
            ) : (
                <h1>Not authorized to access this route</h1>
            )}
        </>
    );



};
