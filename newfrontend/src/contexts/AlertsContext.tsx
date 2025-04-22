import React, { createContext, useContext, useState, useEffect } from 'react';
import { soundManager } from '@/lib/soundUtils';
import { toast } from '@/hooks/use-toast';

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
        const fetchedAlerts = Array.isArray(data) ? data : data.content || [];
        setAlerts(fetchedAlerts);

        // Play emergency sound if there are any active emergency alerts
        if (fetchedAlerts.some(alert => alert.type === 'emergency' && !alert.isRead)) {
          soundManager.play('emergency');
        }
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to fetch alerts",
          variant: "destructive",
        });
      });
  }, []);

  const addAlert = (newAlert: Omit<Alert, 'id' | 'timestamp' | 'isRead'>) => {
    const alert: Alert = {
      ...newAlert,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      isRead: false,
    };

    // Play appropriate sound based on alert type
    if (alert.type === 'emergency') {
      soundManager.play('emergency');
    } else {
      soundManager.play('notification');
    }

    setAlerts((prev) => [alert, ...prev]);

    // Show toast notification
    toast({
      title: alert.title,
      description: alert.message,
      variant: alert.type === 'emergency' ? "destructive" : "default",
    });
  };

  const markAsRead = (id: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === id ? { ...alert, isRead: true } : alert
      )
    );
    // Play notification sound when marking as read
    soundManager.play('notification');
  };

  const clearAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    // Play notification sound when clearing alert
    soundManager.play('notification');
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
