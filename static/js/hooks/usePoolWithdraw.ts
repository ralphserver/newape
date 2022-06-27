import { BigNumber } from "ethers";
import { useMutation, useQueryClient } from "react-query";
import { StakingRewards__factory } from "../contracts/types";
import useAlert from "./useAlert";
import { userPoolQueryKey } from "./useUserPoolStats";
import useWallet from "./useWallet";

const usePoolWithdraw = (stakingAddress: string) => {
  const { signer } = useWallet();
  const { setAlert } = useAlert();
  const queryClient = useQueryClient();

  const contract = StakingRewards__factory.connect(stakingAddress, signer);

  const { mutate, isLoading } = useMutation(
    async (amount: BigNumber) => {
      const tx = await contract.withdraw(amount);
      await tx.wait();
    },
    {
      onSuccess: () => {
        setAlert({ msg: "Withdraw succeed.", severity: "success" });
        queryClient.invalidateQueries(userPoolQueryKey);
      },
      onError: () => setAlert({ msg: "Withdraw failed", severity: "error" }),
    },
  );

  return {
    withdraw: mutate,
    isLoading,
  };
};

export default usePoolWithdraw;
