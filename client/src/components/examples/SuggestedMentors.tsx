import { SuggestedMentors } from "../SuggestedMentors";

export default function SuggestedMentorsExample() {
  return (
    <div className="max-w-xs">
      <SuggestedMentors
        onViewAll={() => console.log("View all mentors")}
        onMentorClick={(id) => console.log("Mentor clicked:", id)}
      />
    </div>
  );
}
