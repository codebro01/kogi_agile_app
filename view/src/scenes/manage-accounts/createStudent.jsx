import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Grid, Container, Autocomplete, Typography, Box, IconButton, InputAdornment, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
// import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import { getNigeriaStates } from 'geo-ng';
import { SchoolsContext, WardsContext } from "../../components/dataContext.jsx";
import { SpinnerLoader } from '../../components/spinnerLoader.jsx';
import lgasAndWards from '../../Lga&wards.json';

axios.defaults.withCredentials = true;

export const CreateStudent = () => {
  // const theme = useTheme();
  const { loading } = useContext(SchoolsContext);

  const [bankList, setBankList] = useState([
    'FCMB', 'Polaris Bank', 'Zenith Bank'
  ]);

  const [occupations, setOccupation] = useState([
    'Farmer', 'Teacher', "Trader", 'Mechanic', 'Tailor', 'Bricklayer', 'Carpenter', 'Doctor', 'Lawyer', 'Butcher', 'Electrician', 'Clergyman', 'Barber', 'Hair Dresser', "Business Person", 'Others'
  ])



  const navigate = useNavigate();
  const nationalityOptions = [
    { value: 'Nigeria', label: 'Nigeria' },
    { value: 'Others', label: 'Others' }
  ];

  const [formData, setFormData] = useState({
    ward: "",
    schoolId: "",
    surname: "",
    firstname: "",
    middlename: "",
    studentNin: "",
    dob: "",
    stateOfOrigin: "",
    lga: "",
    lgaOfEnrollment: "",
    gender: "",
    communityName: "",
    residentialAddress: "",
    presentClass: "",
    yearAdmitted: "",
    yearOfEnrollment: "",
    parentPhone: "",
    parentName: "",
    parentNin: "",
    nationality: "Nigeria",
    parentContact: "",
    parentOccupation: "",
    bankName: "",
    accountNumber: "",
    parentBvn: "",
    image: null,

  });




  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false)
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});
  const API_URL = `${import.meta.env.VITE_API_URL}/api/v1`
  const [states, setStates] = useState([]);
  const [lgas, setLgas] = useState([]);
  const [wardValue, setWardValue] = useState(null)
  const [formSubmissionLoading, setFormSubmissionLoading] = useState(false);
  const [storedSchool, setStoredSchool] = useState(null);
  const [selectedLga, setSelectedLga] = useState("");  // State for LGA selection
  const [selectedWard, setSelectedWard] = useState("");  // State for Ward selection



  useEffect(() => {
    const retrievedSchool = sessionStorage.getItem('selectedSchool');
    setStoredSchool(JSON.parse(retrievedSchool));  // Store the retrieved value in state
  }, []);



  const handleChange = useCallback((e) => {
    const { name, value, files } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: files ? files[0] : value,
    }));
  }, []);

  useEffect(() => {
    if (storedSchool) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        schoolId: storedSchool._id, // Set the school ID
      }));
    }
  }, [storedSchool]);

  const getLGAs = (stateName) => {
    const state = getNigeriaStates().find((s) => s.name === stateName);
    return state ? state.lgas : [];
  };





  useEffect(() => {
    if (formData.nationality === 'Nigeria') {
      const statesObjects = getNigeriaStates();
      const newStates = statesObjects.map((state) => state.name);
      setStates(newStates);
    } else {
      setStates([]);
      setLgas([]);
    }
  }, [formData.nationality]);

  useEffect(() => {
    if (formData.stateOfOrigin && formData.nationality === 'Nigeria') {
      const lgas = getLGAs(formData.stateOfOrigin);
      setLgas(lgas);
    } else {
      setLgas([]);
    }
  }, [formData.stateOfOrigin, formData.nationality]);

  const handleStateChange = (selectedState) => {
    setFormData({
      ...formData,
      stateOfOrigin: selectedState,
      lga: '' // Reset LGA when state changes
    });
  };


  const handleSelectChange = (e, { name }) => {
    setSelectedLga(e.target.value);
    setSelectedWard("");
    setFormData((prevData) => ({
      ...prevData,
      [name]: e.target.value, // Update the correct field based on `name`
    }));
  };
  const selectedLgaWards = lgasAndWards.find(lga => lga.name === selectedLga)?.wards || [];


  const handleWardChange = (selectedWard) => {
    setFormData({
      ...formData,
      ward: selectedWard,
      // Reset LGA when state changes
    });
  };

  const handleSearch = (e) => {
    const searchQuery = e.target.value.toLowerCase();
    const filteredBanks = bankList.filter(bank =>
      bank.toLowerCase().includes(searchQuery)
    );
    setBankList(filteredBanks);
  }



  const handleSubmit = (e) => {
    e.preventDefault();

    (async () => {
      try {
        setFormSubmissionLoading(true)
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/student`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        });
        setSuccess(true);
        setSuccessMessage(`Great Job!!! New student registration successful!!!`)
        console.log(response);
        const formSubmissionSuccess = true;
        if (formSubmissionSuccess) {
          // Clear form fields
          setFormData({
            ward: "",
            schoolId: storedSchool._id,
            surname: "",
            firstname: "",
            middlename: "",
            studentNin: "",
            dob: "",
            stateOfOrigin: "",
            lga: "",
            lgaOfEnrollment: "",
            gender: "",
            communityName: "",
            residentialAddress: "",
            presentClass: "",
            yearAdmitted: "",
            yearOfEnrollment: "",
            parentPhone: "",
            parentName: "",
            parentNin: "",
            nationality: "Nigeria",
            parentContact: "",
            parentOccupation: "",
            bankName: "",
            accountNumber: "",
            parentBvn: "",
            image: null,
          });

          // Optionally display a success message or reset other states
        }
        setFormSubmissionLoading(false)
        setTimeout(() => setSuccessMessage(''), 20000);

      } catch (err) {
        console.log(err);
        setFormSubmissionLoading(false)
        if (err.response?.data?.status === 401) return navigate('/sign-in')
        setError(true)
        setValidationError(err.response?.data?.message || 'An error occurred');
        setTimeout(() => setValidationError(''), 20000);
      }
    })();

  };

  // ** clear fields if students creation is successful


  // setTimeout(() => {
  //   setError('')
  //   setSuccess('')
  // }, 10000)

  // const wards = wardsData.map(ward => ward.name.toString());
  return (
    <>
      <Container maxWidth="sm" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', paddingTop: '16px', paddingBottom: '16px', marginTop: '32px', marginBottom: '50px' }}>
        <Box sx={{ p: 4, borderRadius: 2, boxShadow: 3, backgroundColor: 'white', width: '100%' }}>
          <Typography variant="h4" gutterBottom align="center" textTransform="uppercase" fontWeight="bolder" marginBottom="20px">
            Students Registration Form
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {[{ label: 'Surname', name: 'surname' },
              { label: 'Firstname', name: 'firstname' }
              ].map(({ label, name }) => (
                <Grid item xs={12} key={name}>
                  <TextField
                    label={label}
                    name={name}
                    variant="outlined"
                    fullWidth
                    value={formData[name]}
                    onChange={handleChange}
                    error={errors[name]}

                    required
                  />
                </Grid>
              ))}



              <Grid item xs={12} key={'middlename'}>
                <TextField
                  label={'Middlename'}
                  name={'middlename'}
                  variant="outlined"
                  fullWidth
                  value={formData.middlename}
                  onChange={handleChange}

                  required
                />
              </Grid>


              <Grid item xs={12}>
                <TextField
                  label="Student Nin"
                  name="studentNin"
                  type="text"
                  variant="outlined"
                  fullWidth
                  value={formData.studentNin}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{
                    maxLength: 11, // Stops further input after 11 characters
                    pattern: "\\d{11}", // Requires exactly 11 digits
                    title: "Student Nin must be exactly 11 digits", // Shows this message on invalid input
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Date of Birth"
                  name="dob"
                  type="date"
                  variant="outlined"
                  fullWidth
                  value={formData.dob}
                  onChange={handleChange}
                  error={errors.dob}

                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="School"
                  name="schoolId"
                  variant="outlined"
                  fullWidth
                  value={storedSchool?.schoolName || 'No school found'}
                  error={errors.school}
                  required
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    readOnly: true, // Make it readonly
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Gender"
                  name="gender"
                  select
                  variant="outlined"
                  fullWidth
                  value={formData.gender}
                  onChange={handleChange}
                  error={errors.gender}

                  required
                >
                  <MenuItem value="Female">Female</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Nationality"
                  name="nationality"
                  select
                  variant="outlined"
                  fullWidth
                  value={formData.nationality}
                  onChange={(e) => handleSelectChange(e, { name: 'nationality' })}
                  error={errors['Nationality']}

                  required

                >
                  <MenuItem value="Nigeria">Nigeria</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                  {/* Add more nationalities as needed */}
                </TextField>
              </Grid>

              {/* State of Origin Select (visible only if nationality is Nigeria) */}
              {formData.nationality === 'Nigeria' && (
                <Grid item xs={12}>
                  <TextField
                    label="State of Origin"
                    name="stateOfOrigin"
                    select
                    variant="outlined"
                    fullWidth
                    value={formData.stateOfOrigin || ''}
                    onChange={(e) => handleStateChange(e.target.value)}
                    required
                  >
                    {states.map((state) => (
                      <MenuItem key={state} value={state}>
                        {state}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              )}

              {formData.nationality === 'Others' && (
                <Grid item xs={12}>
                  <TextField
                    label="Nationality (Specify)"
                    name="customNationality"
                    variant="outlined"
                    fullWidth
                    value={formData.customNationality}
                    onChange={handleChange}

                  />
                </Grid>
              )}

              {/* LGA Select (visible only if a state is selected and nationality is Nigeria) */}
              {formData.stateOfOrigin && formData.nationality === 'Nigeria' && (
                <Grid item xs={12}>
                  <TextField
                    label="LGA of Origin"
                    name="lga"
                    select
                    variant="outlined"
                    fullWidth
                    value={formData.lga || ''}
                    onChange={(e) => handleSelectChange(e, { name: 'lga' })}
                    error={errors['LGA']}

                    required

                  >
                    {lgas.map((lga) => (
                      <MenuItem key={lga} value={lga}>
                        {lga}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              )}

              <Grid item xs={12}>
                <TextField
                  label="LGA of Enrollment"
                  name="lgaOfEnrollment"
                  select
                  variant="outlined"
                  fullWidth
                  value={formData.lgaOfEnrollment || ''}
                  onChange={(e) => handleSelectChange(e, { name: 'lgaOfEnrollment' })}
                  error={errors['LGA']}
                  required

                >
                  {lgasAndWards.map((lga) => (
                    <MenuItem key={lga.name} value={lga.name}>
                      {lga.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              {formData.lgaOfEnrollment && <Grid item xs={12}>
                <TextField
                  label="Wards"
                  name="ward"
                  select
                  variant="outlined"
                  fullWidth
                  value={formData.ward || ''} // Using ward ID
                  onChange={(e) => handleWardChange(e.target.value)} // Updating the form data with the ward ID
                >
                  {selectedLgaWards.map((ward, index) => (
                    <MenuItem key={index} value={ward}> {/* Use ward._id as the value */}
                      {ward} {/* Display ward.name to the user */}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>}




              {formData.nationality === 'Others' && (
                <Grid item xs={12}>
                  <TextField
                    label="Nationality (Specify)"
                    name="customNationality"
                    variant="outlined"
                    fullWidth
                    value={formData.customNationality}
                    onChange={handleChange}

                  />
                </Grid>
              )}


              {[{ label: 'Name of community / Town of Residence', name: 'communityName' },
              { label: 'Residential Address', name: 'residentialAddress' }].map(({ label, name }) => (
                <Grid item xs={12} key={name}>
                  <TextField
                    label={label}
                    name={name}
                    variant="outlined"
                    fullWidth
                    value={formData[name]}
                    onChange={handleChange}
                    error={errors[name]}

                    required

                  />
                </Grid>
              ))}

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Present Class</InputLabel>
                  <Select
                    name="presentClass"
                    value={formData.presentClass}
                    onChange={handleChange}
                    label="Present Class"
                    error={errors['Present Class']}

                    required
                  >
                    <MenuItem value="Primary 6">Primary 6</MenuItem>
                    <MenuItem value="JSS 1">JSS 1</MenuItem>
                    <MenuItem value="JSS 3">JSS 3</MenuItem>
                    <MenuItem value="SSS 1">SSS 1</MenuItem>
                  </Select>
                </FormControl>
              </Grid>


              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Year of enrollment</InputLabel>
                  <Select
                    name="yearOfEnrollment"
                    value={formData.yearOfEnrollment}
                    onChange={handleChange}
                    label="Year of Erollment"
                    error={errors['Year of Enrollment']}
                    required                >
                    <MenuItem value="2024">2024</MenuItem>
                    <MenuItem value="2025">2025</MenuItem>
                    <MenuItem value="2026">2026</MenuItem>
                    <MenuItem value="2027">2027</MenuItem>
                    <MenuItem value="2028">2028</MenuItem>
                    <MenuItem value="2029">2029</MenuItem>

                  </Select>
                </FormControl>
              </Grid>


              {[{ label: 'Parent/caregiver Name', name: 'parentName' },

              ].map(({ label, name }) => (
                <Grid item xs={12} key={name}>
                  <TextField
                    label={label}
                    name={name}
                    variant="outlined"
                    fullWidth
                    value={formData[name]}
                    onChange={handleChange}
                    error={errors[name]}

                    required
                  />
                </Grid>
              ))}

              <Grid item xs={12}>
                <TextField
                  label={'Parent/caregiver phone No.'}
                  name={'parentPhone'}
                  variant="outlined"
                  fullWidth
                  value={formData.parentPhone}
                  onChange={handleChange}
                  inputProps={{
                    maxLength: 11, // Stops further input after 11 characters
                    pattern: "\\d{11}", // Requires exactly 11 digits
                    title: "Phone number must be exactly 11 digits", // Shows this message on invalid input
                  }}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label={'Parent/caregiver NIN'}
                  name={"parentNin"}
                  variant="outlined"
                  fullWidth
                  value={formData.parentNin}
                  onChange={handleChange}
                  inputProps={{
                    maxLength: 11, // Stops further input after 11 characters
                    pattern: "\\d{11}", // Requires exactly 11 digits
                    title: "Parent Nin must be exactly 11 digits", // Shows this message on invalid input
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label={'Parent/caregiver BVN'}
                  name={"parentBvn"}
                  variant="outlined"
                  fullWidth
                  value={formData.parentBvn}
                  onChange={handleChange}
                  inputProps={{
                    maxLength: 11, // Stops further input after 11 characters
                    pattern: "\\d{11}", // Requires exactly 11 digits
                    title: "BVN must be exactly 11 digits", // Shows this message on invalid input
                  }}
                />
              </Grid>



              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Parent/Caregiver Occupation</InputLabel>
                  <Select
                    name="parentOccupation"
                    value={formData.parentOccupation}
                    onChange={handleChange}
                    label="Occupation"
                    error={errors['parent Occupation']}

                    required
                  >

                    {occupations.map((occupation, index) => {
                      return <MenuItem key={index} value={occupation}>{occupation}</MenuItem>

                    })}
                  </Select>
                </FormControl>
              </Grid>


              {formData.parentOccupation === 'Others' && (
                <Grid item xs={12}>
                  <TextField
                    label="Occupation (Specify)"
                    name="parentOccupation"
                    variant="outlined"
                    fullWidth
                    value={formData.parentOccupation}
                    onChange={handleChange}

                  />
                </Grid>
              )}

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Bank Name</InputLabel>
                  <Select
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    label="Bank Name"
                  >
                    <MenuItem value="Access Bank">FCMB</MenuItem>
                    <MenuItem value="Polaris Bank">Polaris Bank</MenuItem>
                    <MenuItem value="Zenith Bank">Zenith Bank</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Account Number"
                  name="accountNumber"
                  variant="outlined"
                  fullWidth
                  value={formData.accountNumber}
                  onChange={handleChange}
                  inputProps={{
                    maxLength: 10, // Stops further input after 10 characters
                    pattern: "\\d{10}", // Requires exactly 11 digits
                    title: "Account Number must be exactly 10 digits", // Shows this message on invalid input
                  }}
                />
              </Grid>

              <div style={{ margin: "20px" }}>
                <label
                  htmlFor="file-upload"
                  style={{ cursor: "pointer", display: "block" }}
                >
                  <strong>Add a passport </strong>
                </label>
                <input
                  id="file-upload"
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  style={{ marginBottom: "10px" }}
                />
                {/* Display the file name */}
                {formData.image && (
                  <p>
                    Selected File: <strong>{formData.image.name}</strong>
                  </p>
                )}
              </div>


              {!formSubmissionLoading && <Grid item xs={12} marginTop="20px">
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{
                    backgroundColor: "#196b57",
                    color: "#ffffff",
                    "&:hover": {
                      backgroundColor: "#40550f", // Slightly darker green for hover
                    },
                  }}
                >
                  Register Student
                </Button>
              </Grid>}

            </Grid>
            <Box
              variant="body2"
              style={{
                marginTop: '8px',
                fontWeight: 'bold',
                textAlign: 'center', // Center align the text
              }}
            >
              {formSubmissionLoading && <Grid sx={{
                display: "flex",
                width: "100%",
                justifyContent: "center",
                alignItems: "center"
              }}><SpinnerLoader /></Grid>}
              {success && (
                <Typography
                  variant="h5"
                  fontWeight={600}
                  color="green"
                  sx={{ textAlign: "center", marginTop: "20px" }}
                >
                  {successMessage}
                </Typography>
              )}

              {error && (
                <Typography
                  variant="h5"
                  fontWeight={600}
                  color="red"
                  sx={{ textAlign: "center", marginTop: "20px" }}
                >
                  {validationError}
                </Typography>
              )}

            </Box>
          </form>
        </Box>
      </Container>
    </>
  );

};
