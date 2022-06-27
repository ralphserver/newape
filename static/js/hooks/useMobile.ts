import { useMediaQuery, useTheme } from "@mui/material";

const useMobile = () => {
  const theme = useTheme();
  return useMediaQuery(() => theme.breakpoints.down("md"));
};

export default useMobile;
