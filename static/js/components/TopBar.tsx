import { Box, Button, Link, Stack, AppBar, Toolbar } from "@mui/material";
import { useContext } from "react";
import { useMatch } from "react-router-dom";
import { ConnectionContext } from "../providers/ConnectionProvider";
import ApeLogo from "components/ApeLogo";
import ConnectedButton from "components/ConnectedButton";
import ApeNavLink from "components/NavLink";

export const links = [
  { name: "Home", link: "/" },
  { name: "Borrow / Repay", link: "borrow" },
  { name: "Earn", link: "earn" },
];

const TopBar = (): JSX.Element => {
  const { connectWallet, connected, walletAddress } = useContext(ConnectionContext);
  const match = useMatch({ path: "/", end: true });

  return (
    <AppBar
      component="nav"
      position="sticky"
      sx={{
        display: "flex",
        justifyContent: "center",
        background: `linear-gradient(180deg, #121111 0%, rgba(18, 17, 17, 0) 100%)`,
        filter: `drop-shadow(0px 20px 30px rgba(0, 0, 0, 0.25))`,
        backdropFilter: `blur(42px)`,
      }}
      elevation={0}
    >
      <Toolbar sx={{ height: 80, p: "30px" }}>
        <Stack spacing={3} direction="row" sx={{ flex: "1 0 300px" }}>
          {links.map((l) => (
            <Link key={l.name} component={ApeNavLink} to={l.link}>
              {l.name}
            </Link>
          ))}
        </Stack>
        <ApeLogo />
        <Box sx={{ display: "flex", justifyContent: "flex-end", flex: "1 0 300px" }}>
          {connected && !match && (
            <ConnectedButton onClick={connectWallet} sx={{ width: "182px" }} walletAddress={walletAddress || ""} />
          )}
          {!connected && !match && (
            <Button
              sx={{
                width: "186px",
              }}
              variant="primary"
              onClick={connectWallet}
            >
              Connect Wallet
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
