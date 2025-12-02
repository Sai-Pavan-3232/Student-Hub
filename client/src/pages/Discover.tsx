import { ProfileCard } from "@/components/ProfileCard";
import { SearchBar } from "@/components/SearchBar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Sparkles } from "lucide-react";
import { useState } from "react";

// todo: remove mock functionality
const mockProfiles = [
  {
    id: "1",
    username: "Anonymous Student",
    year: "Senior",
    interests: ["Computer Science", "AI", "Music"],
    isMentor: true,
  },
  {
    id: "2",
    username: "Anonymous Student",
    year: "Junior",
    interests: ["Biology", "Research", "Hiking"],
    isMentor: false,
  },
  {
    id: "3",
    username: "Anonymous Student",
    year: "Sophomore",
    interests: ["Business", "Marketing", "Photography"],
    isMentor: false,
  },
  {
    id: "4",
    username: "Anonymous Student",
    year: "Freshman",
    interests: ["Engineering", "Robotics", "Gaming"],
    isMentor: false,
  },
  {
    id: "5",
    username: "Anonymous Student",
    year: "Senior",
    interests: ["Psychology", "Mental Health", "Volunteering"],
    isMentor: true,
  },
  {
    id: "6",
    username: "Anonymous Student",
    year: "Junior",
    interests: ["Art", "Design", "Film"],
    isMentor: false,
  },
  {
    id: "7",
    username: "Anonymous Student",
    year: "Sophomore",
    interests: ["Chemistry", "Pre-Med", "Tennis"],
    isMentor: false,
  },
  {
    id: "8",
    username: "Anonymous Student",
    year: "Freshman",
    interests: ["Writing", "Journalism", "Politics"],
    isMentor: false,
  },
];

const interestFilters = [
  "All",
  "Computer Science",
  "Business",
  "Engineering",
  "Arts",
  "Sciences",
  "Pre-Med",
];

export default function Discover() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInterest, setSelectedInterest] = useState("All");

  const filteredProfiles = mockProfiles.filter((profile) => {
    const matchesSearch = profile.interests.some((interest) =>
      interest.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const matchesFilter = selectedInterest === "All" ||
      profile.interests.some((interest) =>
        interest.toLowerCase().includes(selectedInterest.toLowerCase())
      );
    return (searchQuery === "" || matchesSearch) && matchesFilter;
  });

  return (
    <div className="p-4 md:p-6 pb-20 md:pb-6" data-testid="page-discover">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Discover</h1>
        <p className="text-muted-foreground mt-1">Find and connect with students who share your interests</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Smart Matching
          </CardTitle>
          <CardDescription>
            We match you with students based on your interests, courses, and goals while keeping your identity private.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Users className="h-12 w-12 text-primary/20" />
          <div>
            <p className="font-medium">247 students match your interests</p>
            <p className="text-sm text-muted-foreground">Update your profile to find more connections</p>
          </div>
        </CardContent>
      </Card>

      <div className="mb-4">
        <SearchBar
          placeholder="Search by interests..."
          onSearch={setSearchQuery}
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {interestFilters.map((filter) => (
          <Button
            key={filter}
            variant={selectedInterest === filter ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedInterest(filter)}
            data-testid={`filter-${filter.toLowerCase().replace(/\s+/g, "-")}`}
          >
            {filter}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProfiles.length > 0 ? (
          filteredProfiles.map((profile) => (
            <ProfileCard
              key={profile.id}
              {...profile}
              isAnonymous={true}
              onConnect={(id) => console.log("Connect:", id)}
              onMessage={(id) => console.log("Message:", id)}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            <p>No students found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
