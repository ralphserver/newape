import { LoadingButton } from "@mui/lab";
import { Button, Card, Stack, Typography, Slider, Grid } from "@mui/material";
import BN from "bignumber.js";
import { BigNumber } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import React, { useMemo, useState } from "react";
import AmountInput from "../../components/AmountInput";
import RiskLabel from "../../components/RiskLabel";
import { Stats } from "../../components/Stats";
import Text from "../../components/Text";
import config from "../../config";
import { LendingType } from "../../constants";
import { ApeCoin, ApeUsd } from "../../constants/tokens";
import useBorrow from "../../hooks/useBorrow";
import useErc20Allowance from "../../hooks/useErc20Allowance";
import useErc20Balance from "../../hooks/useErc20Balance";
import { useApeMarket, useApeUsdMarket } from "../../hooks/useMarket";
import useUserMarketStats from "../../hooks/useUserMarketStats";
import { valueChange } from "../../utils/misc";
import { commify, toDigits, toPercent } from "../../utils/number";
import { StepCircle, StepLine } from "../../components/StepIndicator";

interface BorrowCardProps {
  type: LendingType;
  setType: (type: LendingType) => void;
}

const BorrowCard = ({ type, setType }: BorrowCardProps): JSX.Element => {
  const [apeCoinInputAmount, setApeCoinInputAmount] = useState("");
  const [apeUsdInputAmount, setApeUsdInputAmount] = useState("");

  const { balance: apeBalance, displayBalance: apeDisplayBalance } = useErc20Balance(ApeCoin.address);
  const { allowance, enoughAllowance, approveMax, isApproving } = useErc20Allowance(
    ApeCoin.address,
    config.protocol.cTokenHelper,
  );
  const {
    borrowLimitUsed,
    borrowLeft,
    liquidationPrice,
    getNewBorrowLimitUsed,
    getNewLiquidationPrice,
    getNewBorrowLeft,
  } = useUserMarketStats();
  const { data: apeMarket } = useApeMarket();
  const { data: apeUsdMarket } = useApeUsdMarket();

  const apeCoinParsedAmount = parseUnits(apeCoinInputAmount || "0", ApeCoin.decimals);
  const apeUsdParsedAmount = parseUnits(apeUsdInputAmount || "0", ApeUsd.decimals);

  const { borrow, isLoading: isBorrowing } = useBorrow(apeCoinParsedAmount, apeUsdParsedAmount);

  const liquidationPriceChange = useMemo(() => {
    const newLiquidationPrice = getNewLiquidationPrice(apeCoinParsedAmount, apeUsdParsedAmount, "borrow");
    if (liquidationPrice === undefined || newLiquidationPrice === undefined) return;

    const oldValue = `$${toDigits(liquidationPrice, 2)}`;
    const newValue = `$${toDigits(newLiquidationPrice, 2)}`;
    return valueChange(oldValue, newValue);
  }, [apeCoinParsedAmount, apeUsdParsedAmount, getNewLiquidationPrice, liquidationPrice]);

  const borrowLimitChange = useMemo(() => {
    const newBorrowLeft = getNewBorrowLeft(apeCoinParsedAmount, apeUsdParsedAmount, "borrow");
    if (!borrowLeft || !newBorrowLeft) return;

    const oldValue = `$${commify(borrowLeft.toFixed(2, BN.ROUND_DOWN))}`;
    const newValue = `$${commify(newBorrowLeft.toFixed(2, BN.ROUND_DOWN))}`;
    return valueChange(oldValue, newValue);
  }, [apeCoinParsedAmount, apeUsdParsedAmount, borrowLeft, getNewBorrowLeft]);

  const newBorrowLimitUsed = useMemo(() => {
    return getNewBorrowLimitUsed(apeCoinParsedAmount, apeUsdParsedAmount, "borrow");
  }, [apeCoinParsedAmount, apeUsdParsedAmount, getNewBorrowLimitUsed]);

  const borrowLimitUsedChange = useMemo(() => {
    if (borrowLimitUsed === undefined || newBorrowLimitUsed === undefined) return;

    const oldValue = toPercent(borrowLimitUsed, 2);
    const newValue = toPercent(newBorrowLimitUsed, 2);
    return valueChange(oldValue, newValue);
  }, [borrowLimitUsed, newBorrowLimitUsed]);

  const getBorrowFee = () => {
    if (!apeUsdMarket) return new BN(0);
    return new BN(apeUsdInputAmount || 0).multipliedBy(apeUsdMarket.borrowFee);
  };

  const availableApeUsd = useMemo(() => {
    if (!apeUsdMarket) return;

    const remainingBorrow = apeUsdMarket.borrowCap.sub(apeUsdMarket.borrow);
    const cash = apeUsdMarket.cash;

    const available = remainingBorrow.lt(cash) && !remainingBorrow.isNegative() ? remainingBorrow : cash;
    return new BN(formatUnits(available, ApeUsd.decimals));
  }, [apeUsdMarket]);

  const leftToBorrow = useMemo(() => {
    const userLeft = getNewBorrowLeft(apeCoinParsedAmount, BigNumber.from(0), "borrow");
    const marketLeft = availableApeUsd;

    if (!userLeft || !marketLeft) return;

    return userLeft.lt(marketLeft) ? userLeft : marketLeft;
  }, [apeCoinParsedAmount, availableApeUsd, getNewBorrowLeft]);

  const receiveAmount = useMemo(() => {
    const borrowFee = getBorrowFee();
    return new BN(apeUsdInputAmount || 0).minus(borrowFee);
  }, [apeUsdInputAmount, getBorrowFee]);

  const isBorrowReady = () => {
    // not enough allowance
    if (!allowance || !enoughAllowance(apeCoinParsedAmount)) return false;
    // no more borrow left
    if (!leftToBorrow || leftToBorrow.lt(apeUsdInputAmount || 0)) return false;
    // not enough balance
    if (!apeBalance || apeBalance.lt(apeCoinParsedAmount)) return false;
    if (apeCoinParsedAmount.lt(0) || apeUsdParsedAmount.lt(0)) return false;

    return apeCoinParsedAmount.gt(0) || apeUsdParsedAmount.gt(0);
  };

  const buttonColor = (value: LendingType) => (type === value ? "link.active" : "link.inactive");
  const marks = [
    {
      value: 0,
      label: "0%",
    },
    {
      value: 25,
      label: "25%",
    },
    {
      value: 50,
      label: "50%",
    },
    {
      value: 75,
      label: "75%",
    },
    {
      value: 100,
      label: "100%",
    },
  ];

  const buttonText = () => {
    if (!!apeCoinInputAmount && !apeUsdInputAmount) return "Deposit";
    if (!apeCoinInputAmount && !!apeUsdInputAmount) return "Borrow";
    return "Deposit & Borrow";
  };

  return (
    <Card sx={{ p: "30px", minWidth: 360 }}>
      <Stack spacing={3}>
        <Stack direction="row" spacing={2}>
          <Button sx={{ py: 0 }} disabled={type === "borrow"} onClick={() => setType("borrow")}>
            <Typography variant="cardTitle" color={buttonColor("borrow")}>
              Borrow
            </Typography>
          </Button>
          <Button sx={{ py: 0 }} disabled={type === "repay"} onClick={() => setType("repay")}>
            <Typography variant="cardTitle" color={buttonColor("repay")}>
              Repay
            </Typography>
          </Button>
        </Stack>

        <Stack spacing={2}>
          <Typography color="text.title" fontWeight="600">
            Deposit APE
          </Typography>
          <AmountInput
            max={apeBalance && new BN(formatUnits(apeBalance, ApeCoin.decimals)).toFixed(2, BN.ROUND_DOWN)}
            value={apeCoinInputAmount}
            usdRate={apeMarket?.usdPrice}
            token={ApeCoin}
            onChange={setApeCoinInputAmount}
          />
          <Text color="text.title">
            Wallet Balance:{" "}
            <Text component="span" fontWeight="600" color="text.primary">
              {commify(new BN(apeDisplayBalance || 0).toFixed(2, BN.ROUND_DOWN))} APE
            </Text>
          </Text>
        </Stack>
        <Stack gap={2}>
          <Stack direction="row" sx={{ justifyContent: "space-between" }}>
            <Typography color="text.title" fontWeight="600">
              Borrow ApeUSD
            </Typography>
            {leftToBorrow && (
              <Typography fontWeight="600">{`ApeUSD left to borrow: ${toDigits(
                leftToBorrow.toFixed(2, BN.ROUND_DOWN),
                2,
              )}`}</Typography>
            )}
          </Stack>
          <AmountInput
            value={apeUsdInputAmount}
            usdRate={apeUsdMarket?.usdPrice}
            token={ApeUsd}
            onChange={setApeUsdInputAmount}
          />
          <Slider
            getAriaValueText={(v: number) => `${v}%`}
            value={
              (leftToBorrow && new BN(apeUsdInputAmount || 0).dividedBy(leftToBorrow).multipliedBy(100).toNumber()) || 0
            }
            marks={marks}
            onChange={(_, v) => {
              if (typeof v === "number") {
                if (!leftToBorrow) return;
                const amount = leftToBorrow.multipliedBy(v).dividedBy(100).toFixed(2, BN.ROUND_DOWN);
                setApeUsdInputAmount(amount);
              }
            }}
          />
        </Stack>
        <Stack spacing={2}>
          <Stats title="Borrow Fee" value={`${toDigits(getBorrowFee(), 6)} ApeUSD`} />
          <Stats title="You will receive" value={`${commify(receiveAmount.toFixed(6, BN.ROUND_DOWN))} ApeUSD`} />
          <Stats
            title="Estimated Liquidation Price"
            value={liquidationPriceChange || "-"}
            isLoading={!liquidationPriceChange}
            userStat
          />
          <Stats title="Borrow Limit" value={borrowLimitChange || "-"} isLoading={!borrowLimitChange} userStat />
          <Stack direction="row" sx={{ display: "flex" }} spacing={1}>
            <Stats
              title="Borrow Limit Used"
              value={borrowLimitUsedChange || "-"}
              isLoading={!borrowLimitUsedChange}
              userStat
              sx={{ flexGrow: 1 }}
            />
            {newBorrowLimitUsed !== undefined && <RiskLabel risk={newBorrowLimitUsed} />}
          </Stack>
        </Stack>

        <Grid container columns={{ xs: 13, sm: 11 }}>
          <Grid item xs={3} sm={2} />
          <Grid item xs={7} sm={7}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
              <StepCircle>1</StepCircle>
              <StepLine></StepLine>
              <StepCircle>2</StepCircle>
            </Stack>
          </Grid>
          <Grid item xs={6} sm={4}>
            <LoadingButton
              variant="secondary"
              onClick={() => approveMax()}
              disabled={!allowance || enoughAllowance(apeCoinParsedAmount)}
              loading={isApproving}
              sx={{ width: "100%" }}
            >
              Approve
            </LoadingButton>
          </Grid>
          <Grid item xs={1} sm={3} />
          <Grid item xs={6} sm={4}>
            <LoadingButton
              variant="secondary"
              onClick={() =>
                borrow(undefined, {
                  onSuccess: () => {
                    setApeCoinInputAmount("");
                    setApeUsdInputAmount("");
                  },
                })
              }
              disabled={!isBorrowReady()}
              loading={isBorrowing}
              sx={{ width: "100%" }}
            >
              {buttonText()}
            </LoadingButton>
          </Grid>
        </Grid>
      </Stack>
    </Card>
  );
};

export default BorrowCard;
