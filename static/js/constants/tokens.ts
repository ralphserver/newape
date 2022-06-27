import config from "../config";

export type Token = {
  symbol: string;
  address: string;
  decimals: number;
  img?: string;
};

export const ApeCoin = {
  symbol: "APE",
  address: config.protocol.apeCoin,
  decimals: 18,
  img: "assets/tokens/ape.svg",
};

export const ApeUsd = {
  symbol: "ApeUSD",
  address: config.protocol.apeUsd,
  decimals: 18,
  img: "assets/tokens/apeUsd.svg",
};

export const apApe = {
  symbol: "apAPE",
  address: config.protocol.apApe,
  decimals: 18,
  img: "",
};

export const apApeUsd = {
  symbol: "apApeUSD",
  address: config.protocol.apApeUsd,
  decimals: 18,
  img: "",
};
