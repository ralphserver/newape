import { Stack, Typography, Card, Grid, Divider, Skeleton, Box } from "@mui/material";
import React from "react";
import { Pool } from "../config";
import usePool from "../hooks/usePool";
import useUserPoolStats from "../hooks/useUserPoolStats";
import { toDigits, toPercent } from "../utils/number";
import { PoolCardContent } from "./PoolCardContent";
import { Stats } from "./Stats";

type Column = {
  title: string;
  size: number;
};

interface PoolCardProps {
  pool: Pool;
  columns: Column[];
  isExpanded?: boolean;
  setExpanded: (poolName: String) => void;
}

export const PoolCard: React.FC<PoolCardProps> = ({ pool, columns, isExpanded, setExpanded }) => {
  const { name } = pool;
  const { data: poolData, isLoading: isLoadingPoolData } = usePool(pool);
  const { data: userPoolStats } = useUserPoolStats(pool);
  const [token1, token2] = pool.lp.pair;

  return (
    <Card sx={{ px: 5, py: 3 }}>
      <Grid container onClick={() => setExpanded(isExpanded ? "" : name)} sx={{ cursor: "pointer" }}>
        <Grid item xs={columns[0].size}>
          <Stack direction="row" justifyContent="start" alignItems="center" gap={2} flexWrap="wrap">
            <Stack direction="row" alignItems="center">
              <Box
                component="img"
                src={token1.img}
                alt={`${token1.symbol} logo`}
                sx={{ backgroundColor: "white", borderRadius: "50%", width: 24, height: 24 }}
              />
              <Box
                component="img"
                src={token2.img}
                alt={`${token2.symbol} logo`}
                sx={{ backgroundColor: "white", borderRadius: "50%", width: 24, height: 24, ml: -1 }}
              />
            </Stack>
            <Typography maxWidth="100px">{name}</Typography>
          </Stack>
        </Grid>
        <Grid item xs={columns[1].size}>
          <Stack direction="row" alignItems="center" height="100%">
            {isLoadingPoolData ? <Skeleton width="100px" /> : <Typography>{toPercent(poolData?.apr || 0)}</Typography>}
          </Stack>
        </Grid>
        <Grid item xs={columns[2].size}>
          <Stack direction="row" alignItems="center" height="100%">
            {isLoadingPoolData ? (
              <Skeleton width="100px" />
            ) : (
              <Typography>${toDigits(poolData?.tvl || 0, 2)}</Typography>
            )}
          </Stack>
        </Grid>
        <Grid item xs={columns[3].size}>
          <Stack direction="row" alignItems="center" height="100%" gap={1}>
            <Typography>{`${toDigits(userPoolStats?.staked || 0, 2)} LP`}</Typography>
            {/*<Typography color="text.title">~$###</Typography>*/}
          </Stack>
        </Grid>
        <Grid item xs={columns[4].size}>
          <Stack direction="row" alignItems="center" height="100%" gap={1}>
            {userPoolStats ? (
              <Typography>{`${toDigits(userPoolStats.claimable.amount, 4)} ${
                userPoolStats.claimable.symbol
              }`}</Typography>
            ) : (
              <Typography>0</Typography>
            )}
            {/*<Typography color="text.title">~$###</Typography>*/}
          </Stack>
        </Grid>
        <Grid item xs={columns[5].size}>
          <Stack direction="row" alignItems="center" height="100%">
            <img width="16" height="16" src={isExpanded ? "assets/arrow_up.svg" : "assets/arrow_down.svg"} />
          </Stack>
        </Grid>
      </Grid>
      {isExpanded && <Divider sx={{ my: 2.5 }} />}
      {isExpanded && <PoolCardContent pool={pool} />}
    </Card>
  );
};

export const MobilePoolCard: React.FC<PoolCardProps> = ({ pool, isExpanded, setExpanded }) => {
  const { name } = pool;
  const { data: poolData } = usePool(pool);
  const { data: userPoolStats } = useUserPoolStats(pool);
  const [token1, token2] = pool.lp.pair;

  const claimable = (() => {
    if (!userPoolStats) return;

    const amount = toDigits(userPoolStats.claimable.amount, 4);
    const symbol = userPoolStats.claimable.symbol;

    return `${amount} ${symbol}`;
  })();

  return (
    <Card sx={{ px: 5, py: 3 }}>
      <Box>
        <Stack direction="row" justifyContent="start" alignItems="center" gap={2} flexWrap="wrap" mb={2}>
          <Stack direction="row" alignItems="center">
            <Box
              component="img"
              src={token1.img}
              alt={`${token1.symbol} logo`}
              sx={{ backgroundColor: "white", borderRadius: "50%", width: 24, height: 24 }}
            />
            <Box
              component="img"
              src={token2.img}
              alt={`${token2.symbol} logo`}
              sx={{ backgroundColor: "white", borderRadius: "50%", width: 24, height: 24, ml: -1 }}
            />
          </Stack>
          <Typography>{name}</Typography>
        </Stack>
        <Stack spacing={1}>
          <Stats title="APR %" value={toPercent(poolData?.apr || 0)} />
          <Stats title="TVL" value={`$${toDigits(poolData?.tvl || 0, 2)}`} isLoading={!poolData} />
          <Stats
            title="Staked"
            value={`${toDigits(userPoolStats?.staked || 0, 2)} LP`}
            isLoading={!userPoolStats}
            userStat
          />
          <Stats title="Claimable" value={claimable} isLoading={!claimable} userStat />
        </Stack>
        {!isExpanded && (
          <Stack direction="row" justifyContent="center" mt={2}>
            <Box
              component="img"
              onClick={() => setExpanded(name)}
              src="assets/arrow_down.svg"
              sx={{
                width: "16",
                height: "16",
                cursor: "pointer",
              }}
            />
          </Stack>
        )}
        {isExpanded && <Divider sx={{ my: 2.5 }} />}
        {isExpanded && <PoolCardContent pool={pool} />}
        {isExpanded && (
          <Stack direction="row" justifyContent="center" mt={2}>
            <Box
              component="img"
              onClick={() => setExpanded("")}
              src="assets/arrow_up.svg"
              sx={{
                width: "16",
                height: "16",
                cursor: "pointer",
              }}
            />
          </Stack>
        )}
      </Box>
    </Card>
  );
};
