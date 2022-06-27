import { useMemo } from "react";
import { useQuery } from "react-query";
import { Erc20__factory } from "../contracts/types";
import useWallet from "./useWallet";

export type Erc20 = {
  address: string;
  decimals: number;
  symbol: string;
};

const useErc20 = (erc20Address: string) => {
  const { provider } = useWallet();

  const erc20 = useMemo(() => {
    return Erc20__factory.connect(erc20Address, provider);
  }, [erc20Address, provider]);

  const { data, isLoading } = useQuery<Erc20>(
    ["erc20", erc20Address],
    async () => {
      return {
        address: erc20Address,
        decimals: await erc20.decimals(),
        symbol: await erc20.symbol(),
      };
    },
    {
      staleTime: Infinity,
    },
  );

  return {
    data,
    isLoading,
  };
};

export default useErc20;
