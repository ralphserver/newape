import BN from "bignumber.js";
import { BigNumber } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { useMemo } from "react";
import { LendingType } from "../constants";
import { apApe, apApeUsd, ApeCoin, ApeUsd } from "../constants/tokens";
import { CErc20__factory } from "../contracts/types";
import useBlockchainQuery from "./useBlockchainQuery";
import useErc20Balance from "./useErc20Balance";
import { useApeMarket, useApeUsdMarket } from "./useMarket";
import useWallet from "./useWallet";

export type UserMarketStats = {
  apeCoinDeposited?: BN;
  apeCoinDepositedInUsd?: BN;
  apeUsdBorrowed?: BN;
  apeUsdBorrowedInUsd?: BN;
  liquidationPrice?: number;
  borrowLimit?: BN;
  borrowLimitUsed?: number;
  borrowLeft?: BN;
  getNewBorrowLimit: (apeCoinAmount: BigNumber, type: LendingType) => BN | undefined;
  getNewBorrowLimitUsed: (apeCoinAmount: BigNumber, apeUsdAmount: BigNumber, type: LendingType) => number | undefined;
  getNewBorrowLeft: (apeCoinAmount: BigNumber, apeUsdAmount: BigNumber, type: LendingType) => BN | undefined;
  getNewLiquidationPrice: (
    _apeCoinAmount: BigNumber,
    _apeUsdAmount: BigNumber,
    type: LendingType,
  ) => number | undefined;
};

const useUserMarketStats = (): UserMarketStats => {
  const { walletAddress, provider } = useWallet();
  const { data: apeMarket } = useApeMarket();
  const { data: apeUsdMarket } = useApeUsdMarket();
  const { balance: apApeBalance } = useErc20Balance(apApe.address);

  const apToken = useMemo(() => {
    return CErc20__factory.connect(apApeUsd.address, provider);
  }, [provider]);

  const { data: borrowBalance } = useBlockchainQuery(
    ["borrowBalance", apApeUsd.address, walletAddress],
    async () => {
      return await apToken.borrowBalanceStored(walletAddress || "");
    },
    { enabled: !!walletAddress },
  );

  const apeCoinDeposited = useMemo(() => {
    if (!apApeBalance || !apeMarket) return;
    const apeBalance = apApeBalance.mul(apeMarket.exchangeRate);
    return new BN(formatUnits(apeBalance, ApeCoin.decimals + 18));
  }, [apApeBalance, apeMarket]);

  const apeCoinDepositedInUsd = useMemo(() => {
    if (!apeCoinDeposited || !apeMarket) return;
    return apeCoinDeposited.multipliedBy(apeMarket.usdPrice);
  }, [apeCoinDeposited, apeMarket]);

  const apeUsdBorrowed = useMemo(() => {
    if (!borrowBalance) return;
    return new BN(formatUnits(borrowBalance, ApeUsd.decimals));
  }, [borrowBalance]);

  const apeUsdBorrowedInUsd = useMemo(() => {
    if (!apeUsdBorrowed || !apeUsdMarket) return;
    return apeUsdBorrowed.multipliedBy(apeUsdMarket.usdPrice);
  }, [apeUsdBorrowed, apeUsdMarket]);

  const borrowLimit = useMemo(() => {
    return apeCoinDepositedInUsd?.multipliedBy("0.6");
  }, [apeCoinDepositedInUsd]);

  const borrowLimitUsed = useMemo(() => {
    if (!apeUsdBorrowed || !borrowLimit) return;
    if (borrowLimit.isZero()) return 0;
    return apeUsdBorrowed.dividedBy(borrowLimit).toNumber();
  }, [apeUsdBorrowed, borrowLimit]);

  const getNewBorrowLimit = (apeCoinAmount: BigNumber, type: LendingType) => {
    if (!borrowLimit || !apeMarket) return;

    const amountInUsd = new BN(formatUnits(apeCoinAmount, ApeCoin.decimals))
      .multipliedBy(apeMarket.usdPrice)
      .multipliedBy("0.6");
    if (type === "borrow") {
      return borrowLimit.plus(amountInUsd);
    } else {
      const limit = borrowLimit.minus(amountInUsd);
      return limit.isNegative() ? new BN(0) : limit;
    }
  };

  const getNewBorrowLimitUsed = (apeCoinAmount: BigNumber, apeUsdAmount: BigNumber, type: LendingType) => {
    const limit = getNewBorrowLimit(apeCoinAmount, type);

    if (!limit || !apeUsdBorrowed) return;

    const amount = formatUnits(apeUsdAmount, ApeUsd.decimals);
    const newBorrowed = type === "borrow" ? apeUsdBorrowed.plus(amount) : apeUsdBorrowed.minus(amount);

    if (newBorrowed.gt(limit)) return 1;
    if (limit.isZero()) return 0;

    const used = newBorrowed.dividedBy(limit).toNumber();
    return used < 0 ? 0 : used;
  };

  const liquidationPrice = useMemo(() => {
    if (!apeCoinDepositedInUsd || !apeUsdBorrowed || !apeMarket) return;
    if (apeCoinDepositedInUsd.isZero()) return 0;
    return (
      (apeUsdBorrowed.toNumber() / (apeCoinDepositedInUsd.toNumber() * apeMarket.collateralFactor)) * apeMarket.usdPrice
    );
  }, [apeCoinDepositedInUsd, apeMarket, apeUsdBorrowed]);

  const getNewLiquidationPrice = (_apeCoinAmount: BigNumber, _apeUsdAmount: BigNumber, type: LendingType) => {
    if (!apeUsdBorrowed || !apeCoinDepositedInUsd || !apeMarket) return;

    const apeCoinAmount = formatUnits(_apeCoinAmount, ApeCoin.decimals);
    const apeUsdAmount = formatUnits(_apeUsdAmount, ApeUsd.decimals);

    const apeCoinAmountInUsd = new BN(apeCoinAmount).multipliedBy(apeMarket.usdPrice);

    const deposited =
      type === "borrow"
        ? apeCoinDepositedInUsd.plus(apeCoinAmountInUsd)
        : apeCoinDepositedInUsd.minus(apeCoinAmountInUsd);
    const borrowed = type === "borrow" ? apeUsdBorrowed.plus(apeUsdAmount) : apeUsdBorrowed.minus(apeUsdAmount);

    if (deposited.isZero()) {
      return 0;
    } else {
      const price = (borrowed.toNumber() / (deposited.toNumber() * apeMarket.collateralFactor)) * apeMarket.usdPrice;
      return price >= 0 ? price : 0;
    }
  };

  const borrowLeft = useMemo(() => {
    if (!borrowLimit || !apeUsdBorrowed || !apeMarket) return;

    const left = borrowLimit.minus(apeUsdBorrowed);
    return left.isNegative() ? new BN(0) : left;
  }, [apeMarket, apeUsdBorrowed, borrowLimit]);

  const getNewBorrowLeft = (_apeCoinAmount: BigNumber, _apeUsdAmount: BigNumber, type: LendingType) => {
    const newBorrowLimit = getNewBorrowLimit(_apeCoinAmount, type);
    if (!newBorrowLimit || !apeUsdBorrowed || !apeMarket) return;

    const apeUsdAmount = formatUnits(_apeUsdAmount, ApeUsd.decimals);
    const newBorrowed = type === "borrow" ? apeUsdBorrowed.plus(apeUsdAmount) : apeUsdBorrowed.minus(apeUsdAmount);

    const left = newBorrowLimit.minus(newBorrowed);
    return left.isNegative() ? new BN(0) : left;
  };

  return {
    apeCoinDeposited,
    apeCoinDepositedInUsd,
    apeUsdBorrowed,
    apeUsdBorrowedInUsd,
    liquidationPrice,
    borrowLimit,
    borrowLimitUsed,
    borrowLeft,
    getNewBorrowLimit,
    getNewBorrowLimitUsed,
    getNewLiquidationPrice,
    getNewBorrowLeft,
  };
};

export default useUserMarketStats;
