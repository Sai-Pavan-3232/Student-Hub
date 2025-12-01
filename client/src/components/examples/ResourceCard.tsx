import { ResourceCard } from "../ResourceCard";

export default function ResourceCardExample() {
  return (
    <div className="max-w-md">
      <ResourceCard
        id="1"
        title="Calculus Study Guide - Complete Notes"
        description="Comprehensive notes covering all topics from Calculus I and II. Includes examples, practice problems, and tips."
        category="Study Materials"
        fileType="PDF"
        rating={4.7}
        downloads={156}
        uploadedBy="Anonymous"
        onDownload={() => console.log("Download clicked")}
        onView={() => console.log("View clicked")}
      />
    </div>
  );
}
