import { BigNumber, ethers } from "ethers";
import { useMemo, useState } from "react";
import { useMutation } from "react-query";
import { Erc20__factory } from "../contracts/types";
import useBlockchainQuery from "./useBlockchainQuery";
import useAlert from "./useAlert";
import useWallet from "./useWallet";

const useErc20Allowance = (erc20Address: string, spender: string) => {
  const { walletAddress, provider, signer } = useWallet();
  const [allowance, setAllowance] = useState<BigNumber>();
  const { setAlert } = useAlert();

  const erc20 = useMemo(() => {
    return Erc20__factory.connect(erc20Address, provider);
  }, [erc20Address, provider]);

  const { refetch } = useBlockchainQuery(
    ["erc20-allowance", erc20Address, walletAddress, spender],
    async () => {
      if (!walletAddress) return;
      return await erc20.allowance(walletAddress, spender);
    },
    {
      enabled: !!walletAddress,
      onSuccess: setAllowance,
      onError: () => setAllowance(undefined),
    },
  );

  const { isLoading: isApproving, mutate: approveMax } = useMutation(
    async () => {
      const tx = await erc20.connect(signer).approve(spender, ethers.constants.MaxUint256);
      await tx.wait();
    },
    {
      onSuccess: () => {
        setAlert({ msg: "Approve succeed.", severity: "success" });
        refetch();
      },
      onError: () => setAlert({ msg: "Approve failed", severity: "error" }),
    },
  );

  const enoughAllowance = (value: BigNumber) => {
    if (!allowance) return false;
    return value.lte(allowance);
  };

  return {
    allowance,
    enoughAllowance,
    approveMax,
    isApproving,
  };
};

export default useErc20Allowance;
