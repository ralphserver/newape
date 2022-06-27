import BN from "bignumber.js";
import { formatUnits } from "ethers/lib/utils";
import { useQuery } from "react-query";
import { Pool } from "../config";
import { StakingRewards__factory } from "../contracts/types";
import { getUsdPrice } from "./useUsdPrice";
import useWallet from "./useWallet";

type PoolInfo = Pool & {
  apr: number;
  tvl: BN; // in usd
};

const usePool = (pool: Pool) => {
  const { provider } = useWallet();
  const stakingReward = StakingRewards__factory.connect(pool.rewardContract, provider);

  const { data, isLoading } = useQuery<PoolInfo>(["pool", pool.name], async () => {
    const totalSupply = await stakingReward.totalSupply();
    const lpPrice = await getUsdPrice(pool.lp.address, provider);

    const tvl = new BN(formatUnits(totalSupply, pool.lp.decimals)).multipliedBy(lpPrice);

    let usdValue = new BN(0);
    for (const claimable of pool.claimables) {
      const price = await getUsdPrice(claimable.address, provider);
      const rewardRates = await stakingReward.getRewardRate(claimable.address);

      usdValue = new BN(formatUnits(rewardRates, claimable.decimals)).multipliedBy(price).plus(usdValue);
    }
    const annualized = usdValue.multipliedBy(365 * 24 * 3600);
    const apr = totalSupply.isZero()
      ? 0
      : annualized.dividedBy(formatUnits(totalSupply, pool.lp.decimals)).dividedBy(lpPrice).toNumber();

    return {
      ...pool,
      apr,
      tvl,
    };
  });

  return {
    data,
    isLoading,
  };
};

export default usePool;
