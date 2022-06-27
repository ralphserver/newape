import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { useMemo } from "react";
import { Erc20__factory } from "../contracts/types";
import useBlockchainQuery from "./useBlockchainQuery";
import useErc20 from "./useErc20";
import useWallet from "./useWallet";

const useErc20Balance = (erc20Address: string) => {
  const { walletAddress, provider } = useWallet();

  const { data: erc20Data, isLoading: isLoadingErc20 } = useErc20(erc20Address);

  const erc20 = useMemo(() => {
    return Erc20__factory.connect(erc20Address, provider);
  }, [erc20Address, provider]);

  const { data: balance, isLoading } = useBlockchainQuery(
    ["erc20-balance", erc20Address, walletAddress],
    async () => {
      if (!walletAddress) return BigNumber.from(0);
      return await erc20.balanceOf(walletAddress);
    },
    { enabled: !isLoadingErc20 && !!walletAddress },
  );

  const displayBalance = balance && formatUnits(balance, erc20Data?.decimals);

  return {
    balance,
    displayBalance,
    isLoading,
  };
};

export default useErc20Balance;
