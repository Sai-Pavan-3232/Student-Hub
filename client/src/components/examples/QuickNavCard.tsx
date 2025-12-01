import { QuickNavCard } from "../QuickNavCard";
import { MessageSquare, BookOpen, Calendar, GraduationCap } from "lucide-react";

export default function QuickNavCardExample() {
  return (
    <div className="grid grid-cols-4 gap-4">
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
  );
}
