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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useContext } from 'react';
import { StudentsContext } from '../components/dataContext';

export const ViewAttendance = () => {
    const [filter, setFilter] = useState({
        week: '',
        month: '',
        year: '',
        school: '',
    });
    const [fetchLoading, setFetchLoading] = useState(false)
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
    const [filteredData, setFilteredData] = useState([]);
    const navigate = useNavigate();
    const { studentsData, loading } = useContext(StudentsContext);
    

    const API_URL = `${import.meta.env.VITE_API_URL}/api/v1`


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilter({ ...filter, [name]: value });
    };
    const token = localStorage.getItem('token');






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
                setSuccess('Admin successfully created')
                console.log(response);
            } catch (err) {

                if (err.response.status === 401) return navigate('/sign-in')
                setError(err.response?.data?.message || 'An error occurred');
                setTimeout(() => setError(''), 3000); console.log(err)
            }
        })()

    }, [])


    const params = {
        week: filter.week,
        year: filter.year,
        month: filter.month,
        school: filter.school,

    }
    const filteredParams = Object.entries(params)
        .filter(([_, value]) => value != null && value !== '') // Filter out empty values
        .reduce((acc, [key, value]) => {
            acc[key] = value;  // Directly add each key-value pair to the accumulator
            return acc;
        }, {})


    const handleSubmit = async () => {
        try {
            const response = await axios.get(`${API_URL}/student/view-attendance-sheet`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: { ...filteredParams },
                withCredentials: true,
            })
            setFilteredData(response.data.attendance)

            console.log(response)
        }
        catch (err) {
            console.log(err)
        }
    };

    console.log(filter);


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


    console.log(uniqueSchools)



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
                        <Button variant="contained" color="primary" onClick={handleSubmit}>
                            Filter
                        </Button>
                    </Grid>
                </Grid>
            </Box>

            {/* Display filtered data (space below) */}
          { filteredData && <Paper elevation={3} sx={{ padding: 2, marginTop: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Student Attendance Table
                </Typography>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
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
                            {filteredData.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{`${row?.studentDetails.surname} ${row?.studentDetails.firstname}`}</TableCell>
                                    {<TableCell>{row?.schoolDetails.schoolName}</TableCell>} {/* Hide on mobile */}
                                    {<TableCell>{row.class}</TableCell>}  {/* Hide on mobile */}
                                    {<TableCell>{row.AttendanceScore}</TableCell>}  {/* Hide on mobile */}
                                    <TableCell>{row.attdWeek}</TableCell>
                                    <TableCell>{getMonthName(row.month)}</TableCell>
                                    <TableCell>{row.year}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>}
        </Container>
    );
};

