import { Users } from "lucide-react";

interface LogoProps {
  collapsed?: boolean;
}

export function Logo({ collapsed = false }: LogoProps) {
  return (
    <div className="flex items-center gap-2" data-testid="logo">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Users className="h-5 w-5" />
      </div>
      {!collapsed && (
        <span className="text-lg font-semibold tracking-tight">The Student Hub</span>
      )}
    </div>
  );
}
