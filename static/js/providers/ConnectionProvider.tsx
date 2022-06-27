import { JsonRpcProvider, JsonRpcSigner, Web3Provider } from "@ethersproject/providers";
import injectedModule from "@web3-onboard/injected-wallets";
import { init as initOnboard, useConnectWallet } from "@web3-onboard/react";
import walletConnectModule from "@web3-onboard/walletconnect";
import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import config from "../config";

const injected = injectedModule();
const walletConnect = walletConnectModule();

initOnboard({
  wallets: [injected, walletConnect],
  chains: [
    {
      id: "0x1",
      label: "Ethereum Mainnet",
      // todo: change url
      rpcUrl: "https://rpc.ankr.com/eth",
      token: "ETH",
    },
  ],
  appMetadata: {
    name: "Ape Finance",
    // todo: icon
    icon: "/assets/ape.svg",
    description: "Ape Finance",
  },
  accountCenter: {
    desktop: { enabled: false },
  },
});

interface Context {
  connected: boolean;
  connectWallet(): void;
  disconnectWallet(): void;
  walletAddress?: string;
  ensName?: string;
  provider: JsonRpcProvider;
  signer: JsonRpcSigner;
}

export const ConnectionContext = createContext<Context>({
  connected: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  connectWallet: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  disconnectWallet: () => {},
  walletAddress: undefined,
  ensName: undefined,
  provider: config.defaultProvider,
  signer: config.defaultProvider.getSigner(),
});

interface ConnectionProviderProps {
  children: React.ReactNode;
}

const ConnectionProvider = ({ children }: ConnectionProviderProps): JSX.Element => {
  const [{ wallet }, connect, disconnect] = useConnectWallet();

  const [ensName, setENSName] = useState<string | undefined>(undefined);

  const connected = useMemo(() => !!wallet, [wallet]);

  const provider = useMemo(() => {
    if (!wallet) return config.defaultProvider;
    return new Web3Provider(wallet.provider);
  }, [wallet]);

  const walletAddress = useMemo(() => {
    return wallet?.accounts[0]?.address;
  }, [wallet]);

  useEffect(() => {
    const previouslyConnectedWalletLabel = window.localStorage.getItem("selectedWallet");
    if (previouslyConnectedWalletLabel) {
      connect({
        autoSelect: {
          label: previouslyConnectedWalletLabel,
          disableModals: true,
        },
      });
    }
  }, [connect]);

  useEffect(() => {
    if (!wallet?.label) return;
    window.localStorage.setItem("selectedWallet", wallet.label);
  }, [wallet]);

  const connectWallet = useCallback(async () => {
    await connect({});
  }, [connect]);

  const disconnectWallet = useCallback(() => {
    if (wallet) {
      disconnect({ label: wallet.label });
    }
    setENSName(undefined);
    window.localStorage.removeItem("selectedWallet");
  }, [disconnect, wallet]);

  const context = useMemo(
    () => ({
      connected,
      connectWallet,
      disconnectWallet,
      walletAddress,
      ensName,
      provider,
      signer: provider.getSigner(),
    }),
    [connected, connectWallet, disconnectWallet, walletAddress, ensName, provider],
  );

  return <ConnectionContext.Provider value={context}>{children}</ConnectionContext.Provider>;
};

export default ConnectionProvider;
