import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";

export type Alert = {
  msg: string;
  severity: "success" | "error";
};

interface Context {
  alert?: Alert;
  setAlert: (alert?: Alert) => void;
}

export const AlertContext = createContext<Context>({
  setAlert: () => undefined,
});

interface AlertProviderProps {
  children: React.ReactNode;
}

const AlertProvider = ({ children }: AlertProviderProps): JSX.Element => {
  const [alert, setAlert] = useState<Alert | undefined>(undefined);

  const context = {
    alert,
    setAlert,
  };

  return <AlertContext.Provider value={context}>{children}</AlertContext.Provider>;
};

export default AlertProvider;
