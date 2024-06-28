import React, { createContext, useContext, useCallback } from "react";
import { useToast } from "@chakra-ui/react";

const AlertContext = createContext();

let globalShowAlert = null;

export const AlertProvider = ({ children }) => {
  const toast = useToast();

  const showAlert = useCallback(
    (message, status = "info") => {
      toast({
        title: message,
        status: status,
        duration: 5000,
        isClosable: true,
      });
    },
    [toast]
  );

  globalShowAlert = showAlert;

  return (
    <AlertContext.Provider value={showAlert}>{children}</AlertContext.Provider>
  );
};

export const useAlert = () => {
  return useContext(AlertContext);
};

export const showAlert = (message, status) => {
  if (globalShowAlert) {
    globalShowAlert(message, status);
  } else {
    console.warn("showAlert function is not initialized");
  }
};
