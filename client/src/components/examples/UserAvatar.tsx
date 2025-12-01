import { UserAvatar } from "../UserAvatar";

export default function UserAvatarExample() {
  return (
    <div className="flex items-center gap-4">
      <UserAvatar isAnonymous size="sm" />
      <UserAvatar isAnonymous size="md" />
      <UserAvatar isAnonymous size="lg" />
      <UserAvatar username="John Doe" isAnonymous={false} size="md" />
    </div>
  );
}
