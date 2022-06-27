import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { useMemo } from "react";
import config from "../config";
import { blocksPerYear } from "../constants";
import { CErc20__factory, CompoundLens__factory } from "../contracts/types";
import useBlockchainQuery from "./useBlockchainQuery";
import useWallet from "./useWallet";

export type MarketData = {
  cash: BigNumber;
  borrow: BigNumber;
  borrowFee: number;
  borrowRate: number;
  exchangeRate: BigNumber;
  usdPrice: number;
  supplyCap: BigNumber;
  borrowCap: BigNumber;
  collateralFactor: number;
  collateralCap: BigNumber;
};

const useMarket = (apTokenAddress: string) => {
  const { provider } = useWallet();

  const apToken = useMemo(() => {
    return CErc20__factory.connect(apTokenAddress, provider);
  }, [apTokenAddress, provider]);

  const lens = useMemo(() => {
    return CompoundLens__factory.connect(config.protocol.lens, provider);
  }, [provider]);

  const { data, isLoading } = useBlockchainQuery(["market", apTokenAddress], async (): Promise<MarketData> => {
    const data = await lens.callStatic.apeTokenMetadata(apTokenAddress);
    const borrowFee = await apToken.borrowFee();

    return {
      cash: data.totalCash,
      borrow: data.totalBorrows,
      borrowFee: Number(formatUnits(borrowFee)),
      borrowRate: Number(formatUnits(data.borrowRatePerBlock)) * blocksPerYear,
      exchangeRate: data.exchangeRateCurrent,
      usdPrice: Number(formatUnits(data.underlyingPrice)),
      supplyCap: data.supplyCap,
      borrowCap: data.borrowCap,
      collateralFactor: Number(formatUnits(data.collateralFactorMantissa)),
      collateralCap: data.collateralCap,
    };
  });

  return {
    data,
    isLoading,
  };
};

export const useApeMarket = () => {
  return useMarket(config.protocol.apApe);
};

export const useApeUsdMarket = () => {
  return useMarket(config.protocol.apApeUsd);
};

export default useMarket;
