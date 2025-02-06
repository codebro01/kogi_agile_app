import React, { useEffect, useState } from 'react';
import {
    Container,
    Box,
    Typography,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    useMediaQuery,
    Pagination, 
    Stack
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useContext } from 'react';
import { fetchAllStudents } from './allStudentsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { SpinnerLoader } from './spinnerLoader';

export const ViewAttendance = () => {
    const [filter, setFilter] = useState({
        week: '',
        month: '',
        year: '',
        school: '',
    });
    const studentsState = useSelector(state => state.allStudents);
    const {data: studentsData, loading, error} = studentsState;
    const [fetchLoading, setFetchLoading] = useState(false)
    const [fetchError, setFetchError] = useState(false)
    const [filteredData, setFilteredData] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(100); // Number of records per page
    const navigate = useNavigate();
    const [message, setMessage] = useState('')

    

    const API_URL = `${import.meta.env.VITE_API_URL}/api/v1`


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilter({ ...filter, [name]: value });
    };
    const token = localStorage.getItem('token');

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handleLimitChange = (event) => {
        setLimit(event.target.value);
        setCurrentPage(1); // Reset to first page when limit changes
    };






    const weekOptions = [{ name: "week 1", value: 1 }, { name: "week 2", value: 2 }, { name: "week 3", value: 3 }, { name: "week 4", value: 4 }, { name: "week 5", value: 5 }]

    const monthOptions = [
        { name: 'January', value: 1 },
        { name: 'February', value: 2 },
        { name: 'March', value: 3 },
        { name: 'April', value: 4 },
        { name: 'May', value: 5 },
        { name: 'June', value: 6 },
        { name: 'July', value: 7 },
        { name: 'August', value: 8 },
        { name: 'September', value: 9 },
        { name: 'October', value: 10 },
        { name: 'November', value: 11 },
        { name: 'December', value: 12 },
    ];
    const getCurrentYear = () => new Date().getFullYear();
    const userData = localStorage.getItem('userData');
    const parsedUserData = JSON.parse(userData);

    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get(`${API_URL}/admin-enumerator/get-single/${parsedUserData.userID}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                });

            } catch (err) {

                if (err.response.status === 401) return navigate('/sign-in')
                // setError(err.response?.data?.message || 'An error occurred');
                // setTimeout(() => setError(''), 3000); console.log(err)
            }
        })()

    }, [])


    const params = {
        week: filter.week,
        year: filter.year,
        month: filter.month,
        school: filter.school,
        limit, 
        page:currentPage,


    }
    const filteredParams = Object.entries(params)
        .filter(([_, value]) => value != null && value !== '') // Filter out empty values
        .reduce((acc, [key, value]) => {
            acc[key] = value;  // Directly add each key-value pair to the accumulator
            return acc;
        }, {})



    const handleSubmit = async () => {
        try {
            setMessage('')
            setFetchLoading(true)
            const response = await axios.get(`${API_URL}/student/view-attendance-sheet`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: { ...filteredParams },
                withCredentials: true,
            })
            setFilteredData(response.data.attendance?.[0]?.data)
            setTotal(response.data.attendance?.[0].total)
            setFetchLoading(false)
        }
        catch (err) {
            setFetchError(true)
            console.log(err)
            setFetchLoading(false)
            if(err.response.status === 404 || err.status === 404 || err.response.statusText === 'Not Found') {
                setMessage(err.response.message || "No Data found")
                setFilteredData([]);
                return;
            }
        }
    };

    useEffect(() => {
        handleSubmit();
    }, [limit, currentPage])



    const isMobile = useMediaQuery('(max-width:600px)'); // Adjust for smaller screens

    const getMonthName = (month) => {
        const monthNames = [
            '',
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ];
        return monthNames[month] || 'Invalid Month';
    };
    // const getUniqueSchoolNames = (filteredData) => {
    //     try {
    //         const uniqueSchoolNames = filteredData.reduce((acc, item) => {
    //             if (item.schoolDetails) {
    //                 const schoolName = item.schoolDetails.schoolName;
    //                 if (!acc.includes(schoolName)) {
    //                     acc.push(schoolName); // Add only unique school names
    //                 }
    //             }
    //             return acc;
    //         }, []);

    //         return uniqueSchoolNames;
    //     } catch (error) {
    //         console.error('Error getting unique school names:', error);
    //         return [];
    //     }
    // };


    // const uniqueSchoolNames = getUniqueSchoolNames(filteredData);

    const uniqueSchools = Array.from(
        new Set(
            studentsData.map(student => JSON.stringify({
                schoolName: student.schoolId?.schoolName,
                schoolId: student.schoolId?._id,
            }))
        )
    ).map(item => JSON.parse(item));





    return (
        <Container maxWidth="lg">
            <Box
                sx={{
                    padding: 2,
                    backgroundColor: 'background.paper',
                    borderRadius: 1,
                    boxShadow: 1,
                    width: '100%',
                }}
            >
                <Typography variant="h6" gutterBottom>
                    Filter Options
                </Typography>
                <Grid container spacing={2} alignItems="center">
                    {/* Week Filter */}
                    <Grid item xs={12} sm={3}>
                        <FormControl fullWidth>
                            <Select
                                labelId="week-label"
                                id="week"
                                name="week"
                                value={filter.week}
                                onChange={handleChange}
                                displayEmpty
                            >
                                <MenuItem value="">Select Week</MenuItem>
                                {weekOptions.map((week) => (
                                    <MenuItem key={week.value} value={week.value}>
                                        {week.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <FormControl fullWidth>
                            <Select
                                labelId="month-label"
                                id="month"
                                name="month"
                                value={filter.month}
                                onChange={handleChange}
                                displayEmpty
                            >
                                <MenuItem value="">Select month</MenuItem>
                                {monthOptions.map((month) => (
                                    <MenuItem key={month.value} value={month.value}>
                                        {month.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>


                    {/* Month Filter */}


                    {/* Year Filter */}
                    <Grid item xs={12} sm={3}>
                        <FormControl fullWidth>
                            <Select
                                labelId="year-label"
                                id="year"
                                name="year"
                                value={filter.year}
                                onChange={handleChange}
                                displayEmpty
                            >
                                <MenuItem value="">Select Year</MenuItem>
                                <MenuItem value="2025">2025</MenuItem>
                                {/* Add more years as needed */}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* School Filter */}
                    <Grid item xs={12} sm={3}>
                        <FormControl fullWidth style={{ minWidth: 120 }}>
                            <Select
                                labelId="school-label"
                                id="school"
                                name="school"
                                value={filter.school}
                                onChange={handleChange}
                                displayEmpty
                            >
                                <MenuItem value="">Select School</MenuItem>

                                {uniqueSchools.map(school => (
                                    <MenuItem key={school} value={school.schoolId}>{school.schoolName}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>


                    {/* Submit Button */}
                    <Grid item xs={12} sm={12} display="flex" justifyContent="flex-end">
                        <Button variant="contained" color="primary" onClick={handleSubmit}  sx = {{
                            backgroundColor: '#196b57', // Default background color
                            color: '#ffffff', // Text color
                            padding: '10px 20px', // Add some padding for better appearance
                            borderRadius: '8px', // Rounded corners
                            fontWeight: 'bold', // Bold text
                            textTransform: 'uppercase', // Make text uppercase
                            transition: 'all 0.3s ease', // Smooth transition for hover effect
                            '&:hover': {
                                backgroundColor: '#145943', // Slightly darker shade on hover
                            },
                        }}>
                            Filter
                        </Button>
                    </Grid>
                </Grid>
            </Box>

            {fetchError && <Box
                sx={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    marginTop: "30px",

                }}
            ><Typography>{message}</Typography></Box>}

            {fetchLoading ? <Box
                sx={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%"
                }}
            ><SpinnerLoader /></Box> : <Paper elevation={3} sx={{ padding: 2, marginTop: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Student Attendance Table
                </Typography>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>S/N</TableCell>
                                <TableCell>Name</TableCell>
                                {<TableCell>School</TableCell>} {/* Hide on mobile */}
                                {<TableCell>Class</TableCell>}  {/* Hide on mobile */}
                                {<TableCell>Score</TableCell>}  {/* Hide on mobile */}
                                <TableCell>Week</TableCell>
                                <TableCell>Month</TableCell>
                                <TableCell>Year</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            { filteredData.map((row, index) => {
                                        const displayIndex = (currentPage - 1) * limit + index + 1; // Adjust index based on page and limit
                               return  (<TableRow key={index}>
                                   <TableCell>{displayIndex}</TableCell>
                                    <TableCell>{`${row?.studentDetails.surname} ${row?.studentDetails.firstname}`}</TableCell>
                                    {<TableCell>{row?.schoolDetails.schoolName}</TableCell>} {/* Hide on mobile */}
                                    {<TableCell>{row.class}</TableCell>}  {/* Hide on mobile */}
                                    {<TableCell>{row.AttendanceScore}</TableCell>}  {/* Hide on mobile */}
                                    <TableCell>{row.attdWeek}</TableCell>
                                    <TableCell>{getMonthName(row.month)}</TableCell>
                                    <TableCell>{row.year}</TableCell>
                                </TableRow>)
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                   
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: '50px',
                            padding: {
                                xs: "20px 0",
                                sm: "20px"
                            },
                            gap: "20px",
                            borderRadius: '10px',
                            backgroundColor: '#f4f9f4',
                            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                            flexDirection: {
                                xs: "column", 
                                sm: "row"
                            }
                        }}
                    >
                        <FormControl
                            sx={{
                                minWidth: 100,
                                backgroundColor: '#ffffff',
                                borderRadius: '6px',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                '& .MuiInputLabel-root': {
                                    color: '#196b57',
                                    fontWeight: 500,
                                    fontSize: '14px',
                                },
                                '& .MuiSelect-root': {
                                    padding: '6px 12px',
                                    fontSize: '14px',
                                    borderRadius: '6px',
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                    border: '1.5px solid #196b57',
                                    borderRadius: '6px',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#1ba375',
                                },
                                '& .MuiSelect-icon': {
                                    color: '#196b57',
                                },
                            }}
                        >
                            <InputLabel id="limit-select-label">Limit</InputLabel>
                            <Select
                                labelId="limit-select-label"
                                value={limit}
                                onChange={handleLimitChange}
                                MenuProps={{
                                    PaperProps: {
                                        sx: {
                                            borderRadius: '6px',
                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                        },
                                    },
                                }}
                            >
                                <MenuItem value={50}>50</MenuItem>
                                <MenuItem value={100}>100</MenuItem>
                                <MenuItem value={200}>200</MenuItem>
                                <MenuItem value={500}>500</MenuItem>
                            </Select>
                        </FormControl>


                        <Pagination
                            count={Math.ceil(total / limit)}
                            page={currentPage}
                            onChange={handlePageChange}
                            siblingCount={1}  // Show 1 page number before and after the current page
                            boundaryCount={1}
                            color="primary"
                            sx={{
                                '& .MuiPaginationItem-root': {
                                    borderRadius: '50%',
                                    color: '#196b57',
                                    '&:hover': {
                                        backgroundColor: '#196b57',
                                        color: '#ffffff', // Text color on hover
                                    },
                                },
                                '& .Mui-selected': {
                                    backgroundColor: '#196b57',
                                    color: '#ffffff',
                                },
                            }}
                        />
                    </Box>

            </Paper>}

        
        </Container>
    );
};

