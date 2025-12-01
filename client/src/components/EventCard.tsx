import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { useState } from "react";

interface EventCardProps {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  attendingCount: number;
  clubName?: string;
  onRegister?: (id: string) => void;
}

export function EventCard({
  id,
  title,
  description,
  date,
  time,
  location,
  attendingCount,
  clubName,
  onRegister,
}: EventCardProps) {
  const [registered, setRegistered] = useState(false);
  const [attending, setAttending] = useState(attendingCount);

  const handleRegister = () => {
    if (!registered) {
      setRegistered(true);
      setAttending(attending + 1);
      onRegister?.(id);
    }
  };

  return (
    <Card className="hover-elevate" data-testid={`event-card-${id}`}>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="flex flex-col items-center justify-center h-16 w-16 rounded-lg bg-primary text-primary-foreground">
            <span className="text-xl font-bold">{date.split(" ")[0]}</span>
            <span className="text-xs">{date.split(" ")[1]}</span>
          </div>
          <div className="flex-1 min-w-0">
            {clubName && (
              <span className="text-xs text-muted-foreground">{clubName}</span>
            )}
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {description}
            </p>
            <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {time}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {location}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {attending} attending
              </span>
            </div>
          </div>
        </div>
        <Button
          variant={registered ? "secondary" : "default"}
          size="sm"
          className="w-full mt-4"
          onClick={handleRegister}
          disabled={registered}
          data-testid={`button-register-${id}`}
        >
          <Calendar className="h-4 w-4 mr-1" />
          {registered ? "Registered" : "Register"}
        </Button>
      </CardContent>
    </Card>
  );
}
