import { BigNumber } from "ethers";
import { useMutation } from "react-query";
import config from "../config";
import { apApe, apApeUsd } from "../constants/tokens";
import { CTokenHelper__factory } from "../contracts/types";
import useAlert from "./useAlert";
import useWallet from "./useWallet";

const useBorrow = (mintAmount: BigNumber, borrowAmount: BigNumber) => {
  const { signer } = useWallet();
  const { setAlert } = useAlert();

  const helper = CTokenHelper__factory.connect(config.protocol.cTokenHelper, signer);

  const { mutate, isLoading } = useMutation(
    async () => {
      const tx = await helper.mintBorrow(apApe.address, mintAmount, apApeUsd.address, borrowAmount);
      await tx.wait();
    },
    {
      onSuccess: () => {
        setAlert({ msg: "Borrow succeed.", severity: "success" });
      },
      onError: () => setAlert({ msg: "Borrow failed", severity: "error" }),
    },
  );

  return {
    borrow: mutate,
    isLoading,
  };
};

export default useBorrow;
