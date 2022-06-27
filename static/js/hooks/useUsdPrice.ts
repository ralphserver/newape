import { formatUnits, parseUnits } from "ethers/lib/utils";
import { JsonRpcProvider } from "@ethersproject/providers";
import config from "../config";
import { CurveLP__factory, Erc20__factory, UniLP__factory } from "../contracts/types";
import { sameAddress } from "../utils/web3";
import useBlockchainQuery from "./useBlockchainQuery";
import useWallet from "./useWallet";

const useUsdPrice = (address: string) => {
  const { provider } = useWallet();

  const { data: price, isLoading } = useBlockchainQuery(["usd-price", address], async () => {
    return getUsdPrice(address, provider);
  });

  return {
    price,
    isLoading,
  };
};

export async function getUsdPrice(address: string, provider: JsonRpcProvider) {
  if (sameAddress(address, config.protocol.apeFi)) {
    return await getApeFiPrice(provider);
  }

  if (sameAddress(address, config.protocol.curveLP)) {
    return await getCurveLPPrice(provider);
  }

  if (sameAddress(address, config.protocol.uniLP)) {
    return await getUniLPPrice(provider);
  }

  throw new Error(`failed to get usd price of ${address}`);
}

async function getFsxPrice() {
  return 0;
}

async function getApeUsdPrice() {
  return 1;
}

async function getApeFiPrice(provider: JsonRpcProvider) {
  const apeUsd = Erc20__factory.connect(config.protocol.apeUsd, provider);
  const apeFi = Erc20__factory.connect(config.protocol.apeFi, provider);

  const apeUsdBalance = await apeUsd.balanceOf(config.protocol.uniLP);
  const apeFiBalance = await apeFi.balanceOf(config.protocol.uniLP);

  const apeFiPrice = apeUsdBalance.mul(parseUnits("1", 18)).div(apeFiBalance);
  return Number(formatUnits(apeFiPrice, 18));
}

async function getCurveLPPrice(provider: JsonRpcProvider) {
  const virtualPrice = await CurveLP__factory.connect(config.protocol.curveLP, provider).get_virtual_price();

  return Number(formatUnits(virtualPrice, 18));
}

async function getUniLPPrice(provider: JsonRpcProvider) {
  const totalSupply = await UniLP__factory.connect(config.protocol.uniLP, provider).totalSupply();

  const apeUsd = Erc20__factory.connect(config.protocol.apeUsd, provider);
  const apeUsdBalance = await apeUsd.balanceOf(config.protocol.uniLP);

  const lpPrice = apeUsdBalance.mul("2").mul(parseUnits("1", 18)).div(totalSupply);
  return Number(formatUnits(lpPrice, 18));
}

export default useUsdPrice;
