import { z } from 'zod';

/**
 * WebSocket message types
 */
export type WebSocketMessageType =
    | 'ping'
    | 'pong'
    | 'notification'
    | 'subscribe'
    | 'unsubscribe'
    | 'error';

/**
 * Notification types
 */
export type NotificationType =
    | 'connection_request'
    | 'connection_accepted'
    | 'thread_reply'
    | 'thread_mention'
    | 'mentorship_request'
    | 'mentorship_accepted'
    | 'event_reminder'
    | 'club_announcement';

/**
 * Base WebSocket message structure
 */
export interface WebSocketMessage {
    type: WebSocketMessageType;
    payload?: any;
    timestamp?: number;
}

/**
 * Notification payload structure
 */
export interface NotificationPayload {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    data?: Record<string, any>;
    userId: string;
    read: boolean;
    createdAt: Date;
}

/**
 * Connection request notification
 */
export interface ConnectionRequestNotification extends NotificationPayload {
    type: 'connection_request';
    data: {
        requesterId: string;
        requesterName: string;
        connectionId: string;
    };
}

/**
 * Connection accepted notification
 */
export interface ConnectionAcceptedNotification extends NotificationPayload {
    type: 'connection_accepted';
    data: {
        accepterId: string;
        accepterName: string;
        connectionId: string;
    };
}

/**
 * Thread reply notification
 */
export interface ThreadReplyNotification extends NotificationPayload {
    type: 'thread_reply';
    data: {
        threadId: string;
        threadTitle: string;
        replyId: string;
        authorId: string;
        authorName: string;
    };
}

/**
 * Thread mention notification
 */
export interface ThreadMentionNotification extends NotificationPayload {
    type: 'thread_mention';
    data: {
        threadId: string;
        threadTitle: string;
        mentionedBy: string;
        mentionedByName: string;
    };
}

/**
 * Mentorship request notification
 */
export interface MentorshipRequestNotification extends NotificationPayload {
    type: 'mentorship_request';
    data: {
        requestId: string;
        studentId: string;
        studentName: string;
        message?: string;
    };
}

/**
 * Mentorship accepted notification
 */
export interface MentorshipAcceptedNotification extends NotificationPayload {
    type: 'mentorship_accepted';
    data: {
        requestId: string;
        mentorId: string;
        mentorName: string;
    };
}

/**
 * Event reminder notification
 */
export interface EventReminderNotification extends NotificationPayload {
    type: 'event_reminder';
    data: {
        eventId: string;
        eventTitle: string;
        eventDate: string;
        eventTime: string;
        location: string;
    };
}

/**
 * Club announcement notification
 */
export interface ClubAnnouncementNotification extends NotificationPayload {
    type: 'club_announcement';
    data: {
        clubId: string;
        clubName: string;
        announcement: string;
    };
}

/**
 * Union type of all notification types
 */
export type AnyNotification =
    | ConnectionRequestNotification
    | ConnectionAcceptedNotification
    | ThreadReplyNotification
    | ThreadMentionNotification
    | MentorshipRequestNotification
    | MentorshipAcceptedNotification
    | EventReminderNotification
    | ClubAnnouncementNotification;

/**
 * Zod schemas for validation
 */
export const webSocketMessageSchema = z.object({
    type: z.enum(['ping', 'pong', 'notification', 'subscribe', 'unsubscribe', 'error']),
    payload: z.any().optional(),
    timestamp: z.number().optional(),
});

export const notificationPayloadSchema = z.object({
    id: z.string(),
    type: z.enum([
        'connection_request',
        'connection_accepted',
        'thread_reply',
        'thread_mention',
        'mentorship_request',
        'mentorship_accepted',
        'event_reminder',
        'club_announcement',
    ]),
    title: z.string(),
    message: z.string(),
    data: z.record(z.any()).optional(),
    userId: z.string(),
    read: z.boolean(),
    createdAt: z.date(),
});

/**
 * Type guards
 */
export function isWebSocketMessage(data: any): data is WebSocketMessage {
    return webSocketMessageSchema.safeParse(data).success;
}

export function isNotificationPayload(data: any): data is NotificationPayload {
    return notificationPayloadSchema.safeParse(data).success;
}
