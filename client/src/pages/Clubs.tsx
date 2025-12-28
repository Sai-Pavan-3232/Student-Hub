import { ClubCard } from "@/components/ClubCard";
import { EventCard } from "@/components/EventCard";
import { SearchBar } from "@/components/SearchBar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import { useLocation } from "wouter";

// todo: remove mock functionality
const mockClubs = [
  {
    id: "1",
    name: "E-DAM IARE ",
    description: "Join us for coding workshops, hackathons, and networking events with industry professionals.",
    membersCount: 234,
    category: "Technology",
  },
  {
    id: "2",
    name: "E-Cell IARE",
    description: "Connect with like-minded students, learn from founders, and launch your own startup.",
    membersCount: 156,
    category: "Business and Entrepreneurship",
  },
  {
    id: "3",
    name: "GDG IARE",
    description: "Develop new webistes and technology , improve your skills build up your resume .",
    membersCount: 89,
    category: "Technology",
  },
  {
    id: "4",
    name: "Pixels IARE",
    description: "Take your photography skills to the next level with workshops, photo walks, and exhibitions.",
    membersCount: 112,
    category: "Photography",
  },
  {
    id: "5",
    name: "Rhapsody",
    description: "The music club .",
    membersCount: 178,
    category: "music",
  },
  {
    id: "6",
    name: "Bakasura The Foodie Club",
    description: "The Foodie Club.",
    membersCount: 145,
    category: "lifestyle",
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
  const [, setLocation] = useLocation();

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
                  onView={(id) => setLocation(`/clubs/${id}`)}
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
