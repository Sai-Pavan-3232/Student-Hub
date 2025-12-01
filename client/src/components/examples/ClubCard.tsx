import { ClubCard } from "../ClubCard";

export default function ClubCardExample() {
  return (
    <div className="max-w-sm">
      <ClubCard
        id="1"
        name="Computer Science Society"
        description="Join us for coding workshops, hackathons, and networking events with industry professionals."
        membersCount={234}
        category="Technology"
        onJoin={(id) => console.log("Join club:", id)}
        onView={(id) => console.log("View club:", id)}
      />
    </div>
  );
}
