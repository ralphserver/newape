import { LoadingButton } from "@mui/lab";
import { Card, Stack, Typography, Grid } from "@mui/material";
import React, { useState } from "react";
import { Stats } from "../../components/Stats";
import config from "../../config";
import useEarnClaimables from "../../hooks/useEarnClaimables";
import useMobile from "../../hooks/useMobile";
import { MobilePoolCard, PoolCard } from "../../components/PoolCard";
import { toDigits } from "../../utils/number";

type Stat = {
  title: string;
  value?: string;
  tooltip?: string;
};

type Column = {
  title: string;
  size: number;
};

const Earn = (): JSX.Element => {
  const isMobile = useMobile();
  const [expandedPool, setExpandedPool] = useState<String>("");

  const { pools } = config.earn;
  const { claimable, claimReward, isClaimingReward, totalStaked } = useEarnClaimables();

  const stats: Stat[] = [
    { title: "Total Claimable", value: (claimable && `${toDigits(claimable.apeFi, 4)} APEFI`) || "0 APEFI" },
    { title: 'Total Staked', value: (totalStaked && `$${toDigits(totalStaked, 2)}`) || "0 USD"},
  ];
  const columns: Column[] = [
    { title: "Pool Name", size: 2.5 },
    { title: "APR %", size: 1.5 },
    { title: "TVL", size: 2 },
    { title: "Staked", size: 2.75 },
    { title: "Claimable", size: 2.75 },
    { title: "", size: 0.5 },
  ];

  const isClaimReady = () => {
    return !!(claimable && claimable.apeFi.gt(0));
  };

  return (
    <Stack spacing={isMobile ? 2.5 : 3}>
      <Typography variant="pageTitle">Earn</Typography>
      <Card sx={{ px: 6, py: 2.5 }}>
        <Stack direction={isMobile ? "column" : "row"} justifyContent="space-between" alignItems="center" gap={3}>
          <Stack direction="row" justifyContent="space-between" flexWrap="wrap" gap={12}>
            {stats.map((stat) => {
              return <Stats key={stat.title} title={stat.title} value={stat.value} direction="column" isLarge={true} />;
            })}
          </Stack>
          <LoadingButton
            variant="secondary"
            sx={isMobile ? { width: "100%" } : { minWidth: "285px" }}
            onClick={() => claimReward()}
            disabled={!isClaimReady()}
            loading={isClaimingReward}
          >
            Claim all
          </LoadingButton>
        </Stack>
      </Card>

      {!isMobile ? (
        <>
          <Grid container sx={{ px: 5, pt: 3 }}>
            {columns.map((column) => (
              <Grid key={column.title} item xs={column.size}>
                <Typography color="text.title">{column.title}</Typography>
              </Grid>
            ))}
          </Grid>
          {pools.map((pool) => (
            <PoolCard
              key={pool.name}
              pool={pool}
              columns={columns}
              isExpanded={expandedPool === pool.name}
              setExpanded={setExpandedPool}
            />
          ))}
        </>
      ) : (
        <>
          {pools.map((pool) => (
            <MobilePoolCard
              key={pool.name}
              pool={pool}
              columns={columns}
              isExpanded={expandedPool === pool.name}
              setExpanded={setExpandedPool}
            />
          ))}
        </>
      )}
    </Stack>
  );
};

export default Earn;
