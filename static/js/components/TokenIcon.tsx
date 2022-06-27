import { Icon, Box } from "@mui/material";
import { Token } from "constants/tokens";
import Text from "components/Text";

interface TokenIconProps {
  token: Token;
}

function TokenIcon(props: TokenIconProps): JSX.Element {
  const { token } = props;
  return (
    <Box sx={{ display: "flex", alignItems: "center", flexWrap: "nowrap", minWidth: "100px" }}>
      <Icon sx={{ marginRight: 1, textAlign: "center" }}>
        <img style={{ height: "100%" }} src={token.img} alt={token.symbol} />
      </Icon>
      <Text>{token.symbol}</Text>
    </Box>
  );
}

export default TokenIcon;
