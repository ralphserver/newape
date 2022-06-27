import { Chip, ChipProps, Typography } from "@mui/material";

interface RiskLabelProps extends ChipProps {
  risk: number;
}

function RiskLabel({ risk }: RiskLabelProps): JSX.Element {
  if (risk < 0) {
    return <></>;
  }

  if (risk > 0.8) {
    return (
      <Chip
        size="small"
        label={
          <Typography sx={{ px: 1.5 }} variant="caption" color="error.dark">
            High
          </Typography>
        }
        color="error"
      />
    );
  }

  if (0.6 < risk && risk <= 0.8) {
    return (
      <Chip
        size="small"
        label={
          <Typography sx={{ px: 1.5 }} variant="caption" color="warning.dark">
            Medium
          </Typography>
        }
        color="warning"
      />
    );
  }

  return (
    <Chip
      size="small"
      label={
        <Typography sx={{ px: 1.5 }} variant="caption" color="success.dark">
          Safe
        </Typography>
      }
      color="success"
    />
  );
}

export default RiskLabel;
