import { ClubCard } from "@/components/ClubCard";
import { EventCard } from "@/components/EventCard";
import { SearchBar } from "@/components/SearchBar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";

// todo: remove mock functionality
const mockClubs = [
  {
    id: "1",
    name: "Computer Science Society",
    description: "Join us for coding workshops, hackathons, and networking events with industry professionals.",
    membersCount: 234,
    category: "Technology",
  },
  {
    id: "2",
    name: "Mental Health Awareness",
    description: "A safe space to discuss mental health topics and support each other through college challenges.",
    membersCount: 156,
    category: "Wellness",
  },
  {
    id: "3",
    name: "Photography Club",
    description: "Explore your creative side! Weekly photo walks, editing workshops, and gallery exhibitions.",
    membersCount: 89,
    category: "Arts",
  },
  {
    id: "4",
    name: "Debate Society",
    description: "Sharpen your public speaking skills and engage in thought-provoking discussions.",
    membersCount: 112,
    category: "Academic",
  },
  {
    id: "5",
    name: "Volunteer Corps",
    description: "Make a difference in the community through various volunteer opportunities.",
    membersCount: 178,
    category: "Community Service",
  },
  {
    id: "6",
    name: "Entrepreneurship Club",
    description: "Connect with like-minded students, learn from founders, and launch your own startup.",
    membersCount: 145,
    category: "Business",
  },
];

const mockEvents = [
  {
    id: "1",
    title: "Career Fair 2024",
    description: "Meet with top companies and explore internship and job opportunities.",
    date: "15 Dec",
    time: "10:00 AM - 4:00 PM",
    location: "University Center",
    attendingCount: 342,
    clubName: "Career Services",
  },
  {
    id: "2",
    title: "Hackathon: Build for Good",
    description: "24-hour coding challenge to create solutions for social impact. All skill levels welcome!",
    date: "20 Dec",
    time: "6:00 PM",
    location: "Engineering Building",
    attendingCount: 128,
    clubName: "Computer Science Society",
  },
  {
    id: "3",
    title: "Mental Health Workshop",
    description: "Learn stress management techniques and self-care practices for finals season.",
    date: "18 Dec",
    time: "2:00 PM - 4:00 PM",
    location: "Wellness Center",
    attendingCount: 67,
    clubName: "Mental Health Awareness",
  },
  {
    id: "4",
    title: "Winter Art Exhibition",
    description: "Showcase of student artwork from the fall semester. Refreshments provided.",
    date: "22 Dec",
    time: "5:00 PM - 8:00 PM",
    location: "Arts Gallery",
    attendingCount: 89,
    clubName: "Photography Club",
  },
];

export default function Clubs() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredClubs = mockClubs.filter((club) =>
    club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    club.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredEvents = mockEvents.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 pb-20 md:pb-6" data-testid="page-clubs">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Clubs & Events</h1>
        <p className="text-muted-foreground mt-1">Discover communities and campus activities</p>
      </div>

      <div className="mb-4">
        <SearchBar
          placeholder="Search clubs and events..."
          onSearch={setSearchQuery}
        />
      </div>

      <Tabs defaultValue="clubs" className="w-full">
        <TabsList data-testid="clubs-tabs">
          <TabsTrigger value="clubs" data-testid="tab-clubs">Clubs</TabsTrigger>
          <TabsTrigger value="events" data-testid="tab-events">Events</TabsTrigger>
        </TabsList>

        <TabsContent value="clubs" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClubs.length > 0 ? (
              filteredClubs.map((club) => (
                <ClubCard
                  key={club.id}
                  {...club}
                  onJoin={(id) => console.log("Join club:", id)}
                  onView={(id) => console.log("View club:", id)}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                <p>No clubs found matching your search.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="events" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  {...event}
                  onRegister={(id) => console.log("Register for event:", id)}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                <p>No events found matching your search.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
