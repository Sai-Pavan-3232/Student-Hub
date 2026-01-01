import { useEffect, useRef, useState, useCallback } from 'react';
import type { WebSocketMessage, AnyNotification } from '../../../shared/websocket-types';

interface UseWebSocketOptions {
    url?: string;
    userId?: string;
    onNotification?: (notification: AnyNotification) => void;
    onConnect?: () => void;
    onDisconnect?: () => void;
    onError?: (error: Event) => void;
    reconnectInterval?: number;
    maxReconnectAttempts?: number;
}

interface UseWebSocketReturn {
    isConnected: boolean;
    notifications: AnyNotification[];
    sendMessage: (message: WebSocketMessage) => void;
    clearNotifications: () => void;
    reconnect: () => void;
}

/**
 * React hook for WebSocket connection and real-time notifications
 */
export function useWebSocket(options: UseWebSocketOptions = {}): UseWebSocketReturn {
    const {
        url = `ws://${window.location.host}/ws`,
        userId,
        onNotification,
        onConnect,
        onDisconnect,
        onError,
        reconnectInterval = 3000,
        maxReconnectAttempts = 5,
    } = options;

    const [isConnected, setIsConnected] = useState(false);
    const [notifications, setNotifications] = useState<AnyNotification[]>([]);

    const wsRef = useRef<WebSocket | null>(null);
    const reconnectAttemptsRef = useRef(0);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    /**
     * Connect to WebSocket server
     */
    const connect = useCallback(() => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            return; // Already connected
        }

        try {
            // Add userId to query params if provided
            const wsUrl = userId ? `${url}?userId=${userId}` : url;
            const ws = new WebSocket(wsUrl);

            ws.onopen = () => {
                console.log('[WebSocket] Connected');
                setIsConnected(true);
                reconnectAttemptsRef.current = 0;
                onConnect?.();
            };

            ws.onmessage = (event) => {
                try {
                    const message: WebSocketMessage = JSON.parse(event.data);

                    switch (message.type) {
                        case 'notification':
                            const notification = message.payload as AnyNotification;
                            setNotifications((prev) => [notification, ...prev]);
                            onNotification?.(notification);
                            break;

                        case 'pong':
                            // Heartbeat response
                            break;

                        case 'error':
                            console.error('[WebSocket] Server error:', message.payload);
                            break;

                        default:
                            console.log('[WebSocket] Unknown message type:', message.type);
                    }
                } catch (error) {
                    console.error('[WebSocket] Error parsing message:', error);
                }
            };

            ws.onerror = (error) => {
                console.error('[WebSocket] Error:', error);
                onError?.(error);
            };

            ws.onclose = () => {
                console.log('[WebSocket] Disconnected');
                setIsConnected(false);
                wsRef.current = null;
                onDisconnect?.();

                // Attempt to reconnect
                if (reconnectAttemptsRef.current < maxReconnectAttempts) {
                    reconnectAttemptsRef.current++;
                    console.log(
                        `[WebSocket] Reconnecting... (attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts})`
                    );

                    reconnectTimeoutRef.current = setTimeout(() => {
                        connect();
                    }, reconnectInterval);
                } else {
                    console.log('[WebSocket] Max reconnect attempts reached');
                }
            };

            wsRef.current = ws;
        } catch (error) {
            console.error('[WebSocket] Connection error:', error);
        }
    }, [url, userId, onConnect, onDisconnect, onError, onNotification, reconnectInterval, maxReconnectAttempts]);

    /**
     * Disconnect from WebSocket server
     */
    const disconnect = useCallback(() => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }

        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }

        setIsConnected(false);
    }, []);

    /**
     * Send message to WebSocket server
     */
    const sendMessage = useCallback((message: WebSocketMessage) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(message));
        } else {
            console.warn('[WebSocket] Cannot send message: not connected');
        }
    }, []);

    /**
     * Clear all notifications
     */
    const clearNotifications = useCallback(() => {
        setNotifications([]);
    }, []);

    /**
     * Manual reconnect
     */
    const reconnect = useCallback(() => {
        disconnect();
        reconnectAttemptsRef.current = 0;
        connect();
    }, [connect, disconnect]);

    /**
     * Connect on mount, disconnect on unmount
     */
    useEffect(() => {
        if (userId) {
            connect();
        }

        return () => {
            disconnect();
        };
    }, [userId, connect, disconnect]);

    /**
     * Send periodic ping to keep connection alive
     */
    useEffect(() => {
        if (!isConnected) return;

        const pingInterval = setInterval(() => {
            sendMessage({ type: 'ping', timestamp: Date.now() });
        }, 30000); // Ping every 30 seconds

        return () => {
            clearInterval(pingInterval);
        };
    }, [isConnected, sendMessage]);

    return {
        isConnected,
        notifications,
        sendMessage,
        clearNotifications,
        reconnect,
    };
}

/**
 * Hook for subscribing to specific notification types
 */
export function useNotificationSubscription(
    notificationType: AnyNotification['type'],
    callback: (notification: AnyNotification) => void
) {
    useEffect(() => {
        // This would be enhanced with actual subscription logic
        // For now, filtering happens client-side in the main hook
    }, [notificationType, callback]);
}
