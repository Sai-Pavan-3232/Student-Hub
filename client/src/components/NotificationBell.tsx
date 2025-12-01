import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface Notification {
  id: string;
  type: "message" | "forum" | "event" | "mentorship";
  title: string;
  description: string;
  time: string;
  read: boolean;
}

interface NotificationBellProps {
  notifications?: Notification[];
}

// todo: remove mock functionality
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "forum",
    title: "New reply to your thread",
    description: "Someone replied to 'Study tips for finals'",
    time: "5m ago",
    read: false,
  },
  {
    id: "2",
    type: "mentorship",
    title: "Mentorship request accepted",
    description: "Alex has accepted your mentorship request",
    time: "1h ago",
    read: false,
  },
  {
    id: "3",
    type: "event",
    title: "Event reminder",
    description: "Career Fair starts in 2 hours",
    time: "2h ago",
    read: true,
  },
];

export function NotificationBell({ notifications = mockNotifications }: NotificationBellProps) {
  const [notifs, setNotifs] = useState(notifications);
  const unreadCount = notifs.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifs(notifs.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllAsRead = () => {
    setNotifs(notifs.map((n) => ({ ...n, read: true })));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" data-testid="button-notifications">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          Notifications
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-xs text-muted-foreground"
              onClick={markAllAsRead}
              data-testid="button-mark-all-read"
            >
              Mark all read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifs.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No notifications
          </div>
        ) : (
          notifs.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className={`flex flex-col items-start gap-1 p-3 cursor-pointer ${
                !notification.read ? "bg-muted/50" : ""
              }`}
              onClick={() => markAsRead(notification.id)}
              data-testid={`notification-item-${notification.id}`}
            >
              <div className="flex items-center gap-2 w-full">
                <span className="font-medium text-sm">{notification.title}</span>
                {!notification.read && (
                  <span className="h-2 w-2 rounded-full bg-primary ml-auto" />
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {notification.description}
              </span>
              <span className="text-xs text-muted-foreground">{notification.time}</span>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
