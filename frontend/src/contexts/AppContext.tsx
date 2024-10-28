import React, { useContext, useState } from "react";
import Toast from "../components/Toast";
import * as apiClient from "./../api-clients";
import { useQuery } from "react-query";

export type ToastMessageType = {
  type: "SUCCESS" | "ERROR";
  message: string;
};

type AppContextType = {
  showToast: (toastMessage: ToastMessageType) => void;
  isLoggedIn: boolean;
  isAdmin: boolean;
};

const AppContext = React.createContext<AppContextType | undefined>(undefined);

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [toast, setToast] = useState<ToastMessageType | undefined>(undefined);

  const { isError } = useQuery("validateToken", apiClient.validateToken, {
    retry: false,
  });

  const { isError: isAdminError } = useQuery(
    "validateAdminToken",
    apiClient.validateAdminToken,
    {
      retry: false,
    }
  );

  return (
    <AppContext.Provider
      value={{
        showToast: (toastMessage) => {
          setToast(toastMessage);
        },
        isLoggedIn: !isError,
        isAdmin: !isAdminError,
      }}
    >
      {/* Check for custom attributes on the div element */}
      <div className="relative -z-0">
        {toast && (
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(undefined)}
          />
        )}
        {children}
      </div>
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  return context as AppContextType;
};
