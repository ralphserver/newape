import { LoadingButton } from "@mui/lab";
import { Stack, Button, Typography, Grid, Skeleton } from "@mui/material";
import BN from "bignumber.js";
import { parseUnits } from "ethers/lib/utils";
import React, { useState } from "react";
import AmountInput from "../components/AmountInput";
import styled from "@emotion/styled";
import { Pool } from "../config";
import { ApeCoin } from "../constants/tokens";
import useErc20Allowance from "../hooks/useErc20Allowance";
import useErc20Balance from "../hooks/useErc20Balance";
import usePoolStake from "../hooks/usePoolStake";
import usePoolWithdraw from "../hooks/usePoolWithdraw";
import useUsdPrice from "../hooks/useUsdPrice";
import useUserPoolStats from "../hooks/useUserPoolStats";
import useWallet from "../hooks/useWallet";
import { toDigits } from "../utils/number";
import { shortAddress } from "../utils/web3";
import useMobile from "hooks/useMobile";
import { StepCircle, StepLine } from "./StepIndicator";

const GradientText = styled.span`
  background: linear-gradient(123.35deg, #ebf3d0 0%, rgba(235, 243, 208, 0) 18.4%),
    radial-gradient(29.9% 70.94% at 44.25% 86.96%, #dc8ddc 0%, rgba(220, 141, 220, 0) 100%)
      /* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */,
    radial-gradient(33.83% 53.57% at 35.87% 100%, #dc8ddc 0%, rgba(220, 141, 220, 0) 100%)
      /* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */,
    radial-gradient(42.66% 49.72% at 45.56% 44.65%, #cbadeb 0%, rgba(194, 166, 241, 0) 100%)
      /* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */,
    linear-gradient(134.59deg, #cdf9e8 20.63%, rgba(205, 249, 232, 0) 47.84%),
    linear-gradient(216.44deg, rgba(192, 169, 240, 0) -16.52%, #c0a9f0 -1.04%, rgba(192, 169, 240, 0) 16.99%),
    linear-gradient(128.53deg, rgba(192, 169, 240, 0) 28.63%, #c0a9f0 38.5%, rgba(192, 169, 240, 0) 50.26%),
    radial-gradient(
        40.75% 97.37% at 90.75% 40.15%,
        #fffdb1 0%,
        #fee4bf 34.46%,
        #f0bdd0 69.5%,
        rgba(255, 129, 38, 0) 100%
      )
      /* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */,
    #c2a6f1;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  cursor: pointer;
`;

enum ContentType {
  Stake = "STAKE",
  Withdraw = "WITHDRAW",
  Info = "INFO",
}

interface Info {
  title: string;
  content: string;
  address: string;
}

interface PoolCardContentProps {
  pool: Pool;
}

export const PoolCardContent: React.FC<PoolCardContentProps> = ({ pool }: PoolCardContentProps) => {
  const [contentType, setContentType] = useState<ContentType>(ContentType.Stake);
  const contentTypes = [ContentType.Stake, ContentType.Withdraw, ContentType.Info];
  return (
    <Stack spacing={3}>
      <Stack direction="row" gap={2}>
        {contentTypes.map((t) => {
          return (
            <Button
              key={t}
              sx={{ py: 0 }}
              onClick={(e) => {
                e.stopPropagation();
                setContentType(t);
              }}
            >
              <Typography fontSize="16px" fontWeight="600" color={contentType === t ? "link.active" : "link.inactive"}>
                {t}
              </Typography>
            </Button>
          );
        })}
      </Stack>
      {contentType === ContentType.Stake && <StakeContent pool={pool} />}
      {contentType === ContentType.Withdraw && <WithdrawContent pool={pool} />}
      {contentType === ContentType.Info && <InfoContent pool={pool} />}
    </Stack>
  );
};

const StakeContent = ({ pool }: PoolCardContentProps): JSX.Element => {
  const [lpAmount, setLpAmount] = useState("");
  const { allowance, enoughAllowance, approveMax, isApproving } = useErc20Allowance(
    pool.lp.address,
    pool.rewardContract,
  );
  const {
    balance: lpBalance,
    displayBalance: lpDisplayBalance,
    isLoading: isLoadingBalance,
  } = useErc20Balance(pool.lp.address);
  const { stake, isLoading: isStaking } = usePoolStake(pool.rewardContract);
  const lpParsedAmount = parseUnits(lpAmount || "0", pool.lp.decimals);
  const { price: lpPrice } = useUsdPrice(pool.lp.address);

  const isStakeReady = () => {
    // not enough allowance
    if (!allowance || !enoughAllowance(lpParsedAmount)) return false;
    // not enough balance
    if (!lpBalance || lpBalance.lt(lpParsedAmount)) return false;

    return lpParsedAmount.gt(0);
  };

  const lpBalanceUsdValue = (() => {
    if (!lpDisplayBalance || !lpPrice) return;
    return new BN(lpDisplayBalance).multipliedBy(lpPrice);
  })();
  const isMobile = useMobile();
  return (
    <Grid container gap={4}>
      <Grid item xs={12} md={5}>
        <Typography>
          Deposit liquidity into the{" "}
          <GradientText
            onClick={() => {
              window.open(pool.url);
            }}
          >
            {pool.name}
          </GradientText>
          , and then stake your LP tokens here to earn {pool.claimables[0].symbol}.
        </Typography>
      </Grid>
      {!isMobile && <Grid item md={6} />}
      <Grid item xs={12} md={5}>
        <Stack gap={2}>
          <AmountInput max={lpDisplayBalance} value={lpAmount} maxDecimals={18} onChange={setLpAmount} />
          <Stack direction="row" justifyContent="space-between" gap={2}>
            <Typography color="text.title">Available</Typography>
            <Stack direction="row" gap={1}>
              {isLoadingBalance ? (
                <Skeleton width="100px" />
              ) : (
                <>
                  <Typography>{lpDisplayBalance || "0"} LP</Typography>
                  {lpBalanceUsdValue && (
                    <Typography color="text.title">{`~$${toDigits(lpBalanceUsdValue, 2)} USD`}</Typography>
                  )}
                </>
              )}
            </Stack>
          </Stack>
        </Stack>
      </Grid>
      <Grid item xs={12} md={4}>
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
              disabled={!allowance || enoughAllowance(lpParsedAmount)}
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
              onClick={() => stake(lpParsedAmount)}
              disabled={!isStakeReady()}
              loading={isStaking}
              sx={{ width: "100%" }}
            >
              Stake LP
            </LoadingButton>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

const WithdrawContent = ({ pool }: PoolCardContentProps): JSX.Element => {
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const { data: userPoolStats } = useUserPoolStats(pool);
  const { connected } = useWallet();
  const { withdraw, isLoading: isWithdrawing } = usePoolWithdraw(pool.rewardContract);

  const withdrawParsedAmount = parseUnits(withdrawAmount || "0", pool.lp.decimals);

  const isWithdrawReady = () => {
    if (!userPoolStats || userPoolStats.staked.lt(withdrawAmount)) return false;
    return withdrawParsedAmount.gt(0);
  };

  return (
    <Grid container gap={2}>
      <Grid item xs={12} md={5}>
        <Stack gap={2}>
          <AmountInput
            max={userPoolStats && userPoolStats.staked.toString()}
            value={withdrawAmount}
            onChange={setWithdrawAmount}
            maxDecimals={pool.lp.decimals}
          />
          <Stack direction="row" justifyContent="space-between" gap={2}>
            <Typography color="text.title">Available</Typography>
            {connected ? (
              userPoolStats ? (
                <Typography>{toDigits(userPoolStats.staked, 6)} LP</Typography>
              ) : (
                <Skeleton width="100px" />
              )
            ) : (
              <Typography>0 LP</Typography>
            )}
          </Stack>
        </Stack>
      </Grid>
      <Grid item xs={12} md={2}>
        <LoadingButton
          variant="primary"
          onClick={() => withdraw(withdrawParsedAmount)}
          disabled={!isWithdrawReady()}
          loading={isWithdrawing}
        >
          Withdraw
        </LoadingButton>
      </Grid>
    </Grid>
  );
};

const InfoContent = ({ pool }: PoolCardContentProps): JSX.Element => {
  const infos: Info[] = [
    { title: "LP token address", content: shortAddress(pool.lp.address), address: pool.lp.address },
    { title: "Deposit contract address", content: shortAddress(pool.rewardContract), address: pool.rewardContract },
    {
      title: "Reward contract address",
      content: shortAddress(pool.claimables[0].address),
      address: pool.claimables[0].address,
    },
  ];

  return (
    <Grid container gap={2}>
      <Grid item xs={12} md={5}>
        <Stack gap={2}>
          {infos.map((info) => (
            <Stack key={info.title} direction="row" justifyContent="space-between" gap={2}>
              <Typography color="text.title">{info.title}</Typography>
              <Stack direction="row" gap={1} alignItems="center">
                <Typography>{info.content}</Typography>
                <img
                  width="12"
                  height="12"
                  src="assets/link.svg"
                  alt="link"
                  style={{ cursor: "pointer" }}
                  onClick={async () => {
                    await navigator.clipboard.writeText(info.address);
                  }}
                />
              </Stack>
            </Stack>
          ))}
        </Stack>
      </Grid>
    </Grid>
  );
};
