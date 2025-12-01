import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "./UserAvatar";
import { CategoryBadge } from "./CategoryBadge";
import { MessageSquare, UserPlus } from "lucide-react";
import { useState } from "react";

interface ProfileCardProps {
  id: string;
  username: string;
  year: string;
  interests: string[];
  isMentor?: boolean;
  isAnonymous?: boolean;
  onConnect?: (id: string) => void;
  onMessage?: (id: string) => void;
}

export function ProfileCard({
  id,
  username,
  year,
  interests,
  isMentor = false,
  isAnonymous = true,
  onConnect,
  onMessage,
}: ProfileCardProps) {
  const [connected, setConnected] = useState(false);

  const handleConnect = () => {
    setConnected(true);
    onConnect?.(id);
  };

  return (
    <Card className="hover-elevate" data-testid={`profile-card-${id}`}>
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          <UserAvatar username={username} isAnonymous={isAnonymous} size="lg" />
          <h3 className="mt-4 font-semibold">{username}</h3>
          <p className="text-sm text-muted-foreground">{year}</p>

          <div className="flex flex-wrap justify-center gap-1.5 mt-3">
            {isMentor && <CategoryBadge category="mentor" />}
            {year.toLowerCase().includes("senior") && <CategoryBadge category="senior" />}
            <CategoryBadge category="active" />
          </div>

          <div className="flex flex-wrap justify-center gap-1 mt-3">
            {interests.slice(0, 3).map((interest) => (
              <span
                key={interest}
                className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground"
              >
                {interest}
              </span>
            ))}
          </div>

          <div className="flex gap-2 mt-4 w-full">
            <Button
              variant={connected ? "secondary" : "default"}
              size="sm"
              className="flex-1"
              onClick={handleConnect}
              disabled={connected}
              data-testid={`button-connect-${id}`}
            >
              <UserPlus className="h-4 w-4 mr-1" />
              {connected ? "Connected" : "Connect"}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onMessage?.(id)}
              data-testid={`button-message-${id}`}
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
