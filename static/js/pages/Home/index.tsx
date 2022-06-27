import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Home = (): JSX.Element => {
  let navigate = useNavigate();
  return (
    <Box
      sx={{
        height: "80vh",
        minHeight: 600,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography noWrap variant="slogan">
        Building DeFi
      </Typography>
      <Typography noWrap variant="slogan">
        for the metaverse.
      </Typography>
      <Button sx={{ mt: 4, width: 186 }} variant="secondary" onClick={() => navigate("/borrow")}>
        Launch App
      </Button>
    </Box>
  );
};

export default Home;
