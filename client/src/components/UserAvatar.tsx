import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

interface UserAvatarProps {
  username?: string;
  imageUrl?: string;
  isAnonymous?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-16 w-16",
};

export function UserAvatar({
  username,
  imageUrl,
  isAnonymous = true,
  size = "md",
}: UserAvatarProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Avatar className={sizeClasses[size]} data-testid="user-avatar">
      {!isAnonymous && imageUrl && <AvatarImage src={imageUrl} alt={username} />}
      <AvatarFallback className="bg-muted">
        {isAnonymous ? (
          <User className={size === "lg" ? "h-8 w-8" : "h-4 w-4"} />
        ) : username ? (
          getInitials(username)
        ) : (
          <User className={size === "lg" ? "h-8 w-8" : "h-4 w-4"} />
        )}
      </AvatarFallback>
    </Avatar>
  );
}
