import React, { createContext, useContext, useEffect } from 'react';
import { webSocketService, WebSocketMessage } from '../services/websocket';
import { useAuth } from './AuthContext';
import { soundManager } from '@/lib/soundUtils';

interface NotificationsContextType {
    sendNotification: (message: WebSocketMessage) => void;
}

const NotificationsContext = createContext<NotificationsContextType>({
    sendNotification: () => { },
});

export const useNotifications = () => useContext(NotificationsContext);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            // Initialize WebSocket connection and set up message handlers
            webSocketService.onMessage((message) => {
                // Play different sounds based on message type
                switch (message.type) {
                    case 'SOS_ALERT':
                    case 'EMERGENCY':
                        soundManager.play('emergency');
                        break;
                    case 'INCIDENT_REPORT':
                    case 'CASE_UPDATE':
                    case 'ALERT_STATUS_UPDATE':
                    case 'NEARBY_INCIDENT':
                        soundManager.play('notification');
                        break;
                }
            });

            return () => {
                webSocketService.disconnect();
            };
        }
    }, [isAuthenticated]);

    const sendNotification = (message: WebSocketMessage) => {
        // Play sound when sending notifications too
        switch (message.type) {
            case 'SOS_ALERT':
            case 'EMERGENCY':
                soundManager.play('emergency');
                break;
            case 'INCIDENT_REPORT':
            case 'CASE_UPDATE':
            case 'ALERT_STATUS_UPDATE':
                soundManager.play('notification');
                break;
        }
        webSocketService.send(message);
    };

    return (
        <NotificationsContext.Provider value={{ sendNotification }}>
            {children}
        </NotificationsContext.Provider>
    );
};