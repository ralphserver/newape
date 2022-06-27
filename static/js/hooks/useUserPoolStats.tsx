import BN from "bignumber.js";
import { formatUnits } from "ethers/lib/utils";
import { useQuery } from "react-query";
import { Pool } from "../config";
import { StakingRewards__factory } from "../contracts/types";
import { getUsdPrice } from "./useUsdPrice";
import useWallet from "./useWallet";

export const userPoolQueryKey = "user-pool";

type UserPoolStat = {
  staked: BN;
  stakedUsdValue: number;
  claimable: {
    amount: BN;
    symbol: string;
  };
};

const useUserPoolStats = (pool: Pool) => {
  const { walletAddress, provider } = useWallet();

  const stakingReward = StakingRewards__factory.connect(pool.rewardContract, provider);

  const { data, isLoading } = useQuery<UserPoolStat | undefined>(
    [userPoolQueryKey, pool.name, walletAddress],
    async () => {
      if (!walletAddress) return;

      const balance = await stakingReward.balanceOf(walletAddress);
      const earned = await stakingReward.earned(pool.claimables[0].address, walletAddress);
      const lpUsePrice = await getUsdPrice(pool.lp.address, provider);

      const staked = new BN(formatUnits(balance, pool.lp.decimals));
      const stakedUsdValue = staked.multipliedBy(lpUsePrice).toNumber();

      return {
        staked,
        stakedUsdValue,
        claimable: {
          amount: new BN(formatUnits(earned, pool.claimables[0].decimals)),
          symbol: pool.claimables[0].symbol,
        },
      };
    },
    { enabled: !!walletAddress, refetchInterval: 30 * 1000 },
  );

  return {
    data,
    isLoading,
  };
};

export default useUserPoolStats;
