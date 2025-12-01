import { EventCard } from "../EventCard";

export default function EventCardExample() {
  return (
    <div className="max-w-md">
      <EventCard
        id="1"
        title="Career Fair 2024"
        description="Meet with top companies and explore internship and job opportunities."
        date="15 Dec"
        time="10:00 AM - 4:00 PM"
        location="University Center"
        attendingCount={342}
        clubName="Career Services"
        onRegister={(id) => console.log("Register for event:", id)}
      />
    </div>
  );
}
