import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "./UserAvatar";
import { CategoryBadge } from "./CategoryBadge";
import { Star, Calendar, MessageSquare } from "lucide-react";
import { useState } from "react";

interface MentorCardProps {
  id: string;
  username: string;
  expertise: string[];
  rating: number;
  availability: string;
  sessionsCompleted: number;
  bio: string;
  onRequestMentorship?: (id: string) => void;
}

export function MentorCard({
  id,
  username,
  expertise,
  rating,
  availability,
  sessionsCompleted,
  bio,
  onRequestMentorship,
}: MentorCardProps) {
  const [requested, setRequested] = useState(false);

  const handleRequest = () => {
    setRequested(true);
    onRequestMentorship?.(id);
  };

  return (
    <Card className="hover-elevate" data-testid={`mentor-card-${id}`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <UserAvatar username={username} isAnonymous={true} size="lg" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold">{username}</h3>
              <CategoryBadge category="mentor" />
              <CategoryBadge category="verified" />
            </div>

            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                {rating.toFixed(1)}
              </span>
              <span>{sessionsCompleted} sessions</span>
            </div>

            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
              {bio}
            </p>

            <div className="flex flex-wrap gap-1.5 mt-3">
              {expertise.map((skill) => (
                <span
                  key={skill}
                  className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
                >
                  {skill}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{availability}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button
            variant={requested ? "secondary" : "default"}
            className="flex-1"
            onClick={handleRequest}
            disabled={requested}
            data-testid={`button-request-mentorship-${id}`}
          >
            {requested ? "Request Sent" : "Request Mentorship"}
          </Button>
          <Button variant="outline" size="icon" data-testid={`button-message-mentor-${id}`}>
            <MessageSquare className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
