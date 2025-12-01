import { Card, CardContent } from "@/components/ui/card";
import { UserAvatar } from "./UserAvatar";
import { CategoryBadge } from "./CategoryBadge";
import { MessageSquare, ThumbsUp, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ThreadCardProps {
  id: string;
  title: string;
  category: "academic" | "social" | "mental-health" | "clubs";
  author: string;
  preview: string;
  repliesCount: number;
  likesCount: number;
  lastActivity: string;
  isAnonymous?: boolean;
  onClick?: () => void;
}

export function ThreadCard({
  id,
  title,
  category,
  author,
  preview,
  repliesCount,
  likesCount,
  lastActivity,
  isAnonymous = true,
  onClick,
}: ThreadCardProps) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(likesCount);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  return (
    <Card
      className="hover-elevate cursor-pointer"
      onClick={onClick}
      data-testid={`thread-card-${id}`}
    >
      <CardContent className="p-4">
        <div className="flex gap-4">
          <UserAvatar username={author} isAnonymous={isAnonymous} size="sm" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <CategoryBadge category={category} />
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {lastActivity}
              </span>
            </div>
            <h3 className="font-semibold mt-2 truncate">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {preview}
            </p>
            <div className="flex items-center gap-4 mt-3">
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 px-2 ${liked ? "text-primary" : ""}`}
                onClick={handleLike}
                data-testid={`button-like-${id}`}
              >
                <ThumbsUp className={`h-4 w-4 mr-1 ${liked ? "fill-current" : ""}`} />
                {likes}
              </Button>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                {repliesCount} replies
              </span>
              <span className="text-sm text-muted-foreground ml-auto">
                by {author}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
