import BN from "bignumber.js";
import { formatUnits } from "ethers/lib/utils";
import { useMutation, useQuery } from "react-query";
import config from "../config";
import { StakingRewardsHelper__factory } from "../contracts/types";
import useAlert from "./useAlert";
import useWallet from "./useWallet";
import { getUsdPrice } from "./useUsdPrice";

const useEarnClaimables = () => {
  const { walletAddress, signer, provider } = useWallet();
  const { setAlert } = useAlert();

  const helper = StakingRewardsHelper__factory.connect(config.earn.helper, signer);

  const {
    data: totalStaked,
  } = useQuery(
    ["earn-totalStaked", walletAddress],
   async () => {
     if (!walletAddress) {
       throw new Error("not connected");
     }

     const userStakedList = await helper.getUserStaked(walletAddress);
     const totalStaked = await userStakedList.reduce(async (prePromise, { stakingTokenAddress, balance }) => {
       const preValue = await prePromise;
       const usdPrice = await getUsdPrice(stakingTokenAddress, provider);
       return preValue.plus(new BN(formatUnits(balance, 18)).multipliedBy(usdPrice));
     }, Promise.resolve(new BN(0)));

     return totalStaked;
   },
   { enabled: !!walletAddress, refetchInterval: 10 * 1000 },
  );

  const {
    data: claimable,
    isLoading: isLoadingClaimable,
    refetch,
  } = useQuery(
    ["earn-claimables", walletAddress],
    async () => {
      if (!walletAddress) throw new Error("not connected");

      const [apeFiReward] = await helper.getUserClaimableRewards(walletAddress, [config.protocol.apeFi]);

      return {
        apeFi: new BN(formatUnits(apeFiReward.amount, 18)),
      };
    },
    { enabled: !!walletAddress, refetchInterval: 10 * 1000 },
  );

  const { mutate: claimReward, isLoading: isClaimingReward } = useMutation(
    async () => {
      const rewardContracts = config.earn.pools.map((p) => p.rewardContract);
      const tx = await helper.claimRewards(rewardContracts);
      await tx.wait();
    },
    {
      onSuccess: () => {
        setAlert({ msg: "Claim succeed.", severity: "success" });
        refetch();
      },
      onError: () => setAlert({ msg: "Claim failed", severity: "error" }),
    },
  );

  return {
    claimable,
    isLoadingClaimable,
    claimReward,
    isClaimingReward,
    totalStaked,
  };
};

export default useEarnClaimables;
