import { ProfileCard } from "../ProfileCard";

export default function ProfileCardExample() {
  return (
    <div className="max-w-xs">
      <ProfileCard
        id="1"
        username="Anonymous Student"
        year="Senior"
        interests={["Computer Science", "AI", "Music"]}
        isMentor={true}
        isAnonymous={true}
        onConnect={(id) => console.log("Connect:", id)}
        onMessage={(id) => console.log("Message:", id)}
      />
    </div>
  );
}
