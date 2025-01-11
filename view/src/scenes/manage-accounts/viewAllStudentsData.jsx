import React, { useState, useContext, useEffect } from 'react';
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
import lgasAndWards from '../../Lga&wards.json';


export const ViewAllStudentsData = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode)
  const { studentsData, loading, setStudentsData } = useContext(StudentsContext);
  const { wardsData } = useContext(WardsContext);
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    ward: '',
    presentClass: '',
    lgaOfEnrollment: '',
    schoolId: '',
  });

  const clearFilters = async () => {
    setFilters({
      ward: '',
      presentClass: '',
      lgaOfEnrollment: '',
      schoolId: '',
    });
    try {
      const response = await axios.get(`${API_URL}/student`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudentsData(response.data.students);
    } catch (err) {
      console.error("Failed to fetch students data:", err);
    }  };

  const [filterLoading, setFilterLoading] = useState(false);
  const [filterError, setFilterError] = useState(null);

  const API_URL = `${import.meta.env.VITE_API_URL}/api/v1`
  const token = localStorage.getItem('token') || '';
  const allWards = lgasAndWards.flatMap(ward => ward.wards).sort((a, b) => a.localeCompare(b));;


  const classOptions = [
    { class: "Primary 6", id: 1 },
    { class: "JSS 1", id: 2 },
    { class: "JSS 3", id: 3 },
    { class: "SSS 1", id: 4 },
  ];

  const buildQueryString = () => {
    const query = new URLSearchParams();
    const { schoolId, presentClass, lgaOfEnrollment, ward } = filters;

    if (schoolId) query.append('schoolId', schoolId);
    if (ward) query.append('ward', ward);
    if (lgaOfEnrollment) query.append('lgaOfEnrollment', lgaOfEnrollment);
    if (presentClass) query.append('presentClass', presentClass);
    return query.toString();
  };

  const fetchFilteredStudents = async () => {
    const queryString = buildQueryString();
    try {
      setFilterLoading(true);
      const response = await axios.get(`${API_URL}/student?${queryString}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      console.log(response.data);
      console.log(queryString)
     setStudentsData(response.data.students);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        navigate('/sign-in');
      } else {
        setFilterError(err);
      }
    } finally {
      setFilterLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleEdit = (student) => {
    navigate(`/admin-dashboard/update-student/${student._id}`, { state: student })
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchFilteredStudents();
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


  const uniqueSchools = Array.from(
    new Set(
      studentsData.map(student => JSON.stringify({
        schoolName: student.schoolId?.schoolName,
        schoolId: student.schoolId?._id,
      }))
    )
  ).map(item => JSON.parse(item));

  return (
    <Container maxWidth="lg" sx={{ marginTop: 4, marginBottom: "50px" }}>
      <Typography variant="h3" component="h1" gutterBottom textAlign="center" sx={{ fontWeight: 'bold' }}>
        All Registered Students Information
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
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Filter Students</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <InputLabel id="ward-label">Select Ward</InputLabel>
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
                <em>Select Ward</em>
              </MenuItem>
              {allWards?.map((ward, index) => (
                <MenuItem key={index++} value={ward}>
                  {ward}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <InputLabel id="class-label">Select Class</InputLabel>
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
                <em>Select Class</em>
              </MenuItem>
              {classOptions?.map((option) => (
                <MenuItem key={option.id} value={option.class}>
                  {option.class}
                </MenuItem>
              ))}
            </Select>
          </Grid>


          <Grid item xs={12} sm={6} md={4}>
            <InputLabel id="ward-label">Select LGA of Enrollment</InputLabel>
            <Select
              name="lgaOfEnrollment"
              value={filters.lgaOfEnrollment}
              onChange={handleInputChange}
              displayEmpty
              fullWidth
              size="small"
              labelId="ward-label"
            >
              <MenuItem value="">
                <em>Select LGA</em>
              </MenuItem>
              {lgasAndWards?.map((lga) => (
                <MenuItem key={lga.name} value={lga.name}>
                  {lga.name}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <InputLabel id="schoolId-label">Select School</InputLabel>
            <Select
              name="schoolId"
              value={`${filters.schoolId}`}
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
              textTransform: "none", width: '48%',
              color: "#fff", background: colors.main['darkGreen'],
            }}
          >
            Apply Filters
          </Button>
        </Box>
      </Box>

      {/* Table Container */}
      <TableContainer component={Paper} sx={{ boxShadow: 3, marginTop: 5 }}>
        <Table>
          <TableHead>
            <TableRow>

              <TableCell>S/N</TableCell>
              <TableCell>Passport</TableCell>
              <TableCell>Surname</TableCell>
              <TableCell>Firstname</TableCell>
              <TableCell>Middlename</TableCell>
              <TableCell>School Name</TableCell>
              <TableCell>Present Class</TableCell>
              <TableCell>State of Origin/LGA</TableCell>
              <TableCell>LGA of Enrollment</TableCell>
              <TableCell>Ward</TableCell>
              <TableCell>Edit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {studentsData && studentsData.length > 0 ? (
              studentsData.map((student, index) => (
                <TableRow key={index}>
                  <TableCell>{index+1}</TableCell>
                  <TableCell>
                    <img src={`${student.passport}`} alt="Student Passport" />
                  </TableCell>
                  <TableCell>{student.surname}</TableCell>
                  <TableCell>{student.firstname}</TableCell>
                  <TableCell>{student.middlename}</TableCell>
                  <TableCell>{student.schoolId.schoolName}</TableCell>
                  <TableCell>{student.presentClass}</TableCell>
                  <TableCell>{student.stateOfOrigin} | {student.lga}</TableCell>
                  <TableCell>{student.lgaOfEnrollment}</TableCell>
                  <TableCell>{student.ward}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(student)} color="primary">
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No Students Data Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};
