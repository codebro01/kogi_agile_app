import { useContext, useEffect, useCallback } from "react";
import axios from 'axios';
import { StudentsContext } from "../../components/dataContext";
import { Grid, Box, MenuItem, Select, InputLabel, Autocomplete, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { ExportSubmitButton } from "../../components/exportButton";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllStudents } from "../../components/allStudentsSlice";
import { SpinnerLoader } from "../../components/spinnerLoader";
import { useAuth } from "../auth/authContext";





export const ExportAttendanceSheet = () => {
    const studentsState = useSelector(state => state.allStudents);
    const { data: studentsData, loading, error } = studentsState;
    const [schoolId, setSchoolId] = useState(''); // Correctly destructured
    const [isSubmitting, setIsSubmitting] = useState(false)
    const API_URL = `${import.meta.env.VITE_API_URL}/api/v1`
    const [enumeratorsData, setEnumeratorsData] = useState([]);
    const [enumeratorsLoading, setEnumeratorsLoading] = useState(false);
    const [enumeratorsId, setEnumeratorsId] = useState('');
    const [message, setMessage] = useState('');
    const { userPermissions } = useAuth();



    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(fetchAllStudents());
    }, [])

    if (loading) {
        <Box
            sx={{
                width: "100%",
                justifyContent: "center",
                alignItems: "center"
            }}
        ><SpinnerLoader /></Box>
    }

    const uniqueSchools = Array.from(
        new Set(
            studentsData.map(student => JSON.stringify({
                schoolName: student.schoolId?.schoolName,
                schoolId: student.schoolId?._id,
            }))
        )
    ).map(item => JSON.parse(item));

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
                setEnumeratorsLoading(false);

            }
            catch (err) {
                console.log(err)
                setEnumeratorsLoading(false);
                if (err.response.code === 404 || err.code === 404 || err.response.statusText === 'Not Found') {
                    setMessage('Not records found for the filter')
                    return;
                }

                setMessage(err.response.data.message || 'An error occured downloading the sheet')

            }

        })()
    }, [])

    const handleInputChange = (e) => {
        if (e.target.name === 'schoolId') {

            setSchoolId(e.target.value);
            return;
        }

        setEnumeratorsId(e.target.value)

    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            const token = localStorage.getItem('token');

            const response = await axios.get(`${API_URL}/student/attendance-sheet`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: { schoolId: schoolId, createdBy: enumeratorsId },
                responseType: "blob",
                withCredentials: true,
            })

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'attendanceSheet.xlsx'); // Filename
            document.body.appendChild(link);
            link.click();
            setIsSubmitting(false);

        } catch (error) {
            console.log(error)
            setIsSubmitting(false);
            if (error.response.code === 404 || error.code === 404 || error.response.statusText === 'Not Found') {
                setMessage('Not records found for the filter')
            }

            setMessage(error.response.data.message || 'An error occured downloading the sheet')

        }
    }


    const noFilter = !schoolId && !enumeratorsId

    setTimeout(() => setMessage(''), 15000)
    return (
        <Box
            component={'form'}
            onSubmit={handleSubmit}
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                width: "100%",
                flexDirection: "column",
                gap: "40px"

            }}
        >
            {/* <Grid item xs={12} sm={6} md={4}>
                <InputLabel id="schoolId-label">Select School</InputLabel>
                <Select
                    name="schoolId"
                    value={schoolId} // Corrected: Bind to the schoolId state
                    onChange={handleInputChange}
                    displayEmpty
                    fullWidth
                    size="small"
                    labelId="schoolId-label"
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
            </Grid> */}

            {loading ? <SpinnerLoader/> : (

            <Grid item xs={12}>
                <Autocomplete
                sx = {{
                    width: "250px"
                }}
                    fullWidth
                    options={uniqueSchools}
                    getOptionLabel={(option) => option.schoolName || ''}
                    value={uniqueSchools.find((school) => school.schoolId === schoolId) || null} // Match based on schoolId
                    onChange={(event, newValue) => {
                        handleInputChange({
                            target: { name: 'schoolId', value: newValue ? newValue.schoolId : '' },
                        });
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Select School"
                            variant="outlined"
                            size="small"
                            fullWidth
                            sx={{
                                width: "100%"
                            }}
                        />
                    )}
                    isOptionEqualToValue={(option, value) => option.schoolId === value.schoolId} // Ensure proper comparison
                />
            </Grid>
            )}


            {userPermissions.includes('handle_registrars') && (
                <>
                    {enumeratorsLoading ? (
                        <SpinnerLoader />
                    ) : (
                        <Grid item xs={12}>
                            {/* <InputLabel id="enumerator-label" sx={{ marginBottom: 1 }}>Select Enumerator</InputLabel> */}
                            <Autocomplete
                                    sx={{
                                        width: "250px"
                                    }}
                                id="enumerator-autocomplete"
                                options={enumeratorsData || []}
                                getOptionLabel={(option) => option.fullName || ''}
                                value={enumeratorsData?.find((enumerator) => enumerator._id === enumeratorsId) || null} // Match based on ID
                                onChange={(event, newValue) => {
                                    handleInputChange({
                                        target: { name: 'enumerator', value: newValue ? newValue._id : '' },
                                    });
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Select Enumerator"
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                    />
                                )}
                                isOptionEqualToValue={(option, value) => option._id === value?._id} // Ensure proper comparison
                                noOptionsText="No Enumerators Found" // Message when no options are available
                            />
                        </Grid>
                    )}
                </>
            )}


            {isSubmitting ? <SpinnerLoader/> : noFilter ? "" : (
            <Grid style={{ textAlign: 'center', marginTop: '20px' }}>
                <ExportSubmitButton label="Export attendance sheet to Excel" />
            </Grid>
            )}

            <Box
                sx = {{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%"
                }}
            >
                <Typography>
                    {message}
                </Typography>
            </Box>
        </Box>
    )
}
