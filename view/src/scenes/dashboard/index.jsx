
import { useContext, useEffect, React } from 'react';
import { useNavigate, Link } from 'react-router-dom'
import { Box, Button, IconButton, Typography, Grid, useTheme, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { tokens } from "../../theme";
import { mockTransactions } from "../../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import Header from "../../components/Header";
import StatBox from "../../components/StatBox";
import ProgressCircle from "../../components/ProgressCircle";
import {ResponsivePieChart} from '../../components/pieChart.jsx';
import { ResponsiveBarChart } from '../../components/barChart.jsx';
import { useAuth } from '../auth/authContext.jsx';
import { StudentsContext } from '../../components/dataContext.jsx';
import { SpinnerLoader } from '../../components/spinnerLoader.jsx';




const Dashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { userPermissions } = useAuth();
  const { studentsData, error, loading } = useContext(StudentsContext);
  const storedUser = JSON.parse(localStorage.getItem('userData'));







  // if(studentsData === null) {
  //     return <Typography>....StudentsData Loading</Typography>
  // }
  if (loading)
    return (
      <Box
        sx={{
          display: "flex", // Corrected from 'dispflex'
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
          width: "90vw",
          position: "relative",
        }}
      >
        <SpinnerLoader />
      </Box>
    );
  // if(studentsData.length === 0) {

  // }


  if (!studentsData) {
    return <Box
      sx = {{
        display: "flex", 
        justifyContent:"center", 
        alignItems: "center"
      }}
    ><Typography variant='h2'>No data available.</Typography></Box>; // Optional fallback if data isn't fetched properly.
  }








  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const last5Students = () => {
    if (Array.isArray(studentsData) && studentsData.length > 0) {
      return studentsData.slice(0, 5); // Get the first 5 students
    } else {
      return []; // Return an empty array if studentsData is empty or not an array
    }
  };
  console.log(studentsData)


  const filterByClass = (students, className) => {
    if (Array.isArray(students)) {
      return students.filter(student => student.presentClass === className);
    }
    return []; // Return an empty array if students is not an array
  };




  // Example usage
  const jss1Students = filterByClass(studentsData, "JSS 1");
  const ss1Students = filterByClass(studentsData, "SS 1");
  const primary6Students = filterByClass(studentsData, "Primary 6");
  const jss3Students = filterByClass(studentsData, "JSS 3");

  console.log('students DAta:' + studentsData)

  function getNumberOfDistinctSchools(studentsData) {
    if (!studentsData) {
      console.log('No student data available.');
      return 0;
    }

    const distinctSchools = new Set(
      studentsData
        .map(item => item?.schoolId?.schoolName?.toLowerCase())
        .filter(Boolean)
    );
    const getNumberOfDistinctSchools = distinctSchools.size;
    return getNumberOfDistinctSchools;
  }




  const currentHour = new Date().getHours();

  let greetingMessage;

  if (currentHour < 12) {
    greetingMessage = 'Good Morning';
  } else if (currentHour < 18) {
    greetingMessage = 'Good Afternoon';
  } else {
    greetingMessage = 'Good Evening';
  }


  const capitalize = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header sx={{ textTransform: 'capitalize', color: colors.dashboardStatBox['darkGreen'] }} title={`${greetingMessage} ${capitalize(storedUser.fullName.split(' ')[0])}`} />


        {/* <Box>
          <Button
            sx={{
              // backgroundColor: colors.blueAccent[700],
              color: '#fff',
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
              background: colors.main["darkGreen"]
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box> */}
      </Box>


      {/* GRID & CHARTS */}

      {userPermissions.includes("handle_registrars") && (

      <Box sx = {{display: "flex", gridRow: " 10", marginBottom: "100px", maxWidth: "100%", flexDirection: {
        xs: "column", 
        md: "row"
      }}}>
          <ResponsivePieChart/>
        <ResponsiveBarChart/>
      </Box>
      )}



      {userPermissions.includes("handle_registrars") ? (
        <Box
          sx={{
            display: {
              xs: 'flex',  // flex layout for extra-small screens
              sm: 'grid',  // grid layout for medium screens and up
            },
            marginTop: "50px",
            gridAutoRows: '140px', // Set the row height for the grid
            gap: '20px', // Spacing between grid items
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)', // 1 column for extra-small screens
              sm: 'repeat(6, 1fr)', // 6 columns for small screens and up
              md: 'repeat(12, 1fr)', // 12 columns for medium screens and up
              lg: 'repeat(12, 1fr)', // 12 columns for large screens and up
            },
            flexDirection: {
              xs: 'column', // Flex direction as column for xs (flex)
            },
            '& > *': {
              color: "#fff",
              borderRadius: '5px', // Apply border-radius to all direct children
            },
            paddingBottom: "50px"
          }}
        >
          {/* ROW 1 */}
          <Box
            className="statBoxContainer"
            sx={{
              gridColumn: {
                xs: 'span 12', // Full width on xs screens
                sm: 'span 6',  // Half width on sm screens
                md: 'span 4',  // Quarter width on md screens
              },
              backgroundColor: colors.main["darkGreen"],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '5px',
            }}
          >
            <StatBox
              title={studentsData?.length || 0}
              subtitle="Total Students Enrolled"
              progress="0.75"
              borderRadius="5px"
              icon={<EmailIcon sx={{ color: colors.main["darkGreen"], fontSize: "26px" }} />}
            />
          </Box>

          <Box
            className="statBoxContainer"
            sx={{
              gridColumn: {
                xs: 'span 12', // Full width on xs screens
                sm: 'span 6',  // Half width on sm screens
                md: 'span 4',  // Quarter width on md screens
              },
              backgroundColor: colors.dashboardStatBox["red"],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '5px',
            }}
          >
            <StatBox
              title={primary6Students?.length}
              subtitle="Total Enumerators"
              progress="0.75"
              borderRadius="5px"
              icon={<EmailIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
            />
          </Box>

          <Box
            className="statBoxContainer"
            sx={{
              gridColumn: {
                xs: 'span 12', // Full width on xs screens
                sm: 'span 6',  // Half width on sm screens
                md: 'span 4',  // Quarter width on md screens
              },
              backgroundColor: colors.dashboardStatBox["yellow"],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '5px',
            }}
          >
            <StatBox
              title={jss1Students?.length}
              subtitle="Total wards Regististered"
              progress="0.75"
              borderRadius="5px"
              icon={<EmailIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
            />
          </Box>

          <Box
            className="statBoxContainer"
            sx={{
              gridColumn: {
                xs: 'span 12', // Full width on xs screens
                sm: 'span 6',  // Half width on sm screens
                md: 'span 4',  // Quarter width on md screens
              },
              backgroundColor: colors.dashboardStatBox["gold"],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '5px',
            }}
          >
            <StatBox
              title={jss3Students?.length}
              subtitle="Total LGA Registered"
              progress="0.75"
              borderRadius="5px"
              icon={<EmailIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
            />
          </Box>

          <Box
            className="statBoxContainer"
            sx={{
              gridColumn: {
                xs: 'span 12', // Full width on xs screens
                sm: 'span 6',  // Half width on sm screens
                md: 'span 4',  // Quarter width on md screens
              },
              backgroundColor: colors.blueAccent[400],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '5px',
            }}
          >
            <StatBox
              title={ss1Students?.length}
              subtitle="Total School Enrolled"
              progress="0.75"
              borderRadius="5px"
              icon={<EmailIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
            />
          </Box>

          <Box
            className="statBoxContainer"
            sx={{
              gridColumn: {
                xs: 'span 12', // Full width on xs screens
                sm: 'span 6',  // Half width on sm screens
                md: 'span 4',  // Quarter width on md screens
              },
              backgroundColor: colors.dashboardStatBox["grey"],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <StatBox
              title={getNumberOfDistinctSchools(studentsData)}
              subtitle="Total Basic 6"
              progress="0.50"
              icon={<PointOfSaleIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
            />
          </Box>
          <Box
            className="statBoxContainer"
            sx={{
              gridColumn: {
                xs: 'span 12', // Full width on xs screens
                sm: 'span 6',  // Half width on sm screens
                md: 'span 4',  // Quarter width on md screens
              },
              backgroundColor: colors.dashboardStatBox["grey"],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <StatBox
              title={getNumberOfDistinctSchools(studentsData)}
              subtitle="Total JSS 1"
              progress="0.50"
              icon={<PointOfSaleIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
            />
          </Box>
          <Box
            className="statBoxContainer"
            sx={{
              gridColumn: {
                xs: 'span 12', // Full width on xs screens
                sm: 'span 6',  // Half width on sm screens
                md: 'span 4',  // Quarter width on md screens
              },
              backgroundColor: colors.dashboardStatBox["green"],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <StatBox
              title={getNumberOfDistinctSchools(studentsData)}
              subtitle="Total JSS 3 Enrolled"
              progress="0.50"
              icon={<PointOfSaleIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
            />
          </Box>
          <Box
            className="statBoxContainer"
            sx={{
              gridColumn: {
                xs: 'span 12', // Full width on xs screens
                sm: 'span 6',  // Half width on sm screens
                md: 'span 4',  // Quarter width on md screens
              },
              backgroundColor: colors.dashboardStatBox["grey"],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <StatBox
              title={getNumberOfDistinctSchools(studentsData)}
              subtitle="Total SS 1 Enrolled"
              progress="0.50"
              icon={<PointOfSaleIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
            />
          </Box>

          <Box
            className="statBoxContainer"
            sx={{
              gridColumn: 'span 12', // Full width for the last box
              gridRow: 'span 7', // Take up more vertical space
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              justifyContent: 'center',
              
            }}
          >
            <Typography
              variant="h3"
              gutterBottom
              sx={{
                color: colors.main.darkGreen,
                background: "linear-gradient(135deg, rgba(224, 224, 224, 1), rgba(200, 200, 200, 1))",
                fontWeight: "bold",
                letterSpacing: "1px",
                textAlign: "center",
                padding: "20px 15px",
                borderRadius: "10px",
                cursor: "pointer",
                marginBottom: "20px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0px 6px 10px rgba(0, 0, 0, 0.15)",
                },
                "&:active": {
                  transform: "scale(0.98)",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              20 Recently Registered Students
            </Typography>

               

                <TableContainer
                  component={Paper}
                  sx={{
                    maxWidth: '100%',
                    overflowX: 'auto',
                    boxShadow: 3,
                    borderRadius: '8px',
                    marginBottom: '20px',
                    minHeight: "320px",
                  }}
                >
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#f1f1f1' }}>
                        <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Surname</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Present Class</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>State of Origin</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>LGA</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Ward</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {last5Students().map((student, index) => (
                        <TableRow key={index} sx={{
                          '&:hover': { backgroundColor: '#f9f9f9' },
                          borderBottom: '1px solid #ddd',
                        }}>
                          <TableCell>{student.surname}</TableCell>
                          <TableCell>{student.presentClass}</TableCell>
                          <TableCell>{student.stateOfOrigin}</TableCell>
                          <TableCell>{student.lga}</TableCell>
                          <TableCell>{student.ward.name}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Button
                  component={Link}
                  to="/enumerator-dashboard/view-all-students-data"
                  variant="contained"
                  size="large"
                  color="primary"
                  sx={{
                    textTransform: 'none',
                    fontSize: '1rem',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    boxShadow: 2,
                    marginBottom: '100px',
                    '&:hover': {
                      backgroundColor: '#0D47A1',
                      boxShadow: 3,
                    },
                  }}
                >
                  Click to View All Students Information
                </Button>


            <Typography
              variant="h3"
              gutterBottom
              sx={{
                color: colors.main.darkGreen,
                background: "linear-gradient(135deg, rgba(224, 224, 224, 1), rgba(200, 200, 200, 1))",
                fontWeight: "bold",
                letterSpacing: "1px",
                textAlign: "center",
                padding: "20px 15px",
                borderRadius: "10px",
                marginBottom: "20px",
                cursor: "pointer",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0px 6px 10px rgba(0, 0, 0, 0.15)",
                },
                "&:active": {
                  transform: "scale(0.98)",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              Enumerators Activity Log
            </Typography>


              <TableContainer
                component={Paper}
                sx={{
                  maxWidth: '100%',
                  overflowX: 'auto',
                  boxShadow: 3,
                  borderRadius: '8px',
                  marginBottom: '20px',
                  minHeight: "320px",
                }}
              >
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f1f1f1' }}>
                      <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Email Address</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Phone</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Activity</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>passport</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {last5Students().map((student, index) => (
                      <TableRow key={index} sx={{
                        '&:hover': { backgroundColor: '#f9f9f9' },
                        borderBottom: '1px solid #ddd',
                      }}>
                        <TableCell>{student.surname}</TableCell>
                        <TableCell>{student.presentClass}</TableCell>
                        <TableCell>{student.stateOfOrigin}</TableCell>
                        <TableCell>{student.lga}</TableCell>
                        <TableCell>{student.ward.name}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            
            
            
              
             

          </Box>
        </Box>
      ) 
      
      
        : (<Box
          sx={{
            display: {
              xs: 'flex',  // flex layout for extra-small screens
              sm: 'grid',  // grid layout for medium screens and up
            },
            marginTop: "50px",
            gridAutoRows: '140px', // Set the row height for the grid
            gap: '20px', // Spacing between grid items
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)', // 1 column for extra-small screens
              sm: 'repeat(6, 1fr)', // 6 columns for small screens and up
              md: 'repeat(12, 1fr)', // 12 columns for medium screens and up
              lg: 'repeat(12, 1fr)', // 12 columns for large screens and up
            },
            flexDirection: {
              xs: 'column', // Flex direction as column for xs (flex)
            },
            '& > *': {
              color: "#fff",
              borderRadius: '5px', // Apply border-radius to all direct children
            },
          }}
        >
          {/* ROW 1 */}
          <Box
            className="statBoxContainer"
            sx={{
              gridColumn: {
                xs: 'span 12', // Full width on xs screens
                sm: 'span 6',  // Half width on sm screens
                md: 'span 4',  // Quarter width on md screens
              },
              backgroundColor: colors.main["darkGreen"],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '5px',
            }}
          >
            <StatBox
              title={studentsData?.length || 0}
              subtitle="Total Number of Students Enrolled"
              progress="0.75"
              borderRadius="5px"
              icon={<EmailIcon sx={{ color: colors.main["darkGreen"], fontSize: "26px" }} />}
            />
          </Box>

          <Box
            className="statBoxContainer"
            sx={{
              gridColumn: {
                xs: 'span 12', // Full width on xs screens
                sm: 'span 6',  // Half width on sm screens
                md: 'span 4',  // Quarter width on md screens
              },
              backgroundColor: colors.dashboardStatBox["red"],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '5px',
            }}
          >
            <StatBox
              title={primary6Students?.length}
              subtitle="Total Basic 6 Enrolled"
              progress="0.75"
              borderRadius="5px"
              icon={<EmailIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
            />
          </Box>

          <Box
            className="statBoxContainer"
            sx={{
              gridColumn: {
                xs: 'span 12', // Full width on xs screens
                sm: 'span 6',  // Half width on sm screens
                md: 'span 4',  // Quarter width on md screens
              },
              backgroundColor: colors.dashboardStatBox["yellow"],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '5px',
            }}
          >
            <StatBox
              title={jss1Students?.length}
              subtitle="Total JSS 1 Enrolled"
              progress="0.75"
              borderRadius="5px"
              icon={<EmailIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
            />
          </Box>

          <Box
            className="statBoxContainer"
            sx={{
              gridColumn: {
                xs: 'span 12', // Full width on xs screens
                sm: 'span 6',  // Half width on sm screens
                md: 'span 4',  // Quarter width on md screens
              },
              backgroundColor: colors.dashboardStatBox["gold"],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '5px',
            }}
          >
            <StatBox
              title={jss3Students?.length}
              subtitle="Total JSS 3 Enrolled"
              progress="0.75"
              borderRadius="5px"
              icon={<EmailIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
            />
          </Box>

          <Box
            className="statBoxContainer"
            sx={{
              gridColumn: {
                xs: 'span 12', // Full width on xs screens
                sm: 'span 6',  // Half width on sm screens
                md: 'span 4',  // Quarter width on md screens
              },
              backgroundColor: colors.blueAccent[400],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '5px',
            }}
          >
            <StatBox
              title={ss1Students?.length}
              subtitle="Total SS 1 Enrolled"
              progress="0.75"
              borderRadius="5px"
              icon={<EmailIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
            />
          </Box>

          <Box
            className="statBoxContainer"
            sx={{
              gridColumn: {
                xs: 'span 12', // Full width on xs screens
                sm: 'span 6',  // Half width on sm screens
                md: 'span 4',  // Quarter width on md screens
              },
              backgroundColor: colors.dashboardStatBox["grey"],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <StatBox
              title={getNumberOfDistinctSchools(studentsData)}
              subtitle="Total School Enrolled"
              progress="0.50"
              icon={<PointOfSaleIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
            />
          </Box>

          <Box
            className="statBoxContainer"
            sx={{
              gridColumn: 'span 12', // Full width for the last box
              gridRow: 'span 3', // Take up more vertical space
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            {userPermissions.length === 1 && (
              <>
                <Typography
                  variant="h3"
                  gutterBottom
                  sx={{
                    color: colors.main["darkGreen"],
                    background: "rgba(224, 224, 224, 1)",
                    fontWeight: 'bold',
                    letterSpacing: '0.5px',
                    textAlign: 'center',
                    padding: '20px 0',
                    marginTop: "100px",
                    padding: "15px",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Information of Last 5 Registered Students
                </Typography>

                <TableContainer
                  component={Paper}
                  sx={{
                    maxWidth: '100%',
                    overflowX: 'auto',
                    boxShadow: 3,
                    borderRadius: '8px',
                    marginBottom: '20px',
                    minHeight: "320px",
                  }}
                >
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#f1f1f1' }}>
                        <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Surname</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Present Class</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>State of Origin</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>LGA</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Ward</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {last5Students().map((student, index) => (
                        <TableRow key={index} sx={{
                          '&:hover': { backgroundColor: '#f9f9f9' },
                          borderBottom: '1px solid #ddd',
                        }}>
                          <TableCell>{student.surname}</TableCell>
                          <TableCell>{student.presentClass}</TableCell>
                          <TableCell>{student.stateOfOrigin}</TableCell>
                          <TableCell>{student.lga}</TableCell>
                          <TableCell>{student.ward.name}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Button
                  component={Link}
                  to="/enumerator-dashboard/view-all-students-data"
                  variant="contained"
                  size="large"
                  color="primary"
                  sx={{
                    textTransform: 'none',
                    fontSize: '1rem',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    boxShadow: 2,
                    marginBottom: '100px',
                    '&:hover': {
                      backgroundColor: '#0D47A1',
                      boxShadow: 3,
                    },
                  }}
                >
                  Click to View All Students Information
                </Button>
              </>
            )}
          </Box>
        </Box>)}
      

    </Box>
  );
};



export default Dashboard;
