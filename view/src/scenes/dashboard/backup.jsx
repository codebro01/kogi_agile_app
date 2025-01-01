{/* GRID & CHARTS */ }
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
                        marginTop: "50px"
                    }}
                >
                    Click to view all students Information
                </Button>

            </>


        }
    </Box>
</Box>