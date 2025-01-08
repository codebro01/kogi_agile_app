import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate if navigating
import { SpinnerLoader } from './spinnerLoader';
import { Box } from '@mui/material';
// Create the context
export const StudentsContext = createContext();
export const SchoolsContext = createContext();
export const WardsContext = createContext();

// Create the provider component
export const DataProvider = ({ children }) => {
  const [studentsData, setStudentsData] = useState([]);
  const [schoolsData, setSchoolsData] = useState([]);
  const [wardsData, setWardsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState(null);

  const API_URL = `${import.meta.env.VITE_API_URL}/api/v1`;
  const token = localStorage.getItem('token') || '';
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [studentsRes, schoolsRes, wardsRes] = await Promise.all([
          axios.get(`${API_URL}/student`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          }),
          axios.get(`${API_URL}/all-schools`),
          axios.get(`${API_URL}/wards`),
          axios.get(`${API_URL}/student/`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          }),
        ]);

        setStudentsData(studentsRes.data.students);
        setSchoolsData(schoolsRes.data.allSchools);
        setWardsData(wardsRes.data.wards);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) {
          navigate('/sign-in');
        } else {
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_URL, navigate, token]);

  return (
    <StudentsContext.Provider value={{ studentsData, setStudentsData }}>
      <SchoolsContext.Provider value={{ selectedSchool, setSelectedSchool, schoolsData }}>
        <WardsContext.Provider value={{ wardsData }}>
          {loading ? <Box sx= {{display: "flex", justifyContent:"center", alignItems: "center", height: "80vh"}}><SpinnerLoader /></Box> : children}
          {error && <div>Error: {error.message}</div>}
        </WardsContext.Provider>
      </SchoolsContext.Provider>
    </StudentsContext.Provider>
  );
};

