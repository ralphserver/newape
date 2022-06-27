import { Button, ButtonProps } from "@mui/material";
import { shortAddress } from "utils/web3";

interface ConnectedButtonProp extends ButtonProps {
  walletAddress: string;
  onConnect?: () => void;
}

function ConnectedButton(props: ConnectedButtonProp): JSX.Element {
  const { sx, walletAddress, onConnect, ...restProps } = props;
  return (
    <Button
      sx={{
        height: "48px",
        borderRadius: "100px",
        backgroundColor: "#1E2329",
        color: "white",
        padding: 1,
        textTransform: "unset",
        ...sx,
      }}
      variant="contained"
      onClick={onConnect}
      {...restProps}
    >
      {shortAddress(walletAddress)}
    </Button>
  );
}

export default ConnectedButton;
