import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate if navigating

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


  const API_URL = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem('token') || ''; // Get token from localStorage
  const navigate = useNavigate();




  // Fetch data
  useEffect(() => {
    const fetchStudentsData = async () => {
      try {
        setLoading(true);

        const fetchStudentsResponse = await axios.get(`${API_URL}/student`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        });

        const fetchSchoolsResponse = await axios.get(`${API_URL}/all-schools`);
        const fetchWardsResponse = await axios.get(`${API_URL}/wards`);

        setSchoolsData(fetchSchoolsResponse.data.allSchools);
        setStudentsData(fetchStudentsResponse.data.students);
        setWardsData(fetchWardsResponse.data.wards);

        setLoading(false);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) {
          navigate('/sign-in'); // Navigate to sign-in if unauthorized
        } else {
          setError(err);
        }
        setLoading(false);
      }
    };

    fetchStudentsData();
  }, [API_URL, navigate, token]); // Add `filters` to the dependency array

  return (
    <StudentsContext.Provider value={{ studentsData, loading, error, setStudentsData, setLoading }}>
      <SchoolsContext.Provider value={{ selectedSchool, setSelectedSchool, schoolsData, loading, error }}>
        <WardsContext.Provider value={{ wardsData, loading, error }}>
          {children}
        </WardsContext.Provider>
      </SchoolsContext.Provider>
    </StudentsContext.Provider>
  );
};
