import { formatUnits, parseUnits } from "ethers/lib/utils";
import { useMemo } from "react";
import { useQuery } from "react-query";
import config from "../config";
import { Comptroller__factory } from "../contracts/types";
import useWallet from "./useWallet";

const useLiquidationFee = () => {
  const { provider } = useWallet();

  const comptroller = useMemo(() => {
    return Comptroller__factory.connect(config.protocol.comptroller, provider);
  }, [provider]);

  const { data, isLoading } = useQuery("liquidation-incentive", async () => {
    const incentive = await comptroller.liquidationIncentiveMantissa();
    return Number(formatUnits(incentive.sub(parseUnits("1", 18)), 18));
  });

  return {
    data,
    isLoading,
  };
};

export default useLiquidationFee;
