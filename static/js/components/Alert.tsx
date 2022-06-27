import { Block, CheckCircleOutline } from "@mui/icons-material";
import { Stack } from "@mui/material";
import Text from "./Text";

interface AlertProps {
  message: string;
  severity: "success" | "error";
}

const Alert = ({ message, severity }: AlertProps): JSX.Element => {
  return (
    <Stack direction="row" sx={{ alignItems: "center" }} spacing={2}>
      {severity === "success" && <CheckCircleOutline />}
      {severity === "error" && <Block />}
      <Stack spacing={0.5}>
        <Text textTransform="capitalize" fontWeight="600">
          {severity}
        </Text>
        <Text maxWidth="200px">{message}</Text>
      </Stack>
    </Stack>
  );
};

export default Alert;
