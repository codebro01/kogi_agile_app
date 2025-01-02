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

const Topbar = ({ setIsSidebar }) => {
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
          src="/site-logo-dark.png"
          alt="Logo"
          sx={{
            width: { xs: 100, sm: 160, md: 220 },
            height: "auto", // Maintain the natural aspect ratio
            objectFit: "contain",
          }}
        />
      </Box>

      {/* ICONS */}
      <Box sx = {{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton> */}
        <Box
          sx={{
            position: 'relative',
          }}
        >
          <Button
            variant="outlined"
            color="error"
            sx={{
              borderRadius: '20px', // Rounded corners
              padding: '8px 16px', // Padding inside the button
              fontSize: '14px', // Font size
              textTransform: 'none', // No uppercase transformation
              boxShadow: 'none', // No box shadow
              border: '1px solid #f44336', // Border color
              backgroundColor: '#f44336', // Hover background color
                color: 'white', // Text color on hover

              '&:hover': {
                backgroundColor: 'transparent', // Hover background color
                color: "grey"
              },
            }}

            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>

      </Box>
    </Box>
  );
};

export default Topbar;
