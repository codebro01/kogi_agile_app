import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";

const StatBox = ({ title, subtitle, icon, progress, increase, bgColor }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box width="100%" p="15px" mx={{
      width: "100%",
      borderRadius: "5px",
      minHeight: "100px"
    }} backgroundColor={bgColor}
    >
      <Box display="flex" justifyContent="center" alignItems={"center"} >
        <Box>
          <Typography
            variant="h1"
            fontWeight="bold"
            sx={{ 
              color: "#fff",
              fontSize : {
                xs: '1.3rem', // Mobile
                // sm: '1.2rem',   // Tablet
                md: '2.0rem', // Medium screens
                lg: '2.5rem',   // Large screens
              } 
              
              }}
            textAlign={"center"}
            
          >
            {title}
          </Typography>
        </Box>
      </Box>
      <Box display="flex" justifyContent="center" mt="3px">
        <Typography variant="h5" sx={{ 
          textAlign: "center",
          fontWeight: "700"
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
    </Box>
  );
};

export default StatBox;
