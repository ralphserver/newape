import { Typography, Icon, Stack } from "@mui/material";

function ApeLogo(): JSX.Element {
  return (
    <Stack spacing={1} direction="row" sx={{ display: "flex", alignItems: "center" }}>
      <Typography variant="logo">Ape</Typography>
      <Icon sx={{ width: 44, height: 44 }}>
        <img style={{ height: "100%" }} src="assets/ape.svg" alt="ape logo" />
      </Icon>
      <Typography variant="logo">Finance</Typography>
    </Stack>
  );
}

export default ApeLogo;
