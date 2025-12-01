import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "./UserAvatar";

interface Mentor {
  id: string;
  username: string;
  expertise: string[];
  rating: number;
}

interface SuggestedMentorsProps {
  mentors?: Mentor[];
  onViewAll?: () => void;
  onMentorClick?: (id: string) => void;
}

// todo: remove mock functionality
const defaultMentors: Mentor[] = [
  { id: "1", username: "Senior CS Student", expertise: ["Programming", "Career"], rating: 4.9 },
  { id: "2", username: "Research Assistant", expertise: ["Research", "Writing"], rating: 4.8 },
  { id: "3", username: "TA Helper", expertise: ["Math", "Tutoring"], rating: 4.7 },
];

export function SuggestedMentors({
  mentors = defaultMentors,
  onViewAll,
  onMentorClick,
}: SuggestedMentorsProps) {
  return (
    <Card data-testid="suggested-mentors">
      <CardHeader className="pb-3 flex flex-row items-center justify-between gap-2">
        <CardTitle className="text-base flex items-center gap-2">
          <GraduationCap className="h-4 w-4 text-primary" />
          Suggested Mentors
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onViewAll} data-testid="button-view-all-mentors">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mentors.map((mentor) => (
            <button
              key={mentor.id}
              onClick={() => onMentorClick?.(mentor.id)}
              className="flex items-center gap-3 w-full p-2 rounded-md hover-elevate text-left"
              data-testid={`mentor-${mentor.id}`}
            >
              <UserAvatar size="sm" isAnonymous />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{mentor.username}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    {mentor.rating}
                  </span>
                  <span className="truncate">{mentor.expertise.join(", ")}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
