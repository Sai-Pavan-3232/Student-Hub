import { HeroSection } from "@/components/HeroSection";
import { QuickNavCard } from "@/components/QuickNavCard";
import { TodoWidget } from "@/components/TodoWidget";
import { UpcomingEvents } from "@/components/UpcomingEvents";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, GraduationCap, BookOpen, Package, Smile, Newspaper } from "lucide-react";

// todo: remove mock functionality

export default function Dashboard() {
  return (
    <div className="p-4 md:p-6 pb-20 md:pb-6" data-testid="page-dashboard">
      <HeroSection username="Anonymous Student" />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
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
          title="Club Space"
          description="Explore student clubs"
          icon={GraduationCap}
          href="/clubs"
          color="emerald"
        />
        {/* Mentorship quick nav removed */}
        <QuickNavCard
          title="Lost & Found"
          description="Report or reclaim items"
          icon={Package}
          href="/lost-and-found"
          color="emerald"
        />
        <QuickNavCard
          title="Memes"
          description="Lighten up with a few memes"
          icon={Smile}
          href="/memes"
          color="purple"
        />
        <QuickNavCard
          title="News"
          description="What's happening on campus"
          icon={Newspaper}
          href="/news"
          color="primary"
        />
      </div>

      

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="aspect-square">
          <Card className="h-full">
            <CardContent className="h-full p-4">
              <TodoWidget />
            </CardContent>
          </Card>
        </div>

        <div className="aspect-square">
          <Card className="h-full">
            <CardContent className="h-full p-4">
              <UpcomingEvents
                onViewAll={() => console.log("View all events")}
                onEventClick={(id) => console.log("Event clicked:", id)}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
