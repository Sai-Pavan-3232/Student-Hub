import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface Topic {
  id: string;
  name: string;
  postsCount: number;
}

interface TrendingTopicsProps {
  topics?: Topic[];
  onTopicClick?: (id: string) => void;
}

// todo: remove mock functionality
const defaultTopics: Topic[] = [
  { id: "1", name: "Finals Prep", postsCount: 127 },
  { id: "2", name: "Study Groups", postsCount: 89 },
  { id: "3", name: "Mental Health", postsCount: 76 },
  { id: "4", name: "Career Advice", postsCount: 64 },
  { id: "5", name: "Campus Life", postsCount: 52 },
];

export function TrendingTopics({
  topics = defaultTopics,
  onTopicClick,
}: TrendingTopicsProps) {
  return (
    <Card data-testid="trending-topics">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          Trending Topics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {topics.map((topic, index) => (
            <button
              key={topic.id}
              onClick={() => onTopicClick?.(topic.id)}
              className="flex items-center gap-3 w-full p-2 rounded-md hover-elevate text-left"
              data-testid={`topic-${topic.id}`}
            >
              <span className="text-sm font-medium text-muted-foreground w-5">
                #{index + 1}
              </span>
              <span className="flex-1 text-sm font-medium">{topic.name}</span>
              <span className="text-xs text-muted-foreground">
                {topic.postsCount} posts
              </span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
