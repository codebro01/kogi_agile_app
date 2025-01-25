
import { useContext, useEffect, React, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'
import { Box, Button, IconButton, Typography, Grid, useTheme, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Card, CardContent } from "@mui/material";
import { tokens } from "../../theme";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import Header from "../../components/Header";
import StatBox from "../../components/StatBox";
import ProgressCircle from "../../components/ProgressCircle";
import { ResponsivePieChart } from '../../components/pieChart.jsx';
import { ResponsiveBarChart } from '../../components/barChart.jsx';
import { useAuth } from '../auth/authContext.jsx';
import { StudentsContext, SchoolsContext } from '../../components/dataContext.jsx';
import { useSelector, useDispatch } from 'react-redux';
import { SpinnerLoader } from '../../components/spinnerLoader.jsx';
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { fetchAllStudents } from '../../components/allStudentsSlice.js'
import { fetchDashboardStat } from '../../components/dashboardStatsSlice.js';
import lgasAndWards from '../../Lga&wards.json';
import { ResponsiveBarChartForPayment } from '../../components/barChartForPayment.jsx';

import axios from 'axios';



const Dashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { userPermissions } = useAuth();
  const storedUser = JSON.parse(localStorage.getItem('userData'));
  const [totalAmountPaid, setTotalAmountPaid] = useState(1); // State to store fetched data
  const [totalAmountPaidMonthly, setTotalAmountPaidMonthly] = useState(1); // State to store fetched data
  const [lgaWithTotalPayments, setLgaWithTotalPayments] = useState([]); // State to store fetched data
  const [viewPayments, setViewPayments] = useState(1); // State to store fetched data
  const [shouldFetch, setShouldFetch] = useState(true); // Condition for fetchi
  const API_URL = `${import.meta.env.VITE_API_URL}/api/v1`;
  const [totalStudentsPaid, setTotalStudentsPaid] = useState([])



  // ! Redux toolkit consumption

  const dispatch = useDispatch();
  const allstudentsState = useSelector((state) => state.allStudents);
  const { data: studentsData, loading: studentsLoading, error: studentsError } = allstudentsState;


  const dashboardStat = useSelector((state) => state.dashboardStat);
  const { data: dashboardData, loading: dashboardStatLoading, error: dashboardStatError } = dashboardStat;



  const token = localStorage.getItem('token');


  useEffect(() => {
    if (userPermissions.includes('handle_students') && userPermissions.length === 1) {
      dispatch(fetchAllStudents());
      return;
    }
    dispatch(fetchDashboardStat())
  }, [dispatch]);

  useEffect(() => {
    if (userPermissions.includes('handle_payments')) {

      const fetchData = async () => {
        try {
          const [
            getLGAWithTotalPaymentsRes,
            getTotalStudentsPaid,
          ] = await Promise.all([
            axios.get(`${API_URL}/payments/view-payments-by-lga`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              withCredentials: true,
            }),

            axios.get(`${API_URL}/payments/get-total-student-paid`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              withCredentials: true,
            }),
          ]);
          setLgaWithTotalPayments(getLGAWithTotalPaymentsRes.data.paymentByLGA);
          setTotalStudentsPaid(getTotalStudentsPaid.data.totalStudentPaid)

        }
        catch (err) {
          console.error('Error fetching data:', err);
        }
      };

      fetchData();
    }
  }, []);
  if (studentsLoading || dashboardStatLoading) {
    return <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "80vh",
        width: "100%"
      }}
    >
      <SpinnerLoader />
    </Box>;
  }

  if (studentsError || dashboardStatError) {
    return <div>Error: {studentsError}</div>;
  }


  const uniqueSchools = Array.from(
    new Set(
      studentsData.map(student => JSON.stringify({
        schoolName: student.schoolId?.schoolName,
        schoolId: student.schoolId?._id,
        schoolCategory: student.schoolId?.schoolCategory
      }))
    )
  ).map(item => JSON.parse(item));





  // console.log(studentsData);

  const last5Students = () => {
    if (Array.isArray(studentsData) && studentsData.length > 0) {
      return studentsData.slice(0, 20); // Get the first 5 students
    } else {
      return []; // Return an empty array if studentsData is empty or not an array
    }
  };


  const filterByClass = (students, className) => {
    if (Array.isArray(students)) {
      return students.filter(student => student.presentClass === className);
    }
    return []; // Return an empty array if students is not an array
  };

  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! Dashboard Stat !!!!!!!!!!!!!!!!!!!!!!!!


  let totalStudents, distinctSchools, total_primary_6, total_JSS_1, total_JSS_3, total_SSS_1, totalPrimarySchool, totalSecondarySchool, totalScienceAndVocational;

  if (dashboardData) {

    totalStudents = dashboardData?.results?.[0]?.totalStudents[0]?.total;
    distinctSchools = dashboardData?.results?.[0]?.distinctSchools[0]?.totalDistinctSchools
    total_primary_6 = dashboardData?.results?.[0]?.studentsByClass?.find((classData) => classData.className === 'Primary 6');
    total_primary_6 = total_primary_6?.totalStudentsInClass
    total_JSS_3 = dashboardData?.results?.[0]?.studentsByClass?.find((classData) => classData.className === 'JSS 3')
    total_JSS_3 = total_JSS_3?.totalStudentsInClass

    total_JSS_1 = dashboardData?.results?.[0]?.studentsByClass?.find((classData) => classData.className === 'JSS 1')
    total_JSS_1 = total_JSS_1?.totalStudentsInClass

    total_SSS_1 = dashboardData?.results?.[0]?.studentsByClass?.find((classData) => classData.className === 'SSS 1')
    total_SSS_1 = total_SSS_1?.totalStudentsInClass

    totalPrimarySchool = dashboardData?.schoolCategory?.[0].totalPrimarySchools
    totalSecondarySchool = dashboardData?.schoolCategory?.[0].totalSecondarySchools
    totalScienceAndVocational = dashboardData?.schoolCategory?.[0]?.totalScienceAndVocational
  }





  // Example usage
  const jss1Students = filterByClass(studentsData, "JSS 1");
  const ss1Students = filterByClass(studentsData, "SSS 1");
  const primary6Students = filterByClass(studentsData, "Primary 6");
  const jss3Students = filterByClass(studentsData, "JSS 3");


  function getNumberOfDistinctSchools(studentsData) {
    if (!studentsData) {
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









  // ! Payroll Specialist's Dashboard

  if (userPermissions.includes('handle_payments')) {

    let mergedResults;

    if (lgaWithTotalPayments.length > 0) {
      mergedResults = lgasAndWards.map((lga) => {
        // Convert both LGA and payment._id to uppercase for a case-insensitive match
        const payment = lgaWithTotalPayments.find(
          (payment) => payment._id.toUpperCase() === lga.name.toUpperCase()
        );

        // Return the LGA and its total amount (or 0 if not found) as a plain object
        return {
          LGA: lga.name.toUpperCase(), // Ensure the result is also in uppercase for consistency
          totalAmount: payment ? payment.totalAmount : 0,
        };
      });
    }

    else {
       mergedResults = lgasAndWards.map((lga) => {
        return {
          LGA: lga.name.toUpperCase(),
          totalAmount: 0
        }
       })
    }

    // Log or return the mergedResults
    // console.log(mergedResults);

    let sumTotalAmount = 0;

    for (const payment of lgaWithTotalPayments) {
      sumTotalAmount += parseInt(payment.totalAmount, 10); // Ensure `amount` is parsed as an integer
    }


    function formatWithCommas(number = 0) {
      return number.toLocaleString();
    }







    return (

      <>

        {lgaWithTotalPayments && totalStudentsPaid && (<Box sx={{
          padding: {
            xs: "10px",
            sm: "20px",
          }
        }}>
          <Header sx={{ textTransform: 'capitalize', color: colors.dashboardStatBox['darkGreen'], }} title={`${greetingMessage} ${capitalize(storedUser.fullName.split(' ')[0])}`} />
          <Box
            sx={{
              display: {
                xs: 'flex',  // flex layout for extra-small screens
                sm: 'grid',  // grid layout for medium screens and up
                padding: "10px"
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
                title={formatWithCommas(totalStudents)}
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
                title={`\u20A6 ${formatWithCommas(sumTotalAmount)}`}
                subtitle="Total Disbursed Funds"
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
                title={`${formatWithCommas(totalStudentsPaid.length)}`}
                subtitle="Total Students Paid"
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
                  sm: 'span 12',  // Half width on sm screens
                  md: 'span 12',  // Quarter width on md screens
                },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '5px',
              }}
            >
              <Typography variant='h3' sx={{
                color: "#196b57", fontWeight: "800", fontSize: {
                  xs: "1.3rem",
                  sm: "1.7rem"
                }
              }}>
                Total Amount Disbursed Based on LGA of Enrollment
              </Typography>
            </Box>


            {mergedResults && (
              mergedResults.map((lga, index) => {
                // Array of colors to cycle through
                const colorArray = [
                  colors.dashboardStatBox['purple'],
                  colors.dashboardStatBox['red'],
                  colors.dashboardStatBox['gold'],
                  colors.dashboardStatBox['grey'],
                  colors.dashboardStatBox['green'],
                  colors.dashboardStatBox['brown'],
                  colors.dashboardStatBox['lightPurple'],
                  colors.dashboardStatBox['yellow'],
                  colors.dashboardStatBox['lightGreen'],

                ];

                // Select a color based on the current index
                const backgroundColor = colorArray[index % colorArray.length];

                return (
                  <Box
                    key={index} // Always provide a unique key for list items
                    className="statBoxContainer"
                    sx={{
                      gridColumn: {
                        xs: 'span 12', // Full width on xs screens
                        sm: 'span 6',  // Half width on sm screens
                        md: 'span 4',  // Quarter width on md screens
                      },
                      backgroundColor: backgroundColor, // Use the selected color
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '5px',
                    }}
                  >
                    <StatBox
                      title={`\u20A6  ${formatWithCommas(lga.totalAmount)}`} // Example: Display total amount for the LGA
                      subtitle={lga.LGA} // Example: Display the LGA name as subtitle
                      progress="0.75"
                      borderRadius="5px"
                      icon={<EmailIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
                    />
                  </Box>
                );
              })
            )}



            <Box
              className="statBoxContainer"
              sx={{
                gridColumn: 'span 12', // Full width for the last box
                gridRow: 'span 3', // Take up more vertical space
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                justifyContent: 'center',
                width: "100%",
                height: "100%"

              }}
            >

              <Box sx={{
                overflowX: "auto",

                width: "100%",
                flexBasis: "100%",
                padding: '10px',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                transition: 'background-color 0.3s ease',
                height: '100%'
              }}>

                <ResponsiveBarChartForPayment />
              </Box>

            </Box>
          </Box>
        </Box>)

        }
      </>


    )
  }

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

      {userPermissions.includes("handle_registrars") ? (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "20vh",
            }}
          >
            <Card
              sx={{
                backgroundColor: "#f9f9f9",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                borderRadius: "16px",
                padding: "20px",
                width: "100%"
              }}
            >
              <CardContent>
                <Typography
                  variant="h4"
                  sx={{
                    color: "#196b57",
                    fontWeight: "bold",
                    marginBottom: "12px",
                    textAlign: "center",
                  }}
                >
                  Welcome to the Portal
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#333",
                    lineHeight: "1.8",
                    textAlign: "center",
                  }}
                >
                  Here, you can efficiently manage and oversee student data with ease.
                  The platform is designed to simplify your tasks and provide you with the tools needed
                  for effective data management.
                </Typography>
              </CardContent>
            </Card>
          </Box>
          <Box
            sx={{
              display: {
                xs: 'flex',  // flex layout for extra-small screens
                sm: 'grid',  // grid layout for medium screens and up
              },
              marginTop: "20px",
              gridAutoRows: '140px', // Set the row height for the grid
              gap: '10px', // Spacing between grid items
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
                title={totalStudents}
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
                title={total_primary_6}
                subtitle="Total Primary 6"
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
                title={total_JSS_1}
                subtitle="Total JSS 1"
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
                title={total_JSS_3}
                subtitle="Total JSS 3"
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
                title={total_SSS_1}
                subtitle="Total SSS 1"
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
                title={distinctSchools}
                subtitle="Total Schools with Registered Students"
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
                backgroundColor: colors.dashboardStatBox["lightPurple"],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '5px',
              }}
            >
              <StatBox
                title={totalPrimarySchool}
                subtitle="Total Registered Public Primary School"
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
                backgroundColor: colors.dashboardStatBox["lightGreen"],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '5px',
              }}
            >
              <StatBox
                title={totalSecondarySchool}
                subtitle="Total Registered Public Secondary Schools"
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
                title={totalScienceAndVocational || 0}
                subtitle="Total Registered Science and Vocational Schools"
                progress="0.75"
                borderRadius="5px"
                icon={<EmailIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
              />
            </Box>

            {/* <Box
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
              borderRadius: '5px',
              flexDirection: "column",
            }}
          >
            <StatBox
              title={totalSchools}
              subtitle="Total Pre-Registered Schools"
              progress="0.75"
              borderRadius="5px"
              icon={<EmailIcon sx={{ color: colors.main["darkGreen"], fontSize: "26px" }} />}
            />

            <Box sx={{ display: 'flex', flexDirection: 'row', cursor: 'pointer' }} onClick={() => viewSchoolInfos('/view-all-schools-info')}>

            <Typography>
                View all
            </Typography>
            <ArrowRightIcon/>
            
            </Box>
          </Box> */}

            <Box
              className="statBoxContainer"
              sx={{
                gridColumn: 'span 12', // Full width for the last box
                gridRow: {
                  xs: 'span 7',
                  sm: 'span 5'
                }, // Take up more vertical space
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                justifyContent: 'center',
                marginTop: {
                  xs: "100px",
                  md: "0px"
                }

              }}
            >
              {userPermissions.includes("handle_registrars") && (

                <Box sx={{
                  display: "flex", gridRow: " 10", maxWidth: "100%", flexDirection: {
                    xs: "column",
                    md: "row"
                  },
                }}>
                
                 <Box sx={{
                    flexBasis: "50%"
                  }}>
                    <ResponsiveBarChart />

                  </Box>
                 

                  <Box sx={{
                    flexBasis: "50%"
                  }}>

                    <ResponsivePieChart />
                  </Box>
                </Box>
              )}
            </Box>








            <Box
              className="statBoxContainer"
              sx={{
                gridColumn: 'span 12', // Full width for the last box
                gridRow: {
                  xs: 'span 10',
                  sm: 'span 7'
                },// Take up more vertical space
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                justifyContent: 'center',
                marginTop: {
                  xs: "50px",
                  md: "0px"
                }

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
                    {dashboardData?.recentTwentyStudents?.map((student, index) => (
                      <TableRow key={index} sx={{
                        '&:hover': { backgroundColor: '#f9f9f9' },
                        borderBottom: '1px solid #ddd',
                      }}>
                        <TableCell>{student.surname}</TableCell>
                        <TableCell>{student.presentClass}</TableCell>
                        <TableCell>{student.stateOfOrigin}</TableCell>
                        <TableCell>{student.lga}</TableCell>
                        <TableCell>{student.ward}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Button
                component={Link}
                to="/admin-dashboard/admin-view-all-students-no-export"
                variant="contained"
                size="large"
                color="primary"
                sx={{
                  backgroundColor: '#196b57', // Default background color
                  color: '#ffffff', // Text color
                  padding: '10px 20px', // Add some padding for better appearance
                  borderRadius: '8px', // Rounded corners
                  fontWeight: 'bold', // Bold text
                  textTransform: 'uppercase', // Make text uppercase
                  transition: 'all 0.3s ease', // Smooth transition for hover effect
                  '&:hover': {
                    backgroundColor: '#145943', // Slightly darker shade on hover
                  },
                }}
              >
                Click to View All Students Information
              </Button>










            </Box>
          </Box>
        </>

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
              title={(studentsData?.length || 0)} // Formats the number with commas
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
              subtitle="Total SSS 1 Enrolled"
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
                          <TableCell>{student.lgaOfEnrollment}</TableCell>
                          <TableCell>{student.ward}</TableCell>
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
                    backgroundColor: '#196b57', // Default background color
                    color: '#ffffff', // Text color
                    padding: '10px 20px', // Add some padding for better appearance
                    borderRadius: '8px', // Rounded corners
                    fontWeight: 'bold', // Bold text
                    textTransform: 'uppercase', // Make text uppercase
                    transition: 'all 0.3s ease', // Smooth transition for hover effect
                    '&:hover': {
                      backgroundColor: '#145943', // Slightly darker shade on hover
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
