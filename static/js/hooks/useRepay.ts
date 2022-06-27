import { BigNumber } from "ethers";
import { useMutation } from "react-query";
import config from "../config";
import { apApe, apApeUsd } from "../constants/tokens";
import { CTokenHelper__factory } from "../contracts/types";
import useAlert from "./useAlert";
import useWallet from "./useWallet";

type RepayParams = {
  repayAmount: BigNumber;
  redeemAmount: BigNumber;
};

const useRepay = () => {
  const { signer } = useWallet();
  const { setAlert } = useAlert();

  const helper = CTokenHelper__factory.connect(config.protocol.cTokenHelper, signer);

  const { mutate, isLoading } = useMutation(
    async ({ repayAmount, redeemAmount }: RepayParams) => {
      const tx = await helper.repayRedeem(
        apApeUsd.address,
        repayAmount,
        apApe.address,
        BigNumber.from(0),
        redeemAmount,
      );
      await tx.wait();
    },
    {
      onSuccess: () => setAlert({ msg: "Repay succeed.", severity: "success" }),
      onError: () => setAlert({ msg: "Repay failed", severity: "error" }),
    },
  );

  return {
    repay: mutate,
    isLoading,
  };
};

export default useRepay;
