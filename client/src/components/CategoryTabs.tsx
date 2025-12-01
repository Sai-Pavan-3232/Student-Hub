import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface Tab {
  value: string;
  label: string;
}

interface CategoryTabsProps {
  tabs: Tab[];
  defaultValue?: string;
  children: (activeTab: string) => React.ReactNode;
  onTabChange?: (value: string) => void;
}

export function CategoryTabs({
  tabs,
  defaultValue,
  children,
  onTabChange,
}: CategoryTabsProps) {
  return (
    <Tabs
      defaultValue={defaultValue || tabs[0]?.value}
      onValueChange={onTabChange}
      className="w-full"
    >
      <TabsList className="w-full justify-start overflow-x-auto" data-testid="category-tabs">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            data-testid={`tab-${tab.value}`}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className="mt-4">
          {children(tab.value)}
        </TabsContent>
      ))}
    </Tabs>
  );
}
