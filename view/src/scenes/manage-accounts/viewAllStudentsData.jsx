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


export const ViewAllStudentsData = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode)
  const { studentsData, loading, setStudentsData } = useContext(StudentsContext);
  const { wardsData } = useContext(WardsContext);
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    ward: '',
    presentClass: '',
    sortBy: '',
    lga: '',
    schoolId: '',
  });

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

  const [filterLoading, setFilterLoading] = useState(false);
  const [filterError, setFilterError] = useState(null);

  const API_URL = `${import.meta.env.VITE_API_URL}/api/v1`
  const token = localStorage.getItem('token') || '';

  const classOptions = [
    { class: "Primary 6", id: 1 },
    { class: "JSS 1", id: 2 },
    { class: "JSS 3", id: 3 },
    { class: "SSS 1", id: 4 },
  ];

  const buildQueryString = () => {
    const query = new URLSearchParams();
    const { schoolId, presentClass, sortBy, lga, ward } = filters;

    if (schoolId) query.append('schoolId', schoolId);
    if (ward) query.append('ward', ward);
    if (lga) query.append('lga', lga);
    if (presentClass) query.append('presentClass', presentClass);
    if (sortBy) query.append('sortBy', sortBy);
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
              {wardsData?.map((ward) => (
                <MenuItem key={ward._id} value={ward._id}>
                  {ward.name}
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
            <em>Sort</em>

            <TextField
              label="Sort By"
              name="sortBy"
              value={filters.sortBy}
              onChange={handleInputChange}
              variant="outlined"
              size="small"
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <em>Select LGA</em>

            <TextField
              label="LGA"
              name="lga"
              value={filters.lga}
              onChange={handleInputChange}
              variant="outlined"
              size="small"
              fullWidth
            />
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
              <TableCell>Surname</TableCell>
              <TableCell>Present Class</TableCell>
              <TableCell>State of Origin</TableCell>
              <TableCell>LGA</TableCell>
              <TableCell>Ward</TableCell>
              <TableCell>Edit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {studentsData && studentsData.length > 0 ? (
              studentsData.map((student, index) => (
                <TableRow key={index}>
                  <TableCell>{student.surname}</TableCell>
                  <TableCell>{student.presentClass}</TableCell>
                  <TableCell>{student.stateOfOrigin}</TableCell>
                  <TableCell>{student.lga}</TableCell>
                  <TableCell>{student.ward.name}</TableCell>
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
