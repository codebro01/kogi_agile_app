import { Box, IconButton, Tooltip, useTheme, Button, Avatar } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";

const Topbar = ({setIsSidebar}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem("token");
    // Navigate to the sign-in page
    navigate("/sign-in");
  };

  return (
    <Box display="flex" justifyContent="space-between" p={2}>

      {/* SEARCH BAR */}
      <Box
        display="flex"
      >
        <Box
          component="img"
          src="site-logo-dark.png"
          alt="Logo"
          sx={{
            width: { xs: 60, sm: 100, md: 120 },
            height: "auto", // Maintain the natural aspect ratio
            objectFit: "contain",
          }}
        />
      </Box>

      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton>
        <IconButton>
          <SettingsOutlinedIcon />
        </IconButton>
        <Tooltip
          title={
            <Button
              onClick={handleLogout}
              variant="text"
              sx={{
                color: "red",
                textTransform: "none",
                fontSize: "14px",
              }}
            >
              Logout
            </Button>
          }
          arrow
          placement="bottom"
          sx={{
            backgroundColor: "white",  // Set the background color of the tooltip
            border: "1px solid #ddd",  // Optional: Add a light border
            padding: "4px",  // Optional: Add padding for better spacing
          }}
        >
          <IconButton>
            <PersonOutlinedIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default Topbar;
