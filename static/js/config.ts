import { JsonRpcProvider } from "@ethersproject/providers";

export type Config = {
  defaultProvider: JsonRpcProvider;
  protocol: {
    comptroller: string;
    priceOracle: string;
    lens: string;
    cTokenHelper: string;
    apeCoin: string;
    apeUsd: string;
    apApe: string;
    apApeUsd: string;
    apeFi: string;
    curveLP: string;
    uniLP: string;
  };
  earn: {
    helper: string;
    pools: Pool[];
  };
};

export type LpType = "uniswap" | "curve";

export type Pool = {
  name: string;
  url: string;
  rewardContract: string;
  lp: {
    address: string;
    decimals: number;
    type: LpType;
    pair: [{ symbol: string; img: string }, { symbol: string; img: string }];
  };
  claimables: {
    address: string;
    decimals: number;
    symbol: string;
  }[];
};

const DevConfig: Config = {
  defaultProvider: new JsonRpcProvider("http://127.0.0.1:8545/"),
  protocol: {
    comptroller: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    priceOracle: "0x0165878A594ca255338adfa4d48449f69242Eb8F",
    lens: "0x610178dA211FEF7D417bC0e6FeD39F05609AD788",
    cTokenHelper: "0xE6E340D132b5f46d1e472DebcD681B2aBc16e57E",
    apeCoin: "0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE",
    apeUsd: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
    apApe: "0x68B1D87F95878fE05B998F19b66F4baba5De1aed",
    apApeUsd: "0x322813Fd9A801c5507c9de605d63CEA4f2CE6c44",
    apeFi: "0xf5059a5D33d5853360D16C683c16e67980206f36",
    curveLP: "0x95401dc811bb5740090279Ba06cfA8fcF6113778",
    uniLP: "0x998abeb3E57409262aE5b751f60747921B33613E",
  },
  earn: {
    helper: "0xa82fF9aFd8f496c3d6ac40E2a0F282E47488CFc9",
    pools: [
      {
        name: "ApeUSD/FRAX Curve Pool",
        url: "https://curve.fi/factory/120/deposit",
        rewardContract: "0x330981485Dbd4EAcD7f14AD4e6A1324B48B09995",
        lp: {
          address: "0x95401dc811bb5740090279Ba06cfA8fcF6113778",
          decimals: 18,
          type: "curve",
          pair: [
            { symbol: "ApeUSD", img: "assets/tokens/apeUsd.svg" },
            { symbol: "FRAX", img: "assets/tokens/frax.svg" },
          ],
        },
        claimables: [
          {
            address: "0xf5059a5D33d5853360D16C683c16e67980206f36",
            decimals: 18,
            symbol: "APEFI",
          },
        ],
      },
      {
        name: "APEFI/ApeUSD Uniswap Pool",
        url: "https://app.uniswap.org/#/add/v2/0x4332f8A38f14BD3D8D1553aF27D7c7Ac6C27278D/0xfF709449528B6fB6b88f557F7d93dEce33bca78D?chain=mainnet",
        rewardContract: "0x6c615C766EE6b7e69275b0D070eF50acc93ab880",
        lp: {
          address: "0x998abeb3E57409262aE5b751f60747921B33613E",
          decimals: 18,
          type: "uniswap",
          pair: [
            { symbol: "APEFI", img: "assets/tokens/apeFi.svg" },
            { symbol: "ApeUSD", img: "assets/tokens/apeUsd.svg" },
          ],
        },
        claimables: [
          {
            address: "0xf5059a5D33d5853360D16C683c16e67980206f36",
            decimals: 18,
            symbol: "APEFI",
          },
        ],
      },
    ],
  },
};

const ProdConfig: Config = {
  defaultProvider: new JsonRpcProvider("https://rpc.ankr.com/eth"),
  protocol: {
    comptroller: "0xDE607fe5Cb415d83Fe4A976afD97e5DaEeaedB07",
    priceOracle: "0xe6189702244CF82444eff2175d7E53951810Fa72",
    lens: "0x1C8e3Cbee537e6249BDA0af98f7055DAA09E52D5",
    cTokenHelper: "0xCAAA0C316f8b91F25b35E318f83CaaB4ACD327fB",
    apeCoin: "0x4d224452801ACEd8B2F0aebE155379bb5D594381",
    apeUsd: "0xfF709449528B6fB6b88f557F7d93dEce33bca78D",
    apApe: "0xcaB90816f91CC25b04251857ED6002891Eb0D6Fa",
    apApeUsd: "0xc7319dBc86A121313Bc48B7C54d0672756465031",
    apeFi: "0x4332f8A38f14BD3D8D1553aF27D7c7Ac6C27278D",
    curveLP: "0x1977870a4c18a728C19Dd4eB6542451DF06e0A4b",
    uniLP: "0xfB7A3798c6FFF187C8CF08c0b1322b52cfa70AcE",
  },
  earn: {
    helper: "0x84D30DA8bE6ba709ad4374c106ACfCD4d61061E1",
    pools: [
      {
        name: "ApeUSD/FRAX Curve Pool",
        url: "https://curve.fi/factory/120/deposit",
        rewardContract: "0x4Fa7cd808920520294245d746a932d334B783926",
        lp: {
          address: "0x1977870a4c18a728C19Dd4eB6542451DF06e0A4b",
          decimals: 18,
          type: "curve",
          pair: [
            { symbol: "ApeUSD", img: "assets/tokens/apeUsd.svg" },
            { symbol: "FRAX", img: "assets/tokens/frax.svg" },
          ],
        },
        claimables: [
          {
            address: "0x4332f8A38f14BD3D8D1553aF27D7c7Ac6C27278D",
            decimals: 18,
            symbol: "APEFI",
          },
        ],
      },
      {
        name: "APEFI/ApeUSD Uniswap Pool",
        url: "https://app.uniswap.org/#/add/v2/0x4332f8A38f14BD3D8D1553aF27D7c7Ac6C27278D/0xfF709449528B6fB6b88f557F7d93dEce33bca78D?chain=mainnet",
        rewardContract: "0xbcc28F6BA03642B9B5a3E7ad5C8f27991576796c",
        lp: {
          address: "0xfB7A3798c6FFF187C8CF08c0b1322b52cfa70AcE",
          decimals: 18,
          type: "uniswap",
          pair: [
            { symbol: "APEFI", img: "assets/tokens/apeFi.svg" },
            { symbol: "ApeUSD", img: "assets/tokens/apeUsd.svg" },
          ],
        },
        claimables: [
          {
            address: "0x4332f8A38f14BD3D8D1553aF27D7c7Ac6C27278D",
            decimals: 18,
            symbol: "APEFI",
          },
        ],
      },
    ],
  },
};

const config = process.env.NODE_ENV === "production" ? ProdConfig : DevConfig;

export default config;
