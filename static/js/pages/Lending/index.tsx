import { Card, Divider, Grid, Stack, Typography } from "@mui/material";
import BN from "bignumber.js";
import { formatUnits } from "ethers/lib/utils";
import React, { useMemo, useState } from "react";
import { Stats } from "../../components/Stats";
import { LendingType } from "../../constants";
import { ApeUsd } from "../../constants/tokens";
import useLiquidationFee from "../../hooks/useLiquidationFee";
import { useApeMarket, useApeUsdMarket } from "../../hooks/useMarket";
import useUserMarketStats from "../../hooks/useUserMarketStats";
import { commify, toDigits, toPercent } from "../../utils/number";
import BorrowCard from "./BorrowCard";
import RepayCard from "./RepayCard";

type Stat = {
  title: string;
  value?: string;
  tooltip?: string;
};

const Lending = (): JSX.Element => {
  const [lendingType, setLendingType] = useState<LendingType>("borrow");
  const { data: apeUsdMarket } = useApeUsdMarket();
  const { data: liquidationFee } = useLiquidationFee();

  const availableApeUsd = useMemo(() => {
    if (!apeUsdMarket) return "-";

    const remainingBorrow = apeUsdMarket.borrowCap.sub(apeUsdMarket.borrow);
    const cash = apeUsdMarket.cash;

    const available = remainingBorrow.lt(cash) && !remainingBorrow.isNegative() ? remainingBorrow : cash;
    return toDigits(formatUnits(available, ApeUsd.decimals), 2);
  }, [apeUsdMarket]);

  const stats: Stat[] = [
    {
      title: "Maximum LTV",
      value: "60%",
      tooltip:
        "The Maximum LTV ratio represents the maximum borrowing power of your APE. Max LTV of 60% means the user can borrow up to 0.6 worth of APE in ApeUSD for every 1 APE worth of collateral. Liquidations begin at 70%.",
    },
    {
      title: "Interest Rate",
      value: apeUsdMarket && toPercent(apeUsdMarket.borrowRate),
      tooltip:
        "Interest Rate is variable, scaling up and down according to utilization. Currently this variable rate is capped at 10% per annum.",
    },
    {
      title: "Borrow Fee",
      value: apeUsdMarket && toPercent(apeUsdMarket.borrowFee),
      tooltip: "This fee is collected by protocol every time you borrow ApeUSD.",
    },
    { title: "Total ApeUSD Available", value: availableApeUsd },
    {
      title: "Liquidation Fee",
      value: liquidationFee !== undefined ? toPercent(liquidationFee) : liquidationFee,
      tooltip:
        "Additional collateral given to liquidators as an incentive to perform liquidation of underwater accounts. For example, 10% liquidation fee means liquidators receive an extra 10% of the borrowers' collateral for every unit they close.",
    },
  ];

  return (
    <Grid container rowGap={3}>
      <Grid item xs={12}>
        <Typography variant="pageTitle" sx={{ textTransform: "uppercase" }}>
          Borrow / Repay
        </Typography>
        <Card sx={{ px: 5, py: 2.5 }}>
          <Grid container justifyContent="space-between" rowGap={2}>
            {stats.map((stat) => {
              return (
                <Grid key={stat.title} item xs={6} md={2}>
                  <Stats
                    key={stat.title}
                    title={stat.title}
                    value={stat.value}
                    hints={stat.tooltip}
                    direction="column"
                  />
                </Grid>
              );
            })}
          </Grid>
        </Card>
      </Grid>
      <Grid item container xs={12} spacing={2}>
        <Grid item xs={12} md={7}>
          {lendingType === "borrow" ? (
            <BorrowCard type={lendingType} setType={setLendingType} />
          ) : (
            <RepayCard type={lendingType} setType={setLendingType} />
          )}
        </Grid>
        <Grid item xs={12} md={5}>
          <InfoCard />
        </Grid>
      </Grid>
    </Grid>
  );
};

const InfoCard = (): JSX.Element => {
  const { data: apeMarket } = useApeMarket();
  const { data: apeUsdMarket } = useApeUsdMarket();
  const { apeCoinDeposited, apeCoinDepositedInUsd, apeUsdBorrowed, liquidationPrice } = useUserMarketStats();

  return (
    <Card sx={{ p: "30px" }}>
      <Stack spacing={3} divider={<Divider />}>
        <Stack spacing={2}>
          <Typography variant="cardTitle">Your Open Position</Typography>
          <Stats
            title={"APE Deposited"}
            value={`${toDigits(apeCoinDeposited || 0, 2)} APE`}
            isLoading={!apeCoinDeposited}
            userStat
          />
          <Stats
            title={"APE USD Value"}
            value={`$${toDigits(apeCoinDepositedInUsd || 0, 2)}`}
            isLoading={!apeCoinDepositedInUsd}
            userStat
          />
          <Stats
            title={"ApeUSD Borrowed"}
            value={`${commify(new BN(apeUsdBorrowed || 0).toFixed(2, BN.ROUND_UP))} ApeUSD`}
            isLoading={!apeUsdBorrowed}
            userStat
          />
          <Stats
            title={"APE Liquidation Price"}
            value={`$${toDigits(liquidationPrice || 0, 2)}`}
            isLoading={liquidationPrice === undefined}
            userStat
          />
        </Stack>
        <Stack spacing={2}>
          <Typography variant="cardTitle">Price</Typography>
          <Stats title={"ApeUSD Price"} value={"$" + toDigits(apeUsdMarket?.usdPrice || "0", 2)} />
          <Stats title={"APE Price"} value={"$" + toDigits(apeMarket?.usdPrice || "0", 2)} />
        </Stack>
      </Stack>
    </Card>
  );
};

export default Lending;
