import React, { useState, useContext, useEffect } from 'react';
import {
  Container, Typography, Table, Button, TableBody, TableCell,
  Select, MenuItem, TableContainer, TableHead, TableRow, Paper, Box, TextField, IconButton
} from '@mui/material';
import { StudentsContext, WardsContext } from '../../components/dataContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import EditIcon from "@mui/icons-material/Edit";


export const ViewAllStudentsData = () => {
  const { studentsData, loading, setStudentsData } = useContext(StudentsContext);
  const { wardsData } = useContext(WardsContext); // Assuming wardsData is an array of ward objects
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

  const API_URL = 'http://localhost:3100/api/v1';
  const token = localStorage.getItem('token') || '';

  // Function to build the query string based on filters


  // class options 

const classOptions = [
  {class: "Primary 6", id: 1},
  {class:"JSS 1", id: 2},
  {class: "JSS 3", id: 3},
  {class: "SS 1", id: 4},
  ]






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
console.log(buildQueryString());
  // Fetch filtered data
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
        navigate('/sign-in'); // Navigate to sign-in if unauthorized
      } else {
        setFilterError(err);
      }
    } finally {
      setFilterLoading(false);
    }
  };

  // Handle input changes for filters
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleEdit = (student) => {
    navigate(`/admin-dashboard/update-student/${student._id}`, {state: student})
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchFilteredStudents();
  };

  if (loading) return <h1>Students Information is Loading...</h1>;


   const uniqueSchools = Array.from(
  new Set(
    studentsData.map(student => JSON.stringify({
      schoolName: student.schoolId?.schoolName,
      schoolId: student.schoolId?._id,
    }))
  )
).map(item => JSON.parse(item));

// Now `uniqueSchools` will be an array of objects with unique `schoolName` and `schoolId`
console.log(uniqueSchools);



  // const filteredStudents = studentsData.filter(student => 
  //   (filters.schoolId ? student.schoolId.schoolName === filters.schoolId : true)
  // )

// console.log('Filters:', filters);
//   console.log('Filtered Students:', filteredStudents); 



  return (
    <Container maxWidth="lg" sx={{ marginTop: 4 }}>
      {/* Heading */}
      <Typography variant="h1" component="h1" gutterBottom textAlign="center">
        All Registered Students Information
      </Typography>

      {/* Filter Form */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        display="flex"
        alignItems="center"
        gap={2}
        p={2}
        sx={{
          backgroundColor: "#f9f9f9",
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        <Select
          name="ward"
          value={filters.ward}
          onChange={handleInputChange}
          displayEmpty
          size="small"
          sx={{ 
            minWidth: 80, 
            width: "120px"
            }}
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

        <Select
          name="presentClass"
          value={filters.presentClass}
          onChange={handleInputChange}
          displayEmpty
          fullWidth
          size="small"
 sx={{ 
            minWidth: 80, 
            width: "120px"
            }}        >
          <MenuItem value="">
            <em>Select Class</em>
          </MenuItem>
          {classOptions?.map((option)=> (
            <MenuItem key={option._id} value={option.class}>
              {option.class}
            </MenuItem>
          ))}
        </Select>

        {/* <TextField
          label="Class"
          name="presentClass"
          value={filters.presentClass}
          onChange={handleInputChange}
          variant="outlined"
          size="small"
        /> */}
        <TextField
          label="Sort By"
          name="sortBy"
          value={filters.sortBy}
          onChange={handleInputChange}
          variant="outlined"
          size="small"
        />
        <TextField
          label="LGA"
          name="lga"
          value={filters.lga}
          onChange={handleInputChange}
          variant="outlined"
          size="small"
        />
                  <Select
            name="schoolId"
            value={`${filters.schoolId}`}
            onChange={handleInputChange}
            displayEmpty
            fullWidth
            size="small"
            sx={{ width: '120px' }}
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
        <Button
          type="button"
          variant="contained"
          color="primary"
          size="large"
          sx={{
            textTransform: "none",
          }}
          onClick = {clearFilters}
        >
          Reset Filters
        </Button>


        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          sx={{
            textTransform: "none",
          }}
        >
          Apply Filters
        </Button>
      </Box>

      {/* Table Container */}
      <TableContainer component={Paper} sx={{ boxShadow: 3, marginTop: 5  }}>
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
                  <TableCell><IconButton onClick={() => handleEdit(student)} color="primary">
                    <EditIcon />
                  </IconButton></TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
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
