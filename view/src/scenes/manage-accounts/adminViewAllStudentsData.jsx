import React, { useState, useContext, useEffect, useCallback } from 'react';
import {
    Container, useTheme, Typography, Table, Button, TableBody, TableCell,
    Select, MenuItem, TableContainer, TableHead, TableRow, Paper, Box, TextField, IconButton, Grid, InputLabel
} from '@mui/material';
import { StudentsContext, WardsContext } from '../../components/dataContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import EditIcon from "@mui/icons-material/Edit";
import { tokens } from "../../theme";
import { PersonLoader } from '../../components/personLoader';
import { useAuth } from '../auth/authContext';
import { getNigeriaStates } from 'geo-ng';
import qs from 'qs';



export const AdminViewAllStudentsData = () => {
    const { userPermissions } = useAuth();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode)
    const navigate = useNavigate();
    // const [filterLoading, setFilterLoading] = useState(false);
    const { studentsData, loading, setStudentsData } = useContext(StudentsContext);
    const { wardsData } = useContext(WardsContext);
    const [yearsOfAdmissionData, setYearsOfAdmissionData] = useState([]);
    const [filterError, setFilterError] = useState(null);
    const [statesData, setStatesData] = useState([]);
    const [countriesData, SetCountriesData] = useState([]);
    const [yearsData, setYearData] = useState([]);
    const [lgasData, setLgasData] = useState([]);
    const [enumeratorsData, setEnumeratorsData] = useState([]);
    const [fetchLoading, setFetchLoading] = useState(false)
    const [enumeratorsLoading, setEnumeratorsLoading] = useState(false)

    const API_URL = 'http://localhost:3100/api/v1';
    const token = localStorage.getItem('token') || '';
    const [filters, setFilters] = useState({
        ward: '',
        presentClass: '',
        classAtEnrollment: "",
        sortBy: '',
        sortOrder: "",
        lga: '',
        schoolId: '',
        nationality: "",
        state: "",
        enumerator: "",
        dateFrom: "",
        dateTo: "",
        yearOfEnrollment: "",
        yearOfAdmission: "",
    });
    const params = {
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
    }; console.log(sortParam)


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

    const handleStateChange = (selectedState) => {
        setFilters({
            ...filters,
            state: selectedState,
            lga: '' // Reset LGA when state changes
        });
    };






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
        { class: "SS 1", id: 4 },
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

            console.log(response);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'students.xlsx'); // Filename
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.log(error)
        }
    }


    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchStudents();
    };

    const handleEdit = (student) => {
        navigate(`/admin-dashboard/update-student/${student._id}`, { state: student })
    };

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

    console.log(filters)
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
                                        <em>All Ward</em>
                                    </MenuItem>
                                    {wardsData?.map((ward) => (
                                        <MenuItem key={ward._id} value={ward._id}>
                                            {ward.name}
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
                            <Grid item xs={12} sm={6} md={4}>
                                <InputLabel id="class-label" sx={{ marginBottom: 1 }}> Enrollment class</InputLabel>
                                <Select
                                    name="classAtEnrollment"
                                    value={filters.classAtEnrollment}
                                    onChange={handleInputChange}
                                    displayEmpty
                                    fullWidth
                                    size="small"
                                    labelId="class-label"
                                >
                                    <MenuItem value="">
                                        <em>Class at Enrollment</em>
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

                            {filters.nationality === 'Nigeria' && (
                                <Grid item xs={12}>
                                    <TextField
                                        label="State of Origin"
                                        name="stateOfOrigin"
                                        select
                                        variant="outlined"
                                        fullWidth
                                        value={filters.state || ''}
                                        onChange={(e) => handleStateChange(e.target.value)}
                                        error={filters.stateOfOrigin === ''} // For example, you can pass `true` or `false` here
                                        helperText={filters.stateOfOrigin === '' ? 'State of Origin is required' : ''}
                                    >
                                        {statesData.map((state) => (
                                            <MenuItem key={state} value={state}>
                                                {state}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                            )}

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
                                    {lgasData.map((lga) => (
                                        <MenuItem key={lga} value={lga}>
                                            {lga}
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

                            <Grid item xs={12} sm={6} md={4}>
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
                                        <em>Year of Admission</em>
                                    </MenuItem>
                                    {yearOfAdmissionOptions?.map((yearOfAdmission, index) => (
                                        <MenuItem key={index} value={yearOfAdmission.year}>
                                            {yearOfAdmission.year}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Grid>

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
