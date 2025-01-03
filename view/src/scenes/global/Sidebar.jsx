import { useState, useContext } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme, Switch } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
// import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { ChangePasswordForm } from "../../components/changePasswordPopup.jsx";
// import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import { useAuth } from '../auth/authContext.jsx';
const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const label = { inputProps: { 'aria-label': 'Switch demo' } };



  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = ({ isSidebar }) => {
  const { userPermissions } = useAuth();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [selected, setSelected] = useState("Dashboard");
  const storedUser = JSON.parse(localStorage.getItem('userData'))
  const label = { inputProps: { 'aria-label': 'Switch demo' } };
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  console.log(storedUser);
  return (
    <Box className={`sidebark ${isSidebar ? "" : "collapsed"}`}
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: `${colors.main['darkGreen']} !important`,


        },
        "& .pro-menu-item.active": {
          color: `${colors.main["darkGreen"]} !important `
        },

      }}
    >
      <ProSidebar collapsed={isCollapsed} sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: "200px !important"

      }}>
        <Menu sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',

        }}>
          {/* LOGO AND MENU ICON */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Switch
              checked={isCollapsed}
              onClick={() => setIsCollapsed(!isCollapsed)}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: '#546e13',  // Color of the switch when checked
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: '#546e13',  // Color of the track when checked
                },
                '& .MuiSwitch-switchBase': {
                  color: '#546e13',  // Color of the switch when unchecked
                },
                '& .MuiSwitch-switchBase + .MuiSwitch-track': {
                  backgroundColor: '#546e13',  // Color of the track when unchecked
                },
              }}
            />
          </Box>

          {!isCollapsed && (
            <Box
              display="none"
              justifyContent="space-between"
              alignItems="center"
              ml="15px"
            >
            </Box>
          )}

          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={userPermissions.length > 0 && storedUser.passport_url}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">

                <Box sx={{ marginTop: "20px", marginBottom: "20px", }}>
                  <ChangePasswordForm open={open} handleOpen={handleOpen} handleClose={handleClose} />
                </Box>
                <Typography
                  variant="h6"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  Email:  {userPermissions.length > 0 && storedUser.email}
                </Typography>
                <Typography
                  variant="h6"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  user ID:  {userPermissions.length > 0 ? storedUser?.randomId : 'no random id'}
                </Typography>

              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"} marginTop={5}>
            <Item

              title="Dashboard"
              to={userPermissions.includes('handle_registrars') ? '/admin-dashboard' : '/enumerator-dashboard'}
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Accounts
            </Typography>
            <Item
              title="create Accounts"
              to={userPermissions.includes('handle_registrars') ? '/admin-dashboard/role-selector' : '/admin-dashboard/create-student-school-selector'}              
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Manage Students"
              to={userPermissions.includes('handle_registrars') ? 'admin-dashboard/view-all-students-data' : 'enumerator-dashboard/view-all-students-data'}
              icon={<ContactsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />




            {userPermissions.includes('handle_registrars') &&

              <>

                <Typography
                  variant="h6"
                  color={colors.grey[300]}
                  sx={{ m: "15px 0 5px 20px" }}
                >
                  Manage Enumerators
                </Typography>
                <Item
                  title="Enumerators Info"
                  to="/form"
                  icon={<PersonOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Create Enumerator"
                  to="/calendar"
                  icon={<CalendarTodayOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Enumerators Activites"
                  to="/faq"
                  icon={<HelpOutlineOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
              </>
            }





            {userPermissions.includes('handle_registrars') &&
              <>
                <Typography
                  variant="h6"
                  color={colors.grey[300]}
                  sx={{ m: "15px 0 5px 20px" }}
                >
                  Statistics
                </Typography>
                <Item
                  title="Bar Chart"
                  to="/bar"
                  icon={<BarChartOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Pie Chart"
                  to="/pie"
                  icon={<PieChartOutlineOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Line Chart"
                  to="/line"
                  icon={<TimelineOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
              </>

            }




          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
