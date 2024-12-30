import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Grid, Container, Autocomplete, Typography, Box, IconButton, InputAdornment, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
// import { useTheme } from '@mui/material/styles';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from 'axios';
import { getNigeriaStates } from 'geo-ng';
import { SchoolsContext, WardsContext } from "../../components/dataContext.jsx";


axios.defaults.withCredentials = true;

export const CreateStudent = () => {
  // const theme = useTheme();
  const { selectedSchool, loading } = useContext(SchoolsContext);

  const { wardsData } = useContext(WardsContext)

  const [bankList, setBankList] = useState([
    'Access Bank', 'Citibank Nigeria', 'Diamond Bank', 'Ecobank Nigeria', 'Fidelity Bank',
    'First Bank of Nigeria', 'Guaranty Trust Bank', 'Heritage Bank', 'Jaiz Bank', 'Keystone Bank',
    'Lapo Microfinance Bank', 'Mainstreet Bank', 'Polaris Bank', 'Stanbic IBTC Bank', 'Sterling Bank',
    'Union Bank', 'United Bank for Africa (UBA)', 'Wema Bank', 'Zenith Bank'
  ]);



  const navigate = useNavigate();
  const nationalityOptions = [
    { value: 'Nigeria', label: 'Nigeria' },
    { value: 'Others', label: 'Others' }
  ];
  const schoolId = selectedSchool._id;
  const [formData, setFormData] = useState({
    ward: "",
    schoolId: "",
    surname: "",
    otherNames: "",
    dob: "",
    phone: "",
    nationality: "Nigeria",
    stateOfOrigin: "",
    lga: "",
    gender: "",
    communityName: "",
    residentialAddress: "",
    presentClass: "",
    yearAdmitted: "",
    classAtAdmission: "",
    guardianContact: "",
    guardianOccupation: "",
    bankName: "",
    accountNumber: "",
    image: null,
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false)
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [errors, setErrors] = useState({});
  const API_URL = 'http://localhost:3100/api/v1';
  const [states, setStates] = useState([]);
  const [lgas, setLgas] = useState([]);
  const [wardValue, setWardValue] = useState(null)





  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });

  };

  useEffect(() => {
    if (selectedSchool) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        schoolId: selectedSchool._id, // Set the school ID
      }));
    }
  }, [selectedSchool]);

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

  const handleSelectChange = (e, { name }) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: e.target.value, // Update the correct field based on `name`
    }));
  };

  const handleStateChange = (selectedState) => {
    setFormData({
      ...formData,
      stateOfOrigin: selectedState,
      lga: '' // Reset LGA when state changes
    });
  };
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
    const newErrors = {
      surname: !formData.surname,
      lastname: !formData.lastname,
      gender: !formData.gender,
      phone: !formData.phone,
      email: !formData.email || !/\S+@\S+\.\S+/.test(formData.email),
      password: !formData.password,
      address: !formData.address,
      bank: !formData.bankName,
      accountNumber: !formData.accountNumber,
      image: !formData.image,
    };
    setErrors(newErrors);

    (async () => {
      try {
        console.log(formData)
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/student`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        });
        console.log(response)
        setSuccess(true);
      } catch (err) {
        console.log(err)
        if(err.response.status === 401)return  navigate('/sign-in')
        setError(true)
        setValidationError(err.response?.message || 'An error occurred');
        setTimeout(() => setValidationError(''), 3000);
      }
    })();

    if (!Object.values(newErrors).includes(true)) {

    }
  };

  if (loading) return (
    <h4>Loading schools and wards ..............</h4>
  )

  setTimeout(() => {
    setError('')
    setSuccess('')
  }, 10000)

  const wards = wardsData.map(ward => ward.name.toString());
  return (
    <>
      <Container maxWidth="sm" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', paddingTop: '16px', paddingBottom: '16px', marginTop: '32px', marginBottom: '50px' }}>
        <Box sx={{ p: 4, borderRadius: 2, boxShadow: 3, backgroundColor: 'white', width: '100%' }}>
          <Typography variant="h4" gutterBottom align="center" textTransform="uppercase" fontWeight="bolder" marginBottom="20px">
            Create Students
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {[{ label: 'Surname', name: 'surname' },
              { label: 'Other Names', name: 'otherNames' },
              { label: 'Phone', name: 'phone' }].map(({ label, name }) => (
                <Grid item xs={12} key={name}>
                  <TextField
                    label={label}
                    name={name}
                    variant="outlined"
                    fullWidth
                    value={formData[name]}
                    onChange={handleChange}
                    error={errors[name]}
                    helperText={errors[name] && `${label} is required`}
                    required
                  />
                </Grid>
              ))}

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
                  helperText={errors.dob && 'Date of Birth is required'}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="School"
                  name="schoolId"
                  variant="outlined"
                  fullWidth
                  value={selectedSchool.schoolName}
                  error={errors.school}
                  helperText={errors.school && 'School name is required'}
                  InputLabelProps={{ shrink: true }}
                  required
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
                  helperText={errors.gender && 'Gender is required'}
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
                    error={formData.stateOfOrigin === ''} // For example, you can pass `true` or `false` here
                    helperText={formData.stateOfOrigin === '' ? 'State of Origin is required' : ''}
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

              {/* LGA Select (visible only if a state is selected and nationality is Nigeria) */}
              {formData.stateOfOrigin && formData.nationality === 'Nigeria' && (
                <Grid item xs={12}>
                  <TextField
                    label="LGA"
                    name="lga"
                    select
                    variant="outlined"
                    fullWidth
                    value={formData.lga || ''}
                    onChange={(e) => handleSelectChange(e, { name: 'lga' })}
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
              {formData.nationality === 'Others' && (
                <Grid item xs={12}>
                  <TextField
                    label="Nationality (Specify)"
                    name="customNationality"
                    variant="outlined"
                    fullWidth
                    value={formData.customNationality}
                    onChange={handleChange}
                    required
                  />
                </Grid>
              )}

              <Grid item xs={12} > {/* Adjusts the grid item size based on screen size */}
                {/* <Autocomplete
                  value={wardValue}
                  onChange={(event, newValue) => {
                    setWardValue(newValue); // Set the selected object
                    setFormData({ ...formData, ward: newValue?.id || '' }); // Store the ID in formData
                  }}
                  options={wards}
                  getOptionLabel={(option) => option.name} // Display the label
                  isOptionEqualToValue={(option, value) => option.id === value?.id} // Match by ID
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Ward"
                      InputProps={{
                        ...params.InputProps,
                        readOnly: true, // Prevent typing
                      }}
                    />
                  )}
                  disableClearable
                /> */}

              </Grid>
              {wardsData.length > 1 && (
                <Grid item xs={12}>
                  <TextField
                    label="Wards"
                    name="ward"
                    select
                    variant="outlined"
                    fullWidth
                    value={formData.ward || ''} // Using ward ID
                    onChange={(e) => handleWardChange(e.target.value)} // Updating the form data with the ward ID
                    error={formData.ward === ''} // Error if the ward is not selected
                    helperText={formData.ward === '' ? 'Ward is required' : ''}
                    required
                  >
                    {wardsData.map((ward) => (
                      <MenuItem key={ward._id} value={ward._id}> {/* Use ward._id as the value */}
                        {ward.name} {/* Display ward.name to the user */}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              )}


              {[{ label: 'Community Name', name: 'communityName' },
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
                    helperText={errors[name] && `${label} is required`}
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
                    error={errors.presentClass}
                  >
                    <MenuItem value="Primary 6">Primary 6</MenuItem>
                    <MenuItem value="JSS 1">JSS 1</MenuItem>
                    <MenuItem value="JSS 3">JSS 3</MenuItem>
                    <MenuItem value="SS 1">SS 1</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Class at Admission</InputLabel>
                  <Select
                    name="classAtAdmission"
                    value={formData.classAtAdmission}
                    onChange={handleChange}
                    label="Class at Admission"
                    error={errors.classAtAdmission}
                  >
                    <MenuItem value="Primary 6">Primary 6</MenuItem>
                    <MenuItem value="JSS 1">JSS 1</MenuItem>
                    <MenuItem value="JSS 2">JSS 2</MenuItem>
                    <MenuItem value="JSS 3">JSS 3</MenuItem>
                    <MenuItem value="SS 1">SS 1</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Year Admitted</InputLabel>
                  <Select
                    name="yearAdmitted"
                    value={formData.yearAdmitted}
                    onChange={handleChange}
                    label="Year Admitted"
                    error={errors.yearAdmitted}
                  >
                    <MenuItem value="2020">2020</MenuItem>
                    <MenuItem value="2021">2021</MenuItem>
                    <MenuItem value="2022">2022</MenuItem>
                    <MenuItem value="2023">2023</MenuItem>
                    <MenuItem value="2024">2024</MenuItem>
                    <MenuItem value="2025">2025</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {[{ label: 'Guardian Contact', name: 'guardianContact' },
              { label: 'Guardian Occupation', name: 'guardianOccupation' }].map(({ label, name }) => (
                <Grid item xs={12} key={name}>
                  <TextField
                    label={label}
                    name={name}
                    variant="outlined"
                    fullWidth
                    value={formData[name]}
                    onChange={handleChange}
                    error={errors[name]}
                    helperText={errors[name] && `${label} is required`}
                    required
                  />
                </Grid>
              ))}

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Bank Name</InputLabel>
                  <Select
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    label="Bank Name"
                    error={!!errors.bankName}
                  >
                    <MenuItem value="Access Bank">Access Bank</MenuItem>
                    <MenuItem value="Citibank Nigeria">Citibank Nigeria</MenuItem>
                    <MenuItem value="Diamond Bank">Diamond Bank</MenuItem>
                    <MenuItem value="Ecobank Nigeria">Ecobank Nigeria</MenuItem>
                    <MenuItem value="Fidelity Bank">Fidelity Bank</MenuItem>
                    <MenuItem value="First Bank of Nigeria">First Bank of Nigeria</MenuItem>
                    <MenuItem value="Guaranty Trust Bank">Guaranty Trust Bank</MenuItem>
                    <MenuItem value="Heritage Bank">Heritage Bank</MenuItem>
                    <MenuItem value="Jaiz Bank">Jaiz Bank</MenuItem>
                    <MenuItem value="Keystone Bank">Keystone Bank</MenuItem>
                    <MenuItem value="Lapo Microfinance Bank">Lapo Microfinance Bank</MenuItem>
                    <MenuItem value="Mainstreet Bank">Mainstreet Bank</MenuItem>
                    <MenuItem value="Polaris Bank">Polaris Bank</MenuItem>
                    <MenuItem value="Stanbic IBTC Bank">Stanbic IBTC Bank</MenuItem>
                    <MenuItem value="Sterling Bank">Sterling Bank</MenuItem>
                    <MenuItem value="Union Bank">Union Bank</MenuItem>
                    <MenuItem value="United Bank for Africa (UBA)">United Bank for Africa (UBA)</MenuItem>
                    <MenuItem value="Wema Bank">Wema Bank</MenuItem>
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
                  error={errors.accountNumber}
                  helperText={errors.accountNumber && 'Account Number is required'}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  component="label"
                  fullWidth
                  error={errors.image}
                  helperText={errors.image && 'image is required'}
                >
                  Upload Passport
                  <input
                    type="file"
                    name="image"
                    hidden
                    accept="image/*"
                    onChange={handleChange}
                  />
                </Button>
              </Grid>

              <Grid item xs={12} marginTop="20px">
                <Button type="submit" variant="contained" color="primary" fullWidth>
                  Submit
                </Button>
              </Grid>
            </Grid>
            <Typography
              variant="body2"
              style={{
                marginTop: '8px',
                fontWeight: 'bold',
                textAlign: 'center', // Center align the text
              }}
            >
              {success && <Typography variant = 'h5' color = "green">Student Registered Successfully</Typography>}
              {error && <Typography variant = 'h5' color = "green">{validationError}</Typography>}
            </Typography>
          </form>
        </Box>
      </Container>
    </>
  );

};
