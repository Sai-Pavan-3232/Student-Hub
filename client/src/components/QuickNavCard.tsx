import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { Link } from "wouter";

interface QuickNavCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  color?: string;
}

export function QuickNavCard({
  title,
  description,
  icon: Icon,
  href,
  color = "primary",
}: QuickNavCardProps) {
  const colorClasses: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    purple: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    emerald: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
    orange: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
  };

  return (
    <Link href={href}>
      <Card
        className="hover-elevate cursor-pointer h-full"
        data-testid={`quick-nav-${title.toLowerCase().replace(/\s+/g, "-")}`}
      >
        <CardContent className="p-6 flex flex-col items-center text-center">
          <div className={`h-12 w-12 rounded-lg ${colorClasses[color]} flex items-center justify-center mb-4`}>
            <Icon className="h-6 w-6" />
          </div>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
