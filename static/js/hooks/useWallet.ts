import { useContext } from "react";
import { ConnectionContext } from "../providers/ConnectionProvider";

const useWallet = () => {
  return useContext(ConnectionContext);
};

export default useWallet;
