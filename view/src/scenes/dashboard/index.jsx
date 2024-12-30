import React from 'react';
import { Box, Button, IconButton, Typography, useTheme, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { tokens } from "../../theme";
import { mockTransactions } from "../../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import GeographyChart from "../../components/GeographyChart";
import BarChart from "../../components/BarChart";
import StatBox from "../../components/StatBox";
import ProgressCircle from "../../components/ProgressCircle";
import { useAuth } from '../auth/authContext.jsx';
import { StudentsContext } from '../../components/dataContext.jsx';
import react, { useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'
const Dashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { userPermissions } = useAuth();
  const { studentsData, error, loading } = useContext(StudentsContext);
  const storedUser = JSON.parse(localStorage.getItem('userData'));





  useEffect(() => {
    if (!loading && studentsData === null) {
      navigate('/sign-in'); // Redirect if studentsData is null
    }
  }, [studentsData, navigate]);

// if(studentsData === null) {
//     return <Typography>....StudentsData Loading</Typography>
// }
  if (loading) {
    return <div>Loading...</div>;
  }

  // if(studentsData.length === 0) {
    
  // }

 
  





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
    if (!studentsData || studentsData.length === 0) {
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
        <Header sx={{ textTransform: 'capitalize' }} title={`${greetingMessage} ${capitalize(storedUser.firstname)}`}  />

        <Box>
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box>
      </Box>


      {/* GRID & CHARTS */}
      <Box
        // gridTemplateColumns="repeat(12, 1fr)"

        sx={{
          display: {
            xs: 'flex',  // flex layout for extra-small screens
            md: 'grid',  // grid layout for medium screens and up
          },
          marginTop: "50px",
          gridAutoRows: '140px', // Set the row height for the grid
          gap: '20px', // Spacing between grid items
          gridTemplateColumns: {
            sm: 'repeat(6, 1fr)', // 6 columns for small screens
            md: 'repeat(12, 1fr)', // 12 columns for medium screens
            lg: 'repeat(12, 1fr)', // 12 columns for large screens
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
        <Box className="statBoxContainer"
          gridColumn="span 4"
          backgroundColor={colors.dashboardStatBox["green"]}
          display="flex"
          flexBasis="50%"
          alignItems="center"
          justifyContent="center"
          borderRadius="5px"

        >
          <StatBox
            title={studentsData.length || 0}
            subtitle="Total Number of Students Enrolled"
            progress="0.75"
            increase="+14%"
            borderRadius="5px"

            icon={
              <EmailIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box className="statBoxContainer"
          gridColumn="span 4"
          backgroundColor={colors.dashboardStatBox["red"]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexBasis="50%"
          borderRadius="5px"

        >
          <StatBox
            title={primary6Students.length}
            subtitle="Total Basic 6 Enrolled"
            progress="0.75"
            increase="+14%"
            borderRadius="5px"

            icon={
              <EmailIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          className="statBoxContainer"
          gridColumn="span 4"
          backgroundColor={colors.dashboardStatBox["yellow"]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexBasis="50%"
          borderRadius="5px"

        >
          <StatBox
            title={jss1Students.length}
            subtitle="Total JSS 1 Enrolled"
            progress="0.75"
            increase="+14%"
            borderRadius="5px"

            icon={
              <EmailIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          className="statBoxContainer"
          gridColumn="span 4"
          backgroundColor={colors.dashboardStatBox["gold"]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexBasis="50%"
          borderRadius="5px"

        >
          <StatBox
            title={jss3Students.length}
            subtitle="Total JSS 3 Enrolled"
            progress="0.75"
            increase="+14%"
            borderRadius="5px"

            icon={
              <EmailIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          className="statBoxContainer"
          gridColumn="span 4"
          backgroundColor={colors.blueAccent[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexBasis="50%"
          borderRadius="5px"

        >
          <StatBox
            title={ss1Students.length}
            subtitle="Total SS 1 Enrolled"
            progress="0.75"
            increase="+14%"
            borderRadius="5px"

            icon={
              <EmailIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          className="statBoxContainer"
          gridColumn="span 4"
          backgroundColor={colors.dashboardStatBox["grey"]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexBasis="50%"
        >
          <StatBox
            title={getNumberOfDistinctSchools(studentsData)}
            subtitle="Total School Enrolled"
            progress="0.50"
            increase="+21%"
            icon={
              <PointOfSaleIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          className="statBoxContainer"
          gridColumn="span 12"
          gridRow="span 3"
          display="flex"
          alignItems="center"
          flexDirection="column"
          justifyContent="center"
        >
          {userPermissions.length === 1 &&


            <>
              <Typography variant="h3" gutterBottom sx={{
                color: colors.dashboardStatBox["green"]
              }}>
                Information of last 5 Registered Students
              </Typography>
              <TableContainer component={Paper} gridColumn="span 12" style={{ maxWidth: '100%', overflowX: 'auto' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Surname</TableCell>
                      <TableCell>Present Class</TableCell>
                      {/* <TableCell>School Code</TableCell> */}
                      <TableCell>State of Origin</TableCell>
                      <TableCell>LGA</TableCell>
                      <TableCell>Ward</TableCell>

                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {last5Students().map((student, index) => (
                      <TableRow key={index}>
                        <TableCell>{student.surname}</TableCell>
                        <TableCell>{student.presentClass}</TableCell>
                        <TableCell>{student.stateOfOrigin}</TableCell>
                        <TableCell>{student.lga}</TableCell>
                        <TableCell>{student.ward.name}</TableCell>
                        {/* id will be insterted below to map to full detail */}
                        {/* <TableCell>{'codebro'}</TableCell> */}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            <Button
              component={Link}
              to="/enumerator-dashboard/view-all-students-data" // Replace with your target route
              variant="text"
              size="small"
              color="primary"
              style={{
                textTransform: 'none', // Keep the text in normal case
                fontSize: '0.875rem',  // Adjust font size for a small look
                marginTop:"50px"
              }}
            >
              Click to view all students Information
            </Button>

            </>


          }
        </Box>



        {/* ROW 2 */}
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Revenue Generated
              </Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                $59,342.32
              </Typography>
            </Box>
            <Box>
              <IconButton>
                <DownloadOutlinedIcon
                  sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
                />
              </IconButton>
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <LineChart isDashboard={true} />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          overflow="auto"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Recent Transactions
            </Typography>
          </Box>
          {mockTransactions.map((transaction, i) => (
            <Box
              key={`${transaction.txId}-${i}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
            >
              <Box>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  fontWeight="600"
                >
                  {transaction.txId}
                </Typography>
                <Typography color={colors.grey[100]}>
                  {transaction.user}
                </Typography>
              </Box>
              <Box color={colors.grey[100]}>{transaction.date}</Box>
              <Box
                backgroundColor={colors.greenAccent[500]}
                p="5px 10px"
                borderRadius="4px"
              >
                ${transaction.cost}
              </Box>
            </Box>
          ))}
        </Box>

        {/* ROW 3 */}
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600">
            Campaign
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
          >
            <ProgressCircle size="125" />
            <Typography
              variant="h5"
              color={colors.greenAccent[500]}
              sx={{ mt: "15px" }}
            >
              $48,352 revenue generated
            </Typography>
            <Typography>Includes extra misc expenditures and costs</Typography>
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          >
            Sales Quantity
          </Typography>
          <Box height="250px" mt="-20px">
            <BarChart isDashboard={true} />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          padding="30px"
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ marginBottom: "15px" }}
          >
            Geography Based Traffic
          </Typography>
          <Box height="200px">
            <GeographyChart isDashboard={true} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
