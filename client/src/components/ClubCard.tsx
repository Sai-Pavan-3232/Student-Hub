import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { useState } from "react";

interface ClubCardProps {
  id: string;
  name: string;
  description: string;
  membersCount: number;
  category: string;
  onJoin?: (id: string) => void;
  onView?: (id: string) => void;
}

export function ClubCard({
  id,
  name,
  description,
  membersCount,
  category,
  onJoin,
  onView,
}: ClubCardProps) {
  const [joined, setJoined] = useState(false);
  const [members, setMembers] = useState(membersCount);

  const handleJoin = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!joined) {
      setJoined(true);
      setMembers(members + 1);
      onJoin?.(id);
    }
  };

  return (
    <Card
      className="hover-elevate cursor-pointer"
      onClick={() => onView?.(id)}
      data-testid={`club-card-${id}`}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="h-14 w-14 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <Users className="h-7 w-7" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
              {category}
            </span>
            <h3 className="font-semibold mt-1">{name}</h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {description}
            </p>
            <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{members} members</span>
            </div>
          </div>
        </div>
        <Button
          variant={joined ? "secondary" : "default"}
          className="w-full mt-4"
          onClick={handleJoin}
          disabled={joined}
          data-testid={`button-join-${id}`}
        >
          {joined ? "Joined" : "Join Club"}
        </Button>
      </CardContent>
    </Card>
  );
}
