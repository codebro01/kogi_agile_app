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
    const [role, setRole] = useState("");

    const handleChange = (event) => {
        const selectedRole = event.target.value;
        setRole(selectedRole);

        // Navigate to the corresponding URL
        const roleLinks = {
            admin: "/admin-dashboard/create-accounts/register-admin",
            enumerator: "/admin-dashboard/create-accounts/register-enumerator",
            student: "/admin-dashboard/create-student-school-selector",
            school: "/admin-dashboard/create-accounts/register-school",
        };

        if (selectedRole && roleLinks[selectedRole]) {
            navigate(roleLinks[selectedRole]);
        }
    };

    return (
        <Grid
            sx={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                bgcolor: "#ffffff", // White background
                flexDirection: "column",
            }}
        >
            <Typography
                variant="h4"
                gutterBottom
                sx={{
                    color: "#196b57", // Green color for title
                    fontWeight: "bold",
                    marginBottom: "16px",
                }}
            >
                Create Account
            </Typography>

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                }}
            >
                <Box
                    sx={{
                        width: "100%",
                        maxWidth: "400px", // Limit width to 400px
                        padding: "24px",
                        bgcolor: "#ffffff", // White background for the form
                        borderRadius: "12px", // Rounded corners
                        boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)", // Subtle shadow
                        border: "2px solid #196b57", // Green border
                    }}
                >
                    <FormControl fullWidth>
                        <InputLabel
                            id="role-selector-label"
                            sx={{
                                color: "#196b57", // Green label color
                            }}
                        >
                            Select Role
                        </InputLabel>
                        <Select
                            labelId="role-selector-label"
                            value={role}
                            onChange={handleChange}
                            label="Select Role"
                            sx={{
                                "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#196b57", // Green border
                                },
                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#196b57", // Green hover border
                                },
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#196b57", // Green focus border
                                },
                                "& .MuiSelect-icon": {
                                    color: "#196b57", // Green dropdown arrow
                                },
                                borderRadius: "8px",
                            }}
                        >
                            <MenuItem value="admin">Register new Admin</MenuItem>
                            <MenuItem value="enumerator">Register new Enumerator</MenuItem>
                            <MenuItem value="student">Register new Student</MenuItem>
                            <MenuItem value="school">Register School</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Box>
        </Grid>
    );
};
