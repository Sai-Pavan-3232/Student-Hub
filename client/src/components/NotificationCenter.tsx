import { useState, useEffect } from 'react';
import { Bell, X, Check } from 'lucide-react';
import { useWebSocket } from '../hooks/useWebSocket';
import type { AnyNotification } from '../../../shared/websocket-types';
import { Button } from './ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from './ui/popover';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';

interface NotificationCenterProps {
    userId?: string;
}

export function NotificationCenter({ userId }: NotificationCenterProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const { isConnected, notifications, clearNotifications } = useWebSocket({
        userId,
        onNotification: (notification) => {
            // Show toast or play sound
            console.log('New notification:', notification);
            setUnreadCount((prev) => prev + 1);

            // Optional: Show browser notification
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification(notification.title, {
                    body: notification.message,
                    icon: '/logo.png',
                });
            }
        },
    });

    // Request notification permission on mount
    useEffect(() => {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }, []);

    const handleMarkAllRead = () => {
        setUnreadCount(0);
    };

    const handleClearAll = () => {
        clearNotifications();
        setUnreadCount(0);
    };

    const getNotificationIcon = (type: AnyNotification['type']) => {
        switch (type) {
            case 'connection_request':
            case 'connection_accepted':
                return '🤝';
            case 'thread_reply':
            case 'thread_mention':
                return '💬';
            case 'mentorship_request':
            case 'mentorship_accepted':
                return '🎓';
            case 'event_reminder':
                return '📅';
            case 'club_announcement':
                return '📢';
            default:
                return '🔔';
        }
    };

    const formatTimestamp = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - new Date(date).getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                        >
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </Badge>
                    )}
                    {!isConnected && (
                        <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-yellow-500" />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="font-semibold">Notifications</h3>
                    <div className="flex gap-2">
                        {notifications.length > 0 && (
                            <>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleMarkAllRead}
                                    className="text-xs"
                                >
                                    <Check className="h-3 w-3 mr-1" />
                                    Mark all read
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleClearAll}
                                    className="text-xs"
                                >
                                    <X className="h-3 w-3 mr-1" />
                                    Clear
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                <ScrollArea className="h-[400px]">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                            <Bell className="h-8 w-8 mb-2 opacity-50" />
                            <p className="text-sm">No notifications</p>
                            {!isConnected && (
                                <p className="text-xs mt-2 text-yellow-600">
                                    Connecting...
                                </p>
                            )}
                        </div>
                    ) : (
                        <div className="divide-y">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className="p-4 hover:bg-accent cursor-pointer transition-colors"
                                >
                                    <div className="flex gap-3">
                                        <span className="text-2xl flex-shrink-0">
                                            {getNotificationIcon(notification.type)}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm truncate">
                                                {notification.title}
                                            </p>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {notification.message}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-2">
                                                {formatTimestamp(notification.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>

                {!isConnected && (
                    <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 border-t">
                        <p className="text-xs text-yellow-800 dark:text-yellow-200 text-center">
                            Reconnecting to notification service...
                        </p>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
}
