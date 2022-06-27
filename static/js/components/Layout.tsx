import { Box, Container, Stack, Icon, Link, Snackbar, Button, SnackbarContent } from "@mui/material";
import { useEffect } from "react";
import { Outlet, useMatch } from "react-router-dom";
import useAlert from "../hooks/useAlert";
import Alert from "./Alert";
import TopBar from "./TopBar";
import MobileTopBar from "components/MobileTopBar";
import { FooterLink } from "types";
import useMobile from "hooks/useMobile";

const footerLinks: FooterLink[] = [
  {
    title: "github",
    img: "assets/socialMedia/github.svg",
    link: "https://github.com/ape-fi",
  },
  {
    title: "telegram",
    img: "assets/socialMedia/telegram.svg",
    link: "https://t.me/apedotfi",
  },
  {
    title: "twitter",
    img: "assets/socialMedia/twitter.svg",
    link: "https://twitter.com/apedotfi",
  },
];

const Layout = (): JSX.Element => {
  const isMobile = useMobile();
  const match = useMatch({ path: "/", end: true });

  const { alert, setAlert } = useAlert();

  const getBackgroundImg = () => (match ? "landing_background.png" : "background.png");
  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        backgroundImage: `url(/assets/${getBackgroundImg()})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {isMobile ? <MobileTopBar /> : <TopBar />}

      <Snackbar
        key={alert?.msg}
        open={!!alert}
        autoHideDuration={5000}
        onClose={() => {
          setAlert(undefined);
        }}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ top: "200px" }}
      >
        <SnackbarContent
          message={alert && <Alert severity={alert.severity} message={alert.msg} />}
          sx={{ backgroundColor: alert?.severity === "error" ? "#EB5757" : "#6FCF97" }}
        />
      </Snackbar>

      <Container fixed>
        <Outlet />
      </Container>
      <Box sx={{ p: 4 }} component="footer">
        <Stack direction="row" justifyContent="center" spacing={4}>
          {footerLinks.map((linkItem) => (
            <Link key={linkItem.title} href={linkItem.link} target="_blank">
              <Icon>
                <img style={{ height: "100%" }} src={linkItem.img} alt={linkItem.title} />
              </Icon>
            </Link>
          ))}
        </Stack>
      </Box>
    </Box>
  );
};

export default Layout;
