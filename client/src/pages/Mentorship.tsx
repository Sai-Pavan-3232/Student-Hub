import { MentorCard } from "@/components/MentorCard";
import { SearchBar } from "@/components/SearchBar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Users, Clock, MessageSquare } from "lucide-react";
import { useState } from "react";

// todo: remove mock functionality
const mockMentors = [
  {
    id: "1",
    username: "Senior CS Mentor",
    expertise: ["Computer Science", "Career Advice", "Research"],
    rating: 4.8,
    availability: "Weekdays 3-6 PM",
    sessionsCompleted: 42,
    bio: "Senior CS student passionate about helping freshmen navigate their first year. I've been through the struggles and want to make your journey easier.",
  },
  {
    id: "2",
    username: "Research Assistant",
    expertise: ["Academic Writing", "Research Methods", "Grant Applications"],
    rating: 4.9,
    availability: "Tue/Thu 2-5 PM",
    sessionsCompleted: 28,
    bio: "Currently pursuing my graduate degree. I can help you with research opportunities, academic writing, and finding your research interests.",
  },
  {
    id: "3",
    username: "Engineering Mentor",
    expertise: ["Engineering", "Internship Prep", "Project Management"],
    rating: 4.7,
    availability: "Mon/Wed 4-7 PM",
    sessionsCompleted: 35,
    bio: "Interned at multiple top tech companies. Happy to share interview tips, resume advice, and help you land your dream internship.",
  },
  {
    id: "4",
    username: "Pre-Med Advisor",
    expertise: ["Pre-Med", "MCAT Prep", "Medical School Apps"],
    rating: 4.9,
    availability: "Weekends 10 AM - 2 PM",
    sessionsCompleted: 56,
    bio: "Medical student who went through the pre-med journey. Let me help you navigate coursework, volunteering, and med school applications.",
  },
  {
    id: "5",
    username: "Business Mentor",
    expertise: ["Business", "Entrepreneurship", "Networking"],
    rating: 4.6,
    availability: "Flexible schedule",
    sessionsCompleted: 23,
    bio: "Started my own business during sophomore year. I can help you with business ideas, pitching, and building professional networks.",
  },
];

export default function Mentorship() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMentors = mockMentors.filter((mentor) =>
    mentor.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mentor.expertise.some((exp) => exp.toLowerCase().includes(searchQuery.toLowerCase())) ||
    mentor.bio.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 pb-20 md:pb-6" data-testid="page-mentorship">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Mentorship</h1>
        <p className="text-muted-foreground mt-1">Connect with experienced students for guidance</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">89</p>
              <p className="text-xs text-muted-foreground">Active Mentors</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">256</p>
              <p className="text-xs text-muted-foreground">Students Helped</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">1,240</p>
              <p className="text-xs text-muted-foreground">Sessions Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">4.8</p>
              <p className="text-xs text-muted-foreground">Average Rating</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Become a Mentor</CardTitle>
          <CardDescription>
            Share your experience and help fellow students succeed in their academic journey.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button data-testid="button-become-mentor">Apply to be a Mentor</Button>
        </CardContent>
      </Card>

      <div className="mb-4">
        <SearchBar
          placeholder="Search mentors by name or expertise..."
          onSearch={setSearchQuery}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMentors.length > 0 ? (
          filteredMentors.map((mentor) => (
            <MentorCard
              key={mentor.id}
              {...mentor}
              onRequestMentorship={(id) => console.log("Request mentorship:", id)}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            <p>No mentors found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
