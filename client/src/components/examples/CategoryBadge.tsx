import { CategoryBadge } from "../CategoryBadge";

export default function CategoryBadgeExample() {
  return (
    <div className="flex flex-wrap gap-2">
      <CategoryBadge category="academic" />
      <CategoryBadge category="social" />
      <CategoryBadge category="mental-health" />
      <CategoryBadge category="clubs" />
      <CategoryBadge category="mentor" />
      <CategoryBadge category="senior" />
      <CategoryBadge category="verified" />
      <CategoryBadge category="active" />
    </div>
  );
}
