
import { useContext, useEffect, useCallback } from "react";
import axios from 'axios';
import { StudentsContext, SchoolsContext } from "../../components/dataContext";
import { Grid, Box, MenuItem, Select, InputLabel, Typography, TextField, Autocomplete } from "@mui/material";
import { useState } from "react";
import { ExportSubmitButton } from "../../components/exportButton";
import lgasAndWards from '../../Lga&wards.json';

export const ExportAttendanceSheetPayroll = () => {
    const { loading, studentsData } = useContext(StudentsContext);
    const {schoolsData} = useContext(SchoolsContext);
    const schools = schoolsData;

    const [schoolId, setSchoolId] = useState(''); // Correctly destructured
    const [isSubmitting, setIsSubmitting] = useState(false)
    const API_URL = `${import.meta.env.VITE_API_URL}/api/v1`;
    const [attendanceData, setAttendanceData] = useState([]);
      const [selectedLga, setSelectedLga] = useState("");  // State for LGA selection
    const [schoolOptions, setSchoolOptions] = useState([]); // Start with an empty array
    const [hasMore, setHasMore] = useState(true); // To check if more data is available
    const [loadingSchools, setLoadingSchools] = useState(false); // Loading state for schools
    const [page, setPage] = useState(1); // Kee
      const [selectedWard, setSelectedWard] = useState("");  // State for Ward selection
    
    const [filters, setFilters] = useState({
        ward: '',
        presentClass: '',
        lgaOfEnrollment: '',
        schoolId: '',
        month: "",
        year: "",
    });

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

    const classOptions = [
        {name: "Primary 6", value: "Primary 6"},
        {name: "JSS 1", value: "JSS 1"},
        {name: "JSS 3", value: "JSS 3"},
        {name: "SSS 1", value: "SSS 1"},
    ]

    const getCurrentYear = () => new Date().getFullYear();

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
        ward: filters.ward,
        presentClass: filters.presentClass,
        lgaOfEnrollment: filters.lgaOfEnrollment,
        schoolId: filters.schoolId,
        month: filters.month,
        year: filters.year,
    }
    const filteredParams = Object.entries(params)
        .filter(([_, value]) => value != null && value !== '') // Filter out empty values
        .reduce((acc, [key, value]) => {
            acc[key] = value;  // Directly add each key-value pair to the accumulator
            return acc;
        }, {})


    const selectedLgaWards = lgasAndWards.find(lga => lga.name === selectedLga)?.wards || [];


    
    const handleSelectChange = (e, { name }) => {
        setSelectedLga(e.target.value);
        setSelectedWard("");
        setFilters((prevData) => ({
            ...prevData,
            [name]: e.target.value, // Update the correct field based on `name`
        }));
    };
    















    if (loading) {
        return <h4>...loading</h4>
    }

    const uniqueSchools = Array.from(
        new Set(
            studentsData.map(student => JSON.stringify({
                schoolName: student.schoolId?.schoolName,
                schoolId: student.schoolId?._id,
            }))
        )
    ).map(item => JSON.parse(item));

    const handleInputChange = (e) => {
        const {name, value} = e.target;

        setFilters(prev => ({
            ...prev, 
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            const token = localStorage.getItem('token');

            const response = await axios.get(`${API_URL}/student/view-attendance-sheet`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: { ...filteredParams },
                responseType: "blob",
                withCredentials: true,
            });
            setAttendanceData(response.data);
            if (response.statusText === "Not Found") return console.log('no data found')
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'studentsAttendanceSheet.xlsx'); // Filename
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                width: "100%",
                gap: "40px",
                padding: "0px 20px"
            }}
        >
            <Grid container spacing={4} sx={{ width: '100%' }}>
                {/* Select School */}
                <Grid item xs={12} sm={6}>
                    <Select
                        name="schoolId"
                        value={filters.schoolId}
                        onChange={handleInputChange}
                        displayEmpty
                        fullWidth
                        size="medium"
                        labelId="schoolId-label"
                        sx={{
                            borderRadius: 2,
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: '#4caf50' },
                                '&:hover fieldset': { borderColor: '#2e7d32' },
                                '&.Mui-focused fieldset': { borderColor: '#1b5e20', borderWidth: 2 },
                            },
                        }}
                    >
                        <MenuItem value="">
                            <em>All Schools</em>
                        </MenuItem>
                        {uniqueSchools.map((school, index) => (
                            <MenuItem key={index} value={school.schoolId}>
                                {school.schoolName}
                            </MenuItem>
                        ))}
                    </Select>
                </Grid>

                {/* Select LGA */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="LGA of Enrollment"
                        name="lgaOfEnrollment"
                        select
                        variant="outlined"
                        fullWidth
                        value={filters.lgaOfEnrollment || ''}
                        onChange={(e) => handleSelectChange(e, { name: 'lgaOfEnrollment' })}
                        sx={{
                            borderRadius: 2,
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: '#4caf50' },
                                '&:hover fieldset': { borderColor: '#2e7d32' },
                                '&.Mui-focused fieldset': { borderColor: '#1b5e20', borderWidth: 2 },
                            },
                        }}
                    >
                        <MenuItem value="">
                            <em>Select LGA</em>
                        </MenuItem>
                        {lgasAndWards.map((lga) => (
                            <MenuItem key={lga.name} value={lga.name}>
                                {lga.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>

                {/* Select Ward */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Wards"
                        name="ward"
                        select
                        variant="outlined"
                        fullWidth
                        value={filters.ward || ''}
                        onChange={handleInputChange}
                        sx={{
                            borderRadius: 2,
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: '#4caf50' },
                                '&:hover fieldset': { borderColor: '#2e7d32' },
                                '&.Mui-focused fieldset': { borderColor: '#1b5e20', borderWidth: 2 },
                            },
                        }}
                    >
                        <MenuItem value="">
                            <em>Select Ward</em>
                        </MenuItem>
                        {selectedLgaWards.map((ward, index) => (
                            <MenuItem key={index} value={ward}>
                                {ward}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>

                {/* Select Class */}
                <Grid item xs={12} sm={6}>
                    <Select
                        name="presentClass"
                        value={filters.presentClass}
                        onChange={(e) => handleSelectChange(e, { name: 'presentClass' })}
                        displayEmpty
                        fullWidth
                        size="medium"
                        labelId="present-class-label"
                        sx={{
                            borderRadius: 2,
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: '#4caf50' },
                                '&:hover fieldset': { borderColor: '#2e7d32' },
                                '&.Mui-focused fieldset': { borderColor: '#1b5e20', borderWidth: 2 },
                            },
                        }}
                    >
                        <MenuItem value="">
                            <em>Select All Classes</em>
                        </MenuItem>
                        {classOptions.map((presentClass, index) => (
                            <MenuItem key={index} value={presentClass.value}>
                                {presentClass.name}
                            </MenuItem>
                        ))}
                    </Select>
                </Grid>

                {/* Select Month */}
                <Grid item xs={12} sm={6}>
                    <Select
                        name="month"
                        value={filters.month}
                        onChange={(e) => handleSelectChange(e, { name: 'month' })}
                        displayEmpty
                        fullWidth
                        size="medium"
                        labelId="month-label"
                        sx={{
                            borderRadius: 2,
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: '#4caf50' },
                                '&:hover fieldset': { borderColor: '#2e7d32' },
                                '&.Mui-focused fieldset': { borderColor: '#1b5e20', borderWidth: 2 },
                            },
                        }}
                    >
                        <MenuItem value="">
                            <em>Select Month</em>
                        </MenuItem>
                        {monthOptions.map((week, index) => (
                            <MenuItem key={index} value={week.value}>
                                {week.name}
                            </MenuItem>
                        ))}
                    </Select>
                </Grid>

                {/* Select Year */}
                <Grid item xs={12} sm={6}>
                    <Select
                        name="year"
                        value={filters.year}
                        onChange={handleInputChange}
                        displayEmpty
                        fullWidth
                        size="medium"
                        labelId="year-label"
                        sx={{
                            borderRadius: 2,
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: '#4caf50' },
                                '&:hover fieldset': { borderColor: '#2e7d32' },
                                '&.Mui-focused fieldset': { borderColor: '#1b5e20', borderWidth: 2 },
                            },
                        }}
                    >
                        <MenuItem value="">
                            <em>Select year</em>
                        </MenuItem>                        <MenuItem value={getCurrentYear()}>
                            {getCurrentYear()}
                        </MenuItem>
                    </Select>
                </Grid>
            </Grid>

            <Grid style={{ textAlign: 'center', marginTop: '20px',marginLeft: "35px", width: '100%' }}>
                <ExportSubmitButton label="Export attendance sheet to Excel" />
            </Grid>
        </Box>
    );


}
