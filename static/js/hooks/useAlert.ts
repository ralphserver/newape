import { useContext } from "react";
import { AlertContext } from "../providers/AlertProvider";

const useAlert = () => {
  return useContext(AlertContext);
};

export default useAlert;
