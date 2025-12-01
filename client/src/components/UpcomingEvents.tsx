import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
}

interface UpcomingEventsProps {
  events?: Event[];
  onViewAll?: () => void;
  onEventClick?: (id: string) => void;
}

// todo: remove mock functionality
const defaultEvents: Event[] = [
  { id: "1", title: "Career Fair", date: "Dec 15", time: "10 AM", location: "Student Center" },
  { id: "2", title: "Study Group Meetup", date: "Dec 16", time: "3 PM", location: "Library" },
  { id: "3", title: "Mental Health Workshop", date: "Dec 18", time: "2 PM", location: "Room 201" },
];

export function UpcomingEvents({
  events = defaultEvents,
  onViewAll,
  onEventClick,
}: UpcomingEventsProps) {
  return (
    <Card data-testid="upcoming-events">
      <CardHeader className="pb-3 flex flex-row items-center justify-between gap-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          Upcoming Events
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onViewAll} data-testid="button-view-all-events">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {events.map((event) => (
            <button
              key={event.id}
              onClick={() => onEventClick?.(event.id)}
              className="flex items-start gap-3 w-full p-2 rounded-md hover-elevate text-left"
              data-testid={`event-${event.id}`}
            >
              <div className="flex flex-col items-center justify-center h-10 w-10 rounded-lg bg-primary text-primary-foreground text-xs">
                <span className="font-bold">{event.date.split(" ")[0]}</span>
                <span>{event.date.split(" ")[1]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{event.title}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {event.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {event.location}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
