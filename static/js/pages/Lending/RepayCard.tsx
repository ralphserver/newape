import { LoadingButton } from "@mui/lab";
import { Button, Card, Stack, Typography, Grid } from "@mui/material";
import { ethers } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import React, { useMemo, useState } from "react";
import AmountInput from "../../components/AmountInput";
import RiskLabel from "../../components/RiskLabel";
import { Stats } from "../../components/Stats";
import Text from "../../components/Text";
import config from "../../config";
import { LendingType } from "../../constants";
import { ApeCoin, ApeUsd } from "../../constants/tokens";
import useErc20Allowance from "../../hooks/useErc20Allowance";
import useErc20Balance from "../../hooks/useErc20Balance";
import { useApeMarket, useApeUsdMarket } from "../../hooks/useMarket";
import useRepay from "../../hooks/useRepay";
import useUserMarketStats from "../../hooks/useUserMarketStats";
import { valueChange } from "../../utils/misc";
import { commify, toDigits, toPercent } from "../../utils/number";
import styled from "@emotion/styled";
import BN from "bignumber.js";
import { StepCircle, StepLine } from "../../components/StepIndicator";
interface BorrowCardProps {
  type: LendingType;
  setType: (type: LendingType) => void;
}

const BorrowCard = ({ type, setType }: BorrowCardProps): JSX.Element => {
  const [apeCoinInputAmount, setApeCoinInputAmount] = useState("");
  const [apeUsdInputAmount, setApeUsdInputAmount] = useState("");

  const { balance: apeUsdBalance, displayBalance: apeUsdDisplayBalance } = useErc20Balance(ApeUsd.address);
  const { allowance, enoughAllowance, approveMax, isApproving } = useErc20Allowance(
    ApeUsd.address,
    config.protocol.cTokenHelper,
  );
  const {
    apeUsdBorrowed,
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

  const { repay, isLoading: isRepaying } = useRepay();

  const liquidationPriceChange = useMemo(() => {
    const newLiquidationPrice = getNewLiquidationPrice(apeCoinParsedAmount, apeUsdParsedAmount, "repay");
    if (!liquidationPrice || !newLiquidationPrice) return;

    const oldValue = `$${toDigits(liquidationPrice, 2)}`;
    const newValue = `$${toDigits(newLiquidationPrice, 2)}`;
    return valueChange(oldValue, newValue);
  }, [apeCoinParsedAmount, apeUsdParsedAmount, getNewLiquidationPrice, liquidationPrice]);

  const borrowLimitChange = useMemo(() => {
    const newBorrowLeft = getNewBorrowLeft(apeCoinParsedAmount, apeUsdParsedAmount, "repay");
    if (!borrowLeft || !newBorrowLeft) return;

    const oldValue = `$${commify(borrowLeft.toFixed(2, BN.ROUND_DOWN))}`;
    const newValue = `$${commify(newBorrowLeft.toFixed(2, BN.ROUND_DOWN))}`;
    return valueChange(oldValue, newValue);
  }, [apeCoinParsedAmount, apeUsdParsedAmount, borrowLeft, getNewBorrowLeft]);

  const newBorrowLimitUsed = useMemo(() => {
    return getNewBorrowLimitUsed(apeCoinParsedAmount, apeUsdParsedAmount, "repay");
  }, [apeCoinParsedAmount, apeUsdParsedAmount, getNewBorrowLimitUsed]);

  const borrowLimitUsedChange = useMemo(() => {
    if (borrowLimitUsed === undefined || newBorrowLimitUsed === undefined) return;

    const oldValue = toPercent(borrowLimitUsed, 2);
    const newValue = toPercent(newBorrowLimitUsed, 2);
    return valueChange(oldValue, newValue);
  }, [borrowLimitUsed, newBorrowLimitUsed]);

  const isRepayReady = () => {
    // not enough allowance
    if (!allowance || !enoughAllowance(apeUsdParsedAmount)) return false;
    // not enough balance
    if (!apeUsdBalance || apeUsdBalance.lt(apeUsdParsedAmount)) return false;
    if (newBorrowLimitUsed && newBorrowLimitUsed >= 1 && apeCoinParsedAmount.gt(0)) return false;
    if (apeCoinParsedAmount.lt(0) || apeUsdParsedAmount.lt(0)) return false;

    return apeCoinParsedAmount.gt(0) || apeUsdParsedAmount.gt(0);
  };

  const buttonColor = (value: LendingType) => (type === value ? "link.active" : "link.inactive");

  const buttonText = () => {
    if (!!apeCoinInputAmount && !apeUsdInputAmount) return "Withdraw";
    if (!apeCoinInputAmount && !!apeUsdInputAmount) return "Repay";
    return "Repay & Withdraw";
  };

  const repayMax = () => {
    if (!apeUsdBorrowed || !apeUsdDisplayBalance) return;

    if (apeUsdBorrowed.gt(apeUsdDisplayBalance)) {
      return new BN(apeUsdDisplayBalance).toFixed(2, BN.ROUND_DOWN);
    } else {
      return apeUsdBorrowed.toFixed(2, BN.ROUND_UP);
    }
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
          <Stack direction="row" sx={{ justifyContent: "space-between" }}>
            <Typography color="text.title" fontWeight="600">
              Repay ApeUSD
            </Typography>
            {apeUsdBorrowed && (
              <Typography fontWeight="600">{`ApeUSD borrowed: ${commify(
                apeUsdBorrowed.toFixed(2, BN.ROUND_UP),
              )}`}</Typography>
            )}
          </Stack>
          <AmountInput
            value={apeUsdInputAmount}
            usdRate={apeUsdMarket?.usdPrice}
            token={ApeUsd}
            max={repayMax()}
            onChange={setApeUsdInputAmount}
          />
          <Text color="text.title">
            Wallet Balance:{" "}
            <Text component="span" fontWeight="600" color="text.primary">
              {commify(new BN(apeUsdDisplayBalance || 0).toFixed(2, BN.ROUND_DOWN))} ApeUSD
            </Text>
          </Text>
        </Stack>
        <Stack gap={2}>
          <Typography color="text.title" fontWeight="600">
            Withdraw APE
          </Typography>
          <AmountInput
            value={apeCoinInputAmount}
            usdRate={apeMarket?.usdPrice}
            token={ApeCoin}
            onChange={setApeCoinInputAmount}
          />
        </Stack>
        <Stack spacing={2}>
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
              disabled={!allowance || enoughAllowance(apeUsdParsedAmount)}
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
              onClick={() => {
                let repayAmount = apeUsdParsedAmount;
                if (apeUsdBorrowed && apeUsdBorrowed.lte(apeUsdInputAmount)) {
                  repayAmount = ethers.constants.MaxUint256;
                }
                repay(
                  { repayAmount, redeemAmount: apeCoinParsedAmount },
                  {
                    onSuccess: () => {
                      setApeCoinInputAmount("");
                      setApeUsdInputAmount("");
                    },
                  },
                );
              }}
              disabled={!isRepayReady()}
              loading={isRepaying}
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
