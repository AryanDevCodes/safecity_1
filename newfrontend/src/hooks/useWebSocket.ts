import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from './use-toast';

type WebSocketConfig = {
    onMessage?: (event: MessageEvent) => void;
    onConnect?: () => void;
    onDisconnect?: () => void;
    onError?: (error: Event) => void;
};

export const useWebSocket = (config: WebSocketConfig = {}) => {
    const wsRef = useRef<WebSocket | null>(null);
    const { user } = useAuth();

    const connect = useCallback(() => {
        if (!user) return;

        const token = localStorage.getItem('safecity_token');
        if (!token) return;

        const ws = new WebSocket(`ws://localhost:8080/ws?token=${token}`);

        ws.onopen = () => {
            console.log('WebSocket Connected');
            config.onConnect?.();
        };

        ws.onmessage = (event) => {
            config.onMessage?.(event);
        };

        ws.onclose = () => {
            console.log('WebSocket Disconnected');
            config.onDisconnect?.();
            // Attempt to reconnect after 3 seconds
            setTimeout(connect, 3000);
        };

        ws.onerror = (error) => {
            console.error('WebSocket Error:', error);
            config.onError?.(error);
            toast({
                title: "Connection Error",
                description: "Failed to establish real-time connection",
                variant: "destructive",
            });
        };

        wsRef.current = ws;

        return () => {
            ws.close();
        };
    }, [user, config]);

    useEffect(() => {
        const cleanup = connect();
        return () => cleanup?.();
    }, [connect]);

    const send = useCallback((data: any) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(data));
        } else {
            console.warn('WebSocket is not connected');
        }
    }, []);

    return { send };
};