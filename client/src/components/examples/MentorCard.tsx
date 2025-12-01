import { MentorCard } from "../MentorCard";

export default function MentorCardExample() {
  return (
    <div className="max-w-md">
      <MentorCard
        id="1"
        username="Senior Mentor"
        expertise={["Computer Science", "Career Advice", "Research"]}
        rating={4.8}
        availability="Weekdays 3-6 PM"
        sessionsCompleted={42}
        bio="I'm a senior CS student passionate about helping freshmen navigate their first year. I've been through the struggles and want to make your journey easier."
        onRequestMentorship={(id) => console.log("Request mentorship:", id)}
      />
    </div>
  );
}
