import { CategoryTabs } from "../CategoryTabs";

const tabs = [
  { value: "all", label: "All" },
  { value: "academic", label: "Academic" },
  { value: "social", label: "Social" },
  { value: "mental-health", label: "Mental Health" },
];

export default function CategoryTabsExample() {
  return (
    <CategoryTabs tabs={tabs} onTabChange={(tab) => console.log("Tab changed:", tab)}>
      {(activeTab) => (
        <div className="p-4 bg-muted rounded-lg">
          Content for {activeTab} tab
        </div>
      )}
    </CategoryTabs>
  );
}
