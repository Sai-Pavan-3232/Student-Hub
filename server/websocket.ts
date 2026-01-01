import { WebSocketServer, WebSocket } from 'ws';
import type { Server } from 'http';
import type { IncomingMessage } from 'http';
import type { WebSocketMessage, NotificationPayload, AnyNotification } from '../shared/websocket-types';
import { log } from './index';

interface AuthenticatedWebSocket extends WebSocket {
    userId?: string;
    isAlive?: boolean;
}

class WebSocketManager {
    private wss: WebSocketServer | null = null;
    private clients: Map<string, Set<AuthenticatedWebSocket>> = new Map();
    private heartbeatInterval: NodeJS.Timeout | null = null;

    /**
     * Initialize WebSocket server
     */
    initialize(httpServer: Server) {
        this.wss = new WebSocketServer({
            server: httpServer,
            path: '/ws',
        });

        this.wss.on('connection', (ws: AuthenticatedWebSocket, req: IncomingMessage) => {
            this.handleConnection(ws, req);
        });

        // Start heartbeat to detect dead connections
        this.startHeartbeat();

        log('WebSocket server initialized', 'websocket');
    }

    /**
     * Handle new WebSocket connection
     */
    private handleConnection(ws: AuthenticatedWebSocket, req: IncomingMessage) {
        ws.isAlive = true;

        // Extract user ID from session or query params
        const userId = this.extractUserId(req);

        if (!userId) {
            log('WebSocket connection rejected: no user ID', 'websocket');
            ws.close(1008, 'Authentication required');
            return;
        }

        ws.userId = userId;

        // Add client to tracking
        if (!this.clients.has(userId)) {
            this.clients.set(userId, new Set());
        }
        this.clients.get(userId)!.add(ws);

        log(`WebSocket client connected: ${userId}`, 'websocket');

        // Send welcome message
        this.sendMessage(ws, {
            type: 'notification',
            payload: {
                id: `welcome_${Date.now()}`,
                type: 'system',
                title: 'Connected',
                message: 'WebSocket connection established',
                userId,
                read: false,
                createdAt: new Date(),
            },
            timestamp: Date.now(),
        });

        // Handle incoming messages
        ws.on('message', (data: Buffer) => {
            this.handleMessage(ws, data);
        });

        // Handle pong responses
        ws.on('pong', () => {
            ws.isAlive = true;
        });

        // Handle disconnection
        ws.on('close', () => {
            this.handleDisconnection(ws);
        });

        // Handle errors
        ws.on('error', (error) => {
            log(`WebSocket error for user ${userId}: ${error.message}`, 'websocket');
        });
    }

    /**
     * Extract user ID from request
     */
    private extractUserId(req: IncomingMessage): string | null {
        // Try to get from query params
        const url = new URL(req.url || '', `http://${req.headers.host}`);
        const userIdFromQuery = url.searchParams.get('userId');

        if (userIdFromQuery) {
            return userIdFromQuery;
        }

        // Try to get from session cookie
        // This is a simplified version - in production, you'd parse the session cookie properly
        const cookies = req.headers.cookie?.split(';').reduce((acc, cookie) => {
            const [key, value] = cookie.trim().split('=');
            acc[key] = value;
            return acc;
        }, {} as Record<string, string>);

        // For now, we'll rely on query params
        // In a real implementation, you'd decode the session cookie to get the userId
        return null;
    }

    /**
     * Handle incoming WebSocket message
     */
    private handleMessage(ws: AuthenticatedWebSocket, data: Buffer) {
        try {
            const message: WebSocketMessage = JSON.parse(data.toString());

            switch (message.type) {
                case 'ping':
                    this.sendMessage(ws, { type: 'pong', timestamp: Date.now() });
                    break;

                case 'subscribe':
                    // Handle subscription to specific notification types
                    log(`User ${ws.userId} subscribed to ${message.payload}`, 'websocket');
                    break;

                case 'unsubscribe':
                    // Handle unsubscription
                    log(`User ${ws.userId} unsubscribed from ${message.payload}`, 'websocket');
                    break;

                default:
                    log(`Unknown message type: ${message.type}`, 'websocket');
            }
        } catch (error: any) {
            log(`Error parsing WebSocket message: ${error.message}`, 'websocket');
            this.sendMessage(ws, {
                type: 'error',
                payload: { message: 'Invalid message format' },
                timestamp: Date.now(),
            });
        }
    }

    /**
     * Handle client disconnection
     */
    private handleDisconnection(ws: AuthenticatedWebSocket) {
        if (ws.userId) {
            const userClients = this.clients.get(ws.userId);
            if (userClients) {
                userClients.delete(ws);
                if (userClients.size === 0) {
                    this.clients.delete(ws.userId);
                }
            }
            log(`WebSocket client disconnected: ${ws.userId}`, 'websocket');
        }
    }

    /**
     * Send message to a specific WebSocket
     */
    private sendMessage(ws: WebSocket, message: WebSocketMessage) {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(message));
        }
    }

    /**
     * Send notification to a specific user
     */
    sendNotificationToUser(userId: string, notification: AnyNotification) {
        const userClients = this.clients.get(userId);

        if (!userClients || userClients.size === 0) {
            log(`No active WebSocket connections for user ${userId}`, 'websocket');
            return;
        }

        const message: WebSocketMessage = {
            type: 'notification',
            payload: notification,
            timestamp: Date.now(),
        };

        userClients.forEach((ws) => {
            this.sendMessage(ws, message);
        });

        log(`Sent notification to user ${userId}: ${notification.type}`, 'websocket');
    }

    /**
     * Broadcast notification to multiple users
     */
    broadcastNotification(userIds: string[], notification: AnyNotification) {
        userIds.forEach((userId) => {
            this.sendNotificationToUser(userId, notification);
        });
    }

    /**
     * Start heartbeat to detect dead connections
     */
    private startHeartbeat() {
        this.heartbeatInterval = setInterval(() => {
            if (!this.wss) return;

            this.wss.clients.forEach((ws: WebSocket) => {
                const authWs = ws as AuthenticatedWebSocket;

                if (authWs.isAlive === false) {
                    log(`Terminating dead connection for user ${authWs.userId}`, 'websocket');
                    return authWs.terminate();
                }

                authWs.isAlive = false;
                authWs.ping();
            });
        }, 30000); // Check every 30 seconds
    }

    /**
     * Get count of active connections
     */
    getActiveConnectionsCount(): number {
        return this.wss?.clients.size || 0;
    }

    /**
     * Get count of unique users connected
     */
    getUniqueUsersCount(): number {
        return this.clients.size;
    }

    /**
     * Shutdown WebSocket server
     */
    shutdown() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
        }

        if (this.wss) {
            this.wss.clients.forEach((ws) => {
                ws.close(1001, 'Server shutting down');
            });
            this.wss.close();
            log('WebSocket server shut down', 'websocket');
        }
    }
}

// Export singleton instance
export const wsManager = new WebSocketManager();

/**
 * Helper function to create notifications
 */
export function createNotification(
    type: AnyNotification['type'],
    userId: string,
    title: string,
    message: string,
    data?: Record<string, any>
): AnyNotification {
    return {
        id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        type,
        title,
        message,
        data: data || {},
        userId,
        read: false,
        createdAt: new Date(),
    } as AnyNotification;
}
