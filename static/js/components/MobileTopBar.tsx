import { Stack, Button, List, Box, Drawer, ListItem, Link, IconButton, AppBar, Toolbar } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useLocation } from "react-router-dom";
import { ConnectionContext } from "../providers/ConnectionProvider";
import { useState, useContext, useEffect } from "react";
import ApeLogo from "components/ApeLogo";
import ConnectedButton from "components/ConnectedButton";
import ApeNavLink from "components/NavLink";
import { links } from "./TopBar";

const DRAWER_WIDTH = 300;

function MobileTopBar(): JSX.Element {
  let location = useLocation();
  const { connectWallet, connected, walletAddress } = useContext(ConnectionContext);
  const [isOpenToggle, setIsOpenToggle] = useState<boolean>(false);

  const handleConnect = () => {
    setIsOpenToggle(false);
    connectWallet();
  };

  useEffect(() => {
    setIsOpenToggle(false);
  }, [location]);

  return (
    <AppBar
      component="nav"
      position="sticky"
      sx={{
        background: `linear-gradient(180deg, #121111 0%, rgba(18, 17, 17, 0) 100%)`,
        filter: `drop-shadow(0px 20px 30px rgba(0, 0, 0, 0.25))`,
        backdropFilter: `blur(42px)`,
      }}
      elevation={0}
    >
      <Stack direction="row" sx={{ height: 80, p: "30px" }} justifyContent="space-between">
        <ApeLogo />
        <MenuIcon sx={{ color: "#FFFFFF" }} onClick={() => setIsOpenToggle(true)} />
        <Drawer
          sx={{
            width: DRAWER_WIDTH,
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
            },
          }}
          anchor="right"
          open={isOpenToggle}
          PaperProps={{
            sx: { backgroundColor: "background.default" },
          }}
          onClose={() => setIsOpenToggle(false)}
        >
          <Box sx={{ p: 1 }}>
            <Box sx={{ p: 1, display: "flex", justifyContent: "flex-end" }}>
              <IconButton sx={{ color: "text.primary", fontSize: 32 }} onClick={() => setIsOpenToggle(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
            <List>
              {links.map((l) => (
                <ListItem key={l.name} sx={{ my: 2 }}>
                  <Link component={ApeNavLink} to={l.link}>
                    {l.name}
                  </Link>
                </ListItem>
              ))}
              <ListItem>
                {connected ? (
                  <ConnectedButton walletAddress={walletAddress || ""} onConnect={handleConnect} fullWidth={true} />
                ) : (
                  <Button fullWidth variant="primary" onClick={handleConnect}>
                    Connect Wallet
                  </Button>
                )}
              </ListItem>
            </List>
          </Box>
        </Drawer>
      </Stack>
    </AppBar>
  );
}

export default MobileTopBar;
