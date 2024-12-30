import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";

const StatBox = ({ title, subtitle, icon, progress, increase, bgColor }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box width="100%" p="15px" mx={{
      width: "100%",
      borderRadius: "5px"
    }} backgroundColor={bgColor}
    >
      <Box display="flex" justifyContent="space-between" >
        <Box>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ color: "#fff" }}
          >
            {title}
          </Typography>
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-between" mt="2px">
        <Typography variant="h4" sx={{ 
          // color: colors.primary[500] 
          }}>
          {subtitle}
        </Typography>
        <Typography
          variant="h5"
          fontStyle="italic"
          sx={{ color: colors.redAccent[600] }}
        >
          {increase}
        </Typography>

      </Box>
      <Box sx={{
        display: 'flex',
        justifyContent: "center",
        alignItems: "center",
        gap: "10px",
        marginTop: "10px",
      }}>{"More info"} {icon} </Box>
    </Box>
  );
};

export default StatBox;
