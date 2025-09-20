// NotificationContext.tsx
"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import Notification from "../components/notification";
import { JSX } from "react/jsx-runtime";

interface NotificationState {
  isOpen: boolean;
  type: string;
  headText: string;
  subText: string;
}

interface NotificationContextType {
  notification: NotificationState;
  openNotification: (type: string, headText: string, subText: string) => void;
  closeNotification: () => void;
}

interface NotificationProviderProps {
  children: ReactNode;
}

// Create the context
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Provider component
export const NotificationProvider = ({ children }: NotificationProviderProps): JSX.Element => {
  const [notification, setNotification] = useState<NotificationState>({
    isOpen: false,
    type: "",
    headText: "",
    subText: "",
  });

  const openNotification = useCallback((type: string, headText: string, subText: string): void => {
    setNotification({
      isOpen: true,
      type,
      headText: type === "error" ? "Oops!" : headText,
      subText,
    });
  }, []);

  const closeNotification = useCallback(() => {
    setNotification((prev) => ({ ...prev, isOpen: false }));
  }, []);

  useEffect(() => {
    if (notification.isOpen) {
      const timer = setTimeout(() => {
        setNotification((prev) => ({ ...prev, isOpen: false }));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification.isOpen]);

  return (
    <NotificationContext.Provider
      value={{
        notification,
        openNotification,
        closeNotification,
      }}
    >
      {children}
      {notification.isOpen && (
        <Notification
          type={notification.type}
          headText={notification.headText}
          subText={notification.subText}
        />
      )}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
