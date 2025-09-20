// ModalContext.tsx
"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import SuccessScreen from "../app/crimerecorder/components/Success";
import ErrorScreen from "../app/crimerecorder/components/error";
import { JSX } from "react/jsx-runtime";

interface ModalContextType {
  isModalOpen: string | null;
  openModal: (type: string) => void;
  closeModal: () => void;
  message: string;
  setMessage: (message: string) => void;
}

interface ModalProviderProps {
  children: ReactNode;
}

// Create the context
const ModalContext = createContext<ModalContextType | undefined>(undefined);

// Provider component
export const ModalProvider = ({ children }: ModalProviderProps): JSX.Element => {
  const route = useRouter();
  const [isModalOpen, setIsModalOpen] = useState<string | null>(null);
  const openModal = (type: string): void => {
    setIsModalOpen(type);
  };
  const [message, setMessage] = useState<string>("");

  const closeModal = (): void => {
    if (isModalOpen === "success") {
      setIsModalOpen(null);
      route.push("/crimerecorder");
    } else {
      setIsModalOpen(null);
    }
  };

  return (
    <ModalContext.Provider
      value={{ isModalOpen, openModal, closeModal, message, setMessage }}>
      {children}
      {isModalOpen === "success" && <SuccessScreen />}
      {isModalOpen === "error" && <ErrorScreen />}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);
