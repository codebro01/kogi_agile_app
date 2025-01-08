import {
    Box,
    Typography,
    FormControl,
    MenuItem,
    InputLabel,
    Select,
    Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const RoleSelector = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState(""); // Ensure role is initialized with an empty string

    const handleChange = (event) => {
        const selectedRole = event.target.value;
        setRole(selectedRole);
    };

    const handleProceed = () => {
        // Navigate to the corresponding URL
        const roleLinks = {
            admin: "/admin-dashboard/create-accounts/register-admin",
            enumerator: "/admin-dashboard/create-accounts/register-enumerator",
            payrollSpecialist: "/admin-dashboard/create-accounts/register-payroll-specialists",
            school: "/admin-dashboard/create-accounts/register-school",
        };

        if (role && roleLinks[role]) {
            navigate(roleLinks[role]);
        } else {
            alert("Please select an account type before proceeding.");
        }
    };

    return (
        <Grid
            container
            sx={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                bgcolor: "#f0f4f7", // Light gray background
                padding: "32px",
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    maxWidth: "500px",
                    bgcolor: "#ffffff", // White card
                    borderRadius: "16px", // Smooth round edges
                    boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.15)", // Elevated card shadow
                    overflow: "hidden",
                }}
            >
                <Box
                    sx={{
                        bgcolor: "#196b57", // Green header
                        padding: "24px",
                        textAlign: "center",
                    }}
                >
                    <Typography
                        variant="h5"
                        sx={{
                            color: "#ffffff", // White text
                            fontWeight: "bold",
                        }}
                    >
                        Select Account Type
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            color: "#e8f5f2", // Subtle lighter text
                            marginTop: "8px",
                        }}
                    >
                        After selecting account type, click proceed to go to the form page
                    </Typography>
                </Box>
                <Box
                    sx={{
                        padding: "24px",
                    }}
                >
                    <FormControl fullWidth>
                        <InputLabel
                            id="role-selector-label"
                            sx={{
                                color: "#196b57",
                            }}
                        >
                            Account Type
                        </InputLabel>
                        <Select
                            labelId="role-selector-label"
                            value={role} // Ensure Select is controlled by role state
                            onChange={handleChange} // Update state on change
                            label="Account Type"
                            sx={{
                                "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#196b57",
                                },
                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#1b7a64",
                                },
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#196b57",
                                },
                                "& .MuiSelect-icon": {
                                    color: "#196b57",
                                },
                                borderRadius: "8px",
                            }}
                        >
                            <MenuItem value="admin">Register new Admin</MenuItem>
                            <MenuItem value="enumerator">Register new Enumerator</MenuItem>
                            <MenuItem value="payrollSpecialist">Register Payroll Specialist</MenuItem>
                            <MenuItem value="school">Add School</MenuItem>
                        </Select>
                    </FormControl>
                    <Box
                        sx={{
                            marginTop: "24px",
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <button
                            style={{
                                backgroundColor: "#196b57",
                                color: "#ffffff",
                                border: "none",
                                padding: "12px 24px",
                                borderRadius: "8px",
                                fontSize: "16px",
                                cursor: "pointer",
                                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                                fontWeight: "bold",
                            }}
                            onClick={handleProceed} // Navigate on button click
                        >
                            Proceed
                        </button>
                    </Box>
                </Box>
            </Box>
        </Grid>
    );
};
