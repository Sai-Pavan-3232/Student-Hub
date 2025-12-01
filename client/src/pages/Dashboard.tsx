import { HeroSection } from "@/components/HeroSection";
import { StatCard } from "@/components/StatCard";
import { QuickNavCard } from "@/components/QuickNavCard";
import { ThreadCard } from "@/components/ThreadCard";
import { TodoWidget } from "@/components/TodoWidget";
import { TrendingTopics } from "@/components/TrendingTopics";
import { UpcomingEvents } from "@/components/UpcomingEvents";
import { SuggestedMentors } from "@/components/SuggestedMentors";
import { Users, MessageSquare, GraduationCap, BookOpen, Calendar } from "lucide-react";

// todo: remove mock functionality
const recentThreads = [
  {
    id: "1",
    title: "Best study techniques for finals week?",
    category: "academic" as const,
    author: "Anonymous",
    preview: "I'm struggling with my study schedule and looking for tips on how to effectively prepare for multiple exams.",
    repliesCount: 24,
    likesCount: 47,
    lastActivity: "2h ago",
  },
  {
    id: "2",
    title: "Anyone else feeling overwhelmed this semester?",
    category: "mental-health" as const,
    author: "Anonymous",
    preview: "First year here and it's been tough adjusting. Just wanted to share and see if others relate.",
    repliesCount: 18,
    likesCount: 63,
    lastActivity: "4h ago",
  },
  {
    id: "3",
    title: "Looking for study group partners for Calc II",
    category: "academic" as const,
    author: "Anonymous",
    preview: "Would love to find some people to study with before the midterm. Library or Zoom works!",
    repliesCount: 12,
    likesCount: 28,
    lastActivity: "5h ago",
  },
];

export default function Dashboard() {
  return (
    <div className="p-4 md:p-6 pb-20 md:pb-6" data-testid="page-dashboard">
      <HeroSection username="Anonymous Student" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <QuickNavCard
          title="Forums"
          description="Join discussions"
          icon={MessageSquare}
          href="/forums"
          color="primary"
        />
        <QuickNavCard
          title="Resources"
          description="Study materials"
          icon={BookOpen}
          href="/resources"
          color="purple"
        />
        <QuickNavCard
          title="Events"
          description="Campus activities"
          icon={Calendar}
          href="/clubs"
          color="emerald"
        />
        <QuickNavCard
          title="Mentorship"
          description="Get guidance"
          icon={GraduationCap}
          href="/mentorship"
          color="orange"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        <StatCard
          title="Active Students"
          value={1247}
          icon={Users}
          description="+12% this week"
        />
        <StatCard
          title="Forum Threads"
          value={384}
          icon={MessageSquare}
          description="23 new today"
        />
        <StatCard
          title="Active Mentors"
          value={89}
          icon={GraduationCap}
          description="Ready to help"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold">Recent Discussions</h2>
          {recentThreads.map((thread) => (
            <ThreadCard
              key={thread.id}
              {...thread}
              onClick={() => console.log("Thread clicked:", thread.id)}
            />
          ))}
        </div>

        <div className="space-y-4">
          <TodoWidget />
          <TrendingTopics onTopicClick={(id) => console.log("Topic clicked:", id)} />
          <UpcomingEvents
            onViewAll={() => console.log("View all events")}
            onEventClick={(id) => console.log("Event clicked:", id)}
          />
          <SuggestedMentors
            onViewAll={() => console.log("View all mentors")}
            onMentorClick={(id) => console.log("Mentor clicked:", id)}
          />
        </div>
      </div>
    </div>
  );
}
