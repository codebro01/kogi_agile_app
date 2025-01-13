import React from "react";
import PropTypes from "prop-types";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
} from "@mui/material";

export const ViewSchoolsInfo = ({ header, data }) => {
    return (
        <TableContainer component={Paper} sx={{ border: `1px solid #196b57`, borderRadius: "8px" }}>
            <Typography
                variant="h6"
                sx={{
                    backgroundColor: "#196b57",
                    color: "white",
                    padding: "8px",
                    textAlign: "center",
                    borderTopLeftRadius: "8px",
                    borderTopRightRadius: "8px",
                }}
            >
                {header}
            </Typography>
            <Table>
                <TableHead>
                    <TableRow sx={{ backgroundColor: "#196b57" }}>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>School Name</TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>School Code</TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>LGA</TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>School Type</TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>School Category</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row, index) => (
                        <TableRow
                            key={index}
                            sx={{
                                "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" },
                                "&:nth-of-type(even)": { backgroundColor: "#e6f5ee" },
                            }}
                        >
                            <TableCell>{row.schoolName}</TableCell>
                            <TableCell>{row.schoolCode}</TableCell>
                            <TableCell>{row.lga}</TableCell>
                            <TableCell>{row.schoolType}</TableCell>
                            <TableCell>{row.schoolCategory}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

// // Prop type validation
// CustomTable.propTypes = {
//     header: PropTypes.string.isRequired,
//     data: PropTypes.arrayOf(
//         PropTypes.shape({
//             schoolName: PropTypes.string.isRequired,
//             schoolCode: PropTypes.string.isRequired,
//             lga: PropTypes.string.isRequired,
//             schoolType: PropTypes.string.isRequired,
//             schoolCategory: PropTypes.string.isRequired,
//         })
//     ).isRequired,
// };

