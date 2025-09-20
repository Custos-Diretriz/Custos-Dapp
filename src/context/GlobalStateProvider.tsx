"use client";
import React, { createContext, useState, ReactNode } from "react";

interface GlobalStateContextType {
  globalState: string;
  setGlobalState: (state: string) => void;
  showModal: boolean;
  closeSuccessModal: () => void;
  setShowModal: (show: boolean) => void;
}

interface GlobalStateProviderProps {
  children: ReactNode;
}

export const GlobalStateContext = createContext<GlobalStateContextType | undefined>(undefined);

export const GlobalStateProvider = ({ children }: GlobalStateProviderProps): React.JSX.Element => {
  const [globalState, setGlobalState] = useState("");
  const [showModal, setShowModal] = useState(true);
  const closeSuccessModal = (): void => {
    setShowModal(false);
    // route.push("/crimerecorder"); // TODO: Fix this - route is not imported
  };
  return (
    <GlobalStateContext.Provider
      value={{ globalState, setGlobalState, showModal, closeSuccessModal, setShowModal }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = (): GlobalStateContextType => {
  const context = React.useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider');
  }
  return context;
};
