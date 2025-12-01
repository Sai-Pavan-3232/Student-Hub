import { StatCard } from "../StatCard";
import { Users, MessageSquare, GraduationCap } from "lucide-react";

export default function StatCardExample() {
  return (
    <div className="grid grid-cols-3 gap-4">
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
  );
}
