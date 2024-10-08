"use client";
import React, { createContext, useState } from "react";


export const GlobalStateContext = createContext();


export const GlobalStateProvider = ({ children }) => {
  const [globalState, setGlobalState] = useState("");

  return (
    <GlobalStateContext.Provider value={{ globalState, setGlobalState }}>
      {children}
    </GlobalStateContext.Provider>
  );
};
