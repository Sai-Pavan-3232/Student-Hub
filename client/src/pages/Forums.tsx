import { ThreadCard } from "@/components/ThreadCard";
import { SearchBar } from "@/components/SearchBar";
import { CreateThreadDialog } from "@/components/CreateThreadDialog";
import { CategoryTabs } from "@/components/CategoryTabs";
import { TrendingTopics } from "@/components/TrendingTopics";
import { useState } from "react";
import { useLocation } from "wouter";

// todo: remove mock functionality
const mockThreads = [
  {
    id: "1",
    title: "Best study techniques for finals week?",
    category: "academic" as const,
    author: "Anonymous",
    preview: "I'm struggling with my study schedule and looking for tips on how to effectively prepare for multiple exams. Any advice from seniors would be greatly appreciated!",
    repliesCount: 24,
    likesCount: 47,
    lastActivity: "2h ago",
  },
  {
    id: "2",
    title: "Anyone else feeling overwhelmed this semester?",
    category: "mental-health" as const,
    author: "Anonymous",
    preview: "First year here and it's been tough adjusting. Just wanted to share and see if others relate. How do you cope with stress?",
    repliesCount: 18,
    likesCount: 63,
    lastActivity: "4h ago",
  },
  {
    id: "3",
    title: "Looking for study group partners for Calc II",
    category: "academic" as const,
    author: "Anonymous",
    preview: "Would love to find some people to study with before the midterm. Library or Zoom works for me!",
    repliesCount: 12,
    likesCount: 28,
    lastActivity: "5h ago",
  },
  {
    id: "4",
    title: "Weekend hangout at the campus cafe?",
    category: "social" as const,
    author: "Anonymous",
    preview: "Planning a casual meetup this Saturday. Anyone interested in joining? No pressure, just good vibes and coffee.",
    repliesCount: 31,
    likesCount: 52,
    lastActivity: "6h ago",
  },
  {
    id: "5",
    title: "Tips for managing anxiety before presentations",
    category: "mental-health" as const,
    author: "Anonymous",
    preview: "I have a big presentation coming up and I'm already nervous. What are some techniques you use to calm down?",
    repliesCount: 22,
    likesCount: 89,
    lastActivity: "8h ago",
  },
  {
    id: "6",
    title: "Computer Science Club hosting a hackathon!",
    category: "clubs" as const,
    author: "Anonymous",
    preview: "We're organizing a 24-hour hackathon next month. All skill levels welcome! Sign up details inside.",
    repliesCount: 45,
    likesCount: 112,
    lastActivity: "1d ago",
  },
];

const tabs = [
  { value: "all", label: "All" },
  { value: "academic", label: "Academic" },
  { value: "social", label: "Social" },
  { value: "mental-health", label: "Mental Health" },
  { value: "clubs", label: "Clubs" },
];

export default function Forums() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [, navigate] = useLocation();

  const filteredThreads = mockThreads.filter((thread) => {
    const matchesSearch = thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.preview.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || thread.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-4 md:p-6 pb-20 md:pb-6" data-testid="page-forums">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Discussion Forums</h1>
          <p className="text-muted-foreground mt-1">Share your thoughts and connect with peers</p>
        </div>
        <CreateThreadDialog onSubmit={(data) => console.log("New thread:", data)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="mb-4">
            <SearchBar
              placeholder="Search discussions..."
              onSearch={setSearchQuery}
            />
          </div>

          <CategoryTabs
            tabs={tabs}
            defaultValue="all"
            onTabChange={setActiveCategory}
          >
            {() => (
              <div className="space-y-4">
                {filteredThreads.length > 0 ? (
                  filteredThreads.map((thread) => (
                    <ThreadCard
                      key={thread.id}
                      {...thread}
                      onClick={() => navigate(`/forums/thread/${thread.id}`)}
                    />
                  ))
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>No discussions found matching your criteria.</p>
                  </div>
                )}
              </div>
            )}
          </CategoryTabs>
        </div>

        <div className="space-y-4">
          <TrendingTopics onTopicClick={(id) => console.log("Topic clicked:", id)} />
        </div>
      </div>
    </div>
  );
}
