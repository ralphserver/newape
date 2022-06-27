import { Button, ButtonProps } from "@mui/material";

interface MaxButtonProps extends ButtonProps {
  isShow: boolean;
}

function MaxButton({ isShow, sx, ...props }: MaxButtonProps): JSX.Element {
  return (
    <Button
      variant="function"
      sx={{
        visibility: isShow ? "visible" : "hidden",
        ...sx,
      }}
      {...props}
    >
      Max
    </Button>
  );
}

export default MaxButton;
