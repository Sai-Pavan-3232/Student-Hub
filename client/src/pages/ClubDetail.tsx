import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EventCard } from "@/components/EventCard";
import { UserAvatar } from "@/components/UserAvatar";

type Club = {
  id: string;
  name: string;
  description: string;
  membersCount: number;
  category: string;
};

const mockClubs: Club[] = [
  { id: "1", name: "E-DAM IARE ", description: "Join us for coding workshops, hackathons, and networking events with industry professionals.", membersCount: 234, category: "Technology" },
  { id: "2", name: "E-Cell IARE", description: "Connect with like-minded students, learn from founders, and launch your own startup.", membersCount: 156, category: "Business and Entrepreneurship" },
  { id: "3", name: "GDG IARE", description: "Develop new webistes and technology , improve your skills build up your resume .", membersCount: 89, category: "Technology" },
];

const mockMembersByClub: Record<string, { id: string; name: string; role?: string }[]> = {
  "1": [
    { id: "m1", name: "Hitesh Reddy ", role: "President" },
    { id: "m2", name: "Yash raj", role: "Vice President" },

  ],
  "2": [
    { id: "m4", name: "Govind Sharma", role: "President" },
    { id: "m5", name: "Rex Ryan", role: "Marketing" },
  ],
  "3": [
    { id: "m6", name: "Fiona G.", role: "Lead" },
  ],
};

const mockEvents = [
  { id: "e1", title: "Hackathon: Build for Good", description: "24-hour coding challenge.", date: "20 Dec", time: "6:00 PM", location: "Engineering Building", attendingCount: 128, clubName: "E-DAM IARE " },
  { id: "e2", title: "Startup Weekend", description: "Pitch, build, and launch.", date: "10 Jan", time: "9:00 AM", location: "Incubator", attendingCount: 90, clubName: "E-Cell IARE" },
  { id: "e3", title: "Web Dev Workshop", description: "React + Vite workshop.", date: "5 Feb", time: "2:00 PM", location: "Lab 1", attendingCount: 60, clubName: "GDG IARE" },
];

export default function ClubDetail() {
  const [match, params] = useRoute("/clubs/:id");
  const id = params?.id ?? "";

  const [club, setClub] = useState<Club | null>(null);

  useEffect(() => {
    const found = mockClubs.find((c) => c.id === id) ?? null;
    setClub(found);
  }, [id]);

  if (!id) return <div className="p-4">No club selected.</div>;

  if (!club) return <div className="p-4">Club not found.</div>;

  const members = mockMembersByClub[id] ?? [];
  const events = mockEvents.filter((e) => e.clubName === club.name);

  return (
    <div className="p-4 md:p-6 pb-20 md:pb-6" data-testid={`page-club-${id}`}>
      <div className="mb-4">
        <Link href="/clubs" className="text-sm text-muted-foreground">← Back to clubs</Link>
        <h1 className="text-2xl font-bold mt-2">{club.name}</h1>
        <p className="text-muted-foreground mt-1">{club.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Card className="mb-4">
            <CardContent>
              <h3 className="text-lg font-semibold">Upcoming / Past Events</h3>
              <div className="mt-3 grid grid-cols-1 gap-3">
                {events.length > 0 ? (
                  events.map((ev) => (
                    <EventCard key={ev.id} {...ev} onRegister={() => console.log("register", ev.id)} />
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground py-6">No events found for this club.</div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <h3 className="text-lg font-semibold">Members</h3>
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {members.map((m) => (
                  <div key={m.id} className="flex items-center gap-3">
                    <UserAvatar username={m.name} isAnonymous={false} size="sm" />
                    <div>
                      <div className="font-medium text-sm">{m.name}</div>
                      <div className="text-xs text-muted-foreground">{m.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="mb-4">
            <CardContent>
              <h3 className="text-lg font-semibold">About</h3>
              <p className="text-sm text-muted-foreground mt-2">Category: {club.category}</p>
              <p className="text-sm text-muted-foreground mt-2">Members: {club.membersCount}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <h3 className="text-lg font-semibold">Links</h3>
              <div className="mt-3 flex flex-col gap-2">
                <a href={`https://instagram.com/${club.name.replace(/\s+/g, "").toLowerCase()}`} target="_blank" rel="noreferrer" className="inline-block text-left">
                  <Button className="w-full">Instagram</Button>
                </a>
                <a href={`https://chat.whatsapp.com/${club.id}`} target="_blank" rel="noreferrer" className="inline-block text-left">
                  <Button className="w-full">WhatsApp Community</Button>
                </a>
                <a href={`https://example.com/${club.name.replace(/\s+/g, "-").toLowerCase()}`} target="_blank" rel="noreferrer" className="inline-block text-left">
                  <Button className="w-full">Website</Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
