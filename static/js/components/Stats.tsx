import { Skeleton, Stack, StackProps, Tooltip, Typography, useTheme } from "@mui/material";
import ReportIcon from "@mui/icons-material/Report";
import { useState, useCallback } from "react";
import useMobile from "hooks/useMobile";
import useWallet from "../hooks/useWallet";

interface StatsProps extends StackProps {
  title: string;
  value?: string;
  direction?: "row" | "column";
  isLarge?: boolean;
  isLoading?: boolean;
  hints?: string;
  userStat?: boolean;
}

export function Stats({
  title,
  value,
  direction = "row",
  isLarge = false,
  isLoading,
  hints,
  userStat,
  ...props
}: StatsProps): JSX.Element {
  const isMobile = useMobile();
  const theme = useTheme();
  const [isShow, setIsShow] = useState<boolean>(false);
  const { connected } = useWallet();

  const handleHover = useCallback(() => {
    if (!isMobile) {
      setIsShow(true);
    }
  }, [isMobile]);

  const handleClick = useCallback(() => {
    if (isMobile) {
      setIsShow(true);
    }
  }, [isMobile]);

  const handleClose = () => setIsShow(false);

  return (
    <Stack direction={direction} alignItems="center" justifyContent="space-between" spacing={1} {...props}>
      <Stack direction="row" justifyContent="center" alignItems="center">
        <Typography noWrap sx={{ mr: 0.5 }} color="text.title">
          {title}
        </Typography>
        {hints && (
          <Tooltip
            open={isShow}
            onClick={handleClick}
            onClose={handleClose}
            title={hints}
            onMouseOver={handleHover}
            onMouseLeave={handleClose}
            placement="top"
            arrow
          >
            <ReportIcon sx={{ fontSize: "16px", color: theme.palette.link?.inactive }} />
          </Tooltip>
        )}
      </Stack>
      <Typography fontWeight={isLarge ? "700" : "600"} fontSize={isLarge ? "1.5rem" : "1rem"}>
        {userStat && !connected ? "-" : !value || isLoading ? <Skeleton width="100px" /> : value}
      </Typography>
    </Stack>
  );
}
