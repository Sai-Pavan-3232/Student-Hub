import { ResourceCard } from "@/components/ResourceCard";
import { SearchBar } from "@/components/SearchBar";
import { UploadResourceDialog } from "@/components/UploadResourceDialog";
import { CategoryTabs } from "@/components/CategoryTabs";
import { useState } from "react";

// todo: remove mock functionality
const mockResources = [
  {
    id: "1",
    title: "Calculus Study Guide - Complete Notes",
    description: "Comprehensive notes covering all topics from Calculus I and II. Includes examples, practice problems, and tips.",
    category: "Study Materials",
    fileType: "PDF",
    rating: 4.7,
    downloads: 156,
    uploadedBy: "Anonymous",
  },
  {
    id: "2",
    title: "Time Management Strategies for Students",
    description: "A collection of proven techniques to manage your time effectively during the semester.",
    category: "Tips",
    fileType: "PDF",
    rating: 4.5,
    downloads: 89,
    uploadedBy: "Anonymous",
  },
  {
    id: "3",
    title: "Mindfulness Exercises for Stress Relief",
    description: "Simple exercises you can do between classes to reduce anxiety and improve focus.",
    category: "Mental Health",
    fileType: "PDF",
    rating: 4.9,
    downloads: 234,
    uploadedBy: "Anonymous",
  },
  {
    id: "4",
    title: "Data Structures Cheat Sheet",
    description: "Quick reference for common data structures with Big O notation and use cases.",
    category: "Study Materials",
    fileType: "PDF",
    rating: 4.8,
    downloads: 312,
    uploadedBy: "Anonymous",
  },
  {
    id: "5",
    title: "Essay Writing Template",
    description: "A structured template for academic essays with formatting guidelines.",
    category: "Academic Support",
    fileType: "DOCX",
    rating: 4.4,
    downloads: 178,
    uploadedBy: "Anonymous",
  },
  {
    id: "6",
    title: "Campus Mental Health Resources Guide",
    description: "Comprehensive list of on-campus and online mental health resources available to students.",
    category: "Mental Health",
    fileType: "PDF",
    rating: 4.6,
    downloads: 145,
    uploadedBy: "Anonymous",
  },
];

const tabs = [
  { value: "all", label: "All" },
  { value: "Study Materials", label: "Study Materials" },
  { value: "Tips", label: "Tips & Tricks" },
  { value: "Mental Health", label: "Mental Health" },
  { value: "Academic Support", label: "Academic Support" },
];

export default function Resources() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredResources = mockResources.filter((resource) => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || resource.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-4 md:p-6 pb-20 md:pb-6" data-testid="page-resources">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Resources</h1>
          <p className="text-muted-foreground mt-1">Study materials, guides, and helpful resources</p>
        </div>
        <UploadResourceDialog onSubmit={(data) => console.log("Resource uploaded:", data)} />
      </div>

      <div className="mb-4">
        <SearchBar
          placeholder="Search resources..."
          onSearch={setSearchQuery}
        />
      </div>

      <CategoryTabs
        tabs={tabs}
        defaultValue="all"
        onTabChange={setActiveCategory}
      >
        {() => (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResources.length > 0 ? (
              filteredResources.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  {...resource}
                  onDownload={() => console.log("Download:", resource.id)}
                  onView={() => console.log("View:", resource.id)}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                <p>No resources found matching your criteria.</p>
              </div>
            )}
          </div>
        )}
      </CategoryTabs>
    </div>
  );
}
