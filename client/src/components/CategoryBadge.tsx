import { Badge } from "@/components/ui/badge";

type CategoryType = "academic" | "social" | "mental-health" | "clubs" | "senior" | "verified" | "active";

interface CategoryBadgeProps {
  category: CategoryType;
}

const categoryStyles: Record<CategoryType, { className: string; label: string }> = {
  academic: { className: "bg-primary/10 text-primary border-primary/20", label: "Academic" },
  social: { className: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800", label: "Social" },
  "mental-health": { className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800", label: "Mental Health" },
  clubs: { className: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800", label: "Clubs" },
  senior: { className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800", label: "Senior" },
  verified: { className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800", label: "Verified" },
  active: { className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800", label: "Active" },
};

export function CategoryBadge({ category }: CategoryBadgeProps) {
  const style = categoryStyles[category];

  return (
    <Badge
      variant="outline"
      className={`${style.className} text-xs font-medium`}
      data-testid={`badge-${category}`}
    >
      {style.label}
    </Badge>
  );
}
