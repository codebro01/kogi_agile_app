import { useContext, useEffect, useCallback } from "react";
import axios from 'axios';
import { StudentsContext } from "../../components/dataContext";
import { Grid, Box, MenuItem, Select, InputLabel } from "@mui/material";
import { useState } from "react";
import { ExportSubmitButton } from "../../components/exportButton";

export const ExportAttendanceSheet = () => {
    const { loading, studentsData } = useContext(StudentsContext);
    const [schoolId, setSchoolId] = useState(''); // Correctly destructured
    const [isSubmitting, setIsSubmitting] = useState(false)
    const API_URL = 'http://localhost:3100/api/v1';

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
        setSchoolId(e.target.value)
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
                params: { schoolId: schoolId },
                responseType: "blob",
                withCredentials: true,
            })

            console.log(response);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'attendanceSheet.xlsx'); // Filename
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Box 
        component={'form'}
        onSubmit={handleSubmit}
        sx={{
            display: "flex",
            justifyContent: "center", 
            alignItems:"center",
            height: "100%",
            width:"100%",
            flexDirection: "column", 
            gap:"40px"

        }}
        >
            <Grid item xs={12} sm={6} md={4}>
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
                        <em>Select School</em>
                    </MenuItem>
                    {uniqueSchools.map((school, index) => (
                        <MenuItem key={index} value={school.schoolId}>
                            {school.schoolName}
                        </MenuItem>
                    ))}
                </Select>
            </Grid>
            <Grid style={{ textAlign: 'center', marginTop: '20px' }}>
                <ExportSubmitButton label="Export attendance sheet to Excel" />
            </Grid>
        </Box>
    )
}
