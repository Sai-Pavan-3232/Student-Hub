import { UpcomingEvents } from "../UpcomingEvents";

export default function UpcomingEventsExample() {
  return (
    <div className="max-w-xs">
      <UpcomingEvents
        onViewAll={() => console.log("View all events")}
        onEventClick={(id) => console.log("Event clicked:", id)}
      />
    </div>
  );
}
