import React, { createContext, useContext, useState, useEffect } from 'react';

export type AlertType = 'emergency' | 'warning' | 'info';

export interface Alert {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  location?: string;
  timestamp: Date;
  isRead: boolean;
}

interface AlertsContextType {
  alerts: Alert[];
  addAlert: (alert: Omit<Alert, 'id' | 'timestamp' | 'isRead'>) => void;
  markAsRead: (id: string) => void;
  clearAlert: (id: string) => void;
}

const AlertsContext = createContext<AlertsContextType | undefined>(undefined);

export function AlertsProvider({ children }: { children: React.ReactNode }) {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    // Fetch alerts from backend
    fetch('/api/alerts?page=0&size=100')
      .then(res => res.json())
      .then(data => {
        setAlerts(Array.isArray(data) ? data : data.content || []);
      })
      .catch(() => {
        // Optionally handle error
      });
  }, []);

  const addAlert = (newAlert: Omit<Alert, 'id' | 'timestamp' | 'isRead'>) => {
    // Optionally: POST to backend here
    const alert: Alert = {
      ...newAlert,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      isRead: false,
    };
    setAlerts((prev) => [alert, ...prev]);
  };

  const markAsRead = (id: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === id ? { ...alert, isRead: true } : alert
      )
    );
  };

  const clearAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  return (
    <AlertsContext.Provider value={{ alerts, addAlert, markAsRead, clearAlert }}>
      {children}
    </AlertsContext.Provider>
  );
}

export const useAlerts = () => {
  const context = useContext(AlertsContext);
  if (context === undefined) {
    throw new Error('useAlerts must be used within an AlertsProvider');
  }
  return context;
};
