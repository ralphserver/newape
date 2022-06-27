import { Box, InputBase, InputBaseProps, Stack } from "@mui/material";
import BigNumber from "bignumber.js";
import { useCallback, useMemo } from "react";
import { Token } from "constants/tokens";
import TokenIcon from "components/TokenIcon";
import Text from "components/Text";
import MaxButton from "components/MaxButton";
import { commify } from "../utils/number";

interface AmountInputProps extends Omit<InputBaseProps, "onChange"> {
  max?: string;
  usdRate?: number;
  maxDecimals?: number;
  token?: Token;
  onChange?: (value: string) => void;
}

const AmountInput = ({
  max,
  usdRate,
  maxDecimals = 2,
  token,
  onChange,
  value,
  ...props
}: AmountInputProps): JSX.Element => {
  const usdValue = useMemo(() => {
    if (!usdRate) return "";
    return new BigNumber((value as string) || 0).multipliedBy(usdRate).toFixed(2);
  }, [usdRate, value]);

  const endAdornment = (
    <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexGrow: 1 }}>
      {usdRate && <Text whiteSpace="nowrap">~${commify(usdValue)} USD</Text>}
      <MaxButton onClick={() => onChange?.(roundDown(max || ""))} isShow={!!max} sx={{ flexGrow: 1 }} />
      {token && <TokenIcon token={token} />}
    </Stack>
  );

  const roundDown = useCallback(
    (value: string) => {
      const [x = "", y = ""] = value.split(".");
      if (y) return [x, y.slice(0, maxDecimals)].join(".");
      return value;
    },
    [maxDecimals],
  );

  return (
    <Box
      sx={{
        backgroundColor: "#121111",
        borderRadius: "16px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <InputBase
        fullWidth
        type="number"
        placeholder="0"
        onChange={(e) => {
          onChange?.(roundDown(e.target.value));
        }}
        endAdornment={endAdornment}
        sx={{
          px: 2,
          py: 1,
          flexWrap: "wrap",
          "& .MuiInputBase-input": {
            flex: "5 0 100px",
          },
        }}
        value={value}
        {...props}
      />
    </Box>
  );
};

export default AmountInput;
